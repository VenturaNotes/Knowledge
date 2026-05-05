module.exports = async (params) => {
    const activeFile = app.workspace.getActiveFile();
    
    if (!activeFile) {
        new Notice("No active file found");
        return;
    }

    // Get the full system path
    const filePath = app.vault.adapter.getFullPath(activeFile.path);

    // AppleScript to put the file object onto the clipboard
    const appleScript = `osascript -e 'set the clipboard to (POSIX file "${filePath}")'`;

    const { exec } = require('child_process');

    exec(appleScript, (err) => {
        if (err) {
            new Notice("Error: " + err);
        } else {
            new Notice(`📋 "${activeFile.name}" ready to paste`);
        }
    });
};