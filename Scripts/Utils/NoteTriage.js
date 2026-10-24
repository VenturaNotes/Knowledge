module.exports = async function ({ app, obsidian }) {
    const { Notice, SuggestModal, TFile, parseFrontMatterAliases, setIcon, normalizePath } = obsidian;

    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.file || !activeView.editor) {
        new Notice("Please open a Markdown note to start triage.");
        return;
    }

    const editor = activeView.editor;
    const file = activeView.file;

    // --- 1. Universal Dynamic Block Scanner ---
    function scanAllBlocks(cursorLine = -1) {
        const lineCount = editor.lineCount();
        const blocks = [];
        let i = 0;

        while (i < lineCount) {
            const line = editor.getLine(i);
            const trimmed = line.trim();

            // Ignore blank lines, thematic breaks, and headings
            if (!trimmed || trimmed === '---' || trimmed === '***' || line.match(/^#{1,6}\s+/)) {
                i++;
                continue;
            }

            // A. Fenced Code Blocks (``` ... ```)
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
                blocks.push({ type: 'code', startLine, endLine: j - 1 });
                i = j;
                continue;
            }

            // B. List Items (Checkboxes, Bullets, Numbered Lists)
            const listMatch = line.match(/^(\s*)([-*+]|\d+[.)])(\s+\[[ xX/ -]\])?\s*/);
            if (listMatch) {
                const baseIndent = listMatch[1].length;
                const startLine = i;
                let endLine = i;
                let j = i + 1;
                let inSubCode = false;

                while (j < lineCount) {
                    const nextLine = editor.getLine(j);
                    const nextTrimmed = nextLine.trim();

                    if (nextLine.match(/^#{1,6}\s+/) || nextTrimmed === '---' || nextTrimmed === '***') break;

                    if (nextTrimmed.startsWith('```')) {
                        inSubCode = !inSubCode;
                        endLine = j;
                        j++;
                        continue;
                    }
                    if (inSubCode) {
                        endLine = j;
                        j++;
                        continue;
                    }

                    const nextIndent = nextLine.match(/^\s*/)[0].length;

                    // If empty line, check if cursor is on it or if followed by an indented child
                    if (!nextTrimmed) {
                        if (j === cursorLine) {
                            endLine = j;
                            j++;
                            continue;
                        }
                        let k = j + 1;
                        while (k < lineCount && !editor.getLine(k).trim()) k++;
                        if (k < lineCount && !editor.getLine(k).match(/^#{1,6}\s+/)) {
                            const peekIndent = editor.getLine(k).match(/^\s*/)[0].length;
                            if (peekIndent > baseIndent) {
                                endLine = j;
                                j++;
                                continue;
                            }
                        }
                        break;
                    }

                    // Absorb any line with deeper indent, or any line the cursor is currently editing
                    if (nextIndent > baseIndent || (j === cursorLine && nextIndent >= baseIndent)) {
                        endLine = j;
                        j++;
                    } else {
                        break;
                    }
                }

                blocks.push({
                    type: listMatch[3] ? 'task' : 'list',
                    startLine,
                    endLine
                });
                i = j;
                continue;
            }

            // C. Blockquotes (> ...)
            if (line.match(/^\s*>/)) {
                const startLine = i;
                let j = i + 1;
                while (j < lineCount) {
                    const nextLine = editor.getLine(j);
                    if (nextLine.match(/^\s*>/) || (nextLine.trim() && nextLine.startsWith('\t'))) {
                        j++;
                    } else {
                        break;
                    }
                }
                blocks.push({ type: 'quote', startLine, endLine: j - 1 });
                i = j;
                continue;
            }

            // D. Paragraphs / Notes / Logs
            {
                const startLine = i;
                let j = i + 1;
                while (j < lineCount) {
                    const nextLine = editor.getLine(j);
                    const nextTrimmed = nextLine.trim();

                    if (!nextTrimmed ||
                        nextLine.match(/^#{1,6}\s+/) ||
                        nextTrimmed === '---' ||
                        nextTrimmed === '***' ||
                        nextTrimmed.startsWith('```') ||
                        nextLine.match(/^(\s*)([-*+]|\d+[.)])(\s+\[[ xX/ -]\])?\s+/) ||
                        nextLine.match(/^\s*>/)
                    ) {
                        break;
                    }
                    j++;
                }
                blocks.push({ type: 'paragraph', startLine, endLine: j - 1 });
                i = j;
            }
        }
        return blocks;
    }

    let blocks = scanAllBlocks();
    if (blocks.length === 0) {
        new Notice("No triagable blocks found in this note.");
        return;
    }

    let currentIndex = 0;
    let isEditing = false;

    // Synchronizes the active pointer against the live document state
    function syncToLiveState(preferredLine) {
        const cursor = editor.getCursor();
        const activeLine = preferredLine !== undefined ? preferredLine : cursor.line;

        blocks = scanAllBlocks(activeLine);
        if (blocks.length === 0) {
            cleanup();
            new Notice("🎉 All items cleaned up!");
            return;
        }

        let foundIdx = blocks.findIndex(b => activeLine >= b.startLine && activeLine <= b.endLine);
        if (foundIdx === -1) {
            foundIdx = blocks.findIndex(b => b.startLine >= activeLine);
            if (foundIdx === -1) foundIdx = blocks.length - 1;
        }

        currentIndex = Math.max(0, Math.min(foundIdx, blocks.length - 1));
    }

    // --- 2. Destination Switcher Modal ('M') ---
    class DestinationModal extends SuggestModal {
        constructor(app, onChoose) {
            super(app);
            this.onChoose = onChoose;
            this.setPlaceholder("Move block to note... (Search or type to create)");
            this.recentPathsMap = new Map();
            (app.workspace.getLastOpenFiles() || []).forEach((path, idx) => this.recentPathsMap.set(path, idx));
        }

        getSuggestions(query) {
            const raw = query.trim().toLowerCase();
            const tokens = raw.split(/\s+/).filter(t => t.length > 0);
            const allFiles = app.vault.getMarkdownFiles().filter(f => f.path !== file.path);

            if (tokens.length === 0) {
                return allFiles
                    .sort((a, b) => {
                        const recA = this.recentPathsMap.get(a.path) ?? 999999;
                        const recB = this.recentPathsMap.get(b.path) ?? 999999;
                        if (recA !== recB) return recA - recB;
                        return (b.stat?.mtime ?? 0) - (a.stat?.mtime ?? 0);
                    })
                    .slice(0, 30)
                    .map(f => ({ file: f, isNew: false, title: f.basename }));
            }

            const results = [];
            for (const f of allFiles) {
                const basenameLower = f.basename.toLowerCase();
                const pathLower = f.path.toLowerCase();
                const cache = app.metadataCache.getFileCache(f);
                const rawAliases = parseFrontMatterAliases(cache?.frontmatter);
                const aliases = Array.isArray(rawAliases) ? rawAliases : [];

                const matchBase = tokens.every(t => basenameLower.includes(t));
                let matchedAlias = aliases.find(a => tokens.every(t => a.toLowerCase().includes(t)));
                const matchPath = tokens.every(t => `${basenameLower} ${pathLower}`.includes(t));

                if (!matchBase && !matchedAlias && !matchPath) continue;

                let score = 0;
                if (!matchBase && !matchedAlias) score += 100000;
                const recIndex = this.recentPathsMap.get(f.path) ?? 999999;
                if (recIndex !== 999999) score -= Math.max(0, 25000 - recIndex * 250);

                const targetText = matchedAlias || f.basename;
                if (targetText.toLowerCase() === raw) score -= 30000;
                else if (targetText.toLowerCase().startsWith(raw)) score -= 15000;

                results.push({ file: f, isNew: false, title: f.basename, matchedAlias, score });
            }

            results.sort((a, b) => a.score - b.score);
            const sliced = results.slice(0, 30);

            if (raw.length > 0 && !allFiles.some(f => f.basename.toLowerCase() === raw)) {
                sliced.unshift({ file: null, isNew: true, title: query.trim() });
            }
            return sliced;
        }

        renderSuggestion(item, el) {
            el.empty();
            el.addClass('lean-switcher-suggestion');

            if (item.isNew) {
                const row = el.createDiv({ cls: 'suggestion-title-row' });
                row.createSpan({ text: `+ Create & move to "${item.title}.md"`, attr: { style: 'color: var(--interactive-accent); font-weight: 700;' } });
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
            let destFile = item.file;
            if (item.isNew) {
                const cleanPath = normalizePath(`${item.title}.md`);
                try {
                    destFile = await app.vault.create(cleanPath, `# ${item.title}\n\n`);
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

    // --- 3. Left Indicator Bracket & HUD ---
    const scroller = activeView.contentEl.querySelector('.cm-scroller');
    if (!scroller) return;

    const indicatorEl = document.createElement('div');
    indicatorEl.className = 'triage-live-indicator';
    Object.assign(indicatorEl.style, {
        position: 'absolute',
        left: '12px',
        right: '12px',
        borderLeft: '5px solid var(--interactive-accent, #a855f7)',
        borderTop: '1px solid rgba(168, 85, 247, 0.35)',
        borderRight: '1px solid rgba(168, 85, 247, 0.35)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.35)',
        background: 'rgba(168, 85, 247, 0.05)',
        borderRadius: '6px',
        boxShadow: '0 0 14px rgba(168, 85, 247, 0.15)',
        pointerEvents: 'none',
        zIndex: '3',
        transition: 'top 0.08s ease-out, height 0.08s ease-out'
    });
    scroller.appendChild(indicatorEl);

    const hudEl = document.createElement('div');
    hudEl.className = 'triage-live-hud';
    Object.assign(hudEl.style, {
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--background-secondary)',
        border: '1px solid var(--background-modifier-border)',
        borderRadius: '8px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        zIndex: '100',
        fontSize: '12px',
        color: 'var(--text-muted)'
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
        const endCoords = cm.coordsAtPos(endPos);

        if (!startCoords || !endCoords) return;

        const scrollerRect = scroller.getBoundingClientRect();
        const top = startCoords.top - scrollerRect.top + scroller.scrollTop;
        const bottom = endCoords.bottom - scrollerRect.top + scroller.scrollTop;
        const height = Math.max(28, bottom - top);

        indicatorEl.style.top = `${top - 4}px`;
        indicatorEl.style.height = `${height + 8}px`;

        if (isEditing) {
            hudEl.innerHTML = `
                <span style="font-weight: 700; color: var(--text-warning);">✏️ In-Line Editing</span>
                <span style="color: var(--text-normal);">Adding notes or subtasks...</span>
                <span style="border-left: 1px solid var(--background-modifier-border); height: 14px;"></span>
                <span>Press <kbd>Esc</kbd> when finished to resume Triage hotkeys</span>
            `;
        } else {
            hudEl.innerHTML = `
                <span style="font-weight: 700; color: var(--text-normal);">📄 ${file.basename}</span>
                <span style="color: var(--text-accent); font-family: var(--font-monospace);">${currentIndex + 1} / ${blocks.length}</span>
                <span style="border-left: 1px solid var(--background-modifier-border); height: 14px;"></span>
                <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> Tag</span>
                <span><kbd>M</kbd> Move</span>
                <span><kbd>O</kbd> Add Line</span>
                <span><kbd>E</kbd> Edit</span>
                <span><kbd>D</kbd> Done</span>
                <span><kbd>X</kbd> Del</span>
                <span><kbd>J</kbd>/<kbd>K</kbd> Nav</span>
                <span><kbd>Esc</kbd> Exit</span>
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
        syncToLiveState();
        const next = currentIndex + delta;
        if (next >= 0 && next < blocks.length) {
            currentIndex = next;
            scrollToCurrent();
        }
    }

    function tagCurrent(tag) {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const line = editor.getLine(block.startLine);
        const clean = line.replace(/\s*#(high|medium|low)\b/gi, '');
        editor.setLine(block.startLine, `${clean} ${tag}`);
        step(1);
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

        syncToLiveState(block.startLine);
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
            const appended = existing.trimEnd() + '\n\n' + blockText + '\n';
            await app.vault.modify(destFile, appended);
            new Notice(`Moved to "${destFile.basename}"`);

            deleteCurrent();
        }).open();
    }

    function appendLineToCurrent() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        const endLineText = editor.getLine(block.endLine);

        let prefix = '\n';
        if (block.type === 'task' || block.type === 'list') {
            const indentMatch = endLineText.match(/^(\s*)/);
            const indent = indentMatch && indentMatch[1].length > 0 ? indentMatch[1] : '\t';
            prefix = `\n${indent}- [ ] `;
        }

        editor.replaceRange(prefix, { line: block.endLine, ch: endLineText.length });
        const targetLine = block.endLine + 1;
        editor.setCursor({ line: targetLine, ch: editor.getLine(targetLine).length });

        isEditing = true;
        syncToLiveState(targetLine);
        requestAnimationFrame(() => updateIndicator());
    }

    function enterEditMode() {
        if (blocks.length === 0) return;
        const block = blocks[currentIndex];
        editor.setCursor({ line: block.startLine, ch: editor.getLine(block.startLine).length });
        isEditing = true;
        updateIndicator();
    }

    // --- 4. Live Observers & Event Listeners ---
    const onKeyDown = (e) => {
        if (isEditing) {
            if (e.key === 'Escape') {
                e.preventDefault();
                isEditing = false;
                const cursor = editor.getCursor();
                syncToLiveState(cursor.line);
                scrollToCurrent();
            }
            return;
        }

        if (document.querySelector('.modal-container')) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;

        const key = e.key.toLowerCase();

        switch (key) {
            case '1':
                e.preventDefault();
                tagCurrent('#high');
                break;
            case '2':
                e.preventDefault();
                tagCurrent('#medium');
                break;
            case '3':
                e.preventDefault();
                tagCurrent('#low');
                break;
            case 'd':
                e.preventDefault();
                toggleDone();
                break;
            case 'x':
                e.preventDefault();
                deleteCurrent();
                break;
            case 'm':
                e.preventDefault();
                moveCurrent();
                break;
            case 'o':
                e.preventDefault();
                appendLineToCurrent();
                break;
            case 'e':
                e.preventDefault();
                enterEditMode();
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
        }
    };

    // Live sync callback for CodeMirror layout reflows
    const onLiveEditorChange = () => {
        requestAnimationFrame(() => {
            const cursor = editor.getCursor();
            syncToLiveState(cursor.line);
            updateIndicator();
        });
    };

    const onScroll = () => {
        updateIndicator();
    };

    // MutationObserver watches CodeMirror 6 DOM insertions (like Enter, Backspace, or typing)
    const contentDOM = editor.cm?.contentDOM;
    let observer = null;
    if (contentDOM) {
        observer = new MutationObserver(() => onLiveEditorChange());
        observer.observe(contentDOM, { childList: true, subtree: true, characterData: true });
        contentDOM.addEventListener('keyup', onLiveEditorChange);
        contentDOM.addEventListener('click', onLiveEditorChange);
    }

    function cleanup() {
        window.removeEventListener('keydown', onKeyDown, true);
        scroller.removeEventListener('scroll', onScroll);
        if (contentDOM) {
            contentDOM.removeEventListener('keyup', onLiveEditorChange);
            contentDOM.removeEventListener('click', onLiveEditorChange);
        }
        if (observer) {
            observer.disconnect();
        }
        indicatorEl.remove();
        hudEl.remove();
    }

    window.addEventListener('keydown', onKeyDown, true);
    scroller.addEventListener('scroll', onScroll, { passive: true });

    scrollToCurrent();
};