module.exports = async function({ app, obsidian }) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    try {
        // 1. Process frontmatter properties safely
        await app.fileManager.processFrontMatter(file, (fm) => {
            if (fm.Source === undefined && fm.source === undefined) fm.Source = "";
            if (fm.Length === undefined && fm.length === undefined) fm.Length = "";
            if (fm.tags === undefined) fm.tags = [];
            if (fm.Reviewed === undefined && fm.reviewed === undefined) fm.Reviewed = false;
        });

        // 2. Insert body elements directly underneath frontmatter if they don't exist
        const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (activeView) {
            const editor = activeView.editor;
            
            // Give a brief moment for Obsidian to update the file content
            setTimeout(() => {
                const value = editor.getValue();
                const lines = value.split("\n");
                
                // Find closing frontmatter boundary
                let fmEndLine = -1;
                if (lines[0] === "---") {
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i] === "---") {
                            fmEndLine = i;
                            break;
                        }
                    }
                }

                // If frontmatter boundary exists and document doesn't already contain "## Complete"
                if (fmEndLine !== -1 && !value.includes("## Complete")) {
                    const headings = "## Complete\n\n## Incomplete\n";
                    editor.replaceRange(headings, { line: fmEndLine + 1, ch: 0 });
                }
            }, 100);
        }
    } catch (error) {
        console.error("Error running Book or Playlist script:", error);
    }
};