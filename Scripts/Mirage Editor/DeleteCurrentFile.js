const fs = require('fs');
const path = require('path');
const { shell, ipcRenderer } = require('electron');

// 🟢 Set to true for confirmation, false for instant delete
const CONFIRM_BEFORE_DELETE = true;

module.exports = async ({ app, vault, workspace }) => {
    const activeLeaf = workspace.activeLeaf;
    const activeTab = activeLeaf?.activeTab;

    if (!activeTab) {
        app.notify({ title: "Delete File", body: "No active file open in workspace", type: "warning" });
        return;
    }

    // 1. Resolve the absolute and vault-relative path of the active file
    let absoluteFilePath = null;
    let relativeFilePath = null;

    if (activeTab.filePath && vault.path) {
        // Markdown (.md, .mdenc), PDF (.pdf), scripts (.js), etc.
        relativeFilePath = activeTab.filePath;
        absoluteFilePath = path.isAbsolute(activeTab.filePath)
            ? activeTab.filePath
            : path.join(vault.path, activeTab.filePath);
    } else if (activeTab.url && activeTab.url.startsWith('file://') && vault.path) {
        // Images viewed in WebViewer tabs
        try {
            absoluteFilePath = decodeURIComponent(new URL(activeTab.url).pathname);
            relativeFilePath = path.relative(vault.path, absoluteFilePath).replace(/\\/g, '/');
        } catch (_) {
            absoluteFilePath = null;
        }
    }

    if (!absoluteFilePath || !fs.existsSync(absoluteFilePath)) {
        app.notify({ title: "Delete File", body: "Active tab does not contain a file on disk", type: "warning" });
        return;
    }

    const fileName = path.basename(absoluteFilePath);

    // 2. Non-editable Confirmation Dialog
    if (CONFIRM_BEFORE_DELETE) {
        const confirmed = await new Promise((resolve) => {
            const actionId = `script-confirm:${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

            const unsub = app.events.on('modal-stage:action', (data) => {
                if (data && data.actionId === actionId) {
                    unsub();
                    resolve(Boolean(data.confirmed));
                }
            });

            ipcRenderer.send('modal-stage:open', {
                mode: 'confirm',
                actionId,
                title: 'Move File to Trash?',
                message: `Are you sure you want to move "${fileName}" to the system trash?`,
                submitLabel: 'Move to Trash',
                confirmDestructive: true,
            });
        });

        // Cancelled via Escape, Cancel button, or backdrop click
        if (!confirmed) {
            return;
        }
    }

    try {
        // 3. Close open tabs for this file across all split leaves without saving to history
        if (typeof workspace.closeTabsForPath === 'function') {
            workspace.closeTabsForPath(relativeFilePath, false);
        } else {
            activeLeaf.closeTab(activeTab, false);
        }

        // 4. Move the file to the macOS system trash
        await shell.trashItem(absoluteFilePath);

        // 5. Clean up MetadataCache and VaporNote if active
        app.cache.deleteFile(relativeFilePath);
        ipcRenderer.send('vapornote:file-deleted', { filePath: relativeFilePath, isDirectory: false });

        // 6. Notify workspace listeners (triggers sidebar file tree refresh)
        app.events.emit('file-deleted', relativeFilePath);

        app.notify({
            title: "Moved to Trash",
            body: `"${fileName}" was moved to system trash`,
            type: "info"
        });
    } catch (err) {
        console.error('[DeleteCurrentFile Error]', err);
        app.notify({
            title: "Delete Failed",
            body: err?.message || String(err),
            type: "error"
        });
    }
};