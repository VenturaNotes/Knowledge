module.exports = async (params) => {
    const activeFile = app.workspace.getActiveFile();
    
    if (!activeFile) {
        new Notice("❌ No active file found");
        return;
    }

    // Get the full system path and escape double quotes for AppleScript
    const rawPath = app.vault.adapter.getFullPath(activeFile.path);
    const escapedPath = rawPath.replace(/"/g, '\\"');

    // More robust AppleScript: 
    // 1. Clear clipboard 
    // 2. Set the clipboard specifically to a file object
    // 3. Brief delay to ensure registration
    const appleScript = `
        set the clipboard to "" 
        delay 0.1
        set theFile to (POSIX file "${escapedPath}")
        set the clipboard to theFile
        delay 0.1
    `;

    const { exec } = require('child_process');

    exec(`osascript -e '${appleScript}'`, (err) => {
        if (err) {
            console.error(err);
            new Notice("❌ Clipboard Error");
        } else {
            // Include the filename in the notice so you know it worked
            new Notice(`📋 Ready: ${activeFile.name}`);
        }
    });
};