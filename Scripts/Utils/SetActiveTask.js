module.exports = async function ({ app, obsidian }) {
    const TAG_NAME = '#active-task';
    const STATUS_BAR_ID = 'active-task-status-item';

    // ─── 1. HELPER: Instant RAM Search for #active-task across 70k Cache Objects ───
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

    // ─── 2. HELPER: Extract Clean Task Text for Status Bar ───
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

    // ─── 3. HELPER: Create/Update Clickable Status Bar Item ───
    function updateStatusBar(taskText, onJump) {
        let statusBarEl = document.getElementById(STATUS_BAR_ID);
        if (!statusBarEl) {
            const statusBarContainer = document.querySelector('.status-bar');
            if (statusBarContainer) {
                statusBarEl = document.createElement('div');
                statusBarEl.id = STATUS_BAR_ID;
                statusBarEl.className = 'status-bar-item plugin-script-runner';
                statusBarEl.style.cssText = 'color: var(--text-accent); font-weight: bold; cursor: pointer; padding: 0 8px;';
                statusBarContainer.prepend(statusBarEl);
            }
        }

        if (statusBarEl) {
            statusBarEl.textContent = `🎯 ${taskText}`;
            statusBarEl.title = 'Click to jump to active task in VaporNote';
            statusBarEl.onclick = onJump;
        }
    }

    // ─── 4. HELPER: Jump VaporNote to File and Line ───
    async function jumpToTaskInVapor(file, lineIdx, taskText) {
        const vaporPlugin = app.plugins.plugins['vapornote'];
        if (!vaporPlugin) {
            new obsidian.Notice("VaporNote plugin is not loaded.");
            return;
        }

        // Open VaporNote if closed
        if (!vaporPlugin._isOpen || !vaporPlugin._isOpen()) {
            await vaporPlugin.toggleVaporNote();
        }

        const vaporLeaf = vaporPlugin.floatingLeaves ? vaporPlugin.floatingLeaves[vaporPlugin.activeLeafIndex] : null;
        if (vaporLeaf) {
            const currentFile = vaporLeaf.view?.file;
            if (!currentFile || currentFile.path !== file.path) {
                await vaporLeaf.openFile(file);
            }

            setTimeout(() => {
                const vaporEditor = vaporLeaf.view?.editor;
                if (vaporEditor) {
                    vaporEditor.setCursor({ line: lineIdx, ch: 0 });
                    vaporEditor.scrollIntoView({ from: { line: lineIdx, ch: 0 }, to: { line: lineIdx, ch: 0 } }, true);
                    if (vaporEditor.focus) vaporEditor.focus();
                }
            }, 100);
        }

        if (taskText) new obsidian.Notice(`🎯 Active Task: "${taskText}"`);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // MAIN EXECUTION FLOW
    // ───────────────────────────────────────────────────────────────────────────

    // Step A: Check if #active-task ALREADY exists in the Metadata Cache
    const activeMatch = findActiveTaskInCache();

    if (activeMatch) {
        // ─── SCENARIO 1: TASK EXISTS ───> Jump to it!
        const taskText = await getCleanTaskText(activeMatch.file, activeMatch.lineIdx);
        
        // Update status bar with click-to-jump handler
        updateStatusBar(taskText, () => jumpToTaskInVapor(activeMatch.file, activeMatch.lineIdx, taskText));
        
        // Jump VaporNote directly to line
        await jumpToTaskInVapor(activeMatch.file, activeMatch.lineIdx, taskText);

    } else {
        // ─── SCENARIO 2: NO TASK EXISTS ───> Insert #active-task at cursor!
        const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!activeView) {
            new obsidian.Notice("No active task found in vault. Click into a note to set one.");
            return;
        }

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

        // Update status bar
        updateStatusBar(cleanText, () => jumpToTaskInVapor(file, cursor.line, cleanText));
        
        // Sync VaporNote
        await jumpToTaskInVapor(file, cursor.line, cleanText);
    }
};