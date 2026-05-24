---
status: open
priority: "0"
dateCreated: 2026-05-22T03:45:31.186-04:00
dateModified: 2026-05-22T03:45:31.186-04:00
reminders:
  - id: rem_1779435883723_ryde5n1t7
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
parent:
  - "[[(T) Task Date Visualizer]]"
---
## V8
```ts

```
## V7
```ts
import { App, Editor, MarkdownFileInfo, MarkdownView, Modal, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs: number;        // accumulated ms attributed to this segment (persisted)
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");
	const boundaries: { line: number; level: number; heading: string }[] = [];

	let inCodeBlock = false;
	lines.forEach((l, i) => {
		// Toggle code-fence state; ignore heading matches inside fenced blocks
		if (l.trimStart().startsWith("```")) { inCodeBlock = !inCodeBlock; return; }
		if (inCodeBlock) return;
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{ heading: "Document", level: 1, startLine: 0, endLine: lines.length - 1, wordCount: countWords(content), durationMs: 0 }];
	}

	return boundaries
		.map((b, idx) => {
			const startLine = b.line;
			const next = boundaries[idx + 1];
			const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
			const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
			return { heading: b.heading, level: b.level, startLine, endLine, wordCount: countWords(bodyText), durationMs: 0 };
		})
		.filter(seg => seg.wordCount > 0);
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

function parseDuration(input: string): number | null {
	input = input.trim();
	// "X:YY" → mm:ss
	const colonMatch = input.match(/^(\d+):(\d{2})$/);
	if (colonMatch && colonMatch[1] && colonMatch[2]) {
		return (parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])) * 1000;
	}
	// "Xm Ys", "Xm", "Ys"
	const mMatch = input.match(/(\d+)m/);
	const sMatch = input.match(/(\d+)s/);
	if (mMatch || sMatch) {
		const mins = mMatch && mMatch[1] ? parseInt(mMatch[1]) : 0;
		const secs = sMatch && sMatch[1] ? parseInt(sMatch[1]) : 0;
		return (mins * 60 + secs) * 1000;
	}
	// Plain number treated as seconds
	const plain = parseInt(input);
	if (!isNaN(plain)) return plain * 1000;
	return null;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

class SectionsModal extends Modal {
	private plugin: ReadingPacePlugin;
	private view: MarkdownView;
	private editor: Editor;
	private path: string;
	private searchQuery = "";
	private showIncompleteOnly = false;
	private listEl!: HTMLElement;
	private refreshInterval!: number;

	constructor(app: App, plugin: ReadingPacePlugin, view: MarkdownView, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.view = view;
		this.editor = editor;
		this.path = view.file!.path;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.style.cssText = "width:560px; padding:0;";

		// Widen the modal dialog itself (the element Obsidian controls)
		const modalEl = contentEl.closest(".modal") as HTMLElement | null;
		if (modalEl) modalEl.style.width = "600px";

		// Header
		const header = contentEl.createEl("div");
		header.style.cssText = "padding:16px 20px 12px; border-bottom:1px solid var(--background-modifier-border);";

		// Title row with action buttons
		const titleRow = header.createEl("div");
		titleRow.style.cssText = "display:flex; align-items:center; gap:8px; margin-bottom:10px;";
		titleRow.createEl("div", { text: "Sections" }).style.cssText = "font-size:16px; font-weight:600; flex:1;";

		// Stats button
		const statsBtn = titleRow.createEl("button", { text: "📊 Stats" });
		statsBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer;";
		statsBtn.addEventListener("click", () => {
			const session = this.plugin.getSession(this.path);
			if (!session) { new Notice("No session data for this note."); return; }
			const totalMs = session.segments.reduce((sum, s) => sum + this.plugin.liveSegmentMs(this.path, session.segments.indexOf(s)), 0);
			const completedCount = session.segments.filter(s => !!s.completedAt).length;
			const totalCount = session.segments.length;
			new Notice(`📊 Stats\nTotal time: ${fmt(totalMs)}\nCompleted: ${completedCount} / ${totalCount} sections`, 8000);
		});

		// New Session button
		const resetBtn = titleRow.createEl("button", { text: "↺ New Session" });
		resetBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--color-red,#e05555); cursor:pointer;";
		resetBtn.addEventListener("click", async () => {
			const confirmed = confirm("Create new reading session for this note? All timing data will be cleared.");
			if (!confirmed) return;
			await this.plugin.resetSession(this.path, this.view.editor.getValue());
			this.renderList();
		});

		// Search + filter row
		const filterRow = header.createEl("div");
		filterRow.style.cssText = "display:flex; align-items:center; gap:8px;";

		const searchInput = filterRow.createEl("input", { type: "text", placeholder: "Search sections…" });
		searchInput.style.cssText = "flex:1; padding:6px 10px; border-radius:6px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); font-size:13px; box-sizing:border-box;";
		searchInput.value = this.searchQuery;
		searchInput.addEventListener("input", () => {
			this.searchQuery = searchInput.value;
			this.renderList();
		});

		const filterBtn = filterRow.createEl("button", { text: "Incomplete" });
		const updateFilterBtn = () => {
			filterBtn.style.cssText = `font-size:11px; padding:4px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); cursor:pointer; flex-shrink:0; background:${this.showIncompleteOnly ? "var(--color-accent)" : "var(--background-secondary)"}; color:${this.showIncompleteOnly ? "#fff" : "var(--text-normal)"};`;
		};
		updateFilterBtn();
		filterBtn.addEventListener("click", () => {
			this.showIncompleteOnly = !this.showIncompleteOnly;
			updateFilterBtn();
			this.renderList();
		});

		// List
		this.listEl = contentEl.createEl("div");
		this.listEl.style.cssText = "max-height:420px; overflow-y:auto; padding:8px 0;";
		this.renderList();

		// Refresh live durations every second without rebuilding DOM
		this.refreshInterval = window.setInterval(() => this.tickLive(), 1000);
	}

	onClose() {
		window.clearInterval(this.refreshInterval);
		this.contentEl.empty();
	}

	private renderList() {
		const scrollTop = this.listEl.scrollTop;
		this.listEl.empty();
		const session = this.plugin.getSession(this.path);
		if (!session) return;

		const query = this.searchQuery.toLowerCase();
		session.segments.forEach((seg, idx) => {
			if (query && !seg.heading.toLowerCase().includes(query)) return;
			if (this.showIncompleteOnly && !!seg.completedAt) return;

			const isActive = this.plugin.getActiveSegmentIdx(this.path) === idx;
			const isDone = !!seg.completedAt;

			// Row
			const row = this.listEl.createEl("div");
			row.setAttribute("data-idx", String(idx));
			const indent = Math.max(0, seg.level - 2) * 16;
			row.style.cssText = `display:flex; align-items:center; gap:8px; padding:7px 20px 7px ${20 + indent}px; border-radius:6px; transition:background 0.1s;`;
			row.addEventListener("mouseenter", () => row.style.background = "var(--background-modifier-hover)");
			row.addEventListener("mouseleave", () => row.style.background = "");

			// Status icon
			const icon = row.createEl("span", { text: isActive ? "▶" : isDone ? "✓" : "○" });
			icon.style.cssText = `font-size:12px; width:14px; flex-shrink:0; color:${isActive ? "var(--color-blue)" : isDone ? "var(--color-green)" : "var(--text-muted)"};`;

			// Heading (clickable → jump to section)
			const headingEl = row.createEl("span", { text: seg.heading });
			headingEl.style.cssText = "flex:1; font-size:13px; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
			if (isDone) headingEl.style.color = "var(--text-muted)";
			headingEl.addEventListener("click", () => {
				this.editor.setCursor({ line: seg.startLine, ch: 0 });
				this.editor.scrollIntoView({ from: { line: seg.startLine, ch: 0 }, to: { line: seg.startLine, ch: 0 } }, true);
				this.close();
			});

			// Word count
			const wc = row.createEl("span", { text: `${seg.wordCount}w` });
			wc.style.cssText = "font-size:11px; color:var(--text-faint); flex-shrink:0; width:40px; text-align:right;";

			// Duration (live if active, banked otherwise)
			const liveMs = this.plugin.liveSegmentMs(this.path, idx);
			const durEl = row.createEl("span", { text: liveMs > 0 ? fmt(liveMs) : "" });
			durEl.style.cssText = "font-size:12px; color:var(--text-muted); flex-shrink:0; width:60px; text-align:right;";
			if (liveMs > 0) {
				durEl.style.cursor = "pointer";
				durEl.title = "Click to edit";
				durEl.addEventListener("click", (e) => {
					e.stopPropagation();
					this.editDuration(durEl, seg, idx);
				});
			}

			// Start/Stop button
			// If done: show a grayed-out disabled "Start". If active: "Stop". Otherwise: "Start".
			const btnText = isActive ? "Stop" : "Start";
			const btn = row.createEl("button", { text: btnText });
			if (isDone && !isActive) {
				btn.disabled = true;
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-faint); cursor:not-allowed; flex-shrink:0; opacity:0.5;";
			} else {
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer; flex-shrink:0;";
				btn.addEventListener("click", async (e) => {
					e.stopPropagation();
					if (isActive) {
						await this.plugin.stopActiveSegment(this.path);
					} else {
						await this.plugin.startSegment(this.path, idx);
					}
					this.renderList();
				});
			}

			// Complete / Uncomplete button
			const doneBtn = row.createEl("button", { text: isDone ? "Undone" : "✓ Done" });
			doneBtn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:${isDone ? "var(--background-secondary)" : "var(--color-green)"}; color:${isDone ? "var(--text-muted)" : "#fff"}; cursor:pointer; flex-shrink:0;`;
			doneBtn.addEventListener("click", async (e) => {
				e.stopPropagation();
				await this.plugin.toggleSegmentComplete(this.path, idx);
				this.renderList();
			});
		});
		// Restore scroll position after re-render
		requestAnimationFrame(() => { this.listEl.scrollTop = scrollTop; });
	}

	// Update only the live duration of the active segment — no DOM rebuild
	private tickLive() {
		const activeIdx = this.plugin.getActiveSegmentIdx(this.path);
		if (activeIdx === null) return;
		const row = this.listEl.querySelector(`[data-idx="${activeIdx}"]`);
		if (!row) return;
		const durEl = row.querySelectorAll("span")[3] as HTMLElement | undefined;
		if (!durEl) return;
		const liveMs = this.plugin.liveSegmentMs(this.path, activeIdx);
		durEl.textContent = liveMs > 0 ? fmt(liveMs) : "";
	}

	private editDuration(durEl: HTMLElement, seg: Segment, idx: number) {
		const input = createEl("input", { type: "text" });
		input.value = fmt(seg.durationMs);
		input.style.cssText = "width:60px; font-size:12px; padding:1px 4px; text-align:right; border:1px solid var(--color-accent); border-radius:3px; background:var(--background-primary); color:var(--text-normal);";
		durEl.replaceWith(input);
		input.focus();
		input.select();

		const commit = async () => {
			const parsed = parseDuration(input.value);
			if (parsed !== null && parsed >= 0) {
				seg.durationMs = parsed;
				await this.plugin.saveSessionData();
			}
			durEl.textContent = fmt(seg.durationMs);
			input.replaceWith(durEl);
		};

		input.addEventListener("blur", commit);
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); input.blur(); }
			if (e.key === "Escape") { input.replaceWith(durEl); }
		});
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	data: PluginData = {};
	private statusBar!: HTMLElement;

	// In-memory live state — not persisted
	// Only ONE segment across ALL notes may run at a time.
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};
	private _activeSegmentIdx: Record<string, number | null> = {};
	private activeWindowStart: Record<string, number | null> = {};
	// Global active path — the note that currently has a running timer
	private _activeTimerPath: string | null = null;

	async onload() {
		this.data = (await this.loadData()) ?? {};

		// Migrate old sessions that stored durationMs as undefined
		for (const path of Object.keys(this.data)) {
			const session = this.data[path];
			if (session) {
				session.segments.forEach(seg => { if (seg.durationMs == null) seg.durationMs = 0; });
			}
		}

		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "open-sections",
			name: "Open sections panel",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				const mv = view as MarkdownView;
				if (!mv.file) return;
				this.ensureSession(mv);
				new SectionsModal(this.app, this, mv, editor).open();
			},
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));

		// Migrate data.json keys when a file is renamed or moved
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (this.data[oldPath]) {
					this.data[file.path] = this.data[oldPath];
					delete this.data[oldPath];
					this.saveData(this.data);
				}
				if (this._activeTimerPath === oldPath) this._activeTimerPath = file.path;
				if (this._activeSegmentIdx[oldPath] !== undefined) {
					this._activeSegmentIdx[file.path] = this._activeSegmentIdx[oldPath];
					delete this._activeSegmentIdx[oldPath];
				}
				if (this.activeWindowStart[oldPath] !== undefined) {
					this.activeWindowStart[file.path] = this.activeWindowStart[oldPath];
					delete this.activeWindowStart[oldPath];
				}
				if (this.timerState[oldPath] !== undefined) {
					this.timerState[file.path] = this.timerState[oldPath];
					delete this.timerState[oldPath];
				}
			})
		);

		this.initSession();
	}

	// ── Public API (used by SectionsModal) ────────────────────────────────

	getSession(path: string): NoteSession | undefined {
		return this.data[path];
	}

	/** Scan the document and create/overwrite the session (no timing data preserved). */
	async scanDocument(path: string, editorContent: string) {
		// Stop any running timer on this note before overwriting
		if (this._activeTimerPath === path) {
			await this.stopActiveSegment(path);
		}
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("✓ Document scanned.");
	}

	/** Reset session from the modal. */
	async resetSession(path: string, editorContent: string) {
		if (this._activeTimerPath === path) await this.stopActiveSegment(path);
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	getActiveSegmentIdx(path: string): number | null {
		return this._activeSegmentIdx[path] ?? null;
	}

	/** Live ms for a segment: banked durationMs + current active window if applicable. */
	liveSegmentMs(path: string, idx: number): number {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return 0;
		const base = seg.durationMs;
		if (this._activeSegmentIdx[path] === idx && this.timerState[path] === "running") {
			const start = this.activeWindowStart[path];
			return base + (start != null ? Date.now() - start : 0);
		}
		return base;
	}

	/** Start timing a specific segment. Stops any other running timer globally first. */
	async startSegment(path: string, idx: number) {
		// Stop any timer running on a different note
		if (this._activeTimerPath !== null && this._activeTimerPath !== path) {
			await this.stopActiveSegment(this._activeTimerPath);
		}
		// Stop any timer running on the same note (different segment)
		await this.stopActiveSegment(path);

		const session = this.data[path];
		if (!session) return;
		if (!session.segments[idx]) return;

		this._activeSegmentIdx[path] = idx;
		this.activeWindowStart[path] = Date.now();
		this.timerState[path] = "running";
		this._activeTimerPath = path;

		if (!session.startedAt) session.startedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();
	}

	/** Stop timing the active segment and bank its elapsed time. */
	async stopActiveSegment(path: string) {
		const activeIdx = this._activeSegmentIdx[path];
		if (activeIdx == null) return;

		const seg = this.data[path]?.segments[activeIdx];
		const start = this.activeWindowStart[path];
		if (seg && start != null && this.timerState[path] === "running") {
			seg.durationMs += Date.now() - start;
		}

		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		if (this._activeTimerPath === path) this._activeTimerPath = null;
		await this.saveData(this.data);
		this.refreshStatus();
	}

	async saveSessionData() {
		await this.saveData(this.data);
	}

	/** Toggle a segment's completed state from the sections panel. */
	async toggleSegmentComplete(path: string, idx: number) {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return;
		if (seg.completedAt) {
			// Un-complete: clear the timestamp
			delete seg.completedAt;
		} else {
			// Mark complete: bank active time if this segment is running, then stamp
			if (this._activeSegmentIdx[path] === idx) {
				const start = this.activeWindowStart[path];
				if (start != null && this.timerState[path] === "running") {
					seg.durationMs += Date.now() - start;
				}
				this._activeSegmentIdx[path] = null;
				this.activeWindowStart[path] = null;
			}
			seg.completedAt = Date.now();
		}
		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Session init ──────────────────────────────────────────────────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		this.ensureSession(view);
		this.refreshStatus();
	}

	private ensureSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}
	}

	// ── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ── Stamp at cursor ───────────────────────────────────────────────────

	private async stampAtCursor(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		// If this segment is active, bank its time
		if (this._activeSegmentIdx[path] === idx) {
			const start = this.activeWindowStart[path];
			if (start != null && this.timerState[path] === "running") {
				seg.durationMs += Date.now() - start;
			}
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}

		seg.completedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ── Pause / Resume ────────────────────────────────────────────────────

	private async togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			// Resume — restart active window if there's an active segment
			if (this._activeSegmentIdx[path] !== null) {
				this.activeWindowStart[path] = Date.now();
			}
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			// Pause — bank active segment time without clearing which segment is active
			const activeIdx = this._activeSegmentIdx[path];
			if (activeIdx !== null && activeIdx !== undefined) {
				const seg = this.data[path]?.segments[activeIdx];
				const start = this.activeWindowStart[path];
				if (seg && start != null) {
					seg.durationMs += Date.now() - start;
					this.activeWindowStart[path] = null;
				}
			}
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}

		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Reset ─────────────────────────────────────────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ── Estimate ──────────────────────────────────────────────────────────

	private buildEstimate(session: NoteSession, path: string): { nextLabel: string; nextEst: string; totalEst: string; hasPace: boolean } {
		const activeIdx = this._activeSegmentIdx[path];
		const done = session.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
		const remaining = session.segments.filter(s => !s.completedAt);
		// "Next" = first uncompleted segment that isn't the one currently active
		const next = remaining.find(s => session.segments.indexOf(s) !== activeIdx) ?? null;

		const totalWords = remaining.reduce((sum, s) => sum + s.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			return { nextLabel: next?.heading ?? "", nextEst: `${nextWords}w`, totalEst: `${totalWords}w`, hasPace: false };
		}

		const doneWords = done.reduce((sum, s) => sum + s.wordCount, 0);
		const doneMs = done.reduce((sum, s) => sum + s.durationMs, 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
			hasPace: true,
		};
	}

	// ── Status bar ────────────────────────────────────────────────────────

	private refreshStatus() {
		// If a timer is globally active, always show it regardless of which note is in view
		const activePath = this._activeTimerPath;
		if (activePath !== null) {
			const activeSess = this.data[activePath];
			const activeIdx = this._activeSegmentIdx[activePath];
			if (activeSess && activeIdx !== null && activeIdx !== undefined) {
				const activeSeg = activeSess.segments[activeIdx as number];
				const activeMs = this.liveSegmentMs(activePath, activeIdx as number);
				const { totalEst, hasPace } = this.buildEstimate(activeSess, activePath);
				const estStr = hasPace ? `Est. remaining: ${totalEst}` : "Calibrating Estimate";
				// Time left for this segment: counts down from expected, can go negative
				const done = activeSess.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
				let timeLeftStr: string;
				if (done.length > 0) {
					const pace = done.reduce((s, x) => s + x.durationMs, 0) / done.reduce((s, x) => s + x.wordCount, 0);
					const expectedMs = (activeSeg?.wordCount ?? 0) * pace;
					const leftMs = expectedMs - activeMs;
					timeLeftStr = leftMs >= 0 ? fmt(leftMs) : "-" + fmt(-leftMs);
				} else {
					timeLeftStr = fmt(activeMs);
				}
				// Format: 📖 Heading | Est. remaining: Xm | {time left for section}
				this.statusBar.setText(
					`📖 ${activeSeg?.heading ?? ""} | ${estStr} | ${timeLeftStr}`
				);
				return;
			}
		}

		// No globally active timer — show status of the currently visible note
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }
		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }
		const state = this.timerState[path];
		if (state === "unstarted" || state === undefined) {
			this.statusBar.setText("📖 –");
			return;
		}
		// Paused / stopped — show estimate for the current note
		const { totalEst, hasPace } = this.buildEstimate(session, path);
		const estStr = hasPace ? `Est. Remaining: ${totalEst}` : "Calibrating Estimate";
		this.statusBar.setText(`📖 ${estStr}`);
	}
}
```
## V6
```ts
import { App, Editor, MarkdownFileInfo, MarkdownView, Modal, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs: number;        // accumulated ms attributed to this segment (persisted)
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");
	const boundaries: { line: number; level: number; heading: string }[] = [];

	let inCodeBlock = false;
	lines.forEach((l, i) => {
		// Toggle code-fence state; ignore heading matches inside fenced blocks
		if (l.trimStart().startsWith("```")) { inCodeBlock = !inCodeBlock; return; }
		if (inCodeBlock) return;
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{ heading: "Document", level: 1, startLine: 0, endLine: lines.length - 1, wordCount: countWords(content), durationMs: 0 }];
	}

