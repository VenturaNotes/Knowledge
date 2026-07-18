import { Notice } from "obsidian";
import { Timer } from "./types";
import ProductivityTimerPlugin from "./main";

export class TimerService {
	private plugin: ProductivityTimerPlugin;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
	}

	public async runWriteAction(action: () => Promise<void>) {
		this.plugin.isWriting = true;
		try {
			await action();
			await this.plugin.syncManager.persistLocalState();
		} catch (e) {
			console.error("Write action failed:", e);
		} finally {
			setTimeout(() => {
				this.plugin.isWriting = false;
			}, 800);
		}
	}

	public async stopAllTimers() {
		const nowStr = this.plugin.getCalibratedISOString();
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

		await Promise.all(segmentsToRecord.map(seg => 
			this.plugin.db.insert("timer_segments", {
				timer_id: seg.timer_id,
				started_at: seg.started_at,
				ended_at: seg.ended_at,
				duration_seconds: seg.duration_seconds
			})
		));
	}

	public async playParent(parent: Timer) {
		const isPlaying = !parent.is_running;
		const timersToStop = this.plugin.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = this.plugin.getCalibratedISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
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

		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.plugin.getActiveTrackedSeconds(t);
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

		this.plugin.refreshUI();

		await this.runWriteAction(async () => {
			await Promise.all(segmentsToRecord.map(seg => 
				this.plugin.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

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
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async playSubtaskDirectly(subtask: Timer) {
		const isPlaying = !subtask.is_running;
		const timersToStop = this.plugin.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = this.plugin.getCalibratedISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
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

		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.plugin.getActiveTrackedSeconds(t);
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

		this.plugin.refreshUI();

		await this.runWriteAction(async () => {
			await Promise.all(segmentsToRecord.map(seg => 
				this.plugin.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

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
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async toggleRotation(parent: Timer) {
		const subtasks = this.plugin.timers.filter(t => t.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order);
		if (subtasks.length === 0) {
			new Notice("Add subtasks first before starting rotation.");
			return;
		}
		const isPlaying = !parent.is_rotation_running;
		const timersToStop = this.plugin.timers.filter(t => t.is_running || t.is_rotation_running);
		const nowStr = this.plugin.getCalibratedISOString();

		const segmentsToRecord = timersToStop.filter(t => t.is_running && t.last_started_at).map(t => {
			const start = t.last_started_at as string;
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

		for (const t of timersToStop) {
			const segment = segmentsToRecord.find(s => s.timer_id === t.id);
			if (segment) {
				t.tracked_seconds = t.tracked_seconds + segment.duration_seconds;
			} else {
				t.tracked_seconds = this.plugin.getActiveTrackedSeconds(t);
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
			this.plugin.lastWriteTimes.set(t.id, {
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

		this.plugin.refreshUI();

		await this.runWriteAction(async () => {
			await Promise.all(segmentsToRecord.map(seg => 
				this.plugin.db.insert("timer_segments", {
					timer_id: seg.timer_id,
					started_at: seg.started_at,
					ended_at: seg.ended_at,
					duration_seconds: seg.duration_seconds
				})
			));

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

				const siblings = this.plugin.timers.filter(t => t.parent_id === activeSub.parent_id && t.id !== activeSub.id);
				await Promise.all(siblings.map(sib => 
					this.plugin.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));

				await this.plugin.db.update("timers", { is_running: true, is_last_active: true, last_started_at: activeSub.last_started_at }, `id=eq.${activeSub.id}`);
			}
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async addTimer() {
		await this.runWriteAction(async () => {
			const maxSort = this.plugin.timers.filter(t => t.parent_id === null).reduce((max, t) => Math.max(max, t.sort_order || 0), 0);
			await this.plugin.db.insert("timers", {
				name: "New Timer",
				estimate_seconds: 0,
				tracked_seconds: 0,
				is_running: false,
				sort_order: maxSort + 1
			});
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async addSubtask(parent: Timer) {
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
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async deleteTimer(timer: Timer) {
		await this.runWriteAction(async () => {
			if (timer.is_running) {
				await this.plugin.db.update("timers", { is_running: false }, `id=eq.${timer.id}`);
			}
			await this.plugin.db.delete("timers", `id=eq.${timer.id}`);
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async completeAll() {
		if (this.plugin.timers.length === 0) { new Notice("No timers to complete."); return; }
		await this.runWriteAction(async () => {
			await this.stopAllTimers();
			const sessionResult = await this.plugin.db.insert("timer_sessions", {
				date: new Date().toISOString().split("T")[0],
				completed_at: this.plugin.getCalibratedISOString(),
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

				await this.plugin.db.delete("timer_segments", `timer_id=eq.${timer.id}`);

				await this.plugin.db.update("timers", {
					tracked_seconds: 0,
					is_running: false,
					is_rotation_running: false,
					is_last_active: false,
					last_started_at: null
				}, `id=eq.${timer.id}`);
			}
			await this.plugin.syncManager.loadTimers();
			await this.plugin.syncManager.loadSessions();
			new Notice("Session completed and archived.");
			this.plugin.refreshUI();
		});
	}

	public async deleteSession(session: any) {
		try {
			await this.plugin.db.delete("timer_sessions", `id=eq.${session.id}`);
			this.plugin.sessions = this.plugin.sessions.filter(s => s.id !== session.id);
			this.plugin.refreshUI();
		} catch (e) {
			new Notice("Failed to delete session.");
		}
	}
}