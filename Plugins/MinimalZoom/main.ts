import {
    App,
    Editor,
    Notice,
    Plugin,
    editorEditorField,
} from "obsidian";
import { foldable } from "@codemirror/language";
import {
    EditorSelection,
    EditorState,
    RangeSet,
    StateEffect,
    StateField,
    Transaction,
} from "@codemirror/state";
import {
    Decoration,
    DecorationSet,
    EditorView,
} from "@codemirror/view";

interface ZoomRange {
    from: number;
    to: number;
    depth?: number;
}

interface ZoomState {
    decorations: DecorationSet;
    depth: number;
}

function getEditorViewFromEditorState(st: EditorState): EditorView {
    return st.field(editorEditorField as any) as EditorView;
}

function getEditorViewFromEditor(editor: Editor): EditorView {
    return (editor as any).cm as EditorView;
}

function isFoldingEnabled(app: App): boolean {
    const config = Object.assign(
        { foldHeading: true, foldIndent: true },
        (app.vault as any).config
    );
    return Boolean(config.foldHeading && config.foldIndent);
}

function getAncestorRanges(st: EditorState, pos: number): ZoomRange[] {
    const ancestors: ZoomRange[] = [];
    const posLine = st.doc.lineAt(pos);

    for (let i = 1; i < posLine.number; i++) {
        const line = st.doc.line(i);
        const f = foldable(st, line.from, line.to);
        if (f && f.to >= posLine.to) {
            ancestors.push({ from: line.from, to: f.to });
        }
    }
    return ancestors;
}

/* ---------------- Range & Zoom State ---------------- */

const zoomInEffect = StateEffect.define<ZoomRange>();
const zoomOutEffect = StateEffect.define<void>();
const zoomMarkHidden = Decoration.replace({ block: true });

const zoomStateField = StateField.define<ZoomState>({
    create: () => ({
        decorations: Decoration.none,
        depth: 0,
    }),
    update: (value, tr) => {
        let decos = value.decorations.map(tr.changes);
        let depth = value.depth;

        for (const e of tr.effects) {
            if (e.is(zoomInEffect)) {
                decos = decos.update({ filter: () => false });
                if (e.value.from > 0) {
                    decos = decos.update({
                        add: [zoomMarkHidden.range(0, e.value.from - 1)],
                    });
                }
                if (e.value.to < tr.newDoc.length) {
                    decos = decos.update({
                        add: [zoomMarkHidden.range(e.value.to + 1, tr.newDoc.length)],
                    });
                }
                depth = e.value.depth ?? 1;
            }
            if (e.is(zoomOutEffect)) {
                decos = decos.update({ filter: () => false });
                depth = 0;
            }
        }
        return { decorations: decos, depth };
    },
    provide: (f) => [
        EditorView.decorations.from(f, (val) => val.decorations),
        EditorView.editorAttributes.from(f, (val): Record<string, string> => ({
            class: val.depth > 0 ? "is-zoomed" : "",
            "data-zoom-level": val.depth > 0 ? String(val.depth) : "",
        })),
    ],
});

function rangeSetToArray(rs: RangeSet<Decoration>): ZoomRange[] {
    const res: ZoomRange[] = [];
    const i = rs.iter();
    while (i.value !== null) {
        res.push({ from: i.from, to: i.to });
        i.next();
    }
    return res;
}

function calculateVisibleContentBoundariesViolation(
    tr: Transaction,
    hiddenRanges: ZoomRange[]
) {
    let touchedBefore = false;
    let touchedAfter = false;
    let touchedInside = false;
    const t = (f: number, to: number) => Boolean(tr.changes.touchesRange(f, to));

    if (hiddenRanges.length === 2) {
        const a = hiddenRanges[0];
        const b = hiddenRanges[1];
        if (a && b) {
            touchedBefore = t(a.from, a.to);
            touchedInside = t(a.to + 1, b.from - 1);
            touchedAfter = t(b.from, b.to);
        }
    } else if (hiddenRanges.length === 1) {
        const a = hiddenRanges[0];
        if (a) {
            if (a.from === 0) {
                touchedBefore = t(a.from, a.to);
                touchedInside = t(a.to + 1, tr.newDoc.length);
            } else {
                touchedInside = t(0, a.from - 1);
                touchedAfter = t(a.from, a.to);
            }
        }
    }
    return {
        touchedOutside: touchedBefore || touchedAfter,
        touchedBefore,
        touchedAfter,
        touchedInside,
    };
}

function calculateLimitedSelection(
    selection: EditorSelection,
    from: number,
    to: number
): EditorSelection | null {
    const mainSelection = selection.main;
    const newSelection = EditorSelection.range(
        Math.min(Math.max(mainSelection.anchor, from), to),
        Math.min(Math.max(mainSelection.head, from), to),
        mainSelection.goalColumn
    );
    const shouldUpdate =
        selection.ranges.length > 1 ||
        newSelection.anchor !== mainSelection.anchor ||
        newSelection.head !== mainSelection.head;

    return shouldUpdate ? EditorSelection.create([newSelection]) : null;
}

