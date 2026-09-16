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
	private switchDebounceTimeout: any = null;
	private pendingSegments: TimerSegment[] = [];

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
	}

	public isSwitchPending(): boolean {
		return this.switchDebounceTimeout !== null;
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
						const segSum = t.segments.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
						// Preserve any existing tracked time so a new segment never decreases the total
						t.tracked_seconds = Math.max(t.tracked_seconds || 0, segSum);
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

	public async flushPendingSwitch(): Promise<void> {
		if (this.switchDebounceTimeout) {
			window.clearTimeout(this.switchDebounceTimeout);
			this.switchDebounceTimeout = null;
			await this.commitTimerStateToServer();
		}
	}

	private scheduleServerCommit() {
		if (this.switchDebounceTimeout) {
			window.clearTimeout(this.switchDebounceTimeout);
		}

		this.switchDebounceTimeout = window.setTimeout(async () => {
			this.switchDebounceTimeout = null;
			await this.commitTimerStateToServer();
		}, 200);
	}

	private async commitTimerStateToServer(): Promise<void> {
		const segs = [...this.pendingSegments];
		this.pendingSegments = [];

		const runningTimer = this.plugin.timers.find((t) => t.is_running);
		const runningParent = this.plugin.timers.find((t) => t.is_rotation_running);
		const activeTimerId = runningTimer ? runningTimer.id : null;
		const activeParentId = runningParent ? runningParent.id : null;

		await this.plugin.runWriteAction(async () => {
			const promises: Promise<any>[] = [];

			// 1. Insert completed segments
			if (segs.length > 0) {
				promises.push(...segs.map((s) => this.plugin.db.insert("timer_segments", s)));
			}

			// 2. Sync running timer states on server
			if (activeTimerId && runningTimer) {
				promises.push(
					this.plugin.db.update(
						"timers",
						{
							is_running: true,
							is_last_active: true,
							last_started_at: runningTimer.last_started_at ?? this.plugin.getCalibratedISOString(),
							tracked_seconds: runningTimer.tracked_seconds
						},
						`id=eq.${activeTimerId}`
					),
					this.plugin.db.update(
						"timers",
						{ is_running: false, last_started_at: null },
						`is_running=eq.true&id=neq.${activeTimerId}`
					)
				);

				if (runningTimer.parent_id) {
					const siblings = this.plugin.timers.filter(
						(t) => t.parent_id === runningTimer.parent_id && t.id !== runningTimer.id
					);
					promises.push(...siblings.map((sib) =>
						this.plugin.db.update("timers", { is_last_active: false }, `id=eq.${sib.id}`)
					));
				}
			} else {
				promises.push(
					this.plugin.db.update(
						"timers",
						{ is_running: false, last_started_at: null },
						"is_running=eq.true"
					)
				);
			}

			// 3. Sync rotation parent states on server
			if (activeParentId) {
				promises.push(
					this.plugin.db.update("timers", { is_rotation_running: true }, `id=eq.${activeParentId}`),
					this.plugin.db.update("timers", { is_rotation_running: false }, `is_rotation_running=eq.true&id=neq.${activeParentId}`)
				);
			} else {
				promises.push(
					this.plugin.db.update("timers", { is_rotation_running: false }, "is_rotation_running=eq.true")
				);
			}

			// 4. Update tracked_seconds for stopped timers
			const stoppedTimerIds = [...new Set(segs.map((s) => s.timer_id))];
			for (const tid of stoppedTimerIds) {
				const timer = this.plugin.timers.find((t) => t.id === tid);
				if (timer && timer.id !== activeTimerId) {
					promises.push(
						this.plugin.db.update("timers", { tracked_seconds: timer.tracked_seconds }, `id=eq.${tid}`)
					);
				}
			}

			await Promise.all(promises);
			this.plugin.refreshUI();
		});
	}

	public async stopAllTimers() {
		await this.flushPendingSwitch();
		const nowStr = this.plugin.getCalibratedISOString();
		const { segmentsToInsert } = this.stopLocalRunningTimers(nowStr);
		this.pendingSegments.push(...segmentsToInsert);
		this.plugin.refreshUI();
		await this.commitTimerStateToServer();
	}

	public playParent(timer: Timer) {
		const target = this.plugin.timers.find((t) => t.id === timer.id) || timer;
		const wasRunning = target.is_running;
		const nowStr = this.plugin.getCalibratedISOString();

		const { segmentsToInsert } = this.stopLocalRunningTimers(nowStr);
		this.pendingSegments.push(...segmentsToInsert);

		if (!wasRunning) {
			target.is_running = true;
			target.last_started_at = nowStr;
		}
		this.plugin.refreshUI();
		this.scheduleServerCommit();
	}

	public playSubtaskDirectly(subtask: Timer) {
		const target = this.plugin.timers.find((t) => t.id === subtask.id) || subtask;
		const wasRunning = target.is_running;
		const nowStr = this.plugin.getCalibratedISOString();

		const { segmentsToInsert } = this.stopLocalRunningTimers(nowStr);
		this.pendingSegments.push(...segmentsToInsert);

		if (!wasRunning) {
			target.is_running = true;
			target.is_last_active = true;
			target.last_started_at = nowStr;

			const siblings = this.plugin.timers.filter(
				(t) => t.parent_id === target.parent_id && t.id !== target.id
			);
			for (const sib of siblings) sib.is_last_active = false;
		}
		this.plugin.refreshUI();
		this.scheduleServerCommit();
	}

	public async toggleRotation(parent: Timer) {
		const target = this.plugin.timers.find((t) => t.id === parent.id) || parent;
		const subtasks = this.plugin.timers
			.filter((t) => t.parent_id === target.id)
			.sort((a, b) => a.sort_order - b.sort_order);

		if (subtasks.length === 0) {
			new Notice("Add subtasks first before starting rotation.");
			return;
		}

		const wasRotationRunning = target.is_rotation_running;
		const nowStr = this.plugin.getCalibratedISOString();
		const activeSub = subtasks.find((t) => t.is_last_active) || subtasks[0];
		if (!activeSub) return;

		const { segmentsToInsert } = this.stopLocalRunningTimers(nowStr);
		this.pendingSegments.push(...segmentsToInsert);

		if (!wasRotationRunning) {
			target.is_rotation_running = true;
			for (const sub of subtasks) {
				if (sub.id !== activeSub.id) sub.is_last_active = false;
			}
			activeSub.is_running = true;
			activeSub.is_last_active = true;
			activeSub.last_started_at = nowStr;
			this.plugin.refreshUI();
			this.scheduleServerCommit();
		} else {
			target.is_rotation_running = false;
			for (const sub of subtasks) {
				sub.is_running = false;
				sub.last_started_at = null;
				sub.visual_seconds = undefined;
			}
			this.plugin.refreshUI();
			await this.commitTimerStateToServer();
		}
	}

	public async addTimer() {
		await this.flushPendingSwitch();
		await this.plugin.runWriteAction(async () => {
			const maxSort = this.plugin.timers
				.filter((t) => t.parent_id === null)
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
		});
	}

	public async addSubtask(parent: Timer) {
		await this.flushPendingSwitch();
		await this.plugin.runWriteAction(async () => {
			const maxSort = this.plugin.timers
				.filter((t) => t.parent_id === parent.id)
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
		});
	}

	public async deleteTimer(timer: Timer) {
		await this.flushPendingSwitch();
		await this.plugin.runWriteAction(async () => {
			this.plugin.timers = this.plugin.timers.filter(
				(t) => t.id !== timer.id && t.parent_id !== timer.id
			);
			this.plugin.refreshUI();

			await this.plugin.db.delete("timers", `id=eq.${timer.id}`);
		});
	}

	public async completeAll() {
		await this.flushPendingSwitch();
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

			if (!session && navigator.onLine) {
				new Notice("Failed to complete session.");
				return;
			}

			const sessionId = session ? session.id : generateUUID();

			const entries = this.plugin.timers.map((timer) => {
				let entryName = timer.name;
				if (timer.parent_id) {
					const parent = this.plugin.timers.find((p) => p.id === timer.parent_id);
					if (parent) entryName = `${parent.name} > ${timer.name}`;
				}
				return {
					id: generateUUID(),
					session_id: sessionId,
					timer_name: entryName,
					estimate_seconds: timer.estimate_seconds,
					tracked_seconds: this.plugin.getTimerDisplayTimes(timer).tracked,
				};
			});
			await this.plugin.db.insert("timer_session_entries", entries);

			const timerIdList = this.plugin.timers.map((t) => t.id).join(",");
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

			if (navigator.onLine) {
				await this.plugin.syncManager.loadSessions();
			}
			new Notice("Session completed and archived.");
			this.plugin.refreshUI();
		});
	}

	public async deleteSession(session: any) {
		try {
			await this.plugin.db.delete("timer_sessions", `id=eq.${session.id}`);
			this.plugin.sessions = this.plugin.sessions.filter((s) => s.id !== session.id);
			this.plugin.refreshUI();
		} catch (e) {
			new Notice("Failed to delete session.");
		}
	}
}