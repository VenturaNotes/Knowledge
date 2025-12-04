module.exports = async (params) => {
    const { app } = params;

    // 1. Get the active editor view
    const activeLeaf = app.workspace.activeLeaf;
    
    if (!activeLeaf || activeLeaf.view.getViewType() !== 'markdown') {
        new Notice("No active markdown file found.");
        return;
    }

    const activeFile = activeLeaf.view.file;
    const editor = activeLeaf.view.editor;

    // 2. Get the file's cache
    const cache = app.metadataCache.getFileCache(activeFile);
    
    if (!cache || !cache.listItems) {
        new Notice("No list items found.");
        return;
    }

    // 3. Filter for tasks that are NOT done
    const incompleteTasks = cache.listItems.filter(item => item.task === ' ');

    if (incompleteTasks.length === 0) {
        new Notice("All tasks complete! 🎉");
        return;
    }

    // 4. Pick a random task
    const randomItem = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
    const lineNum = randomItem.position.start.line;

    // 5. Get the actual text of that line (so we know how long it is)
    const lineText = editor.getLine(lineNum);

    // 6. Highlight the line by selecting it
    // 'anchor' is the start, 'head' is the end of the selection
    editor.setSelection(
        { line: lineNum, ch: 0 },             // Start of the line
        { line: lineNum, ch: lineText.length } // End of the line
    );

    // 7. Scroll the view so the task is centered
    editor.scrollIntoView(
        {
            from: { line: lineNum, ch: 0 },
            to: { line: lineNum, ch: 0 }
        }, 
        true
    );
};