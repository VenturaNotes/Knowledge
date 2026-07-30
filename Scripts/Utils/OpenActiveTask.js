module.exports = async function ({ app, obsidian }) {
    const DAILY_FILE_PATH = "Private/Tasks/(T) Daily.md";
    const TAG_NAME = '#active-task';

    // Helper to dynamically wait until the editor on a leaf is fully ready
    function waitUntilEditorReady(leaf, filePath, callback) {
        const startTime = Date.now();
        const timeoutLimit = 1000; // Prevent infinite loops by timing out after 1 second

        function check() {
            if (leaf.view && leaf.view.file && leaf.view.file.path === filePath) {
                const editor = leaf.view.editor;
                if (editor) {
                    try {
                        editor.lineCount(); // Verify that the editor is queryable
                        callback(editor);
                        return;
                    } catch (e) {
                        // Editor is not fully initialized yet
                    }
                }
            }
            if (Date.now() - startTime < timeoutLimit) {
                requestAnimationFrame(check);
            }
        }
        check();
    }

    // ─── 1. Search Live RAM Editors First (0ms Delay), then Metadata Cache ───
    function findActiveTaskLive() {
        const scannedPaths = new Set();

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

        // A. Search Main Workspace RAM Editors (Only .md files)
        let match = null;
        app.workspace.iterateRootLeaves(function (leaf) {
            if (leaf.view && leaf.view.file && leaf.view.file.extension === 'md' && leaf.view.editor) {
                scannedPaths.add(leaf.view.file.path);
                const lineCount = leaf.view.editor.lineCount();
                for (let i = 0; i < lineCount; i++) {
                    const line = leaf.view.editor.getLine(i) || "";
                    if (line.includes(TAG_NAME) && isRealTag(line, TAG_NAME)) {
                        match = { file: leaf.view.file, lineIdx: i };
                        return;
                    }
                }
            }
        });
        if (match) return match;

        // B. Search VaporNote Floating RAM Editors (Only .md files)
        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (vaporPlugin && vaporPlugin.floatingLeaves) {
            for (let i = 0; i < vaporPlugin.floatingLeaves.length; i++) {
                const leaf = vaporPlugin.floatingLeaves[i];
                if (leaf.view && leaf.view.file && leaf.view.file.extension === 'md' && leaf.view.editor) {
                    scannedPaths.add(leaf.view.file.path);
                    const lineCount = leaf.view.editor.lineCount();
                    for (let j = 0; j < lineCount; j++) {
                        const line = leaf.view.editor.getLine(j) || "";
                        if (line.includes(TAG_NAME) && isRealTag(line, TAG_NAME)) {
                            return { file: leaf.view.file, lineIdx: j };
                        }
                    }
                }
            }
        }

        // C. Fallback: Search Metadata Cache for unopened/closed files (Only .md files)
        const files = app.vault.getMarkdownFiles();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.extension !== 'md' || scannedPaths.has(file.path)) continue;

            const cache = app.metadataCache.getFileCache(file);
            if (cache && cache.tags) {
                const tagEntry = cache.tags.find(function (t) { return t.tag === TAG_NAME; });
                if (tagEntry) {
                    return { file: file, lineIdx: tagEntry.position.start.line };
                }
            }
        }

        return null;
    }

    // ─── 2. Helper: Open or Switch Tab inside VaporNote ───
    async function openInVapor(filePath, lineIdx = null) {
        // Enforce that only markdown files can be processed
        if (!filePath.endsWith('.md')) {
            new Notice("Only Markdown (.md) files can be opened.");
            return;
        }

        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (!vaporPlugin) {
            new Notice("VaporNote plugin is not loaded.");
            return;
        }

        if (!vaporPlugin._isOpen || !vaporPlugin._isOpen()) {
            await vaporPlugin.toggleVaporNote();
        }
        if (vaporPlugin._isMinimized) {
            vaporPlugin.toggleMinimize();
        }

        const leaves = vaporPlugin.floatingLeaves || [];
        let existingTabIdx = -1;
        for (let i = 0; i < leaves.length; i++) {
            if (leaves[i].view && leaves[i].view.file && leaves[i].view.file.path === filePath) {
                existingTabIdx = i;
                break;
            }
        }

        if (existingTabIdx !== -1) {
            if (typeof vaporPlugin._switchTab === 'function') {
                vaporPlugin._switchTab(existingTabIdx);
            }
        } else {
            if (typeof vaporPlugin._addNewTab === 'function') {
                await vaporPlugin._addNewTab('file', filePath);
            }
        }

        if (lineIdx !== null && lineIdx !== undefined) {
            const currentLeaves = vaporPlugin.floatingLeaves || [];
            
            // Find target leaf directly by its file path
            let targetLeaf = currentLeaves.find(function (leaf) {
                return leaf.view && leaf.view.file && leaf.view.file.path === filePath;
            });

            // Fallback to activeLeafIndex if file path lookup fails
            if (!targetLeaf && typeof vaporPlugin.activeLeafIndex === 'number') {
                targetLeaf = currentLeaves[vaporPlugin.activeLeafIndex];
            }

            if (targetLeaf) {
                // Focus the active leaf natively in Obsidian's layout immediately
                app.workspace.setActiveLeaf(targetLeaf, { focus: true });

                // Dynamically wait for editor initialization and focus immediately once ready
                waitUntilEditorReady(targetLeaf, filePath, function (vaporEditor) {
                    const lineContent = vaporEditor.getLine(lineIdx) || "";
                    vaporEditor.setCursor({ line: lineIdx, ch: lineContent.length });
                    vaporEditor.scrollIntoView({ from: { line: lineIdx, ch: 0 }, to: { line: lineIdx, ch: 0 } }, true);
                    if (vaporEditor.focus) vaporEditor.focus();
                });
            }
        }
    }

    // ─── EXECUTION FLOW ───
    const activeMatch = findActiveTaskLive();

    if (activeMatch) {
        // Option 1: Active Task exists -> Open directly in VaporNote (0ms hardcoded delay)
        await openInVapor(activeMatch.file.path, activeMatch.lineIdx);
    } else {
        // Option 2: No Active Task -> Prompt user with Daily Note headings suggest modal
        const dailyFile = app.vault.getAbstractFileByPath(DAILY_FILE_PATH);
        if (!dailyFile) {
            new Notice("Could not find Daily file at: " + DAILY_FILE_PATH);
            return;
        }

        const cache = app.metadataCache.getFileCache(dailyFile);
        const headings = cache ? (cache.headings || []) : [];

        if (headings.length === 0) {
            // If no headings exist, just open the Daily Note at the top
            await openInVapor(DAILY_FILE_PATH, 0);
            return;
        }

        let minLevel = 1;
        minLevel = Math.min.apply(null, headings.map(function (h) { return h.level; }));

        class HeaderSuggestModal extends obsidian.SuggestModal {
            constructor(app) {
                super(app);
                this.setPlaceholder("Pick a section in Daily Note...");
            }
            getSuggestions(query) {
                return headings.filter(function (h) {
                    return h.heading.toLowerCase().includes(query.toLowerCase());
                });
            }
            renderSuggestion(h, el) {
                const indentPixels = Math.max(0, h.level - minLevel) * 20;
                el.style.paddingLeft = (indentPixels + 12) + "px";
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.createEl("span", { text: "◦  " + h.heading });
            }
            async onChooseSuggestion(h) {
                const targetLine = h.position.start.line;
                // Defer with an imperceptible 50ms delay to let the SuggestModal close cleanly without stealing focus
                setTimeout(async function () {
                    await openInVapor(DAILY_FILE_PATH, targetLine);
                }, 50);
            }
        }
        new HeaderSuggestModal(app).open();
    }
};