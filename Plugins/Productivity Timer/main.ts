import { App, Plugin, PluginSettingTab, Setting, Notice } from "obsidian";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Floating Window ─────────────────────────────────────────────────────────

class ProductivityTimerWindow {
	private plugin: ProductivityTimerPlugin;
	private db: SupabaseClient;
	private el: HTMLElement;
	private timers: Timer[] = [];
	private sessions: Session[] = [];
	private tickInterval: number | null = null;
	private showArchive = false;

	// Locks and sync guards to prevent race conditions
	private isWriting = false;
	private lastSyncTime = Date.now();
	private lastWriteTimes: Map<string, { is_running: boolean, last_started_at: string | null, tracked_seconds: number, time: number }> = new Map();
	
	// Global temporal Notice guard shared across reloading instances
	static activeNotices = new Set<string>();

	// Drag state
	private isDragging = false;
	private dragOffsetX = 0;
	private dragOffsetY = 0;

	// Resize state
	private isResizing = false;
	private resizeStartX = 0;
	private resizeStartY = 0;
	private resizeStartW = 0;
	private resizeStartH = 0;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
		this.db = new SupabaseClient(plugin.settings.supabaseUrl, plugin.settings.supabaseKey);
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
		await this.loadTimers();
		await this.loadSessions();
		this.render();
		this.startTick();
		this.db.subscribeToTable("timers", () => {
			if (this.isWriting) return; // Ignore events triggered by local transition writes to prevent overwrites

			// Focus Protection: Do not wipe out DOM elements or re-render if user is editing or focusing inside the window
			const activeEl = document.activeElement;
			if (activeEl && this.el.contains(activeEl)) return;

			this.loadTimers().then(() => this.render());
		});
	}

	private getActiveTrackedSeconds(timer: Timer): number {
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

	private async runWriteAction(action: () => Promise<void>) {
		this.isWriting = true;
		try {
			await action();
		} catch (e) {
			console.error("Write action failed:", e);
		} finally {
			// Keeping a debounce ensures reflected WebSocket events have completed and been swallowed
			setTimeout(() => {
				this.isWriting = false;
			}, 800);
		}
	}

	private showDeduplicatedNotice(text: string) {
		const globalNotices = (window as any).ptActiveNotices = (window as any).ptActiveNotices || new Set<string>();
		const now = Date.now();
		const lastTime = (window as any).ptLastNoticeTime || 0;

		// 1. Text-based exact duplicate check
		if (globalNotices.has(text)) return;

		// 2. Strict system-wide cooldown check (Prevents double notices on rapid lag rotation skips)
		if (now - lastTime < 2500) return;

		globalNotices.add(text);
		(window as any).ptLastNoticeTime = now;
		new Notice(text);

		window.setTimeout(() => {
			globalNotices.delete(text);
		}, 3000);
	}

	private startTick() {
		// Clean up any old developer reload background intervals
		if ((window as any).ptTickInterval) {
			window.clearInterval((window as any).ptTickInterval);
			(window as any).ptTickInterval = null;
		}

		this.tickInterval = window.setInterval(async () => {
			const running = this.timers.find(t => t.is_running);
			if (running) {
				// Smooth Visual Increment: keeps visual ticking skip-free by incrementing precisely by 1s
				const trueSeconds = this.getActiveTrackedSeconds(running);
				if (running.visual_seconds === undefined) {
					running.visual_seconds = trueSeconds;
				} else {
					running.visual_seconds += 1;
				}
			}

			// 1. Immediately update visual elements (0ms latency, perfectly smooth)
			this.renderTimerRowsOnly();

			// 2. Perform background checks without blocking the visual loop
			const now = Date.now();
			if (now - this.lastSyncTime >= 5000) {
				this.lastSyncTime = now;
				this.syncActiveTimer(); // Fire-and-forget background database sync
			}

			this.checkSubtaskRotation(); // Fire-and-forget background subtask rotation swapper
		}, 1000);

		(window as any).ptTickInterval = this.tickInterval;
	}

	private async syncActiveTimer() {
		const running = this.timers.find(t => t.is_running);
		if (!running) return;

		const activeTracked = this.getActiveTrackedSeconds(running);
		const currentNow = new Date().toISOString();

		// Record the local write state to prevent intermediate database reloads from causing lag reverts
		this.lastWriteTimes.set(running.id, {
			is_running: true,
			last_started_at: currentNow,
			tracked_seconds: activeTracked,
			time: Date.now()
		});

		running.tracked_seconds = activeTracked;
		running.last_started_at = currentNow;

		await this.safeDbUpdate({ tracked_seconds: activeTracked, last_started_at: currentNow }, `id=eq.${running.id}`);
	}

	private async checkSubtaskRotation() {
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
					// Prepare next-now timestamp
					const nextNow = new Date().toISOString();

					// Optimistically pause current subtask in memory
					running.is_running = false;
					running.is_last_active = false;
					running.tracked_seconds = activeTracked;
					running.last_started_at = null;

					// Optimistically play next subtask in memory
					nextSubtask.is_running = true;
					nextSubtask.is_last_active = true;
					nextSubtask.last_started_at = nextNow;

					// Record local write cache values to block stale reloads during transitions
					this.lastWriteTimes.set(running.id, {
						is_running: false,
						last_started_at: null,
						tracked_seconds: activeTracked,
						time: Date.now()
					});
					this.lastWriteTimes.set(nextSubtask.id, {
						is_running: true,
						last_started_at: nextNow,
						tracked_seconds: nextSubtask.tracked_seconds,
						time: Date.now()
					});

					// Render local switch instantly
					this.render();

					// Sync the state changes to Supabase in the background
					await this.runWriteAction(async () => {
						await Promise.all([
							this.db.update("timers", { is_running: false, is_last_active: false, tracked_seconds: activeTracked, last_started_at: null }, `id=eq.${running.id}`),
							this.db.update("timers", { is_running: true, is_last_active: true, last_started_at: nextNow }, `id=eq.${nextSubtask.id}`)
						]);

						this.showDeduplicatedNotice(`Switched to subtask: ${nextSubtask.name}`);
						await this.loadTimers();
						this.render();
					});
				}
			}
		}
	}

	private async safeDbUpdate(data: any, match: string) {
		try {
			await this.db.update("timers", data, match);
		} catch (e) {
			// Silent background logger prevents popping notices on periodic internet drops
			console.error("Database Background Sync Failed:", e);
		}
	}

	private stopTick() {
		if (this.tickInterval !== null) {
			window.clearInterval(this.tickInterval);
			this.tickInterval = null;
		}
		if ((window as any).ptTickInterval) {
			window.clearInterval((window as any).ptTickInterval);
			(window as any).ptTickInterval = null;
		}
	}

	private async loadTimers() {
		try {
			const dbTimers: Timer[] = await this.db.select("timers", "order=sort_order.asc,created_at.asc");
			
			// Safe Local Sync: merges database list, using local write maps to ignore lagging database values
			const localRunning = this.timers.find(t => t.is_running);
			this.timers = dbTimers.map(dbTimer => {
				const localWrite = this.lastWriteTimes.get(dbTimer.id);
				
				// If a timer was edited locally less than 3 seconds ago, ignore lagging DB state values
				if (localWrite && Date.now() - localWrite.time < 3000) {
					return {
						...dbTimer,
						is_running: localWrite.is_running,
						last_started_at: localWrite.last_started_at,
						tracked_seconds: localWrite.tracked_seconds
					};
				}

				if (localRunning && dbTimer.id === localRunning.id) {
					if (!dbTimer.is_running) {
						return dbTimer; // Honour pause event triggered on another client
					}
					return {
						...dbTimer,
						tracked_seconds: Math.max(dbTimer.tracked_seconds, localRunning.tracked_seconds)
					};
				}
				return dbTimer;
			});
		} catch {
			new Notice("Productivity Timer: failed to load. Check settings.");
		}
	}

	private async loadSessions() {
		try {
			const sessionRows = await this.db.select("timer_sessions", "order=completed_at.desc&limit=30");
			const entries = await this.db.select("timer_session_entries", "");
			this.sessions = sessionRows.map((s: any) => ({
				...s,
				entries: entries.filter((e: any) => e.session_id === s.id),
			}));
		} catch {}
	}

	private formatTime(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
		if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
		return `${s}s`;
	}

	private formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	}

	private totalEstimate(): number {
		return this.timers.reduce((sum, t) => sum + t.estimate_seconds, 0);
	}

	private totalTracked(): number {
		return this.timers.reduce((sum, t) => sum + this.getActiveTrackedSeconds(t), 0);
	}

	private parseTimeInput(input: string): number | null {
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

	private getTimerDisplayTimes(timer: Timer) {
		if (timer.parent_id !== null) {
			return {
				tracked: this.getActiveTrackedSeconds(timer),
				estimate: timer.estimate_seconds
			};
		} else {
			const subtasks = this.timers.filter(t => t.parent_id === timer.id);
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

	private renderTimerRowsOnly() {
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
		if (rollupTracked) rollupTracked.textContent = this.formatTime(this.totalTracked());
	}

	private render() {
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
		rollupRight.createEl("span", { cls: "pt-rollup-tracked", text: this.formatTime(this.totalTracked()) });
		rollupRight.createEl("span", { cls: "pt-rollup-divider", text: "/" });
		rollupRight.createEl("span", { cls: "pt-rollup-estimate", text: this.formatTime(this.totalEstimate()) });

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
			if (this.sessions.length === 0) {
				archive.createEl("p", { cls: "pt-empty", text: "No completed sessions yet." });
			}
			for (const session of this.sessions) {
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
		const parents = this.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			this.renderRow(container, parent);
			const subtasks = this.timers.filter(t => t.parent_id === parent.id);
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

		// 1. Name
		const nameEl = row.createEl("span", { cls: "pt-name", text: timer.name });
		nameEl.contentEditable = "true";
		nameEl.addEventListener("blur", async () => {
			const newName = nameEl.textContent?.trim();
			if (newName && newName !== timer.name) {
				await this.runWriteAction(async () => {
					await this.db.update("timers", { name: newName }, `id=eq.${timer.id}`);
					timer.name = newName;
					await this.loadTimers();
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
		const { tracked, estimate, sumTracked, sumEstimate } = this.getTimerDisplayTimes(timer);

		// 3. Tracked Time Input
		const trackedInput = row.createEl("input", { cls: "pt-tracked-input", type: "text" });
		trackedInput.value = tracked > 0 ? this.formatTime(tracked) : "0s";
		trackedInput.placeholder = "0s";
		trackedInput.addEventListener("blur", async () => {
			const parsed = this.parseTimeInput(trackedInput.value);
			if (parsed !== null) {
				await this.runWriteAction(async () => {
					const nowStr = new Date().toISOString();
					
					if (isSubtask) {
						timer.tracked_seconds = parsed;
						if (timer.is_running) {
							timer.last_started_at = nowStr;
						}
						this.lastWriteTimes.set(timer.id, {
							is_running: timer.is_running,
							last_started_at: timer.is_running ? nowStr : null,
							tracked_seconds: parsed,
							time: Date.now()
						});
						if (timer.is_running) {
							await this.db.update("timers", { tracked_seconds: parsed, last_started_at: nowStr }, `id=eq.${timer.id}`);
						} else {
							await this.db.update("timers", { tracked_seconds: parsed }, `id=eq.${timer.id}`);
						}
					} else {
						const newParentTracked = Math.max(0, parsed - (sumTracked || 0));
						timer.tracked_seconds = newParentTracked;
						if (timer.is_running) {
							timer.last_started_at = nowStr;
						}
						this.lastWriteTimes.set(timer.id, {
							is_running: timer.is_running,
							last_started_at: timer.is_running ? nowStr : null,
							tracked_seconds: newParentTracked,
							time: Date.now()
						});
						if (timer.is_running) {
							await this.db.update("timers", { tracked_seconds: newParentTracked, last_started_at: nowStr }, `id=eq.${timer.id}`);
						} else {
							await this.db.update("timers", { tracked_seconds: newParentTracked }, `id=eq.${timer.id}`);
						}
					}
					await this.loadTimers();
					const { tracked: latestTracked } = this.getTimerDisplayTimes(timer);
					trackedInput.value = latestTracked > 0 ? this.formatTime(latestTracked) : "0s";
				});
			}
		});
		trackedInput.addEventListener("keydown", (e) => { if (e.key === "Enter") trackedInput.blur(); });

		// 4. Estimate Time Input
		const estimateInput = row.createEl("input", { cls: "pt-estimate-input", type: "text" });
		estimateInput.value = estimate > 0 ? this.formatTime(estimate) : "";
		estimateInput.placeholder = "0h 00m";
		estimateInput.addEventListener("blur", async () => {
			const parsed = this.parseTimeInput(estimateInput.value);
			if (parsed !== null) {
				await this.runWriteAction(async () => {
					if (isSubtask) {
						if (parsed !== timer.estimate_seconds) {
							timer.estimate_seconds = parsed;
							await this.db.update("timers", { estimate_seconds: parsed }, `id=eq.${timer.id}`);
						}
					} else {
						const newParentEstimate = Math.max(0, parsed - (sumEstimate || 0));
						if (newParentEstimate !== timer.estimate_seconds) {
							timer.estimate_seconds = newParentEstimate;
							await this.db.update("timers", { estimate_seconds: newParentEstimate }, `id=eq.${timer.id}`);
						}
					}
					await this.loadTimers();
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
		const subtasks = this.timers.filter(t => t.parent_id === timer.id);
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

	// ── Timer Actions ─────────────────────────────────────────────────────────

	private async stopAllTimers() {
		for (const t of this.timers) {
			let changed = false;
			const updateObj: any = {};
			if (t.is_running) {
				const finalTracked = this.getActiveTrackedSeconds(t);
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
				await this.db.update("timers", updateObj, `id=eq.${t.id}`);
			}
		}
	}

	private async playParent(parent: Timer) {
		const isPlaying = !parent.is_running;
		const timersToStop = this.timers.filter(t => t.is_running || t.is_rotation_running);

		// 1. Calculate final tracked seconds for stopped timers (captured before local state mutations)
		for (const t of timersToStop) {
			t.tracked_seconds = this.getActiveTrackedSeconds(t);
		}

		// 2. Optimistic Local update (0ms delay instant UI transition)
		for (const t of timersToStop) {
			t.is_running = false;
			t.is_rotation_running = false;
			t.last_started_at = null;
			this.lastWriteTimes.set(t.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: t.tracked_seconds,
				time: Date.now()
			});
		}

		if (isPlaying) {
			parent.is_running = true;
			parent.last_started_at = new Date().toISOString();
			this.lastWriteTimes.set(parent.id, {
				is_running: true,
				last_started_at: parent.last_started_at,
				tracked_seconds: parent.tracked_seconds,
				time: Date.now()
			});
		}

		this.render();

		// 3. Background Database Persistence
		await this.runWriteAction(async () => {
			// Persist stops using pre-mutation captured states
			await Promise.all(timersToStop.map(t => 
				this.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying) {
				await this.db.update("timers", { is_running: true, last_started_at: parent.last_started_at }, `id=eq.${parent.id}`);
			}
			await this.loadTimers();
			this.render();
		});
	}

	private async playSubtaskDirectly(subtask: Timer) {
		const isPlaying = !subtask.is_running;
		const timersToStop = this.timers.filter(t => t.is_running || t.is_rotation_running);

		// 1. Calculate final tracked seconds for stopped timers (captured before local state mutations)
		for (const t of timersToStop) {
			t.tracked_seconds = this.getActiveTrackedSeconds(t);
		}

		// 2. Optimistic Local update (0ms delay instant UI transition)
		for (const t of timersToStop) {
			t.is_running = false;
			t.is_rotation_running = false;
			t.last_started_at = null;
			this.lastWriteTimes.set(t.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: t.tracked_seconds,
				time: Date.now()
			});
		}

		if (isPlaying) {
			subtask.is_running = true;
			subtask.is_last_active = true;
			subtask.last_started_at = new Date().toISOString();
			this.lastWriteTimes.set(subtask.id, {
				is_running: true,
				last_started_at: subtask.last_started_at,
				tracked_seconds: subtask.tracked_seconds,
				time: Date.now()
			});

			const siblings = this.timers.filter(t => t.parent_id === subtask.parent_id && t.id !== subtask.id);
			for (const sib of siblings) {
				sib.is_last_active = false;
			}
		}

		this.render();

		// 3. Background Database Save
		await this.runWriteAction(async () => {
			// Persist stops using pre-mutation captured states
			await Promise.all(timersToStop.map(t => 
				this.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying) {
				await this.db.update("timers", { is_running: true, is_last_active: true, last_started_at: subtask.last_started_at }, `id=eq.${subtask.id}`);

				const siblings = this.timers.filter(t => t.parent_id === subtask.parent_id && t.id !== subtask.id);
				await Promise.all(siblings.map(sib => 
					this.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));
			}
			await this.loadTimers();
			this.render();
		});
	}

	private async toggleRotation(parent: Timer) {
		const subtasks = this.timers.filter(t => t.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order);
		if (subtasks.length === 0) {
			new Notice("Add subtasks first before starting rotation.");
			return;
		}
		const isPlaying = !parent.is_rotation_running;
		const timersToStop = this.timers.filter(t => t.is_running || t.is_rotation_running);

		// 1. Calculate final tracked seconds for stopped timers (captured before local state mutations)
		for (const t of timersToStop) {
			t.tracked_seconds = this.getActiveTrackedSeconds(t);
		}

		// 2. Optimistic Local update (0ms delay instant UI transition)
		for (const t of timersToStop) {
			t.is_running = false;
			t.is_rotation_running = false;
			t.last_started_at = null;
			this.lastWriteTimes.set(t.id, {
				is_running: false,
				last_started_at: null,
				tracked_seconds: t.tracked_seconds,
				time: Date.now()
			});
		}

		const activeSub = subtasks.find(t => t.is_last_active) || subtasks[0];
		if (isPlaying && activeSub) {
			parent.is_rotation_running = true;
			this.lastWriteTimes.set(parent.id, {
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
			activeSub.last_started_at = new Date().toISOString();
			this.lastWriteTimes.set(activeSub.id, {
				is_running: true,
				last_started_at: activeSub.last_started_at,
				tracked_seconds: activeSub.tracked_seconds,
				time: Date.now()
			});
		}

		this.render();

		// 3. Background Database Persistence
		await this.runWriteAction(async () => {
			// Persist stops using pre-mutation captured states
			await Promise.all(timersToStop.map(t => 
				this.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying && activeSub) {
				await this.db.update("timers", { is_rotation_running: true }, `id=eq.${parent.id}`);

				const siblings = subtasks.filter(sub => sub.id !== activeSub.id);
				await Promise.all(siblings.map(sib => 
					this.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));

				await this.db.update("timers", { is_running: true, is_last_active: true, last_started_at: activeSub.last_started_at }, `id=eq.${activeSub.id}`);
			}
			await this.loadTimers();
			this.render();
		});
	}

	private async addTimer() {
		await this.runWriteAction(async () => {
			const maxSort = this.timers.filter(t => t.parent_id === null).reduce((max, t) => Math.max(max, t.sort_order || 0), 0);
			const result = await this.db.insert("timers", {
				name: "New Timer",
				estimate_seconds: 0,
				tracked_seconds: 0,
				is_running: false,
				sort_order: maxSort + 1
			});
			if (Array.isArray(result) && result[0]) this.timers.push(result[0]);
			this.render();
		});
	}

	private async addSubtask(parent: Timer) {
		await this.runWriteAction(async () => {
			const maxSort = this.timers.filter(t => t.parent_id === parent.id).reduce((max, t) => Math.max(max, t.sort_order || 0), 0);
			await this.db.insert("timers", {
				parent_id: parent.id,
				name: "New Subtask",
				estimate_seconds: 0,
				tracked_seconds: 0,
				is_running: false,
				sort_order: maxSort + 1
			});
			await this.loadTimers();
			this.render();
		});
	}

	private async deleteTimer(timer: Timer) {
		await this.runWriteAction(async () => {
			if (timer.is_running) {
				await this.db.update("timers", { is_running: false }, `id=eq.${timer.id}`);
			}
			await this.db.delete("timers", `id=eq.${timer.id}`);
			await this.loadTimers();
			this.render();
		});
	}

	private async completeAll() {
		if (this.timers.length === 0) { new Notice("No timers to complete."); return; }
		await this.runWriteAction(async () => {
			await this.stopAllTimers();
			const sessionResult = await this.db.insert("timer_sessions", {
				date: new Date().toISOString().split("T")[0],
				completed_at: new Date().toISOString(),
			});
			const session = Array.isArray(sessionResult) ? sessionResult[0] : sessionResult;

			if (!session) {
				new Notice("Failed to complete session.");
				return;
			}

			for (const timer of this.timers) {
				let entryName = timer.name;
				if (timer.parent_id) {
					const parent = this.timers.find(p => p.id === timer.parent_id);
					if (parent) entryName = `${parent.name} > ${timer.name}`;
				}

				await this.db.insert("timer_session_entries", {
					session_id: session.id,
					timer_name: entryName,
					estimate_seconds: timer.estimate_seconds,
					tracked_seconds: timer.tracked_seconds,
				});

				await this.db.update("timers", {
					tracked_seconds: 0,
					estimate_seconds: 0,
					is_running: false,
					is_rotation_running: false,
					is_last_active: false,
					last_started_at: null
				}, `id=eq.${timer.id}`);
			}
			await this.loadTimers();
			await this.loadSessions();
			new Notice("Session completed and archived.");
			this.render();
		});
	}

	private async deleteSession(session: Session) {
		await this.db.delete("timer_sessions", `id=eq.${session.id}`);
		this.sessions = this.sessions.filter(s => s.id !== session.id);
		this.render();
	}

	private async flushActiveTimer() {
		const running = this.timers.find(t => t.is_running);
		if (running) {
			try {
				const activeTracked = this.getActiveTrackedSeconds(running);
				const currentNow = new Date().toISOString();
				// Shift the start-point forward on close without stopping the run state
				await this.db.update("timers", { tracked_seconds: activeTracked, last_started_at: currentNow }, `id=eq.${running.id}`);
			} catch (e) {
				console.error("Failed to flush active timer on close:", e);
			}
		}
	}

	// ── Icons ─────────────────────────────────────────────────────────────────

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

	// ── Cleanup ───────────────────────────────────────────────────────────────

	destroy() {
		this.stopTick();
		this.flushActiveTimer(); // Runs asynchronously in background to avoid blocking DOM destruction
		this.db.disconnect();
		this.el.remove();
		this.plugin.floatingWindow = null;
	}

	// ── Styles ────────────────────────────────────────────────────────────────

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

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "open-productivity-timer",
			name: "Open/Close Productivity Timer",
			callback: () => this.toggleWindow(),
		});

		this.addSettingTab(new ProductivityTimerSettingsTab(this.app, this));
	}

	onunload() {
		if (this.floatingWindow) {
			this.floatingWindow.destroy();
			this.floatingWindow = null;
		}
		const style = document.getElementById("pt-styles");
		if (style) style.remove();
	}

	toggleWindow() {
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

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}