module.exports = async function({ app, obsidian }) {
    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView) {
        new obsidian.Notice("No active Markdown view found.");
        return;
    }
    
    const editor = activeView.editor;
    const template = `#question `;
    
    editor.replaceSelection(template);
};