// Copies the target file itself to your system clipboard (not its text content)
// Usage: copyFile <filename>
const { spawn } = require('child_process');
const os = require('os');

const filePath = path.resolve(currentDir, args[0] || '');

if (!fs.existsSync(filePath)) {
    terminal.write("\r\nError: File not found: " + filePath);
    return;
}

const platform = os.platform();

// We wrap the async spawn execution in a Promise and await it.
// This guarantees the terminal waits for the copy operation to finish before printing the next prompt.
await new Promise((resolve) => {
    if (platform === 'darwin') {
        // macOS: Copy the file to clipboard using AppleScript POSIX file conversion
        const escapedPath = filePath.replace(/"/g, '\\"');
        const appleScript = `
            set the clipboard to "" 
            delay 0.1
            set theFile to (POSIX file "${escapedPath}")
            set the clipboard to theFile
            delay 0.1
        `;

        const child = spawn('osascript');
        child.stdin.write(appleScript);
        child.stdin.end();

        child.on('close', (code) => {
            if (code === 0) {
                terminal.write("\r\nCopied " + path.basename(filePath) + " to clipboard as a file object.");
            } else {
                terminal.write("\r\nError: AppleScript failed to copy file to clipboard.");
            }
            resolve(); // Signals that the script is fully finished
        });

    } else if (platform === 'win32') {
        // Windows: Copy the file to clipboard using PowerShell's Set-Clipboard
        const escapedPath = filePath.replace(/"/g, '`"');
        const child = spawn('powershell.exe', ['-Command', `Set-Clipboard -Path "${escapedPath}"`]);

        child.on('close', (code) => {
            if (code === 0) {
                terminal.write("\r\nCopied " + path.basename(filePath) + " to clipboard as a file object.");
            } else {
                terminal.write("\r\nError: PowerShell failed to copy file to clipboard.");
            }
            resolve(); // Signals that the script is fully finished
        });

    } else {
        terminal.write("\r\nError: File-level clipboard copy is currently only supported on macOS and Windows.");
        resolve();
    }
});