	return boundaries
		.map((b, idx) => {
			const startLine = b.line;
			const next = boundaries[idx + 1];
			const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
			const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
			return { heading: b.heading, level: b.level, startLine, endLine, wordCount: countWords(bodyText), durationMs: 0 };
		})
		.filter(seg => seg.wordCount > 0);
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

function parseDuration(input: string): number | null {
	input = input.trim();
	// "X:YY" → mm:ss
	const colonMatch = input.match(/^(\d+):(\d{2})$/);
	if (colonMatch && colonMatch[1] && colonMatch[2]) {
		return (parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])) * 1000;
	}
	// "Xm Ys", "Xm", "Ys"
	const mMatch = input.match(/(\d+)m/);
	const sMatch = input.match(/(\d+)s/);
	if (mMatch || sMatch) {
		const mins = mMatch && mMatch[1] ? parseInt(mMatch[1]) : 0;
		const secs = sMatch && sMatch[1] ? parseInt(sMatch[1]) : 0;
		return (mins * 60 + secs) * 1000;
	}
	// Plain number treated as seconds
	const plain = parseInt(input);
	if (!isNaN(plain)) return plain * 1000;
	return null;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

class SectionsModal extends Modal {
	private plugin: ReadingPacePlugin;
	private view: MarkdownView;
	private editor: Editor;
	private path: string;
	private searchQuery = "";
	private showIncompleteOnly = false;
	private listEl!: HTMLElement;
	private refreshInterval!: number;

	constructor(app: App, plugin: ReadingPacePlugin, view: MarkdownView, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.view = view;
		this.editor = editor;
		this.path = view.file!.path;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.style.cssText = "width:720px; padding:0;";

		// Header
		const header = contentEl.createEl("div");
		header.style.cssText = "padding:16px 20px 12px; border-bottom:1px solid var(--background-modifier-border);";

		// Title row with action buttons
		const titleRow = header.createEl("div");
		titleRow.style.cssText = "display:flex; align-items:center; gap:8px; margin-bottom:10px;";
		titleRow.createEl("div", { text: "Sections" }).style.cssText = "font-size:16px; font-weight:600; flex:1;";

		// Stats button
		const statsBtn = titleRow.createEl("button", { text: "📊 Stats" });
		statsBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer;";
		statsBtn.addEventListener("click", () => {
			const session = this.plugin.getSession(this.path);
			if (!session) { new Notice("No session data for this note."); return; }
			const totalMs = session.segments.reduce((sum, s) => sum + this.plugin.liveSegmentMs(this.path, session.segments.indexOf(s)), 0);
			const completedCount = session.segments.filter(s => !!s.completedAt).length;
			const totalCount = session.segments.length;
			new Notice(`📊 Stats\nTotal time: ${fmt(totalMs)}\nCompleted: ${completedCount} / ${totalCount} sections`, 8000);
		});

		// New Session button
		const resetBtn = titleRow.createEl("button", { text: "↺ New Session" });
		resetBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--color-red,#e05555); cursor:pointer;";
		resetBtn.addEventListener("click", async () => {
			const confirmed = confirm("Create new reading session for this note? All timing data will be cleared.");
			if (!confirmed) return;
			await this.plugin.resetSession(this.path, this.view.editor.getValue());
			this.renderList();
		});

		// Search + filter row
		const filterRow = header.createEl("div");
		filterRow.style.cssText = "display:flex; align-items:center; gap:8px;";

		const searchInput = filterRow.createEl("input", { type: "text", placeholder: "Search sections…" });
		searchInput.style.cssText = "flex:1; padding:6px 10px; border-radius:6px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); font-size:13px; box-sizing:border-box;";
		searchInput.value = this.searchQuery;
		searchInput.addEventListener("input", () => {
			this.searchQuery = searchInput.value;
			this.renderList();
		});

		const filterBtn = filterRow.createEl("button", { text: "Incomplete" });
		const updateFilterBtn = () => {
			filterBtn.style.cssText = `font-size:11px; padding:4px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); cursor:pointer; flex-shrink:0; background:${this.showIncompleteOnly ? "var(--color-accent)" : "var(--background-secondary)"}; color:${this.showIncompleteOnly ? "#fff" : "var(--text-normal)"};`;
		};
		updateFilterBtn();
		filterBtn.addEventListener("click", () => {
			this.showIncompleteOnly = !this.showIncompleteOnly;
			updateFilterBtn();
			this.renderList();
		});

		// List
		this.listEl = contentEl.createEl("div");
		this.listEl.style.cssText = "max-height:420px; overflow-y:auto; padding:8px 0;";
		this.renderList();

		// Refresh live durations every second without rebuilding DOM
		this.refreshInterval = window.setInterval(() => this.tickLive(), 1000);
	}

	onClose() {
		window.clearInterval(this.refreshInterval);
		this.contentEl.empty();
	}

