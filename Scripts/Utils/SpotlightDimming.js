module.exports = async ({ app, obsidian }) => {
    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.file) {
        return;
    }

    const editor = activeView.editor;
    const cm = editor.cm;
    const currentFilePath = activeView.file.path;

    const { StateEffect, StateField } = require('@codemirror/state');
    const { Decoration, EditorView } = require('@codemirror/view');

    // 1. Initialize Global File Memory Map
    if (!window.__spotlightFileMap) {
        window.__spotlightFileMap = new Map();
    }

    // 2. Inject or Update Spotlight CSS
    const STYLE_ID = 'spotlight-dimming-styles';
    let style = document.getElementById(STYLE_ID);
    if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        document.head.appendChild(style);
    }
    style.innerHTML = `
        /* Dim all surrounding content, properties, and note title */
        .cm-editor.is-spotlight-active .cm-line,
        .cm-editor.is-spotlight-active .metadata-container,
        .cm-editor.is-spotlight-active .metadata-properties,
        .cm-editor.is-spotlight-active .inline-title {
            opacity: 0.12 !important;
            filter: blur(0.4px) !important;
            transition: opacity 0.2s ease, filter 0.2s ease !important;
        }

        /* Keep focused lines 100% sharp and vibrant */
        .cm-editor.is-spotlight-active .cm-line.spotlight-focused {
            opacity: 1 !important;
            filter: none !important;
        }
    `;

    // Helper to calculate exact line decorations
    function getDecorationsForRange(doc, safeFrom, safeTo) {
        if (safeFrom >= safeTo && doc.length > 0 && safeFrom > doc.length) {
            return { startLine: -1, endLine: -1, decos: [] };
        }

        let startLine = doc.lineAt(safeFrom).number;
        if (safeFrom === doc.lineAt(safeFrom).to && startLine < doc.lines && startLine < doc.lineAt(safeTo).number) {
            startLine += 1;
        }

        let endLine = doc.lineAt(safeTo).number;
        if (safeTo === doc.lineAt(safeTo).from && endLine > startLine) {
            endLine -= 1;
        }

        const decos = [];
        for (let l = startLine; l <= endLine; l++) {
            const line = doc.line(l);
            decos.push(
                Decoration.line({ class: "spotlight-focused" }).range(line.from)
            );
        }
        return { startLine, endLine, decos };
    }

    // 3. Define the CodeMirror 6 Spotlight StateField
    if (!window.__setSpotlightEffect) {
        window.__setSpotlightEffect = StateEffect.define();
        window.__spotlightField = StateField.define({
            create() {
                return { fromPos: -1, toPos: -1, deco: Decoration.none };
            },
            update(val, tr) {
                for (const e of tr.effects) {
                    if (e.is(window.__setSpotlightEffect)) {
                        const { fromPos, toPos } = e.value;
                        if (fromPos === -1 || toPos === -1) {
                            return { fromPos: -1, toPos: -1, deco: Decoration.none };
                        }

                        const doc = tr.newDoc;
                        const safeFrom = Math.max(0, Math.min(fromPos, doc.length));
                        const safeTo = Math.max(safeFrom, Math.min(toPos, doc.length));

                        const { decos } = getDecorationsForRange(doc, safeFrom, safeTo);
                        return { fromPos: safeFrom, toPos: safeTo, deco: Decoration.set(decos) };
                    }
                }

                // Handle text edits & new sub-bullets
                if (tr.docChanged && val.fromPos !== -1) {
                    const newFromPos = tr.changes.mapPos(val.fromPos, 1);
                    const newToPos = tr.changes.mapPos(val.toPos, 1);

                    const doc = tr.newDoc;
                    const safeFrom = Math.max(0, Math.min(newFromPos, doc.length));
                    const safeTo = Math.max(safeFrom, Math.min(newToPos, doc.length));

                    const { decos } = getDecorationsForRange(doc, safeFrom, safeTo);

                    // Update memory map with the new positions
                    const activeLeaf = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeLeaf && activeLeaf.file) {
                        window.__spotlightFileMap.set(activeLeaf.file.path, { fromPos: safeFrom, toPos: safeTo });
                    }

                    return { fromPos: safeFrom, toPos: safeTo, deco: Decoration.set(decos) };
                }

                return val;
            },
            provide: (f) => [
                EditorView.decorations.from(f, (val) => val.deco),
                EditorView.editorAttributes.from(f, (val) =>
                    val.fromPos !== -1 ? { class: "is-spotlight-active" } : null
                ),
            ],
        });
    }

    // 4. Register Workspace Tab Switching Listener (Runs Once)
    if (!window.__spotlightTabListenerRegistered) {
        window.__spotlightTabListenerRegistered = true;

        app.workspace.on('active-leaf-change', (leaf) => {
            if (!leaf || !leaf.view || leaf.view.getViewType() !== 'markdown') return;
            const view = leaf.view;
            if (!view.editor || !view.editor.cm || !view.file) return;

            const targetCm = view.editor.cm;

            // Ensure field is attached to this tab's editor
            const hasExt = targetCm.state.field(window.__spotlightField, false) !== undefined;
            if (!hasExt) {
                targetCm.dispatch({
                    effects: StateEffect.appendConfig.of([window.__spotlightField])
                });
            }

            const saved = window.__spotlightFileMap?.get(view.file.path);
            const current = targetCm.state.field(window.__spotlightField, false);

            // Restore spotlight if this file had one, otherwise ensure off
            if (saved && (!current || current.fromPos !== saved.fromPos || current.toPos !== saved.toPos)) {
                targetCm.dispatch({
                    effects: window.__setSpotlightEffect.of(saved)
                });
            } else if (!saved && current && current.fromPos !== -1) {
                targetCm.dispatch({
                    effects: window.__setSpotlightEffect.of({ fromPos: -1, toPos: -1 })
                });
            }
        });
    }

    // Ensure field is attached to current view
    const hasField = cm.state.field(window.__spotlightField, false) !== undefined;
    if (!hasField) {
        cm.dispatch({
            effects: StateEffect.appendConfig.of([window.__spotlightField])
        });
    }

    // 5. Toggle OFF if already active for this file
    const currentSpotlight = cm.state.field(window.__spotlightField, false);
    if (currentSpotlight && currentSpotlight.fromPos !== -1) {
        window.__spotlightFileMap.delete(currentFilePath);
        cm.dispatch({
            effects: window.__setSpotlightEffect.of({ fromPos: -1, toPos: -1 })
        });
        return;
    }

    // 6. Calculate bullet + sub-bullets range
    const cursor = editor.getCursor();
    const totalLines = editor.lineCount();
    const startLineNum = cursor.line;
    const startLineText = editor.getLine(startLineNum);

    function getIndent(str) {
        const m = str.match(/^[\t ]*/);
        return m ? m[0].replace(/\t/g, '    ').length : 0;
    }

    const startIndent = getIndent(startLineText);
    let endLineNum = startLineNum;

    for (let i = startLineNum + 1; i < totalLines; i++) {
        const lineText = editor.getLine(i);
        if (lineText.trim() === '') {
            let hasMore = false;
            for (let j = i + 1; j < Math.min(i + 4, totalLines); j++) {
                const futureText = editor.getLine(j);
                if (futureText.trim() !== '') {
                    if (getIndent(futureText) > startIndent) hasMore = true;
                    break;
                }
            }
            if (hasMore) {
                endLineNum = i;
                continue;
            }
            break;
        }
        if (getIndent(lineText) > startIndent) {
            endLineNum = i;
        } else {
            break;
        }
    }

    const startPos = editor.posToOffset({ line: startLineNum, ch: 0 });
    const endPos = editor.posToOffset({ line: endLineNum, ch: editor.getLine(endLineNum).length });

    // 7. Save to Memory Map & Dispatch Native Highlight
    const targetRange = { fromPos: startPos, toPos: endPos };
    window.__spotlightFileMap.set(currentFilePath, targetRange);

    cm.dispatch({
        effects: window.__setSpotlightEffect.of(targetRange)
    });
};