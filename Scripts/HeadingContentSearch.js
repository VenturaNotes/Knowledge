module.exports = async (params) => {
    const { quickAddApi, app } = params;
    
    // 1. Get the current active file
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) { new Notice("No active file."); return; }

    const view = app.workspace.activeLeaf.view;
    if (view.getViewType() !== "markdown") { new Notice("Not a markdown file."); return; }

    const editor = view.editor;
    const cursor = editor.getCursor();
    const lineCount = editor.lineCount();

    // 2. Find the "Parent" Header above the cursor
    let parentHeaderIndex = -1;
    let parentHeaderLevel = 0;
    let parentHeaderText = "";

    for (let i = cursor.line; i >= 0; i--) {
        const lineText = editor.getLine(i);
        const match = lineText.match(/^(#{1,6})\s/);
        
        if (match) {
            parentHeaderIndex = i;
            parentHeaderLevel = match[1].length; // e.g., 2 for "## "
            parentHeaderText = lineText.trim();
            break;
        }
    }

    if (parentHeaderIndex === -1) {
        new Notice("No header found above cursor.");
        return;
    }

    // 3. Prompt for Search Term
    const searchTerm = await quickAddApi.inputPrompt(
        `Search tree: ${parentHeaderText}`,
        "Enter search term..."
    );
    if (!searchTerm) return; 

    // 4. Collect ALL Child Headers (Recursive Scope)
    // We start at the parent and look down. We include any header that is "Deeper" (higher level number)
    // We stop if we hit a header that is same level or higher (smaller level number)
    
    const headersToSearch = [parentHeaderText]; // Start with the parent

    for (let i = parentHeaderIndex + 1; i < lineCount; i++) {
        const line = editor.getLine(i);
        const match = line.match(/^(#{1,6})\s/);

        if (match) {
            const currentLevel = match[1].length;

            if (currentLevel > parentHeaderLevel) {
                // This is a child (e.g. ### is > ##), so we add it to our search scope
                headersToSearch.push(line.trim());
            } else {
                // We hit a sibling or parent (e.g. found another ## or #), so stop scanning.
                break;
            }
        }
    }

    // 5. Construct the "OR" Query
    // We build a query that looks like: (section:("## A" "term") OR section:("### B" "term"))
    
    const safePath = activeFile.path.replace(/"/g, '\\"');
    const safeTerm = searchTerm.replace(/"/g, '\\"');

    // Build the list of section queries
    const sectionQueries = headersToSearch.map(header => {
        const safeHeader = header.replace(/"/g, '\\"');
        return `section:("${safeHeader}" "${safeTerm}")`;
    });

    // Join them with OR and wrap in parenthesis
    const combinedSectionQuery = `(${sectionQueries.join(' OR ')})`;

    // Final Query: path + the grouped sections
    const query = `path:"${safePath}" ${combinedSectionQuery}`;

    // 6. Execute Search
    app.commands.executeCommandById('global-search:open');
    await new Promise(resolve => setTimeout(resolve, 50));

    const searchLeaf = app.workspace.getLeavesOfType('search')[0];
    if (searchLeaf) {
        searchLeaf.view.setQuery(query);
    }
};