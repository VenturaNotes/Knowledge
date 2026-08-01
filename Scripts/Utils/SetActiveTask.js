module.exports = async function ({ app, obsidian }) {
    // Purge any old status bar element if one still exists
    const oldStatus = document.getElementById('active-task-status-item');
    if (oldStatus) oldStatus.remove();

    // ─── 1. Get Category Tag ───
    const TAG_NAME = '#active-task';

    function getTagRegex() {
        const escaped = TAG_NAME.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        return new RegExp(escaped + '\\s*', 'gi'); // Case-insensitive tag strip
    }

    // Checks if the tag is a genuine tag on a live editor line (ignores backticks, HTML comments, and is case-insensitive)
    function isRealTag(line, tag) {
        const parts = line.split('`');
        const lowerTag = tag.toLowerCase();
        for (let i = 0; i < parts.length; i += 2) {
            const segment = parts[i].toLowerCase();
            if (segment.includes(lowerTag)) {
                const cleanSegment = segment.replace(/<!--[\s\S]*?-->/g, '');
                if (cleanSegment.includes(lowerTag)) {
                    return true;
                }
            }
        }
        return false;
    }

    // ─── 2. Get Currently Focused Editor (Prioritizes VaporNote Overlay) ───
    function getCurrentlyFocusedEditor() {
        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (vaporPlugin && typeof vaporPlugin._isOpen === 'function' && vaporPlugin._isOpen() && !vaporPlugin._isMinimized) {
            const activeVaporLeaf = vaporPlugin.floatingLeaves ? vaporPlugin.floatingLeaves[vaporPlugin.activeLeafIndex] : null;
            if (activeVaporLeaf && activeVaporLeaf.view && activeVaporLeaf.view.editor) {
                const doc = activeVaporLeaf.containerEl ? activeVaporLeaf.containerEl.ownerDocument : document;
                if ((activeVaporLeaf.containerEl && activeVaporLeaf.containerEl.contains(doc.activeElement)) || vaporPlugin._isVaporActive) {
                    return { editor: activeVaporLeaf.view.editor, file: activeVaporLeaf.view.file };
                }
            }
        }

        const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (activeView && activeView.editor && activeView.file) {
            return { editor: activeView.editor, file: activeView.file };
        }

        return null;
    }

    // ─── 3. Helper: Search for Open Editor Instance Across Workspace ───
    function findEditorForFile(filePath) {
        let foundEditor = null;
        app.workspace.iterateRootLeaves(function (leaf) {
            if (leaf.view && leaf.view.file && leaf.view.file.path === filePath && leaf.view.editor) {
                foundEditor = leaf.view.editor;
            }
        });
        if (foundEditor) return foundEditor;

        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (vaporPlugin && vaporPlugin.floatingLeaves) {
            for (let i = 0; i < vaporPlugin.floatingLeaves.length; i++) {
                const leaf = vaporPlugin.floatingLeaves[i];
                if (leaf.view && leaf.view.file && leaf.view.file.path === filePath && leaf.view.editor) {
                    return leaf.view.editor;
                }
            }
        }

        return null;
    }

    // ─── 4. Search Live RAM Editors + Metadata Cache for Real Tag Matches ───
    function findAllActiveTaskMatches(activeFilePath) {
        const matches = [];

        function scanEditor(file, editor) {
            if (!file || !editor) return;
            const lineCount = editor.lineCount();
            for (let i = 0; i < lineCount; i++) {
                const line = editor.getLine(i) || "";
                if (line.toLowerCase().includes(TAG_NAME.toLowerCase()) && isRealTag(line, TAG_NAME)) {
                    matches.push({ file: file, lineIdx: i, editor: editor });
                }
            }
        }

        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (vaporPlugin && vaporPlugin.floatingLeaves) {
            for (let i = 0; i < vaporPlugin.floatingLeaves.length; i++) {
                const leaf = vaporPlugin.floatingLeaves[i];
                if (leaf.view && leaf.view.file && leaf.view.editor) {
                    scanEditor(leaf.view.file, leaf.view.editor);
                }
            }
        }

        app.workspace.iterateRootLeaves(function (leaf) {
            if (leaf.view && leaf.view.file && leaf.view.editor) {
                scanEditor(leaf.view.file, leaf.view.editor);
            }
        });

        // Universal Fallback: Search Metadata Cache (Guarantees we catch old tags in suspended background tabs)
        const files = app.vault.getMarkdownFiles();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.extension !== 'md') continue;

            // Skip the active file in metadata cache checks to avoid using lagging, outdated cache indices
            if (file.path === activeFilePath) continue;

            const cache = app.metadataCache.getFileCache(file);
            if (cache) {
                const tags = obsidian.getAllTags(cache) || [];
                const hasTag = tags.some(function (t) { return t.toLowerCase() === TAG_NAME.toLowerCase(); });
                if (hasTag) {
                    let lineIdx = 0; // Default to top of file if tag resides in YAML Properties
                    if (cache.tags) {
                        const tagEntry = cache.tags.find(function (t) { return t.tag.toLowerCase() === TAG_NAME.toLowerCase(); });
                        if (tagEntry) {
                            lineIdx = tagEntry.position.start.line;
                        }
                    }
                    matches.push({ file: file, lineIdx: lineIdx, editor: null });
                }
            }
        }

        // Deduplicate matches to prevent stripping the exact same file and line twice
        const uniqueMatches = [];
        const seenKeys = new Set();
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const key = match.file.path + ':::' + match.lineIdx;
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                uniqueMatches.push(match);
            }
        }

        return uniqueMatches;
    }

    // ─── 5. Helper: Strip Tag from Closed Files Safely ───
    async function stripOldTagInClosedFile(match) {
        if (!match || !match.file) return;
        try {
            await app.vault.process(match.file, function (content) {
                const lines = content.split('\n');
                if (lines[match.lineIdx] && lines[match.lineIdx].toLowerCase().includes(TAG_NAME.toLowerCase())) {
                    lines[match.lineIdx] = lines[match.lineIdx].replace(getTagRegex(), '').trimEnd();
                }
                return lines.join('\n');
            });
        } catch (_) {}
    }

    // ─── EXECUTION FLOW ───
    const current = getCurrentlyFocusedEditor();
    if (!current) {
        new Notice("Place cursor on a task line in an open note first.");
        return;
    }

    const editor = current.editor;
    const file = current.file;
    const cursor = editor.getCursor();
    const currentLineText = editor.getLine(cursor.line);

    // Pass file.path to exclude it from lagging metadata cache checks
    const oldMatches = findAllActiveTaskMatches(file.path);

    let isSelfToggle = false;
    for (let i = 0; i < oldMatches.length; i++) {
        if (oldMatches[i].file.path === file.path && oldMatches[i].lineIdx === cursor.line) {
            isSelfToggle = true;
            break;
        }
    }

    if (isSelfToggle) {
        // Self-Toggle -> Complete task [x] & remove tag
        let updatedLineText = currentLineText.replace(getTagRegex(), '').trimEnd();
        updatedLineText = updatedLineText.replace(/^(\s*(?:[-*+]|\d+\.)\s*\[)\s*(\])/, '$1x$2');
        editor.setLine(cursor.line, updatedLineText);
        return;
    }

    // Move Tag -> Strip from old locations across vault (Case-Insensitive sweep)
    for (let i = 0; i < oldMatches.length; i++) {
        const match = oldMatches[i];
        if (match.file.path === file.path) {
            if (match.lineIdx !== cursor.line) {
                const oldLineText = editor.getLine(match.lineIdx) || "";
                if (oldLineText.toLowerCase().includes(TAG_NAME.toLowerCase())) {
                    const cleanedLine = oldLineText.replace(getTagRegex(), '').trimEnd();
                    editor.setLine(match.lineIdx, cleanedLine);
                }
            }
        } else {
            const openEditor = findEditorForFile(match.file.path);
            if (openEditor) {
                const oldLineText = openEditor.getLine(match.lineIdx) || "";
                if (oldLineText.toLowerCase().includes(TAG_NAME.toLowerCase())) {
                    const cleanedLine = oldLineText.replace(getTagRegex(), '').trimEnd();
                    openEditor.setLine(match.lineIdx, cleanedLine);
                }
            } else {
                await stripOldTagInClosedFile(match);
            }
        }
    }

    // Tag current cursor line
    const lineToTagText = editor.getLine(cursor.line);
    const updatedLineText = lineToTagText.toLowerCase().includes(TAG_NAME.toLowerCase())
        ? lineToTagText
        : (lineToTagText.trimEnd() + ' ' + TAG_NAME);

    editor.setLine(cursor.line, updatedLineText);

    // Reposition caret to the absolute end of the line
    editor.setCursor({ line: cursor.line, ch: updatedLineText.length });
};