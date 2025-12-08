module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION ---
    const targetTag = "#question";  // The tag to look for
    // ---------------------

    // 1. Get ALL markdown files in the entire vault
    const files = app.vault.getMarkdownFiles();

    let matches = [];

    // 2. Scan the Metadata Cache (Instant look-up)
    files.forEach(file => {
        const cache = app.metadataCache.getFileCache(file);
        
        // Check if the file has any tags known to the cache
        if (cache && cache.tags) {
            cache.tags.forEach(tagCache => {
                // Check if the tag matches our target
                // startsWith allows for nested tags like #question/review
                if (tagCache.tag.startsWith(targetTag)) {
                    matches.push({
                        file: file,
                        line: tagCache.position.start.line
                    });
                }
            });
        }
    });

    if (matches.length === 0) {
        new Notice(`No lines found with tag ${targetTag} in the entire vault.`);
        return;
    }

    // 3. Pick a random match
    const randomMatch = matches[Math.floor(Math.random() * matches.length)];

    // 4. Open the file
    const leaf = app.workspace.getLeaf(false);
    await leaf.openFile(randomMatch.file);

    // 5. Highlight the line
    const view = leaf.view;
    if (view.getViewType() === 'markdown') {
        const editor = view.editor;
        const lineNum = randomMatch.line;

        // Scroll to center
        editor.scrollIntoView(
            { from: { line: lineNum, ch: 0 }, to: { line: lineNum, ch: 0 } }, 
            true
        );

        // Highlight the specific line
        const lineText = editor.getLine(lineNum);
        editor.setSelection(
            { line: lineNum, ch: 0 },
            { line: lineNum, ch: lineText.length }
        );
    }
};