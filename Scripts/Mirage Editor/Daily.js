const path = require('path');
const { ipcRenderer } = require('electron');

// --- CONFIGURATION ---
const FILE_PATH = "Private/Tasks/(T) Daily.md"; 
const CREATE_IF_MISSING = false; // Set to true to create the note if missing
// ---------------------

module.exports = async ({ app, vault, workspace }) => {
    const normalizedPath = FILE_PATH.replace(/\\/g, '/').replace(/^\/+/, '').trim();

    // 1. Verify file existence in the vault
    if (!vault.exists(normalizedPath)) {
        if (CREATE_IF_MISSING) {
            const title = path.basename(normalizedPath, '.md');
            const initialContent = `# ${title}\n\n`;

            vault.writeFile(normalizedPath, initialContent);
            app.cache.updateFile(normalizedPath, initialContent);
            app.events.emit('file-modified', normalizedPath);
        } else {
            app.notify({
                title: "Daily Note",
                body: `Could not find file: ${normalizedPath}`,
                type: "warning"
            });
            return;
        }
    }

    // 2. Check if the user is currently focused on VaporNote
    let isVaporFocused = false;
    try {
        isVaporFocused = await ipcRenderer.invoke('vapornote:isFocused');
    } catch (_) {}

    // --- CASE A: Running from VaporNote ---
    if (isVaporFocused) {
        // VaporNote's openTab automatically deduplicates:
        // if (T) Daily is already open, it activates that tab; otherwise opens a new one.
        ipcRenderer.send('vapornote:openTab', {
            type: 'markdown',
            pathOrUrl: normalizedPath
        });
        return;
    }

    // --- CASE B: Running from Main Mirage Editor Window ---
    const allLeaves = workspace.leaves || [];
    
    // Check if the tab is already open in any leaf of the current workspace / tab group
    for (const leaf of allLeaves) {
        const existingTab = leaf.tabs.find((tab) => {
            if (!tab.filePath) return false;
            return tab.filePath.replace(/\\/g, '/').toLowerCase() === normalizedPath.toLowerCase();
        });

        if (existingTab) {
            workspace.setActiveLeaf(leaf);
            leaf.setActiveTab(existingTab);
            return;
        }
    }

    // Otherwise, open a single tab in the active leaf
    if (typeof workspace.fileOpener === 'function') {
        workspace.fileOpener(normalizedPath);
    }
};