	private renderList() {
		const scrollTop = this.listEl.scrollTop;
		this.listEl.empty();
		const session = this.plugin.getSession(this.path);
		if (!session) return;

		const query = this.searchQuery.toLowerCase();
		session.segments.forEach((seg, idx) => {
			if (query && !seg.heading.toLowerCase().includes(query)) return;
			if (this.showIncompleteOnly && !!seg.completedAt) return;

			const isActive = this.plugin.getActiveSegmentIdx(this.path) === idx;
			const isDone = !!seg.completedAt;

			// Row
			const row = this.listEl.createEl("div");
			row.setAttribute("data-idx", String(idx));
			const indent = Math.max(0, seg.level - 2) * 16;
			row.style.cssText = `display:flex; align-items:center; gap:8px; padding:7px 20px 7px ${20 + indent}px; border-radius:6px; transition:background 0.1s;`;
			row.addEventListener("mouseenter", () => row.style.background = "var(--background-modifier-hover)");
			row.addEventListener("mouseleave", () => row.style.background = "");

			// Status icon
			const icon = row.createEl("span", { text: isActive ? "▶" : isDone ? "✓" : "○" });
			icon.style.cssText = `font-size:12px; width:14px; flex-shrink:0; color:${isActive ? "var(--color-blue)" : isDone ? "var(--color-green)" : "var(--text-muted)"};`;

			// Heading (clickable → jump to section)
			const headingEl = row.createEl("span", { text: seg.heading });
			headingEl.style.cssText = "flex:1; font-size:13px; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
			if (isDone) headingEl.style.color = "var(--text-muted)";
			headingEl.addEventListener("click", () => {
				this.editor.setCursor({ line: seg.startLine, ch: 0 });
				this.editor.scrollIntoView({ from: { line: seg.startLine, ch: 0 }, to: { line: seg.startLine, ch: 0 } }, true);
				this.close();
			});

			// Word count
			const wc = row.createEl("span", { text: `${seg.wordCount}w` });
			wc.style.cssText = "font-size:11px; color:var(--text-faint); flex-shrink:0; width:40px; text-align:right;";

			// Duration (live if active, banked otherwise)
			const liveMs = this.plugin.liveSegmentMs(this.path, idx);
			const durEl = row.createEl("span", { text: liveMs > 0 ? fmt(liveMs) : "" });
			durEl.style.cssText = "font-size:12px; color:var(--text-muted); flex-shrink:0; width:60px; text-align:right;";
			if (liveMs > 0) {
				durEl.style.cursor = "pointer";
				durEl.title = "Click to edit";
				durEl.addEventListener("click", (e) => {
					e.stopPropagation();
					this.editDuration(durEl, seg, idx);
				});
			}

			// Start/Stop button
			// If done: show a grayed-out disabled "Start". If active: "Stop". Otherwise: "Start".
			const btnText = isActive ? "Stop" : "Start";
			const btn = row.createEl("button", { text: btnText });
			if (isDone && !isActive) {
				btn.disabled = true;
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-faint); cursor:not-allowed; flex-shrink:0; opacity:0.5;";
			} else {
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer; flex-shrink:0;";
				btn.addEventListener("click", async (e) => {
					e.stopPropagation();
					if (isActive) {
						await this.plugin.stopActiveSegment(this.path);
					} else {
						await this.plugin.startSegment(this.path, idx);
					}
					this.renderList();
				});
			}

			// Complete / Uncomplete button
			const doneBtn = row.createEl("button", { text: isDone ? "Undone" : "✓ Done" });
			doneBtn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:${isDone ? "var(--background-secondary)" : "var(--color-green)"}; color:${isDone ? "var(--text-muted)" : "#fff"}; cursor:pointer; flex-shrink:0;`;
			doneBtn.addEventListener("click", async (e) => {
				e.stopPropagation();
				await this.plugin.toggleSegmentComplete(this.path, idx);
				this.renderList();
			});
		});
		// Restore scroll position after re-render
		requestAnimationFrame(() => { this.listEl.scrollTop = scrollTop; });
	}

	// Update only the live duration of the active segment — no DOM rebuild
	private tickLive() {
		const activeIdx = this.plugin.getActiveSegmentIdx(this.path);
		if (activeIdx === null) return;
		const row = this.listEl.querySelector(`[data-idx="${activeIdx}"]`);
		if (!row) return;
		const durEl = row.querySelectorAll("span")[3] as HTMLElement | undefined;
		if (!durEl) return;
		const liveMs = this.plugin.liveSegmentMs(this.path, activeIdx);
		durEl.textContent = liveMs > 0 ? fmt(liveMs) : "";
	}

	private editDuration(durEl: HTMLElement, seg: Segment, idx: number) {
		const input = createEl("input", { type: "text" });
		input.value = fmt(seg.durationMs);
		input.style.cssText = "width:60px; font-size:12px; padding:1px 4px; text-align:right; border:1px solid var(--color-accent); border-radius:3px; background:var(--background-primary); color:var(--text-normal);";
		durEl.replaceWith(input);
		input.focus();
		input.select();

		const commit = async () => {
			const parsed = parseDuration(input.value);
			if (parsed !== null && parsed >= 0) {
				seg.durationMs = parsed;
				await this.plugin.saveSessionData();
			}
			durEl.textContent = fmt(seg.durationMs);
			input.replaceWith(durEl);
		};

		input.addEventListener("blur", commit);
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); input.blur(); }
			if (e.key === "Escape") { input.replaceWith(durEl); }
		});
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	data: PluginData = {};
	private statusBar!: HTMLElement;

	// In-memory live state — not persisted
	// Only ONE segment across ALL notes may run at a time.
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};
	private _activeSegmentIdx: Record<string, number | null> = {};
	private activeWindowStart: Record<string, number | null> = {};
	// Global active path — the note that currently has a running timer
	private _activeTimerPath: string | null = null;

	async onload() {
		this.data = (await this.loadData()) ?? {};

		// Migrate old sessions that stored durationMs as undefined
		for (const path of Object.keys(this.data)) {
			const session = this.data[path];
			if (session) {
				session.segments.forEach(seg => { if (seg.durationMs == null) seg.durationMs = 0; });
			}
		}

		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "open-sections",
			name: "Open sections panel",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				const mv = view as MarkdownView;
				if (!mv.file) return;
				this.ensureSession(mv);
				new SectionsModal(this.app, this, mv, editor).open();
			},
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));

		// Migrate data.json keys when a file is renamed or moved
		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (this.data[oldPath]) {
					this.data[file.path] = this.data[oldPath];
					delete this.data[oldPath];
					this.saveData(this.data);
				}
				if (this._activeTimerPath === oldPath) this._activeTimerPath = file.path;
				if (this._activeSegmentIdx[oldPath] !== undefined) {
					this._activeSegmentIdx[file.path] = this._activeSegmentIdx[oldPath];
					delete this._activeSegmentIdx[oldPath];
				}
				if (this.activeWindowStart[oldPath] !== undefined) {
					this.activeWindowStart[file.path] = this.activeWindowStart[oldPath];
					delete this.activeWindowStart[oldPath];
				}
				if (this.timerState[oldPath] !== undefined) {
					this.timerState[file.path] = this.timerState[oldPath];
					delete this.timerState[oldPath];
				}
			})
		);

		this.initSession();
	}

	// ── Public API (used by SectionsModal) ────────────────────────────────

	getSession(path: string): NoteSession | undefined {
		return this.data[path];
	}

	/** Scan the document and create/overwrite the session (no timing data preserved). */
	async scanDocument(path: string, editorContent: string) {
		// Stop any running timer on this note before overwriting
		if (this._activeTimerPath === path) {
			await this.stopActiveSegment(path);
		}
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("✓ Document scanned.");
	}

	/** Reset session from the modal. */
	async resetSession(path: string, editorContent: string) {
		if (this._activeTimerPath === path) await this.stopActiveSegment(path);
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	getActiveSegmentIdx(path: string): number | null {
		return this._activeSegmentIdx[path] ?? null;
	}

	/** Live ms for a segment: banked durationMs + current active window if applicable. */
	liveSegmentMs(path: string, idx: number): number {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return 0;
		const base = seg.durationMs;
		if (this._activeSegmentIdx[path] === idx && this.timerState[path] === "running") {
			const start = this.activeWindowStart[path];
			return base + (start != null ? Date.now() - start : 0);
		}
		return base;
	}

	/** Start timing a specific segment. Stops any other running timer globally first. */
	async startSegment(path: string, idx: number) {
		// Stop any timer running on a different note
		if (this._activeTimerPath !== null && this._activeTimerPath !== path) {
			await this.stopActiveSegment(this._activeTimerPath);
		}
		// Stop any timer running on the same note (different segment)
		await this.stopActiveSegment(path);

		const session = this.data[path];
		if (!session) return;
		if (!session.segments[idx]) return;

		this._activeSegmentIdx[path] = idx;
		this.activeWindowStart[path] = Date.now();
		this.timerState[path] = "running";
		this._activeTimerPath = path;

		if (!session.startedAt) session.startedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();
	}

	/** Stop timing the active segment and bank its elapsed time. */
	async stopActiveSegment(path: string) {
		const activeIdx = this._activeSegmentIdx[path];
		if (activeIdx == null) return;

		const seg = this.data[path]?.segments[activeIdx];
		const start = this.activeWindowStart[path];
		if (seg && start != null && this.timerState[path] === "running") {
			seg.durationMs += Date.now() - start;
		}

		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		if (this._activeTimerPath === path) this._activeTimerPath = null;
		await this.saveData(this.data);
		this.refreshStatus();
	}

	async saveSessionData() {
		await this.saveData(this.data);
	}

	/** Toggle a segment's completed state from the sections panel. */
	async toggleSegmentComplete(path: string, idx: number) {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return;
		if (seg.completedAt) {
			// Un-complete: clear the timestamp
			delete seg.completedAt;
		} else {
			// Mark complete: bank active time if this segment is running, then stamp
			if (this._activeSegmentIdx[path] === idx) {
				const start = this.activeWindowStart[path];
				if (start != null && this.timerState[path] === "running") {
					seg.durationMs += Date.now() - start;
				}
				this._activeSegmentIdx[path] = null;
				this.activeWindowStart[path] = null;
			}
			seg.completedAt = Date.now();
		}
		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Session init ──────────────────────────────────────────────────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		this.ensureSession(view);
		this.refreshStatus();
	}

	private ensureSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}
	}

	// ── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ── Stamp at cursor ───────────────────────────────────────────────────

	private async stampAtCursor(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		// If this segment is active, bank its time
		if (this._activeSegmentIdx[path] === idx) {
			const start = this.activeWindowStart[path];
			if (start != null && this.timerState[path] === "running") {
				seg.durationMs += Date.now() - start;
			}
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}

		seg.completedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ── Pause / Resume ────────────────────────────────────────────────────

	private async togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			// Resume — restart active window if there's an active segment
			if (this._activeSegmentIdx[path] !== null) {
				this.activeWindowStart[path] = Date.now();
			}
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			// Pause — bank active segment time without clearing which segment is active
			const activeIdx = this._activeSegmentIdx[path];
			if (activeIdx !== null && activeIdx !== undefined) {
				const seg = this.data[path]?.segments[activeIdx];
				const start = this.activeWindowStart[path];
				if (seg && start != null) {
					seg.durationMs += Date.now() - start;
					this.activeWindowStart[path] = null;
				}
			}
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}

		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Reset ─────────────────────────────────────────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ── Estimate ──────────────────────────────────────────────────────────

	private buildEstimate(session: NoteSession, path: string): { nextLabel: string; nextEst: string; totalEst: string; hasPace: boolean } {
		const activeIdx = this._activeSegmentIdx[path];
		const done = session.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
		const remaining = session.segments.filter(s => !s.completedAt);
		// "Next" = first uncompleted segment that isn't the one currently active
		const next = remaining.find(s => session.segments.indexOf(s) !== activeIdx) ?? null;

		const totalWords = remaining.reduce((sum, s) => sum + s.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			return { nextLabel: next?.heading ?? "", nextEst: `${nextWords}w`, totalEst: `${totalWords}w`, hasPace: false };
		}

		const doneWords = done.reduce((sum, s) => sum + s.wordCount, 0);
		const doneMs = done.reduce((sum, s) => sum + s.durationMs, 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
			hasPace: true,
		};
	}

	// ── Status bar ────────────────────────────────────────────────────────

	private refreshStatus() {
		// If a timer is globally active, always show it regardless of which note is in view
		const activePath = this._activeTimerPath;
		if (activePath !== null) {
			const activeSess = this.data[activePath];
			const activeIdx = this._activeSegmentIdx[activePath];
			if (activeSess && activeIdx !== null && activeIdx !== undefined) {
				const activeSeg = activeSess.segments[activeIdx as number];
				const activeMs = this.liveSegmentMs(activePath, activeIdx as number);
				const { totalEst, hasPace } = this.buildEstimate(activeSess, activePath);
				const estStr = hasPace ? `Est. remaining: ${totalEst}` : "Calibrating Estimate";
				// Time left for this segment: counts down from expected, can go negative
				const done = activeSess.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
				let timeLeftStr: string;
				if (done.length > 0) {
					const pace = done.reduce((s, x) => s + x.durationMs, 0) / done.reduce((s, x) => s + x.wordCount, 0);
					const expectedMs = (activeSeg?.wordCount ?? 0) * pace;
					const leftMs = expectedMs - activeMs;
					timeLeftStr = leftMs >= 0 ? fmt(leftMs) : "-" + fmt(-leftMs);
				} else {
					timeLeftStr = fmt(activeMs);
				}
				// Format: 📖 Heading | Est. remaining: Xm | {time left for section}
				this.statusBar.setText(
					`📖 ${activeSeg?.heading ?? ""} | ${estStr} | ${timeLeftStr}`
				);
				return;
			}
		}

		// No globally active timer — show status of the currently visible note
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }
		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }
		const state = this.timerState[path];
		if (state === "unstarted" || state === undefined) {
			this.statusBar.setText("📖 –");
			return;
		}
		// Paused / stopped — show estimate for the current note
		const { totalEst, hasPace } = this.buildEstimate(session, path);
		const estStr = hasPace ? `Est. Remaining: ${totalEst}` : "Calibrating Estimate";
		this.statusBar.setText(`📖 ${estStr} ⏸`);
	}
}
```
## V5
```ts
import { App, Editor, MarkdownFileInfo, MarkdownView, Modal, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs: number;        // accumulated ms attributed to this segment (persisted)
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");
	const boundaries: { line: number; level: number; heading: string }[] = [];

	let inCodeBlock = false;
	lines.forEach((l, i) => {
		// Toggle code-fence state; ignore heading matches inside fenced blocks
		if (l.trimStart().startsWith("```")) { inCodeBlock = !inCodeBlock; return; }
		if (inCodeBlock) return;
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{ heading: "Document", level: 1, startLine: 0, endLine: lines.length - 1, wordCount: countWords(content), durationMs: 0 }];
	}

	return boundaries
		.map((b, idx) => {
			const startLine = b.line;
			const next = boundaries[idx + 1];
			const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
			const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
			return { heading: b.heading, level: b.level, startLine, endLine, wordCount: countWords(bodyText), durationMs: 0 };
		})
		.filter(seg => seg.wordCount > 0);
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

function parseDuration(input: string): number | null {
	input = input.trim();
	// "X:YY" → mm:ss
	const colonMatch = input.match(/^(\d+):(\d{2})$/);
	if (colonMatch && colonMatch[1] && colonMatch[2]) {
		return (parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])) * 1000;
	}
	// "Xm Ys", "Xm", "Ys"
	const mMatch = input.match(/(\d+)m/);
	const sMatch = input.match(/(\d+)s/);
	if (mMatch || sMatch) {
		const mins = mMatch && mMatch[1] ? parseInt(mMatch[1]) : 0;
		const secs = sMatch && sMatch[1] ? parseInt(sMatch[1]) : 0;
		return (mins * 60 + secs) * 1000;
	}
	// Plain number treated as seconds
	const plain = parseInt(input);
	if (!isNaN(plain)) return plain * 1000;
	return null;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

class SectionsModal extends Modal {
	private plugin: ReadingPacePlugin;
	private view: MarkdownView;
	private editor: Editor;
	private path: string;
	private searchQuery = "";
	private showIncompleteOnly = false;
	private listEl!: HTMLElement;
	private refreshInterval!: number;

