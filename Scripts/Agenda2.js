module.exports = async (params) => {
    const { app, quickAddApi } = params;
    const editor = app.workspace.activeLeaf.view.editor;
    if (!editor) return;

    const cursor = editor.getCursor();
    let lineText = editor.getLine(cursor.line);

    // 1. Check if it's a checkbox
    if (!lineText.includes("- [")) {
        new Notice("Not on a checkbox line!");
        return;
    }

    // 2. Ask for Date and Time
    const date = await quickAddApi.inputPrompt("Date (YYYY-MM-DD)", window.moment().format("YYYY-MM-DD"));
    const time = await quickAddApi.inputPrompt("Time (HH:mm)", "12:00");

    if (!date) return;

    // 3. Clean existing date/time if present and add new ones
    let cleanText = lineText.replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "").replace(/⏰\s*\d{2}:\d{2}/g, "").trim();
    const newText = `${cleanText} 📅 ${date} ⏰ ${time}`;

    editor.setLine(cursor.line, newText);
};