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

        /* Keep focused heading/bullet + all its children 100% sharp and vibrant */
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

    // Dynamic Heading Resolver: captures the heading, its content, bullets, and any subheadings
    function getHeadingRange(doc, rootPos) {
        if (rootPos < 0 || rootPos > doc.length) return null;

        const startLineObj = doc.lineAt(rootPos);
        const startLineNum = startLineObj.number;
        const startText = startLineObj.text;

        // Matches ATX headings (# through ######)
        const headingMatch = startText.match(/^\s{0,3}(#{1,6})\s+(.*)/);
        if (!headingMatch) return null;

        const headingLevel = headingMatch[1].length;
        let endLineNum = doc.lines;
        let inCodeFence = false;

        for (let i = startLineNum + 1; i <= doc.lines; i++) {
            const lineText = doc.line(i).text;

            // Ignore headings written inside code fences (# comments in Python/Bash)
            if (/^\s{0,3}(```+|~~~+)/.test(lineText)) {
                inCodeFence = !inCodeFence;
                continue;
            }

            if (!inCodeFence) {
                const nextHeading = lineText.match(/^\s{0,3}(#{1,6})\s+/);
                if (nextHeading) {
                    const nextLevel = nextHeading[1].length;
                    // Stop if we reach another heading of equal or higher rank (e.g. another ## or #)
                    if (nextLevel <= headingLevel) {
                        endLineNum = i - 1;
                        break;
                    }
                }
            }
        }

        return { startLine: startLineNum, endLine: endLineNum };
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

    // General spotlight range resolver: headings first, then bullet hierarchies
    function getSpotlightRange(doc, rootPos) {
        return getHeadingRange(doc, rootPos) || getBulletTreeRange(doc, rootPos);
    }

    function buildDecorations(doc, rootPos) {
        if (rootPos === -1) return Decoration.none;
        const range = getSpotlightRange(doc, rootPos);
        if (!range) return Decoration.none;

        const decos = [];
        for (let l = range.startLine; l <= range.endLine; l++) {
            const line = doc.line(l);
            decos.push(
                Decoration.line({ class: "spotlight-focused" }).range(line.from)
            );
        }
        return Decoration.set(decos, true);
    }

    // 3. Attach logic to window so StateField closures always execute the latest functions
    window.__spotlightLogic = {
        buildDecorations,
        getSpotlightRange
    };

    // Silence older V1 StateField if it's currently running in memory
    if (window.__setSpotlightEffect && window.__spotlightField) {
        const oldState = cm.state.field(window.__spotlightField, false);
        if (oldState && oldState.rootPos !== -1) {
            cm.dispatch({
                effects: window.__setSpotlightEffect.of({ rootPos: -1 })
            });
        }
    }

    // 4. Define the Dynamic Tree Spotlight StateField (V2 with live delegator)
    if (!window.__setSpotlightEffectV2) {
        window.__setSpotlightEffectV2 = StateEffect.define();
        window.__spotlightFieldV2 = StateField.define({
            create() {
                return { rootPos: -1, deco: Decoration.none };
            },
            update(val, tr) {
                for (const e of tr.effects) {
                    if (e.is(window.__setSpotlightEffectV2)) {
                        const rootPos = e.value.rootPos;
                        if (rootPos === -1) {
                            return { rootPos: -1, deco: Decoration.none };
                        }
                        const safePos = Math.max(0, Math.min(rootPos, tr.newDoc.length));
                        return {
                            rootPos: safePos,
                            deco: window.__spotlightLogic.buildDecorations(tr.newDoc, safePos)
                        };
                    }
                }

                // When typing or editing: dynamically re-evaluate the spotlight tree
                if (tr.docChanged && val.rootPos !== -1) {
                    const newRootPos = tr.changes.mapPos(val.rootPos, 1);
                    const safePos = Math.max(0, Math.min(newRootPos, tr.newDoc.length));
                    return {
                        rootPos: safePos,
                        deco: window.__spotlightLogic.buildDecorations(tr.newDoc, safePos)
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

    // 5. Register Workspace Tab Switching Listener (Cleanly replaces previous ref)
    if (window.__spotlightTabEventRef) {
        app.workspace.offref(window.__spotlightTabEventRef);
    }

    window.__spotlightTabEventRef = app.workspace.on('active-leaf-change', (leaf) => {
        if (!leaf || !leaf.view || leaf.view.getViewType() !== 'markdown') return;
        const view = leaf.view;
        if (!view.editor || !view.editor.cm || !view.file) return;

        const targetCm = view.editor.cm;

        const hasExt = targetCm.state.field(window.__spotlightFieldV2, false) !== undefined;
        if (!hasExt) {
            targetCm.dispatch({
                effects: StateEffect.appendConfig.of([window.__spotlightFieldV2])
            });
        }

        const savedRootPos = window.__spotlightFileMap?.get(view.file.path);
        const current = targetCm.state.field(window.__spotlightFieldV2, false);

        if (savedRootPos !== undefined && savedRootPos !== -1) {
            targetCm.dispatch({
                effects: window.__setSpotlightEffectV2.of({ rootPos: savedRootPos })
            });
        } else if ((savedRootPos === undefined || savedRootPos === -1) && current && current.rootPos !== -1) {
            targetCm.dispatch({
                effects: window.__setSpotlightEffectV2.of({ rootPos: -1 })
            });
        }
    });

    // Ensure field is attached to current view
    const hasField = cm.state.field(window.__spotlightFieldV2, false) !== undefined;
    if (!hasField) {
        cm.dispatch({
            effects: StateEffect.appendConfig.of([window.__spotlightFieldV2])
        });
    }

    // 6. Determine Target Root Anchor
    const cursor = editor.getCursor();
    const targetRootPos = editor.posToOffset({ line: cursor.line, ch: 0 });
    const currentSpotlight = cm.state.field(window.__spotlightFieldV2, false);

    // Toggle OFF if user triggers it on the exact same root line
    if (currentSpotlight && currentSpotlight.rootPos !== -1) {
        const currentRootLine = cm.state.doc.lineAt(currentSpotlight.rootPos).number;
        const targetLine = cursor.line + 1; // 1-based line comparison

        if (currentRootLine === targetLine) {
            window.__spotlightFileMap.delete(currentFilePath);
            cm.dispatch({
                effects: window.__setSpotlightEffectV2.of({ rootPos: -1 })
            });
            return;
        }
    }

    // 7. Focus On the Target Heading/Bullet + All Its Sub-Content
    window.__spotlightFileMap.set(currentFilePath, targetRootPos);
    cm.dispatch({
        effects: window.__setSpotlightEffectV2.of({ rootPos: targetRootPos })
    });
};