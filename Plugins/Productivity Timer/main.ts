import { App, Plugin, PluginSettingTab, Setting, Notice, Modal } from "obsidian";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimerSegment {
	id: string;
	timer_id: string;
	started_at: string;
	ended_at: string;
	duration_seconds: number;
}

interface Timer {
	id: string;
	parent_id: string | null;
	name: string;
	estimate_seconds: number;
	tracked_seconds: number;
	is_running: boolean;
	rotation_enabled: boolean;
	is_rotation_running: boolean;
	is_last_active: boolean;
	sort_order: number;
	last_started_at: string | null;
	created_at: string;
	visual_seconds?: number; // Local runtime visual helper
	segments?: TimerSegment[]; // Holds active tracking segments
}

interface SessionEntry {
	timer_name: string;
	estimate_seconds: number;
	tracked_seconds: number;
}

interface Session {
	id: string;
	date: string;
	completed_at: string;
	entries: SessionEntry[];
}

interface PluginSettings {
	supabaseUrl: string;
	supabaseKey: string;
	windowX: number;
	windowY: number;
	windowWidth: number;
	windowHeight: number;
}

const DEFAULT_SETTINGS: PluginSettings = {
	supabaseUrl: "",
	supabaseKey: "",
	windowX: 100,
	windowY: 100,
	windowWidth: 480,
	windowHeight: 520,
};

// ─── Supabase Client ─────────────────────────────────────────────────────────

class SupabaseClient {
	private url: string;
	private key: string;
	private realtimeWs: WebSocket | null = null;
	private realtimeCallbacks: Map<string, (payload: any) => void> = new Map();

	constructor(url: string, key: string) {
		this.url = url.replace(/\/$/, "");
		this.key = key;
	}

	private headers() {
		return {
			"Content-Type": "application/json",
			"apikey": this.key,
			"Authorization": `Bearer ${this.key}`,
		};
	}

	async select(table: string, query = ""): Promise<any[]> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${query}`, {
			headers: { ...this.headers(), "Accept": "application/json" },
		});
		if (!res.ok) throw new Error(await res.text());
		return res.json();
	}

	async insert(table: string, data: any): Promise<any> {
		const res = await fetch(`${this.url}/rest/v1/${table}`, {
			method: "POST",
			headers: { ...this.headers(), "Prefer": "return=representation" },
			body: JSON.stringify(data),
		});
		if (!res.ok) throw new Error(await res.text());
		const text = await res.text();
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}

	async update(table: string, data: any, match: string): Promise<any> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${match}`, {
			method: "PATCH",
			headers: { ...this.headers(), "Prefer": "return=representation" },
			body: JSON.stringify(data),
		});
		if (!res.ok) throw new Error(await res.text());
		const text = await res.text();
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}

	async delete(table: string, match: string): Promise<void> {
		const res = await fetch(`${this.url}/rest/v1/${table}?${match}`, {
			method: "DELETE",
			headers: this.headers(),
		});
		if (!res.ok) throw new Error(await res.text());
	}

	subscribeToTable(table: string, callback: (payload: any) => void) {
		const wsUrl = this.url.replace("https://", "wss://").replace("http://", "ws://")
			+ "/realtime/v1/websocket?apikey=" + this.key + "&vsn=1.0.0";

		// Terminate any previous developer reload WebSocket connections
		if ((window as any).ptRealtimeWs) {
			try { (window as any).ptRealtimeWs.close(); } catch {}
			(window as any).ptRealtimeWs = null;
		}

		if (this.realtimeWs) this.realtimeWs.close();
		this.realtimeCallbacks.set(table, callback);

		const ws = new WebSocket(wsUrl);
		this.realtimeWs = ws;
		(window as any).ptRealtimeWs = ws;

		ws.onopen = () => {
			ws.send(JSON.stringify({
				topic: `realtime:public:${table}`,
				event: "phx_join",
				payload: {
					config: {
						postgres_changes: [
							{
								event: "*",
								schema: "public",
								table: table
							}
						]
					},
					access_token: this.key
				},
				ref: "1",
			}));
		};

		ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data);
				if (msg.event === "postgres_changes") {
					const cb = this.realtimeCallbacks.get(table);
					if (cb && msg.payload) {
						cb(msg.payload);
					}
				}
			} catch {}
		};

		ws.onerror = () => {};
		ws.onclose = () => {
			setTimeout(() => {
				if (this.realtimeCallbacks.has(table)) this.subscribeToTable(table, callback);
			}, 3000);
		};
	}

	disconnect() {
		this.realtimeCallbacks.clear();
		if (this.realtimeWs) {
			this.realtimeWs.close();
			this.realtimeWs = null;
		}
		if ((window as any).ptRealtimeWs) {
			try { (window as any).ptRealtimeWs.close(); } catch {}
			(window as any).ptRealtimeWs = null;
		}
	}
}

// ─── Time Log Modal (History entries list) ───────────────────────────────────

class TimeLogModal extends Modal {
	private getTimer: () => Timer;
	private db: SupabaseClient;
	private onUpdate: () => Promise<void>;
	private listContainer: HTMLElement;
	private tickInterval: number | null = null;

	constructor(app: App, getTimer: () => Timer, db: SupabaseClient, onUpdate: () => Promise<void>) {
		super(app);
		this.getTimer = getTimer;
		this.db = db;
		this.onUpdate = onUpdate;
	}

	async onOpen() {
		const { contentEl } = this;
		this.titleEl.setText(`Logs: ${this.getTimer().name}`);
		this.renderLogs();

		// Start interval to tick the active segment timer every second in the UI
		this.tickInterval = window.setInterval(() => {
			const liveBadge = this.listContainer?.querySelector(".pt-modal-live-duration");
			if (liveBadge) {
				const timer = this.getTimer();
				if (timer && timer.last_started_at) {
					const elapsed = Math.floor((Date.now() - new Date(timer.last_started_at).getTime()) / 1000);
					liveBadge.textContent = this.formatTime(elapsed);
				}
			}
		}, 1000);
	}