	constructor(app: App, plugin: ReadingPacePlugin, view: MarkdownView, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.view = view;
		this.editor = editor;
		this.path = view.file!.path;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.style.cssText = "width:560px; padding:0;";

		// Header
		const header = contentEl.createEl("div");
		header.style.cssText = "padding:16px 20px 12px; border-bottom:1px solid var(--background-modifier-border);";

		// Title row with action buttons
		const titleRow = header.createEl("div");
		titleRow.style.cssText = "display:flex; align-items:center; gap:8px; margin-bottom:10px;";
		titleRow.createEl("div", { text: "Sections" }).style.cssText = "font-size:16px; font-weight:600; flex:1;";

		// Scan button — scans the document and initialises a session if none exists
		const startBtn = titleRow.createEl("button", { text: "⟳ Scan" });
		startBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer;";
		startBtn.addEventListener("click", async () => {
			const existing = this.plugin.getSession(this.path);
			if (existing) {
				const overwrite = confirm("A scan already exists for this note. Re-scan and overwrite all existing data?");
				if (!overwrite) return;
			}
			await this.plugin.scanDocument(this.path, this.view.editor.getValue());
			this.renderList();
		});

		// Stats button
		const statsBtn = titleRow.createEl("button", { text: "📊 Stats" });
		statsBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer;";
		statsBtn.addEventListener("click", () => {
			const session = this.plugin.getSession(this.path);
			if (!session) { new Notice("No session data for this note."); return; }
			const totalMs = session.segments.reduce((sum, s) => sum + this.plugin.liveSegmentMs(this.path, session.segments.indexOf(s)), 0);
			const completedCount = session.segments.filter(s => !!s.completedAt).length;
			const totalCount = session.segments.length;
			new Notice(`📊 Stats\nTotal time: ${fmt(totalMs)}\nCompleted: ${completedCount} / ${totalCount} sections`, 8000);
		});

		// Reset button
		const resetBtn = titleRow.createEl("button", { text: "↺ Reset" });
		resetBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--color-red,#e05555); cursor:pointer;";
		resetBtn.addEventListener("click", async () => {
			const confirmed = confirm("Reset the reading session for this note? All timing data will be cleared.");
			if (!confirmed) return;
			await this.plugin.resetSession(this.path, this.view.editor.getValue());
			this.renderList();
		});

		// Search + filter row
		const filterRow = header.createEl("div");
		filterRow.style.cssText = "display:flex; align-items:center; gap:8px;";

		const searchInput = filterRow.createEl("input", { type: "text", placeholder: "Search sections…" });
		searchInput.style.cssText = "flex:1; padding:6px 10px; border-radius:6px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); font-size:13px; box-sizing:border-box;";
		searchInput.value = this.searchQuery;
		searchInput.addEventListener("input", () => {
			this.searchQuery = searchInput.value;
			this.renderList();
		});

		const filterBtn = filterRow.createEl("button", { text: "Incomplete" });
		const updateFilterBtn = () => {
			filterBtn.style.cssText = `font-size:11px; padding:4px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); cursor:pointer; flex-shrink:0; background:${this.showIncompleteOnly ? "var(--color-accent)" : "var(--background-secondary)"}; color:${this.showIncompleteOnly ? "#fff" : "var(--text-normal)"};`;
		};
		updateFilterBtn();
		filterBtn.addEventListener("click", () => {
			this.showIncompleteOnly = !this.showIncompleteOnly;
			updateFilterBtn();
			this.renderList();
		});

		// List
		this.listEl = contentEl.createEl("div");
		this.listEl.style.cssText = "max-height:420px; overflow-y:auto; padding:8px 0;";
		this.renderList();

		// Refresh live durations every second without rebuilding DOM
		this.refreshInterval = window.setInterval(() => this.tickLive(), 1000);
	}

	onClose() {
		window.clearInterval(this.refreshInterval);
		this.contentEl.empty();
	}

	private renderList() {
		this.listEl.empty();
		const session = this.plugin.getSession(this.path);
		if (!session) return;

		const query = this.searchQuery.toLowerCase();
		session.segments.forEach((seg, idx) => {
			if (query && !seg.heading.toLowerCase().includes(query)) return;
			if (this.showIncompleteOnly && !!seg.completedAt) return;

			const isActive = this.plugin.getActiveSegmentIdx(this.path) === idx;
			const isDone = !!seg.completedAt;

			// Row
			const row = this.listEl.createEl("div");
			row.setAttribute("data-idx", String(idx));
			const indent = Math.max(0, seg.level - 2) * 16;
			row.style.cssText = `display:flex; align-items:center; gap:8px; padding:7px 20px 7px ${20 + indent}px; border-radius:6px; transition:background 0.1s;`;
			row.addEventListener("mouseenter", () => row.style.background = "var(--background-modifier-hover)");
			row.addEventListener("mouseleave", () => row.style.background = "");

			// Status icon
			const icon = row.createEl("span", { text: isActive ? "▶" : isDone ? "✓" : "○" });
			icon.style.cssText = `font-size:12px; width:14px; flex-shrink:0; color:${isActive ? "var(--color-blue)" : isDone ? "var(--color-green)" : "var(--text-muted)"};`;

			// Heading (clickable → jump to section)
			const headingEl = row.createEl("span", { text: seg.heading });
			headingEl.style.cssText = "flex:1; font-size:13px; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
			if (isDone) headingEl.style.color = "var(--text-muted)";
			headingEl.addEventListener("click", () => {
				this.editor.setCursor({ line: seg.startLine, ch: 0 });
				this.editor.scrollIntoView({ from: { line: seg.startLine, ch: 0 }, to: { line: seg.startLine, ch: 0 } }, true);
				this.close();
			});

			// Word count
			const wc = row.createEl("span", { text: `${seg.wordCount}w` });
			wc.style.cssText = "font-size:11px; color:var(--text-faint); flex-shrink:0; width:40px; text-align:right;";

			// Duration (live if active, banked otherwise)
			const liveMs = this.plugin.liveSegmentMs(this.path, idx);
			const durEl = row.createEl("span", { text: liveMs > 0 ? fmt(liveMs) : "" });
			durEl.style.cssText = "font-size:12px; color:var(--text-muted); flex-shrink:0; width:60px; text-align:right;";
			if (liveMs > 0) {
				durEl.style.cursor = "pointer";
				durEl.title = "Click to edit";
				durEl.addEventListener("click", (e) => {
					e.stopPropagation();
					this.editDuration(durEl, seg, idx);
				});
			}

			// Start/Stop button
			// If done: show a grayed-out disabled "Start". If active: "Stop". Otherwise: "Start".
			const btnText = isActive ? "Stop" : "Start";
			const btn = row.createEl("button", { text: btnText });
			if (isDone && !isActive) {
				btn.disabled = true;
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-faint); cursor:not-allowed; flex-shrink:0; opacity:0.5;";
			} else {
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer; flex-shrink:0;";
				btn.addEventListener("click", async (e) => {
					e.stopPropagation();
					if (isActive) {
						await this.plugin.stopActiveSegment(this.path);
					} else {
						await this.plugin.startSegment(this.path, idx);
					}
					this.renderList();
				});
			}

			// Complete / Uncomplete button
			const doneBtn = row.createEl("button", { text: isDone ? "Undone" : "✓ Done" });
			doneBtn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:${isDone ? "var(--background-secondary)" : "var(--color-green)"}; color:${isDone ? "var(--text-muted)" : "#fff"}; cursor:pointer; flex-shrink:0;`;
			doneBtn.addEventListener("click", async (e) => {
				e.stopPropagation();
				await this.plugin.toggleSegmentComplete(this.path, idx);
				this.renderList();
			});
		});
	}

	// Update only the live duration of the active segment — no DOM rebuild
	private tickLive() {
		const activeIdx = this.plugin.getActiveSegmentIdx(this.path);
		if (activeIdx === null) return;
		const row = this.listEl.querySelector(`[data-idx="${activeIdx}"]`);
		if (!row) return;
		const durEl = row.querySelectorAll("span")[3] as HTMLElement | undefined;
		if (!durEl) return;
		const liveMs = this.plugin.liveSegmentMs(this.path, activeIdx);
		durEl.textContent = liveMs > 0 ? fmt(liveMs) : "";
	}

	private editDuration(durEl: HTMLElement, seg: Segment, idx: number) {
		const input = createEl("input", { type: "text" });
		input.value = fmt(seg.durationMs);
		input.style.cssText = "width:60px; font-size:12px; padding:1px 4px; text-align:right; border:1px solid var(--color-accent); border-radius:3px; background:var(--background-primary); color:var(--text-normal);";
		durEl.replaceWith(input);
		input.focus();
		input.select();

		const commit = async () => {
			const parsed = parseDuration(input.value);
			if (parsed !== null && parsed >= 0) {
				seg.durationMs = parsed;
				await this.plugin.saveSessionData();
			}
			durEl.textContent = fmt(seg.durationMs);
			input.replaceWith(durEl);
		};

		input.addEventListener("blur", commit);
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); input.blur(); }
			if (e.key === "Escape") { input.replaceWith(durEl); }
		});
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	data: PluginData = {};
	private statusBar!: HTMLElement;

	// In-memory live state — not persisted
	// Only ONE segment across ALL notes may run at a time.
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};
	private _activeSegmentIdx: Record<string, number | null> = {};
	private activeWindowStart: Record<string, number | null> = {};
	// Global active path — the note that currently has a running timer
	private _activeTimerPath: string | null = null;

	async onload() {
		this.data = (await this.loadData()) ?? {};

		// Migrate old sessions that stored durationMs as undefined
		for (const path of Object.keys(this.data)) {
			const session = this.data[path];
			if (session) {
				session.segments.forEach(seg => { if (seg.durationMs == null) seg.durationMs = 0; });
			}
		}

		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "open-sections",
			name: "Open sections panel",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				const mv = view as MarkdownView;
				if (!mv.file) return;
				this.ensureSession(mv);
				new SectionsModal(this.app, this, mv, editor).open();
			},
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));
		this.initSession();
	}

	// ── Public API (used by SectionsModal) ────────────────────────────────

	getSession(path: string): NoteSession | undefined {
		return this.data[path];
	}

	/** Scan the document and create/overwrite the session (no timing data preserved). */
	async scanDocument(path: string, editorContent: string) {
		// Stop any running timer on this note before overwriting
		if (this._activeTimerPath === path) {
			await this.stopActiveSegment(path);
		}
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("✓ Document scanned.");
	}

	/** Reset session from the modal. */
	async resetSession(path: string, editorContent: string) {
		if (this._activeTimerPath === path) await this.stopActiveSegment(path);
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	getActiveSegmentIdx(path: string): number | null {
		return this._activeSegmentIdx[path] ?? null;
	}

	/** Live ms for a segment: banked durationMs + current active window if applicable. */
	liveSegmentMs(path: string, idx: number): number {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return 0;
		const base = seg.durationMs;
		if (this._activeSegmentIdx[path] === idx && this.timerState[path] === "running") {
			const start = this.activeWindowStart[path];
			return base + (start != null ? Date.now() - start : 0);
		}
		return base;
	}

	/** Start timing a specific segment. Stops any other running timer globally first. */
	async startSegment(path: string, idx: number) {
		// Stop any timer running on a different note
		if (this._activeTimerPath !== null && this._activeTimerPath !== path) {
			await this.stopActiveSegment(this._activeTimerPath);
		}
		// Stop any timer running on the same note (different segment)
		await this.stopActiveSegment(path);

		const session = this.data[path];
		if (!session) return;
		if (!session.segments[idx]) return;

		this._activeSegmentIdx[path] = idx;
		this.activeWindowStart[path] = Date.now();
		this.timerState[path] = "running";
		this._activeTimerPath = path;

		if (!session.startedAt) session.startedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();
	}

	/** Stop timing the active segment and bank its elapsed time. */
	async stopActiveSegment(path: string) {
		const activeIdx = this._activeSegmentIdx[path];
		if (activeIdx == null) return;

		const seg = this.data[path]?.segments[activeIdx];
		const start = this.activeWindowStart[path];
		if (seg && start != null && this.timerState[path] === "running") {
			seg.durationMs += Date.now() - start;
		}

		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		if (this._activeTimerPath === path) this._activeTimerPath = null;
		await this.saveData(this.data);
		this.refreshStatus();
	}

	async saveSessionData() {
		await this.saveData(this.data);
	}

	/** Toggle a segment's completed state from the sections panel. */
	async toggleSegmentComplete(path: string, idx: number) {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return;
		if (seg.completedAt) {
			// Un-complete: clear the timestamp
			delete seg.completedAt;
		} else {
			// Mark complete: bank active time if this segment is running, then stamp
			if (this._activeSegmentIdx[path] === idx) {
				const start = this.activeWindowStart[path];
				if (start != null && this.timerState[path] === "running") {
					seg.durationMs += Date.now() - start;
				}
				this._activeSegmentIdx[path] = null;
				this.activeWindowStart[path] = null;
			}
			seg.completedAt = Date.now();
		}
		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Session init ──────────────────────────────────────────────────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		this.ensureSession(view);
		this.refreshStatus();
	}

	private ensureSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}
	}

	// ── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ── Stamp at cursor ───────────────────────────────────────────────────

	private async stampAtCursor(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		// If this segment is active, bank its time
		if (this._activeSegmentIdx[path] === idx) {
			const start = this.activeWindowStart[path];
			if (start != null && this.timerState[path] === "running") {
				seg.durationMs += Date.now() - start;
			}
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}

		seg.completedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ── Pause / Resume ────────────────────────────────────────────────────

	private async togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			// Resume — restart active window if there's an active segment
			if (this._activeSegmentIdx[path] !== null) {
				this.activeWindowStart[path] = Date.now();
			}
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			// Pause — bank active segment time without clearing which segment is active
			const activeIdx = this._activeSegmentIdx[path];
			if (activeIdx !== null && activeIdx !== undefined) {
				const seg = this.data[path]?.segments[activeIdx];
				const start = this.activeWindowStart[path];
				if (seg && start != null) {
					seg.durationMs += Date.now() - start;
					this.activeWindowStart[path] = null;
				}
			}
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}

		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Reset ─────────────────────────────────────────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ── Estimate ──────────────────────────────────────────────────────────

	private buildEstimate(session: NoteSession, path: string): { nextLabel: string; nextEst: string; totalEst: string } {
		const activeIdx = this._activeSegmentIdx[path];
		const done = session.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
		const remaining = session.segments.filter(s => !s.completedAt);
		// "Next" = first uncompleted segment that isn't the one currently active
		const next = remaining.find(s => session.segments.indexOf(s) !== activeIdx) ?? null;

		const totalWords = remaining.reduce((sum, s) => sum + s.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			return { nextLabel: next?.heading ?? "", nextEst: `${nextWords}w`, totalEst: `${totalWords}w` };
		}

		const doneWords = done.reduce((sum, s) => sum + s.wordCount, 0);
		const doneMs = done.reduce((sum, s) => sum + s.durationMs, 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
		};
	}

	// ── Status bar ────────────────────────────────────────────────────────

	private refreshStatus() {
		// If a timer is globally active, always show it regardless of which note is in view
		const activePath = this._activeTimerPath;
		if (activePath !== null) {
			const activeSess = this.data[activePath];
			const activeIdx = this._activeSegmentIdx[activePath];
			const pauseMark = this.timerState[activePath] === "paused" ? " ⏸" : "";
			if (activeSess && activeIdx !== null && activeIdx !== undefined) {
				const activeSeg = activeSess.segments[activeIdx as number];
				const activeMs = this.liveSegmentMs(activePath, activeIdx as number);
				const { totalEst } = this.buildEstimate(activeSess, activePath);
				// Compute expected duration for this segment from pace; count down (can go negative)
				const done = activeSess.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
				let timeLeftStr: string;
				if (done.length > 0) {
					const pace = done.reduce((s, x) => s + x.durationMs, 0) / done.reduce((s, x) => s + x.wordCount, 0);
					const expectedMs = (activeSeg?.wordCount ?? 0) * pace;
					const leftMs = expectedMs - activeMs;
					if (leftMs >= 0) {
						timeLeftStr = fmt(leftMs);
					} else {
						timeLeftStr = "-" + fmt(-leftMs);
					}
				} else {
					// No pace data yet — show elapsed instead
					timeLeftStr = fmt(activeMs);
				}
				this.statusBar.setText(
					`📖 ${timeLeftStr}${pauseMark} | ▶ ${activeSeg?.heading ?? ""} | Est. remaining: ${totalEst}`
				);
				return;
			}
		}

		// No globally active timer — show status of the currently visible note
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }
		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }
		const state = this.timerState[path];
		if (state === "unstarted" || state === undefined) {
			this.statusBar.setText("📖 Not started");
			return;
		}
		// Paused state on current note
		const { totalEst } = this.buildEstimate(session, path);
		this.statusBar.setText(`📖 ⏸ | Est. remaining: ${totalEst}`);
	}
}
```
## V4
```ts
import { App, Editor, MarkdownFileInfo, MarkdownView, Modal, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs: number;        // accumulated ms attributed to this segment (persisted)
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");
	const boundaries: { line: number; level: number; heading: string }[] = [];

	let inCodeBlock = false;
	lines.forEach((l, i) => {
		// Toggle code-fence state; ignore heading matches inside fenced blocks
		if (l.trimStart().startsWith("```")) { inCodeBlock = !inCodeBlock; return; }
		if (inCodeBlock) return;
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{ heading: "Document", level: 1, startLine: 0, endLine: lines.length - 1, wordCount: countWords(content), durationMs: 0 }];
	}

