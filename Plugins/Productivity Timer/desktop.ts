import { Notice } from "obsidian";
import { Timer, Session, ICONS } from "./types";
import { TimeLogModal } from "./modal";
import ProductivityTimerPlugin from "./main";

export class ProductivityTimerWindow {
	private plugin: ProductivityTimerPlugin;
	private showArchive = false;
	private draggedTimerId: string | null = null;

	private isDragging = false;
	private dragOffsetX = 0;
	private dragOffsetY = 0;

	private isResizing = false;
	private resizeStartX = 0;
	private resizeStartY = 0;
	private resizeStartW = 0;
	private resizeStartH = 0;
	private resizeStartXPos = 0;
	private resizeStartYPos = 0;
	private activeResizeDir: string | null = null;

	private el: HTMLElement;

	constructor(plugin: ProductivityTimerPlugin) {
		this.plugin = plugin;
		this.el = document.createElement("div");
		this.el.id = "pt-floating-window";
		document.body.appendChild(this.el);
		this.applyPosition();

		// Bind and attach scoped global move/release tracking
		document.addEventListener("mousemove", this.onMouseMove);
		document.addEventListener("mouseup", this.onMouseUp);

		this.init();
	}

	private applyPosition() {
		const s = this.plugin.settings;
		const maxX = window.innerWidth - s.windowWidth;
		const maxY = window.innerHeight - s.windowHeight;
		const x = Math.max(0, Math.min(s.windowX, maxX));
		const y = Math.max(0, Math.min(s.windowY, maxY));
		Object.assign(this.el.style, {
			position: "fixed",
			left: `${x}px`,
			top: `${y}px`,
			width: `${s.windowWidth}px`,
			height: `${s.windowHeight}px`,
			zIndex: "40",
		});
	}

	private init() {
		this.render();
	}

	private onMouseMove = (e: MouseEvent) => {
		if (this.isDragging) {
			const x = Math.max(0, Math.min(e.clientX - this.dragOffsetX, window.innerWidth - this.el.offsetWidth));
			const y = Math.max(0, Math.min(e.clientY - this.dragOffsetY, window.innerHeight - this.el.offsetHeight));
			this.el.style.left = `${x}px`;
			this.el.style.top = `${y}px`;
		} else if (this.isResizing && this.activeResizeDir) {
			const dx = e.clientX - this.resizeStartX;
			const dy = e.clientY - this.resizeStartY;
			
			let newWidth = this.resizeStartW;
			let newHeight = this.resizeStartH;
			let newLeft = this.resizeStartXPos;
			let newTop = this.resizeStartYPos;
			
			const minW = 380;
			const minH = 300;
			const dir = this.activeResizeDir;

			// Horizontal edge calculations
			if (dir.includes("e")) {
				newWidth = Math.max(minW, this.resizeStartW + dx);
			}
			if (dir.includes("w")) {
				const potentialWidth = this.resizeStartW - dx;
				if (potentialWidth >= minW) {
					newWidth = potentialWidth;
					newLeft = this.resizeStartXPos + dx;
				}
			}

			// Vertical edge calculations
			if (dir.includes("s")) {
				newHeight = Math.max(minH, this.resizeStartH + dy);
			}
			if (dir.includes("n")) {
				const potentialHeight = this.resizeStartH - dy;
				if (potentialHeight >= minH) {
					newHeight = potentialHeight;
					newTop = this.resizeStartYPos + dy;
				}
			}

			this.el.style.width = `${newWidth}px`;
			this.el.style.height = `${newHeight}px`;
			this.el.style.left = `${newLeft}px`;
			this.el.style.top = `${newTop}px`;
		}
	};

	private onMouseUp = () => {
		if (this.isDragging) {
			this.isDragging = false;
			document.body.classList.remove("pt-is-window-dragging");
			
			this.plugin.settings.windowX = parseInt(this.el.style.left);
			this.plugin.settings.windowY = parseInt(this.el.style.top);
			this.plugin.saveSettings();
		}
		if (this.isResizing) {
			this.isResizing = false;
			this.activeResizeDir = null;
			document.body.classList.remove("pt-is-window-resizing");
			
			this.plugin.settings.windowWidth = this.el.offsetWidth;
			this.plugin.settings.windowHeight = this.el.offsetHeight;
			this.plugin.settings.windowX = parseInt(this.el.style.left);
			this.plugin.settings.windowY = parseInt(this.el.style.top);
			this.plugin.saveSettings();
		}
	};

	public renderTimerRowsOnly() {
		const flattened = this.plugin.getFlattenedRenderedTimers();
		const rows = this.el.querySelectorAll(".pt-row");
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
		const rollupTracked = this.el.querySelector(".pt-rollup-tracked");
		if (rollupTracked) rollupTracked.textContent = this.plugin.formatTime(this.plugin.totalTracked());
	}

