import { Notice } from "obsidian";
import { Timer, ICONS } from "./types";
import { TimeLogModal } from "./modal";
import ProductivityTimerPlugin from "./main";

export class TimerUIRenderer {
	private plugin: ProductivityTimerPlugin;
	public showArchive = false;
	private draggedTimerId: string | null = null;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
	}

	public renderTimerRowsOnly(container: HTMLElement) {
		const flattened = this.plugin.getFlattenedRenderedTimers();
		const rows = container.querySelectorAll(".pt-row");

		if (rows.length !== flattened.length) {
			this.plugin.refreshUI();
			return;
		}

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

		const rollupInfo = this.plugin.getRollupDetails();
		const rollupTracked = container.querySelector(".pt-rollup-tracked");
		if (rollupTracked) rollupTracked.textContent = this.plugin.formatTime(rollupInfo.totalTrackedSeconds);
		const rollupEstimate = container.querySelector(".pt-rollup-estimate");
		if (rollupEstimate) rollupEstimate.textContent = this.plugin.formatTime(rollupInfo.totalEstimateSeconds);
		const rollupLeftDetails = container.querySelector(".pt-rollup-left-details");
		if (rollupLeftDetails) {
			rollupLeftDetails.textContent = ` (Left: ${this.plugin.formatTime(rollupInfo.totalTimeLeftSeconds)} - ${rollupInfo.month}/${rollupInfo.day} ${rollupInfo.doneTimeStr})`;
		}

		const runningInfo = this.plugin.getRunningTaskDetails();
		const runningLabel = container.querySelector(".pt-rollup--running-info .pt-rollup-label") as HTMLElement;
		if (runningLabel) runningLabel.textContent = runningInfo.name;
		const runningRightText = container.querySelector(".pt-rollup--running-info .pt-running-right-text");
		if (runningRightText) runningRightText.textContent = runningInfo.rightText;
	}

	public renderBody(body: HTMLElement, isMobile = false) {
		const actions = body.createDiv({ cls: "pt-actions" });
		actions.style.cssText = "display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 6px;";

		const actionsLeft = actions.createDiv({ cls: "pt-actions-left" });
		actionsLeft.style.cssText = "display: flex; gap: 6px; flex-wrap: wrap;";

		const addBtn = actionsLeft.createEl("button", { cls: "pt-btn pt-btn--add", text: "+ Add Timer" });
		addBtn.addEventListener("click", () => this.plugin.addTimer());

		const completeBtn = actionsLeft.createEl("button", { cls: "pt-btn pt-btn--complete", text: "Done" });
		completeBtn.addEventListener("click", () => this.plugin.completeAll());

		const archiveBtn = actionsLeft.createEl("button", { cls: "pt-btn pt-btn--archive", text: this.showArchive ? "Hide Archive" : "Archive" });
		archiveBtn.addEventListener("click", () => {
			this.showArchive = !this.showArchive;
			this.plugin.refreshUI();
		});

		const statusIndicator = actions.createDiv({ cls: "pt-status-indicator" });
		statusIndicator.style.cssText = "font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; margin-left: auto; border: 1px solid transparent;";
		if (navigator.onLine) {
			statusIndicator.textContent = "● Online";
			statusIndicator.style.color = "#10B981";
			statusIndicator.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
			statusIndicator.style.borderColor = "rgba(16, 185, 129, 0.2)";
		} else {
			statusIndicator.textContent = "● Offline";
			statusIndicator.style.color = "#F59E0B";
			statusIndicator.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
			statusIndicator.style.borderColor = "rgba(245, 158, 11, 0.2)";
		}

		// Rollup summary block
		const rollup = body.createDiv({ cls: "pt-rollup" });
		rollup.createEl("span", { cls: "pt-rollup-label", text: "Total" });
		const rollupRight = rollup.createDiv({ cls: "pt-rollup-right" });

		const rollupInfo = this.plugin.getRollupDetails();
		rollupRight.createEl("span", { cls: "pt-rollup-tracked", text: this.plugin.formatTime(rollupInfo.totalTrackedSeconds) });
		rollupRight.createEl("span", { cls: "pt-rollup-divider", text: "/" });
		rollupRight.createEl("span", { cls: "pt-rollup-estimate", text: this.plugin.formatTime(rollupInfo.totalEstimateSeconds) });
		
		const rollupLeftDetails = rollupRight.createEl("span", { 
			cls: "pt-rollup-left-details", 
			text: ` (Left: ${this.plugin.formatTime(rollupInfo.totalTimeLeftSeconds)} - ${rollupInfo.month}/${rollupInfo.day} ${rollupInfo.doneTimeStr})`
		});
		rollupLeftDetails.style.cssText = "font-size: 11px; color: var(--text-muted); margin-left: 6px; font-weight: normal;";

		// Active task status block
		const runningLine = body.createDiv({ cls: "pt-rollup pt-rollup--running-info" });
		runningLine.style.cssText = "border-left-color: var(--color-green);";
		
		const runningInfo = this.plugin.getRunningTaskDetails();
		const runningLabel = runningLine.createEl("span", { cls: "pt-rollup-label", text: runningInfo.name });
		runningLabel.style.cssText = "font-weight: 600; text-transform: none; font-size: 12px; color: var(--text-normal);";
		
		const runningRight = runningLine.createDiv({ cls: "pt-rollup-right" });
		const runningRightText = runningRight.createEl("span", { 
			cls: "pt-running-right-text", 
			text: runningInfo.rightText
		});
		runningRightText.style.cssText = "font-size: 12px; font-weight: 600; color: var(--text-muted);";

		// Timer Rows
		const timerRows = body.createDiv({ cls: "pt-timer-rows" });
		this.buildTimerRows(timerRows, isMobile);

		// Archive Section
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

	private buildTimerRows(container: HTMLElement, isMobile: boolean) {
		const parents = this.plugin.timers.filter(t => t.parent_id === null);
		for (const parent of parents) {
			this.renderRow(container, parent, isMobile);
			if (!this.plugin.collapsedParentIds.has(parent.id)) {
				const subtasks = this.plugin.timers.filter(t => t.parent_id === parent.id);
				for (const sub of subtasks) {
					this.renderRow(container, sub, isMobile);
				}
			}
		}
	}

	private renderRow(container: HTMLElement, timer: Timer, isMobile: boolean) {
		const isSubtask = timer.parent_id !== null;
		const row = container.createDiv({
			cls: `pt-row ${isSubtask ? "pt-row--subtask" : ""} ${timer.is_running || timer.is_rotation_running ? "pt-row--running" : ""}`
		});

		if (isMobile) {
			// Mobile Layout: Top row has controls + buttons; Bottom row has metrics
			const rowTop = row.createDiv({ cls: "pt-row-top" });
			const rowBottom = row.createDiv({ cls: "pt-row-bottom" });

			this.renderCollapseToggle(rowTop, timer, isSubtask);
			this.renderPlayButton(rowTop, timer, isSubtask);
			this.renderNameInput(rowTop, timer);
			this.renderRightActions(rowTop, timer, isSubtask);
			this.renderMetrics(rowBottom, timer);
		} else {
			// Desktop Layout: Single horizontal flex row with metrics BEFORE right actions
			this.setupDesktopDrag(row, timer);
			this.renderCollapseToggle(row, timer, isSubtask);
			this.renderPlayButton(row, timer, isSubtask);
			this.renderNameInput(row, timer);
			this.renderMetrics(row, timer);
			this.renderRightActions(row, timer, isSubtask);
		}
	}

	private setupDesktopDrag(row: HTMLElement, timer: Timer) {
		row.setAttribute("draggable", "false");
		const dragHandle = row.createEl("span", { cls: "pt-drag-handle", text: "⋮⋮", title: "Drag to reorder" });
		dragHandle.addEventListener("mousedown", () => row.setAttribute("draggable", "true"));
		dragHandle.addEventListener("mouseup", () => row.setAttribute("draggable", "false"));

		row.addEventListener("dragstart", (e: DragEvent) => {
			this.draggedTimerId = timer.id;
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", timer.id);
			}
			row.classList.add("pt-row--dragging");
			document.body.classList.add("pt-is-row-dragging");
		});

		row.addEventListener("dragover", (e: DragEvent) => {
			e.preventDefault();
			row.classList.add("pt-row--drag-over");
		});

		row.addEventListener("dragenter", (e: DragEvent) => e.preventDefault());
		row.addEventListener("dragleave", () => row.classList.remove("pt-row--drag-over"));

		row.addEventListener("dragend", () => {
			row.classList.remove("pt-row--dragging");
			row.classList.remove("pt-row--drag-over");
			row.setAttribute("draggable", "false");
			document.body.classList.remove("pt-is-row-dragging");
			setTimeout(() => { this.draggedTimerId = null; }, 100);
		});

		row.addEventListener("drop", async (e: DragEvent) => {
			e.preventDefault();
			row.classList.remove("pt-row--drag-over");

			const draggedId = e.dataTransfer?.getData("text/plain") || this.draggedTimerId;
			if (!draggedId || draggedId === timer.id) return;

			const draggedTimer = this.plugin.timers.find(t => t.id === draggedId);
			if (!draggedTimer) return;

			if (draggedTimer.parent_id !== timer.parent_id) {
				new Notice("Reordering is only supported within the same task level.");
				return;
			}

			const sibs = this.plugin.timers
				.filter(t => t.parent_id === timer.parent_id)
				.sort((a, b) => a.sort_order - b.sort_order);

			const draggedIdx = sibs.findIndex(t => t.id === draggedId);
			const targetIdx = sibs.findIndex(t => t.id === timer.id);

			if (draggedIdx !== -1 && targetIdx !== -1) {
				sibs.splice(draggedIdx, 1);
				sibs.splice(targetIdx, 0, draggedTimer);

				await this.plugin.runWriteAction(async () => {
					await Promise.all(sibs.map((t, idx) => {
						t.sort_order = idx;
						return this.plugin.db.update("timers", { sort_order: idx }, `id=eq.${t.id}`);
					}));
					await this.plugin.loadTimers();
					this.plugin.refreshUI();
				});
			}
		});
	}

	private renderCollapseToggle(container: HTMLElement, timer: Timer, isSubtask: boolean) {
		if (!isSubtask) {
			const subtasks = this.plugin.timers.filter(t => t.parent_id === timer.id);
			if (subtasks.length > 0) {
				const isCollapsed = this.plugin.collapsedParentIds.has(timer.id);
				const toggleBtn = container.createEl("span", {
					cls: "pt-collapse-toggle",
					text: isCollapsed ? "▸" : "▾",
					title: isCollapsed ? "Expand subtasks" : "Collapse subtasks"
				});
				toggleBtn.addEventListener("click", async (e) => {
					e.stopPropagation();
					if (isCollapsed) {
						this.plugin.collapsedParentIds.delete(timer.id);
					} else {
						this.plugin.collapsedParentIds.add(timer.id);
					}
					await this.plugin.saveSettings();
					this.plugin.refreshUI();
				});
			} else {
				container.createEl("span", { cls: "pt-collapse-spacer" });
			}
		} else {
			container.createEl("span", { cls: "pt-collapse-spacer" });
		}
	}

	private renderPlayButton(container: HTMLElement, timer: Timer, isSubtask: boolean) {
		const playBtn = container.createEl("button", {
			cls: `pt-btn pt-btn--play ${timer.is_running ? "pt-btn--active" : ""}`,
			title: "Play timer"
		});
		playBtn.innerHTML = timer.is_running ? ICONS.pause : ICONS.play;
		playBtn.addEventListener("click", () => {
			const liveTimer = this.plugin.timers.find(t => t.id === timer.id) || timer;
			if (isSubtask) {
				this.plugin.playSubtaskDirectly(liveTimer);
			} else {
				this.plugin.playParent(liveTimer);
			}
		});
	}

	private renderNameInput(container: HTMLElement, timer: Timer) {
		const nameEl = container.createEl("span", { cls: "pt-name", text: timer.name });
		nameEl.contentEditable = "true";
		nameEl.addEventListener("blur", async () => {
			const newName = nameEl.textContent?.trim();
			if (newName && newName !== timer.name) {
				timer.name = newName;
				await this.plugin.runWriteAction(async () => {
					await this.plugin.db.update("timers", { name: newName }, `id=eq.${timer.id}`);
					await this.plugin.loadTimers();
				});
			}
		});
		nameEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				nameEl.blur();
			}
		});
	}

	private renderMetrics(container: HTMLElement, timer: Timer) {
		const metricsContainer = container.createDiv({ cls: "pt-metrics-container" });
		const { tracked, estimate } = this.plugin.getTimerDisplayTimes(timer);

		const trackedField = metricsContainer.createDiv({ cls: "pt-metric-field" });
		trackedField.createEl("span", { text: "Time:" });
		const trackedInput = trackedField.createEl("input", {
			cls: "pt-tracked-input",
			type: "text",
			value: tracked > 0 ? this.plugin.formatTime(tracked) : "0s"
		});
		trackedInput.readOnly = true;
		trackedInput.title = "Click to view and edit time logs";
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

		const estField = metricsContainer.createDiv({ cls: "pt-metric-field" });
		estField.createEl("span", { text: "Est:" });
		const estimateInput = estField.createEl("input", { cls: "pt-estimate-input", type: "text" });
		estimateInput.value = estimate > 0 ? this.plugin.formatTime(estimate) : "";
		estimateInput.placeholder = "0h 00m";

		estimateInput.addEventListener("blur", async () => {
			const parsed = this.plugin.parseTimeInput(estimateInput.value);
			if (parsed !== null) {
				await this.plugin.runWriteAction(async () => {
					if (parsed !== timer.estimate_seconds) {
						timer.estimate_seconds = parsed;
						await this.plugin.db.update("timers", { estimate_seconds: parsed }, `id=eq.${timer.id}`);
					}
					await this.plugin.loadTimers();
					const { estimate: latestEstimate } = this.plugin.getTimerDisplayTimes(timer);
					estimateInput.value = latestEstimate > 0 ? this.plugin.formatTime(latestEstimate) : "";
					this.plugin.refreshUI();
				});
			}
		});
		estimateInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") estimateInput.blur();
		});
	}

	private renderRightActions(container: HTMLElement, timer: Timer, isSubtask: boolean) {
		const rightActions = container.createDiv({ cls: "pt-row-right-actions" });

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
			rotationBtn.addEventListener("click", () => {
				const liveTimer = this.plugin.timers.find(t => t.id === timer.id) || timer;
				this.plugin.toggleRotation(liveTimer);
			});
		}

		const deleteBtn = rightActions.createEl("button", { cls: "pt-btn pt-btn--delete", title: "Delete task" });
		deleteBtn.innerHTML = ICONS.trash;
		deleteBtn.addEventListener("click", () => this.plugin.deleteTimer(timer));
	}
}