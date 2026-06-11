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

    // Define the range starting at the end of the opening fence line
    // and ending at the start of the closing fence line
    const from = { line: startLine, ch: editor.getLine(startLine).length };
    const to = { line: endLine, ch: 0 };

    // Replace the content with two newlines to leave a clean empty line in the middle
    editor.replaceRange("\n\n", from, to);

    // Position the cursor on the empty line inside the code block
    editor.setCursor({ line: startLine + 1, ch: 0 });

    new Notice("Code block cleared.");
};