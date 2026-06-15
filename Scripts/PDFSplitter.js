const { Modal, Setting, Notice, Platform } = require("obsidian");

// Dynamic imports of Node.js modules for compatibility on Mobile devices
const os = Platform.isDesktop ? require("os") : null;
const path = Platform.isDesktop ? require("path") : null;
const fs = Platform.isDesktop ? require("fs") : null;
const { execFile } = Platform.isDesktop ? require("child_process") : {};

// Helper to asynchronously load pdf-lib from a CDN
async function loadPdfLib() {
    if (window.PDFLib) return window.PDFLib;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
        script.onload = () => resolve(window.PDFLib);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Parse string formats like "15-24", "1, 3, 5-7" into 0-indexed page integers
function parseRange(input, maxPages) {
    const range = [];
    const parts = input.split(',').map(p => p.trim());
    for (const part of parts) {
        if (part.includes('-')) {
            const [startStr, endStr] = part.split('-');
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
                return null;
            }
            for (let i = start; i <= end; i++) {
                range.push(i - 1); // 0-indexed for pdf-lib
            }
        } else {
            const page = parseInt(part, 10);
            if (isNaN(page) || page < 1 || page > maxPages) {
                return null;
            }
            range.push(page - 1);
        }
    }
    return range;
}

// Native Obsidian Modal to ask the user for a page range
class PageRangeModal extends Modal {
    constructor(app, totalPages, onSubmit) {
        super(app);
        this.totalPages = totalPages;
        this.onSubmit = onSubmit;
        this.rangeInput = "15-24"; // Default suggested page range
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl("h3", { text: "Extract PDF Pages" });
        contentEl.createEl("p", { 
            text: `Enter the pages to extract (Total pages: ${this.totalPages}).`,
            attr: { style: "color: var(--text-muted); margin-bottom: 8px;" }
        });
        contentEl.createEl("p", { 
            text: `Examples: "15-24", "3", or "1, 5, 15-24"`,
            attr: { style: "color: var(--text-muted); font-size: 0.9em; margin-bottom: 16px;" }
        });

        new Setting(contentEl)
            .setName("Page range")
            .addText((text) => {
                text.setValue(this.rangeInput)
                    .onChange((value) => {
                        this.rangeInput = value;
                    });
                
                const inputEl = text.inputEl;
                inputEl.style.width = "100%";
                
                setTimeout(() => {
                    inputEl.focus();
                    inputEl.select();
                }, 50);

                inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
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
                btn.setButtonText("Extract & Copy")
                    .setCta()
                    .onClick(() => {
                        this.submit();
                    });
            });
    }

    submit() {
        if (this.rangeInput && this.rangeInput.trim()) {
            this.onSubmit(this.rangeInput.trim());
            this.close();
        } else {
            new Notice("Please enter a valid page range.");
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
            
            execFile("powershell.exe", ["-NoProfile", "-Command", powershellCmd], { timeout: 5000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve();
                }
            });
        } else if (platform === "darwin") {
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

// Removes the temp PDF file generated in the previous run
const cleanupPreviousTempFile = (trackingFilePath) => {
    if (fs.existsSync(trackingFilePath)) {
        try {
            const lastTempPath = fs.readFileSync(trackingFilePath, "utf8").trim();
            if (lastTempPath && fs.existsSync(lastTempPath)) {
                fs.unlinkSync(lastTempPath);
            }
        } catch (_) {
            // Non-fatal fallback
        }
    }
};

// Fallback logic for mobile platforms
async function saveToVaultFallback(app, baseName, bytes, range) {
    const cleanRange = range.replace(/[^a-zA-Z0-9-_]/g, '_');
    const folderPath = "Extracted PDFs";
    const fileName = `${baseName}_pages_${cleanRange}.pdf`;
    const fullPath = `${folderPath}/${fileName}`;

    if (!app.vault.getAbstractFileByPath(folderPath)) {
        await app.vault.createFolder(folderPath);
    }

    const existingFile = app.vault.getAbstractFileByPath(fullPath);
    if (existingFile) {
        await app.vault.modifyBinary(existingFile, bytes);
    } else {
        await app.vault.createBinary(fullPath, bytes);
    }

    new Notice(`⚠️ Saved to your vault at "${fullPath}" (Clipboard copy unsupported on this device).`);
}

// Entry point matching your ScriptRunner parameter format
module.exports = async (params) => {
    const { app } = params;

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile || activeFile.extension !== "pdf") {
        new Notice("❌ Please open a PDF file in Obsidian first!");
        return;
    }

    const arrayBuffer = await app.vault.readBinary(activeFile);
    
    new Notice("⏳ Loading PDF engine...");
    let PDFLib;
    try {
        PDFLib = await loadPdfLib();
    } catch (e) {
        new Notice("❌ Failed to load PDF library from CDN.");
        console.error(e);
        return;
    }

    let originalPdf;
    try {
        originalPdf = await PDFLib.PDFDocument.load(arrayBuffer);
    } catch (e) {
        new Notice("❌ Failed to parse PDF document.");
        console.error(e);
        return;
    }
    
    const totalPages = originalPdf.getPageCount();

    // Trigger the selection prompt
    new PageRangeModal(app, totalPages, async (rangeInput) => {
        const pageIndices = parseRange(rangeInput, totalPages);
        if (!pageIndices || pageIndices.length === 0) {
            new Notice("❌ Invalid page range format or page numbers are out of range.");
            return;
        }

        const extractionNotice = new Notice("⏳ Extracting pages...", 0);
        try {
            const newPdf = await PDFLib.PDFDocument.create();
            const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            extractionNotice.hide();

            if (Platform.isDesktop) {
                try {
                    const tempDir = os.tmpdir();
                    const trackingFilePath = path.join(tempDir, "obsidian_last_pdf_temp.txt");
                    
                    const cleanName = activeFile.basename.replace(/[^a-zA-Z0-9-_ ]/g, '');
                    const cleanRange = rangeInput.replace(/[^a-zA-Z0-9-_]/g, '_');
                    const tempFileName = `${cleanName}_extracted_${cleanRange}.pdf`;
                    const tempFilePath = path.join(tempDir, tempFileName);

                    // Deletes the older extracted file before generating the new one
                    cleanupPreviousTempFile(trackingFilePath);

                    // Write output PDF bytes
                    fs.writeFileSync(tempFilePath, Buffer.from(pdfBytes));

                    // Write tracking file with the new path
                    fs.writeFileSync(trackingFilePath, tempFilePath, "utf8");

                    // Copy the file reference directly onto the OS clipboard
                    await copyFileToClipboard(tempFilePath);
                    new Notice(`📋 Pages ${rangeInput} copied to clipboard as a file!`);
                } catch (desktopErr) {
                    console.error("Desktop operations failed: ", desktopErr);
                    await saveToVaultFallback(app, activeFile.basename, pdfBytes, rangeInput);
                }
            } else {
                // Fallback directory creation inside vault for mobile devices
                await saveToVaultFallback(app, activeFile.basename, pdfBytes, rangeInput);
            }
        } catch (err) {
            extractionNotice.hide();
            new Notice("❌ PDF extraction failed.");
            console.error(err);
        }
    }).open();
};