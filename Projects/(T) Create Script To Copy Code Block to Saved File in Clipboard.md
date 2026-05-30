---
status: done
priority: "0"
dateCreated: 2026-05-28T21:57:53.583-04:00
dateModified: 2026-05-28T22:02:42.156-04:00
reminders:
  - id: rem_1780019844101_dfl6gtqo2
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-05-28
---
## Potential Problems
- [ ] Currently there is a file called `obsidian_last_code_temp.txt` which references the temp file saved. If `obsidian_last_code_temp.txt` is deleted first, does this mean we have no reference to the other temp file saved and just have to trust that the computer cleans it up? Would that become a problem?
## Versions
### V2
- This solution is a bit better. It creates the desired file in a temporary directory which is reliably saved to your clipboard. 
```javascript
const { Modal, Setting, Notice, Platform } = require("obsidian");

// Dynamic imports of Node.js modules for compatibility on Mobile devices
const os = Platform.isDesktop ? require("os") : null;
const path = Platform.isDesktop ? require("path") : null;
const fs = Platform.isDesktop ? require("fs") : null;
const { execFile } = Platform.isDesktop ? require("child_process") : {};

// Mapping of common codeblock language tags to standard file extensions
const extensionMap = {
    "python": "py", "py": "py",
    "javascript": "js", "js": "js",
    "typescript": "ts", "ts": "ts",
    "html": "html", "css": "css",
    "json": "json", "markdown": "md",
    "md": "md", "rust": "rs", "rs": "rs",
    "golang": "go", "go": "go",
    "c++": "cpp", "cpp": "cpp",
    "c": "c", "csharp": "cs", "cs": "cs",
    "java": "java", "bash": "sh", "sh": "sh",
    "shell": "sh", "powershell": "ps1", "ps1": "ps1",
    "yaml": "yaml", "yml": "yaml",
    "ruby": "rb", "rb": "rb", "php": "php", "sql": "sql"
};

// Native Obsidian Modal to prompt the user for a file name
class FilenameModal extends Modal {
    constructor(app, defaultName, extension, onSubmit) {
        super(app);
        this.defaultName = defaultName;
        this.extension = extension;
        this.onSubmit = onSubmit;
        this.filename = defaultName;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl("h3", { text: "Save Code Block as File" });
        
        new Setting(contentEl)
            .setName("File name")
            .setDesc(`Saves as {name}.${this.extension} unless you specify your own (e.g. filename.py)`)
            .addText((text) => {
                text.setValue(this.defaultName)
                    .onChange((value) => {
                        this.filename = value;
                    });
                
                const inputEl = text.inputEl;
                inputEl.style.width = "100%";
                
                // Automatically focus and select text in the input box
                setTimeout(() => {
                    inputEl.focus();
                    inputEl.select();
                }, 50);
                
                inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Stop Enter key propagation
                        this.submit();
                    }
                });
            });

        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Cancel")
                    .onClick(() => {
                        this.close();
                    });
            })
            .addButton((btn) => {
                btn.setButtonText("Copy File")
                    .setCta()
                    .onClick(() => {
                        this.submit();
                    });
            });
    }

    submit() {
        if (this.filename && this.filename.trim()) {
            this.onSubmit(this.filename.trim());
            this.close();
        } else {
            new Notice("Please enter a valid file name.");
        }
    }
}

// Platform-specific file copy execution
// No delays needed — writeFileSync guarantees the file exists on disk
// before this function is ever called.
const copyFileToClipboard = (tempFilePath) => {
    return new Promise((resolve, reject) => {
        const platform = os.platform();
        
        if (platform === "win32") {
            const escapedPath = tempFilePath.replace(/'/g, "''");
            const powershellCmd = `Add-Type -AssemblyName System.Windows.Forms; $files = [System.Collections.Specialized.StringCollection]::new(); [void]$files.Add('${escapedPath}'); [System.Windows.Forms.Clipboard]::SetFileDropList($files)`;
            
            execFile("powershell.exe", ["-NoProfile", "-Command", powershellCmd], { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
        } else if (platform === "darwin") {
            // execFile passes args directly — no shell interpolation, no injection risk
            // Single-line AppleScript: no delays needed since file is already on disk
            const appleScript = `set the clipboard to (POSIX file "${tempFilePath.replace(/"/g, '\\"')}")`;

            execFile("osascript", ["-e", appleScript], { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
        } else if (platform === "linux") {
            const child = execFile("xclip", ["-selection", "clipboard", "-t", "text/uri-list"], { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
            child.stdin.write(`file://${tempFilePath}`);
            child.stdin.end();
        } else {
            reject(new Error(`Unsupported OS platform: ${platform}`));
        }
    });
};

