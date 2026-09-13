import { Notice } from "obsidian";
import { Timer, TimerSegment, generateUUID } from "./types";
import ProductivityTimerPlugin from "./main";

interface DBTimerPayload {
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
}

function toDBTimerPayload(timer: Partial<Timer> & { id: string }): DBTimerPayload {
	return {
		id: timer.id,
		parent_id: timer.parent_id ?? null,
		name: timer.name ?? "New Timer",
		estimate_seconds: timer.estimate_seconds ?? 0,
		tracked_seconds: timer.tracked_seconds ?? 0,
		is_running: timer.is_running ?? false,
		rotation_enabled: timer.rotation_enabled ?? false,
		is_rotation_running: timer.is_rotation_running ?? false,
		is_last_active: timer.is_last_active ?? false,
		sort_order: timer.sort_order ?? 0,
		last_started_at: timer.last_started_at ?? null
	};
}

export class TimerService {
	private plugin: ProductivityTimerPlugin;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
	}

	private stopLocalRunningTimers(nowStr: string): { segmentsToInsert: TimerSegment[]; timersToUpdate: { id: string; tracked_seconds: number }[] } {
		const nowMs = new Date(nowStr).getTime();
		const segmentsToInsert: TimerSegment[] = [];
		const timersToUpdate: { id: string; tracked_seconds: number }[] = [];

		for (const t of this.plugin.timers) {
			if (t.is_running || t.is_rotation_running) {
				if (t.is_running && t.last_started_at) {
					const startMs = new Date(t.last_started_at).getTime();
					const dur = Math.max(0, Math.floor((nowMs - startMs) / 1000));
					if (dur > 0) {
						const newSeg: TimerSegment = {
							id: generateUUID(),
							timer_id: t.id,
							started_at: t.last_started_at,
							ended_at: nowStr,
							duration_seconds: dur
						};
						t.segments = t.segments || [];
						t.segments.push(newSeg);
						t.tracked_seconds = t.segments.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
						segmentsToInsert.push(newSeg);
						timersToUpdate.push({ id: t.id, tracked_seconds: t.tracked_seconds });
					}
				}
				t.is_running = false;
				t.is_rotation_running = false;
				t.last_started_at = null;
				t.visual_seconds = undefined;
			}
		}

		return { segmentsToInsert, timersToUpdate };
	}

	private async stopServerRunningTimers(excludeTimerId: string | null = null): Promise<void> {
		const nowStr = this.plugin.getCalibratedISOString();
		const nowMs = new Date(nowStr).getTime();

		let serverRunning: Timer[] = [];
		try {
			serverRunning = await this.plugin.db.select("timers", "or=(is_running.eq.true,is_rotation_running.eq.true)");
		} catch {
			serverRunning = [];
		}

		for (const s of serverRunning) {
			if (excludeTimerId && s.id === excludeTimerId) continue;

			let dur = 0;
			if (s.last_started_at) {
				const startMs = new Date(s.last_started_at).getTime();
				if (!isNaN(startMs) && nowMs > startMs) {
					dur = Math.max(0, Math.floor((nowMs - startMs) / 1000));
				}
			}

			const local = this.plugin.timers.find(t => t.id === s.id);
			const currentSegments = local?.segments || s.segments || [];

			if (dur > 0 && s.last_started_at) {
				const alreadyLogged = currentSegments.some(seg =>
					Math.abs(new Date(seg.started_at).getTime() - new Date(s.last_started_at!).getTime()) < 2000
				);

				if (!alreadyLogged) {
					const newSeg: TimerSegment = {
						id: generateUUID(),
						timer_id: s.id,
						started_at: s.last_started_at,
						ended_at: nowStr,
						duration_seconds: dur
					};
					if (local) {
						local.segments = local.segments || [];
						local.segments.push(newSeg);
					}
					await this.plugin.db.insert("timer_segments", newSeg);
				}
			}

			const allSegs = local?.segments || currentSegments;
			const finalTracked = allSegs.length > 0
				? allSegs.reduce((sum, seg) => sum + (seg.duration_seconds || 0), 0)
				: (s.tracked_seconds + dur);

			if (local) {
				local.is_running = false;
				local.is_rotation_running = false;
				local.last_started_at = null;
				local.tracked_seconds = finalTracked;
			}

			await this.plugin.db.update("timers", {
				is_running: false,
				is_rotation_running: false,
				tracked_seconds: finalTracked,
				last_started_at: null
			}, `id=eq.${s.id}`);
		}
	}

	public async stopAllTimers() {
		const nowStr = this.plugin.getCalibratedISOString();
		const { segmentsToInsert, timersToUpdate } = this.stopLocalRunningTimers(nowStr);

		for (const seg of segmentsToInsert) {
			await this.plugin.db.insert("timer_segments", seg);
		}
		for (const upd of timersToUpdate) {
			await this.plugin.db.update("timers", {
				is_running: false,
				is_rotation_running: false,
				last_started_at: null,
				tracked_seconds: upd.tracked_seconds
			}, `id=eq.${upd.id}`);
		}
		await this.stopServerRunningTimers(null);
	}

	public async playParent(parent: Timer) {
		await this.plugin.runWriteAction(async () => {
			const target = this.plugin.timers.find(t => t.id === parent.id) || parent;
			const wasRunning = target.is_running;
			const nowStr = this.plugin.getCalibratedISOString();

			const { segmentsToInsert, timersToUpdate } = this.stopLocalRunningTimers(nowStr);

			if (!wasRunning) {
				target.is_running = true;
				target.last_started_at = nowStr;
			}
			this.plugin.refreshUI();

			for (const seg of segmentsToInsert) {
				await this.plugin.db.insert("timer_segments", seg);
			}
			for (const upd of timersToUpdate) {
				await this.plugin.db.update("timers", {
					is_running: false,
					is_rotation_running: false,
					last_started_at: null,
					tracked_seconds: upd.tracked_seconds
				}, `id=eq.${upd.id}`);
			}

			await this.stopServerRunningTimers(wasRunning ? null : target.id);

			if (!wasRunning) {
				await this.plugin.db.update("timers", {
					is_running: true,
					last_started_at: nowStr
				}, `id=eq.${target.id}`);
			}

			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async playSubtaskDirectly(subtask: Timer) {
		await this.plugin.runWriteAction(async () => {
			const target = this.plugin.timers.find(t => t.id === subtask.id) || subtask;
			const wasRunning = target.is_running;
			const nowStr = this.plugin.getCalibratedISOString();

			const { segmentsToInsert, timersToUpdate } = this.stopLocalRunningTimers(nowStr);

			if (!wasRunning) {
				target.is_running = true;
				target.is_last_active = true;
				target.last_started_at = nowStr;

				const siblings = this.plugin.timers.filter(t => t.parent_id === target.parent_id && t.id !== target.id);
				for (const sib of siblings) sib.is_last_active = false;
			}
			this.plugin.refreshUI();

			for (const seg of segmentsToInsert) {
				await this.plugin.db.insert("timer_segments", seg);
			}
			for (const upd of timersToUpdate) {
				await this.plugin.db.update("timers", {
					is_running: false,
					is_rotation_running: false,
					last_started_at: null,
					tracked_seconds: upd.tracked_seconds
				}, `id=eq.${upd.id}`);
			}

			await this.stopServerRunningTimers(wasRunning ? null : target.id);

			if (!wasRunning) {
				await this.plugin.db.update("timers", {
					is_running: true,
					is_last_active: true,
					last_started_at: nowStr
				}, `id=eq.${target.id}`);

				const siblings = this.plugin.timers.filter(t => t.parent_id === target.parent_id && t.id !== target.id);
				await Promise.all(siblings.map(sib =>
					this.plugin.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
				));
			}

			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async toggleRotation(parent: Timer) {
		const target = this.plugin.timers.find(t => t.id === parent.id) || parent;
		const subtasks = this.plugin.timers.filter(t => t.parent_id === target.id).sort((a, b) => a.sort_order - b.sort_order);
		if (subtasks.length === 0) {
			new Notice("Add subtasks first before starting rotation.");
			return;
		}

		await this.plugin.runWriteAction(async () => {
			const wasRotationRunning = target.is_rotation_running;
			const nowStr = this.plugin.getCalibratedISOString();
			const activeSub = subtasks.find(t => t.is_last_active) || subtasks[0];
			if (!activeSub) return;

			const { segmentsToInsert, timersToUpdate } = this.stopLocalRunningTimers(nowStr);

			if (!wasRotationRunning) {
				target.is_rotation_running = true;
				for (const sub of subtasks) {
					if (sub.id !== activeSub.id) sub.is_last_active = false;
				}
				activeSub.is_running = true;
				activeSub.is_last_active = true;
				activeSub.last_started_at = nowStr;
			}
			this.plugin.refreshUI();

			for (const seg of segmentsToInsert) {
				await this.plugin.db.insert("timer_segments", seg);
			}
			for (const upd of timersToUpdate) {
				await this.plugin.db.update("timers", {
					is_running: false,
					is_rotation_running: false,
					last_started_at: null,
					tracked_seconds: upd.tracked_seconds
				}, `id=eq.${upd.id}`);
			}

			await this.stopServerRunningTimers(wasRotationRunning ? null : activeSub.id);

			if (!wasRotationRunning) {
				await this.plugin.db.update("timers", { is_rotation_running: true }, `id=eq.${target.id}`);
				await this.plugin.db.update("timers", {
					is_running: true,
					is_last_active: true,
					last_started_at: nowStr
				}, `id=eq.${activeSub.id}`);

				const sibs = subtasks.filter(s => s.id !== activeSub.id);
				await Promise.all(sibs.map(s => this.plugin.db.update("timers", { is_last_active: false }, `id=eq.${s.id}`)));
			} else {
				await this.plugin.db.update("timers", { is_rotation_running: false }, `id=eq.${target.id}`);
			}

			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async addTimer() {
		await this.plugin.runWriteAction(async () => {
			const maxSort = this.plugin.timers
				.filter(t => t.parent_id === null)
				.reduce((max, t) => Math.max(max, t.sort_order || 0), 0);

			const newId = generateUUID();
			const dbPayload = toDBTimerPayload({
				id: newId,
				parent_id: null,
				name: "New Timer",
				sort_order: maxSort + 1
			});

			const newTimer: Timer = {
				...dbPayload,
				segments: []
			};

			this.plugin.timers.push(newTimer);
			this.plugin.refreshUI();

			await this.plugin.db.insert("timers", dbPayload);
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async addSubtask(parent: Timer) {
		await this.plugin.runWriteAction(async () => {
			const maxSort = this.plugin.timers
				.filter(t => t.parent_id === parent.id)
				.reduce((max, t) => Math.max(max, t.sort_order || 0), 0);

			const newId = generateUUID();
			const dbPayload = toDBTimerPayload({
				id: newId,
				parent_id: parent.id,
				name: "New Subtask",
				sort_order: maxSort + 1
			});

			const newSubtask: Timer = {
				...dbPayload,
				segments: []
			};

			this.plugin.timers.push(newSubtask);
			this.plugin.refreshUI();

			await this.plugin.db.insert("timers", dbPayload);
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async deleteTimer(timer: Timer) {
		await this.plugin.runWriteAction(async () => {
			this.plugin.timers = this.plugin.timers.filter(t => t.id !== timer.id && t.parent_id !== timer.id);
			this.plugin.refreshUI();

			await this.plugin.db.delete("timers", `id=eq.${timer.id}`);
			await this.plugin.syncManager.loadTimers();
			this.plugin.refreshUI();
		});
	}

	public async completeAll() {
		if (this.plugin.timers.length === 0) {
			new Notice("No timers to complete.");
			return;
		}

		await this.plugin.runWriteAction(async () => {
			await this.stopAllTimers();

			const sessionResult = await this.plugin.db.insert("timer_sessions", {
				id: generateUUID(),
				date: new Date().toISOString().split("T")[0],
				completed_at: this.plugin.getCalibratedISOString(),
			});
			const session = Array.isArray(sessionResult) ? sessionResult[0] : sessionResult;

			if (!session) {
				new Notice("Failed to complete session.");
				return;
			}

			const entries = this.plugin.timers.map(timer => {
				let entryName = timer.name;
				if (timer.parent_id) {
					const parent = this.plugin.timers.find(p => p.id === timer.parent_id);
					if (parent) entryName = `${parent.name} > ${timer.name}`;
				}
				return {
					id: generateUUID(),
					session_id: session.id,
					timer_name: entryName,
					estimate_seconds: timer.estimate_seconds,
					tracked_seconds: this.plugin.getTimerDisplayTimes(timer).tracked,
				};
			});
			await this.plugin.db.insert("timer_session_entries", entries);

			const timerIdList = this.plugin.timers.map(t => t.id).join(",");
			await this.plugin.db.delete("timer_segments", `timer_id=in.(${timerIdList})`);

			await this.plugin.db.update("timers", {
				tracked_seconds: 0,
				is_running: false,
				is_rotation_running: false,
				is_last_active: false,
				last_started_at: null
			}, `id=in.(${timerIdList})`);

			for (const timer of this.plugin.timers) {
				timer.tracked_seconds = 0;
				timer.is_running = false;
				timer.is_rotation_running = false;
				timer.is_last_active = false;
				timer.last_started_at = null;
				timer.visual_seconds = undefined;
				timer.segments = [];
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