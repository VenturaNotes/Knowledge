module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    // Updated extension to .base
    const filePath = "Private/TaskNotes/Views/kanban-default.base"; 
    // ---------------------

    // 1. Find the file in the vault
    const file = app.vault.getAbstractFileByPath(filePath);

    if (!file) {
        new Notice(`Could not find file: ${filePath}`);
        return;
    }

    // 2. Determine where to open it
    // We get the current active leaf (tab)
    const activeLeaf = app.workspace.getLeaf(false);

    let leaf;
    // If the current tab is NOT empty (it has a file open), open a new tab.
    // Otherwise, reuse the empty tab.
    if (activeLeaf.view.getViewType() !== 'empty') {
        leaf = app.workspace.getLeaf('tab');
    } else {
        leaf = activeLeaf;
    }

    // 3. Open the file
    await leaf.openFile(file);
};