	return boundaries
		.map((b, idx) => {
			const startLine = b.line;
			const next = boundaries[idx + 1];
			const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
			const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
			return { heading: b.heading, level: b.level, startLine, endLine, wordCount: countWords(bodyText), durationMs: 0 };
		})
		.filter(seg => seg.wordCount > 0);
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

function parseDuration(input: string): number | null {
	input = input.trim();
	// "X:YY" → mm:ss
	const colonMatch = input.match(/^(\d+):(\d{2})$/);
	if (colonMatch && colonMatch[1] && colonMatch[2]) {
		return (parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])) * 1000;
	}
	// "Xm Ys", "Xm", "Ys"
	const mMatch = input.match(/(\d+)m/);
	const sMatch = input.match(/(\d+)s/);
	if (mMatch || sMatch) {
		const mins = mMatch && mMatch[1] ? parseInt(mMatch[1]) : 0;
		const secs = sMatch && sMatch[1] ? parseInt(sMatch[1]) : 0;
		return (mins * 60 + secs) * 1000;
	}
	// Plain number treated as seconds
	const plain = parseInt(input);
	if (!isNaN(plain)) return plain * 1000;
	return null;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

class SectionsModal extends Modal {
	private plugin: ReadingPacePlugin;
	private view: MarkdownView;
	private editor: Editor;
	private path: string;
	private searchQuery = "";
	private listEl!: HTMLElement;
	private refreshInterval!: number;

	constructor(app: App, plugin: ReadingPacePlugin, view: MarkdownView, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.view = view;
		this.editor = editor;
		this.path = view.file!.path;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.style.cssText = "width:560px; padding:0;";

		// Header
		const header = contentEl.createEl("div");
		header.style.cssText = "padding:16px 20px 12px; border-bottom:1px solid var(--background-modifier-border);";

		// Title row with action buttons
		const titleRow = header.createEl("div");
		titleRow.style.cssText = "display:flex; align-items:center; gap:8px; margin-bottom:10px;";
		titleRow.createEl("div", { text: "Sections" }).style.cssText = "font-size:16px; font-weight:600; flex:1;";

		// Start Session button
		const startBtn = titleRow.createEl("button", { text: "▶ Start" });
		startBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer;";
		startBtn.addEventListener("click", () => {
			this.plugin.startSessionPublic(this.path);
			this.renderList();
		});

		// Reset button
		const resetBtn = titleRow.createEl("button", { text: "↺ Reset" });
		resetBtn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--color-red,#e05555); cursor:pointer;";
		resetBtn.addEventListener("click", async () => {
			const confirmed = confirm("Reset the reading session for this note? All timing data will be cleared.");
			if (!confirmed) return;
			await this.plugin.resetSession(this.path, this.view.editor.getValue());
			this.renderList();
		});

		const searchInput = header.createEl("input", { type: "text", placeholder: "Search sections…" });
		searchInput.style.cssText = "width:100%; padding:6px 10px; border-radius:6px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); font-size:13px; box-sizing:border-box;";
		searchInput.value = this.searchQuery;
		searchInput.addEventListener("input", () => {
			this.searchQuery = searchInput.value;
			this.renderList();
		});

		// List
		this.listEl = contentEl.createEl("div");
		this.listEl.style.cssText = "max-height:420px; overflow-y:auto; padding:8px 0;";
		this.renderList();

		// Refresh live durations every second without rebuilding DOM
		this.refreshInterval = window.setInterval(() => this.tickLive(), 1000);
	}

	onClose() {
		window.clearInterval(this.refreshInterval);
		this.contentEl.empty();
	}

	private renderList() {
		this.listEl.empty();
		const session = this.plugin.getSession(this.path);
		if (!session) return;

		const query = this.searchQuery.toLowerCase();
		session.segments.forEach((seg, idx) => {
			if (query && !seg.heading.toLowerCase().includes(query)) return;

			const isActive = this.plugin.getActiveSegmentIdx(this.path) === idx;
			const isDone = !!seg.completedAt;

			// Row
			const row = this.listEl.createEl("div");
			row.setAttribute("data-idx", String(idx));
			const indent = Math.max(0, seg.level - 2) * 16;
			row.style.cssText = `display:flex; align-items:center; gap:8px; padding:7px 20px 7px ${20 + indent}px; border-radius:6px; transition:background 0.1s;`;
			row.addEventListener("mouseenter", () => row.style.background = "var(--background-modifier-hover)");
			row.addEventListener("mouseleave", () => row.style.background = "");

			// Status icon
			const icon = row.createEl("span", { text: isActive ? "▶" : isDone ? "✓" : "○" });
			icon.style.cssText = `font-size:12px; width:14px; flex-shrink:0; color:${isActive ? "var(--color-blue)" : isDone ? "var(--color-green)" : "var(--text-muted)"};`;

			// Heading (clickable → jump to section)
			const headingEl = row.createEl("span", { text: seg.heading });
			headingEl.style.cssText = "flex:1; font-size:13px; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
			if (isDone) headingEl.style.color = "var(--text-muted)";
			headingEl.addEventListener("click", () => {
				this.editor.setCursor({ line: seg.startLine, ch: 0 });
				this.editor.scrollIntoView({ from: { line: seg.startLine, ch: 0 }, to: { line: seg.startLine, ch: 0 } }, true);
				this.close();
			});

			// Word count
			const wc = row.createEl("span", { text: `${seg.wordCount}w` });
			wc.style.cssText = "font-size:11px; color:var(--text-faint); flex-shrink:0; width:40px; text-align:right;";

			// Duration (live if active, banked otherwise)
			const liveMs = this.plugin.liveSegmentMs(this.path, idx);
			const durEl = row.createEl("span", { text: liveMs > 0 ? fmt(liveMs) : "" });
			durEl.style.cssText = "font-size:12px; color:var(--text-muted); flex-shrink:0; width:60px; text-align:right;";
			if (liveMs > 0) {
				durEl.style.cursor = "pointer";
				durEl.title = "Click to edit";
				durEl.addEventListener("click", (e) => {
					e.stopPropagation();
					this.editDuration(durEl, seg, idx);
				});
			}

			// Start/Stop button
			// If done: show a grayed-out disabled "Start". If active: "Stop". Otherwise: "Start".
			const btnText = isActive ? "Stop" : "Start";
			const btn = row.createEl("button", { text: btnText });
			if (isDone && !isActive) {
				btn.disabled = true;
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-faint); cursor:not-allowed; flex-shrink:0; opacity:0.5;";
			} else {
				btn.style.cssText = "font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer; flex-shrink:0;";
				btn.addEventListener("click", async (e) => {
					e.stopPropagation();
					if (isActive) {
						await this.plugin.stopActiveSegment(this.path);
					} else {
						await this.plugin.startSegment(this.path, idx);
					}
					this.renderList();
				});
			}

			// Complete / Uncomplete button
			const doneBtn = row.createEl("button", { text: isDone ? "Undone" : "✓ Done" });
			doneBtn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:${isDone ? "var(--background-secondary)" : "var(--color-green)"}; color:${isDone ? "var(--text-muted)" : "#fff"}; cursor:pointer; flex-shrink:0;`;
			doneBtn.addEventListener("click", async (e) => {
				e.stopPropagation();
				await this.plugin.toggleSegmentComplete(this.path, idx);
				this.renderList();
			});
		});
	}

	// Update only the live duration of the active segment — no DOM rebuild
	private tickLive() {
		const activeIdx = this.plugin.getActiveSegmentIdx(this.path);
		if (activeIdx === null) return;
		const row = this.listEl.querySelector(`[data-idx="${activeIdx}"]`);
		if (!row) return;
		const durEl = row.querySelectorAll("span")[3] as HTMLElement | undefined;
		if (!durEl) return;
		const liveMs = this.plugin.liveSegmentMs(this.path, activeIdx);
		durEl.textContent = liveMs > 0 ? fmt(liveMs) : "";
	}

	private editDuration(durEl: HTMLElement, seg: Segment, idx: number) {
		const input = createEl("input", { type: "text" });
		input.value = fmt(seg.durationMs);
		input.style.cssText = "width:60px; font-size:12px; padding:1px 4px; text-align:right; border:1px solid var(--color-accent); border-radius:3px; background:var(--background-primary); color:var(--text-normal);";
		durEl.replaceWith(input);
		input.focus();
		input.select();

		const commit = async () => {
			const parsed = parseDuration(input.value);
			if (parsed !== null && parsed >= 0) {
				seg.durationMs = parsed;
				await this.plugin.saveSessionData();
			}
			durEl.textContent = fmt(seg.durationMs);
			input.replaceWith(durEl);
		};

		input.addEventListener("blur", commit);
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); input.blur(); }
			if (e.key === "Escape") { input.replaceWith(durEl); }
		});
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	data: PluginData = {};
	private statusBar!: HTMLElement;

	// In-memory live state — not persisted
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};
	private _activeSegmentIdx: Record<string, number | null> = {};
	private activeWindowStart: Record<string, number | null> = {};

	async onload() {
		this.data = (await this.loadData()) ?? {};

		// Migrate old sessions that stored durationMs as undefined
		for (const path of Object.keys(this.data)) {
			const session = this.data[path];
			if (session) {
				session.segments.forEach(seg => { if (seg.durationMs == null) seg.durationMs = 0; });
			}
		}

		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "open-sections",
			name: "Open sections panel",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				const mv = view as MarkdownView;
				if (!mv.file) return;
				this.ensureSession(mv);
				new SectionsModal(this.app, this, mv, editor).open();
			},
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));
		this.initSession();
	}

	// ── Public API (used by SectionsModal) ────────────────────────────────

	getSession(path: string): NoteSession | undefined {
		return this.data[path];
	}

	/** Start session from the modal (no-op if already running). */
	startSessionPublic(path: string) {
		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}
		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	/** Reset session from the modal. */
	async resetSession(path: string, editorContent: string) {
		this.data[path] = { segments: buildSegments(editorContent) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	getActiveSegmentIdx(path: string): number | null {
		return this._activeSegmentIdx[path] ?? null;
	}

	/** Live ms for a segment: banked durationMs + current active window if applicable. */
	liveSegmentMs(path: string, idx: number): number {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return 0;
		const base = seg.durationMs;
		if (this._activeSegmentIdx[path] === idx && this.timerState[path] === "running") {
			const start = this.activeWindowStart[path];
			return base + (start != null ? Date.now() - start : 0);
		}
		return base;
	}

	/** Start timing a specific segment. Banks any currently active segment first. */
	async startSegment(path: string, idx: number) {
		await this.stopActiveSegment(path);

		const session = this.data[path];
		if (!session) return;
		if (!session.segments[idx]) return;

		this._activeSegmentIdx[path] = idx;
		this.activeWindowStart[path] = Date.now();
		this.timerState[path] = "running";

		if (!session.startedAt) session.startedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();
	}

	/** Stop timing the active segment and bank its elapsed time. */
	async stopActiveSegment(path: string) {
		const activeIdx = this._activeSegmentIdx[path];
		if (activeIdx == null) return;

		const seg = this.data[path]?.segments[activeIdx];
		const start = this.activeWindowStart[path];
		if (seg && start != null && this.timerState[path] === "running") {
			seg.durationMs += Date.now() - start;
		}

		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
	}

	async saveSessionData() {
		await this.saveData(this.data);
	}

	/** Toggle a segment's completed state from the sections panel. */
	async toggleSegmentComplete(path: string, idx: number) {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return;
		if (seg.completedAt) {
			// Un-complete: clear the timestamp
			delete seg.completedAt;
		} else {
			// Mark complete: bank active time if this segment is running, then stamp
			if (this._activeSegmentIdx[path] === idx) {
				const start = this.activeWindowStart[path];
				if (start != null && this.timerState[path] === "running") {
					seg.durationMs += Date.now() - start;
				}
				this._activeSegmentIdx[path] = null;
				this.activeWindowStart[path] = null;
			}
			seg.completedAt = Date.now();
		}
		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Session init ──────────────────────────────────────────────────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		this.ensureSession(view);
		this.refreshStatus();
	}

	private ensureSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}
	}

	// ── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ── Stamp at cursor ───────────────────────────────────────────────────

	private async stampAtCursor(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		// If this segment is active, bank its time
		if (this._activeSegmentIdx[path] === idx) {
			const start = this.activeWindowStart[path];
			if (start != null && this.timerState[path] === "running") {
				seg.durationMs += Date.now() - start;
			}
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}

		seg.completedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ── Pause / Resume ────────────────────────────────────────────────────

	private async togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			// Resume — restart active window if there's an active segment
			if (this._activeSegmentIdx[path] !== null) {
				this.activeWindowStart[path] = Date.now();
			}
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			// Pause — bank active segment time without clearing which segment is active
			const activeIdx = this._activeSegmentIdx[path];
			if (activeIdx !== null && activeIdx !== undefined) {
				const seg = this.data[path]?.segments[activeIdx];
				const start = this.activeWindowStart[path];
				if (seg && start != null) {
					seg.durationMs += Date.now() - start;
					this.activeWindowStart[path] = null;
				}
			}
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}

		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Reset ─────────────────────────────────────────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ── Estimate ──────────────────────────────────────────────────────────

	private buildEstimate(session: NoteSession, path: string): { nextLabel: string; nextEst: string; totalEst: string } {
		const activeIdx = this._activeSegmentIdx[path];
		const done = session.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
		const remaining = session.segments.filter(s => !s.completedAt);
		// "Next" = first uncompleted segment that isn't the one currently active
		const next = remaining.find(s => session.segments.indexOf(s) !== activeIdx) ?? null;

		const totalWords = remaining.reduce((sum, s) => sum + s.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			return { nextLabel: next?.heading ?? "", nextEst: `${nextWords}w`, totalEst: `${totalWords}w` };
		}

		const doneWords = done.reduce((sum, s) => sum + s.wordCount, 0);
		const doneMs = done.reduce((sum, s) => sum + s.durationMs, 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
		};
	}

	// ── Status bar ────────────────────────────────────────────────────────

	private refreshStatus() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }

		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }

		const state = this.timerState[path];

		if (state === "unstarted") {
			this.statusBar.setText("📖 Not started");
			return;
		}

		const activeIdx = this._activeSegmentIdx[path];
		const pauseMark = state === "paused" ? " ⏸" : "";
		const totalElapsed = session.segments.reduce((sum, _, i) => sum + this.liveSegmentMs(path, i), 0);

		const { totalEst } = this.buildEstimate(session, path);

		if (activeIdx !== null && activeIdx !== undefined) {
			const activeSeg = session.segments[activeIdx as number];
			const activeMs = this.liveSegmentMs(path, activeIdx as number);
			this.statusBar.setText(
				`📖 ${fmt(totalElapsed)}${pauseMark} | ▶ ${activeSeg?.heading ?? ""}: ${fmt(activeMs)} | Est. remaining: ${totalEst}`
			);
		} else {
			this.statusBar.setText(`📖 ${fmt(totalElapsed)}${pauseMark} | Est. remaining: ${totalEst}`);
		}
	}
}
```
## V3
```ts
import { App, Editor, MarkdownFileInfo, MarkdownView, Modal, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs: number;        // accumulated ms attributed to this segment (persisted)
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");
	const boundaries: { line: number; level: number; heading: string }[] = [];

	let inCodeBlock = false;
	lines.forEach((l, i) => {
		// Toggle code-fence state; ignore heading matches inside fenced blocks
		if (l.trimStart().startsWith("```")) { inCodeBlock = !inCodeBlock; return; }
		if (inCodeBlock) return;
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{ heading: "Document", level: 1, startLine: 0, endLine: lines.length - 1, wordCount: countWords(content), durationMs: 0 }];
	}

