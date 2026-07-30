module.exports = async function ({ app, obsidian }) {
    const DAILY_FILE_PATH = "Private/Tasks/(T) Daily.md";

    // ─── 1. Get Current Tab Group & Category Tag ───
    const vtgPlugin = app.plugins.plugins['virtual-tab-groups'];
    const activeGroup = (vtgPlugin && vtgPlugin.settings && vtgPlugin.settings.activeGroup) ? vtgPlugin.settings.activeGroup : 'Default';
    const groupSlug = activeGroup.toLowerCase().replace(/\s+/g, '-');
    const TAG_NAME = '#active-task/' + groupSlug;

    // ─── 2. Search Live RAM Editors First (0ms Delay), then Metadata Cache ───
    function findActiveTaskLive() {
        // A. Search Main Workspace RAM Editors
        let match = null;
        app.workspace.iterateRootLeaves(function (leaf) {
            if (leaf.view && leaf.view.file && leaf.view.editor) {
                const lineCount = leaf.view.editor.lineCount();
                for (let i = 0; i < lineCount; i++) {
                    if (leaf.view.editor.getLine(i).includes(TAG_NAME)) {
                        match = { file: leaf.view.file, lineIdx: i };
                        return;
                    }
                }
            }
        });
        if (match) return match;

        // B. Search VaporNote Floating RAM Editors
        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (vaporPlugin && vaporPlugin.floatingLeaves) {
            for (let i = 0; i < vaporPlugin.floatingLeaves.length; i++) {
                const leaf = vaporPlugin.floatingLeaves[i];
                if (leaf.view && leaf.view.file && leaf.view.editor) {
                    const lineCount = leaf.view.editor.lineCount();
                    for (let j = 0; j < lineCount; j++) {
                        if (leaf.view.editor.getLine(j).includes(TAG_NAME)) {
                            return { file: leaf.view.file, lineIdx: j };
                        }
                    }
                }
            }
        }

        // C. Fallback: Search Metadata Cache for unopened/closed files
        const files = app.vault.getMarkdownFiles();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
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

    // ─── 3. Helper: Open or Switch Tab inside VaporNote ───
    async function openInVapor(filePath, lineIdx = null) {
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
            setTimeout(function () {
                const activeLeaf = vaporPlugin.floatingLeaves ? vaporPlugin.floatingLeaves[vaporPlugin.activeLeafIndex] : null;
                const vaporEditor = activeLeaf && activeLeaf.view ? activeLeaf.view.editor : null;
                if (vaporEditor) {
                    const lineContent = vaporEditor.getLine(lineIdx) || "";
                    vaporEditor.setCursor({ line: lineIdx, ch: lineContent.length });
                    vaporEditor.scrollIntoView({ from: { line: lineIdx, ch: 0 }, to: { line: lineIdx, ch: 0 } }, true);
                    if (vaporEditor.focus) vaporEditor.focus();
                }
            }, 120);
        }
    }

    // ─── EXECUTION FLOW ───
    const activeMatch = findActiveTaskLive();

    if (activeMatch) {
        // FALLBACK 1: Active Task exists -> Open directly in VaporNote
        await openInVapor(activeMatch.file.path, activeMatch.lineIdx);
    } else {
        // FALLBACK 2: No Active Task -> Check Daily Note for matching Group Heading
        const dailyFile = app.vault.getAbstractFileByPath(DAILY_FILE_PATH);
        if (!dailyFile) {
            new Notice("Could not find Daily file at: " + DAILY_FILE_PATH);
            return;
        }

        const cache = app.metadataCache.getFileCache(dailyFile);
        const headings = cache ? (cache.headings || []) : [];
        let matchingHeading = null;

        for (let i = 0; i < headings.length; i++) {
            if (headings[i].heading.toLowerCase().trim() === activeGroup.toLowerCase().trim()) {
                matchingHeading = headings[i];
                break;
            }
        }

        if (matchingHeading) {
            const targetLine = matchingHeading.position.start.line;
            await openInVapor(DAILY_FILE_PATH, targetLine);
        } else {
            // FALLBACK 3: No matching heading -> Show modal FIRST, open VaporNote ONLY AFTER selection
            let minLevel = 1;
            if (headings.length > 0) {
                minLevel = Math.min.apply(null, headings.map(function (h) { return h.level; }));
            }

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
                    await openInVapor(DAILY_FILE_PATH, targetLine);
                }
            }
            new HeaderSuggestModal(app).open();
        }
    }
};