	private toLocalDateTimeString(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, "0");
		const yyyy = date.getFullYear();
		const mm = pad(date.getMonth() + 1);
		const dd = pad(date.getDate());
		const hh = pad(date.getHours());
		const min = pad(date.getMinutes());
		return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
	}

	private parseTimeInput(input: string): number | null {
		input = input.trim().toLowerCase();
		if (!input) return null;

		let totalSeconds = 0;
		let matched = false;

		// Match hours (e.g. 15h, 15hrs, 1.5h)
		const hMatch = input.match(/(\d+(?:\.\d+)?)\s*h(?:rs?)?/);
		if (hMatch && hMatch[1]) {
			totalSeconds += parseFloat(hMatch[1]) * 3600;
			matched = true;
		}

		// Match minutes (e.g. 30m, 30mins)
		const mMatch = input.match(/(\d+(?:\.\d+)?)\s*m(?:ins?)?/);
		if (mMatch && mMatch[1]) {
			totalSeconds += parseFloat(mMatch[1]) * 60;
			matched = true;
		}

		// Match seconds (e.g. 45s, 45secs)
		const sMatch = input.match(/(\d+)\s*s(?:ecs?)?/);
		if (sMatch && sMatch[1]) {
			totalSeconds += parseInt(sMatch[1]);
			matched = true;
		}

		if (matched) return Math.round(totalSeconds);

		// Fallback: If it's a plain number, treat it as minutes
		const plainNum = parseFloat(input);
		if (!isNaN(plainNum)) {
			return Math.round(plainNum * 60);
		}

		return null;
	}

	private renderLogs() {
		const { contentEl } = this;
		contentEl.empty();

		// ── Section: Manual Entry Log ──
		const addLogSection = contentEl.createDiv({ cls: "pt-modal-add-log" });
		addLogSection.createEl("h4", { text: "Add Manual Entry" });
		
		const addInputs = addLogSection.createDiv({ cls: "pt-modal-add-row" });
		const manualInput = addInputs.createEl("input", { type: "text", placeholder: "e.g. 30m, 1.5h, 15hrs" });
		manualInput.style.width = "100%";
		manualInput.style.flex = "1";

		const submitManualLog = async () => {
			const rawVal = manualInput.value.trim();
			const totalSeconds = this.parseTimeInput(rawVal);
			if (totalSeconds === null || totalSeconds <= 0) {
				new Notice("Please enter a valid format (e.g., 30m, 1.5h, 15hrs).");
				return;
			}
			const ended = new Date();
			const started = new Date(ended.getTime() - totalSeconds * 1000);

			const currentTimer = this.getTimer();
			try {
				await this.db.insert("timer_segments", {
					timer_id: currentTimer.id,
					started_at: started.toISOString(),
					ended_at: ended.toISOString(),
					duration_seconds: totalSeconds
				});

				const updatedTracked = currentTimer.tracked_seconds + totalSeconds;
				await this.db.update("timers", { tracked_seconds: updatedTracked }, `id=eq.${currentTimer.id}`);
				
				new Notice(`Added manual entry: ${rawVal}`);
				manualInput.value = "";
				await this.onUpdate();
				this.renderLogsListOnly();
			} catch (e) {
				new Notice("Failed to add log entry.");
			}
		};

		// Submit on Enter or Cmd/Ctrl + Enter
		manualInput.addEventListener("keydown", async (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				await submitManualLog();
			}
		});

		// ── Section: Dynamic logs list container ──
		contentEl.createEl("h4", { text: "Time Entries History" });
		this.listContainer = contentEl.createDiv({ cls: "pt-modal-logs-list" });
		
		this.renderLogsListOnly();
	}

	private renderLogsListOnly() {
		if (!this.listContainer) return;
		this.listContainer.empty();

		const timer = this.getTimer();
		const segments = timer.segments || [];

		// ── Prepend Active Running Segment (If running) ──
		if (timer.is_running && timer.last_started_at) {
			const activeRow = this.listContainer.createDiv({ cls: "pt-modal-log-row pt-modal-log-row--active" });
			
			const startPicker = activeRow.createEl("input", { type: "datetime-local" });
			startPicker.value = this.toLocalDateTimeString(new Date(timer.last_started_at));
			
			startPicker.addEventListener("blur", async () => {
				const newStart = new Date(startPicker.value);
				if (isNaN(newStart.getTime())) return;
				try {
					await this.db.update("timers", { last_started_at: newStart.toISOString() }, `id=eq.${timer.id}`);
					new Notice("Active segment start time updated.");
					await this.onUpdate();
				} catch {
					new Notice("Failed to update active segment start time.");
				}
			});

			activeRow.createEl("span", { text: "to", cls: "pt-modal-to-label" });
			activeRow.createEl("span", { text: "Present (Active)", cls: "pt-modal-active-label" });

			const durDisp = activeRow.createEl("span", { 
				cls: "pt-modal-duration-badge pt-modal-live-duration", 
				text: "Calculating..." 
			});

			// Set initial value
			const elapsed = Math.floor((Date.now() - new Date(timer.last_started_at).getTime()) / 1000);
			durDisp.textContent = this.formatTime(elapsed);

			// Placeholder delete to indicate it is locked while active
			const stopBtn = activeRow.createEl("button", { cls: "pt-btn-del-seg", title: "Active timer running" });
			stopBtn.innerHTML = "⏸";
			stopBtn.style.opacity = "0.4";
			stopBtn.style.pointerEvents = "none";
		}

		if (segments.length === 0 && (!timer.is_running || !timer.last_started_at)) {
			this.listContainer.createEl("p", { cls: "pt-empty", text: "No logs recorded yet for this task." });
			return;
		}

		// Sort segments desc (newest first)
		const sorted = [...segments].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

		for (const seg of sorted) {
			const row = this.listContainer.createDiv({ cls: "pt-modal-log-row" });
			const start = new Date(seg.started_at);
			const end = new Date(seg.ended_at);

			// Start Date Picker
			const startPicker = row.createEl("input", { type: "datetime-local" });
			startPicker.value = this.toLocalDateTimeString(start);

			row.createEl("span", { text: "to", cls: "pt-modal-to-label" });

			// End Date Picker
			const endPicker = row.createEl("input", { type: "datetime-local" });
			endPicker.value = this.toLocalDateTimeString(end);

			// Duration display
			const durDisp = row.createEl("span", { cls: "pt-modal-duration-badge", text: this.formatTime(seg.duration_seconds) });

			// Save updates on picker blur
			const updateTimes = async () => {
				const newStart = new Date(startPicker.value);
				const newEnd = new Date(endPicker.value);
				if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) return;
				if (newEnd < newStart) {
					new Notice("End time cannot be before start time.");
					endPicker.value = this.toLocalDateTimeString(end);
					return;
				}

				const newDuration = Math.round((newEnd.getTime() - newStart.getTime()) / 1000);
				if (newDuration === seg.duration_seconds && newStart.toISOString() === seg.started_at) return;

				const diff = newDuration - seg.duration_seconds;
				try {
					await this.db.update("timer_segments", {
						started_at: newStart.toISOString(),
						ended_at: newEnd.toISOString(),
						duration_seconds: newDuration
					}, `id=eq.${seg.id}`);

					const currentTimer = this.getTimer();
					const updatedTracked = Math.max(0, currentTimer.tracked_seconds + diff);
					currentTimer.tracked_seconds = updatedTracked;
					await this.db.update("timers", { tracked_seconds: updatedTracked }, `id=eq.${currentTimer.id}`);

					seg.started_at = newStart.toISOString();
					seg.ended_at = newEnd.toISOString();
					seg.duration_seconds = newDuration;
					durDisp.textContent = this.formatTime(newDuration);

					new Notice("Segment log updated.");
					await this.onUpdate();
					this.renderLogsListOnly();
				} catch {
					new Notice("Failed to save times.");
				}
			};

			startPicker.addEventListener("blur", updateTimes);
			endPicker.addEventListener("blur", updateTimes);

			// Delete segment button
			const delBtn = row.createEl("button", { cls: "pt-btn-del-seg", title: "Delete segment" });
			delBtn.innerHTML = "✕";
			delBtn.addEventListener("click", async () => {
				try {
					await this.db.delete("timer_segments", `id=eq.${seg.id}`);

					const currentTimer = this.getTimer();
					const updatedTracked = Math.max(0, currentTimer.tracked_seconds - seg.duration_seconds);
					currentTimer.tracked_seconds = updatedTracked;
					await this.db.update("timers", { tracked_seconds: updatedTracked }, `id=eq.${currentTimer.id}`);

					new Notice("Segment log entry deleted.");
					await this.onUpdate();
					this.renderLogsListOnly();
				} catch {
					new Notice("Failed to delete segment entry.");
				}
			});
		}
	}

	private formatTime(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
		if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
		return `${s}s`;
	}

	onClose() {
		if (this.tickInterval) {
			window.clearInterval(this.tickInterval);
			this.tickInterval = null;
		}
		this.contentEl.empty();
	}
}

// ─── Floating Window ─────────────────────────────────────────────────────────

class ProductivityTimerWindow {
	private plugin: ProductivityTimerPlugin;
	public isWriting = false;
	private showArchive = false;
	private draggedTimerId: string | null = null; // Lightweight local Drag-and-drop ID tracker

	// Drag state (floating window drag)
	private isDragging = false;
	private dragOffsetX = 0;
	private dragOffsetY = 0;

	// Resize state
	private isResizing = false;
	private resizeStartX = 0;
	private resizeStartY = 0;
	private resizeStartW = 0;
	private resizeStartH = 0;