	return boundaries
		.map((b, idx) => {
			const startLine = b.line;
			const next = boundaries[idx + 1];
			const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
			const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
			return { heading: b.heading, level: b.level, startLine, endLine, wordCount: countWords(bodyText), durationMs: 0 };
		})
		.filter(seg => seg.wordCount > 0);
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

function parseDuration(input: string): number | null {
	input = input.trim();
	// "X:YY" → mm:ss
	const colonMatch = input.match(/^(\d+):(\d{2})$/);
	if (colonMatch && colonMatch[1] && colonMatch[2]) {
		return (parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])) * 1000;
	}
	// "Xm Ys", "Xm", "Ys"
	const mMatch = input.match(/(\d+)m/);
	const sMatch = input.match(/(\d+)s/);
	if (mMatch || sMatch) {
		const mins = mMatch && mMatch[1] ? parseInt(mMatch[1]) : 0;
		const secs = sMatch && sMatch[1] ? parseInt(sMatch[1]) : 0;
		return (mins * 60 + secs) * 1000;
	}
	// Plain number treated as seconds
	const plain = parseInt(input);
	if (!isNaN(plain)) return plain * 1000;
	return null;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

class SectionsModal extends Modal {
	private plugin: ReadingPacePlugin;
	private view: MarkdownView;
	private editor: Editor;
	private path: string;
	private searchQuery = "";
	private listEl!: HTMLElement;
	private refreshInterval!: number;

	constructor(app: App, plugin: ReadingPacePlugin, view: MarkdownView, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.view = view;
		this.editor = editor;
		this.path = view.file!.path;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.style.cssText = "width:560px; padding:0;";

		// Header
		const header = contentEl.createEl("div");
		header.style.cssText = "padding:16px 20px 12px; border-bottom:1px solid var(--background-modifier-border);";
		header.createEl("div", { text: "Sections" }).style.cssText = "font-size:16px; font-weight:600; margin-bottom:10px;";

		const searchInput = header.createEl("input", { type: "text", placeholder: "Search sections…" });
		searchInput.style.cssText = "width:100%; padding:6px 10px; border-radius:6px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); font-size:13px; box-sizing:border-box;";
		searchInput.value = this.searchQuery;
		searchInput.addEventListener("input", () => {
			this.searchQuery = searchInput.value;
			this.renderList();
		});

		// List
		this.listEl = contentEl.createEl("div");
		this.listEl.style.cssText = "max-height:420px; overflow-y:auto; padding:8px 0;";
		this.renderList();

		// Refresh live durations every second without rebuilding DOM
		this.refreshInterval = window.setInterval(() => this.tickLive(), 1000);
	}

	onClose() {
		window.clearInterval(this.refreshInterval);
		this.contentEl.empty();
	}

	private renderList() {
		this.listEl.empty();
		const session = this.plugin.getSession(this.path);
		if (!session) return;

		const query = this.searchQuery.toLowerCase();
		session.segments.forEach((seg, idx) => {
			if (query && !seg.heading.toLowerCase().includes(query)) return;

			const isActive = this.plugin.getActiveSegmentIdx(this.path) === idx;
			const isDone = !!seg.completedAt;

			// Row
			const row = this.listEl.createEl("div");
			row.setAttribute("data-idx", String(idx));
			const indent = Math.max(0, seg.level - 2) * 16;
			row.style.cssText = `display:flex; align-items:center; gap:8px; padding:7px 20px 7px ${20 + indent}px; border-radius:6px; transition:background 0.1s;`;
			row.addEventListener("mouseenter", () => row.style.background = "var(--background-modifier-hover)");
			row.addEventListener("mouseleave", () => row.style.background = "");

			// Status icon
			const icon = row.createEl("span", { text: isActive ? "▶" : isDone ? "✓" : "○" });
			icon.style.cssText = `font-size:12px; width:14px; flex-shrink:0; color:${isActive ? "var(--color-blue)" : isDone ? "var(--color-green)" : "var(--text-muted)"};`;

			// Heading (clickable → jump to section)
			const headingEl = row.createEl("span", { text: seg.heading });
			headingEl.style.cssText = "flex:1; font-size:13px; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
			if (isDone) headingEl.style.color = "var(--text-muted)";
			headingEl.addEventListener("click", () => {
				this.editor.setCursor({ line: seg.startLine, ch: 0 });
				this.editor.scrollIntoView({ from: { line: seg.startLine, ch: 0 }, to: { line: seg.startLine, ch: 0 } }, true);
				this.close();
			});

			// Word count
			const wc = row.createEl("span", { text: `${seg.wordCount}w` });
			wc.style.cssText = "font-size:11px; color:var(--text-faint); flex-shrink:0; width:40px; text-align:right;";

			// Duration (live if active, banked otherwise)
			const liveMs = this.plugin.liveSegmentMs(this.path, idx);
			const durEl = row.createEl("span", { text: liveMs > 0 ? fmt(liveMs) : "" });
			durEl.style.cssText = "font-size:12px; color:var(--text-muted); flex-shrink:0; width:60px; text-align:right;";
			if (liveMs > 0) {
				durEl.style.cursor = "pointer";
				durEl.title = "Click to edit";
				durEl.addEventListener("click", (e) => {
					e.stopPropagation();
					this.editDuration(durEl, seg, idx);
				});
			}

			// Start/Stop button
			const btnText = isActive ? "Stop" : isDone ? "Restart" : "Start";
			const btn = row.createEl("button", { text: btnText });
			btn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer; flex-shrink:0;`;
			btn.addEventListener("click", async (e) => {
				e.stopPropagation();
				if (isActive) {
					await this.plugin.stopActiveSegment(this.path);
				} else {
					await this.plugin.startSegment(this.path, idx);
				}
				this.renderList();
			});

			// Complete / Uncomplete button
			const doneBtn = row.createEl("button", { text: isDone ? "Undone" : "✓ Done" });
			doneBtn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:${isDone ? "var(--background-secondary)" : "var(--color-green)"}; color:${isDone ? "var(--text-muted)" : "#fff"}; cursor:pointer; flex-shrink:0;`;
			doneBtn.addEventListener("click", async (e) => {
				e.stopPropagation();
				await this.plugin.toggleSegmentComplete(this.path, idx);
				this.renderList();
			});
		});
	}

	// Update only the live duration of the active segment — no DOM rebuild
	private tickLive() {
		const activeIdx = this.plugin.getActiveSegmentIdx(this.path);
		if (activeIdx === null) return;
		const row = this.listEl.querySelector(`[data-idx="${activeIdx}"]`);
		if (!row) return;
		const durEl = row.querySelectorAll("span")[3] as HTMLElement | undefined;
		if (!durEl) return;
		const liveMs = this.plugin.liveSegmentMs(this.path, activeIdx);
		durEl.textContent = liveMs > 0 ? fmt(liveMs) : "";
	}

