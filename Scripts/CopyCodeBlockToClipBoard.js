module.exports = async (params) => {
    const { app } = params;
    
    const activeLeaf = app.workspace.activeLeaf;
    if (!activeLeaf || activeLeaf.view.getViewType() !== "markdown") {
        new Notice("No active markdown editor found.");
        return;
    }
    
    const editor = activeLeaf.view.editor;
    const cursor = editor.getCursor();
    const currentLine = cursor.line;
    
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) return;
    
    const fileCache = app.metadataCache.getFileCache(activeFile);
    if (!fileCache || !fileCache.sections) {
        new Notice("Unable to read document structure.");
        return;
    }
    
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
    
    let codeText = "";
    if (startLine + 1 < endLine) {
        codeText = editor.getRange(
            { line: startLine + 1, ch: 0 }, 
            { line: endLine - 1, ch: editor.getLine(endLine - 1).length }
        );
    }
    
    await navigator.clipboard.writeText(codeText);
    new Notice("Code block copied to clipboard!");
};