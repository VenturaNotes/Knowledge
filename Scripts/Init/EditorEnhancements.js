/**
 * Unified Editor Enhancements:
 * 1. Task Auto-Date: Automatically appends/removes completion dates and file links when toggling task checkboxes.
 * 2. Visual Nesting Tracker: Displays real-time depth & bracket paths ([1] ... [/1]) for the active cursor line.
 */
module.exports = function(context) {
    const { app } = context;

    // Guard against duplicate registrations on script reload
    if (window._kineticEditorEnhancementsLoaded) {
        return;
    }

    // Locate ScriptRunner plugin instance
    let plugin = Object.values(app.plugins.plugins).find(
        p => p && typeof p.runScript === 'function' && p.settings && p.settings.startupScripts
    );

    if (!plugin) {
        plugin = app.plugins.plugins['script-runner'] || app.plugins.plugins['obsidian-script-runner'];
    }

    if (!plugin) {
        console.error("[ScriptRunner] Could not find ScriptRunner plugin instance to register CM6 extension.");
        return;
    }

    const { ViewPlugin } = require('@codemirror/view');

    const checkedRegex = /^\s*([-*+]|\d+\.)\s+\[[xX]\]/;
    const uncheckedRegex = /^\s*([-*+]|\d+\.)\s+\[\s\]/;
    const dateMarkerRegex = /\s*✅\s*\d{4}-\d{2}-\d{2}(\s*\[\[.*?\]\])?/g;

    const unifiedPlugin = ViewPlugin.fromClass(class {
        constructor(view) {
            this.view = view;
            this.isModifying = false;

            // 1. Create and attach the floating Nesting Indicator Pill
            this.pill = document.createElement('div');
            this.pill.className = 'kinetic-nesting-pill';
            Object.assign(this.pill.style, {
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
                pointerEvents: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                userSelect: 'none'
            });

            this.view.dom.appendChild(this.pill);
            this.updateNestingTracker(this.view.state);
        }

        update(update) {
            // A. Handle Task Auto-Dating (Only on text changes)
            if (update.docChanged && !this.isModifying) {
                this.handleTaskAutoDate(update);
            }

            // B. Handle Nesting Tracker (On text changes OR cursor/selection movement)
            if (update.docChanged || update.selectionSet) {
                this.updateNestingTracker(update.state);
            }
        }

        destroy() {
            if (this.pill && this.pill.parentElement) {
                this.pill.remove();
            }
        }

        // --- Task Auto-Dating Engine ---
        handleTaskAutoDate(update) {
            const linesToAddDate = new Set();
            const linesToRemoveDate = new Set();

            update.changes.iterChanges((fromA, toA, fromB, toB) => {
                try {
                    const startLineA = update.startState.doc.lineAt(fromA).number;
                    const endLineA = update.startState.doc.lineAt(toA).number;
                    const startLineB = update.state.doc.lineAt(fromB).number;
                    const endLineB = update.state.doc.lineAt(toB).number;

                    if (endLineA - startLineA === endLineB - startLineB) {
                        for (let i = 0; i <= (endLineA - startLineA); i++) {
                            const lineA = update.startState.doc.line(startLineA + i);
                            const lineB = update.state.doc.line(startLineB + i);

                            const wasChecked = checkedRegex.test(lineA.text);
                            const wasUnchecked = uncheckedRegex.test(lineA.text);
                            const isChecked = checkedRegex.test(lineB.text);
                            const isUnchecked = uncheckedRegex.test(lineB.text);

                            if (!wasChecked && isChecked) {
                                linesToAddDate.add(startLineB + i);
                            } else if (wasChecked && isUnchecked) {
                                linesToRemoveDate.add(startLineB + i);
                            }
                        }
                    }
                } catch (e) {
                    // Safe boundary catch
                }
            });

            if (linesToAddDate.size === 0 && linesToRemoveDate.size === 0) return;

            const today = new Date().toISOString().split('T')[0];
            const activeFile = app.workspace.getActiveFile();
            const fileName = activeFile ? activeFile.basename : '';
            const fileLink = fileName ? ` [[${fileName}]]` : '';
            const changesToDispatch = [];

            for (const lineNum of linesToAddDate) {
                try {
                    const line = update.state.doc.line(lineNum);
                    const lineText = line.text;
                    dateMarkerRegex.lastIndex = 0;
                    if (!dateMarkerRegex.test(lineText)) {
                        changesToDispatch.push({
                            from: line.from,
                            to: line.to,
                            insert: lineText + ` ✅ ${today}${fileLink}`
                        });
                    }
                } catch (e) {}
            }

            for (const lineNum of linesToRemoveDate) {
                try {
                    const line = update.state.doc.line(lineNum);
                    const lineText = line.text;
                    dateMarkerRegex.lastIndex = 0;
                    if (dateMarkerRegex.test(lineText)) {
                        changesToDispatch.push({
                            from: line.from,
                            to: line.to,
                            insert: lineText.replace(dateMarkerRegex, '')
                        });
                    }
                } catch (e) {}
            }

            if (changesToDispatch.length > 0) {
                this.isModifying = true;
                setTimeout(() => {
                    try {
                        update.view.dispatch({
                            changes: changesToDispatch,
                            userEvent: 'input'
                        });
                    } catch (err) {
                        console.error("[ScriptRunner] Error updating task dates:", err);
                    } finally {
                        this.isModifying = false;
                    }
                }, 0);
            }
        }

        // --- Visual Nesting Tracker Engine ---
        updateNestingTracker(state) {
            const doc = state.doc;
            const cursor = state.selection.main.head;
            const cursorLine = doc.lineAt(cursor).number; // 1-based line index

            const detectedBlocks = [];

            // Direct line iteration via CM6 (fast, zero string allocations)
            for (let i = 1; i <= doc.lines; i++) {
                const line = doc.line(i).text.trim();

                const openMatch = line.match(/^\[(\d+)\]$/);
                if (openMatch) {
                    detectedBlocks.push({ id: parseInt(openMatch[1], 10), startLine: i, endLine: null });
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

            const activeBlocksAtCursor = detectedBlocks.filter(block => {
                const start = block.startLine;
                const end = block.endLine !== null ? block.endLine : doc.lines;
                return cursorLine >= start && cursorLine <= end;
            });

            activeBlocksAtCursor.sort((a, b) => a.startLine - b.startLine);
            const depth = activeBlocksAtCursor.length;

            if (depth > 0) {
                this.pill.style.display = 'flex';
                const path = activeBlocksAtCursor.map(b => `[${b.id}]`).join(" ➔ ");
                this.pill.innerHTML = `<span style="margin-right: 6px;">Depth ${depth}:</span> <strong style="color: var(--text-normal);">${path}</strong>`;

                if (depth === 1) {
                    this.pill.style.borderColor = 'var(--border-color)';
                    this.pill.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                } else if (depth === 2) {
                    this.pill.style.borderColor = 'var(--interactive-accent)';
                    this.pill.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15), 0 0 6px var(--interactive-accent)';
                } else {
                    this.pill.style.borderColor = 'var(--text-error)';
                    this.pill.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15), 0 0 6px var(--text-error)';
                }
            } else {
                this.pill.style.display = 'none';
            }
        }
    });

    plugin.registerEditorExtension(unifiedPlugin);
    window._kineticEditorEnhancementsLoaded = true;
};