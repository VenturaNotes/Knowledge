module.exports = async (params) => {
    const { app, obsidian } = params;
    const { Notice, MarkdownView } = obsidian;

    const GLOBAL_KEY = "_kineticNestingVisualizer";

    // 1. Toggle OFF and clean up if already running
    if (window[GLOBAL_KEY]) {
        try {
            window[GLOBAL_KEY].destroy();
        } catch (e) {
            console.error(e);
        }
        delete window[GLOBAL_KEY];
        new Notice("Visual Nesting Tracker: Disabled ❌");
        return;
    }

    // 2. Create the floating UI element (styled with Obsidian's design variables)
    const pill = document.createElement('div');
    pill.id = 'kinetic-nesting-pill';
    Object.assign(pill.style, {
        position: 'absolute',
        bottom: '20px',
        right: '25px',
        zIndex: '99',
        background: 'var(--background-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '6px 12px',
        fontSize: '11px',
        fontFamily: 'var(--font-monospace, monospace)',
        color: 'var(--text-muted)',
        display: 'none',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        pointerEvents: 'none', // Allows typing and mouse clicks to pass through without being blocked
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        userSelect: 'none'
    });

    // 3. Real-time scanning and updating engine
    const updatePill = () => {
        const activeView = app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            pill.style.display = 'none';
            return;
        }

        // Keep pill inside the active editor's DOM container
        const container = activeView.containerEl;
        if (pill.parentElement !== container) {
            container.appendChild(pill);
        }

        const editor = activeView.editor;
        const cursor = editor.getCursor();
        const cursorLine = cursor.line;

        const text = editor.getValue();
        const lines = text.split("\n");
        const detectedBlocks = [];

        // Parse matching bracket ranges
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            const openMatch = line.match(/^\[(\d+)\]$/);
            if (openMatch) {
                const id = parseInt(openMatch[1], 10);
                detectedBlocks.push({ id, startLine: i, endLine: null });
            }

            const closeMatch = line.match(/^\[\/(\d+)\]$/);
            if (closeMatch) {
                const id = parseInt(closeMatch[1], 10);
                for (let j = detectedBlocks.length - 1; j >= 0; j--) {
                    if (detectedBlocks[j].id === id && detectedBlocks[j].endLine === null) {
                        detectedBlocks[j].endLine = i;
                        break;
                    }
                }
            }
        }

        // Filter for blocks that enclose the active cursor line
        const activeBlocksAtCursor = detectedBlocks.filter(block => {
            const start = block.startLine;
            const end = block.endLine !== null ? block.endLine : lines.length - 1;
            return cursorLine >= start && cursorLine <= end;
        });

        activeBlocksAtCursor.sort((a, b) => a.startLine - b.startLine);

        const depth = activeBlocksAtCursor.length;

        // Draw and style the UI
        if (depth > 0) {
            pill.style.display = 'flex';
            const path = activeBlocksAtCursor.map(b => `[${b.id}]`).join(" ➔ ");
            pill.innerHTML = `<span style="margin-right: 6px;">Depth ${depth}:</span> <strong style="color: var(--text-normal);">${path}</strong>`;
            
            // Dynamic styling: change border intensity based on nesting level
            if (depth === 1) {
                pill.style.borderColor = 'var(--border-color)';
                pill.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            } else if (depth === 2) {
                pill.style.borderColor = 'var(--interactive-accent)';
                pill.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15), 0 0 6px var(--interactive-accent)';
            } else {
                pill.style.borderColor = 'var(--text-error)';
                pill.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15), 0 0 6px var(--text-error)';
            }
        } else {
            // Hide the indicator entirely when not nested inside brackets
            pill.style.display = 'none';
        }
    };

    // 4. Hook events to monitor both text edits and manual cursor moves (clicks/arrows)
    const onCursorActivity = () => updatePill();

    document.addEventListener('keyup', onCursorActivity);
    document.addEventListener('click', onCursorActivity);
    const layoutRef = app.workspace.on('active-leaf-change', updatePill);
    const editorRef = app.workspace.on('editor-change', updatePill);

    // Run once initially to register current state
    updatePill();

    // 5. Store destroy handle on the window object so we can release resources on toggle
    window[GLOBAL_KEY] = {
        destroy: () => {
            document.removeEventListener('keyup', onCursorActivity);
            document.removeEventListener('click', onCursorActivity);
            app.workspace.offref(layoutRef);
            app.workspace.offref(editorRef);
            pill.remove();
        }
    };

    new Notice("Visual Nesting Tracker: Enabled ✅");
};