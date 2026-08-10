import { App, MarkdownView, Notice, TFile, editorInfoField } from "obsidian";
import { EditorView, ViewUpdate } from "@codemirror/view";
import ProgressPlannerPlugin from "../main";

const ACTIVE_TASK_KEY = "tq-active-task";

interface ActiveTaskPointer {
    path: string;
    line: number;
    text: string; // raw line text at set-time, used for the status bar chip
    pos?: number; // exact character offset of the start of the task's text (after the checkbox)
}

/**
 * Owns two things that share one pointer:
 *   1. A status-bar-adjacent chip — a separate row inserted directly above
 *      Obsidian's native status bar (NOT a real addStatusBarItem() entry,
 *      since that route doesn't reliably respect flex `order` across themes/
 *      other plugins). Width is computed to end exactly where the native
 *      status bar begins, with manual binary-search truncation only when the
 *      text genuinely doesn't fit — same technique validated in StatusBarTest.js.
 *   2. A hotkey-triggered open into VaporNote, scrolled + cursored to the
 *      task's line — reusing VaporNote's own floating-leaf API (toggle/open/
 *      switch tab) instead of a separate custom floating editor, the same way
 *      OpenActiveTask.js already does it.
 *
 * Deliberately NOT clickable — the chip is peripheral-vision-only, VaporNote
 * is hotkey-only. Two different costs for two different jobs (glance vs.
 * engage), not two paths to the same destination.
 */
export class ActiveTaskPanel {
    private plugin: ProgressPlannerPlugin;
    private app: App;

    private pointer: ActiveTaskPointer | null = null;

    private row: HTMLElement | null = null;
    private chip: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private onWindowResize: (() => void) | null = null;

    constructor(plugin: ProgressPlannerPlugin) {
        this.plugin = plugin;
        this.app = plugin.app;

        this.loadPointer();

        // .status-bar should already exist by plugin load time in practice,
        // but onLayoutReady is the same guard main.ts already uses elsewhere
        // for anything that touches the live workspace DOM.
        this.app.workspace.onLayoutReady(() => this.buildChipRow());

        plugin.addCommand({
            id: "set-active-task-from-cursor",
            name: "Set active task (from cursor line)",
            editorCallback: (editor, view) => {
                if (!(view instanceof MarkdownView) || !view.file) return;
                const line = editor.getCursor().line;
                const text = editor.getLine(line);
                
                // Track the character offset of the actual text, NOT the start of the line (index 0).
                // This ensures that if the user presses Enter in front of the bullet point, the tracked
                // coordinate travels down with the text to the new line.
                const offset = this.getTextOffset(text);
                const pos = editor.posToOffset({ line, ch: offset });
                
                this.setActiveTask(view.file.path, line, text, pos);
            }
        });

        plugin.addCommand({
            id: "toggle-active-task-panel",
            name: "Open active task in VaporNote",
            callback: () => this.openInVaporNote()
        });

        plugin.addCommand({
            id: "clear-active-task",
            name: "Clear active task",
            callback: () => {
                this.clearActiveTask();
            }
        });

        // Auto-revert to "No active task" the moment the pointed-at checkbox
        // gets checked off, and keep the pointer text in sync with live edits.
        // We use a CodeMirror 6 editor extension to react instantly to keystrokes
        // and clicks in the live editor, bypassing the metadataCache disk-flush lag.
        plugin.registerEditorExtension(
            EditorView.updateListener.of((update: ViewUpdate) => {
                if (!update.docChanged || !this.pointer) return;

                try {
                    // Filter out passive duplicate views (e.g. main workspace view when typing in VaporNote)
                    // so line shifts are only calculated ONCE per keystroke.
                    const activeCm = (this.app.workspace.activeEditor as any)?.editor?.cm;
                    const isFocused = update.view.hasFocus ||
                                      update.view.dom.contains(document.activeElement) ||
                                      activeCm === update.view;

                    if (!isFocused) return;

                    // Extract TFile using Obsidian's editorInfoField (works in main workspace, VaporNote, splits, popouts)
                    const info = update.state.field(editorInfoField, false);
                    const file = info?.file ?? this.app.workspace.getActiveFile();
                    if (!file || file.path !== this.pointer.path) return;

                    // Ensure character offset is initialized
                    if (typeof this.pointer.pos !== "number") {
                        const initLine = Math.min(this.pointer.line + 1, update.startState.doc.lines);
                        const lineObj = update.startState.doc.line(initLine);
                        this.pointer.pos = lineObj.from + this.getTextOffset(lineObj.text);
                    }

                    // Map position through changes in this update
                    // assoc: 1 (right-bias) pushes the task down if Enter is pressed before the text.
                    const newPos = update.changes.mapPos(this.pointer.pos, 1);

                    const currentDoc = update.state.doc;
                    const safePos = Math.min(newPos, currentDoc.length);
                    const currentLineObj = currentDoc.lineAt(safePos);
                    
                    const newLineNo = currentLineObj.number;
                    const newPointerLine = newLineNo - 1;
                    const currentLineText = currentLineObj.text;

                    // Snap the pointer back to the exact start of the text (after the checkbox/bullet).
                    // This prevents the coordinate from drifting during formatting replacements or checkbox toggles.
                    const textOffset = this.getTextOffset(currentLineText);
                    this.pointer.pos = Math.min(currentLineObj.from + textOffset, currentLineObj.to);

                    let changed = false;

                    if (this.pointer.line !== newPointerLine) {
                        this.pointer.line = newPointerLine;
                        changed = true;
                    }

                    if (this.isLineChecked(currentLineText)) {
                        // Task was checked off!
                        window.requestAnimationFrame(() => this.clearActiveTask());
                        return;
                    }

                    if (this.pointer.text !== currentLineText) {
                        this.pointer.text = currentLineText;
                        changed = true;
                    }

                    if (changed) {
                        localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(this.pointer));
                        window.requestAnimationFrame(() => this.updateLayout());
                    }
                } catch (err) {
                    console.error("Progress Planner Active Task tracking error:", err);
                }
            })
        );

