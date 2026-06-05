module.exports = async ({ app, obsidian }) => {
    const { Notice, MarkdownView } = obsidian;

    // Get the active Markdown editor
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
        new Notice("No active markdown editor found.");
        return;
    }

    const editor = activeView.editor;
    const cursor = editor.getCursor();
    const currentLine = cursor.line;

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return;

    // Retrieve document structure from Obsidian's metadata cache
    const fileCache = app.metadataCache.getFileCache(activeFile);
    if (!fileCache || !fileCache.sections) {
        new Notice("Unable to read document structure.");
        return;
    }

    // Find the code section that wraps the current cursor line
    const currentCodeSection = fileCache.sections.find(section => {
        return section.type === "code" && 
               currentLine >= section.position.start.line && 
               currentLine <= section.position.end.line;
    });

    if (!currentCodeSection) {
        new Notice("Cursor is not inside a code block.");
        return;
    }

    const startLine = currentCodeSection.position.start.line;
    const endLine = currentCodeSection.position.end.line;
    const totalLines = editor.lineCount();

    let from, to;

    // Determine the deletion range while avoiding leaving trailing blank lines
    if (endLine < totalLines - 1) {
        // If there is text below the block, delete up to the start of the next line
        from = { line: startLine, ch: 0 };
        to = { line: endLine + 1, ch: 0 };
    } else if (startLine > 0) {
        // If the block is at the very end of the file, delete from the end of the previous line
        from = { line: startLine - 1, ch: editor.getLine(startLine - 1).length };
        to = { line: endLine, ch: editor.getLine(endLine).length };
    } else {
        // If the code block is the entire content of the file
        from = { line: startLine, ch: 0 };
        to = { line: endLine, ch: editor.getLine(endLine).length };
    }

    // Execute the deletion
    editor.replaceRange("", from, to);
    new Notice("Code block deleted.");
};