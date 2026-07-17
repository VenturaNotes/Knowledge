import { Modal, App, Notice } from "obsidian";
import { Timer, TimerSegment } from "./types";
import { SupabaseClient } from "./db";

export class TimeLogModal extends Modal {
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
		this.titleEl.setText(`Logs: ${this.getTimer().name}`);
		this.renderLogs();

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

		const hMatch = input.match(/(\d+(?:\.\d+)?)\s*h(?:rs?)?/);
		if (hMatch && hMatch[1]) {
			totalSeconds += parseFloat(hMatch[1]) * 3600;
			matched = true;
		}

		const mMatch = input.match(/(\d+(?:\.\d+)?)\s*m(?:ins?)?/);
		if (mMatch && mMatch[1]) {
			totalSeconds += parseFloat(mMatch[1]) * 60;
			matched = true;
		}

		const sMatch = input.match(/(\d+)\s*s(?:ecs?)?/);
		if (sMatch && sMatch[1]) {
			totalSeconds += parseInt(sMatch[1]);
			matched = true;
		}

		if (matched) return Math.round(totalSeconds);

		const plainNum = parseFloat(input);
		if (!isNaN(plainNum)) {
			return Math.round(plainNum * 60);
		}

		return null;
	}

	private renderLogs() {
		const { contentEl } = this;
		contentEl.empty();

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

		manualInput.addEventListener("keydown", async (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				await submitManualLog();
			}
		});

		contentEl.createEl("h4", { text: "Time Entries History" });
		this.listContainer = contentEl.createDiv({ cls: "pt-modal-logs-list" });
		
		this.renderLogsListOnly();
	}

	private renderLogsListOnly() {
		if (!this.listContainer) return;
		this.listContainer.empty();

		const timer = this.getTimer();
		const segments = timer.segments || [];

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

			const elapsed = Math.floor((Date.now() - new Date(timer.last_started_at).getTime()) / 1000);
			durDisp.textContent = this.formatTime(elapsed);

			const stopBtn = activeRow.createEl("button", { cls: "pt-btn-del-seg", title: "Active timer running" });
			stopBtn.innerHTML = "⏸";
			stopBtn.style.opacity = "0.4";
			stopBtn.style.pointerEvents = "none";
		}

		if (segments.length === 0 && (!timer.is_running || !timer.last_started_at)) {
			this.listContainer.createEl("p", { cls: "pt-empty", text: "No logs recorded yet for this task." });
			return;
		}

		const sorted = [...segments].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

		for (const seg of sorted) {
			const row = this.listContainer.createDiv({ cls: "pt-modal-log-row" });
			const start = new Date(seg.started_at);
			const end = new Date(seg.ended_at);

			const startPicker = row.createEl("input", { type: "datetime-local" });
			startPicker.value = this.toLocalDateTimeString(start);

			row.createEl("span", { text: "to", cls: "pt-modal-to-label" });

			const endPicker = row.createEl("input", { type: "datetime-local" });
			endPicker.value = this.toLocalDateTimeString(end);

			const durDisp = row.createEl("span", { cls: "pt-modal-duration-badge", text: this.formatTime(seg.duration_seconds) });

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