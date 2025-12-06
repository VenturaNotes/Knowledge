module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    // Change this if your folder name changes
    const targetFolder = "Private/Daily"; 
    // ---------------------

    // 1. Get all markdown files that start with the target folder path
    const dailyFiles = app.vault.getMarkdownFiles().filter(file => 
        file.path.startsWith(targetFolder)
    );

    if (dailyFiles.length === 0) {
        new Notice(`No files found in ${targetFolder}`);
        return;
    }

    let allTasks = [];

    // 2. Loop through files and collect tasks from the Metadata Cache
    // (This is very fast and doesn't require opening the files)
    dailyFiles.forEach(file => {
        const cache = app.metadataCache.getFileCache(file);
        if (cache && cache.listItems) {
            cache.listItems.forEach(item => {
                // Check if it is an incomplete task (' ' means unchecked)
                if (item.task === ' ') {
                    allTasks.push({
                        file: file,
                        line: item.position.start.line
                    });
                }
            });
        }
    });

    if (allTasks.length === 0) {
        new Notice("No incomplete tasks found in your Daily Notes! 🎉");
        return;
    }

    // 3. Pick a random task
    const randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];

    // 4. Open the file containing the task
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(randomTask.file);

    // 5. Highlight the line (Logic from previous script)
    // We wait for the view to be active after opening
    const view = leaf.view;
    
    if (view.getViewType() === 'markdown') {
        const editor = view.editor;
        const lineNum = randomTask.line;

        // Get the actual text to calculate selection length
        const lineText = editor.getLine(lineNum);

        // Select/Highlight the line
        editor.setSelection(
            { line: lineNum, ch: 0 },
            { line: lineNum, ch: lineText.length }
        );

        // Center the screen on the task
        editor.scrollIntoView(
            {
                from: { line: lineNum, ch: 0 },
                to: { line: lineNum, ch: 0 }
            }, 
            true
        );
    }
};