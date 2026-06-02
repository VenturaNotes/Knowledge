module.exports = async (params) => {
    const { app, quickAddApi } = params;
    const { SuggestModal, MarkdownView } = params.obsidian;

    const view = app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) { new Notice("No active editor."); return; }

    const cursor = editor.getCursor();
    const lineCount = editor.lineCount();

    // 1. Find the Scope (Parent Header)
    let parentHeaderIndex = -1;
    let parentHeaderLevel = 0;
    let parentHeaderText = "";

    for (let i = cursor.line; i >= 0; i--) {
        const lineText = editor.getLine(i);
        const match = lineText.match(/^(#{1,6})\s+(.*)/);
        if (match) {
            parentHeaderIndex = i;
            parentHeaderLevel = match[1].length;
            parentHeaderText = match[2].trim();
            break;
        }
    }

    // 2. Define scanning boundaries
    let endLine = lineCount;
    if (parentHeaderIndex !== -1) {
        for (let i = parentHeaderIndex + 1; i < lineCount; i++) {
            const line = editor.getLine(i);
            const match = line.match(/^(#{1,6})\s/);
            if (match && match[1].length <= parentHeaderLevel) {
                endLine = i;
                break;
            }
        }
    }

    const startLine = parentHeaderIndex === -1 ? 0 : parentHeaderIndex;
    const allLinesInSection = [];
    let currentPath = parentHeaderText ? [parentHeaderText] : [];

    // 3. Prepare data
    for (let i = startLine; i < endLine; i++) {
        const lineText = editor.getLine(i);
        if (!lineText.trim()) continue;

        const headMatch = lineText.match(/^(#{1,6})\s+(.*)/);
        if (headMatch) {
            const level = headMatch[1].length;
            const text = headMatch[2].trim();
            const depth = level - (parentHeaderLevel || 1);
            currentPath = currentPath.slice(0, depth + 1);
            currentPath[depth + 1] = text;
        }

        const cleanPath = currentPath.filter(Boolean).filter((v, idx, a) => v !== a[idx - 1]);
        const breadcrumb = `[${cleanPath.join(" > ")}]`;

        allLinesInSection.push({
            line: i,
            breadcrumb: breadcrumb,
            content: lineText.trim(),
            fullText: `${breadcrumb} ${lineText.trim()}`
        });
    }

    // 4. Define Custom Suggest Modal
    class SectionSearchModal extends SuggestModal {
        constructor(app, items) {
            super(app);
            this.items = items;
            this.setPlaceholder(`Search in ${parentHeaderText || "File"}...`);
        }

        getSuggestions(query) {
            const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            return this.items.filter(item => {
                const itemText = item.fullText.toLowerCase();
                return queryWords.every(word => itemText.includes(word));
            });
        }

        renderSuggestion(item, el) {
            const container = el.createDiv({ cls: "search-result-item" });
            container.createSpan({ 
                text: item.breadcrumb + " ", 
                attr: { style: "opacity: 0.6; font-size: 0.85em; margin-right: 5px;" } 
            });
            
            let contentHtml = item.content;
            const query = this.inputEl.value.trim();
            
            if (query) {
                const words = query.split(/\s+/).filter(w => w.length > 0);
                if (words.length > 0) {
                    // Escape special characters so regex doesn't break on punctuation
                    const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                    // Sort words by length descending so longer phrases match first
                    escapedWords.sort((a, b) => b.length - a.length);
                    
                    // Combine all terms with "|" and perform a single-pass replacement
                    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");
                    contentHtml = contentHtml.replace(regex, `<span style="color: #a371f7; font-weight: bold;">$1</span>`);
                }
            }

            container.createSpan().innerHTML = contentHtml;
        }

        onChooseSuggestion(item) {
            const line = item.line;
            
            // We use a small delay to let the modal fully close.
            // This prevents the editor from being "stuck" at the bottom.
            setTimeout(() => {
                // Focus the editor first
                view.editor.focus();

                // Set Cursor and Selection
                editor.setCursor({ line: line, ch: 0 });
                editor.setSelection(
                    { line: line, ch: 0 }, 
                    { line: line, ch: editor.getLine(line).length }
                );

                // Perform the scroll with the 'center' flag (true)
                editor.scrollIntoView({
                    from: { line: line, ch: 0 },
                    to: { line: line, ch: 0 }
                }, true);
            }, 150); 
        }
    }

    new SectionSearchModal(app, allLinesInSection).open();
};