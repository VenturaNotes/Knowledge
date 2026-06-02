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
    const curLineNum = cursor.line;
    const curLineContent = editor.getLine(curLineNum);

    let headingLineNum = curLineNum;
    let headingMatch = curLineContent.match(/^(#{1,6})\s/);

    // If the cursor is not currently on a heading line, scan upwards to find the active parent heading
    if (!headingMatch) {
        for (let i = curLineNum - 1; i >= 0; i--) {
            const line = editor.getLine(i);
            const match = line.match(/^(#{1,6})\s/);
            if (match) {
                headingLineNum = i;
                headingMatch = match;
                break;
            }
        }
    }

    if (!headingMatch) {
        new Notice("No heading found at or above the cursor.");
        return;
    }

    const headingLevel = headingMatch[1].length;
    const totalLines = editor.lineCount();
    let endLine = null;

    // Scan downwards to find the next heading of equal or higher level (<= headingLevel)
    for (let i = headingLineNum + 1; i < totalLines; i++) {
        const line = editor.getLine(i);
        const match = line.match(/^(#{1,6})\s/);
        if (match) {
            const nextLevel = match[1].length;
            if (nextLevel <= headingLevel) {
                endLine = i;
                break;
            }
        }
    }

    // Check if there is actually any content below the heading to clear
    if (headingLineNum + 1 >= totalLines) {
        new Notice("Heading is already empty.");
        return;
    }

    let from, to;
    if (endLine !== null) {
        // If another heading of equal/higher level exists, delete up to its start
        from = { line: headingLineNum + 1, ch: 0 };
        to = { line: endLine, ch: 0 };
    } else {
        // If this is the last section in the file, delete to the very end of the file
        const lastLineNum = totalLines - 1;
        const lastLineLength = editor.getLine(lastLineNum).length;
        from = { line: headingLineNum, ch: editor.getLine(headingLineNum).length };
        to = { line: lastLineNum, ch: lastLineLength };
    }

    // Execute the deletion
    editor.replaceRange("", from, to);
    
    // Clean up the heading text for the notice message
    const cleanHeadingName = editor.getLine(headingLineNum).replace(/^#+\s+/, '');
    new Notice(`Deleted section content under "${cleanHeadingName}"`);
};