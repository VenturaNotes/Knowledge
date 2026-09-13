import { Notice } from "obsidian";
import { Timer, TimerSegment, generateUUID } from "./types";
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

		const actions = [...this.plugin.settings.offlineQueue];
		new Notice(`Syncing ${actions.length} offline actions with Supabase...`);

		while (actions.length > 0) {
			const act = actions[0];
			if (!act) {
				actions.shift();
				continue;
			}

			// Clean any legacy client-only properties from queued payloads
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
				actions.shift();
				this.plugin.settings.offlineQueue = [...actions];
				await this.plugin.saveSettings();
			} catch (e) {
				console.error("Offline sync error on action:", act, e);
				actions.shift(); // discard corrupted action so queue is not blocked
				this.plugin.settings.offlineQueue = [...actions];
				await this.plugin.saveSettings();
			}
		}

		await this.loadTimers();
		await this.loadSessions();
		this.plugin.refreshUI();
	}

	public async loadTimers() {
		if (!navigator.onLine) {
			this.plugin.timers = this.plugin.settings.localTimersCache || [];
			this.updateCompletionNotifications();
			return;
		}

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

			const nowStr = this.plugin.getCalibratedISOString();
			const conflicting = runningTimers.slice(1);

			for (const st of conflicting) {
				if (st.last_started_at) {
					const startMs = new Date(st.last_started_at).getTime();
					const endMs = new Date(nowStr).getTime();
					const dur = Math.max(0, Math.floor((endMs - startMs) / 1000));
					if (dur > 0) {
						const conflictSeg: TimerSegment = {
							id: generateUUID(),
							timer_id: st.id,
							started_at: st.last_started_at,
							ended_at: nowStr,
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