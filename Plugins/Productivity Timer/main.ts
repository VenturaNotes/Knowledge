import { App, Plugin, PluginSettingTab, Setting, Notice, Platform } from "obsidian";
import { Timer, Session, PluginSettings, DEFAULT_SETTINGS } from "./types";
import { SupabaseClient } from "./db";
import { ProductivityTimerWindow } from "./desktop";
import { ProductivityTimerView, VIEW_TYPE_PRODUCTIVITY_TIMER } from "./mobile";
import { SyncManager } from "./syncManager";
import { TimerService } from "./timerService";

export default class ProductivityTimerPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	floatingWindow: ProductivityTimerWindow | null = null;
	db: SupabaseClient;
	syncManager: SyncManager;
	timerService: TimerService;
	
	timers: Timer[] = [];
	sessions: Session[] = [];
	statusBarEl: HTMLElement;
	bgTickInterval: number | null = null;
	isWriting = false;
	public lastWriteTimes: Map<string, { is_running: boolean, last_started_at: string | null, tracked_seconds: number, time: number }> = new Map();
	private rotationOverlay: HTMLElement | null = null;
	private overlayKeydownListener: ((e: KeyboardEvent) => void) | null = null;
	private loadTimersDebounceTimeout: any = null;
	
	public collapsedParentIds: Set<string> = new Set();
	public notifiedCompletes: Set<string> = new Set();
	
	public activeMobileView: ProductivityTimerView | null = null;

	async onload() {
		await this.loadSettings();
		this.db = new SupabaseClient(this.settings.supabaseUrl, this.settings.supabaseKey);
		this.syncManager = new SyncManager(this);
		this.timerService = new TimerService(this);
		
		this.statusBarEl = this.addStatusBarItem();
		this.statusBarEl.classList.add("pt-status-bar-item");

		this.db.setQueue(this.settings.offlineQueue || [], async () => {
			await this.saveSettings();
		});

		this.registerView(
			VIEW_TYPE_PRODUCTIVITY_TIMER,
			(leaf) => new ProductivityTimerView(leaf, this)
		);

		this.addCommand({
			id: "open-productivity-timer",
			name: "Open/Close Productivity Timer",
			callback: () => this.toggleWindow(),
		});

		this.addSettingTab(new ProductivityTimerSettingsTab(this.app, this));

		this.startBackgroundTick();

		// Handle raw connection-state changes
		this.registerDomEvent(window, "online", async () => {
			await this.syncManager.syncOfflineActions();
		});

		// Instantly update the UI connection badges the moment the device goes offline
		this.registerDomEvent(window, "offline", () => {
			this.refreshUI();
		});

		// Listen for app-foregrounding transitions (especially on Android and iOS devices)
		this.registerDomEvent(document, "visibilitychange", async () => {
			if (document.visibilityState === "visible") {
				try {
					await this.syncManager.syncOfflineActions();
					await this.syncManager.loadTimers();
					await this.syncManager.loadSessions();
					this.refreshUI();
					if (this.db) {
						this.db.reconnect();
					}
				} catch (e) {
					console.error("Productivity Timer: failed to sync state on resume.", e);
				}
			}
		});

		// Check for pending items to push right at startup
		this.syncManager.syncOfflineActions();

		if (this.settings.supabaseUrl && this.settings.supabaseKey) {
			this.db.subscribeToTable("timers", async (payload) => {
				if (this.isWriting) return;
				const data = payload.data || payload;
				const eventType = (data.eventType || payload.eventType || payload.event || payload.type || "UPDATE").toUpperCase();

				if (eventType === "UPDATE" && (data.new || payload.new)) {
					const incoming = data.new || payload.new;
					const localRunning = this.timers.find(t => t.is_running);
					
					if (localRunning && incoming.is_running && incoming.id !== localRunning.id) {
						const nowStr = this.getCalibratedISOString();
						const start = localRunning.last_started_at;
						if (start) {
							const activeTracked = this.getActiveTrackedSeconds(localRunning);
							const duration = Math.max(0, Math.floor((new Date(nowStr).getTime() - new Date(start).getTime()) / 1000));
							if (duration > 0) {
								await this.timerService.runWriteAction(async () => {
									await this.db.insert("timer_segments", {
										timer_id: localRunning.id,
										started_at: start,
										ended_at: nowStr,
										duration_seconds: duration
									});
									await this.db.update("timers", {
										is_running: false,
										is_rotation_running: false,
										tracked_seconds: activeTracked,
										last_started_at: null
									}, `id=eq.${localRunning.id}`);
								});
							}
						}
					}
				}

				// Debounce the load requests on incoming events to avoid concurrent REST race conditions
				this.loadTimersDebounced();
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
		this.db.disconnect();
	}

	public getCalibratedISOString(): string {
		const offset = (window as any).ptServerClockOffset || 0;
		return new Date(Date.now() + offset).toISOString();
	}

	public getMobileView(): ProductivityTimerView | null {
		return this.activeMobileView;
	}

	public refreshUI() {
		if (this.floatingWindow) {
			this.floatingWindow.render();
		}
		const mobileView = this.getMobileView();
		if (mobileView) {
			mobileView.render();
		}
		this.updateStatusBar();
	}

	public tickUI() {
		if (this.floatingWindow) {
			this.floatingWindow.renderTimerRowsOnly();
		}
		const mobileView = this.getMobileView();
		if (mobileView) {
			mobileView.renderTimerRowsOnly();
		}
		this.updateStatusBar();
	}

	private startBackgroundTick() {
		if (this.bgTickInterval) window.clearInterval(this.bgTickInterval);

		this.syncManager.loadTimers().then(() => {
			this.refreshUI();
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

			this.tickUI();
			await this.checkSubtaskRotation();
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
					const nextNow = this.getCalibratedISOString();
					const localStart = running.last_started_at;
					
					const localDur = Math.max(0, Math.floor((new Date(nextNow).getTime() - new Date(localStart).getTime()) / 1000));
					const finalTracked = running.tracked_seconds + localDur;

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

					running.is_running = false;
					running.is_last_active = false;
					running.tracked_seconds = finalTracked;
					running.last_started_at = null;

					nextSubtask.is_running = true;
					nextSubtask.is_last_active = true;
					nextSubtask.last_started_at = nextNow;

					this.refreshUI();
					this.showRotationOverlay(nextSubtask);

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
						this.refreshUI();
					} catch (e) {
						console.error("Background subtask rotation failed:", e);
					}
				}
			}
		}
	}

	public showRotationOverlay(nextSubtask: Timer) {
		if (this.rotationOverlay) {
			this.rotationOverlay.remove();
		}
		if (this.overlayKeydownListener) {
			window.removeEventListener("keydown", this.overlayKeydownListener, true);
		}

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

		const closeBtn = overlay.createEl("button", { text: "✕" });
		Object.assign(closeBtn.style, {
			position: "absolute",
			top: "20px",
			right: "20px",
			width: "40px",
			height: "40px",
			borderRadius: "50%",
			border: "none",
			background: "rgba(255, 255, 255, 0.15)",
			color: "var(--text-normal)",
			fontSize: "18px",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			transition: "background 0.1s"
		});
		closeBtn.addEventListener("click", () => {
			if (this.rotationOverlay) {
				this.rotationOverlay.remove();
				this.rotationOverlay = null;
			}
			if (this.overlayKeydownListener) {
				window.removeEventListener("keydown", this.overlayKeydownListener, true);
				this.overlayKeydownListener = null;
			}
		});

		const label = overlay.createDiv({ cls: "pt-overlay-label" });
		const spanEl = label.createEl("span", { text: "UP NEXT:" });
		spanEl.style.cssText = "font-size: 13px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; display: block; text-align: center;";

		const h1El = label.createEl("h1", { text: nextSubtask.name });
		h1El.style.cssText = "font-size: 34px; font-weight: 700; color: var(--interactive-accent); margin: 0; text-align: center;";

		const pEl = overlay.createEl("p", { text: "Press [ Ctrl + Space ] to acknowledge" });
		pEl.style.cssText = "font-size: 11px; color: var(--text-muted); margin-top: 36px; text-transform: uppercase; letter-spacing: 0.05em;";

		document.body.appendChild(overlay);
		this.rotationOverlay = overlay;

		const activeEl = document.activeElement as HTMLElement;
		if (activeEl) activeEl.blur();

		this.overlayKeydownListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && (e.code === "Space" || e.key === " ")) {
				e.preventDefault();
				e.stopPropagation();
				
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

	public showCompleteOverlay(taskName: string) {
		if (this.rotationOverlay) {
			this.rotationOverlay.remove();
		}
		if (this.overlayKeydownListener) {
			window.removeEventListener("keydown", this.overlayKeydownListener, true);
		}

		const overlay = document.createElement("div");
		overlay.id = "pt-complete-overlay";
		Object.assign(overlay.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100vw",
			height: "100vh",
			backgroundColor: "rgba(0, 0, 0, 0.90)",
			zIndex: "9999",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			fontFamily: "var(--font-interface)",
			color: "var(--text-normal)"
		});

		const closeBtn = overlay.createEl("button", { text: "✕" });
		Object.assign(closeBtn.style, {
			position: "absolute",
			top: "20px",
			right: "20px",
			width: "40px",
			height: "40px",
			borderRadius: "50%",
			border: "none",
			background: "rgba(16, 185, 129, 0.20)",
			color: "#10B981",
			fontSize: "18px",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			transition: "background 0.1s"
		});
		closeBtn.addEventListener("click", () => {
			if (this.rotationOverlay) {
				this.rotationOverlay.remove();
				this.rotationOverlay = null;
			}
			if (this.overlayKeydownListener) {
				window.removeEventListener("keydown", this.overlayKeydownListener, true);
				this.overlayKeydownListener = null;
			}
		});

		const label = overlay.createDiv({ cls: "pt-overlay-label" });
		const spanEl = label.createEl("span", { text: "TASK COMPLETE" });
		spanEl.style.cssText = "font-size: 13px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; display: block; text-align: center;";

		const h1El = label.createEl("h1", { text: taskName });
		h1El.style.cssText = "font-size: 34px; font-weight: 700; color: #10B981; margin: 0; text-align: center; text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);";

		const pEl = overlay.createEl("p", { text: "Press [ Ctrl + Space ] to acknowledge" });
		pEl.style.cssText = "font-size: 11px; color: var(--text-muted); margin-top: 36px; text-transform: uppercase; letter-spacing: 0.05em;";

		document.body.appendChild(overlay);
		this.rotationOverlay = overlay;

		const activeEl = document.activeElement as HTMLElement;
		if (activeEl) activeEl.blur();

		this.overlayKeydownListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && (e.code === "Space" || e.key === " ")) {
				e.preventDefault();
				e.stopPropagation();
				
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
			this.statusBarEl.setText("");
			return;
		}

		const activeTracked = this.getActiveTrackedSeconds(running);
		const displayTracked = this.getTimerDisplayTimes(running).tracked;
		const isSubtask = running.parent_id !== null;
		const parent = isSubtask ? this.timers.find(t => t.id === running.parent_id) : null;
		const isRotationActive = parent ? parent.is_rotation_running : false;

		if (isSubtask && isRotationActive && running.estimate_seconds > 0) {
			const currentElapsedInBlock = activeTracked % running.estimate_seconds;
			const timeLeft = running.estimate_seconds - currentElapsedInBlock;

			const switchTimeEpoch = Date.now() + (timeLeft * 1000);
			const switchDate = new Date(switchTimeEpoch);
			const switchTimeStr = switchDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

			this.statusBarEl.setText(`[${running.name} : ${this.formatTime(timeLeft)} : ${switchTimeStr}]`);
		} else {
			const estimate = running.estimate_seconds;
			if (estimate > 0 && displayTracked < estimate) {
				const timeLeft = estimate - displayTracked;
				const doneTimeEpoch = Date.now() + (timeLeft * 1000);
				const doneDate = new Date(doneTimeEpoch);
				const doneTimeStr = doneDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

				this.statusBarEl.setText(`[${running.name} : ${this.formatTime(timeLeft)} : ${doneTimeStr}]`);
				
				this.notifiedCompletes.delete(running.id);
			} else {
				if (estimate > 0 && displayTracked >= estimate) {
					if (!this.notifiedCompletes.has(running.id)) {
						this.notifiedCompletes.add(running.id);
						this.showCompleteOverlay(running.name);
					}
				}
				this.statusBarEl.setText(`[${running.name} : ${this.formatTime(displayTracked)}]`);
			}
		}
	}

	public getActiveTrackedSeconds(timer: Timer): number {
		// Calculate base seconds by summing active log segments (with auto-repair for 0s segment entries)
		const baseSeconds = (timer.segments || []).reduce((sum, s) => {
			if (s.duration_seconds && s.duration_seconds > 0) {
				return sum + s.duration_seconds;
			}
			if (s.started_at && s.ended_at) {
				const startMs = new Date(s.started_at).getTime();
				const endMs = new Date(s.ended_at).getTime();
				if (!isNaN(startMs) && !isNaN(endMs) && endMs > startMs) {
					return sum + Math.floor((endMs - startMs) / 1000);
				}
			}
			return sum;
		}, 0);

		if (timer.is_running && timer.last_started_at) {
			const offset = (window as any).ptServerClockOffset || 0;
			const calibratedNow = Date.now() + offset;
			const elapsed = Math.floor((calibratedNow - new Date(timer.last_started_at).getTime()) / 1000);
			const trueSeconds = baseSeconds + Math.max(0, elapsed);

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
		return baseSeconds;
	}

	public getRollupDetails() {
		const parentsWithEstimate = this.timers.filter(t => t.parent_id === null && t.estimate_seconds > 0);
		const totalEstimateSeconds = parentsWithEstimate.reduce((sum, t) => sum + t.estimate_seconds, 0);
		const totalTrackedSeconds = parentsWithEstimate.reduce((sum, t) => sum + this.getTimerDisplayTimes(t).tracked, 0);

		let totalTimeLeftSeconds = 0;
		for (const t of parentsWithEstimate) {
			const tracked = this.getTimerDisplayTimes(t).tracked;
			if (tracked < t.estimate_seconds) {
				totalTimeLeftSeconds += (t.estimate_seconds - tracked);
			}
		}

		const doneTimeEpoch = Date.now() + (totalTimeLeftSeconds * 1000);
		const doneDate = new Date(doneTimeEpoch);
		const month = doneDate.getMonth() + 1;
		const day = doneDate.getDate();
		const doneTimeStr = doneDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

		return {
			totalEstimateSeconds,
			totalTrackedSeconds,
			totalTimeLeftSeconds,
			month,
			day,
			doneTimeStr
		};
	}

	public getRunningTaskDetails() {
		const running = this.timers.find(t => t.is_running);
		if (!running) {
			return {
				name: "No Task Running",
				rightText: "",
				isRunning: false
			};
		}

		const activeParent = running.parent_id ? this.timers.find(p => p.id === running.parent_id) : running;
		const displayName = activeParent ? activeParent.name : running.name;
		const { tracked, estimate } = this.getTimerDisplayTimes(activeParent || running);

		if (estimate > 0) {
			if (tracked < estimate) {
				const timeLeft = estimate - tracked;
				const doneTimeEpoch = Date.now() + (timeLeft * 1000);
				const doneDate = new Date(doneTimeEpoch);
				const doneTimeStr = doneDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
				return {
					name: displayName,
					rightText: `${this.formatTime(timeLeft)} (Done @ ${doneTimeStr})`,
					isRunning: true
				};
			} else {
				const overtime = tracked - estimate;
				return {
					name: displayName,
					rightText: `+${this.formatTime(overtime)}`,
					isRunning: true
				};
			}
		} else {
			return {
				name: displayName,
				rightText: "No Time Estimate",
				isRunning: true
			};
		}
	}

	public totalEstimate(): number {
		const rendered = this.getFlattenedRenderedTimers();
		return rendered.reduce((sum, t) => sum + t.estimate_seconds, 0);
	}

	public totalTracked(): number {
		const rendered = this.getFlattenedRenderedTimers();
		return rendered.reduce((sum, t) => sum + this.getActiveTrackedSeconds(t), 0);
	}

	public getFlattenedRenderedTimers(): Timer[] {
		const list: Timer[] = [];
		const parents = this.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			list.push(parent);
			if (!this.collapsedParentIds.has(parent.id)) {
				const subtasks = this.timers.filter(t => t.parent_id === parent.id);
				for (const sub of subtasks) {
					list.push(sub);
				}
			}
		}
		return list;
	}

	public getTimerDisplayTimes(timer: Timer) {
		if (timer.parent_id !== null) {
			return {
				tracked: this.getActiveTrackedSeconds(timer),
				estimate: timer.estimate_seconds
			};
		} else {
			const subtasks = this.timers.filter(t => t.parent_id === timer.id);
			const sumTracked = subtasks.reduce((sum, s) => sum + this.getActiveTrackedSeconds(s), 0);
			return {
				tracked: this.getActiveTrackedSeconds(timer) + sumTracked,
				estimate: timer.estimate_seconds,
				sumTracked,
				sumEstimate: subtasks.reduce((sum, s) => sum + s.estimate_seconds, 0)
			};
		}
	}

	public formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

	public async runWriteAction(action: () => Promise<void>) {
		this.isWriting = true;
		try {
			await action();
			await this.persistLocalState();
		} catch (e) {
			console.error("Write action failed:", e);
		} finally {
			setTimeout(() => {
				this.isWriting = false;
			}, 800);
		}
	}

	public async persistLocalState() {
		await this.syncManager.persistLocalState();
	}

	public loadTimersDebounced() {
		if (this.loadTimersDebounceTimeout) {
			window.clearTimeout(this.loadTimersDebounceTimeout);
		}
		this.loadTimersDebounceTimeout = window.setTimeout(async () => {
			await this.loadTimers();
			this.refreshUI();
			this.loadTimersDebounceTimeout = null;
		}, 200);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.collapsedParentIds = new Set(this.settings.collapsedParentIds || []);
	}

	async saveSettings() {
		this.settings.collapsedParentIds = Array.from(this.collapsedParentIds);
		this.settings.localTimersCache = this.timers;
		await this.saveData(this.settings);
	}

	async toggleWindow() {
		if (!this.settings.supabaseUrl || !this.settings.supabaseKey) {
			new Notice("Productivity Timer: set your Supabase URL and key in settings first.");
			return;
		}

		if (Platform.isMobile) {
			const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_PRODUCTIVITY_TIMER);
			if (leaves.length > 0) {
				this.app.workspace.detachLeavesOfType(VIEW_TYPE_PRODUCTIVITY_TIMER);
			} else {
				let leaf = this.app.workspace.getRightLeaf(false);
				if (leaf) {
					await leaf.setViewState({
						type: VIEW_TYPE_PRODUCTIVITY_TIMER,
						active: true,
					});
					this.app.workspace.revealLeaf(leaf);
				}
			}
		} else {
			if (this.floatingWindow) {
				this.floatingWindow.destroy();
				this.floatingWindow = null;
			} else {
				this.floatingWindow = new ProductivityTimerWindow(this);
			}
		}
	}

	// Wrapper action redirects for caller convenience
	public loadTimers() { return this.syncManager.loadTimers(); }
	public loadSessions() { return this.syncManager.loadSessions(); }
	public playParent(timer: Timer) { this.timerService.playParent(timer); }
	public playSubtaskDirectly(timer: Timer) { this.timerService.playSubtaskDirectly(timer); }
	public toggleRotation(timer: Timer) { this.timerService.toggleRotation(timer); }
	public addTimer() { this.timerService.addTimer(); }
	public addSubtask(parent: Timer) { this.timerService.addSubtask(parent); }
	public deleteTimer(timer: Timer) { this.timerService.deleteTimer(timer); }
	public completeAll() { this.timerService.completeAll(); }
	public deleteSession(session: any) { this.timerService.deleteSession(session); }
}

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