	private el: HTMLElement;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
		this.el = document.createElement("div");
		this.el.id = "pt-floating-window";
		document.body.appendChild(this.el);
		this.applyPosition();
		this.injectStyles();
		this.init();
	}

	private applyPosition() {
		const s = this.plugin.settings;
		const maxX = window.innerWidth - s.windowWidth;
		const maxY = window.innerHeight - s.windowHeight;
		const x = Math.max(0, Math.min(s.windowX, maxX));
		const y = Math.max(0, Math.min(s.windowY, maxY));
		Object.assign(this.el.style, {
			position: "fixed",
			left: `${x}px`,
			top: `${y}px`,
			width: `${s.windowWidth}px`,
			height: `${s.windowHeight}px`,
			zIndex: "40", // Set behind the main settings modal (which is 50)
		});
	}

	private async init() {
		this.render();
	}

	private async runWriteAction(action: () => Promise<void>) {
		this.isWriting = true;
		this.plugin.isWriting = true;
		try {
			await action();
		} catch (e) {
			console.error("Write action failed:", e);
		} finally {
			// Keeping a debounce ensures reflected WebSocket events have completed and been swallowed
			setTimeout(() => {
				this.isWriting = false;
				this.plugin.isWriting = false;
			}, 800);
		}
	}

	public renderTimerRowsOnly() {
		const flattened = this.getFlattenedRenderedTimers();
		const rows = this.el.querySelectorAll(".pt-row");
		rows.forEach((row, i) => {
			const timer = flattened[i];
			if (!timer) return;
			const { tracked } = this.getTimerDisplayTimes(timer);

			const trackedInput = row.querySelector(".pt-tracked-input") as HTMLInputElement;
			if (trackedInput && document.activeElement !== trackedInput) {
				trackedInput.value = tracked > 0 ? this.formatTime(tracked) : "0s";
			}

			const isAnyActive = timer.is_running || timer.is_rotation_running;
			row.classList.toggle("pt-row--running", isAnyActive);

			const playBtn = row.querySelector(".pt-btn--play");
			if (playBtn) {
				playBtn.classList.toggle("pt-btn--active", timer.is_running);
				playBtn.innerHTML = timer.is_running ? this.pauseIcon() : this.playIcon();
			}

			const rotationBtn = row.querySelector(".pt-btn--rotation");
			if (rotationBtn) {
				rotationBtn.classList.toggle("pt-btn--active", timer.is_rotation_running);
				rotationBtn.innerHTML = timer.is_rotation_running ? this.pauseIcon() : this.loopIcon();
			}
		});
		const rollupTracked = this.el.querySelector(".pt-rollup-tracked");
		if (rollupTracked) rollupTracked.textContent = this.formatTime(this.plugin.totalTracked());
	}

	public render() {
		this.el.empty();

		// ── Title bar (drag handle) ──
		const titleBar = this.el.createDiv({ cls: "pt-titlebar" });
		titleBar.createEl("span", { cls: "pt-titlebar-text", text: "Productivity Timer" });

		const titleActions = titleBar.createDiv({ cls: "pt-titlebar-actions" });
		const closeBtn = titleActions.createEl("button", { cls: "pt-titlebar-btn pt-close-btn", text: "✕" });
		closeBtn.addEventListener("click", () => this.destroy());

		this.setupDrag(titleBar);

		// ── Scrollable body ──
		const body = this.el.createDiv({ cls: "pt-body" });

		// ── Action buttons ──
		const actions = body.createDiv({ cls: "pt-actions" });
		const addBtn = actions.createEl("button", { cls: "pt-btn pt-btn--add", text: "+ Add Timer" });
		addBtn.addEventListener("click", () => this.addTimer());

		const completeBtn = actions.createEl("button", { cls: "pt-btn pt-btn--complete", text: "Done" });
		completeBtn.addEventListener("click", () => this.completeAll());

		const archiveBtn = actions.createEl("button", { cls: "pt-btn pt-btn--archive", text: this.showArchive ? "Hide Archive" : "Archive" });
		archiveBtn.addEventListener("click", () => { this.showArchive = !this.showArchive; this.render(); });

		// ── Rollup ──
		const rollup = body.createDiv({ cls: "pt-rollup" });
		rollup.createEl("span", { cls: "pt-rollup-label", text: "Total" });
		const rollupRight = rollup.createDiv({ cls: "pt-rollup-right" });
		rollupRight.createEl("span", { cls: "pt-rollup-tracked", text: this.formatTime(this.plugin.totalTracked()) });
		rollupRight.createEl("span", { cls: "pt-rollup-divider", text: "/" });
		rollupRight.createEl("span", { cls: "pt-rollup-estimate", text: this.formatTime(this.plugin.totalEstimate()) });

		// ── Column headers ──
		const colHeaders = body.createDiv({ cls: "pt-col-headers" });
		colHeaders.createEl("span", { text: "Task" });
		colHeaders.createEl("span", { text: "" }); // Play
		colHeaders.createEl("span", { text: "Tracked" });
		colHeaders.createEl("span", { text: "Estimate" });
		colHeaders.createEl("span", { text: "" }); // Trash
		colHeaders.createEl("span", { text: "" }); // Loop
		colHeaders.createEl("span", { text: "" }); // Add Subtask

		// ── Timer rows ──
		const timerRows = body.createDiv({ cls: "pt-timer-rows" });
		this.buildTimerRows(timerRows);

		// ── Archive ──
		if (this.showArchive) {
			const archive = body.createDiv({ cls: "pt-archive" });
			archive.createEl("h5", { cls: "pt-archive-title", text: "Archive" });
			if (this.plugin.sessions.length === 0) {
				archive.createEl("p", { cls: "pt-empty", text: "No completed sessions yet." });
			}
			for (const session of this.plugin.sessions) {
				const sessionEl = archive.createDiv({ cls: "pt-session" });
				const sessionHeader = sessionEl.createDiv({ cls: "pt-session-header" });
				sessionHeader.createEl("span", { cls: "pt-session-date", text: this.formatDate(session.completed_at) });
				const delBtn = sessionHeader.createEl("button", { cls: "pt-btn pt-btn--delete" });
				delBtn.innerHTML = this.trashIcon();
				delBtn.addEventListener("click", () => this.deleteSession(session));
				for (const entry of session.entries) {
					const entryEl = sessionEl.createDiv({ cls: "pt-session-entry" });
					entryEl.createEl("span", { cls: "pt-session-name", text: entry.timer_name });
					entryEl.createEl("span", { cls: "pt-session-tracked", text: this.formatTime(entry.tracked_seconds) });
					entryEl.createEl("span", { cls: "pt-session-divider", text: "/" });
					entryEl.createEl("span", { cls: "pt-session-estimate", text: this.formatTime(entry.estimate_seconds) });
				}
			}
		}

		// ── Resize handle ──
		const resizeHandle = this.el.createDiv({ cls: "pt-resize-handle" });
		this.setupResize(resizeHandle);
	}

	private buildTimerRows(container: HTMLElement) {
		const parents = this.plugin.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			this.renderRow(container, parent);
			const subtasks = this.plugin.timers.filter(t => t.parent_id === parent.id);
			for (const sub of subtasks) {
				this.renderRow(container, sub);
			}
		}
	}

	private renderRow(container: HTMLElement, timer: Timer) {
		const isSubtask = timer.parent_id !== null;
		const row = container.createDiv({
			cls: `pt-row ${isSubtask ? "pt-row--subtask" : ""} ${timer.is_running || timer.is_rotation_running ? "pt-row--running" : ""}`
		});

		// Make row HTML5 draggable
		row.setAttribute("draggable", "true");

		// Drag Start
		row.addEventListener("dragstart", (e: DragEvent) => {
			const target = e.target as HTMLElement;
			// Prevent initiating dragging if focusing on text edits or inputs/buttons
			if (target.closest("button") || target.closest("input") || target.closest(".pt-name")) {
				e.preventDefault();
				return;
			}
			this.draggedTimerId = timer.id; // Store in local memory to prevent clipboard blocks
			row.classList.add("pt-row--dragging");
		});

		// Drag Over
		row.addEventListener("dragover", (e: DragEvent) => {
			e.preventDefault();
			row.classList.add("pt-row--drag-over");
		});

		// Drag Leave
		row.addEventListener("dragleave", () => {
			row.classList.remove("pt-row--drag-over");
		});

		// Drag End
		row.addEventListener("dragend", () => {
			row.classList.remove("pt-row--dragging");
			row.classList.remove("pt-row--drag-over");
			this.draggedTimerId = null;
		});

		// Drop
		row.addEventListener("drop", async (e: DragEvent) => {
			e.preventDefault();
			row.classList.remove("pt-row--drag-over");

			const draggedId = this.draggedTimerId;
			if (!draggedId || draggedId === timer.id) return; // Dropped on itself

			const draggedTimer = this.plugin.timers.find(t => t.id === draggedId);
			if (!draggedTimer) return;

			// Limit sorting strictly to same hierarchial level
			if (draggedTimer.parent_id !== timer.parent_id) {
				new Notice("Reordering is only supported within the same task/subtask level.");
				return;
			}

			const sibs = this.plugin.timers
				.filter(t => t.parent_id === timer.parent_id)
				.sort((a, b) => a.sort_order - b.sort_order);

			const draggedIdx = sibs.findIndex(t => t.id === draggedId);
			const targetIdx = sibs.findIndex(t => t.id === timer.id);

			if (draggedIdx !== -1 && targetIdx !== -1) {
				// Reorder the local array slice
				sibs.splice(draggedIdx, 1);
				sibs.splice(targetIdx, 0, draggedTimer);

				// Update database sorting orders
				await this.runWriteAction(async () => {
					await Promise.all(sibs.map((t, idx) => {
						t.sort_order = idx;
						return this.plugin.db.update("timers", { sort_order: idx }, `id=eq.${t.id}`);
					}));
					await this.plugin.loadTimers();
					this.render();
				});
			}
		});

		// 1. Name
		const nameEl = row.createEl("span", { cls: "pt-name", text: timer.name });
		nameEl.contentEditable = "true";
		nameEl.addEventListener("blur", async () => {
			const newName = nameEl.textContent?.trim();
			if (newName && newName !== timer.name) {
				await this.runWriteAction(async () => {
					await this.plugin.db.update("timers", { name: newName }, `id=eq.${timer.id}`);
					timer.name = newName;
					await this.plugin.loadTimers();
				});
			}
		});
		nameEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); nameEl.blur(); }
		});

		// 2. Play Button
		const playBtn = row.createEl("button", {
			cls: `pt-btn pt-btn--play ${timer.is_running ? "pt-btn--active" : ""}`,
			title: "Play timer"
		});
		playBtn.innerHTML = timer.is_running ? this.pauseIcon() : this.playIcon();
		playBtn.addEventListener("click", () => {
			if (isSubtask) {
				this.playSubtaskDirectly(timer);
			} else {
				this.playParent(timer);
			}
		});

		// Calculate displaying data totals
		const { tracked, estimate } = this.getTimerDisplayTimes(timer);

		// 3. Tracked Time Input (Read-only, acts as a button to launch logs modal)
		const trackedInput = row.createEl("input", { cls: "pt-tracked-input", type: "text", value: tracked > 0 ? this.formatTime(tracked) : "0s" });
		trackedInput.readOnly = true;
		trackedInput.title = "Click to view and edit time logs";

		trackedInput.addEventListener("click", () => {
			new TimeLogModal(
				this.plugin.app, 
				() => this.plugin.timers.find(t => t.id === timer.id)!, // Always references latest sync data
				this.plugin.db, 
				async () => {
					await this.plugin.loadTimers();
					this.render();
				}
			).open();
		});

		// 4. Estimate Time Input
		const estimateInput = row.createEl("input", { cls: "pt-estimate-input", type: "text" });
		estimateInput.value = estimate > 0 ? this.formatTime(estimate) : "";
		estimateInput.placeholder = "0h 00m";
		
		const sumEstimate = this.plugin.timers.filter(t => t.parent_id === timer.id).reduce((sum, s) => sum + s.estimate_seconds, 0);
		estimateInput.addEventListener("blur", async () => {
			const parsed = this.parseTimeInput(estimateInput.value);
			if (parsed !== null) {
				await this.runWriteAction(async () => {
					if (isSubtask) {
						if (parsed !== timer.estimate_seconds) {
							timer.estimate_seconds = parsed;
							await this.plugin.db.update("timers", { estimate_seconds: parsed }, `id=eq.${timer.id}`);
						}
					} else {
						const newParentEstimate = Math.max(0, parsed - (sumEstimate || 0));
						if (newParentEstimate !== timer.estimate_seconds) {
							timer.estimate_seconds = newParentEstimate;
							await this.plugin.db.update("timers", { estimate_seconds: newParentEstimate }, `id=eq.${timer.id}`);
						}
					}
					await this.plugin.loadTimers();
					const { estimate: latestEstimate } = this.getTimerDisplayTimes(timer);
					estimateInput.value = latestEstimate > 0 ? this.formatTime(latestEstimate) : "";
				});
			}
		});
		estimateInput.addEventListener("keydown", (e) => { if (e.key === "Enter") estimateInput.blur(); });

		// 5. Trash Button
		const deleteBtn = row.createEl("button", { cls: "pt-btn pt-btn--delete", title: "Delete task" });
		deleteBtn.innerHTML = this.trashIcon();
		deleteBtn.addEventListener("click", () => this.deleteTimer(timer));

		// 6. Subtask Rotation Play (Loop) Button
		const rotationBtn = row.createEl("button", {
			cls: `pt-btn pt-btn--rotation ${timer.is_rotation_running ? "pt-btn--active" : ""}`,
			title: "Toggle Subtask Rotation"
		});
		rotationBtn.innerHTML = timer.is_rotation_running ? this.pauseIcon() : this.loopIcon();
		const subtasks = this.plugin.timers.filter(t => t.parent_id === timer.id);
		if (isSubtask || subtasks.length === 0) {
			rotationBtn.style.opacity = "0";
			rotationBtn.style.pointerEvents = "none";
		} else {
			rotationBtn.addEventListener("click", () => this.toggleRotation(timer));
		}

		// 7. Add Subtask Button
		const addSubtaskBtn = row.createEl("button", {
			cls: "pt-btn pt-btn--add-subtask",
			title: "Add Subtask"
		});
		addSubtaskBtn.innerHTML = this.plusIcon();
		if (isSubtask) {
			addSubtaskBtn.style.opacity = "0";
			addSubtaskBtn.style.pointerEvents = "none";
		} else {
			addSubtaskBtn.addEventListener("click", () => this.addSubtask(timer));
		}
	}

	// ── Drag ──────────────────────────────────────────────────────────────────

	private setupDrag(handle: HTMLElement) {
		handle.addEventListener("mousedown", (e) => {
			if ((e.target as HTMLElement).closest("button")) return;
			this.isDragging = true;
			this.dragOffsetX = e.clientX - this.el.getBoundingClientRect().left;
			this.dragOffsetY = e.clientY - this.el.getBoundingClientRect().top;
			e.preventDefault();
		});

		document.addEventListener("mousemove", (e) => {
			if (!this.isDragging) return;
			const x = Math.max(0, Math.min(e.clientX - this.dragOffsetX, window.innerWidth - this.el.offsetWidth));
			const y = Math.max(0, Math.min(e.clientY - this.dragOffsetY, window.innerHeight - this.el.offsetHeight));
			this.el.style.left = `${x}px`;
			this.el.style.top = `${y}px`;
		});

		document.addEventListener("mouseup", () => {
			if (!this.isDragging) return;
			this.isDragging = false;
			this.plugin.settings.windowX = parseInt(this.el.style.left);
			this.plugin.settings.windowY = parseInt(this.el.style.top);
			this.plugin.saveSettings();
		});
	}

	// ── Resize ────────────────────────────────────────────────────────────────

	private setupResize(handle: HTMLElement) {
		handle.addEventListener("mousedown", (e) => {
			this.isResizing = true;
			this.resizeStartX = e.clientX;
			this.resizeStartY = e.clientY;
			this.resizeStartW = this.el.offsetWidth;
			this.resizeStartH = this.el.offsetHeight;
			e.preventDefault();
			e.stopPropagation();
		});

		document.addEventListener("mousemove", (e) => {
			if (!this.isResizing) return;
			const w = Math.max(380, this.resizeStartW + (e.clientX - this.resizeStartX));
			const h = Math.max(300, this.resizeStartH + (e.clientY - this.resizeStartY));
			this.el.style.width = `${w}px`;
			this.el.style.height = `${h}px`;
		});

		document.addEventListener("mouseup", () => {
			if (!this.isResizing) return;
			this.isResizing = false;
			this.plugin.settings.windowWidth = this.el.offsetWidth;
			this.plugin.settings.windowHeight = this.el.offsetHeight;
			this.plugin.saveSettings();
		});
	}

	// ── Visual/Formatting Local Helpers ───────────────────────────────────────

	private getActiveTrackedSeconds(timer: Timer): number {
		return this.plugin.getActiveTrackedSeconds(timer);
	}

	private formatTime(seconds: number): string {
		return this.plugin.formatTime(seconds);
	}

	private formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	}

	private parseTimeInput(input: string): number | null {
		return this.plugin.parseTimeInput(input);
	}

	private getTimerDisplayTimes(timer: Timer) {
		if (timer.parent_id !== null) {
			return {
				tracked: this.getActiveTrackedSeconds(timer),
				estimate: timer.estimate_seconds
			};
		} else {
			const subtasks = this.plugin.timers.filter(t => t.parent_id === timer.id);
			const sumTracked = subtasks.reduce((sum, s) => sum + this.getActiveTrackedSeconds(s), 0);
			const sumEstimate = subtasks.reduce((sum, s) => sum + s.estimate_seconds, 0);
			return {
				tracked: this.getActiveTrackedSeconds(timer) + sumTracked,
				estimate: timer.estimate_seconds + sumEstimate,
				sumTracked,
				sumEstimate
			};
		}
	}

	private getFlattenedRenderedTimers(): Timer[] {
		const list: Timer[] = [];
		const parents = this.plugin.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			list.push(parent);
			const subtasks = this.plugin.timers.filter(t => t.parent_id === parent.id);
			for (const sub of subtasks) {
				list.push(sub);
			}
		}
		return list;
	}

	// ── Timer Actions ─────────────────────────────────────────────────────────

	private async stopAllTimers() {
		const nowStr = new Date().toISOString();
		
		// Securely pre-capture segment details before mutating the active objects
		const segmentsToRecord = this.plugin.timers.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			const duration = Math.max(0, Math.floor((new Date(nowStr).getTime() - new Date(start).getTime()) / 1000));
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		for (const t of this.plugin.timers) {
			let changed = false;
			const updateObj: any = {};
			if (t.is_running) {
				const segment = segmentsToRecord.find(s => s.timer_id === t.id);
				const finalTracked = segment ? t.tracked_seconds + segment.duration_seconds : t.tracked_seconds;
				t.is_running = false;
				t.last_started_at = null;
				t.tracked_seconds = finalTracked;

				updateObj.is_running = false;
				updateObj.last_started_at = null;
				updateObj.tracked_seconds = finalTracked;
				changed = true;
			}
			if (t.is_rotation_running) {
				t.is_rotation_running = false;
				updateObj.is_rotation_running = false;
				changed = true;
			}
			if (changed) {
				await this.plugin.db.update("timers", updateObj, `id=eq.${t.id}`);
			}
		}

		// Save the segment details to Supabase
		await Promise.all(segmentsToRecord.map(seg => 
			this.plugin.db.insert("timer_segments", {
				timer_id: seg.timer_id,
				started_at: seg.started_at,
				ended_at: seg.ended_at,
				duration_seconds: seg.duration_seconds
			})
		));
	}

	private async playParent(parent: Timer) {
		const isPlaying = !parent.is_running;
		const timersToStop = this.plugin.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = new Date().toISOString();

		// Securely pre-capture segment details before mutating the active objects
		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			// Use the smooth visual clock value to determine segment duration and avoid 1s rounding truncation
			const finalTracked = t.visual_seconds !== undefined ? t.visual_seconds : this.plugin.getActiveTrackedSeconds(t);
			const duration = Math.max(0, finalTracked - t.tracked_seconds);
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		// 1. Calculate final tracked seconds for stopped timers (captured before local state mutations)
		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds; // Match exactly
			} else {
				t.tracked_seconds = this.plugin.getActiveTrackedSeconds(t);
			}

			// 0ms Optimistic segment update (local UI rendering)
			if (t.is_running && t.last_started_at) {
				const start = t.last_started_at;
				const duration = segment ? segment.duration_seconds : 0;
				if (duration > 0) {
					t.segments = t.segments || [];
					t.segments.push({
						id: `temp-${Date.now()}`,
						timer_id: t.id,
						started_at: start,
						ended_at: nowStr,
						duration_seconds: duration
					});
				}
			}
		}

		// 2. Optimistic Local update (0ms delay instant UI transition)
		for (const t of timersToStop) {
			t.is_running = false;
			t.is_rotation_running = false;
			t.last_started_at = null;
			this.plugin.lastWriteTimes.set(t.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: t.tracked_seconds,
				time: Date.now()
			});
		}

		if (isPlaying) {
			parent.is_running = true;
			parent.last_started_at = nowStr;
			this.plugin.lastWriteTimes.set(parent.id, {
				is_running: true,
				last_started_at: parent.last_started_at,
				tracked_seconds: parent.tracked_seconds,
				time: Date.now()
			});
		}

		this.render();

		// 3. Background Database Persistence
		await this.runWriteAction(async () => {
			// Record segment logs for active tasks before stopping them
			await Promise.all(segmentsToRecord.map(seg => 
				this.plugin.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

			// Persist stops using pre-mutation captured states
			await Promise.all(timersToStop.map(t => 
				this.plugin.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying) {
				await this.plugin.db.update("timers", { is_running: true, last_started_at: parent.last_started_at }, `id=eq.${parent.id}`);
			}
			await this.plugin.loadTimers();
			this.render();
		});
	}

	private async playSubtaskDirectly(subtask: Timer) {
		const isPlaying = !subtask.is_running;
		const timersToStop = this.plugin.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = new Date().toISOString();

		// Securely pre-capture segment details before mutating the active objects
		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			// Use the smooth visual clock value to determine segment duration and avoid 1s rounding truncation
			const finalTracked = t.visual_seconds !== undefined ? t.visual_seconds : this.plugin.getActiveTrackedSeconds(t);
			const duration = Math.max(0, finalTracked - t.tracked_seconds);
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		// 1. Calculate final tracked seconds for stopped timers (captured before local state mutations)
		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds; // Match exactly
			} else {
				t.tracked_seconds = this.plugin.getActiveTrackedSeconds(t);
			}

			// 0ms Optimistic segment update (local UI rendering)
			if (t.is_running && t.last_started_at) {
				const start = t.last_started_at;
				const duration = segment ? segment.duration_seconds : 0;
				if (duration > 0) {
					t.segments = t.segments || [];
					t.segments.push({
						id: `temp-${Date.now()}`,
						timer_id: t.id,
						started_at: start,
						ended_at: nowStr,
						duration_seconds: duration
					});
				}
			}
		}

		// 2. Optimistic Local update (0ms delay instant UI transition)
		for (const t of timersToStop) {
			t.is_running = false;
			t.is_rotation_running = false;
			t.last_started_at = null;
			this.plugin.lastWriteTimes.set(t.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: t.tracked_seconds,
				time: Date.now()
			});
		}

		if (isPlaying) {
			subtask.is_running = true;
			subtask.is_last_active = true;
			subtask.last_started_at = nowStr;
			this.plugin.lastWriteTimes.set(subtask.id, {
				is_running: true,
				last_started_at: subtask.last_started_at,
				tracked_seconds: subtask.tracked_seconds,
				time: Date.now()
			});

			const siblings = this.plugin.timers.filter(t => t.parent_id === subtask.parent_id && t.id !== subtask.id);
			for (const sib of siblings) {
				sib.is_last_active = false;
			}
		}

		this.render();

		// 3. Background Database Save
		await this.runWriteAction(async () => {
			// Record segments for active tasks before stopping them
			await Promise.all(segmentsToRecord.map(seg => 
				this.plugin.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

			// Persist stops using pre-mutation captured states
			await Promise.all(timersToStop.map(t => 
				this.plugin.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying) {
				await this.plugin.db.update("timers", { is_running: true, is_last_active: true, last_started_at: subtask.last_started_at }, `id=eq.${subtask.id}`);

				const siblings = this.plugin.timers.filter(t => t.parent_id === subtask.parent_id && t.id !== subtask.id);
				await Promise.all(siblings.map(sib => 
					this.plugin.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));
			}
			await this.plugin.loadTimers();
			this.render();
		});
	}

	private async toggleRotation(parent: Timer) {
		const subtasks = this.plugin.timers.filter(t => t.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order);
		if (subtasks.length === 0) {
			new Notice("Add subtasks first before starting rotation.");
			return;
		}
		const isPlaying = !parent.is_rotation_running;
		const timersToStop = this.plugin.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = new Date().toISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			// Use the smooth visual clock value to determine segment duration and avoid 1s rounding truncation
			const finalTracked = t.visual_seconds !== undefined ? t.visual_seconds : this.plugin.getActiveTrackedSeconds(t);
			const duration = Math.max(0, finalTracked - t.tracked_seconds);
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		// 1. Calculate final tracked seconds for stopped timers
		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.plugin.getActiveTrackedSeconds(t);
			}

			// 0ms Optimistic segment update (local UI rendering)
			if (t.is_running && t.last_started_at) {
				const start = t.last_started_at;
				const duration = segment ? segment.duration_seconds : 0;
				if (duration > 0) {
					t.segments = t.segments || [];
					t.segments.push({
						id: `temp-${Date.now()}`,
						timer_id: t.id,
						started_at: start,
						ended_at: nowStr,
						duration_seconds: duration
					});
				}
			}
		}

		// 2. Optimistic Local update (0ms delay instant UI transition)
		for (const t of timersToStop) {
			t.is_running = false;
			t.is_rotation_running = false;
			t.last_started_at = null;
			this.plugin.lastWriteTimes.set(t.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: t.tracked_seconds,
				time: Date.now()
			});
		}

		const activeSub = subtasks.find(t => t.is_last_active) || subtasks[0];
		if (!activeSub) return; // Type guard resolving TS18048

		if (isPlaying) {
			parent.is_rotation_running = true;
			this.plugin.lastWriteTimes.set(parent.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: parent.tracked_seconds,
				time: Date.now()
			});

			for (const sub of subtasks) {
				if (sub.id !== activeSub.id) {
					sub.is_last_active = false;
				}
			}
			activeSub.is_running = true;
			activeSub.is_last_active = true;
			activeSub.last_started_at = nowStr;
			this.plugin.lastWriteTimes.set(activeSub.id, {
				is_running: true,
				last_started_at: activeSub.last_started_at,
				tracked_seconds: activeSub.tracked_seconds,
				time: Date.now()
			});
		}

		this.render();

		// 3. Background Database Persistence
		await this.runWriteAction(async () => {
			// Record segment logs for active tasks before stopping them
			await Promise.all(segmentsToRecord.map(seg => 
				this.plugin.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

			// Persist stops using pre-mutation captured states
			await Promise.all(timersToStop.map(t => 
				this.plugin.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying) {
				await this.plugin.db.update("timers", { is_rotation_running: true }, `id=eq.${parent.id}`);

				const siblings = this.plugin.timers.filter(t => t.parent_id === activeSub.parent_id && t.id !== activeSub.id); // Fixed typo from subtask to activeSub
				await Promise.all(siblings.map(sib => 
					this.plugin.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));

				await this.plugin.db.update("timers", { is_running: true, is_last_active: true, last_started_at: activeSub.last_started_at }, `id=eq.${activeSub.id}`);
			}
			await this.plugin.loadTimers();
			this.render();
		});
	}

	private async addTimer() {
		await this.runWriteAction(async () => {
			const maxSort = this.plugin.timers.filter(t => t.parent_id === null).reduce((max, t) => Math.max(max, t.sort_order || 0), 0);
			const result = await this.plugin.db.insert("timers", {
				name: "New Timer",
				estimate_seconds: 0,
				tracked_seconds: 0,
				is_running: false,
				sort_order: maxSort + 1
			});
			if (Array.isArray(result) && result[0]) this.plugin.timers.push(result[0]);
			this.render();
		});
	}

	private async addSubtask(parent: Timer) {
		await this.runWriteAction(async () => {
			const maxSort = this.plugin.timers.filter(t => t.parent_id === parent.id).reduce((max, t) => Math.max(max, t.sort_order || 0), 0);
			await this.plugin.db.insert("timers", {
				parent_id: parent.id,
				name: "New Subtask",
				estimate_seconds: 0,
				tracked_seconds: 0,
				is_running: false,
				sort_order: maxSort + 1
			});
			await this.plugin.loadTimers();
			this.render();
		});
	}

	private async deleteTimer(timer: Timer) {
		await this.runWriteAction(async () => {
			if (timer.is_running) {
				await this.plugin.db.update("timers", { is_running: false }, `id=eq.${timer.id}`);
			}
			await this.plugin.db.delete("timers", `id=eq.${timer.id}`);
			await this.plugin.loadTimers();
			this.render();
		});
	}

	private async completeAll() {
		if (this.plugin.timers.length === 0) { new Notice("No timers to complete."); return; }
		await this.runWriteAction(async () => {
			await this.stopAllTimers();
			const sessionResult = await this.plugin.db.insert("timer_sessions", {
				date: new Date().toISOString().split("T")[0],
				completed_at: new Date().toISOString(),
			});
			const session = Array.isArray(sessionResult) ? sessionResult[0] : sessionResult;

			if (!session) {
				new Notice("Failed to complete session.");
				return;
			}

			for (const timer of this.plugin.timers) {
				let entryName = timer.name;
				if (timer.parent_id) {
					const parent = this.plugin.timers.find(p => p.id === timer.parent_id);
					if (parent) entryName = `${parent.name} > ${timer.name}`;
				}

				await this.plugin.db.insert("timer_session_entries", {
					session_id: session.id,
					timer_name: entryName,
					estimate_seconds: timer.estimate_seconds,
					tracked_seconds: timer.tracked_seconds,
				});

				// Wipe out segment logs for active trackers on session archive complete
				await this.plugin.db.delete("timer_segments", `timer_id=eq.${timer.id}`);

				await this.plugin.db.update("timers", {
					tracked_seconds: 0,
					estimate_seconds: 0,
					is_running: false,
					is_rotation_running: false,
					is_last_active: false,
					last_started_at: null
				}, `id=eq.${timer.id}`);
			}
			await this.plugin.loadTimers();
			await this.plugin.loadSessions();
			new Notice("Session completed and archived.");
			this.render();
		});
	}

	private async deleteSession(session: Session) {
		try {
			await this.plugin.db.delete("timer_sessions", `id=eq.${session.id}`);
			this.plugin.sessions = this.plugin.sessions.filter(s => s.id !== session.id);
			this.render();
		} catch (e) {
			new Notice("Failed to delete session.");
		}
	}

	private playIcon() {
		return `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
	}
	private pauseIcon() {
		return `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
	}
	private trashIcon() {
		return `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>`;
	}
	private loopIcon() {
		return `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`;
	}
	private plusIcon() {
		return `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
	}

	destroy() {
		this.el.remove();
		this.plugin.floatingWindow = null;
	}

	// ── Cleanup ───────────────────────────────────────────────────────────────

	private injectStyles() {
		const styleId = "pt-styles";
		if (document.getElementById(styleId)) return;
		const style = document.createElement("style");
		style.id = styleId;
		style.textContent = `
			#pt-floating-window {
				display: flex !important;
				flex-direction: column !important;
				background-color: var(--background-primary) !important;
				border: 1px solid var(--background-modifier-border) !important;
				border-radius: 8px !important;
				box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3) !important;
				overflow: hidden !important;
				font-family: var(--font-interface) !important;
				min-width: 380px !important;
				min-height: 300px !important;
				position: fixed !important;
			}
			.pt-titlebar {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 8px 12px;
				background: var(--background-secondary);
				border-bottom: 1px solid var(--background-modifier-border);
				cursor: grab;
				user-select: none;
				flex-shrink: 0;
			}
			.pt-titlebar:active { cursor: grabbing; }
			.pt-titlebar-text {
				font-size: 12px;
				font-weight: 600;
				color: var(--text-muted);
				text-transform: uppercase;
				letter-spacing: 0.06em;
			}
			.pt-titlebar-actions { display: flex; gap: 4px; }
			.pt-titlebar-btn {
				width: 22px;
				height: 22px;
				border-radius: 50%;
				border: none;
				background: var(--background-modifier-border);
				color: var(--text-faint);
				font-size: 10px;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.1s;
			}
			.pt-close-btn:hover { background: var(--color-red); color: white; }
			.pt-body {
				flex: 1;
				overflow-y: auto;
				padding: 12px;
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.pt-actions { display: flex; gap: 6px; flex-wrap: wrap; }
			.pt-rollup {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 8px 12px;
				background: var(--background-secondary);
				border-radius: 6px;
				border-left: 3px solid var(--interactive-accent);
				flex-shrink: 0;
			}
			.pt-rollup-label {
				font-size: 11px;
				font-weight: 600;
				color: var(--text-muted);
				text-transform: uppercase;
				letter-spacing: 0.06em;
			}
			.pt-rollup-right {
				display: flex;
				align-items: center;
				gap: 4px;
				font-size: 13px;
				font-weight: 600;
				font-variant-numeric: tabular-nums;
			}
			.pt-rollup-tracked { color: var(--interactive-accent); }
			.pt-rollup-divider { color: var(--text-faint); }
			.pt-rollup-estimate { color: var(--text-muted); }
			.pt-col-headers {
				display: grid;
				grid-template-columns: 1fr 28px 80px 80px 24px 24px 24px;
				column-gap: 8px;
				padding: 0 10px;
				font-size: 10px;
				font-weight: 600;
				color: var(--text-faint);
				text-transform: uppercase;
				letter-spacing: 0.08em;
			}
			.pt-timer-rows { display: flex; flex-direction: column; gap: 4px; }
			.pt-row {
				display: grid;
				grid-template-columns: 1fr 28px 80px 80px 24px 24px 24px;
				column-gap: 8px;
				align-items: center;
				padding: 7px 10px;
				background: var(--background-primary-alt);
				border-radius: 6px;
				border: 1px solid var(--background-modifier-border);
				transition: border-color 0.15s;
			}
			.pt-row:hover { border-color: var(--background-modifier-border-hover); }
			.pt-row--running {
				border-color: var(--interactive-accent) !important;
				background: var(--background-secondary);
			}
			.pt-row--subtask {
				margin-left: 20px;
				border-left: 3px solid var(--interactive-accent) !important;
				background: var(--background-primary);
			}
			.pt-row[draggable="true"] {
				cursor: grab;
			}
			.pt-row--dragging {
				opacity: 0.45;
				border: 1px dashed var(--interactive-accent) !important;
			}
			.pt-row--drag-over {
				border-top: 2px solid var(--interactive-accent) !important;
				background: var(--background-secondary-alt) !important;
			}
			.pt-modal-add-log {
				background: var(--background-secondary-alt);
				border: 1px solid var(--background-modifier-border);
				border-radius: 6px;
				padding: 12px;
				margin-bottom: 20px;
			}
			.pt-modal-add-log h4 {
				margin-top: 0;
				margin-bottom: 10px;
				font-size: 12px;
				text-transform: uppercase;
				color: var(--text-muted);
			}
			.pt-modal-add-row {
				display: flex;
				gap: 8px;
				align-items: center;
			}
			.pt-modal-add-row input {
				background: var(--background-primary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 4px;
				padding: 4px 8px;
				color: var(--text-normal);
			}
			.pt-modal-logs-list {
				display: flex;
				flex-direction: column;
				gap: 6px;
				max-height: 250px;
				overflow-y: auto;
				border: 1px solid var(--background-modifier-border);
				border-radius: 6px;
				padding: 8px;
				background: var(--background-primary-alt);
			}
			.pt-modal-log-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 8px;
				background: var(--background-primary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 4px;
				padding: 6px 10px;
			}
			.pt-modal-log-row--active {
				border: 1px dashed var(--interactive-accent) !important;
				background: var(--background-secondary-alt) !important;
			}
			.pt-modal-active-label {
				font-size: 11px;
				font-weight: 600;
				color: var(--color-green);
				animation: pt-pulse 2s infinite;
			}
			@keyframes pt-pulse {
				0% { opacity: 0.6; }
				50% { opacity: 1; }
				100% { opacity: 0.6; }
			}
			.pt-modal-log-row input[type="datetime-local"] {
				background: var(--background-secondary-alt);
				border: 1px solid var(--background-modifier-border);
				color: var(--text-normal);
				border-radius: 3px;
				padding: 2px 4px;
				font-size: 11px;
				font-family: var(--font-monospace);
			}
			.pt-modal-to-label {
				font-size: 10px;
				color: var(--text-faint);
				text-transform: uppercase;
			}
			.pt-modal-duration-badge {
				font-family: var(--font-monospace);
				font-weight: 600;
				color: var(--interactive-accent);
				font-size: 11px;
				background: var(--background-secondary-alt);
				padding: 2px 6px;
				border-radius: 3px;
				border: 1px solid var(--background-modifier-border);
			}
			.pt-name {
				font-size: 13px;
				color: var(--text-normal);
				cursor: text;
				outline: none;
				border-radius: 3px;
				padding: 1px 4px;
				min-width: 0;
				display: block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 4px; /* Space guard preventing overlap with the play button */
			}
			.pt-name:focus {
				background: var(--background-modifier-form-field);
				box-shadow: 0 0 0 2px var(--interactive-accent);
			}
			.pt-estimate-input, .pt-tracked-input {
				width: 76px;
				background: var(--background-modifier-form-field);
				border: 1px solid var(--background-modifier-border);
				border-radius: 4px;
				padding: 2px 6px;
				font-size: 12px;
				color: var(--text-muted);
				outline: none;
				font-variant-numeric: tabular-nums;
			}
			.pt-tracked-input {
				color: var(--text-normal);
				font-weight: 600;
				cursor: pointer !important;
				transition: all 0.1s ease;
			}
			.pt-tracked-input:hover {
				border-color: var(--interactive-accent);
				background: var(--background-modifier-border-hover);
			}
			.pt-estimate-input:focus, .pt-tracked-input:focus {
				border-color: var(--interactive-accent);
				color: var(--text-normal);
			}
			.pt-row--running .pt-tracked-input {
				color: var(--interactive-accent);
				border-color: var(--interactive-accent);
			}
			.pt-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				gap: 4px;
				padding: 4px 8px;
				border-radius: 4px;
				border: 1px solid var(--background-modifier-border);
				background: var(--background-secondary);
				color: var(--text-muted);
				font-size: 11px;
				cursor: pointer;
				transition: all 0.1s;
				white-space: nowrap;
			}
			.pt-btn:hover { color: var(--text-normal); border-color: var(--background-modifier-border-hover); }
			.pt-btn--add { color: var(--interactive-accent); border-color: var(--interactive-accent); }
			.pt-btn--add:hover { background: var(--interactive-accent); color: var(--text-on-accent); }
			.pt-btn--complete { color: var(--color-green); border-color: var(--color-green); }
			.pt-btn--complete:hover { background: var(--color-green); color: white; }
			.pt-btn--play, .pt-btn--rotation { width: 26px; height: 26px; padding: 0; }
			.pt-btn--play.pt-btn--active, .pt-btn--rotation.pt-btn--active {
				color: var(--interactive-accent);
				border-color: var(--interactive-accent);
			}
			.pt-btn-del-seg {
				background: none;
				border: none;
				color: var(--text-faint);
				cursor: pointer;
				padding: 0;
				font-size: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 16px;
				height: 16px;
				border-radius: 50%;
				transition: all 0.1s;
			}
			.pt-btn-del-seg:hover {
				background: var(--background-modifier-border-hover);
				color: var(--color-red);
			}
			.pt-btn--delete {
				width: 22px; height: 22px; padding: 0;
				color: var(--text-faint);
				border-color: transparent;
				background: transparent;
			}
			.pt-btn--delete:hover { color: var(--color-red); border-color: var(--color-red); background: transparent; }
			.pt-btn--add-subtask {
				width: 22px; height: 22px; padding: 0;
				color: var(--interactive-accent);
				border-color: transparent;
				background: transparent;
			}
			.pt-btn--add-subtask:hover { border-color: var(--interactive-accent); background: transparent; }
			.pt-archive { margin-top: 4px; }
			.pt-archive-title {
				font-size: 10px;
				font-weight: 600;
				color: var(--text-faint);
				text-transform: uppercase;
				letter-spacing: 0.08em;
				margin: 0 0 6px;
			}
			.pt-session {
				margin-bottom: 8px;
				background: var(--background-primary-alt);
				border-radius: 6px;
				overflow: hidden;
				border: 1px solid var(--background-modifier-border);
			}
			.pt-session-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 5px 10px;
				background: var(--background-secondary);
				border-bottom: 1px solid var(--background-modifier-border);
			}
			.pt-session-date { font-size: 11px; font-weight: 600; color: var(--text-muted); }
			.pt-session-entry {
				display: flex;
				align-items: center;
				gap: 6px;
				padding: 5px 10px;
				font-size: 12px;
				border-bottom: 1px solid var(--background-modifier-border);
			}
			.pt-session-entry:last-child { border-bottom: none; }
			.pt-session-name { flex: 1; color: var(--text-normal); }
			.pt-session-tracked { font-weight: 600; color: var(--interactive-accent); font-variant-numeric: tabular-nums; }
			.pt-session-divider { color: var(--text-faint); }
			.pt-session-estimate { color: var(--text-muted); font-variant-numeric: tabular-nums; }
			.pt-empty { font-size: 12px; color: var(--text-faint); text-align: center; padding: 12px; }
			.pt-resize-handle {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 16px;
				height: 16px;
				cursor: nwse-resize;
				background: linear-gradient(135deg, transparent 50%, var(--background-modifier-border) 50%);
				border-bottom-right-radius: 8px;
			}
			.pt-resize-handle:hover {
				background: linear-gradient(135deg, transparent 50%, var(--interactive-accent) 50%);
			}
		`;
		document.head.appendChild(style);
	}
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

class ProductivityTimerSettingsTab extends PluginSettingTab {
	plugin: ProductivityTimerPlugin;

	constructor(app: App, plugin: ProductivityTimerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Productivity Timer" });

		new Setting(containerEl)
			.setName("Supabase URL")
			.setDesc("Your project URL (e.g. https://xxxx.supabase.co)")
			.addText(text => text
				.setPlaceholder("https://xxxx.supabase.co")
				.setValue(this.plugin.settings.supabaseUrl)
				.onChange(async (value) => {
					this.plugin.settings.supabaseUrl = value.trim();
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Supabase Publishable Key")
			.setDesc("Your anon/publishable key")
			.addText(text => text
				.setPlaceholder("sb_publishable_...")
				.setValue(this.plugin.settings.supabaseKey)
				.onChange(async (value) => {
					this.plugin.settings.supabaseKey = value.trim();
					await this.plugin.saveSettings();
				}));
	}
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default class ProductivityTimerPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	floatingWindow: ProductivityTimerWindow | null = null;
	db: SupabaseClient;
	timers: Timer[] = [];
	sessions: Session[] = [];
	statusBarEl: HTMLElement;
	bgTickInterval: number | null = null;
	isWriting = false;
	public lastWriteTimes: Map<string, { is_running: boolean, last_started_at: string | null, tracked_seconds: number, time: number }> = new Map();
	private rotationOverlay: HTMLElement | null = null;
	private overlayKeydownListener: ((e: KeyboardEvent) => void) | null = null;

	async onload() {
		await this.loadSettings();
		this.db = new SupabaseClient(this.settings.supabaseUrl, this.settings.supabaseKey);
		this.statusBarEl = this.addStatusBarItem();
		this.statusBarEl.classList.add("pt-status-bar-item");

		this.addCommand({
			id: "open-productivity-timer",
			name: "Open/Close Productivity Timer",
			callback: () => this.toggleWindow(),
		});

		this.addSettingTab(new ProductivityTimerSettingsTab(this.app, this));

		this.injectGlobalStyles();
		this.startBackgroundTick();

		// Move Realtime WebSocket listener to Plugin level so background sync always runs
		if (this.settings.supabaseUrl && this.settings.supabaseKey) {
			this.db.subscribeToTable("timers", (payload) => {
				if (this.floatingWindow && this.floatingWindow.isWriting) return;

				const eventType = payload.eventType || payload.event || "UPDATE";

				this.loadTimers().then(() => {
					if (this.floatingWindow) {
						if (eventType === "INSERT" || eventType === "DELETE") {
							this.floatingWindow.render();
						} else {
							this.floatingWindow.renderTimerRowsOnly();
						}
					}
					this.updateStatusBar();
				});
			});
		}
	}

	onunload() {
		if (this.floatingWindow) {
			this.floatingWindow.destroy();
			this.floatingWindow = null;
		}
		if (this.bgTickInterval) {
			window.clearInterval(this.bgTickInterval);
			this.bgTickInterval = null;
		}
		if (this.rotationOverlay) {
			this.rotationOverlay.remove();
			this.rotationOverlay = null;
		}
		if (this.overlayKeydownListener) {
			window.removeEventListener("keydown", this.overlayKeydownListener, true);
			this.overlayKeydownListener = null;
		}
		const style = document.getElementById("pt-styles");
		if (style) style.remove();
		const globalStyle = document.getElementById("pt-global-styles");
		if (globalStyle) globalStyle.remove();
		this.db.disconnect();
	}

	private injectGlobalStyles() {
		const styleId = "pt-global-styles";
		if (document.getElementById(styleId)) return;
		const style = document.createElement("style");
		style.id = styleId;
		style.textContent = `
			.pt-status-bar-item {
				order: 999999 !important;
				padding-left: 4px !important;
				padding-right: 4px !important;
				margin: 0 !important;
			}
		`;
		document.head.appendChild(style);
	}

	private startBackgroundTick() {
		if (this.bgTickInterval) window.clearInterval(this.bgTickInterval);

		this.loadTimers().then(() => {
			if (this.floatingWindow) this.floatingWindow.render();
			this.updateStatusBar();
		});

		this.bgTickInterval = window.setInterval(async () => {
			const running = this.timers.find(t => t.is_running);
			if (running) {
				const trueSeconds = this.getActiveTrackedSeconds(running);
				if (running.visual_seconds === undefined) {
					running.visual_seconds = trueSeconds;
				} else {
					running.visual_seconds += 1;
				}
			}

			// 1. Tell window to update clock elements inline
			if (this.floatingWindow) {
				this.floatingWindow.renderTimerRowsOnly();
			}

			// 2. Perform rotation swaps in the background
			await this.checkSubtaskRotation();

			// 3. Update the Obsidian status bar
			this.updateStatusBar();
		}, 1000);
	}

	public async checkSubtaskRotation() {
		const running = this.timers.find(t => t.is_running);
		if (!running || running.parent_id === null) return;

		const parent = this.timers.find(t => t.id === running.parent_id);
		if (!parent || !parent.is_rotation_running || running.estimate_seconds <= 0 || !running.last_started_at) return;

		const activeTracked = this.getActiveTrackedSeconds(running);
		const currentMultiple = Math.floor(activeTracked / running.estimate_seconds);
		const startMultiple = Math.floor(running.tracked_seconds / running.estimate_seconds);

		if (currentMultiple > startMultiple) {
			const sibs = this.timers.filter(t => t.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order);
			if (sibs.length > 1) {
				const idx = sibs.findIndex(t => t.id === running.id);
				const nextIdx = (idx + 1) % sibs.length;
				const nextSubtask = sibs[nextIdx];

				if (nextSubtask) {
					const nextNow = new Date().toISOString();
					const localStart = running.last_started_at;
					
					// To prevent browser-drift truncation (e.g. 29s), we align the duration 
					// directly with the visual_seconds value that triggered the threshold switch
					const finalTracked = running.visual_seconds !== undefined ? running.visual_seconds : activeTracked;
					const localDur = finalTracked - running.tracked_seconds;

					if (localDur > 0) {
						running.segments = running.segments || [];
						running.segments.push({
							id: `temp-${Date.now()}`,
							timer_id: running.id,
							started_at: localStart,
							ended_at: nextNow,
							duration_seconds: localDur
						});
					}

					// Optimistically pause current subtask in memory
					running.is_running = false;
					running.is_last_active = false;
					running.tracked_seconds = finalTracked;
					running.last_started_at = null;

					// Optimistically play next subtask in memory
					nextSubtask.is_running = true;
					nextSubtask.is_last_active = true;
					nextSubtask.last_started_at = nextNow;

					if (this.floatingWindow) {
						this.floatingWindow.render();
					}

					// Trigger the fullscreen rotation alert overlay optimistically
					this.showRotationOverlay(nextSubtask);

					// Sync the state changes to Supabase in the background
					try {
						await this.db.insert("timer_segments", {
							timer_id: running.id,
							started_at: localStart,
							ended_at: nextNow,
							duration_seconds: localDur
						});

						await Promise.all([
							this.db.update("timers", { is_running: false, is_last_active: false, tracked_seconds: finalTracked, last_started_at: null }, `id=eq.${running.id}`),
							this.db.update("timers", { is_running: true, is_last_active: true, last_started_at: nextNow }, `id=eq.${nextSubtask.id}`)
						]);

						await this.loadTimers();
						if (this.floatingWindow) {
							this.floatingWindow.render();
						}
					} catch (e) {
						console.error("Background subtask rotation failed:", e);
					}
				}
			}
		}
	}

	private showRotationOverlay(nextSubtask: Timer) {
		// Prevent duplicate overlays
		if (this.rotationOverlay) {
			this.rotationOverlay.remove();
		}
		if (this.overlayKeydownListener) {
			window.removeEventListener("keydown", this.overlayKeydownListener, true);
		}

		// Create full-screen dimmed container
		const overlay = document.createElement("div");
		overlay.id = "pt-rotation-overlay";
		Object.assign(overlay.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100vw",
			height: "100vh",
			backgroundColor: "rgba(0, 0, 0, 0.88)",
			zIndex: "9999",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			fontFamily: "var(--font-interface)",
			color: "var(--text-normal)"
		});

		const label = overlay.createDiv({ cls: "pt-overlay-label" });
		
		const spanEl = label.createEl("span", { 
			text: "UP NEXT:"
		});
		spanEl.style.cssText = "font-size: 13px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; display: block; text-align: center;";

		const h1El = label.createEl("h1", { 
			text: nextSubtask.name
		});
		h1El.style.cssText = "font-size: 34px; font-weight: 700; color: var(--interactive-accent); margin: 0; text-align: center;";

		const pEl = overlay.createEl("p", { 
			text: "Press [ Ctrl + Space ] to acknowledge"
		});
		pEl.style.cssText = "font-size: 11px; color: var(--text-muted); margin-top: 36px; text-transform: uppercase; letter-spacing: 0.05em;";

		document.body.appendChild(overlay);
		this.rotationOverlay = overlay;

		// Shift focus away from writing workspace so key inputs don't bleed
		const activeEl = document.activeElement as HTMLElement;
		if (activeEl) activeEl.blur();

		// Specific key listener capturing phase to prevent Neovim/Vim intercepting Ctrl + Space
		this.overlayKeydownListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && (e.code === "Space" || e.key === " ")) {
				e.preventDefault();
				e.stopPropagation();
				
				// Cleanup
				if (this.rotationOverlay) {
					this.rotationOverlay.remove();
					this.rotationOverlay = null;
				}
				if (this.overlayKeydownListener) {
					window.removeEventListener("keydown", this.overlayKeydownListener, true);
					this.overlayKeydownListener = null;
				}
			}
		};

		window.addEventListener("keydown", this.overlayKeydownListener, true);
	}

	private updateStatusBar() {
		const running = this.timers.find(t => t.is_running);
		if (!running) {
			this.statusBarEl.setText(""); // Keep status bar clean when idle
			return;
		}

		const activeTracked = this.getActiveTrackedSeconds(running);

		// Determine if a subtask is running inside a rotation
		const isSubtask = running.parent_id !== null;
		const parent = isSubtask ? this.timers.find(t => t.id === running.parent_id) : null;
		const isRotationActive = parent ? parent.is_rotation_running : false;

		if (isSubtask && isRotationActive && running.estimate_seconds > 0) {
			// Calculate time left until the next multiple of the estimate_seconds is reached
			const currentElapsedInBlock = activeTracked % running.estimate_seconds;
			const timeLeft = running.estimate_seconds - currentElapsedInBlock;

			// Time of switch clock display (e.g. 12:48 AM)
			const switchTimeEpoch = Date.now() + (timeLeft * 1000);
			const switchDate = new Date(switchTimeEpoch);
			const switchTimeStr = switchDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

			this.statusBarEl.setText(`[${running.name} : ${this.formatTime(timeLeft)} : ${switchTimeStr}]`);
		} else {
			// If it's a standard timer or no rotation is active, show status text
			this.statusBarEl.setText(`[${running.name} : ${this.formatTime(activeTracked)}]`);
		}
	}

	public getActiveTrackedSeconds(timer: Timer): number {
		if (timer.is_running && timer.last_started_at) {
			const elapsed = Math.floor((Date.now() - new Date(timer.last_started_at).getTime()) / 1000);
			const trueSeconds = timer.tracked_seconds + Math.max(0, elapsed);

			// Adaptive visual timer: Snaps back to true database-time if drift is larger than 2 seconds
			if (timer.visual_seconds === undefined) {
				timer.visual_seconds = trueSeconds;
			} else {
				const diff = Math.abs(timer.visual_seconds - trueSeconds);
				if (diff >= 2) {
					timer.visual_seconds = trueSeconds;
				}
			}
			return timer.visual_seconds;
		}
		
		timer.visual_seconds = undefined;
		return timer.tracked_seconds;
	}

	public totalEstimate(): number {
		const rendered = this.getFlattenedRenderedTimers();
		return rendered.reduce((sum, t) => sum + t.estimate_seconds, 0);
	}

	public totalTracked(): number {
		const rendered = this.getFlattenedRenderedTimers();
		return rendered.reduce((sum, t) => sum + this.getActiveTrackedSeconds(t), 0);
	}

	private getFlattenedRenderedTimers(): Timer[] {
		const list: Timer[] = [];
		const parents = this.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			list.push(parent);
			const subtasks = this.timers.filter(t => t.parent_id === parent.id);
			for (const sub of subtasks) {
				list.push(sub);
			}
		}
		return list;
	}

	public async loadTimers() {
		try {
			const dbTimers: Timer[] = await this.db.select("timers", "order=sort_order.asc,created_at.asc");
			let dbSegments: TimerSegment[] = [];
			try {
				dbSegments = await this.db.select("timer_segments", "order=started_at.asc");
			} catch (e) {
				console.error("Failed to load segments", e);
			}
			
			// Database self-healing: Find subtasks with invalid parent_ids and delete them
			const parentIds = dbTimers.filter(t => t.parent_id === null).map(t => t.id);
			const orphans = dbTimers.filter(t => t.parent_id !== null && !parentIds.includes(t.parent_id));
			if (orphans.length > 0) {
				for (const orphan of orphans) {
					await this.db.delete("timers", `id=eq.${orphan.id}`);
					// Also clean up any segments belonging to orphans
					await this.db.delete("timer_segments", `timer_id=eq.${orphan.id}`);
				}
				// Reload timers to ensure clean memory sync
				await this.loadTimers();
				return;
			}
			
			// Safe Central Sync: merges database list
			const localRunning = this.timers.find(t => t.is_running);
			this.timers = dbTimers.map(dbTimer => {
				const segments = dbSegments.filter(s => s.timer_id === dbTimer.id);
				
				if (localRunning && dbTimer.id === localRunning.id) {
					if (!dbTimer.is_running) {
						return { ...dbTimer, segments }; // Honour pause event triggered on another client
					}
					return {
						...dbTimer,
						tracked_seconds: Math.max(dbTimer.tracked_seconds, localRunning.tracked_seconds),
						visual_seconds: localRunning.visual_seconds, // Prevent visual ticking snapping during reloads
						segments
					};
				}
				return { ...dbTimer, segments };
			});
		} catch {
			console.error("Productivity Timer: failed to load timers.");
		}
	}

	public async loadSessions() {
		try {
			const sessionRows = await this.db.select("timer_sessions", "order=completed_at.desc&limit=30");
			const entries = await this.db.select("timer_session_entries", "");
			this.sessions = sessionRows.map((s: any) => ({
				...s,
				entries: entries.filter((e: any) => e.session_id === s.id),
			}));
		} catch {}
	}

	private toggleWindow() {
		if (this.floatingWindow) {
			this.floatingWindow.destroy();
			this.floatingWindow = null;
			return;
		}
		if (!this.settings.supabaseUrl || !this.settings.supabaseKey) {
			new Notice("Productivity Timer: set your Supabase URL and key in settings first.");
			return;
		}
		this.floatingWindow = new ProductivityTimerWindow(this);
	}

	public formatTime(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
		if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
		return `${s}s`;
	}

	public parseTimeInput(input: string): number | null {
		input = input.trim().toLowerCase();
		if (!input) return 0;
		const hm = input.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/);
		if (hm && (hm[1] || hm[2] || hm[3])) {
			return parseInt(hm[1] || "0") * 3600 + parseInt(hm[2] || "0") * 60 + parseInt(hm[3] || "0");
		}
		const num = parseInt(input);
		if (!isNaN(num)) return num * 60;
		return null;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
