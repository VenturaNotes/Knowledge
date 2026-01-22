module.exports = async (params) => {
    const { quickAddApi, app } = params;
    
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) { new Notice("No active file."); return; }
    
    const view = app.workspace.activeLeaf.view;
    if (view.getViewType() !== "markdown") { new Notice("Not a markdown file."); return; }

    const editor = view.editor;
    const cursor = editor.getCursor();
    const lineCount = editor.lineCount();

    // --- STEP 1: Find the Header "Context" properly (Handling Code Blocks) ---
    // We must scan lines manually to ignore #'s inside ```code blocks```
    
    let headerLineIndex = -1;
    let headerText = "";
    let inCodeBlock = false;

    // Scan DOWN from top to find where our cursor currently "lives"
    // We track the last valid header we saw before hitting the cursor
    for (let i = 0; i <= cursor.line; i++) {
        const line = editor.getLine(i);
        
        // Toggle code block status
        if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
        }

        // If it's a header AND we are not in a code block
        if (!inCodeBlock && line.match(/^#{1,6}\s/)) {
            headerLineIndex = i;
            headerText = line.trim();
        }
    }

    if (headerLineIndex === -1) {
        new Notice("No valid header found above cursor.");
        return;
    }

    // --- STEP 2: Ask for Search Term ---
    const searchTerm = await quickAddApi.inputPrompt(
        `Search inside: ${headerText}`,
        "Enter search term..."
    );
    if (!searchTerm) return;

    // --- STEP 3: Determine the END of this section ---
    // Scan down from the header until we hit the next valid header
    let sectionEndIndex = lineCount - 1;
    inCodeBlock = false; // Reset for forward scan

    // We start looking AFTER the header line
    for (let i = headerLineIndex + 1; i < lineCount; i++) {
        const line = editor.getLine(i);

        if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
        }

        // If we hit a new header and we are NOT in a code block -> Stop
        if (!inCodeBlock && line.match(/^#{1,6}\s/)) {
            sectionEndIndex = i - 1;
            break;
        }
    }

    // --- STEP 4: Find occurrences ONLY within these bounds ---
    const selections = [];
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");

    // Loop through the lines of the section
    for (let i = headerLineIndex; i <= sectionEndIndex; i++) {
        const lineContent = editor.getLine(i);
        let match;
        
        // Find all matches in this single line
        while ((match = regex.exec(lineContent)) !== null) {
            selections.push({
                anchor: { line: i, ch: match.index },
                head:   { line: i, ch: match.index + searchTerm.length }
            });
        }
    }

    // --- STEP 5: Apply Highlights (Multi-Cursor) ---
    if (selections.length > 0) {
        editor.setSelections(selections);
        editor.scrollIntoView(selections[0].anchor);
        new Notice(`Found ${selections.length} matches.`);
    } else {
        new Notice(`"${searchTerm}" not found in this section.`);
    }
};