// Cleans up the temp file from the previous run using a stable tracking file.
// The tracking file's name never changes — it's the persistent memory between runs.
// Its contents are the full path of whatever temp file was created last run.
// The tracking file itself is never deleted — it gets overwritten each run.
const cleanupPreviousTempFile = (trackingFilePath) => {
    if (fs.existsSync(trackingFilePath)) {
        try {
            const lastTempPath = fs.readFileSync(trackingFilePath, "utf8").trim();
            if (lastTempPath && fs.existsSync(lastTempPath)) {
                fs.unlinkSync(lastTempPath); // delete e.g. Hello.py
            }
        } catch (_) {
            // Non-fatal — if cleanup fails, the OS will evict it eventually
        }
    }
};

// Asynchronous callback to handle the file generation and copy operations
const handleFileCopy = async (filename, extension, codeText) => {
    // Parse custom extension if provided by the user
    let finalFilename = filename;
    let finalExtension = extension;
    
    const extMatch = filename.match(/(.+)\.([a-zA-Z0-9]+)$/);
    if (extMatch) {
        finalFilename = extMatch[1].trim();
        finalExtension = extMatch[2].trim().toLowerCase();
    }
    
    // Sanitize base filename to avoid OS-level file creation errors
    const sanitizedFilename = finalFilename.replace(/[^a-zA-Z0-9_\-\s\.]/g, "");
    if (!sanitizedFilename) {
        new Notice("Invalid file name.");
        return;
    }
    
    if (!Platform.isDesktop) {
        await navigator.clipboard.writeText(codeText);
        new Notice("Copied code as text (File copy only supported on Desktop).");
        return;
    }
    
    try {
        const tempDir = os.tmpdir();
        const trackingFilePath = path.join(tempDir, "obsidian_last_code_temp.txt");
        const tempFilePath = path.join(tempDir, `${sanitizedFilename}.${finalExtension}`);

        // Delete the temp file from the previous run before writing the new one
        cleanupPreviousTempFile(trackingFilePath);

        // writeFileSync blocks until the kernel confirms the write —
        // the file is guaranteed on disk before copyFileToClipboard runs
        fs.writeFileSync(tempFilePath, codeText, "utf8");

        // Record the new temp file path so the next run can clean it up
        fs.writeFileSync(trackingFilePath, tempFilePath, "utf8");

        // Copy the temporary file to the OS clipboard
        await copyFileToClipboard(tempFilePath);
        new Notice(`📋 Ready: ${sanitizedFilename}.${finalExtension}`);
    } catch (err) {
        console.error("Failed to copy code block as file:", err);
        await navigator.clipboard.writeText(codeText);
        new Notice(`Copied as plain text (File copy failed: ${err.message})`);
    }
};

