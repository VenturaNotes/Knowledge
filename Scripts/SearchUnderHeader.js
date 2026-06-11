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

    // 2. Define scanning boundaries for the active section
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

    // Detect Frontmatter boundaries to exclude it from scanning
    let startScanningLine = 0;
    if (lineCount > 0 && editor.getLine(0).trim() === "---") {
        for (let i = 1; i < lineCount; i++) {
            if (editor.getLine(i).trim() === "---") {
                startScanningLine = i + 1;
                break;
            }
        }
    }

    const allLines = [];
    let currentHeaders = [];

    // 3. Prepare data (excluding frontmatter and header lines themselves from results)
    for (let i = startScanningLine; i < lineCount; i++) {
        const lineText = editor.getLine(i);
        if (!lineText.trim()) continue;

        const headMatch = lineText.match(/^(#{1,6})\s+(.*)/);
        if (headMatch) {
            const level = headMatch[1].length;
            const text = headMatch[2].trim();
            currentHeaders = currentHeaders.slice(0, level - 1);
            currentHeaders[level - 1] = text;
            
            // Skip adding the header line itself to the list of search results
            continue;
        }

        const cleanPath = currentHeaders.filter(Boolean);
        const breadcrumb = cleanPath.length > 0 ? `[${cleanPath.join(" > ")}]` : "[]";
        const inSection = (i >= startLine && i < endLine);

        allLines.push({
            line: i,
            breadcrumb: breadcrumb,
            content: lineText.trim(),
            fullText: `${breadcrumb} ${lineText.trim()}`,
            inSection: inSection
        });
    }

    // 4. Define Custom Suggest Modal
    class SectionSearchModal extends SuggestModal {
        constructor(app, items, initialLimit = 100) {
            super(app);
            this.items = items;
            this.initialLimit = initialLimit;
            this.limit = initialLimit;
            this.lastQuery = "";
            this.setPlaceholder(`Search in ${parentHeaderText || "File"}... (Start with '-' for entire file)`);

            // Configure instructions helper at the bottom
            this.setInstructions([
                { command: "↑↓", purpose: "Navigate" },
                { command: "↵", purpose: "Select" },
                { command: "Alt + ↵", purpose: "Reveal all results" },
                { command: "esc", purpose: "Dismiss" }
            ]);

            // Append live-updating search count badge (shifted left to clear native close button)
            this.inputEl.style.paddingRight = "130px";
            this.countEl = this.inputEl.parentElement.createSpan({
                attr: { style: "font-size: 0.8em; opacity: 0.6; position: absolute; right: 50px; top: 50%; transform: translateY(-50%); pointer-events: none; font-weight: bold;" }
            });

            // Register Hotkey Alt + Enter / Option + Enter to instantly bypass the rendering limit
            this.scope.register(["Alt"], "Enter", (e) => {
                e.preventDefault();
                // Capture the current scroll position before expanding
                const currentScroll = this.resultContainerEl ? this.resultContainerEl.scrollTop : 0;
                
                this.limit = 999999;
                this.inputEl.dispatchEvent(new InputEvent("input"));

                // Restore scroll position once rendering completes
                setTimeout(() => {
                    if (this.resultContainerEl) {
                        this.resultContainerEl.scrollTop = currentScroll;
                    }
                }, 20);
                setTimeout(() => {
                    if (this.resultContainerEl) {
                        this.resultContainerEl.scrollTop = currentScroll;
                    }
                }, 100);
                return false;
            });
        }

        getSuggestions(query) {
            const isGlobal = query.startsWith("-");
            const cleanQuery = isGlobal ? query.slice(1) : query;
            const queryWords = cleanQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);

            // Auto-reset search limit back to original cap when the search query changes
            if (this.lastQuery !== query) {
                this.limit = this.initialLimit;
                this.lastQuery = query;
            }

            const matched = this.items.filter(item => {
                // If not global search, restrict results to the active header section
                if (!isGlobal && !item.inSection) {
                    return false;
                }

                if (queryWords.length > 0) {
                    const itemText = item.fullText.toLowerCase();
                    return queryWords.every(word => itemText.includes(word));
                }

                return true;
            });

            // Update live result counter indicator
            if (this.countEl) {
                this.countEl.textContent = `${matched.length} result${matched.length === 1 ? '' : 's'}`;
            }

            // If matched items exceed our current rendering limit, append the virtual load more item
            if (matched.length > this.limit) {
                const remainingCount = matched.length - this.limit + 1;
                const sliced = matched.slice(0, this.limit - 1);
                sliced.push({
                    isLoadMore: true,
                    text: `Show remaining results (${remainingCount})`,
                    query: query
                });
                return sliced;
            }

            return matched;
        }

        renderSuggestion(item, el) {
            // Check if this is the virtual "Show More" item
            if (item.isLoadMore) {
                const container = el.createDiv({ cls: "search-result-item load-more-item" });
                container.createSpan({ 
                    text: item.text, 
                    attr: { style: "opacity: 0.9; font-weight: bold; color: #a371f7; font-style: italic; display: block; text-align: center; width: 100%; cursor: pointer;" } 
                });

                // Smooth in-place click bypass (prevents modal closing when clicked)
                el.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const currentScroll = this.resultContainerEl ? this.resultContainerEl.scrollTop : 0;
                    
                    this.limit = 999999;
                    this.inputEl.dispatchEvent(new InputEvent("input"));

                    setTimeout(() => {
                        if (this.resultContainerEl) {
                            this.resultContainerEl.scrollTop = currentScroll;
                        }
                    }, 20);
                });
                return;
            }

            const container = el.createDiv({ cls: "search-result-item" });
            container.createSpan({ 
                text: item.breadcrumb + " ", 
                attr: { style: "opacity: 0.6; font-size: 0.85em; margin-right: 5px;" } 
            });
            
            let contentHtml = item.content;
            const rawQuery = this.inputEl.value;
            const isGlobal = rawQuery.startsWith("-");
            const query = (isGlobal ? rawQuery.slice(1) : rawQuery).trim();
            
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
            // Fallback for keyboard selection (hitting Enter on the load more option)
            if (item.isLoadMore) {
                const currentScroll = this.resultContainerEl ? this.resultContainerEl.scrollTop : 0;

                setTimeout(() => {
                    const modal = new SectionSearchModal(this.app, this.items, 999999);
                    modal.open();
                    
                    // Restore previous search input query and re-trigger filter
                    modal.inputEl.value = item.query;
                    modal.inputEl.dispatchEvent(new InputEvent("input"));
                    modal.inputEl.focus();

                    // Restore scroll position in the newly created modal
                    setTimeout(() => {
                        if (modal.resultContainerEl) {
                            modal.resultContainerEl.scrollTop = currentScroll;
                        }
                    }, 50);
                    setTimeout(() => {
                        if (modal.resultContainerEl) {
                            modal.resultContainerEl.scrollTop = currentScroll;
                        }
                    }, 150);
                }, 50); // Instantly reopen with full limit
                return;
            }

            const line = item.line;
            
            setTimeout(() => {
                view.editor.focus();

                editor.setCursor({ line: line, ch: 0 });
                editor.setSelection(
                    { line: line, ch: 0 }, 
                    { line: line, ch: editor.getLine(line).length }
                );

                editor.scrollIntoView({
                    from: { line: line, ch: 0 },
                    to: { line: line, ch: 0 }
                }, true);
            }, 150); 
        }
    }

    new SectionSearchModal(app, allLines).open();
};