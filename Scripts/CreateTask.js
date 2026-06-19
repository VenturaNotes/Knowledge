module.exports = async ({ app, obsidian }) => {
    const { Modal, Setting, Notice } = obsidian;

    // Define the interactive modal UI
    class CreateTaskModal extends Modal {
        constructor(app, onSubmit) {
            super(app);
            this.onSubmit = onSubmit;
            this.title = "";
            this.folder = "Private/Tasks"; // Default path
        }

        onOpen() {
            const { contentEl } = this;
            contentEl.createEl('h3', { text: 'Create New Task Note', attr: { style: 'margin-top: 0;' } });

            new Setting(contentEl)
                .setName('Note name')
                .setDesc('Enter the title of the new note')
                .addText(text => {
                    text.setPlaceholder('Task title')
                        .onChange(val => this.title = val.trim());
                    
                    // Allow submitting directly with the Enter key
                    text.inputEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.submit();
                        }
                    });
                    
                    // Autofocus the title input
                    setTimeout(() => text.inputEl.focus(), 50);
                });

            new Setting(contentEl)
                .setName('Folder path')
                .setDesc('Vault-relative folder location')
                .addText(text => {
                    text.setValue(this.folder)
                        .setPlaceholder('Private/Tasks')
                        .onChange(val => this.folder = val.trim());
                    
                    text.inputEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.submit();
                        }
                    });
                });

            new Setting(contentEl)
                .addButton(btn => btn
                    .setButtonText('Create')
                    .setCta()
                    .onClick(() => this.submit())
                );
        }

        submit() {
            if (!this.title) {
                new Notice("Please provide a name for the note.");
                return;
            }
            this.onSubmit(this.title, this.folder || "Private/Tasks");
            this.close();
        }

        onClose() {
            this.contentEl.empty();
        }
    }

    // Wrap modal callback in a Promise to await user input
    const promptUser = () => {
        return new Promise((resolve) => {
            let submitted = false;
            const modal = new CreateTaskModal(app, (title, folder) => {
                submitted = true;
                resolve({ title, folder });
            });
            
            const originalOnClose = modal.onClose.bind(modal);
            modal.onClose = () => {
                originalOnClose();
                if (!submitted) resolve(null);
            };
            
            modal.open();
        });
    };

    const result = await promptUser();
    if (!result) return;

    const { title, folder } = result;

    // Normalize folder path string (clean up slashes)
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
    
    try {
        // Recursively build folders if they do not exist
        if (normalizedFolder) {
            const parts = normalizedFolder.split('/');
            let currentPath = '';
            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}/${part}` : part;
                const folderExists = app.vault.getAbstractFileByPath(currentPath);
                if (!folderExists) {
                    await app.vault.createFolder(currentPath);
                }
            }
        }

        // Define full file path
        const filePath = normalizedFolder ? `${normalizedFolder}/${title}.md` : `${title}.md`;

        // Check for file collisions
        const fileExists = app.vault.getAbstractFileByPath(filePath);
        if (fileExists) {
            new Notice(`Error: File already exists at "${filePath}"`);
            return;
        }

        // Note template content
        const fileContent = `---
status: open
tags:
  - task
---
`;

        // Create the physical file in the vault and open it in a new tab
        const newFile = await app.vault.create(filePath, fileContent);
        const leaf = app.workspace.getLeaf('tab');
        await leaf.openFile(newFile);

    } catch (error) {
        console.error("Error creating new task note:", error);
        new Notice("Failed to create note. See console for error details.");
    }
};