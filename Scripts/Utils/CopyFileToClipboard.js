const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

module.exports = async ({ app, obsidian }) => {
    const { Modal, Setting, Notice } = obsidian;

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("❌ No active file found");
        return;
    }

    const originalName = activeFile.name;

    // Custom Obsidian input modal since QuickAdd is not being used
    class RenameModal extends Modal {
        constructor(app, defaultValue, onSubmit, onCancel) {
            super(app);
            this.defaultValue = defaultValue;
            this.onSubmit = onSubmit;
            this.onCancel = onCancel;
            this.submitted = false;
            this.result = defaultValue;
        }

        onOpen() {
            const { contentEl } = this;
            contentEl.createEl("h2", { text: "Copy file to clipboard as:" });

            let inputEl;
            new Setting(contentEl)
                .setName("Filename and extension")
                .addText((text) => {
                    inputEl = text.inputEl;
                    text.setValue(this.defaultValue);
                    text.onChange((value) => {
                        this.result = value;
                    });

                    // Pressing Enter will submit the prompt
                    inputEl.addEventListener("keydown", (event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            this.submitted = true;
                            this.onSubmit(this.result);
                            this.close();
                        }
                    });
                });

            new Setting(contentEl)
                .addButton((btn) =>
                    btn
                        .setButtonText("Copy")
                        .setCta()
                        .onClick(() => {
                            this.submitted = true;
                            this.onSubmit(this.result);
                            this.close();
                        })
                )
                .addButton((btn) =>
                    btn
                        .setButtonText("Cancel")
                        .onClick(() => {
                            this.close();
                        })
                );

            // Auto-focus and highlight the text so you can quickly press enter or overwrite it
            if (inputEl) {
                setTimeout(() => {
                    inputEl.focus();
                    inputEl.select();
                }, 50);
            }
        }

        onClose() {
            const { contentEl } = this;
            contentEl.empty();
            if (!this.submitted) {
                this.onCancel();
            }
        }
    }

    // Wrap the modal lifecycle in a Promise to await user input inside the async function
    const promptRename = (defaultValue) => {
        return new Promise((resolve) => {
            const modal = new RenameModal(
                app,
                defaultValue,
                (result) => resolve(result),
                () => resolve(null)
            );
            modal.open();
        });
    };

    const newFileName = await promptRename(originalName);

    // If the user cancelled or closed the modal without submitting
    if (newFileName === null) {
        new Notice("📋 Copy cancelled");
        return;
    }

    const trimmedName = newFileName.trim();
    if (!trimmedName) {
        new Notice("❌ Invalid filename");
        return;
    }

    // Resolve the system file path of the original file
    const rawPath = app.vault.adapter.getFullPath(activeFile.path);
    let finalPath = rawPath;

    // If renamed, copy it to a temp folder under the new name before putting it on the clipboard
    if (trimmedName !== originalName) {
        const tempDir = path.join(os.tmpdir(), "obsidian-clipboard-temp");
        try {
            fs.mkdirSync(tempDir, { recursive: true });
            finalPath = path.join(tempDir, trimmedName);
            fs.copyFileSync(rawPath, finalPath);
        } catch (err) {
            console.error("Failed to copy temporary file:", err);
            new Notice("❌ Error copying file to temp directory");
            return;
        }
    }

    // Escape double quotes for AppleScript path string
    const escapedPath = finalPath.replace(/"/g, '\\"');

    const appleScript = `
        set the clipboard to "" 
        delay 0.1
        set theFile to (POSIX file "${escapedPath}")
        set the clipboard to theFile
        delay 0.1
    `;

    // Escape single quotes for bash/zsh shell wrapping safety
    const safeAppleScript = appleScript.replace(/'/g, "'\\''");

    exec(`osascript -e '${safeAppleScript}'`, (err) => {
        if (err) {
            console.error(err);
            new Notice("❌ Clipboard Error");
        } else {
            new Notice(`📋 Ready: ${trimmedName}`);
        }
    });
};