	private editDuration(durEl: HTMLElement, seg: Segment, idx: number) {
		const input = createEl("input", { type: "text" });
		input.value = fmt(seg.durationMs);
		input.style.cssText = "width:60px; font-size:12px; padding:1px 4px; text-align:right; border:1px solid var(--color-accent); border-radius:3px; background:var(--background-primary); color:var(--text-normal);";
		durEl.replaceWith(input);
		input.focus();
		input.select();

		const commit = async () => {
			const parsed = parseDuration(input.value);
			if (parsed !== null && parsed >= 0) {
				seg.durationMs = parsed;
				await this.plugin.saveSessionData();
			}
			durEl.textContent = fmt(seg.durationMs);
			input.replaceWith(durEl);
		};

		input.addEventListener("blur", commit);
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); input.blur(); }
			if (e.key === "Escape") { input.replaceWith(durEl); }
		});
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	data: PluginData = {};
	private statusBar!: HTMLElement;

	// In-memory live state — not persisted
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};
	private _activeSegmentIdx: Record<string, number | null> = {};
	private activeWindowStart: Record<string, number | null> = {};

	async onload() {
		this.data = (await this.loadData()) ?? {};

		// Migrate old sessions that stored durationMs as undefined
		for (const path of Object.keys(this.data)) {
			const session = this.data[path];
			if (session) {
				session.segments.forEach(seg => { if (seg.durationMs == null) seg.durationMs = 0; });
			}
		}

		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "start-session",
			name: "Start reading session",
			editorCallback: (_: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.startSession(view as MarkdownView),
		});

		this.addCommand({
			id: "open-sections",
			name: "Open sections panel",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				const mv = view as MarkdownView;
				if (!mv.file) return;
				this.ensureSession(mv);
				new SectionsModal(this.app, this, mv, editor).open();
			},
		});

		this.addCommand({
			id: "stamp-segment-complete",
			name: "Mark current section complete",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.stampAtCursor(editor, view as MarkdownView),
		});

		this.addCommand({
			id: "toggle-pause",
			name: "Pause / Resume reading timer",
			editorCallback: (_: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.togglePause(view as MarkdownView),
		});

		this.addCommand({
			id: "reset-session",
			name: "Reset reading session for this note",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.reset(editor, view as MarkdownView),
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));
		this.initSession();
	}

	// ── Public API (used by SectionsModal) ────────────────────────────────

	getSession(path: string): NoteSession | undefined {
		return this.data[path];
	}

	getActiveSegmentIdx(path: string): number | null {
		return this._activeSegmentIdx[path] ?? null;
	}

	/** Live ms for a segment: banked durationMs + current active window if applicable. */
	liveSegmentMs(path: string, idx: number): number {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return 0;
		const base = seg.durationMs;
		if (this._activeSegmentIdx[path] === idx && this.timerState[path] === "running") {
			const start = this.activeWindowStart[path];
			return base + (start != null ? Date.now() - start : 0);
		}
		return base;
	}

	/** Start timing a specific segment. Banks any currently active segment first. */
	async startSegment(path: string, idx: number) {
		await this.stopActiveSegment(path);

		const session = this.data[path];
		if (!session) return;
		if (!session.segments[idx]) return;

		this._activeSegmentIdx[path] = idx;
		this.activeWindowStart[path] = Date.now();
		this.timerState[path] = "running";

		if (!session.startedAt) session.startedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();
	}

	/** Stop timing the active segment and bank its elapsed time. */
	async stopActiveSegment(path: string) {
		const activeIdx = this._activeSegmentIdx[path];
		if (activeIdx == null) return;

		const seg = this.data[path]?.segments[activeIdx];
		const start = this.activeWindowStart[path];
		if (seg && start != null && this.timerState[path] === "running") {
			seg.durationMs += Date.now() - start;
		}

		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
	}

	async saveSessionData() {
		await this.saveData(this.data);
	}

	/** Toggle a segment's completed state from the sections panel. */
	async toggleSegmentComplete(path: string, idx: number) {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return;
		if (seg.completedAt) {
			// Un-complete: clear the timestamp
			delete seg.completedAt;
		} else {
			// Mark complete: bank active time if this segment is running, then stamp
			if (this._activeSegmentIdx[path] === idx) {
				const start = this.activeWindowStart[path];
				if (start != null && this.timerState[path] === "running") {
					seg.durationMs += Date.now() - start;
				}
				this._activeSegmentIdx[path] = null;
				this.activeWindowStart[path] = null;
			}
			seg.completedAt = Date.now();
		}
		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Session init ──────────────────────────────────────────────────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		this.ensureSession(view);
		this.refreshStatus();
	}

	private ensureSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}
	}

	// ── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ── Stamp at cursor ───────────────────────────────────────────────────

	private async stampAtCursor(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		// If this segment is active, bank its time
		if (this._activeSegmentIdx[path] === idx) {
			const start = this.activeWindowStart[path];
			if (start != null && this.timerState[path] === "running") {
				seg.durationMs += Date.now() - start;
			}
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}

		seg.completedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ── Pause / Resume ────────────────────────────────────────────────────

	private async togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			// Resume — restart active window if there's an active segment
			if (this._activeSegmentIdx[path] !== null) {
				this.activeWindowStart[path] = Date.now();
			}
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			// Pause — bank active segment time without clearing which segment is active
			const activeIdx = this._activeSegmentIdx[path];
			if (activeIdx !== null && activeIdx !== undefined) {
				const seg = this.data[path]?.segments[activeIdx];
				const start = this.activeWindowStart[path];
				if (seg && start != null) {
					seg.durationMs += Date.now() - start;
					this.activeWindowStart[path] = null;
				}
			}
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}

		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Reset ─────────────────────────────────────────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ── Estimate ──────────────────────────────────────────────────────────

	private buildEstimate(session: NoteSession, path: string): { nextLabel: string; nextEst: string; totalEst: string } {
		const activeIdx = this._activeSegmentIdx[path];
		const done = session.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
		const remaining = session.segments.filter(s => !s.completedAt);
		// "Next" = first uncompleted segment that isn't the one currently active
		const next = remaining.find(s => session.segments.indexOf(s) !== activeIdx) ?? null;

		const totalWords = remaining.reduce((sum, s) => sum + s.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			return { nextLabel: next?.heading ?? "", nextEst: `${nextWords}w`, totalEst: `${totalWords}w` };
		}

		const doneWords = done.reduce((sum, s) => sum + s.wordCount, 0);
		const doneMs = done.reduce((sum, s) => sum + s.durationMs, 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
		};
	}

	// ── Status bar ────────────────────────────────────────────────────────

	private refreshStatus() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }

		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }

		const state = this.timerState[path];

		if (state === "unstarted") {
			this.statusBar.setText("📖 Not started");
			return;
		}

		const activeIdx = this._activeSegmentIdx[path];
		const pauseMark = state === "paused" ? " ⏸" : "";
		const totalElapsed = session.segments.reduce((sum, _, i) => sum + this.liveSegmentMs(path, i), 0);

		if (activeIdx !== null && activeIdx !== undefined) {
			const activeSeg = session.segments[activeIdx as number];
			const activeMs = this.liveSegmentMs(path, activeIdx as number);
			this.statusBar.setText(
				`📖 ${fmt(totalElapsed)}${pauseMark} | ▶ ${activeSeg?.heading ?? ""}: ${fmt(activeMs)}`
			);
		} else {
			this.statusBar.setText(`📖 ${fmt(totalElapsed)}${pauseMark}`);
		}
	}
}
```
## V2
- More advanced version of the reading plugin. Lets you start working from anywhere.
```ts
import { App, Editor, MarkdownFileInfo, MarkdownView, Modal, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs: number;        // accumulated ms attributed to this segment (persisted)
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");
	const boundaries: { line: number; level: number; heading: string }[] = [];

	lines.forEach((l, i) => {
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{ heading: "Document", level: 1, startLine: 0, endLine: lines.length - 1, wordCount: countWords(content), durationMs: 0 }];
	}

	return boundaries.map((b, idx) => {
		const startLine = b.line;
		const next = boundaries[idx + 1];
		const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
		const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
		return { heading: b.heading, level: b.level, startLine, endLine, wordCount: countWords(bodyText), durationMs: 0 };
	});
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

function parseDuration(input: string): number | null {
	input = input.trim();
	// "X:YY" → mm:ss
	const colonMatch = input.match(/^(\d+):(\d{2})$/);
	if (colonMatch && colonMatch[1] && colonMatch[2]) {
		return (parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])) * 1000;
	}
	// "Xm Ys", "Xm", "Ys"
	const mMatch = input.match(/(\d+)m/);
	const sMatch = input.match(/(\d+)s/);
	if (mMatch || sMatch) {
		const mins = mMatch && mMatch[1] ? parseInt(mMatch[1]) : 0;
		const secs = sMatch && sMatch[1] ? parseInt(sMatch[1]) : 0;
		return (mins * 60 + secs) * 1000;
	}
	// Plain number treated as seconds
	const plain = parseInt(input);
	if (!isNaN(plain)) return plain * 1000;
	return null;
}

// ─── Modal ───────────────────────────────────────────────────────────────────

class SectionsModal extends Modal {
	private plugin: ReadingPacePlugin;
	private view: MarkdownView;
	private editor: Editor;
	private path: string;
	private searchQuery = "";
	private listEl!: HTMLElement;
	private refreshInterval!: number;

	constructor(app: App, plugin: ReadingPacePlugin, view: MarkdownView, editor: Editor) {
		super(app);
		this.plugin = plugin;
		this.view = view;
		this.editor = editor;
		this.path = view.file!.path;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.style.cssText = "width:560px; padding:0;";

		// Header
		const header = contentEl.createEl("div");
		header.style.cssText = "padding:16px 20px 12px; border-bottom:1px solid var(--background-modifier-border);";
		header.createEl("div", { text: "Sections" }).style.cssText = "font-size:16px; font-weight:600; margin-bottom:10px;";

		const searchInput = header.createEl("input", { type: "text", placeholder: "Search sections…" });
		searchInput.style.cssText = "width:100%; padding:6px 10px; border-radius:6px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); font-size:13px; box-sizing:border-box;";
		searchInput.value = this.searchQuery;
		searchInput.addEventListener("input", () => {
			this.searchQuery = searchInput.value;
			this.renderList();
		});

		// List
		this.listEl = contentEl.createEl("div");
		this.listEl.style.cssText = "max-height:420px; overflow-y:auto; padding:8px 0;";
		this.renderList();

		// Refresh live durations every second without rebuilding DOM
		this.refreshInterval = window.setInterval(() => this.tickLive(), 1000);
	}

	onClose() {
		window.clearInterval(this.refreshInterval);
		this.contentEl.empty();
	}

	private renderList() {
		this.listEl.empty();
		const session = this.plugin.getSession(this.path);
		if (!session) return;

		const query = this.searchQuery.toLowerCase();
		session.segments.forEach((seg, idx) => {
			if (query && !seg.heading.toLowerCase().includes(query)) return;

			const isActive = this.plugin.getActiveSegmentIdx(this.path) === idx;
			const isDone = !!seg.completedAt;

			// Row
			const row = this.listEl.createEl("div");
			row.setAttribute("data-idx", String(idx));
			const indent = Math.max(0, seg.level - 2) * 16;
			row.style.cssText = `display:flex; align-items:center; gap:8px; padding:7px 20px 7px ${20 + indent}px; border-radius:6px; transition:background 0.1s;`;
			row.addEventListener("mouseenter", () => row.style.background = "var(--background-modifier-hover)");
			row.addEventListener("mouseleave", () => row.style.background = "");

			// Status icon
			const icon = row.createEl("span", { text: isActive ? "▶" : isDone ? "✓" : "○" });
			icon.style.cssText = `font-size:12px; width:14px; flex-shrink:0; color:${isActive ? "var(--color-blue)" : isDone ? "var(--color-green)" : "var(--text-muted)"};`;

			// Heading (clickable → jump to section)
			const headingEl = row.createEl("span", { text: seg.heading });
			headingEl.style.cssText = "flex:1; font-size:13px; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
			if (isDone) headingEl.style.color = "var(--text-muted)";
			headingEl.addEventListener("click", () => {
				this.editor.setCursor({ line: seg.startLine, ch: 0 });
				this.editor.scrollIntoView({ from: { line: seg.startLine, ch: 0 }, to: { line: seg.startLine, ch: 0 } }, true);
				this.close();
			});

			// Word count
			const wc = row.createEl("span", { text: `${seg.wordCount}w` });
			wc.style.cssText = "font-size:11px; color:var(--text-faint); flex-shrink:0; width:40px; text-align:right;";

			// Duration (live if active, banked otherwise)
			const liveMs = this.plugin.liveSegmentMs(this.path, idx);
			const durEl = row.createEl("span", { text: liveMs > 0 ? fmt(liveMs) : "" });
			durEl.style.cssText = "font-size:12px; color:var(--text-muted); flex-shrink:0; width:60px; text-align:right;";
			if (liveMs > 0) {
				durEl.style.cursor = "pointer";
				durEl.title = "Click to edit";
				durEl.addEventListener("click", (e) => {
					e.stopPropagation();
					this.editDuration(durEl, seg, idx);
				});
			}

			// Action button
			const btnText = isActive ? "Stop" : isDone ? "Restart" : "Start";
			const btn = row.createEl("button", { text: btnText });
			btn.style.cssText = `font-size:11px; padding:3px 10px; border-radius:4px; border:1px solid var(--background-modifier-border); background:var(--background-secondary); color:var(--text-normal); cursor:pointer; flex-shrink:0;`;
			btn.addEventListener("click", async (e) => {
				e.stopPropagation();
				if (isActive) {
					await this.plugin.stopActiveSegment(this.path);
				} else {
					await this.plugin.startSegment(this.path, idx);
				}
				this.renderList();
			});
		});
	}

	// Update only the live duration of the active segment — no DOM rebuild
	private tickLive() {
		const activeIdx = this.plugin.getActiveSegmentIdx(this.path);
		if (activeIdx === null) return;
		const row = this.listEl.querySelector(`[data-idx="${activeIdx}"]`);
		if (!row) return;
		const durEl = row.querySelectorAll("span")[3] as HTMLElement | undefined;
		if (!durEl) return;
		const liveMs = this.plugin.liveSegmentMs(this.path, activeIdx);
		durEl.textContent = liveMs > 0 ? fmt(liveMs) : "";
	}

