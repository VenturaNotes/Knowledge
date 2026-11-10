module.exports = async ({ app, obsidian }) => {
    const { MarkdownView, Notice } = obsidian;

    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
        new Notice("No active note found.");
        return;
    }

    const editor = activeView.editor;
    const selections = editor.listSelections();

    // Verify there is an active selection
    const hasSelection = selections.some(
        s => s.anchor.line !== s.head.line || s.anchor.ch !== s.head.ch
    );

    if (!hasSelection) {
        new Notice("No text selected.");
        return;
    }

    // Single selection shortcut
    if (selections.length === 1) {
        editor.replaceSelection(editor.getSelection().toLowerCase());
        return;
    }

    // Multi-selection: Normalize start/end bounds and sort from bottom to top
    const normalized = selections
        .map(sel => {
            const isAnchorFirst =
                sel.anchor.line < sel.head.line ||
                (sel.anchor.line === sel.head.line && sel.anchor.ch <= sel.head.ch);
            return {
                from: isAnchorFirst ? sel.anchor : sel.head,
                to: isAnchorFirst ? sel.head : sel.anchor
            };
        })
        .filter(({ from, to }) => from.line !== to.line || from.ch !== to.ch)
        .sort((a, b) => {
            if (b.from.line !== a.from.line) return b.from.line - a.from.line;
            return b.from.ch - a.from.ch;
        });

    for (const { from, to } of normalized) {
        const text = editor.getRange(from, to);
        editor.replaceRange(text.toLowerCase(), from, to);
    }
};