module.exports = (params) => {
    const { app } = params;
    
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf || activeLeaf.view.getViewType() !== "markdown") {
        new Notice("No active markdown editor found.");
        return;
    }
    
    const editor = activeLeaf.view.editor;
    const cursor = editor.getCursor();
    const currentLine = cursor.line;
    
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return;
    
    const fileCache = app.metadataCache.getFileCache(activeFile);
    if (!fileCache || !fileCache.sections) {
        new Notice("Unable to read document structure.");
        return;
    }
    
    const currentCodeSection = fileCache.sections.find(section => {
        return section.type === "code" && 
               currentLine >= section.position.start.line && 
               currentLine <= section.position.end.line;
    });
    
    if (!currentCodeSection) {
        new Notice("Cursor is not inside a code block.");
        return;
    }
    
    const startLine = currentCodeSection.position.start.line;
    const endLine = currentCodeSection.position.end.line;
    
    // Extract language definition from markdown block
    const startLineText = editor.getLine(startLine);
    const langMatch = startLineText.match(/^```([a-zA-Z0-9_\-\+]+)/);
    const lang = langMatch ? langMatch[1] : "";
    
    let extension = "txt";
    if (lang) {
        const cleanLang = lang.toLowerCase().trim();
        extension = extensionMap[cleanLang] || (cleanLang.match(/^[a-zA-Z0-9]+$/) ? cleanLang : "txt");
    }
    
    // Guard against truly empty blocks where fences are on adjacent lines (no content between them).
    // startLine + 1 === endLine means the opening and closing fences are adjacent.
    if (startLine + 1 === endLine) {
        new Notice("Code block is empty.");
        return;
    }

    const codeText = editor.getRange(
        { line: startLine + 1, ch: 0 },
        { line: endLine - 1, ch: editor.getLine(endLine - 1).length }
    );
    
    const defaultFilename = activeFile.basename ? `${activeFile.basename}_code` : "script";
    
    // Delaying the modal opening slightly allows the "Script Palette" suggest modal 
    // to finish closing and cleanly focus the editor first. This avoids keyboard 
    // event leakage and prevents empty lines from being added to your document.
    setTimeout(() => {
        new FilenameModal(app, defaultFilename, extension, (filename) => {
            handleFileCopy(filename, extension, codeText);
        }).open();
    }, 150);
};
```
### V1
- Has about a 150ms timeout so computer can't have too many backend processes running
```javascript
const { Modal, Setting, Notice, Platform } = require("obsidian");

// Dynamic imports of Node.js modules for compatibility on Mobile devices
const os = Platform.isDesktop ? require("os") : null;
const path = Platform.isDesktop ? require("path") : null;
const fs = Platform.isDesktop ? require("fs") : null;
const { execFile } = Platform.isDesktop ? require("child_process") : {};

// Mapping of common codeblock language tags to standard file extensions
const extensionMap = {
    "python": "py", "py": "py",
    "javascript": "js", "js": "js",
    "typescript": "ts", "ts": "ts",
    "html": "html", "css": "css",
    "json": "json", "markdown": "md",
    "md": "md", "rust": "rs", "rs": "rs",
    "golang": "go", "go": "go",
    "c++": "cpp", "cpp": "cpp",
    "c": "c", "csharp": "cs", "cs": "cs",
    "java": "java", "bash": "sh", "sh": "sh",
    "shell": "sh", "powershell": "ps1", "ps1": "ps1",
    "yaml": "yaml", "yml": "yaml",
    "ruby": "rb", "rb": "rb", "php": "php", "sql": "sql"
};

// Native Obsidian Modal to prompt the user for a file name
class FilenameModal extends Modal {
    constructor(app, defaultName, extension, onSubmit) {
        super(app);
        this.defaultName = defaultName;
        this.extension = extension;
        this.onSubmit = onSubmit;
        this.filename = defaultName;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl("h3", { text: "Save Code Block as File" });
        
        new Setting(contentEl)
            .setName("File name")
            .setDesc(`Saves as {name}.${this.extension} unless you specify your own (e.g. filename.py)`)
            .addText((text) => {
                text.setValue(this.defaultName)
                    .onChange((value) => {
                        this.filename = value;
                    });
                
                const inputEl = text.inputEl;
                inputEl.style.width = "100%";
                
                // Automatically focus and select text in the input box
                setTimeout(() => {
                    inputEl.focus();
                    inputEl.select();
                }, 50);
                
                inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Stop Enter key propagation
                        this.submit();
                    }
                });
            });

        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Cancel")
                    .onClick(() => {
                        this.close();
                    });
            })
            .addButton((btn) => {
                btn.setButtonText("Copy File")
                    .setCta()
                    .onClick(() => {
                        this.submit();
                    });
            });
    }

    submit() {
        if (this.filename && this.filename.trim()) {
            this.onSubmit(this.filename.trim());
            this.close();
        } else {
            new Notice("Please enter a valid file name.");
        }
    }
}

// Platform-specific file copy execution
const copyFileToClipboard = (tempFilePath) => {
    return new Promise((resolve, reject) => {
        const platform = os.platform();
        
        if (platform === "win32") {
            const escapedPath = tempFilePath.replace(/'/g, "''");
            const powershellCmd = `Add-Type -AssemblyName System.Windows.Forms; $files = [System.Collections.Specialized.StringCollection]::new(); [void]$files.Add('${escapedPath}'); [System.Windows.Forms.Clipboard]::SetFileDropList($files)`;
            
            execFile("powershell.exe", ["-NoProfile", "-Command", powershellCmd], (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
        } else if (platform === "darwin") {
            const escapedPath = tempFilePath.replace(/"/g, '\\"');
            
            const appleScript = `
                set the clipboard to "" 
                delay 0.1
                set theFile to (POSIX file "${escapedPath}")
                set the clipboard to theFile
                delay 0.1
            `;
            
            execFile("osascript", ["-e", appleScript], (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
        } else if (platform === "linux") {
            const child = execFile("xclip", ["-selection", "clipboard", "-t", "text/uri-list"], (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
            child.stdin.write(`file://${tempFilePath}`);
            child.stdin.end();
        } else {
            reject(new Error(`Unsupported OS platform: ${platform}`));
        }
    });
};

