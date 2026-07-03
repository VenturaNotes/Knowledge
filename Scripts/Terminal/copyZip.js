// Copies a zipped version of the target file or folder to your system clipboard
// Usage: copyZip <filename_or_directory>
const { spawn } = require('child_process');
const os = require('os');

// Fallback safety to ensure fs and path are available
const _fs = typeof fs !== 'undefined' ? fs : require('fs');
const _path = typeof path !== 'undefined' ? path : require('path');

const filePath = _path.resolve(currentDir, args[0] || '');

if (!_fs.existsSync(filePath)) {
    terminal.write("\r\nError: File or folder not found: " + filePath);
    return;
}

const stats = _fs.statSync(filePath);
const baseName = _path.basename(filePath);
const parentDir = _path.dirname(filePath);

// Stateful tracking file to remember the zip created in the last execution
const trackingFilePath = _path.join(os.tmpdir(), "terminal_last_zip_temp.txt");

// Cleans up the zip file from the previous run using the tracking file
const cleanupPreviousTempFile = (trackingPath) => {
    if (_fs.existsSync(trackingPath)) {
        try {
            const lastTempPath = _fs.readFileSync(trackingPath, "utf8").trim();
            if (lastTempPath && _fs.existsSync(lastTempPath)) {
                _fs.unlinkSync(lastTempPath);
            }
        } catch (_) {
            // Non-fatal — if cleanup fails, the OS will evict it eventually
        }
    }
};

// 1. Clean up any zip file left over from the previous execution
cleanupPreviousTempFile(trackingFilePath);

// 2. Define the path for the new zip archive
let zipPath = _path.join(os.tmpdir(), `${baseName}.zip`);
if (_fs.existsSync(zipPath)) {
    try {
        _fs.unlinkSync(zipPath);
    } catch (err) {
        // Fallback to a timestamped name if the target filename is currently locked
        zipPath = _path.join(os.tmpdir(), `${baseName}-${Date.now()}.zip`);
    }
}

// 3. Record the new zip file path in the tracking file so the next run can clean it up
try {
    _fs.writeFileSync(trackingFilePath, zipPath, "utf8");
} catch (_) {
    // Non-fatal if we cannot write the tracking file due to environment restrictions
}

const platform = os.platform();

// We wrap the async spawn execution in a Promise and await it.
// This guarantees the terminal waits for the copy operation to finish before printing the next prompt.
await new Promise((resolve) => {
    if (platform === 'darwin') {
        // macOS: Create zip using standard 'zip' utility relative to parent folder
        const zipChild = spawn('zip', ['-rq', zipPath, baseName], { cwd: parentDir });
        
        zipChild.on('close', (code) => {
            if (code !== 0) {
                terminal.write("\r\nError: Failed to create zip archive.");
                resolve();
                return;
            }
            
            // Revert to reliable AppleScript POSIX file conversion for a single zip file
            const escapedPath = zipPath.replace(/"/g, '\\"');
            const appleScript = `
                set the clipboard to "" 
                delay 0.1
                set theFile to (POSIX file "${escapedPath}")
                set the clipboard to theFile
                delay 0.1
            `;

            const copyChild = spawn('osascript');
            copyChild.stdin.write(appleScript);
            copyChild.stdin.end();

            copyChild.on('close', (copyCode) => {
                if (copyCode === 0) {
                    terminal.write(`\r\nZipped "${baseName}" and copied "${_path.basename(zipPath)}" to clipboard.`);
                } else {
                    terminal.write("\r\nError: AppleScript failed to copy zip file to clipboard.");
                }
                resolve();
            });
        });

    } else if (platform === 'win32') {
        // Windows: Create zip and copy it using PowerShell
        const psScript = `
$ErrorActionPreference = "Stop"
Compress-Archive -Path '${filePath.replace(/'/g, "''")}' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force
Set-Clipboard -LiteralPath '${zipPath.replace(/'/g, "''")}'
`;

        const child = spawn('powershell.exe', ['-NoProfile', '-Command', '-']);
        child.stdin.write(psScript);
        child.stdin.end();

        child.on('close', (code) => {
            if (code === 0) {
                terminal.write(`\r\nZipped "${baseName}" and copied "${_path.basename(zipPath)}" to clipboard.`);
            } else {
                terminal.write("\r\nError: PowerShell failed to zip or copy the folder.");
            }
            resolve();
        });

    } else {
        terminal.write("\r\nError: Zipping to clipboard is currently only supported on macOS and Windows.");
        resolve();
    }
});