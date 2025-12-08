module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    const targetFolder = "Private/Daily"; 
    const dateFormat = "YYYY-MM-DD"; // Change this if your filenames use a different format
    // ---------------------

    // Get "end of today" to ensure we include today's tasks
    const today = moment().endOf('day');

    // 1. Get files in folder AND check if date is <= Today
    const dailyFiles = app.vault.getMarkdownFiles().filter(file => {
        // Check if file is in the target folder
        if (!file.path.startsWith(targetFolder)) return false;

        // Parse the date from the filename
        const fileDate = moment(file.basename, dateFormat, true);

        // Check if it is a valid date AND is today or in the past
        if (fileDate.isValid() && fileDate.isSameOrBefore(today)) {
            return true;
        }
        
        return false;
    });

    if (dailyFiles.length === 0) {
        new Notice(`No past or present daily notes found in ${targetFolder}`);
        return;
    }

    let allTasks = [];

    // 2. Loop through valid files and collect tasks
    dailyFiles.forEach(file => {
        const cache = app.metadataCache.getFileCache(file);
        if (cache && cache.listItems) {
            cache.listItems.forEach(item => {
                // Check if it is an incomplete task
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
        new Notice("No incomplete tasks found in past/present Daily Notes! 🎉");
        return;
    }

    // 3. Pick a random task
    const randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];

    // 4. Open the file containing the task
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(randomTask.file);

    // 5. Highlight the line
    const view = leaf.view;
    
    if (view.getViewType() === 'markdown') {
        const editor = view.editor;
        const lineNum = randomTask.line;

        const lineText = editor.getLine(lineNum);

        editor.setSelection(
            { line: lineNum, ch: 0 },
            { line: lineNum, ch: lineText.length }
        );

        editor.scrollIntoView(
            {
                from: { line: lineNum, ch: 0 },
                to: { line: lineNum, ch: 0 }
            }, 
            true
        );
    }
};