// Asynchronous callback to handle the file generation and copy operations
const handleFileCopy = async (filename, extension, codeText) => {
    // Parse custom extension if provided by the user (Requirement 1)
    let finalFilename = filename;
    let finalExtension = extension;
    
    const extMatch = filename.match(/(.+)\.([a-zA-Z0-9]+)$/);
    if (extMatch) {
        finalFilename = extMatch[1].trim();
        finalExtension = extMatch[2].trim().toLowerCase();
    }
    
    // Sanitize base filename to avoid OS-level file creation errors
    const sanitizedFilename = finalFilename.replace(/[^a-zA-Z0-9_\-\s\.]/g, "");
    if (!sanitizedFilename) {
        new Notice("Invalid file name.");
        return;
    }
    
    if (!Platform.isDesktop) {
        await navigator.clipboard.writeText(codeText);
        new Notice("Copied code as text (File copy only supported on Desktop).");
        return;
    }
    
    try {
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `${sanitizedFilename}.${finalExtension}`);
        
        // Write the file locally inside the operating system's temporary directory
        fs.writeFileSync(tempFilePath, codeText, "utf8");
        
        // Copy the temporary file to the OS clipboard
        await copyFileToClipboard(tempFilePath);
        new Notice(`📋 Ready: ${sanitizedFilename}.${finalExtension}`);
    } catch (err) {
        console.error("Failed to copy code block as file:", err);
        await navigator.clipboard.writeText(codeText);
        new Notice(`Copied as plain text (File copy failed: ${err.message})`);
    }
};

module.exports = (params) => {
    const { app } = params;
    
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf || activeLeaf.view.getViewType() !== "markdown") {
        new Notice("No active markdown editor found.");
        return;
    }
    
    const editor = activeLeaf.view.editor;
    const cursor = editor.getCursor();
    const currentLine = cursor.line;
    
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return;
    
    const fileCache = app.metadataCache.getFileCache(activeFile);
    if (!fileCache || !fileCache.sections) {
        new Notice("Unable to read document structure.");
        return;
    }
    
    const currentCodeSection = fileCache.sections.find(section => {
        return section.type === "code" && 
               currentLine >= section.position.start.line && 
               currentLine <= section.position.end.line;
    });
    
    if (!currentCodeSection) {
        new Notice("Cursor is not inside a code block.");
        return;
    }
    
    const startLine = currentCodeSection.position.start.line;
    const endLine = currentCodeSection.position.end.line;
    
    // Extract language definition from markdown block
    const startLineText = editor.getLine(startLine);
    const langMatch = startLineText.match(/^```([a-zA-Z0-9_\-\+]+)/);
    const lang = langMatch ? langMatch[1] : "";
    
    let extension = "txt";
    if (lang) {
        const cleanLang = lang.toLowerCase().trim();
        extension = extensionMap[cleanLang] || (cleanLang.match(/^[a-zA-Z0-9]+$/) ? cleanLang : "txt");
    }
    
    let codeText = "";
    if (startLine + 1 < endLine) {
        codeText = editor.getRange(
            { line: startLine + 1, ch: 0 }, 
            { line: endLine - 1, ch: editor.getLine(endLine - 1).length }
        );
    }
    
    const defaultFilename = activeFile.basename ? `${activeFile.basename}_code` : "script";
    
    // Delaying the modal opening slightly allows the "Script Palette" suggest modal 
    // to finish closing and cleanly focus the editor first. This avoids keyboard 
    // event leakage and prevents empty lines from being added to your document.
    setTimeout(() => {
        new FilenameModal(app, defaultFilename, extension, (filename) => {
            handleFileCopy(filename, extension, codeText);
        }).open();
    }, 150);
};
```