import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import { Timer, ICONS } from "./types";
import { TimeLogModal } from "./modal";
import ProductivityTimerPlugin from "./main";

export const VIEW_TYPE_PRODUCTIVITY_TIMER = "productivity-timer-view";

export class ProductivityTimerView extends ItemView {
	private plugin: ProductivityTimerPlugin;
	private showArchive = false;
	private contentWrapper: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: ProductivityTimerPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return VIEW_TYPE_PRODUCTIVITY_TIMER;
	}

	getDisplayText(): string {
		return "Productivity Timer";
	}

	getIcon(): string {
		return "clock";
	}

	async onOpen() {
		this.contentWrapper = this.containerEl.children[1] as HTMLElement;
		this.render();
	}

	public renderTimerRowsOnly() {
		if (!this.contentWrapper) return;
		const flattened = this.plugin.getFlattenedRenderedTimers();
		const rows = this.contentWrapper.querySelectorAll(".pt-row");
		rows.forEach((row, i) => {
			const timer = flattened[i];
			if (!timer) return;
			const { tracked } = this.plugin.getTimerDisplayTimes(timer);

			const trackedInput = row.querySelector(".pt-tracked-input") as HTMLInputElement;
			if (trackedInput && document.activeElement !== trackedInput) {
				trackedInput.value = tracked > 0 ? this.plugin.formatTime(tracked) : "0s";
			}

			const isAnyActive = timer.is_running || timer.is_rotation_running;
			row.classList.toggle("pt-row--running", isAnyActive);

			const playBtn = row.querySelector(".pt-btn--play");
			if (playBtn) {
				playBtn.classList.toggle("pt-btn--active", timer.is_running);
				playBtn.innerHTML = timer.is_running ? ICONS.pause : ICONS.play;
			}

			const rotationBtn = row.querySelector(".pt-btn--rotation");
			if (rotationBtn) {
				rotationBtn.classList.toggle("pt-btn--active", timer.is_rotation_running);
				rotationBtn.innerHTML = timer.is_rotation_running ? ICONS.pause : ICONS.loop;
			}
		});
		const rollupTracked = this.contentWrapper.querySelector(".pt-rollup-tracked");
		if (rollupTracked) rollupTracked.textContent = this.plugin.formatTime(this.plugin.totalTracked());
	}

	public render() {
		if (!this.contentWrapper) return;
		this.contentWrapper.empty();

		this.contentWrapper.classList.add("pt-mobile-wrapper");

		const body = this.contentWrapper.createDiv({ cls: "pt-body" });

		const actions = body.createDiv({ cls: "pt-actions" });
		const addBtn = actions.createEl("button", { cls: "pt-btn pt-btn--add", text: "+ Add Timer" });
		addBtn.addEventListener("click", () => this.plugin.addTimer());

		const completeBtn = actions.createEl("button", { cls: "pt-btn pt-btn--complete", text: "Done" });
		completeBtn.addEventListener("click", () => this.plugin.completeAll());

		const archiveBtn = actions.createEl("button", { cls: "pt-btn pt-btn--archive", text: this.showArchive ? "Hide Archive" : "Archive" });
		archiveBtn.addEventListener("click", () => { this.showArchive = !this.showArchive; this.render(); });

		const rollup = body.createDiv({ cls: "pt-rollup" });
		rollup.createEl("span", { cls: "pt-rollup-label", text: "Total" });
		const rollupRight = rollup.createDiv({ cls: "pt-rollup-right" });
		rollupRight.createEl("span", { cls: "pt-rollup-tracked", text: this.plugin.formatTime(this.plugin.totalTracked()) });
		rollupRight.createEl("span", { cls: "pt-rollup-divider", text: "/" });
		rollupRight.createEl("span", { cls: "pt-rollup-estimate", text: this.plugin.formatTime(this.plugin.totalEstimate()) });

		const timerRows = body.createDiv({ cls: "pt-timer-rows" });
		this.buildTimerRows(timerRows);

		if (this.showArchive) {
			const archive = body.createDiv({ cls: "pt-archive" });
			archive.createEl("h5", { cls: "pt-archive-title", text: "Archive" });
			if (this.plugin.sessions.length === 0) {
				archive.createEl("p", { cls: "pt-empty", text: "No completed sessions yet." });
			}
			for (const session of this.plugin.sessions) {
				const sessionEl = archive.createDiv({ cls: "pt-session" });
				const sessionHeader = sessionEl.createDiv({ cls: "pt-session-header" });
				sessionHeader.createEl("span", { cls: "pt-session-date", text: this.plugin.formatDate(session.completed_at) });
				const delBtn = sessionHeader.createEl("button", { cls: "pt-btn pt-btn--delete" });
				delBtn.innerHTML = ICONS.trash;
				delBtn.addEventListener("click", () => this.plugin.deleteSession(session));
				for (const entry of session.entries) {
					const entryEl = sessionEl.createDiv({ cls: "pt-session-entry" });
					entryEl.createEl("span", { cls: "pt-session-name", text: entry.timer_name });
					entryEl.createEl("span", { cls: "pt-session-tracked", text: this.plugin.formatTime(entry.tracked_seconds) });
					entryEl.createEl("span", { cls: "pt-session-divider", text: "/" });
					entryEl.createEl("span", { cls: "pt-session-estimate", text: this.plugin.formatTime(entry.estimate_seconds) });
				}
			}
		}
	}

	private buildTimerRows(container: HTMLElement) {
		const parents = this.plugin.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			this.renderRow(container, parent);
			if (!this.plugin.collapsedParentIds.has(parent.id)) {
				const subtasks = this.plugin.timers.filter(t => t.parent_id === parent.id);
				for (const sub of subtasks) {
					this.renderRow(container, sub);
				}
			}
		}
	}

	private renderRow(container: HTMLElement, timer: Timer) {
		const isSubtask = timer.parent_id !== null;
		const row = container.createDiv({
			cls: `pt-row ${isSubtask ? "pt-row--subtask" : ""} ${timer.is_running || timer.is_rotation_running ? "pt-row--running" : ""}`
		});

		// Create Top Line (Controls, play, name, right actions) and Bottom Line (Metrics)
		const rowTop = row.createDiv({ cls: "pt-row-top" });
		const rowBottom = row.createDiv({ cls: "pt-row-bottom" });

		// 1. Collapse toggle (Top Line)
		if (!isSubtask) {
			const subtasks = this.plugin.timers.filter(t => t.parent_id === timer.id);
			if (subtasks.length > 0) {
				const isCollapsed = this.plugin.collapsedParentIds.has(timer.id);
				const toggleBtn = rowTop.createEl("span", {
					cls: "pt-collapse-toggle",
					text: isCollapsed ? "▸" : "▾",
					title: isCollapsed ? "Expand subtasks" : "Collapse subtasks"
				});
				toggleBtn.addEventListener("click", (e) => {
					e.stopPropagation();
					if (isCollapsed) {
						this.plugin.collapsedParentIds.delete(timer.id);
					} else {
						this.plugin.collapsedParentIds.add(timer.id);
					}
					this.render();
				});
			} else {
				rowTop.createEl("span", { cls: "pt-collapse-spacer" });
			}
		} else {
			rowTop.createEl("span", { cls: "pt-collapse-spacer" });
		}

		// 2. Play Button (Top Line)
		const playBtn = rowTop.createEl("button", {
			cls: `pt-btn pt-btn--play ${timer.is_running ? "pt-btn--active" : ""}`,
			title: "Play timer"
		});
		playBtn.innerHTML = timer.is_running ? ICONS.pause : ICONS.play;
		playBtn.addEventListener("click", () => {
			if (isSubtask) {
				this.plugin.playSubtaskDirectly(timer);
			} else {
				this.plugin.playParent(timer);
			}
		});

		// 3. Name Element (Top Line - takes up remaining space)
		const nameEl = rowTop.createEl("span", { cls: "pt-name", text: timer.name });
		nameEl.contentEditable = "true";
		nameEl.addEventListener("blur", async () => {
			const newName = nameEl.textContent?.trim();
			if (newName && newName !== timer.name) {
				await this.plugin.runWriteAction(async () => {
					await this.plugin.db.update("timers", { name: newName }, `id=eq.${timer.id}`);
					timer.name = newName;
					await this.plugin.loadTimers();
				});
			}
		});
		nameEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") { e.preventDefault(); nameEl.blur(); }
		});

		// 4. Action Buttons Container (Right Top Line)
		const rightActions = rowTop.createDiv({ cls: "pt-row-right-actions" });

		const addSubtaskBtn = rightActions.createEl("button", {
			cls: "pt-btn pt-btn--add-subtask",
			title: "Add Subtask"
		});
		addSubtaskBtn.innerHTML = ICONS.plus;
		if (isSubtask) {
			addSubtaskBtn.style.opacity = "0";
			addSubtaskBtn.style.pointerEvents = "none";
		} else {
			addSubtaskBtn.addEventListener("click", () => this.plugin.addSubtask(timer));
		}

		const rotationBtn = rightActions.createEl("button", {
			cls: `pt-btn pt-btn--rotation ${timer.is_rotation_running ? "pt-btn--active" : ""}`,
			title: "Toggle Subtask Rotation"
		});
		rotationBtn.innerHTML = timer.is_rotation_running ? ICONS.pause : ICONS.loop;
		const subtasks = this.plugin.timers.filter(t => t.parent_id === timer.id);
		if (isSubtask || subtasks.length === 0) {
			rotationBtn.style.opacity = "0";
			rotationBtn.style.pointerEvents = "none";
		} else {
			rotationBtn.addEventListener("click", () => this.plugin.toggleRotation(timer));
		}

		const deleteBtn = rightActions.createEl("button", { cls: "pt-btn pt-btn--delete", title: "Delete task" });
		deleteBtn.innerHTML = ICONS.trash;
		deleteBtn.addEventListener("click", () => this.plugin.deleteTimer(timer));

		// ── Row Bottom Content ──

		// 5. Metrics Container (Takes up the entire bottom line)
		const metricsContainer = rowBottom.createDiv({ cls: "pt-metrics-container" });
		const { tracked, estimate } = this.plugin.getTimerDisplayTimes(timer);

		// Tracked duration
		const trackedField = metricsContainer.createDiv({ cls: "pt-metric-field" });
		trackedField.createEl("span", { text: "Time:" });
		const trackedInput = trackedField.createEl("input", { cls: "pt-tracked-input", type: "text", value: tracked > 0 ? this.plugin.formatTime(tracked) : "0s" });
		trackedInput.readOnly = true;
		trackedInput.addEventListener("click", () => {
			new TimeLogModal(
				this.plugin.app, 
				() => this.plugin.timers.find(t => t.id === timer.id)!, 
				this.plugin.db, 
				async () => {
					await this.plugin.loadTimers();
					this.plugin.refreshUI();
				}
			).open();
		});

		// Estimate input
		const estField = metricsContainer.createDiv({ cls: "pt-metric-field" });
		estField.createEl("span", { text: "Est:" });
		const estimateInput = estField.createEl("input", { cls: "pt-estimate-input", type: "text" });
		estimateInput.value = estimate > 0 ? this.plugin.formatTime(estimate) : "";
		estimateInput.placeholder = "0h 00m";
		
		const sumEstimate = this.plugin.timers.filter(t => t.parent_id === timer.id).reduce((sum, s) => sum + s.estimate_seconds, 0);
		estimateInput.addEventListener("blur", async () => {
			const parsed = this.plugin.parseTimeInput(estimateInput.value);
			if (parsed !== null) {
				await this.plugin.runWriteAction(async () => {
					if (isSubtask) {
						if (parsed !== timer.estimate_seconds) {
							timer.estimate_seconds = parsed;
							await this.plugin.db.update("timers", { estimate_seconds: parsed }, `id=eq.${timer.id}`);
						}
					} else {
						const newParentEstimate = Math.max(0, parsed - (sumEstimate || 0));
						if (newParentEstimate !== timer.estimate_seconds) {
							timer.estimate_seconds = newParentEstimate;
							await this.plugin.db.update("timers", { estimate_seconds: newParentEstimate }, `id=eq.${timer.id}`);
						}
					}
					await this.plugin.loadTimers();
					const { estimate: latestEstimate } = this.plugin.getTimerDisplayTimes(timer);
					estimateInput.value = latestEstimate > 0 ? this.plugin.formatTime(latestEstimate) : "";
				});
			}
		});
		estimateInput.addEventListener("keydown", (e) => { if (e.key === "Enter") estimateInput.blur(); });
	}

	async onClose() {
		this.contentWrapper.empty();
	}
}