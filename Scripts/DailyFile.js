module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    // Updated extension to .base
    const filePath = "Private/Tasks/(T) Daily.md"; 
    // ---------------------

    // 1. Find the file in the vault
    const file = app.vault.getAbstractFileByPath(filePath);

    if (!file) {
        new Notice(`Could not find file: ${filePath}`);
        return;
    }

    // 2. Check if the file is already open in an existing tab
    const existingLeaf = app.workspace.getLeavesOfType("markdown")
        .find(leaf => leaf.view?.file?.path === filePath);

    if (existingLeaf) {
        // If found, activate, reveal (bring to foreground), and focus the tab
        app.workspace.setActiveLeaf(existingLeaf, { focus: true });
        app.workspace.revealLeaf(existingLeaf);
        return;
    }

    // 3. Determine where to open it if it isn't already open
    // We get the current active leaf (tab)
    const activeLeaf = app.workspace.getLeaf(false);

    let leaf;
    // If the current tab is NOT empty (it has a file open), open a new tab.
    // Otherwise, reuse the empty tab.
    if (activeLeaf && activeLeaf.view && activeLeaf.view.getViewType() !== 'empty') {
        leaf = app.workspace.getLeaf('tab');
    } else {
        leaf = activeLeaf || app.workspace.getLeaf('tab');
    }

    // 4. Open the file
    await leaf.openFile(file);
};