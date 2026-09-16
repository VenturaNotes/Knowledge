import { Notice } from "obsidian";
import { Timer, TimerSegment, generateUUID } from "./types";
import ProductivityTimerPlugin from "./main";

export class SyncManager {
	private plugin: ProductivityTimerPlugin;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
	}

	public async persistLocalState() {
		if (this.plugin.timers.length > 0 || !this.plugin.settings.localTimersCache) {
			this.plugin.settings.localTimersCache = this.plugin.timers;
		}
		await this.plugin.saveSettings();
	}

	public async syncOfflineActions() {
		if (!navigator.onLine || !this.plugin.settings.offlineQueue || this.plugin.settings.offlineQueue.length === 0) return;

		await new Promise(resolve => setTimeout(resolve, 1200));
		if (!navigator.onLine) return;

		await this.plugin.runWriteAction(async () => {
			const queue = this.plugin.settings.offlineQueue;
			if (queue.length === 0) return;

			new Notice(`Syncing ${queue.length} offline actions with Supabase...`);

			try {
				const remoteRunning: Timer[] = await this.plugin.db.select(
					"timers",
					"or=(is_running.eq.true,is_rotation_running.eq.true)"
				);

				if (remoteRunning.length > 0) {
					let earliestOfflineMs = Infinity;
					for (const act of queue) {
						if (act.data?.started_at) {
							const ms = new Date(act.data.started_at).getTime();
							if (!isNaN(ms) && ms < earliestOfflineMs) earliestOfflineMs = ms;
						} else if (act.timestamp && act.timestamp < earliestOfflineMs) {
							earliestOfflineMs = act.timestamp;
						}
					}

					for (const r of remoteRunning) {
						if (r.last_started_at) {
							const rStartMs = new Date(r.last_started_at).getTime();
							if (!isNaN(rStartMs) && earliestOfflineMs < Infinity && rStartMs < earliestOfflineMs) {
								const dur = Math.max(0, Math.floor((earliestOfflineMs - rStartMs) / 1000));
								if (dur > 0) {
									const cutoffIso = new Date(earliestOfflineMs).toISOString();
									await this.plugin.db.insertBypassQueue("timer_segments", {
										id: generateUUID(),
										timer_id: r.id,
										started_at: r.last_started_at,
										ended_at: cutoffIso,
										duration_seconds: dur
									}).catch(() => {});
								}
								await this.plugin.db.updateBypassQueue("timers", {
									is_running: false,
									is_rotation_running: false,
									last_started_at: null
								}, `id=eq.${r.id}`).catch(() => {});
							}
						}
					}
				}
			} catch (err) {
				console.warn("Could not reconcile remote running timers before sync:", err);
			}

			while (queue.length > 0) {
				const act = queue[0];
				if (!act) {
					queue.shift();
					continue;
				}

				if (act.data && typeof act.data === "object") {
					delete act.data.segments;
					delete act.data.visual_seconds;
				}

				try {
					if (act.type === "INSERT") {
						await this.plugin.db.insertBypassQueue(act.table, act.data);
					} else if (act.type === "UPDATE") {
						await this.plugin.db.updateBypassQueue(act.table, act.data, act.match || "");
					} else if (act.type === "DELETE") {
						await this.plugin.db.deleteBypassQueue(act.table, act.match || "");
					}
					queue.shift();
					await this.plugin.saveSettings();
				} catch (e: any) {
					console.error("Offline sync error on action:", act, e);
					if (e?.status >= 400 && e?.status < 500) {
						queue.shift();
						await this.plugin.saveSettings();
					} else {
						new Notice("Offline sync temporarily paused (network stabilizing)...");
						break;
					}
				}
			}

			await this.loadTimers();
			await this.loadSessions();
			this.plugin.refreshUI();
		});
	}

	public async loadTimers(force = false) {
		if (!navigator.onLine) {
			if (this.plugin.timers.length === 0 && this.plugin.settings.localTimersCache && this.plugin.settings.localTimersCache.length > 0) {
				this.plugin.timers = this.plugin.settings.localTimersCache;
			}
			this.updateCompletionNotifications();
			return;
		}

		// Protect active writes, in-flight switches, or recent local writes (< 1500ms)
		if (!force) {
			const isSwitchPending = this.plugin.timerService && this.plugin.timerService.isSwitchPending();
			if (this.plugin.activeWrites > 0 || this.plugin.isRotating || isSwitchPending || Date.now() - this.plugin.lastLocalWriteTime < 1500) {
				return;
			}
		}

		try {
			const dbTimers: Timer[] = await this.plugin.db.select("timers", "order=sort_order.asc,created_at.asc");
			let dbSegments: TimerSegment[] = [];
			try {
				dbSegments = await this.plugin.db.select("timer_segments", "order=started_at.asc");
			} catch (e) {
				console.error("Failed to load segments", e);
				dbSegments = (this.plugin.timers || []).flatMap(t => t.segments || []);
			}

			const runningTimers = dbTimers.filter(t => t.is_running);
			if (runningTimers.length > 1) {
				runningTimers.sort((a, b) => {
					const timeA = a.last_started_at ? new Date(a.last_started_at).getTime() : 0;
					const timeB = b.last_started_at ? new Date(b.last_started_at).getTime() : 0;
					return timeB - timeA;
				});

				const activeTimer = runningTimers[0];
				if (activeTimer) {
					const endCutoffIso = activeTimer.last_started_at || this.plugin.getCalibratedISOString();
					const endMs = new Date(endCutoffIso).getTime();
					const conflicting = runningTimers.slice(1);

					for (const st of conflicting) {
						if (st.last_started_at) {
							const startMs = new Date(st.last_started_at).getTime();
							const dur = Math.max(0, Math.floor((endMs - startMs) / 1000));
							if (dur > 0 && endMs > startMs) {
								const conflictSeg: TimerSegment = {
									id: generateUUID(),
									timer_id: st.id,
									started_at: st.last_started_at,
									ended_at: endCutoffIso,
									duration_seconds: dur
								};
								await this.plugin.db.insert("timer_segments", conflictSeg).catch(() => {});
								dbSegments.push(conflictSeg);
							}
						}

						st.is_running = false;
						st.is_rotation_running = false;
						st.last_started_at = null;
						this.plugin.db.update("timers", {
							is_running: false,
							is_rotation_running: false,
							last_started_at: null
						}, `id=eq.${st.id}`).catch(() => {});
					}
				}
			}

			// Cleanly calculate tracked time preserving all manual and overlapping segments
			this.plugin.timers = dbTimers.map(dbTimer => {
				const segments = dbSegments.filter(s => s.timer_id === dbTimer.id);
				const segSum = segments.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
				const finalTracked = segments.length > 0 ? segSum : (dbTimer.tracked_seconds || 0);

				return {
					...dbTimer,
					tracked_seconds: finalTracked,
					segments
				};
			});

			this.updateCompletionNotifications();
			await this.persistLocalState();
		} catch (e) {
			console.warn("Could not fetch timers from Supabase (offline or network error):", e);
			if (this.plugin.timers.length === 0 && this.plugin.settings.localTimersCache && this.plugin.settings.localTimersCache.length > 0) {
				this.plugin.timers = this.plugin.settings.localTimersCache;
				this.updateCompletionNotifications();
			}
		}
	}

	private updateCompletionNotifications() {
		for (const t of this.plugin.timers) {
			const { tracked, estimate } = this.plugin.getTimerDisplayTimes(t);
			if (estimate > 0 && tracked >= estimate) {
				this.plugin.notifiedCompletes.add(t.id);
			} else {
				this.plugin.notifiedCompletes.delete(t.id);
			}
		}
	}

	public async loadSessions() {
		if (!navigator.onLine) return;
		try {
			const sessionRows = await this.plugin.db.select("timer_sessions", "order=completed_at.desc&limit=30");
			const entries = await this.plugin.db.select("timer_session_entries", "");
			this.plugin.sessions = sessionRows.map((s: any) => ({
				...s,
				entries: entries.filter((e: any) => e.session_id === s.id),
			}));
		} catch {}
	}
}