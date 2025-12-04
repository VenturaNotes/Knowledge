module.exports = async (params) => {
    const { app, quickAddApi } = params;
    
    // 1. Get the currently active file
    const activeFile = app.workspace.getActiveFile();
    
    if (!activeFile) {
        new Notice("No active file found.");
        return;
    }

    // 2. Get the file's cache (metadata) to find tasks instantly
    const cache = app.metadataCache.getFileCache(activeFile);
    
    if (!cache || !cache.listItems) {
        new Notice("No list items found in this file.");
        return;
    }

    // 3. Filter for tasks that are NOT done (checked)
    // In Obsidian's cache, ' ' means an empty checkbox. 'x' is done.
    const incompleteTasks = cache.listItems.filter(item => item.task === ' ');

    if (incompleteTasks.length === 0) {
        new Notice("No incomplete tasks found in this file! 🎉");
        return;
    }

    // 4. Pick a random task
    const randomItem = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
    
    // 5. Read the file content to get the actual text of the task
    // (The cache only knows where the line is, not the text itself)
    const fileContent = await app.vault.cachedRead(activeFile);
    const lines = fileContent.split("\n");
    // We get the line content and remove the "- [ ] " part for a cleaner look
    const taskText = lines[randomItem.position.start.line].replace(/^[ \t]*[-*+] \[[ ]\] /, "").trim();

    // 6. Show the popup
    const choice = await quickAddApi.yesNoPrompt(
        "Random Task from This File",
        `Task: ${taskText}\n\nJump to this task?`
    );

    if (choice) {
        // Open the file (it's already open, but this ensures focus) and scroll to line
        const leaf = app.workspace.getLeaf(false);
        await leaf.openFile(activeFile, { 
            eState: { line: randomItem.position.start.line } 
        });
    }
};