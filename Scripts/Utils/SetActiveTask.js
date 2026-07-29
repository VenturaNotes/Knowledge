module.exports = async function ({ app, obsidian }) {
    const TAG_NAME = '#active-task';
    const STATUS_BAR_ID = 'active-task-status-item';
    const DAILY_FILE_PATH = "Private/Tasks/(T) Daily.md";

    // ─── 1. HELPER: RAM Search for #active-task across Cache ───
    function findActiveTaskInCache() {
        const files = app.vault.getMarkdownFiles();
        for (const file of files) {
            const cache = app.metadataCache.getFileCache(file);
            if (cache && cache.tags) {
                const tagEntry = cache.tags.find(t => t.tag === TAG_NAME);
                if (tagEntry) {
                    return {
                        file: file,
                        lineIdx: tagEntry.position.start.line
                    };
                }
            }
        }
        return null;
    }

    // ─── 2. HELPER: Extract Clean Task Text ───
    async function getCleanTaskText(file, lineIdx) {
        try {
            const content = await app.vault.read(file);
            const lines = content.split('\n');
            const lineText = lines[lineIdx] || "";
            return lineText
                .replace(TAG_NAME, '')
                .replace(/^[-*+]\s*(\[[ xX]\])?\s*/, '')
                .trim() || "Active Task";
        } catch (_) {
            return "Active Task";
        }
    }

    // ─── 3. HELPER: Non-Clickable Status Bar Item [🎯 Task Text] ───
    function updateStatusBar(taskText) {
        let statusBarEl = document.getElementById(STATUS_BAR_ID);
        
        if (!taskText) {
            if (statusBarEl) statusBarEl.remove();
            return;
        }

        if (!statusBarEl) {
            const statusBarContainer = document.querySelector('.status-bar');
            if (statusBarContainer) {
                statusBarEl = document.createElement('div');
                statusBarEl.id = STATUS_BAR_ID;
                statusBarEl.className = 'status-bar-item plugin-script-runner';
                statusBarEl.style.cssText = 'color: var(--text-accent); font-weight: bold; padding: 0 8px;';
                statusBarContainer.prepend(statusBarEl);
            }
        }

        if (statusBarEl) {
            statusBarEl.textContent = `[🎯 ${taskText}]`;
            statusBarEl.onclick = null;
        }
    }

    // ─── 4. HELPER: Smart VaporNote Opener (Protects Existing Tabs) ───
    async function openOrSwitchInVapor(filePath, lineIdx = null) {
        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (!vaporPlugin) return;

        const targetFile = app.vault.getAbstractFileByPath(filePath);
        if (!targetFile) return;

        // A. Open VaporNote if closed
        if (!vaporPlugin._isOpen || !vaporPlugin._isOpen()) {
            await vaporPlugin.toggleVaporNote();
        }

        // B. Unminimize if minimized
        if (vaporPlugin._isMinimized) {
            vaporPlugin.toggleMinimize();
        }

        const leaves = vaporPlugin.floatingLeaves || [];

        // C. Check if target file is ALREADY open in any tab
        const existingTabIdx = leaves.findIndex(l => l.view?.file?.path === filePath);

        if (existingTabIdx !== -1) {
            // Already open in another tab -> switch to it!
            if (typeof vaporPlugin._switchTab === 'function') {
                vaporPlugin._switchTab(existingTabIdx);
            }
        } else {
            // Not open anywhere in VaporNote -> check current active tab
            const activeLeaf = leaves[vaporPlugin.activeLeafIndex];
            const activeType = activeLeaf ? (activeLeaf.getViewState?.()?.type || 'empty') : 'empty';

            if (activeLeaf && activeType === 'empty') {
                // Active tab is empty -> reuse current tab!
                await activeLeaf.openFile(targetFile);
            } else {
                // Active tab is occupied -> spawn a NEW tab!
                if (typeof vaporPlugin._addNewTab === 'function') {
                    await vaporPlugin._addNewTab('file', filePath);
                } else if (activeLeaf) {
                    await activeLeaf.openFile(targetFile);
                }
            }
        }

        // D. Scroll & set cursor at end of line if lineIdx is specified
        if (lineIdx !== null && lineIdx !== undefined) {
            setTimeout(() => {
                const currentLeaf = vaporPlugin.floatingLeaves ? vaporPlugin.floatingLeaves[vaporPlugin.activeLeafIndex] : null;
                const vaporEditor = currentLeaf?.view?.editor;
                if (vaporEditor) {
                    const lineContent = vaporEditor.getLine(lineIdx) || "";
                    const endOfLineCh = lineContent.length;

                    vaporEditor.setCursor({ line: lineIdx, ch: endOfLineCh });
                    vaporEditor.scrollIntoView({ from: { line: lineIdx, ch: endOfLineCh }, to: { line: lineIdx, ch: endOfLineCh } }, true);
                    if (vaporEditor.focus) vaporEditor.focus();
                }
            }, 100);
        }
    }

    // ───────────────────────────────────────────────────────────────────────────
    // MAIN EXECUTION FLOW
    // ───────────────────────────────────────────────────────────────────────────

    const activeMatch = findActiveTaskInCache();
    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);

    // IF CURSOR IS ON THE SAME LINE AS #active-task -> DELETE IT
    if (activeMatch && activeView && activeView.file.path === activeMatch.file.path) {
        const editor = activeView.editor;
        const currentCursor = editor.getCursor();

        if (currentCursor.line === activeMatch.lineIdx) {
            let currentLineText = editor.getLine(currentCursor.line);
            const updatedLineText = currentLineText.replace(new RegExp(`${TAG_NAME}\\s*`, 'g'), '').trimEnd();
            editor.setLine(currentCursor.line, updatedLineText);

            // Clear status bar
            updateStatusBar(null);
            return;
        }
    }

    if (activeMatch) {
        // SCENARIO A: TASK EXISTS ELSEWHERE -> Switch or open in new tab & jump!
        const taskText = await getCleanTaskText(activeMatch.file, activeMatch.lineIdx);
        updateStatusBar(taskText);
        await openOrSwitchInVapor(activeMatch.file.path, activeMatch.lineIdx);

    } else if (activeView) {
        // SCENARIO B: NO TASK EXISTS & IN EDITOR -> Insert #active-task at cursor!
        const editor = activeView.editor;
        const file = activeView.file;
        if (!file || !editor) return;

        const cursor = editor.getCursor();
        const currentLineText = editor.getLine(cursor.line);

        // Append #active-task tag to current line
        const updatedLineText = currentLineText.includes(TAG_NAME) 
            ? currentLineText 
            : `${currentLineText.trimEnd()} ${TAG_NAME}`;
            
        editor.setLine(cursor.line, updatedLineText);

        const cleanText = currentLineText
            .replace(/^[-*+]\s*(\[[ xX]\])?\s*/, '')
            .replace(TAG_NAME, '')
            .trim() || "Active Task";

        updateStatusBar(cleanText);
        await openOrSwitchInVapor(file.path, cursor.line);

    } else {
        // SCENARIO C: NO TASK EXISTS & NOT IN EDITOR -> Open Daily Note in VaporNote!
        await openOrSwitchInVapor(DAILY_FILE_PATH);
    }
};