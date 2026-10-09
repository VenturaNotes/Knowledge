const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

module.exports = async ({ app, vault, workspace }) => {
    const activeLeaf = workspace.activeLeaf;
    const activeTab = activeLeaf?.activeTab;

    if (!activeTab) {
        app.notify({ title: "Copy File", body: "No active tab open in workspace", type: "warning" });
        return;
    }

    // Flush pending editor changes if editing a text note
    if (activeTab.editor && typeof activeTab.editor.flush === 'function') {
        activeTab.editor.flush();
    }

    let absoluteFilePath = null;

    if (activeTab.filePath && vault.path) {
        // Markdown (.md, .mdenc), PDF (.pdf), scripts (.js), etc.
        absoluteFilePath = path.isAbsolute(activeTab.filePath)
            ? activeTab.filePath
            : path.join(vault.path, activeTab.filePath);
    } else if (activeTab.url && activeTab.url.startsWith('file://')) {
        // Images viewed in WebViewer tabs
        try {
            absoluteFilePath = decodeURIComponent(new URL(activeTab.url).pathname);
        } catch (_) {
            absoluteFilePath = null;
        }
    }

    if (!absoluteFilePath || !fs.existsSync(absoluteFilePath)) {
        app.notify({ title: "Copy File", body: "Active tab does not contain a file on disk", type: "warning" });
        return;
    }

    const originalName = path.basename(absoluteFilePath);

    // 1. Prompt user via built-in app.prompt (returns null on Escape/Cancel)
    const requestedName = await app.prompt('Copy File to Clipboard As:', originalName, 'Filename and extension...');

    if (!requestedName) {
        return;
    }

    let trimmedName = requestedName.trim();
    if (!trimmedName) {
        app.notify({ title: "Copy File", body: "Filename cannot be empty", type: "error" });
        return;
    }

    // Preserve original extension if omitted
    const originalExt = path.extname(originalName);
    const userExt = path.extname(trimmedName);
    if (!userExt && originalExt) {
        trimmedName += originalExt;
    }

    let finalPath = absoluteFilePath;

    // 2. If renamed, create a temporary file copy under the requested name
    if (trimmedName !== originalName) {
        const tempDir = path.join(os.tmpdir(), 'mirage-clipboard-temp');
        try {
            fs.mkdirSync(tempDir, { recursive: true });
            finalPath = path.join(tempDir, trimmedName);
            fs.copyFileSync(absoluteFilePath, finalPath);
        } catch (err) {
            console.error('[CopyFileToClipboard] Temp file copy failed:', err);
            app.notify({ title: "Copy File", body: "Could not create temporary file", type: "error" });
            return;
        }
    }

    // 3. Inject native POSIX file reference into macOS pasteboard
    const escapedPath = finalPath.replace(/"/g, '\\"');
    const appleScript = `
        set the clipboard to "" 
        delay 0.05
        set theFile to (POSIX file "${escapedPath}")
        set the clipboard to theFile
        delay 0.05
    `;

    const safeAppleScript = appleScript.replace(/'/g, "'\\''");

    exec(`osascript -e '${safeAppleScript}'`, (err) => {
        if (err) {
            console.error('[CopyFileToClipboard] AppleScript Error:', err);
            app.notify({ title: "Clipboard Error", body: "Failed to copy file to clipboard", type: "error" });
        } else {
            app.notify({ 
                title: "File Copied", 
                body: `📋 Copied "${trimmedName}" to system clipboard`, 
                type: "success" 
            });
        }
    });
};