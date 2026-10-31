module.exports = async function ({ app, obsidian }) {
    const { Modal, Notice, Setting, SuggestModal, TFile, parseFrontMatterAliases, setIcon, normalizePath } = obsidian;

    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.file || !activeView.editor) {
        new Notice("Please open a Markdown note to start triage.");
        return;
    }

    const editor = activeView.editor;
    const file = activeView.file;
    const targetLeaf = activeView.leaf; // Pin triage to this exact leaf/tab

    // Track modal close timing to prevent leaked 'Enter' events from triggering Edit mode
    let lastModalCloseTime = 0;

    function getIndent(line) {
        const leading = line.match(/^\s*/)[0];
        return leading.replace(/\t/g, '    ').length;
    }

    // Helper: Inserts content at the top of a file, directly above the next line (no blank line gap)
    function insertBelowFrontmatter(existingContent, blockText) {
        const cleanBlock = blockText.trimEnd();
        const fmMatch = existingContent.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);

        if (fmMatch) {
            const fmLength = fmMatch[0].length;
            const frontmatter = existingContent.slice(0, fmLength);
            const rest = existingContent.slice(fmLength).trimStart();

            if (rest.length === 0) {
                return `${frontmatter}\n${cleanBlock}\n`;
            }
            return `${frontmatter}\n${cleanBlock}\n${rest}`;
        } else {
            const trimmed = existingContent.trimStart();
            if (trimmed.length === 0) {
                return `${cleanBlock}\n`;
            }
            return `${cleanBlock}\n${trimmed}`;
        }
    }

    // --- 1. Universal Scanner (Skips YAML Frontmatter) ---
    function scanBlocks() {
        const lineCount = editor.lineCount();
        const blocks = [];
        let i = 0;

        // Skip YAML Frontmatter / Properties at the top of the file
        if (lineCount > 0 && editor.getLine(0).trim() === '---') {
            for (let k = 1; k < lineCount; k++) {
                if (editor.getLine(k).trim() === '---') {
                    i = k + 1;
                    break;
                }
            }
        }

        while (i < lineCount) {
            const line = editor.getLine(i);
            const trimmed = line.trim();

            if (!trimmed || trimmed === '---' || trimmed === '***' || line.match(/^#{1,6}\s+/)) {
                i++;
                continue;
            }

            // Fenced Code Blocks (``` ... ```)
            if (trimmed.startsWith('```')) {
                const startLine = i;
                let j = i + 1;
                while (j < lineCount) {
                    if (editor.getLine(j).trim().startsWith('```')) {
                        j++;
                        break;
                    }
                    j++;
                }
                blocks.push({ startLine, endLine: j - 1 });
                i = j;
                continue;
            }

            // Parent Item (Tasks, Bullets, Paragraphs, Quotes)
            const startLine = i;
            const parentIndent = getIndent(line);
            let endLine = i;
            let j = i + 1;

            while (j < lineCount) {
                const nextLine = editor.getLine(j);
                const nextTrimmed = nextLine.trim();

                if (nextLine.match(/^#{1,6}\s+/) || nextTrimmed === '---' || nextTrimmed === '***') {
                    break;
                }

                if (!nextTrimmed) {
                    let hasChildrenAhead = false;
                    for (let k = j + 1; k < lineCount; k++) {
                        const peekLine = editor.getLine(k);
                        if (!peekLine.trim()) continue;
                        if (peekLine.match(/^#{1,6}\s+/) || peekLine.trim() === '---') break;
                        if (getIndent(peekLine) > parentIndent) {
                            hasChildrenAhead = true;
                        }
                        break;
                    }
                    if (hasChildrenAhead) {
                        endLine = j;
                        j++;
                        continue;
                    } else {
                        break;
                    }
                }

                if (getIndent(nextLine) > parentIndent) {
                    endLine = j;
                    j++;
                } else {
                    break;
                }
            }

            blocks.push({ startLine, endLine });
            i = j;
        }
        return blocks;
    }

    let blocks = scanBlocks();
    if (blocks.length === 0) {
        new Notice("No triagable items found in this note.");
        return;
    }

    let currentIndex = 0;
    let isEditing = false;

    function syncToCursor() {
        const cursor = editor.getCursor();
        blocks = scanBlocks();
        if (blocks.length === 0) {
            cleanup();
            new Notice("🎉 All items cleaned up!");
            return;
        }

        let foundIdx = blocks.findIndex(b => cursor.line >= b.startLine && cursor.line <= b.endLine);
        if (foundIdx === -1) {
            foundIdx = blocks.findIndex(b => b.startLine >= cursor.line);
            if (foundIdx === -1) foundIdx = blocks.length - 1;
        }

        currentIndex = Math.max(0, Math.min(foundIdx, blocks.length - 1));
    }

    // --- 2. Assign Date & Time Modal ('T') ---
    class AssignDateTimeModal extends Modal {
        constructor(app, initialValues, onResolve) {
            super(app);
            this.date = initialValues.date;
            this.time = initialValues.time;
            this.recurrence = initialValues.recurrence;
            this.submitted = false;
            this.onResolve = onResolve;
        }

        onOpen() {
            const { contentEl } = this;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Assign Date & Time" });

            // Shortcut: Cmd/Ctrl + Enter to apply
            this.scope.register(["Mod"], "Enter", (e) => {
                e.preventDefault();
                this.submitted = true;
                this.close();
            });

            const form = contentEl.createDiv();
            Object.assign(form.style, {
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "4px 0 12px 0"
            });

            const makeRow = (labelText, descText) => {
                const row = form.createDiv();
                Object.assign(row.style, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px"
                });

                const labelWrap = row.createDiv();
                labelWrap.createEl("div", { text: labelText, cls: "setting-item-name" });
                labelWrap.createEl("div", { text: descText, cls: "setting-item-description" });
                return row;
            };

            // Recurrence row
            const recurrenceRow = makeRow("Recurrence (Optional)", "Empty = No 🔁 icon");
            const recurrenceInput = recurrenceRow.createEl("input", {
                type: "text",
                value: this.recurrence,
                placeholder: "e.g., every day"
            });
            Object.assign(recurrenceInput.style, { padding: "4px 8px", width: "140px", flexShrink: "0" });
            recurrenceInput.onchange = (e) => (this.recurrence = e.target.value);

            // Date row (Fixed padding-left to 30px so digits never overlap the calendar icon)
            const dateRow = makeRow("Date", "Pick a date");
            const dateInput = dateRow.createEl("input", {
                type: "date",
                value: this.date
            });
            Object.assign(dateInput.style, {
                padding: "4px 8px 4px 30px",
                width: "140px",
                flexShrink: "0"
            });
            dateInput.onchange = (e) => (this.date = e.target.value);

            // Time row
            const timeRow = makeRow("Time (Optional)", "Empty = No ⏰ icon");
            const timeInput = timeRow.createEl("input", {
                type: "time",
                value: this.time
            });
            Object.assign(timeInput.style, { padding: "4px 8px", width: "125px", flexShrink: "0" });
            timeInput.onchange = (e) => (this.time = e.target.value);

            setTimeout(() => timeInput.focus(), 20);

            new Setting(contentEl).addButton((btn) =>
                btn
                    .setButtonText("Apply (Cmd+Enter)")
                    .setCta()
                    .onClick(() => {
                        this.submitted = true;
                        this.close();
                    })
            );
        }

        onClose() {
            super.onClose();
            lastModalCloseTime = Date.now();
            if (this.submitted) {
                this.onResolve({ date: this.date, time: this.time, recurrence: this.recurrence });
            } else {
                this.onResolve(null);
            }
        }
    }

    async function assignDateTimeCurrent() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const lineText = editor.getLine(block.startLine);
        const moment = window.moment;

        // (1) Parse existing date
        let defaultDate = moment().format("YYYY-MM-DD");
        const dateMatch = lineText.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
        if (dateMatch && dateMatch[1]) {
            defaultDate = dateMatch[1];
        }

        // (2) Parse existing time
        let defaultTime = "";
        const timeMatch = lineText.match(/⏰\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
        if (timeMatch && timeMatch[1]) {
            const parsedTime = moment(timeMatch[1].trim(), ["h:mmA", "HH:mm", "h:mm A"]);
            if (parsedTime.isValid()) {
                defaultTime = parsedTime.format("HH:mm");
            }
        }

        // (3) Parse existing recurrence
        let defaultRecurrence = "";
        const recurrenceMatch = lineText.match(/🔁\s*([^📅⏰\n^]+)/);
        if (recurrenceMatch && recurrenceMatch[1]) {
            defaultRecurrence = recurrenceMatch[1].trim();
        }

        const result = await new Promise((resolve) => {
            new AssignDateTimeModal(
                app,
                { date: defaultDate, time: defaultTime, recurrence: defaultRecurrence },
                resolve
            ).open();
        });

        if (!result || !result.date) return;

        // (4) Detect trailing block anchor
        const anchorMatch = lineText.match(/(\s*\^[a-zA-Z0-9-]+)\s*$/);
        const anchorSuffix = anchorMatch?.[1]?.trim() ?? "";

        // (5) Strip previous schedule tags and temporary block anchor
        const cleanText = lineText
            .replace(/(\s*\^[a-zA-Z0-9-]+)\s*$/, "")
            .replace(/🔁\s*[^📅⏰\n^]+/g, "")
            .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
            .replace(/⏰\s*\d{1,2}:\d{2}(?:\s*[APMapm]{2})?/gi, "")
            .trimEnd();

        let recurrenceString = result.recurrence ? ` 🔁 ${result.recurrence.trim()}` : "";
        const dateString = ` 📅 ${result.date}`;
        let timeString = result.time ? ` ⏰ ${moment(result.time, "HH:mm").format("h:mmA")}` : "";
        let anchorPart = anchorSuffix ? (anchorSuffix.startsWith("^") ? ` ${anchorSuffix}` : ` ^${anchorSuffix}`) : "";

        // Assemble components: text -> recurrence -> date -> time -> anchor
        const newText = `${cleanText}${recurrenceString}${dateString}${timeString}${anchorPart}`;

        editor.setLine(block.startLine, newText);
        requestAnimationFrame(() => updateIndicator());
    }

    // --- 3. Destination Switcher Modal ('Q') ---
    class DestinationModal extends SuggestModal {
        constructor(app, onChoose) {
            super(app);
            this.onChoose = onChoose;
            this.setPlaceholder("Move block to note... (Search or type to create)");
            this.recentPathsMap = new Map();
            (app.workspace.getLastOpenFiles() || []).forEach((path, idx) => this.recentPathsMap.set(path, idx));

            this.scope.register(['Shift'], 'Enter', (evt) => {
                evt.preventDefault();
                const rawInput = this.inputEl.value.trim();
                if (rawInput) {
                    this.close();
                    this.onChooseSuggestion({ file: null, isNew: true, title: rawInput });
                }
            });
        }

        onClose() {
            super.onClose();
            lastModalCloseTime = Date.now();
        }

        getSuggestions(query) {
            const raw = query.trim().toLowerCase();
            const tokens = raw.split(/\s+/).filter(t => t.length > 0);
            const allFiles = app.vault.getMarkdownFiles().filter(f => f.path !== file.path);

            // 1. EMPTY QUERY: Purely sorted by stat.mtime (most recently modified note on disk is #1)
            if (tokens.length === 0) {
                return allFiles
                    .sort((a, b) => {
                        const mtimeA = a.stat?.mtime ?? 0;
                        const mtimeB = b.stat?.mtime ?? 0;
                        if (mtimeB !== mtimeA) return mtimeB - mtimeA;

                        const lenA = a.basename.length;
                        const lenB = b.basename.length;
                        if (lenA !== lenB) return lenA - lenB;

                        return a.basename.localeCompare(b.basename);
                    })
                    .slice(0, 40)
                    .map(file => {
                        const cache = app.metadataCache.getFileCache(file);
                        const rawAliases = parseFrontMatterAliases(cache?.frontmatter);
                        const allAliases = Array.isArray(rawAliases) ? rawAliases : [];

                        return {
                            file,
                            matchedAlias: allAliases.length > 0 ? allAliases[0] : undefined,
                            allAliases,
                            isNew: false,
                            title: file.basename,
                            tokens: []
                        };
                    });
            }

            // 2. SEARCH QUERY MATCHING (Exact LeanSwitcher Scoring Algorithm)
            const firstToken = tokens[0] ?? '';
            const results = [];

            for (const file of allFiles) {
                const basenameLower = file.basename.toLowerCase();
                const pathLower = file.path.toLowerCase();
                const fileText = `${basenameLower} ${pathLower}`;

                const cache = app.metadataCache.getFileCache(file);
                const rawAliases = parseFrontMatterAliases(cache?.frontmatter);
                const allAliases = Array.isArray(rawAliases) ? rawAliases : [];

                const basenameMatches = tokens.every(t => basenameLower.includes(t));

                let matchedAlias;
                let aliasMatches = false;
                for (const alias of allAliases) {
                    const aliasLower = alias.toLowerCase();
                    if (tokens.every(t => aliasLower.includes(t))) {
                        matchedAlias = alias;
                        aliasMatches = true;
                        break;
                    }
                }

                const pathMatches = tokens.every(t => fileText.includes(t));

                if (!basenameMatches && !aliasMatches && !pathMatches) continue;

                const isDirectMatch = basenameMatches || aliasMatches;
                const isAliasMatch = !basenameMatches && aliasMatches;

                if (basenameMatches && allAliases.length > 0 && !matchedAlias) {
                    matchedAlias = allAliases[0];
                }

                let score = 0;

                if (isDirectMatch) {
                    score += 0;
                } else {
                    score += 100000;
                }

                const isRecent = this.recentPathsMap.has(file.path);
                const recentIndex = this.recentPathsMap.get(file.path) ?? 999999;
                if (isRecent) {
                    score -= Math.max(0, 25000 - recentIndex * 250);
                }

                const targetText = isAliasMatch && matchedAlias ? matchedAlias : file.basename;
                const targetLower = targetText.toLowerCase();

                const strippedTarget = targetLower.replace(/^\([a-z0-9]+\)\s*/i, '');

                if (targetLower === raw || strippedTarget === raw) {
                    score -= 30000;
                } else if (targetLower.startsWith(raw) || strippedTarget.startsWith(raw)) {
                    score -= 15000;
                } else if (targetLower.includes(raw) || strippedTarget.includes(raw)) {
                    score -= 8000;
                }

                const words = targetLower.split(/[\s_\-()]+/);
                if (words.some(w => w.startsWith(firstToken))) {
                    score -= 5000;
                }

                score += targetText.length * 2;

                const mtime = file.stat?.mtime ?? 0;
                score -= Math.min(500, mtime / 10000000000);

                results.push({
                    file,
                    matchedAlias,
                    allAliases,
                    isNew: false,
                    title: file.basename,
                    score,
                    tokens
                });
            }

            results.sort((a, b) => {
                if (a.score !== b.score) return a.score - b.score;

                const lenA = a.file.basename.length;
                const lenB = b.file.basename.length;
                if (lenA !== lenB) return lenA - lenB;

                return a.file.basename.localeCompare(b.file.basename);
            });

            const sliced = results.slice(0, 40);

            const exactExists = allFiles.some(f => f.basename.toLowerCase() === raw);
            if (raw.length > 0 && !exactExists) {
                const createOption = { file: null, isNew: true, title: query.trim() };
                if (sliced.length === 0) {
                    sliced.unshift(createOption);
                } else {
                    sliced.push(createOption);
                }
            }

            return sliced;
        }

        renderSuggestion(item, el) {
            el.empty();
            el.addClass('lean-switcher-suggestion');

            if (item.isNew) {
                const row = el.createDiv({ cls: 'suggestion-title-row' });
                row.createSpan({ text: `+ Create & move to "${item.title}.md"`, attr: { style: 'color: var(--interactive-accent); font-weight: 700;' } });
                const pathRow = el.createDiv({ cls: 'suggestion-sub-row' });
                pathRow.createSpan({ text: 'Press Shift+Enter to create immediately', cls: 'suggestion-sub-text' });
                return;
            }

            const titleRow = el.createDiv({ cls: 'suggestion-title-row' });
            titleRow.createSpan({ text: item.title, cls: 'suggestion-title-text' });

            const pathRow = el.createDiv({ cls: 'suggestion-sub-row' });
            const folderIcon = pathRow.createSpan({ cls: 'suggestion-inline-icon' });
            setIcon(folderIcon, 'folder');
            pathRow.createSpan({ text: item.file.parent?.path || 'Vault Root', cls: 'suggestion-sub-text' });

            if (item.matchedAlias) {
                const aliasRow = el.createDiv({ cls: 'suggestion-sub-row' });
                const arrowIcon = aliasRow.createSpan({ cls: 'suggestion-inline-icon' });
                setIcon(arrowIcon, 'forward');
                aliasRow.createSpan({ text: item.matchedAlias, cls: 'suggestion-sub-text' });
            }
        }

        async onChooseSuggestion(item) {
            lastModalCloseTime = Date.now();
            let destFile = item.file;
            if (item.isNew) {
                const cleanPath = normalizePath(`${item.title}.md`);
                try {
                    destFile = await app.vault.create(cleanPath, '');
                } catch (e) {
                    new Notice(`Failed to create file: ${e.message}`);
                    return;
                }
            }
            if (destFile instanceof TFile) {
                await this.onChoose(destFile);
            }
        }
    }

    // --- 4. Indicator Bracket & Horizontally Stretched HUD ---
    const scroller = activeView.contentEl.querySelector('.cm-scroller');
    if (!scroller) return;

    const indicatorEl = document.createElement('div');
    indicatorEl.className = 'triage-live-indicator';
    Object.assign(indicatorEl.style, {
        position: 'absolute',
        left: '12px',
        right: '12px',
        borderRadius: '6px',
        pointerEvents: 'none',
        zIndex: '3',
        transition: 'top 0.08s ease-out, height 0.08s ease-out, border-color 0.15s ease'
    });
    scroller.appendChild(indicatorEl);

    const hudEl = document.createElement('div');
    hudEl.className = 'triage-live-hud';
    Object.assign(hudEl.style, {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--background-secondary)',
        border: '1px solid var(--background-modifier-border)',
        borderRadius: '8px',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: '100',
        fontSize: '12px',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        width: 'max-content',
        maxWidth: 'calc(100% - 32px)',
        overflowX: 'auto',
        flexWrap: 'nowrap',
        userSelect: 'none'
    });
    activeView.contentEl.appendChild(hudEl);

    function updateIndicator() {
        if (blocks.length === 0 || currentIndex >= blocks.length) return;

        const block = blocks[currentIndex];
        const cm = editor.cm;
        if (!cm) return;

        const startPos = editor.posToOffset({ line: block.startLine, ch: 0 });
        const endLineLength = editor.getLine(block.endLine)?.length ?? 0;
        const endPos = editor.posToOffset({ line: block.endLine, ch: endLineLength });

        const startCoords = cm.coordsAtPos(startPos);
        let endCoords = cm.coordsAtPos(endPos);
        if (!endCoords && endPos > 0) {
            endCoords = cm.coordsAtPos(endPos - 1);
        }

        if (!startCoords || !endCoords) return;

        const scrollerRect = scroller.getBoundingClientRect();
        const top = startCoords.top - scrollerRect.top + scroller.scrollTop;
        const bottom = Math.max(endCoords.bottom, startCoords.bottom) - scrollerRect.top + scroller.scrollTop;
        const height = Math.max(28, bottom - top);

        indicatorEl.style.top = `${top - 4}px`;
        indicatorEl.style.height = `${height + 8}px`;

        if (isEditing) {
            indicatorEl.style.borderLeft = '5px solid var(--text-warning, #f59e0b)';
            indicatorEl.style.borderTop = '1px solid rgba(245, 158, 11, 0.35)';
            indicatorEl.style.borderRight = '1px solid rgba(245, 158, 11, 0.35)';
            indicatorEl.style.borderBottom = '1px solid rgba(245, 158, 11, 0.35)';
            indicatorEl.style.background = 'rgba(245, 158, 11, 0.05)';
            indicatorEl.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.15)';

            hudEl.innerHTML = `
                <span style="font-weight: 700; color: var(--text-warning); white-space: nowrap;">✏️ EDIT MODE</span>
                <span style="color: var(--text-normal); white-space: nowrap;">Typing enabled</span>
                <span style="border-left: 1px solid var(--background-modifier-border); height: 14px; flex-shrink: 0;"></span>
                <span style="white-space: nowrap;">Press <kbd>Esc</kbd> for Triage Mode</span>
                <span style="color: var(--text-muted); white-space: nowrap;">(or use Alt+T, Alt+Q, Alt+H/M/L)</span>
            `;
        } else {
            indicatorEl.style.borderLeft = '5px solid var(--interactive-accent, #a855f7)';
            indicatorEl.style.borderTop = '1px solid rgba(168, 85, 247, 0.35)';
            indicatorEl.style.borderRight = '1px solid rgba(168, 85, 247, 0.35)';
            indicatorEl.style.borderBottom = '1px solid rgba(168, 85, 247, 0.35)';
            indicatorEl.style.background = 'rgba(168, 85, 247, 0.05)';
            indicatorEl.style.boxShadow = '0 0 14px rgba(168, 85, 247, 0.15)';

            hudEl.innerHTML = `
                <span style="font-weight: 700; color: var(--text-normal); max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0;">📄 ${file.basename}</span>
                <span style="color: var(--text-accent); font-family: var(--font-monospace); white-space: nowrap; flex-shrink: 0;">${currentIndex + 1} / ${blocks.length}</span>
                <span style="border-left: 1px solid var(--background-modifier-border); height: 14px; flex-shrink: 0;"></span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>T</kbd> Date</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>H</kbd><kbd>M</kbd><kbd>L</kbd> Tag</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>Q</kbd> Move</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>D</kbd> Done</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>X</kbd> Del</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>J</kbd>/<kbd>K</kbd> Nav</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>Enter</kbd> Edit</span>
                <span style="white-space: nowrap; flex-shrink: 0;"><kbd>Esc</kbd> Exit</span>
            `;
        }
    }

    function scrollToCurrent() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const endLineLen = editor.getLine(block.endLine)?.length ?? 0;

        editor.scrollIntoView({
            from: { line: block.startLine, ch: 0 },
            to: { line: block.endLine, ch: endLineLen }
        }, true);

        requestAnimationFrame(() => updateIndicator());
    }

    function step(delta) {
        syncToCursor();
        const next = currentIndex + delta;
        if (next >= 0 && next < blocks.length) {
            currentIndex = next;
            const target = blocks[currentIndex];
            editor.setCursor({ line: target.startLine, ch: 0 });
            scrollToCurrent();
        }
    }

    function tagCurrent(tag) {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const line = editor.getLine(block.startLine);
        const clean = line.replace(/\s*#(high|medium|low)\b/gi, '');
        editor.setLine(block.startLine, `${clean} ${tag}`);
        requestAnimationFrame(() => updateIndicator());
    }

    function toggleDone() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const line = editor.getLine(block.startLine);
        let updated;

        if (line.includes('- [x]')) {
            updated = line.replace(/- \[x\]/i, '- [ ]');
        } else if (line.includes('- [ ]')) {
            updated = line.replace(/- \[ \]/i, '- [x]');
        } else if (line.match(/^(\s*)[-*+]\s+/)) {
            updated = line.replace(/^(\s*)[-*+]\s+/, '$1- [x] ');
        } else {
            updated = `${line} ✅`;
        }

        editor.setLine(block.startLine, updated);
        requestAnimationFrame(() => updateIndicator());
    }

    function deleteCurrent() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const lineCount = editor.lineCount();

        if (block.endLine + 1 < lineCount) {
            editor.replaceRange('', { line: block.startLine, ch: 0 }, { line: block.endLine + 1, ch: 0 });
        } else {
            const prevLineCh = block.startLine > 0 ? editor.getLine(block.startLine - 1).length : 0;
            editor.replaceRange('', { line: Math.max(0, block.startLine - 1), ch: prevLineCh }, { line: block.endLine, ch: editor.getLine(block.endLine).length });
        }

        isEditing = false;
        syncToCursor();
        scrollToCurrent();
    }

    function moveCurrent() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const blockText = editor.getRange(
            { line: block.startLine, ch: 0 },
            { line: block.endLine, ch: editor.getLine(block.endLine).length }
        );

        new DestinationModal(app, async (destFile) => {
            const existing = await app.vault.read(destFile);
            const updated = insertBelowFrontmatter(existing, blockText);
            await app.vault.modify(destFile, updated);
            new Notice(`Moved block to "${destFile.basename}"`);

            isEditing = false;
            deleteCurrent();
        }).open();
    }

    // --- 5. Event Routing (Guarded to Target Note/Tab Only) ---
    const onKeyDown = (e) => {
        // 1. MUST be the exact tab and file where triage was initiated
        const currentView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!currentView || currentView.leaf !== targetLeaf || currentView.file?.path !== file.path) {
            return;
        }

        // 2. Yield control if a modal (e.g. DestinationModal or AssignDateTimeModal) is active
        if (document.querySelector('.modal-container')) return;

        // 3. Block leaked Enter keydown right after closing modal
        if (Date.now() - lastModalCloseTime < 350) {
            if (e.key === 'Enter') {
                e.preventDefault();
                return;
            }
        }

        // 4. Do not intercept if focus is inside an input or textarea
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
            return;
        }

        const key = e.key.toLowerCase();
        const isAlt = e.altKey;

        // Universal Alt/Option shortcuts (active in both Triage and Edit modes)
        if (isAlt) {
            if (key === 't') { e.preventDefault(); assignDateTimeCurrent(); return; }
            if (key === 'h') { e.preventDefault(); tagCurrent('#high'); return; }
            if (key === 'm') { e.preventDefault(); tagCurrent('#medium'); return; }
            if (key === 'l') { e.preventDefault(); tagCurrent('#low'); return; }
            if (key === 'q') { e.preventDefault(); moveCurrent(); return; }
            if (key === 'd') { e.preventDefault(); toggleDone(); return; }
            if (key === 'x' || e.key === 'Backspace') { e.preventDefault(); deleteCurrent(); return; }
            if (key === 'j' || key === 'arrowdown') { e.preventDefault(); step(1); return; }
            if (key === 'k' || key === 'arrowup') { e.preventDefault(); step(-1); return; }
        }

        // --- EDIT MODE BEHAVIOR ---
        if (isEditing) {
            if (e.key === 'Escape') {
                e.preventDefault();
                isEditing = false;
                syncToCursor();
                updateIndicator();
            }
            return;
        }

        // --- TRIAGE MODE BEHAVIOR ---
        if (e.metaKey || e.ctrlKey) return;

        switch (key) {
            case 'enter':
            case 'i':
                e.preventDefault();
                isEditing = true;
                const block = blocks[currentIndex];
                editor.setCursor({ line: block.startLine, ch: editor.getLine(block.startLine).length });
                updateIndicator();
                break;
            case 't':
                e.preventDefault();
                assignDateTimeCurrent();
                break;
            case 'h':
                e.preventDefault();
                tagCurrent('#high');
                break;
            case 'm':
                e.preventDefault();
                tagCurrent('#medium');
                break;
            case 'l':
                e.preventDefault();
                tagCurrent('#low');
                break;
            case 'q':
                e.preventDefault();
                moveCurrent();
                break;
            case 'd':
                e.preventDefault();
                toggleDone();
                break;
            case 'x':
                e.preventDefault();
                deleteCurrent();
                break;
            case 'j':
            case 'arrowdown':
                e.preventDefault();
                step(1);
                break;
            case 'k':
            case 'arrowup':
                e.preventDefault();
                step(-1);
                break;
            case 'escape':
                e.preventDefault();
                cleanup();
                new Notice("Exited Triage Mode.");
                break;
            default:
                if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                }
                break;
        }
    };

    const onLiveUpdate = () => {
        requestAnimationFrame(() => {
            syncToCursor();
            updateIndicator();
        });
    };

    const contentDOM = editor.cm?.contentDOM;
    let observer = null;
    if (contentDOM) {
        observer = new MutationObserver(() => onLiveUpdate());
        observer.observe(contentDOM, { childList: true, subtree: true, characterData: true });
        contentDOM.addEventListener('keyup', onLiveUpdate);

        contentDOM.addEventListener('click', () => {
            isEditing = true;
            onLiveUpdate();
        });
    }

    // --- 6. Workspace Lifecycle Observers ---
    const leafChangeRef = app.workspace.on('active-leaf-change', (leaf) => {
        if (!leaf || leaf !== targetLeaf) {
            indicatorEl.style.display = 'none';
            hudEl.style.display = 'none';
        } else {
            indicatorEl.style.display = '';
            hudEl.style.display = '';
            requestAnimationFrame(() => updateIndicator());
        }
    });

    const layoutChangeRef = app.workspace.on('layout-change', () => {
        if (!targetLeaf.workspace) {
            cleanup();
        }
    });

    function cleanup() {
        window.removeEventListener('keydown', onKeyDown, true);
        scroller.removeEventListener('scroll', updateIndicator);
        if (contentDOM) {
            contentDOM.removeEventListener('keyup', onLiveUpdate);
        }
        if (observer) {
            observer.disconnect();
        }
        if (leafChangeRef) {
            app.workspace.offref(leafChangeRef);
        }
        if (layoutChangeRef) {
            app.workspace.offref(layoutChangeRef);
        }
        indicatorEl.remove();
        hudEl.remove();
    }

    window.addEventListener('keydown', onKeyDown, true);
    scroller.addEventListener('scroll', updateIndicator, { passive: true });

    // Initial positioning
    const initialCursor = editor.getCursor();
    if (blocks.length > 0 && initialCursor.line < blocks[0].startLine) {
        currentIndex = 0;
        editor.setCursor({ line: blocks[0].startLine, ch: 0 });
    } else {
        syncToCursor();
    }
    scrollToCurrent();
};