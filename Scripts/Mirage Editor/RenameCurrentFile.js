const fs = require('fs');
const path = require('path');

module.exports = async ({ app, vault, workspace }) => {
    const activeLeaf = workspace.activeLeaf;
    const activeTab = activeLeaf?.activeTab;

    if (!activeTab) {
        app.notify({ title: "Rename File", body: "No active file open in workspace", type: "warning" });
        return;
    }

    // 1. Flush any pending editor changes to disk before renaming
    if (activeTab.editor && typeof activeTab.editor.flush === 'function') {
        activeTab.editor.flush();
    }

    // 2. Resolve the absolute and vault-relative paths
    let absoluteSourcePath = null;
    let relativeSourcePath = null;

    if (activeTab.filePath && vault.path) {
        // Markdown (.md, .mdenc), PDF (.pdf), scripts (.js), etc.
        relativeSourcePath = activeTab.filePath;
        absoluteSourcePath = path.isAbsolute(activeTab.filePath)
            ? activeTab.filePath
            : path.join(vault.path, activeTab.filePath);
    } else if (activeTab.url && activeTab.url.startsWith('file://') && vault.path) {
        // Images viewed in WebViewer tabs
        try {
            absoluteSourcePath = decodeURIComponent(new URL(activeTab.url).pathname);
            relativeSourcePath = path.relative(vault.path, absoluteSourcePath).replace(/\\/g, '/');
        } catch (_) {
            absoluteSourcePath = null;
        }
    }

    if (!absoluteSourcePath || !fs.existsSync(absoluteSourcePath)) {
        app.notify({ title: "Rename File", body: "Active tab does not contain a file on disk", type: "warning" });
        return;
    }

    const folderDir = path.dirname(relativeSourcePath);
    const originalExt = path.extname(absoluteSourcePath);
    const originalFileName = path.basename(absoluteSourcePath);

    // 3. Prompt user via built-in app.prompt (returns null on Escape/Cancel)
    const requestedName = await app.prompt('Rename File', originalFileName, 'Enter new filename...');

    if (!requestedName) {
        return;
    }

    let trimmedName = requestedName.trim();
    if (!trimmedName || trimmedName === originalFileName) {
        return;
    }

    // Preserve original extension if omitted
    const userExt = path.extname(trimmedName);
    if (!userExt && originalExt) {
        trimmedName += originalExt;
    }

    const newRelativePath = folderDir === '.' ? trimmedName : `${folderDir}/${trimmedName}`;
    const newAbsolutePath = path.join(vault.path, newRelativePath);

    if (fs.existsSync(newAbsolutePath)) {
        app.notify({ title: "Rename Failed", body: `"${trimmedName}" already exists`, type: "error" });
        return;
    }

    try {
        // 4. Rename on disk
        fs.renameSync(absoluteSourcePath, newAbsolutePath);

        // 5. Update MetadataCache and closed tabs history
        if (typeof workspace.removeClosedTabsForPath === 'function') {
            workspace.removeClosedTabsForPath(relativeSourcePath, false);
        }
        app.cache.deleteFile(relativeSourcePath);

        if (newRelativePath.endsWith('.md')) {
            const content = fs.readFileSync(newAbsolutePath, 'utf-8');
            app.cache.updateFile(newRelativePath, content);
        }

        // 6. Seamless tab switch
        const oldTab = activeTab;
        if (typeof workspace.fileOpener === 'function') {
            workspace.fileOpener(newRelativePath);
        }
        activeLeaf.closeTab(oldTab, false);

        // 7. Notify file tree and workspace
        app.events.emit('file-deleted', relativeSourcePath);
        app.events.emit('file-modified', newRelativePath);

        app.notify({ title: "File Renamed", body: `Renamed to "${trimmedName}"`, type: "success" });
    } catch (err) {
        console.error('[RenameCurrentFile Error]', err);
        app.notify({ title: "Rename Failed", body: err?.message || String(err), type: "error" });
    }
};