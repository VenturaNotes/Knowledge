const fs = require('fs');
const path = require('path');

module.exports = async ({ app, vault, workspace }) => {
    const activeLeaf = workspace.activeLeaf;
    const activeTab = activeLeaf?.activeTab;

    if (!activeTab) {
        app.notify({ title: "Duplicate File", body: "No active file open in workspace", type: "warning" });
        return;
    }

    // 1. Flush any pending editor changes to disk before duplicating
    if (activeTab.editor && typeof activeTab.editor.flush === 'function') {
        activeTab.editor.flush();
    }

    // 2. Resolve paths
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
        app.notify({ title: "Duplicate File", body: "Active tab does not contain a file on disk", type: "warning" });
        return;
    }

    const folderDir = path.dirname(relativeSourcePath);
    const originalExt = path.extname(absoluteSourcePath);
    const originalBaseName = path.basename(absoluteSourcePath, originalExt);

    // 3. Find an available non-colliding default duplicate name
    let counter = 1;
    let defaultDuplicateName = `${originalBaseName} copy${originalExt}`;
    let candidateRelativePath = folderDir === '.' ? defaultDuplicateName : `${folderDir}/${defaultDuplicateName}`;

    while (fs.existsSync(path.join(vault.path, candidateRelativePath))) {
        counter++;
        defaultDuplicateName = `${originalBaseName} copy ${counter}${originalExt}`;
        candidateRelativePath = folderDir === '.' ? defaultDuplicateName : `${folderDir}/${defaultDuplicateName}`;
    }

    // 4. Prompt user via built-in app.prompt (returns null on Escape/Cancel)
    const requestedName = await app.prompt('Duplicate File', defaultDuplicateName, 'Enter duplicate filename...');

    if (!requestedName) {
        return;
    }

    let trimmedName = requestedName.trim();
    if (!trimmedName) {
        app.notify({ title: "Duplicate File", body: "Filename cannot be empty", type: "error" });
        return;
    }

    // Preserve original extension if omitted
    const userExt = path.extname(trimmedName);
    if (!userExt && originalExt) {
        trimmedName += originalExt;
    }

    const targetRelativePath = folderDir === '.' ? trimmedName : `${folderDir}/${trimmedName}`;
    const targetAbsolutePath = path.join(vault.path, targetRelativePath);

    if (fs.existsSync(targetAbsolutePath)) {
        app.notify({ title: "Duplicate Failed", body: `"${trimmedName}" already exists`, type: "error" });
        return;
    }

    try {
        // 5. Copy the file on disk (works for text, markdown, PDFs, images, and scripts)
        fs.copyFileSync(absoluteSourcePath, targetAbsolutePath);

        if (targetRelativePath.endsWith('.md')) {
            const content = fs.readFileSync(targetAbsolutePath, 'utf-8');
            app.cache.updateFile(targetRelativePath, content);
        }

        app.events.emit('file-modified', targetRelativePath);

        // 6. Open the duplicated file in a new tab
        if (typeof workspace.fileOpener === 'function') {
            workspace.fileOpener(targetRelativePath);
        }

        app.notify({
            title: "File Duplicated",
            body: `Created "${trimmedName}"`,
            type: "success"
        });
    } catch (err) {
        console.error('[DuplicateCurrentFile Error]', err);
        app.notify({
            title: "Duplicate Failed",
            body: err?.message || String(err),
            type: "error"
        });
    }
};