/* ---------------- Plugin Main Class ---------------- */

export default class MinimalZoomPlugin extends Plugin {
    async onload() {
        this.registerEditorExtension(zoomStateField);

        // Limit Selection Extension
        this.registerEditorExtension(
            EditorState.transactionFilter.of((tr: Transaction) => {
                const e = tr.effects.find((eff) => eff.is(zoomInEffect));
                if (e) {
                    const newSel = calculateLimitedSelection(
                        tr.newSelection,
                        e.value.from,
                        e.value.to
                    );
                    return newSel ? [tr, { selection: newSel }] : tr;
                }
                if (!tr.selection || !tr.isUserEvent("select")) return tr;
                const range = this.calculateVisibleContentRange(tr.state);
                if (!range) return tr;
                const newSel = calculateLimitedSelection(
                    tr.newSelection,
                    range.from,
                    range.to
                );
                return newSel ? [tr, { selection: newSel }] : tr;
            })
        );

        // Reset Zoom if Content Boundaries Violated
        this.registerEditorExtension(
            EditorState.transactionExtender.of((tr: Transaction) => {
                const hidden = this.calculateHiddenContentRanges(tr.startState);
                const { touchedOutside, touchedInside } =
                    calculateVisibleContentBoundariesViolation(tr, hidden);
                if (touchedOutside && touchedInside) {
                    setTimeout(() => {
                        this.zoomOut(getEditorViewFromEditorState(tr.state));
                    }, 0);
                }
                return null;
            })
        );

        // 1. Zoom In Command
        this.addCommand({
            id: "zoom-in",
            name: "Zoom in",
            icon: "zoom-in",
            editorCallback: (editor: Editor) => {
                const v = getEditorViewFromEditor(editor);
                this.zoomIn(v, v.state.selection.main.head);
            },
        });

        // 2. Zoom Out One Level Command
        this.addCommand({
            id: "zoom-out-one-level",
            name: "Zoom out one level",
            icon: "zoom-out",
            editorCallback: (editor: Editor) => {
                const v = getEditorViewFromEditor(editor);
                this.zoomOutOneLevel(v);
            },
        });

        // 3. Zoom Out Entire Document Command
        this.addCommand({
            id: "zoom-out",
            name: "Zoom out the entire document",
            icon: "zoom-out",
            editorCallback: (editor: Editor) => {
                this.zoomOut(getEditorViewFromEditor(editor));
            },
        });
    }

    calculateHiddenContentRanges(st: EditorState): ZoomRange[] {
        return rangeSetToArray(st.field(zoomStateField).decorations);
    }

    calculateVisibleContentRange(st: EditorState): ZoomRange | null {
        const hidden = this.calculateHiddenContentRanges(st);
        if (hidden.length === 1) {
            const a = hidden[0];
            if (!a) return null;
            return a.from === 0
                ? { from: a.to + 1, to: st.doc.length }
                : { from: 0, to: a.from - 1 };
        }
        if (hidden.length === 2) {
            const a = hidden[0];
            const b = hidden[1];
            if (!a || !b) return null;
            return { from: a.to + 1, to: b.from - 1 };
        }
        return null;
    }

    calculateRangeForZooming(st: EditorState, pos: number): ZoomRange | null {
        const line = st.doc.lineAt(pos);
        const foldRange = foldable(st, line.from, line.to);
        if (!foldRange && /^\s*([-*+]|\d+\.)\s+/.test(line.text)) {
            return { from: line.from, to: line.to };
        }
        if (!foldRange) return null;
        return { from: line.from, to: foldRange.to };
    }

    zoomToRange(v: EditorView, from: number, to: number, depth: number) {
        v.dispatch({
            effects: [
                zoomInEffect.of({ from, to, depth }),
                EditorView.scrollIntoView(v.state.selection.main, { y: "start" }),
            ],
        });
    }

    zoomIn(v: EditorView, pos: number) {
        if (!isFoldingEnabled(this.app)) {
            new Notice(
                `Enable "Fold heading" and "Fold indent" under Settings -> Editor to zoom.`
            );
            return;
        }
        const range = this.calculateRangeForZooming(v.state, pos);
        if (!range) return;

        const ancestors = getAncestorRanges(v.state, range.from);
        const depth = ancestors.length + 1;

        this.zoomToRange(v, range.from, range.to, depth);
    }

    zoomOutOneLevel(v: EditorView) {
        const range = this.calculateVisibleContentRange(v.state);
        if (!range) return;

        const ancestors = getAncestorRanges(v.state, range.from);
        if (ancestors.length === 0) {
            this.zoomOut(v);
        } else {
            const parent = ancestors[ancestors.length - 1];
            if (parent) {
                this.zoomToRange(v, parent.from, parent.to, ancestors.length);
            }
        }
    }

    zoomOut(v: EditorView) {
        v.dispatch({
            effects: [
                zoomOutEffect.of(),
                EditorView.scrollIntoView(v.state.selection.main, { y: "center" }),
            ],
        });
    }
}