	public render() {
		this.el.empty();

		const titleBar = this.el.createDiv({ cls: "pt-titlebar" });
		titleBar.createEl("span", { cls: "pt-titlebar-text", text: "Productivity Timer" });

		const titleActions = titleBar.createDiv({ cls: "pt-titlebar-actions" });
		const closeBtn = titleActions.createEl("button", { cls: "pt-titlebar-btn pt-close-btn", text: "✕" });
		closeBtn.addEventListener("click", () => this.destroy());

		this.setupDrag(titleBar);

		const body = this.el.createDiv({ cls: "pt-body" });

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

		// Setup transparent border handles around edges and corners
		this.setupMultiResize();
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

		row.setAttribute("draggable", "false");

		// 1. Drag Handle
		const dragHandle = row.createEl("span", { cls: "pt-drag-handle", text: "⋮⋮", title: "Drag to reorder" });

		dragHandle.addEventListener("mousedown", () => {
			row.setAttribute("draggable", "true");
		});

		dragHandle.addEventListener("mouseup", () => {
			row.setAttribute("draggable", "false");
		});

		row.addEventListener("dragstart", (e: DragEvent) => {
			this.draggedTimerId = timer.id;
			if (e.dataTransfer) {
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", timer.id);
			}
			row.classList.add("pt-row--dragging");
		});

		row.addEventListener("dragover", (e: DragEvent) => {
			e.preventDefault();
			row.classList.add("pt-row--drag-over");
		});

		row.addEventListener("dragenter", (e: DragEvent) => {
			e.preventDefault();
		});

		row.addEventListener("dragleave", () => {
			row.classList.remove("pt-row--drag-over");
		});

		row.addEventListener("dragend", () => {
			row.classList.remove("pt-row--dragging");
			row.classList.remove("pt-row--drag-over");
			row.setAttribute("draggable", "false");
			setTimeout(() => {
				this.draggedTimerId = null;
			}, 100);
		});

		row.addEventListener("drop", async (e: DragEvent) => {
			e.preventDefault();
			row.classList.remove("pt-row--drag-over");

			const draggedId = e.dataTransfer?.getData("text/plain") || this.draggedTimerId;
			if (!draggedId || draggedId === timer.id) return;

			const draggedTimer = this.plugin.timers.find(t => t.id === draggedId);
			if (!draggedTimer) return;

			if (draggedTimer.parent_id !== timer.parent_id) {
				new Notice("Reordering is only supported within the same task/subtask level.");
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

		// 2. Collapse Arrow Toggle (Only Parent tasks containing subtasks)
		if (!isSubtask) {
			const subtasks = this.plugin.timers.filter(t => t.parent_id === timer.id);
			if (subtasks.length > 0) {
				const isCollapsed = this.plugin.collapsedParentIds.has(timer.id);
				const toggleBtn = row.createEl("span", {
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
				row.createEl("span", { cls: "pt-collapse-spacer" });
			}
		} else {
			row.createEl("span", { cls: "pt-collapse-spacer" });
		}

		// 3. Play Button
		const playBtn = row.createEl("button", {
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

		// 4. Name Input
		const nameEl = row.createEl("span", { cls: "pt-name", text: timer.name });
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

		// 5. Metrics Container (Inline fields)
		const metricsContainer = row.createDiv({ cls: "pt-metrics-container" });
		const { tracked, estimate } = this.plugin.getTimerDisplayTimes(timer);

		// Tracked duration
		const trackedField = metricsContainer.createDiv({ cls: "pt-metric-field" });
		trackedField.createEl("span", { text: "Time:" });
		const trackedInput = trackedField.createEl("input", { cls: "pt-tracked-input", type: "text", value: tracked > 0 ? this.plugin.formatTime(tracked) : "0s" });
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

		// 6. Action buttons container
		const rightActions = row.createDiv({ cls: "pt-row-right-actions" });

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
	}

	private setupDrag(handle: HTMLElement) {
		handle.addEventListener("mousedown", (e) => {
			if ((e.target as HTMLElement).closest("button")) return;
			this.isDragging = true;
			document.body.classList.add("pt-is-window-dragging");
			this.dragOffsetX = e.clientX - this.el.getBoundingClientRect().left;
			this.dragOffsetY = e.clientY - this.el.getBoundingClientRect().top;
			e.preventDefault();
		});
	}

	private setupMultiResize() {
		const directions = ["n", "s", "e", "w", "nw", "ne", "sw", "se"];
		for (const dir of directions) {
			const handle = this.el.createDiv({ cls: `pt-resize-handle pt-resize-${dir}` });
			
			handle.addEventListener("mousedown", (e) => {
				this.isResizing = true;
				document.body.classList.add("pt-is-window-resizing");
				
				this.resizeStartX = e.clientX;
				this.resizeStartY = e.clientY;
				
				const rect = this.el.getBoundingClientRect();
				this.resizeStartW = rect.width;
				this.resizeStartH = rect.height;
				this.resizeStartXPos = rect.left;
				this.resizeStartYPos = rect.top;
				
				this.activeResizeDir = dir;
				
				e.preventDefault();
				e.stopPropagation();
			});
		}
	}

	destroy() {
		// Clean up global listeners to avoid memory leaks
		document.removeEventListener("mousemove", this.onMouseMove);
		document.removeEventListener("mouseup", this.onMouseUp);

		// Safety clean up body classes
		document.body.classList.remove("pt-is-window-dragging", "pt-is-window-resizing");

		this.el.remove();
		this.plugin.floatingWindow = null;
	}
}