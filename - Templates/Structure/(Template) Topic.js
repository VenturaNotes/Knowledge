module.exports = async function({ app, obsidian }) {
    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView) return;
    
    const editor = activeView.editor;
    const template = `## Synthesis
- 
## Source [^1]
- 
## References

[^1]: `;
    
    editor.replaceSelection(template);
};