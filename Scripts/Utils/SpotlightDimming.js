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

        /* Keep focused bullet + all its children 100% sharp and vibrant */
        .cm-editor.is-spotlight-active .cm-line.spotlight-focused {
            opacity: 1 !important;
            filter: none !important;
        }
    `;

    // Helper to calculate indentation level (tabs = 4 spaces)
    function getIndent(str) {
        const m = str.match(/^[\t ]*/);
        return m ? m[0].replace(/\t/g, '    ').length : 0;
    }

    // Dynamic Tree Resolver: Finds the root bullet and ALL its nested children
    function getBulletTreeRange(doc, rootPos) {
        if (rootPos < 0 || rootPos > doc.length) return null;

        const startLineObj = doc.lineAt(rootPos);
        const startLineNum = startLineObj.number;
        const startText = startLineObj.text;
        const startIndent = getIndent(startText);
        let endLineNum = startLineNum;

        for (let i = startLineNum + 1; i <= doc.lines; i++) {
            const line = doc.line(i);
            const lineText = line.text;

            // Handle blank lines between sub-items
            if (lineText.trim() === '') {
                let hasMoreChildren = false;
                for (let j = i + 1; j <= Math.min(i + 4, doc.lines); j++) {
                    const futureText = doc.line(j).text;
                    if (futureText.trim() !== '') {
                        if (getIndent(futureText) > startIndent) {
                            hasMoreChildren = true;
                        }
                        break;
                    }
                }
                if (hasMoreChildren) {
                    endLineNum = i;
                    continue;
                }
                break;
            }

            // Any line indented deeper than the root is a child
            if (getIndent(lineText) > startIndent) {
                endLineNum = i;
            } else {
                break;
            }
        }

        return { startLine: startLineNum, endLine: endLineNum };
    }

    function buildDecorations(doc, rootPos) {
        if (rootPos === -1) return Decoration.none;
        const range = getBulletTreeRange(doc, rootPos);
        if (!range) return Decoration.none;

        const decos = [];
        for (let l = range.startLine; l <= range.endLine; l++) {
            const line = doc.line(l);
            decos.push(
                Decoration.line({ class: "spotlight-focused" }).range(line.from)
            );
        }
        return Decoration.set(decos);
    }

    // 3. Define the Dynamic Tree Spotlight StateField
    if (!window.__setSpotlightEffect) {
        window.__setSpotlightEffect = StateEffect.define();
        window.__spotlightField = StateField.define({
            create() {
                return { rootPos: -1, deco: Decoration.none };
            },
            update(val, tr) {
                for (const e of tr.effects) {
                    if (e.is(window.__setSpotlightEffect)) {
                        const rootPos = e.value.rootPos;
                        if (rootPos === -1) {
                            return { rootPos: -1, deco: Decoration.none };
                        }
                        const safePos = Math.max(0, Math.min(rootPos, tr.newDoc.length));
                        return {
                            rootPos: safePos,
                            deco: buildDecorations(tr.newDoc, safePos)
                        };
                    }
                }

                // When typing or editing: dynamically re-evaluate the bullet tree
                if (tr.docChanged && val.rootPos !== -1) {
                    const newRootPos = tr.changes.mapPos(val.rootPos, 1);
                    const safePos = Math.max(0, Math.min(newRootPos, tr.newDoc.length));
                    return {
                        rootPos: safePos,
                        deco: buildDecorations(tr.newDoc, safePos)
                    };
                }

                return val;
            },
            provide: (f) => [
                EditorView.decorations.from(f, (val) => val.deco),
                EditorView.editorAttributes.from(f, (val) =>
                    val.rootPos !== -1 ? { class: "is-spotlight-active" } : null
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

            // Ensure field is attached
            const hasExt = targetCm.state.field(window.__spotlightField, false) !== undefined;
            if (!hasExt) {
                targetCm.dispatch({
                    effects: StateEffect.appendConfig.of([window.__spotlightField])
                });
            }

            const savedRootPos = window.__spotlightFileMap?.get(view.file.path);
            const current = targetCm.state.field(window.__spotlightField, false);

            if (savedRootPos !== undefined && savedRootPos !== -1) {
                // Restore and dynamically evaluate the bullet tree for this tab
                targetCm.dispatch({
                    effects: window.__setSpotlightEffect.of({ rootPos: savedRootPos })
                });
            } else if ((savedRootPos === undefined || savedRootPos === -1) && current && current.rootPos !== -1) {
                targetCm.dispatch({
                    effects: window.__setSpotlightEffect.of({ rootPos: -1 })
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

    // 5. Determine Target Root Bullet Anchor
    const cursor = editor.getCursor();
    const targetRootPos = editor.posToOffset({ line: cursor.line, ch: 0 });
    const currentSpotlight = cm.state.field(window.__spotlightField, false);

    // Toggle OFF if user triggers it on the exact same root bullet line
    if (currentSpotlight && currentSpotlight.rootPos !== -1) {
        const currentRootLine = cm.state.doc.lineAt(currentSpotlight.rootPos).number;
        const targetLine = cursor.line + 1; // 1-based line comparison

        if (currentRootLine === targetLine) {
            window.__spotlightFileMap.delete(currentFilePath);
            cm.dispatch({
                effects: window.__setSpotlightEffect.of({ rootPos: -1 })
            });
            return;
        }
    }

    // 6. Focus On the Target Bullet + All Its Sub-Bullets
    window.__spotlightFileMap.set(currentFilePath, targetRootPos);
    cm.dispatch({
        effects: window.__setSpotlightEffect.of({ rootPos: targetRootPos })
    });
};