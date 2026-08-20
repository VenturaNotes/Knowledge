module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    const filePath = "Private/Tasks/(T) Daily.md"; 
    // ---------------------

    // 1. Find the file in the vault
    const file = app.vault.getAbstractFileByPath(filePath);

    if (!file) {
        new Notice(`Could not find file: ${filePath}`);
        return;
    }

    // 2. Determine where to open it
    const activeLeaf = app.workspace.getLeaf(false);
    let leaf;

    // If there is an active tab and it is NOT empty, open in a new tab
    if (activeLeaf?.view?.getViewType && activeLeaf.view.getViewType() !== 'empty') {
        leaf = app.workspace.getLeaf('tab');
    } else {
        // Otherwise, reuse the current empty spot
        leaf = activeLeaf || app.workspace.getLeaf('tab');
    }

    // 3. Open the file
    await leaf.openFile(file);
};