        // If the pointed-at file gets deleted out from under us, don't leave
        // a dangling chip pointing at nothing.
        plugin.registerEvent(
            this.app.vault.on("delete", (file) => {
                if (this.pointer && file.path === this.pointer.path) {
                    this.clearActiveTask();
                }
            })
        );

        // Keep the pointer following the file across renames instead of
        // silently going stale.
        plugin.registerEvent(
            this.app.vault.on("rename", (file, oldPath) => {
                if (this.pointer && oldPath === this.pointer.path && file instanceof TFile) {
                    this.pointer.path = file.path;
                    localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(this.pointer));
                }
            })
        );
    }

    onunload() {
        this.resizeObserver?.disconnect();
        if (this.onWindowResize) window.removeEventListener("resize", this.onWindowResize);
        this.row?.remove();
    }

    // ─── Pointer persistence ───

    private loadPointer() {
        const raw = localStorage.getItem(ACTIVE_TASK_KEY);
        if (!raw) { this.pointer = null; return; }
        try {
            this.pointer = JSON.parse(raw);
        } catch {
            this.pointer = null;
        }
    }

    setActiveTask(path: string, line: number, text: string, pos?: number) {
        this.pointer = { path, line, text, pos };
        localStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(this.pointer));
        this.updateLayout();
    }

    clearActiveTask() {
        this.pointer = null;
        localStorage.removeItem(ACTIVE_TASK_KEY);
        this.updateLayout();
    }

    /**
     * Calculates the length of any leading whitespace, bullet points, and checkboxes.
     * e.g., "  - [ ] Change time" returns 8 (the index of 'C').
     */
    private getTextOffset(lineText: string): number {
        const match = lineText.match(/^\s*(?:[-*+]|\d+\.)\s*(?:\[[ xX]?\]\s*)?/);
        if (match) return match[0].length;
        
        const wsMatch = lineText.match(/^\s*/);
        return wsMatch ? wsMatch[0].length : 0;
    }

    private currentChipText(): string {
        if (!this.pointer) return "No active task";
        // Strip a leading list/checkbox marker ("- [ ] ", "* [x] ", "-  ", etc.)
        // so the chip shows just the task's actual wording, not markdown syntax —
        // this is purely a display transform, the stored pointer keeps the raw
        // line untouched for the editor/VaporNote jump to still work correctly.
        return this.stripCheckboxMarker(this.pointer.text);
    }

    private stripCheckboxMarker(text: string): string {
        return text.replace(/^\s*[-*+]\s*(\[[ xX]?\]\s*)?/, "").trim();
    }

    private isLineChecked(lineText: string): boolean {
        const m = lineText.match(/\[(.)\]/);
        return (m?.[1] ?? "").toLowerCase() === "x";
    }

    // ─── Overlay chip row (validated design from StatusBarTest.js) ───

    private buildChipRow() {
        const statusBarContainer = document.querySelector<HTMLElement>(".status-bar");
        if (!statusBarContainer) return; // shouldn't happen post-onLayoutReady, but don't hard-fail if it does

        const parent = statusBarContainer.parentElement;
        if (!parent) return;

        const row = document.createElement("div");
        row.className = "tq-active-task-row";
        parent.insertBefore(row, statusBarContainer);
        this.row = row;

        const chip = document.createElement("div");
        chip.className = "tq-active-task-chip";
        row.appendChild(chip);
        this.chip = chip;

        this.updateLayout();

        this.resizeObserver = new ResizeObserver(() => this.updateLayout());
        this.resizeObserver.observe(statusBarContainer);

        this.onWindowResize = () => this.updateLayout();
        window.addEventListener("resize", this.onWindowResize);
    }

    /**
     * Sizes the row to end exactly where the native status bar begins, then
     * truncates the chip text only if it genuinely doesn't fit in that space —
     * binary search on substring length rather than a fixed character count,
     * so it only ever cuts when there's really no room left.
     */
    private updateLayout() {
        if (!this.row || !this.chip) return;

        const statusBarContainer = document.querySelector<HTMLElement>(".status-bar");
        if (!statusBarContainer) return;

        const parent = statusBarContainer.parentElement;
        if (!parent) return;

        const statusRect = statusBarContainer.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const comp = getComputedStyle(statusBarContainer);

        if (statusBarContainer.offsetHeight > 0) {
            this.row.style.height = `${statusBarContainer.offsetHeight}px`;
        }
        this.row.style.background = comp.backgroundColor;

        const topRadius = (comp.borderTopLeftRadius && comp.borderTopLeftRadius !== "0px")
            ? comp.borderTopLeftRadius
            : (comp.borderTopRightRadius && comp.borderTopRightRadius !== "0px" ? comp.borderTopRightRadius : "6px");
        this.row.style.borderTopRightRadius = topRadius;

        if (statusRect.width > 0 && statusRect.left > parentRect.left) {
            const availableWidth = statusRect.left - parentRect.left;
            this.row.style.width = `${availableWidth}px`;
        } else {
            this.row.style.width = "100%";
        }

        const maxChipWidth = Math.max(80, this.row.clientWidth - 8);
        this.chip.classList.toggle("is-empty", !this.pointer);
        this.fitText(this.chip, this.currentChipText(), maxChipWidth);
    }

    private fitText(el: HTMLElement, fullText: string, maxWidthPx: number) {
        const ELLIPSIS = "...";
        el.style.maxWidth = `${maxWidthPx}px`;
        el.textContent = fullText;
        if (el.scrollWidth <= maxWidthPx) return; // fits as-is, no cut needed

        let lo = 0, hi = fullText.length;
        while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            el.textContent = fullText.slice(0, mid) + ELLIPSIS;
            if (el.scrollWidth <= maxWidthPx) lo = mid;
            else hi = mid - 1;
        }
        el.textContent = fullText.slice(0, lo).trimEnd() + ELLIPSIS;
    }

    // ─── VaporNote-backed panel (mirrors OpenActiveTask.js's openInVapor) ───

    private getVaporPlugin(): any {
        return (this.app as any).plugins?.plugins?.["vapornote"] ?? null;
    }

    /**
     * Waits for a leaf's editor to actually be queryable before acting on it —
     * ported directly from OpenActiveTask.js's waitUntilEditorReady, since a
     * freshly-opened/switched-to leaf's editor isn't guaranteed ready on the
     * very next tick.
     */
    private waitUntilEditorReady(leaf: any, filePath: string, callback: (editor: any) => void) {
        const startTime = Date.now();
        const timeoutLimit = 1000;

        const check = () => {
            if (leaf.view && leaf.view.file && leaf.view.file.path === filePath) {
                const editor = leaf.view.editor;
                if (editor) {
                    try {
                        editor.lineCount();
                        callback(editor);
                        return;
                    } catch {
                        // editor not fully initialized yet
                    }
                }
            }
            if (Date.now() - startTime < timeoutLimit) {
                requestAnimationFrame(check);
            }
        };
        check();
    }

    async openInVaporNote() {
        if (!this.pointer) {
            new Notice("No active task set yet — run \"Set active task (from cursor line)\" first.");
            return;
        }

        const vaporPlugin = this.getVaporPlugin();
        if (!vaporPlugin) {
            new Notice("VaporNote plugin is not loaded.");
            return;
        }

        const filePath = this.pointer.path;
        const lineIdx = this.pointer.line;

        if (!filePath.endsWith(".md")) {
            new Notice("Only Markdown (.md) files can be opened.");
            return;
        }

        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) {
            new Notice(`Active task file not found: ${filePath}`);
            return;
        }

        // If VaporNote is already open (not minimized) and we're already sitting
        // at the end of this exact line, treat the hotkey as a toggle-away —
        // same behavior as OpenActiveTask.js's minimize-if-already-there check.
        if (typeof vaporPlugin._isOpen === "function" && vaporPlugin._isOpen() && !vaporPlugin._isMinimized) {
            const activeLeaf = vaporPlugin.floatingLeaves
                ? vaporPlugin.floatingLeaves[vaporPlugin.activeLeafIndex]
                : null;
            if (activeLeaf?.view?.file && activeLeaf.view.editor) {
                const activeFile = activeLeaf.view.file;
                const activeEditor = activeLeaf.view.editor;
                const cursor = activeEditor.getCursor();

                if (activeFile.path === filePath && cursor.line === lineIdx) {
                    const lineContent = activeEditor.getLine(lineIdx) || "";
                    if (cursor.ch === lineContent.length && typeof vaporPlugin.toggleMinimize === "function") {
                        vaporPlugin.toggleMinimize();
                        return;
                    }
                }
            }
        }

        if (!vaporPlugin._isOpen || !vaporPlugin._isOpen()) {
            await vaporPlugin.toggleVaporNote();
        }
        if (vaporPlugin._isMinimized) {
            vaporPlugin.toggleMinimize();
        }

        const leaves = vaporPlugin.floatingLeaves || [];
        const existingTabIdx = leaves.findIndex((l: any) => l.view?.file?.path === filePath);

        if (existingTabIdx !== -1) {
            if (typeof vaporPlugin._switchTab === "function") {
                vaporPlugin._switchTab(existingTabIdx);
            }
        } else if (typeof vaporPlugin._addNewTab === "function") {
            await vaporPlugin._addNewTab("file", filePath);
        }

        const currentLeaves = vaporPlugin.floatingLeaves || [];
        let targetLeaf = currentLeaves.find((l: any) => l.view?.file?.path === filePath);
        if (!targetLeaf && typeof vaporPlugin.activeLeafIndex === "number") {
            targetLeaf = currentLeaves[vaporPlugin.activeLeafIndex];
        }
        if (!targetLeaf) return;

        this.app.workspace.setActiveLeaf(targetLeaf, { focus: true });

        this.waitUntilEditorReady(targetLeaf, filePath, (vaporEditor) => {
            const lineContent = vaporEditor.getLine(lineIdx) || "";
            vaporEditor.setCursor({ line: lineIdx, ch: lineContent.length });
            vaporEditor.scrollIntoView({ from: { line: lineIdx, ch: 0 }, to: { line: lineIdx, ch: 0 } }, true);
            if (vaporEditor.focus) vaporEditor.focus();
        });
    }
}