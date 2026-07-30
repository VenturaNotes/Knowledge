module.exports = async function ({ app, obsidian }) {
    // Purge any old status bar element if one still exists
    const oldStatus = document.getElementById('active-task-status-item');
    if (oldStatus) oldStatus.remove();

    // ─── 1. Get Category Tag ───
    const TAG_NAME = '#active-task';

    function getTagRegex() {
        const escaped = TAG_NAME.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        return new RegExp(escaped + '\\s*', 'g');
    }

    // Checks if the tag is a genuine tag on a live editor line (ignores backticks & HTML comments)
    function isRealTag(line, tag) {
        const parts = line.split('`');
        for (let i = 0; i < parts.length; i += 2) {
            const segment = parts[i];
            if (segment.includes(tag)) {
                const cleanSegment = segment.replace(/<!--[\s\S]*?-->/g, '');
                if (cleanSegment.includes(tag)) {
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
    function findAllActiveTaskMatches() {
        const matches = [];
        const scannedPaths = new Set();

        function scanEditor(file, editor) {
            if (!file || !editor) return;
            scannedPaths.add(file.path);
            const lineCount = editor.lineCount();
            for (let i = 0; i < lineCount; i++) {
                const line = editor.getLine(i) || "";
                if (line.includes(TAG_NAME) && isRealTag(line, TAG_NAME)) {
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

        const files = app.vault.getMarkdownFiles();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (scannedPaths.has(file.path)) continue;

            const cache = app.metadataCache.getFileCache(file);
            if (cache && cache.tags) {
                const tagEntries = cache.tags.filter(function (t) { return t.tag === TAG_NAME; });
                for (let j = 0; j < tagEntries.length; j++) {
                    const tagEntry = tagEntries[j];
                    matches.push({ file: file, lineIdx: tagEntry.position.start.line, editor: null });
                }
            }
        }

        return matches;
    }

    // ─── 5. Helper: Strip Tag from Closed Files Safely ───
    async function stripOldTagInClosedFile(match) {
        if (!match || !match.file) return;
        try {
            await app.vault.process(match.file, function (content) {
                const lines = content.split('\n');
                if (lines[match.lineIdx] && lines[match.lineIdx].includes(TAG_NAME)) {
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

    const oldMatches = findAllActiveTaskMatches();

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

    // Move Tag -> Strip from old locations across vault
    for (let i = 0; i < oldMatches.length; i++) {
        const match = oldMatches[i];
        if (match.file.path === file.path) {
            if (match.lineIdx !== cursor.line) {
                const oldLineText = editor.getLine(match.lineIdx) || "";
                if (oldLineText.includes(TAG_NAME)) {
                    const cleanedLine = oldLineText.replace(getTagRegex(), '').trimEnd();
                    editor.setLine(match.lineIdx, cleanedLine);
                }
            }
        } else {
            const openEditor = findEditorForFile(match.file.path);
            if (openEditor) {
                const oldLineText = openEditor.getLine(match.lineIdx) || "";
                if (oldLineText.includes(TAG_NAME)) {
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
    const updatedLineText = lineToTagText.includes(TAG_NAME)
        ? lineToTagText
        : (lineToTagText.trimEnd() + ' ' + TAG_NAME);

    editor.setLine(cursor.line, updatedLineText);
};