	private editDuration(durEl: HTMLElement, seg: Segment, idx: number) {
		const input = createEl("input", { type: "text" });
		input.value = fmt(seg.durationMs);
		input.style.cssText = "width:60px; font-size:12px; padding:1px 4px; text-align:right; border:1px solid var(--color-accent); border-radius:3px; background:var(--background-primary); color:var(--text-normal);";
		durEl.replaceWith(input);
		input.focus();
		input.select();

		const commit = async () => {
			const parsed = parseDuration(input.value);
			if (parsed !== null && parsed >= 0) {
				seg.durationMs = parsed;
				await this.plugin.saveSessionData();
			}
			durEl.textContent = fmt(seg.durationMs);
			input.replaceWith(durEl);
		};

		input.addEventListener("blur", commit);
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); input.blur(); }
			if (e.key === "Escape") { input.replaceWith(durEl); }
		});
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	data: PluginData = {};
	private statusBar!: HTMLElement;

	// In-memory live state — not persisted
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};
	private _activeSegmentIdx: Record<string, number | null> = {};
	private activeWindowStart: Record<string, number | null> = {};

	async onload() {
		this.data = (await this.loadData()) ?? {};

		// Migrate old sessions that stored durationMs as undefined
		for (const path of Object.keys(this.data)) {
			const session = this.data[path];
			if (session) {
				session.segments.forEach(seg => { if (seg.durationMs == null) seg.durationMs = 0; });
			}
		}

		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "start-session",
			name: "Start reading session",
			editorCallback: (_: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.startSession(view as MarkdownView),
		});

		this.addCommand({
			id: "open-sections",
			name: "Open sections panel",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				const mv = view as MarkdownView;
				if (!mv.file) return;
				this.ensureSession(mv);
				new SectionsModal(this.app, this, mv, editor).open();
			},
		});

		this.addCommand({
			id: "stamp-segment-complete",
			name: "Mark current section complete",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.stampAtCursor(editor, view as MarkdownView),
		});

		this.addCommand({
			id: "toggle-pause",
			name: "Pause / Resume reading timer",
			editorCallback: (_: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.togglePause(view as MarkdownView),
		});

		this.addCommand({
			id: "reset-session",
			name: "Reset reading session for this note",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.reset(editor, view as MarkdownView),
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));
		this.initSession();
	}

	// ── Public API (used by SectionsModal) ────────────────────────────────

	getSession(path: string): NoteSession | undefined {
		return this.data[path];
	}

	getActiveSegmentIdx(path: string): number | null {
		return this._activeSegmentIdx[path] ?? null;
	}

	/** Live ms for a segment: banked durationMs + current active window if applicable. */
	liveSegmentMs(path: string, idx: number): number {
		const seg = this.data[path]?.segments[idx];
		if (!seg) return 0;
		const base = seg.durationMs;
		if (this._activeSegmentIdx[path] === idx && this.timerState[path] === "running") {
			const start = this.activeWindowStart[path];
			return base + (start != null ? Date.now() - start : 0);
		}
		return base;
	}

	/** Start timing a specific segment. Banks any currently active segment first. */
	async startSegment(path: string, idx: number) {
		await this.stopActiveSegment(path);

		const session = this.data[path];
		if (!session) return;
		if (!session.segments[idx]) return;

		this._activeSegmentIdx[path] = idx;
		this.activeWindowStart[path] = Date.now();
		this.timerState[path] = "running";

		if (!session.startedAt) session.startedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();
	}

	/** Stop timing the active segment and bank its elapsed time. */
	async stopActiveSegment(path: string) {
		const activeIdx = this._activeSegmentIdx[path];
		if (activeIdx == null) return;

		const seg = this.data[path]?.segments[activeIdx];
		const start = this.activeWindowStart[path];
		if (seg && start != null && this.timerState[path] === "running") {
			seg.durationMs += Date.now() - start;
		}

		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
	}

	async saveSessionData() {
		await this.saveData(this.data);
	}

	// ── Session init ──────────────────────────────────────────────────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		this.ensureSession(view);
		this.refreshStatus();
	}

	private ensureSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}
	}

	// ── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.timerState[path] = "running";
		const session = this.data[path];
		if (session && !session.startedAt) session.startedAt = Date.now();
		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ── Stamp at cursor ───────────────────────────────────────────────────

	private async stampAtCursor(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		// If this segment is active, bank its time
		if (this._activeSegmentIdx[path] === idx) {
			const start = this.activeWindowStart[path];
			if (start != null && this.timerState[path] === "running") {
				seg.durationMs += Date.now() - start;
			}
			this._activeSegmentIdx[path] = null;
			this.activeWindowStart[path] = null;
		}

		seg.completedAt = Date.now();
		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ── Pause / Resume ────────────────────────────────────────────────────

	private async togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			// Resume — restart active window if there's an active segment
			if (this._activeSegmentIdx[path] !== null) {
				this.activeWindowStart[path] = Date.now();
			}
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			// Pause — bank active segment time without clearing which segment is active
			const activeIdx = this._activeSegmentIdx[path];
			if (activeIdx !== null && activeIdx !== undefined) {
				const seg = this.data[path]?.segments[activeIdx];
				const start = this.activeWindowStart[path];
				if (seg && start != null) {
					seg.durationMs += Date.now() - start;
					this.activeWindowStart[path] = null;
				}
			}
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}

		await this.saveData(this.data);
		this.refreshStatus();
	}

	// ── Reset ─────────────────────────────────────────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this._activeSegmentIdx[path] = null;
		this.activeWindowStart[path] = null;
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ── Estimate ──────────────────────────────────────────────────────────

	private buildEstimate(session: NoteSession, path: string): { nextLabel: string; nextEst: string; totalEst: string } {
		const activeIdx = this._activeSegmentIdx[path];
		const done = session.segments.filter(s => s.completedAt && s.durationMs > 0 && s.wordCount > 0);
		const remaining = session.segments.filter(s => !s.completedAt);
		// "Next" = first uncompleted segment that isn't the one currently active
		const next = remaining.find(s => session.segments.indexOf(s) !== activeIdx) ?? null;

		const totalWords = remaining.reduce((sum, s) => sum + s.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			return { nextLabel: next?.heading ?? "", nextEst: `${nextWords}w`, totalEst: `${totalWords}w` };
		}

		const doneWords = done.reduce((sum, s) => sum + s.wordCount, 0);
		const doneMs = done.reduce((sum, s) => sum + s.durationMs, 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
		};
	}

	// ── Status bar ────────────────────────────────────────────────────────

	private refreshStatus() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }

		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }

		const state = this.timerState[path];

		if (state === "unstarted") {
			const { nextEst, totalEst } = this.buildEstimate(session, path);
			this.statusBar.setText(`📖 Not started | Next: ${nextEst} | Total: ${totalEst}`);
			return;
		}

		const activeIdx = this._activeSegmentIdx[path];
		const pauseMark = state === "paused" ? " ⏸" : "";
		const totalElapsed = session.segments.reduce((sum, _, i) => sum + this.liveSegmentMs(path, i), 0);
		const { nextLabel, nextEst, totalEst } = this.buildEstimate(session, path);

		if (activeIdx !== null && activeIdx !== undefined) {
			const activeSeg = session.segments[activeIdx as number];
			const activeMs = this.liveSegmentMs(path, activeIdx as number);
			const nextPart = nextLabel ? ` | Next (${nextLabel}): ${nextEst}` : "";
			this.statusBar.setText(
				`📖 ${fmt(totalElapsed)}${pauseMark} | ▶ ${activeSeg?.heading ?? ""}: ${fmt(activeMs)}${nextPart} | Remaining: ${totalEst}`
			);
		} else {
			const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst}` : "Done!";
			this.statusBar.setText(`📖 ${fmt(totalElapsed)}${pauseMark} | ${nextPart} | Remaining: ${totalEst}`);
		}
	}
}
```
## V1
- This lets you start, pause, resume and reset your timers
- Bottom-right shows status of how long it will take to complete the document. 
```ts
import { Editor, MarkdownFileInfo, MarkdownView, Notice, Plugin } from "obsidian";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
	heading: string;
	level: number;
	startLine: number;
	endLine: number;
	wordCount: number;
	completedAt?: number;
	durationMs?: number;
}

interface NoteSession {
	segments: Segment[];
	startedAt?: number;
}

interface PluginData {
	[notePath: string]: NoteSession;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

// ^ anchors to line start. Requires a space after hashes.
// "#comment" / "#question" never match — no space after the hash.
const HEADING = /^(#{1,6}) (.+)/;

function buildSegments(content: string): Segment[] {
	const lines = content.split("\n");

	const boundaries: { line: number; level: number; heading: string }[] = [];
	lines.forEach((l, i) => {
		const m = l.match(HEADING);
		if (m && m[1] && m[2]) {
			boundaries.push({ line: i, level: m[1].length, heading: m[2].trim() });
		}
	});

	if (boundaries.length === 0) {
		return [{
			heading: "Document",
			level: 1,
			startLine: 0,
			endLine: lines.length - 1,
			wordCount: countWords(content),
		}];
	}

	return boundaries.map((b, idx) => {
		const startLine = b.line;
		const next = boundaries[idx + 1];
		const endLine = next !== undefined ? next.line - 1 : lines.length - 1;
		// Exclude the header line — only body text contributes to word count
		const bodyText = lines.slice(startLine + 1, endLine + 1).join("\n");
		return {
			heading: b.heading,
			level: b.level,
			startLine,
			endLine,
			wordCount: countWords(bodyText),
		};
	});
}

function segmentAtLine(segments: Segment[], cursorLine: number): number {
	for (let i = segments.length - 1; i >= 0; i--) {
		const seg = segments[i];
		if (seg !== undefined && cursorLine >= seg.startLine) return i;
	}
	return 0;
}

function fmt(ms: number): string {
	if (ms <= 0) return "0s";
	const s = Math.round(ms / 1000);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) return `${h}h ${m}m`;
	if (m > 0) return `${m}m ${sec}s`;
	return `${sec}s`;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ReadingPacePlugin extends Plugin {
	private data: PluginData = {};
	private statusBar: HTMLElement;

	private intervalStart: Record<string, number> = {};
	private accumulatedMs: Record<string, number> = {};
	// undefined = not yet started, true = paused, false = running
	private timerState: Record<string, "unstarted" | "running" | "paused"> = {};

	async onload() {
		this.data = (await this.loadData()) ?? {};
		this.statusBar = this.addStatusBarItem();

		this.addCommand({
			id: "start-session",
			name: "Start reading session",
			editorCallback: (_: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.startSession(view as MarkdownView),
		});

		this.addCommand({
			id: "stamp-segment-complete",
			name: "Mark current section complete",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.stamp(editor, view as MarkdownView),
		});

		this.addCommand({
			id: "toggle-pause",
			name: "Pause / Resume reading timer",
			editorCallback: (_: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.togglePause(view as MarkdownView),
		});

		this.addCommand({
			id: "reset-session",
			name: "Reset reading session for this note",
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) =>
				this.reset(editor, view as MarkdownView),
		});

		this.registerInterval(window.setInterval(() => this.refreshStatus(), 1000));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.initSession()));
		this.initSession();
	}

	// ─── Session init — segments parsed ONCE, clock NOT started ──────────

	private initSession() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) return;
		const path = view.file.path;

		if (!this.data[path]) {
			this.data[path] = { segments: buildSegments(view.editor.getValue()) };
		}

		// Don't touch the clock — user starts it manually
		if (this.timerState[path] === undefined) {
			this.timerState[path] = "unstarted";
			this.accumulatedMs[path] = 0;
		}

		this.refreshStatus();
	}

	// ─── Manual start ─────────────────────────────────────────────────────

	private startSession(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "running") {
			new Notice("Session already running.");
			return;
		}

		this.intervalStart[path] = Date.now();
		this.timerState[path] = "running";

		if (!this.data[path]?.startedAt) {
			const session = this.data[path];
			if (session) session.startedAt = Date.now();
		}

		this.refreshStatus();
		new Notice("▶ Session started.");
	}

	// ─── Stamp ────────────────────────────────────────────────────────────

	private async stamp(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		const session = this.data[path];
		if (!session) return;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		const idx = segmentAtLine(session.segments, editor.getCursor().line);
		const seg = session.segments[idx];
		if (!seg) return;

		if (seg.completedAt) {
			new Notice(`"${seg.heading}" is already stamped.`);
			return;
		}

		const totalElapsed = this.elapsedMs(path);
		const priorMs = session.segments
			.filter((s) => s.completedAt)
			.reduce((sum, s) => sum + (s.durationMs ?? 0), 0);

		seg.durationMs = totalElapsed - priorMs;
		seg.completedAt = Date.now();

		await this.saveData(this.data);
		this.refreshStatus();

		const { nextLabel, nextEst, totalEst } = this.estimate(session);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst} | ` : "";
		new Notice(`✓ ${seg.heading}\n${nextPart}Remaining: ${totalEst}`);
	}

	// ─── Pause / Resume ───────────────────────────────────────────────────

	private togglePause(view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;

		if (this.timerState[path] === "unstarted") {
			new Notice("Start the session first.");
			return;
		}

		if (this.timerState[path] === "paused") {
			this.intervalStart[path] = Date.now();
			this.timerState[path] = "running";
			new Notice("▶ Resumed");
		} else {
			this.accumulatedMs[path] = this.elapsedMs(path);
			this.timerState[path] = "paused";
			new Notice("⏸ Paused");
		}
		this.refreshStatus();
	}

	// ─── Reset — only place segments are re-parsed ────────────────────────

	private async reset(editor: Editor, view: MarkdownView) {
		if (!view.file) return;
		const path = view.file.path;
		this.data[path] = { segments: buildSegments(editor.getValue()) };
		this.timerState[path] = "unstarted";
		this.accumulatedMs[path] = 0;
		delete this.intervalStart[path];
		await this.saveData(this.data);
		this.refreshStatus();
		new Notice("Session reset.");
	}

	// ─── Elapsed ──────────────────────────────────────────────────────────

	private elapsedMs(path: string): number {
		const acc = this.accumulatedMs[path] ?? 0;
		if (this.timerState[path] !== "running") return acc;
		const start = this.intervalStart[path];
		return start != null ? acc + (Date.now() - start) : acc;
	}

	// ─── Estimate ─────────────────────────────────────────────────────────

	private estimate(session: NoteSession): { nextLabel: string; nextEst: string; totalEst: string } {
		// Exclude zero-word segments from pace — empty headers skew ms/word average
		const done = session.segments.filter(
			(s) => s.completedAt && s.durationMs != null && s.wordCount > 0
		);
		const remaining = session.segments.filter((s) => !s.completedAt);
		const next = remaining[0];

		const totalWords = remaining.reduce((s, seg) => s + seg.wordCount, 0);
		const nextWords = next?.wordCount ?? 0;

		if (done.length === 0) {
			// Cold start — no pace data yet, show exact word counts
			return {
				nextLabel: next?.heading ?? "",
				nextEst: `${nextWords}w`,
				totalEst: `${totalWords}w`,
			};
		}

		const doneWords = done.reduce((s, seg) => s + seg.wordCount, 0);
		const doneMs = done.reduce((s, seg) => s + (seg.durationMs ?? 0), 0);
		const pace = doneMs / doneWords;

		return {
			nextLabel: next?.heading ?? "",
			nextEst: fmt(nextWords * pace),
			totalEst: fmt(totalWords * pace),
		};
	}

	// ─── Status bar ───────────────────────────────────────────────────────

	private refreshStatus() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view?.file) { this.statusBar.setText("📖 –"); return; }

		const path = view.file.path;
		const session = this.data[path];
		if (!session) { this.statusBar.setText("📖 –"); return; }

		const state = this.timerState[path];

		if (state === "unstarted") {
			const { nextEst, totalEst } = this.estimate(session);
			this.statusBar.setText(`📖 Not started | Next: ${nextEst} | Total: ${totalEst}`);
			return;
		}

		const elapsed = fmt(this.elapsedMs(path));
		const pauseMark = state === "paused" ? " ⏸" : "";
		const { nextLabel, nextEst, totalEst } = this.estimate(session);
		const nextPart = nextLabel ? `Next (${nextLabel}): ${nextEst}` : "Done!";

		this.statusBar.setText(`📖 ${elapsed}${pauseMark} | ${nextPart} | Remaining: ${totalEst}`);
	}
}
```