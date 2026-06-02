module.exports = async ({ app, obsidian }) => {
    const { Notice, MarkdownView } = obsidian;

    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
        new Notice("No active markdown editor found.");
        return;
    }

    const editor = activeView.editor;
    
    // Ensure the user has highlighted text
    if (!editor.somethingSelected()) {
        new Notice("Please highlight the text you want to process first.");
        return;
    }

    const selection = editor.getSelection();
    
    // Split the selection into lines, accounting for both Unix (\n) and Windows (\r\n) line endings
    const lines = selection.split(/\r?\n/);
    
    // Filter out lines that are completely empty or contain only spaces/tabs
    const filteredLines = lines.filter(line => line.trim() !== "");
    
    const removedCount = lines.length - filteredLines.length;
    
    if (removedCount === 0) {
        new Notice("No blank lines found in the current selection.");
        return;
    }

    // Join the remaining lines and replace the selected text
    const resultText = filteredLines.join("\n");
    editor.replaceSelection(resultText);
    
    new Notice(`Removed ${removedCount} blank line(s) from your selection.`);
};