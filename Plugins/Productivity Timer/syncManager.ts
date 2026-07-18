import { Notice } from "obsidian";
import { Timer, TimerSegment, OfflineAction } from "./types";
import ProductivityTimerPlugin from "./main";

export class SyncManager {
	private plugin: ProductivityTimerPlugin;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
	}

	public async persistLocalState() {
		this.plugin.settings.localTimersCache = this.plugin.timers;
		await this.plugin.saveSettings();
	}

	public async syncOfflineActions() {
		if (!navigator.onLine || !this.plugin.settings.offlineQueue || this.plugin.settings.offlineQueue.length === 0) return;

		// Copy the actions to process them
		const actions = [...this.plugin.settings.offlineQueue];
		
		// Clear the array IN-PLACE to preserve the reference inside db.ts
		this.plugin.settings.offlineQueue.length = 0;
		await this.plugin.saveSettings();

		new Notice(`Syncing ${actions.length} offline actions with Supabase...`);

		try {
			for (const act of actions) {
				if (act.type === "INSERT") {
					await this.plugin.db.insertBypassQueue(act.table, act.data);
				} else if (act.type === "UPDATE") {
					await this.plugin.db.updateBypassQueue(act.table, act.data, act.match || "");
				} else if (act.type === "DELETE") {
					await this.plugin.db.deleteBypassQueue(act.table, act.match || "");
				}
			}
			new Notice("Offline sync complete.");
		} catch (e) {
			console.error("Offline sync failed:", e);
			// Put them back in-place at the beginning of the queue if the push fails
			this.plugin.settings.offlineQueue.unshift(...actions);
			await this.plugin.saveSettings();
			new Notice("Offline sync failed, will retry later.");
		}

		await this.loadTimers();
		await this.loadSessions();
		this.plugin.refreshUI();
	}

	public async loadTimers() {
		try {
			let dbTimers: Timer[] = [];
			let dbSegments: TimerSegment[] = [];

			if (!navigator.onLine) {
				this.plugin.timers = this.plugin.settings.localTimersCache || [];
				for (const t of this.plugin.timers) {
					const { tracked, estimate } = this.plugin.getTimerDisplayTimes(t);
					if (estimate > 0 && tracked >= estimate) {
						this.plugin.notifiedCompletes.add(t.id);
					} else {
						this.plugin.notifiedCompletes.delete(t.id);
					}
				}
				return;
			}

			try {
				dbTimers = await this.plugin.db.select("timers", "order=sort_order.asc,created_at.asc");
				try {
					dbSegments = await this.plugin.db.select("timer_segments", "order=started_at.asc");
				} catch (e) {
					console.error("Failed to load segments", e);
				}
				this.plugin.settings.localTimersCache = dbTimers;
				await this.plugin.saveSettings();
			} catch (e) {
				dbTimers = this.plugin.settings.localTimersCache || [];
			}
			
			const parentIds = dbTimers.filter(t => t.parent_id === null).map(t => t.id);
			const orphans = dbTimers.filter(t => t.parent_id !== null && !parentIds.includes(t.parent_id));
			if (orphans.length > 0 && navigator.onLine) {
				for (const orphan of orphans) {
					await this.plugin.db.delete("timers", `id=eq.${orphan.id}`);
					await this.plugin.db.delete("timer_segments", `timer_id=eq.${orphan.id}`);
				}
				await this.loadTimers();
				return;
			}
			
			const localRunning = this.plugin.timers.find(t => t.is_running);
			this.plugin.timers = dbTimers.map(dbTimer => {
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

			for (const t of this.plugin.timers) {
				const { tracked, estimate } = this.plugin.getTimerDisplayTimes(t);
				if (estimate > 0 && tracked >= estimate) {
					this.plugin.notifiedCompletes.add(t.id);
				} else {
					this.plugin.notifiedCompletes.delete(t.id);
				}
			}

			await this.reconcileRunningTimers();
			await this.persistLocalState();

		} catch {
			console.error("Productivity Timer: failed to load timers.");
		}
	}

	public async loadSessions() {
		try {
			const sessionRows = await this.plugin.db.select("timer_sessions", "order=completed_at.desc&limit=30");
			const entries = await this.plugin.db.select("timer_session_entries", "");
			this.plugin.sessions = sessionRows.map((s: any) => ({
				...s,
				entries: entries.filter((e: any) => e.session_id === s.id),
			}));
		} catch {}
	}

	public async reconcileRunningTimers() {
		if (this.plugin.isWriting) return;

		const runningTimers = this.plugin.timers.filter(t => t.is_running && t.last_started_at);
		if (runningTimers.length <= 1) return;

		runningTimers.sort((a, b) => {
			const timeA = a.last_started_at ? new Date(a.last_started_at).getTime() : 0;
			const timeB = b.last_started_at ? new Date(b.last_started_at).getTime() : 0;
			return timeB - timeA;
		});

		const activeTimer = runningTimers[0];
		if (!activeTimer) return;

		const conflictingTimers = runningTimers.slice(1);

		await this.plugin.timerService.runWriteAction(async () => {
			for (const t of conflictingTimers) {
				if (!t.last_started_at || !activeTimer.last_started_at) continue;

				const tStart = new Date(t.last_started_at).getTime();
				const candidates: number[] = [];

				for (const other of this.plugin.timers) {
					if (other.id === t.id) continue;

					if (other.last_started_at) {
						const otherStart = new Date(other.last_started_at).getTime();
						if (otherStart > tStart) {
							candidates.push(otherStart);
						}
					}

					const segments = other.segments || [];
					for (const seg of segments) {
						const segStart = new Date(seg.started_at).getTime();
						if (segStart > tStart) {
							candidates.push(segStart);
						}
					}
				}

				const tSegments = t.segments || [];
				for (const seg of tSegments) {
					const segStart = new Date(seg.started_at).getTime();
					if (segStart > tStart) {
						candidates.push(segStart);
					}
				}

				const finalEndMs = candidates.length > 0 
					? Math.min(...candidates) 
					: Date.now() + ((window as any).ptServerClockOffset || 0);

				const duration = Math.max(0, Math.floor((finalEndMs - tStart) / 1000));
				const finalTracked = t.tracked_seconds + duration;
				const endIso = new Date(finalEndMs).toISOString();

				await this.plugin.db.insert("timer_segments", {
					timer_id: t.id,
					started_at: t.last_started_at,
					ended_at: endIso,
					duration_seconds: duration
				});

				await this.plugin.db.update("timers", {
					is_running: false,
					is_rotation_running: false,
					tracked_seconds: finalTracked,
					last_started_at: null
				}, `id=eq.${t.id}`);
			}

			await this.loadTimers();
			this.plugin.refreshUI();
		});
	}
}