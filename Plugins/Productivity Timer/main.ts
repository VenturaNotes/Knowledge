import { App, Plugin, PluginSettingTab, Setting, Notice, Platform } from "obsidian";
import { Timer, TimerSegment, Session, PluginSettings, DEFAULT_SETTINGS } from "./types";
import { SupabaseClient } from "./db";
import { ProductivityTimerWindow } from "./desktop";
import { ProductivityTimerView, VIEW_TYPE_PRODUCTIVITY_TIMER } from "./mobile";

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
	
	public collapsedParentIds: Set<string> = new Set();
	public notifiedCompletes: Set<string> = new Set();
	
	public activeMobileView: ProductivityTimerView | null = null;

	async onload() {
		await this.loadSettings();
		this.db = new SupabaseClient(this.settings.supabaseUrl, this.settings.supabaseKey);
		this.statusBarEl = this.addStatusBarItem();
		this.statusBarEl.classList.add("pt-status-bar-item");

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

		this.injectGlobalStyles();
		this.startBackgroundTick();

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
							const duration = activeTracked - localRunning.tracked_seconds;
							if (duration > 0) {
								await this.runWriteAction(async () => {
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

				this.loadTimers().then(() => {
					this.refreshUI();
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

		this.loadTimers().then(() => {
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

	private showRotationOverlay(nextSubtask: Timer) {
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
				
				// Reset notified state automatically if tracked time drops below estimate (2)
				this.notifiedCompletes.delete(running.id);
			} else {
				if (estimate > 0 && displayTracked >= estimate) {
					if (!this.notifiedCompletes.has(running.id)) {
						this.notifiedCompletes.add(running.id);
						this.showCompleteOverlay(running.name); // Triggers full-screen completed overlay on crossing transition (2)
					}
				}
				this.statusBarEl.setText(`[${running.name} : ${this.formatTime(displayTracked)}]`);
			}
		}
	}

	public getActiveTrackedSeconds(timer: Timer): number {
		if (timer.is_running && timer.last_started_at) {
			const offset = (window as any).ptServerClockOffset || 0;
			const calibratedNow = Date.now() + offset;
			const elapsed = Math.floor((calibratedNow - new Date(timer.last_started_at).getTime()) / 1000);
			const trueSeconds = timer.tracked_seconds + Math.max(0, elapsed);

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

	public async runWriteAction(action: () => Promise<void>) {
		this.isWriting = true;
		try {
			await action();
		} catch (e) {
			console.error("Write action failed:", e);
		} finally {
			setTimeout(() => {
				this.isWriting = false;
			}, 800);
		}
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
			
			const parentIds = dbTimers.filter(t => t.parent_id === null).map(t => t.id);
			const orphans = dbTimers.filter(t => t.parent_id !== null && !parentIds.includes(t.parent_id));
			if (orphans.length > 0) {
				for (const orphan of orphans) {
					await this.db.delete("timers", `id=eq.${orphan.id}`);
					await this.db.delete("timer_segments", `timer_id=eq.${orphan.id}`);
				}
				await this.loadTimers();
				return;
			}
			
			const localRunning = this.timers.find(t => t.is_running);
			this.timers = dbTimers.map(dbTimer => {
				const segments = dbSegments.filter(s => s.timer_id === dbTimer.id);
				
				if (localRunning && dbTimer.id === localRunning.id) {
					if (!dbTimer.is_running) {
						return { ...dbTimer, segments };
					}
					return {
						...dbTimer,
						tracked_seconds: Math.max(dbTimer.tracked_seconds, localRunning.tracked_seconds),
						visual_seconds: localRunning.visual_seconds,
						segments
					};
				}
				return { ...dbTimer, segments };
			});

			// Reconcile and prime the complete-state mapping with the loaded data (2)
			for (const t of this.timers) {
				const { tracked, estimate } = this.getTimerDisplayTimes(t);
				if (estimate > 0 && tracked >= estimate) {
					this.notifiedCompletes.add(t.id);
				} else {
					this.notifiedCompletes.delete(t.id);
				}
			}
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

	// ── Centralized Timer State Methods ───────────────────────────────────────

	public async stopAllTimers() {
		const nowStr = this.getCalibratedISOString();
		const segmentsToRecord = this.timers.filter(t => t.is_running && t.last_started_at).map(t => {
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

		for (const t of this.timers) {
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
				await this.db.update("timers", updateObj, `id=eq.${t.id}`);
			}
		}

		await Promise.all(segmentsToRecord.map(seg => 
			this.db.insert("timer_segments", {
				timer_id: seg.timer_id,
				started_at: seg.started_at,
				ended_at: seg.ended_at,
				duration_seconds: seg.duration_seconds
			})
		));
	}

	public async playParent(parent: Timer) {
		const isPlaying = !parent.is_running;
		const timersToStop = this.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = this.getCalibratedISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			const finalTracked = t.visual_seconds !== undefined ? t.visual_seconds : this.getActiveTrackedSeconds(t);
			const duration = Math.max(0, finalTracked - t.tracked_seconds);
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.getActiveTrackedSeconds(t);
			}

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
			parent.last_started_at = nowStr;
			this.lastWriteTimes.set(parent.id, {
				is_running: true,
				last_started_at: parent.last_started_at,
				tracked_seconds: parent.tracked_seconds,
				time: Date.now()
			});
		}

		this.refreshUI();

		await this.runWriteAction(async () => {
			await Promise.all(segmentsToRecord.map(seg => 
				this.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

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
			this.refreshUI();
		});
	}

	public async playSubtaskDirectly(subtask: Timer) {
		const isPlaying = !subtask.is_running;
		const timersToStop = this.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = this.getCalibratedISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			const finalTracked = t.visual_seconds !== undefined ? t.visual_seconds : this.getActiveTrackedSeconds(t);
			const duration = Math.max(0, finalTracked - t.tracked_seconds);
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.getActiveTrackedSeconds(t);
			}

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
			subtask.last_started_at = nowStr;
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

		this.refreshUI();

		await this.runWriteAction(async () => {
			await Promise.all(segmentsToRecord.map(seg => 
				this.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

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
			this.refreshUI();
		});
	}

	public async toggleRotation(parent: Timer) {
		const subtasks = this.timers.filter(t => t.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order);
		if (subtasks.length === 0) {
			new Notice("Add subtasks first before starting rotation.");
			return;
		}
		const isPlaying = !parent.is_rotation_running;
		const timersToStop = this.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = this.getCalibratedISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
			const finalTracked = t.visual_seconds !== undefined ? t.visual_seconds : this.getActiveTrackedSeconds(t);
			const duration = Math.max(0, finalTracked - t.tracked_seconds);
			return {
				timer_id: t.id,
				started_at: start,
				ended_at: nowStr,
				duration_seconds: duration,
				timer: t
			};
		});

		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.getActiveTrackedSeconds(t);
			}

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
		if (!activeSub) return;

		if (isPlaying) {
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
			activeSub.last_started_at = nowStr;
			this.lastWriteTimes.set(activeSub.id, {
				is_running: true,
				last_started_at: activeSub.last_started_at,
				tracked_seconds: activeSub.tracked_seconds,
				time: Date.now()
			});
		}

		this.refreshUI();

		await this.runWriteAction(async () => {
			await Promise.all(segmentsToRecord.map(seg => 
				this.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

			await Promise.all(timersToStop.map(t => 
				this.db.update("timers", { 
					is_running: false, 
					is_rotation_running: false, 
					tracked_seconds: t.tracked_seconds, 
					last_started_at: null 
				}, `id=eq.${t.id}`)
			));

			if (isPlaying) {
				await this.db.update("timers", { is_rotation_running: true }, `id=eq.${parent.id}`);

				const siblings = this.timers.filter(t => t.parent_id === activeSub.parent_id && t.id !== activeSub.id);
				await Promise.all(siblings.map(sib => 
					this.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));

				await this.db.update("timers", { is_running: true, is_last_active: true, last_started_at: activeSub.last_started_at }, `id=eq.${activeSub.id}`);
			}
			await this.loadTimers();
			this.refreshUI();
		});
	}

	public async addTimer() {
		await this.runWriteAction(async () => {
			const maxSort = this.timers.filter(t => t.parent_id === null).reduce((max, t) => Math.max(max, t.sort_order || 0), 0);
			await this.db.insert("timers", {
				name: "New Timer",
				estimate_seconds: 0,
				tracked_seconds: 0,
				is_running: false,
				sort_order: maxSort + 1
			});
			await this.loadTimers();
			this.refreshUI();
		});
	}

	public async addSubtask(parent: Timer) {
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
			this.refreshUI();
		});
	}

	public async deleteTimer(timer: Timer) {
		await this.runWriteAction(async () => {
			if (timer.is_running) {
				await this.db.update("timers", { is_running: false }, `id=eq.${timer.id}`);
			}
			await this.db.delete("timers", `id=eq.${timer.id}`);
			await this.loadTimers();
			this.refreshUI();
		});
	}

	public async completeAll() {
		if (this.timers.length === 0) { new Notice("No timers to complete."); return; }
		await this.runWriteAction(async () => {
			await this.stopAllTimers();
			const sessionResult = await this.db.insert("timer_sessions", {
				date: new Date().toISOString().split("T")[0],
				completed_at: this.getCalibratedISOString(),
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

				await this.db.delete("timer_segments", `timer_id=eq.${timer.id}`);

				await this.db.update("timers", {
					tracked_seconds: 0,
					is_running: false,
					is_rotation_running: false,
					is_last_active: false,
					last_started_at: null
				}, `id=eq.${timer.id}`);
			}
			await this.loadTimers();
			await this.loadSessions();
			new Notice("Session completed and archived.");
			this.refreshUI();
		});
	}

	public async deleteSession(session: Session) {
		try {
			await this.db.delete("timer_sessions", `id=eq.${session.id}`);
			this.sessions = this.sessions.filter(s => s.id !== session.id);
			this.refreshUI();
		} catch (e) {
			new Notice("Failed to delete session.");
		}
	}

	// ── Helpers ───────────────────────────────────────────────────────────────

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
		this.collapsedParentIds = new Set(this.settings.collapsedParentIds || []);
	}

	async saveSettings() {
		this.settings.collapsedParentIds = Array.from(this.collapsedParentIds);
		await this.saveData(this.settings);
	}

	private injectGlobalStyles() {
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
				z-index: 50 !important;
			}
			.pt-mobile-wrapper {
				display: flex !important;
				flex-direction: column !important;
				background-color: var(--background-primary) !important;
				height: 100% !important;
				max-height: 100% !important;
				overflow: hidden !important;
				font-family: var(--font-interface) !important;
				box-sizing: border-box !important;
			}
			/* Disable parent view-content or sidebar leaf scroll fade overlays (1) */
			.view-content:has(.pt-mobile-wrapper)::after,
			.view-content:has(.pt-mobile-wrapper)::before,
			.workspace-leaf-content:has(.pt-mobile-wrapper)::after,
			.workspace-leaf-content:has(.pt-mobile-wrapper)::before,
			.pt-mobile-wrapper::after,
			.pt-mobile-wrapper::before {
				display: none !important;
				content: none !important;
				background: none !important;
				background-image: none !important;
				box-shadow: none !important;
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
				flex: 1 1 auto !important;
				overflow-y: auto !important;
				padding: 12px 12px 40px 12px !important;
				display: flex;
				flex-direction: column;
				gap: 8px;
				min-height: 0 !important;
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
			
			.pt-timer-rows { 
				display: flex; 
				flex-direction: column; 
				gap: 6px; 
				padding-bottom: 80px !important;
			}
			.pt-row {
				display: flex;
				align-items: center;
				gap: 6px;
				padding: 4px 8px;
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
				margin-left: 18px;
				border-left: 3px solid var(--interactive-accent) !important;
				background: var(--background-primary);
			}
			
			.pt-drag-handle {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 14px;
				height: 20px;
				color: var(--text-faint);
				cursor: grab;
				user-select: none;
				font-size: 11px;
			}
			.pt-drag-handle:active {
				cursor: grabbing;
			}
			
			.pt-collapse-toggle {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 14px;
				height: 14px;
				color: var(--text-muted);
				cursor: pointer;
				font-size: 11px;
				font-weight: bold;
				border-radius: 3px;
				transition: background 0.1s;
			}
			.pt-collapse-toggle:hover {
				background: var(--background-modifier-border-hover);
				color: var(--text-normal);
			}
			.pt-collapse-spacer {
				display: inline-block;
				width: 14px;
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
				max-height: 350px;
				overflow-y: auto;
				border: 1px solid var(--background-modifier-border);
				border-radius: 6px;
				padding: 8px;
				background: var(--background-primary-alt);
				box-sizing: border-box !important;
			}
			.pt-modal-log-row {
				display: flex !important;
				align-items: center !important;
				justify-content: space-between !important;
				gap: 6px !important;
				background: var(--background-primary) !important;
				border: 1px solid var(--background-modifier-border) !important;
				border-radius: 4px !important;
				padding: 6px 10px !important;
				flex-wrap: wrap !important;
				box-sizing: border-box !important;
			}
			
			/* Shift datetime-local text fields wrapper to make room for native calendar icon (2) */
			.pt-modal-log-row input[type="datetime-local"]::-webkit-datetime-edit,
			.pt-modal-log-row input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
				padding-left: 10px !important; /* Adjusted to 10px to resolve right-side truncation (PM) */
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
				flex: 1;
				min-width: 0;
				display: block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.pt-name:focus {
				background: var(--background-modifier-form-field);
				box-shadow: 0 0 0 2px var(--interactive-accent);
			}
			
			.pt-row-right-actions {
				display: flex;
				align-items: center;
				gap: 4px;
			}
			.pt-metrics-container {
				display: flex;
				align-items: center;
				gap: 8px;
			}
			.pt-metric-field {
				display: flex;
				align-items: center;
				gap: 4px;
				font-size: 11px;
				color: var(--text-muted);
			}
			
			.pt-estimate-input, .pt-tracked-input {
				width: 86px;
				background: var(--background-modifier-form-field);
				border: 1px solid var(--background-modifier-border);
				border-radius: 4px;
				padding: 2px 4px;
				font-size: 11px;
				color: var(--text-muted);
				outline: none;
				font-variant-numeric: tabular-nums;
				text-align: center;
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
				z-index: 10;
				background: transparent;
			}
			.pt-resize-n {
				top: -4px;
				left: 4px;
				right: 4px;
				height: 8px;
				cursor: ns-resize;
			}
			.pt-resize-s {
				bottom: -4px;
				left: 4px;
				right: 4px;
				height: 8px;
				cursor: ns-resize;
			}
			.pt-resize-e {
				right: -4px;
				top: 4px;
				bottom: 4px;
				width: 8px;
				cursor: ew-resize;
			}
			.pt-resize-w {
				left: -4px;
				top: 4px;
				bottom: 4px;
				width: 8px;
				cursor: ew-resize;
			}
			.pt-resize-nw {
				top: -4px;
				left: -4px;
				width: 10px;
				height: 10px;
				cursor: nwse-resize;
			}
			.pt-resize-ne {
				top: -4px;
				right: -4px;
				width: 10px;
				height: 10px;
				cursor: nesw-resize;
			}
			.pt-resize-sw {
				bottom: -4px;
				left: -4px;
				width: 10px;
				height: 10px;
				cursor: nesw-resize;
			}
			.pt-resize-se {
				bottom: -4px;
				right: -4px;
				width: 10px;
				height: 10px;
				cursor: nwse-resize;
			}
			.pt-status-bar-item {
				order: 999999 !important;
				padding-left: 4px !important;
				padding-right: 4px !important;
				margin: 0 !important;
			}
			.pt-row--dragging {
				opacity: 0.45;
				border: 1px dashed var(--interactive-accent) !important;
			}
			.pt-row--drag-over {
				border-top: 2px solid var(--interactive-accent) !important;
				background: var(--background-secondary-alt) !important;
			}
			
			/* Responsive adaptations for Mobile Sidebar view */
			.pt-mobile-wrapper .pt-row {
				display: flex !important;
				flex-direction: column !important;
				gap: 4px !important;
				padding: 6px 8px !important;
				border-radius: 6px;
				background: var(--background-primary-alt);
				border: 1px solid var(--background-modifier-border);
			}
			.pt-mobile-wrapper .pt-row-top {
				display: flex !important;
				align-items: center !important;
				width: 100% !important;
				gap: 6px !important;
			}
			.pt-mobile-wrapper .pt-row-bottom {
				display: flex !important;
				align-items: center !important;
				width: 100% !important;
				padding-top: 4px !important;
				border-top: 1px dashed var(--background-modifier-border) !important;
			}
			.pt-mobile-wrapper .pt-metrics-container {
				display: flex !important;
				align-items: center !important;
				gap: 12px !important;
				width: 100% !important;
			}
			.pt-mobile-wrapper .pt-metric-field {
				display: flex !important;
				align-items: center !important;
				gap: 6px !important;
				flex: 1 !important;
			}
			.pt-mobile-wrapper .pt-estimate-input, 
			.pt-mobile-wrapper .pt-tracked-input {
				flex: 1 !important;
				width: 100% !important;
				min-width: 0 !important;
			}
			.pt-mobile-wrapper .pt-row--subtask {
				margin-left: 14px !important;
			}
			
			/* Disable pointer events on nested row elements during active drag actions */
			body.pt-is-row-dragging .pt-row * {
				pointer-events: none !important;
			}
			
			/* Bypass Electron webview interception boundaries during active drag, resize, and title-dragging actions */
			body.pt-is-row-dragging webview,
			body.pt-is-row-dragging iframe,
			body.pt-is-window-dragging webview,
			body.pt-is-window-dragging iframe,
			body.pt-is-window-resizing webview,
			body.pt-is-window-resizing iframe {
				pointer-events: none !important;
			}
		`;
		document.head.appendChild(style);
	}
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