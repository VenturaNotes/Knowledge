import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { SavedSessionRecord, PacingSessionState } from '../types';
import { parseDurationToSeconds, formatHumanReadableDuration, formatPacingTime, formatTime, getFinishedTimeStr } from '../utils';
import { AdjustSessionModal } from './AdjustSessionModal';

// Helper to parse positive and negative countdown inputs (e.g. '15m', '03:00', '-5m', '-02:30')
export function parseDurationWithSign(input: string): number {
    if (!input) return 0;
    const trimmed = input.trim().toLowerCase();
    const isNeg = trimmed.startsWith("-");
    const clean = isNeg ? trimmed.slice(1).trim() : trimmed;
    const val = parseDurationToSeconds(clean);
    return isNeg ? -val : val;
}

export class AdjustTaskCountdownModal extends Modal {
    plugin: PacingTimerPlugin;
    onDone: () => void;
    countdownInputRaw: string = "";

    constructor(app: App, plugin: PacingTimerPlugin, onDone: () => void) {
        super(app);
        this.plugin = plugin;
        this.onDone = onDone;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "⏱️ Adjust Current Task Countdown" });

        const s = this.plugin.session;
        if (!s) {
            contentEl.createEl("p", { text: "No active session to adjust." });
            return;
        }

        const currentRemaining = s.targetSegmentDuration - s.segmentTimeElapsed;
        const currentRemainingStr = currentRemaining >= 0 ? formatTime(currentRemaining) : `-${formatTime(Math.abs(currentRemaining))}`;

        const infoCard = contentEl.createDiv();
        Object.assign(infoCard.style, {
            padding: "8px 12px",
            borderRadius: "6px",
            background: "var(--background-secondary)",
            border: "1px solid var(--background-modifier-border)",
            fontSize: "0.85em",
            marginBottom: "14px",
            color: "var(--text-muted)",
            lineHeight: "1.5"
        });

        infoCard.innerHTML = `
            <b>Task Target:</b> ${formatTime(s.targetSegmentDuration)}<br>
            <b>Current Displayed Countdown:</b> <span style="font-weight: bold; color: ${currentRemaining >= 0 ? "#eab308" : "#ef4444"};">${currentRemainingStr}</span>
        `;

        new Setting(contentEl)
            .setName("Set Countdown [S:...] To")
            .setDesc("Enter what the remaining countdown should show (e.g. '15:00', '3m', '45s', or '-2m' if in overtime).")
            .addText(text => {
                text.setValue(currentRemainingStr).onChange(v => this.countdownInputRaw = v);
                setTimeout(() => text.inputEl.focus(), 10);
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this.applyCountdown();
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Set Countdown")
                .setCta()
                .onClick(() => this.applyCountdown())
            );
    }

    applyCountdown() {
        const s = this.plugin.session;
        if (!s) {
            this.close();
            return;
        }

        const newRemaining = parseDurationWithSign(this.countdownInputRaw);
        // segmentTimeElapsed = target - remaining
        const newElapsed = Math.max(0, s.targetSegmentDuration - newRemaining);
        const diff = newElapsed - s.segmentTimeElapsed;

        s.segmentTimeElapsed = newElapsed;
        s.globalTimeElapsed = Math.max(0, s.globalTimeElapsed + diff);
        s.lastTickTime = Date.now();

        this.plugin.updateStatusBar();
        this.plugin.saveSettings();

        const formatted = newRemaining >= 0 ? formatTime(newRemaining) : `-${formatTime(Math.abs(newRemaining))}`;
        this.plugin.showOverlay(`⏱️ Task Countdown Set to: ${formatted}`, true);

        this.onDone();
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

export class ProjectModal extends Modal {
    plugin: PacingTimerPlugin;
    project: SavedSessionRecord;

    stintTargetMode: "time" | "segments" = "time";
    stintDurationRaw: string = "3h";
    stintTasksRaw: string = "45";
    previewEl: HTMLElement | null = null;

    constructor(app: App, plugin: PacingTimerPlugin, project: SavedSessionRecord) {
        super(app);
        this.plugin = plugin;
        this.project = project;

        const pace = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(1, (this.project.totalProjectGoal || 100) - (this.project.totalProjectCompleted || 0));
        const estimatedTasks = Math.min(remainingTasks, Math.floor(10800 / pace));
        this.stintTasksRaw = Math.max(1, estimatedTasks).toString();
    }

    onOpen() {
        this.render();
    }

    render() {
        const { contentEl } = this;
        contentEl.empty();

        if (this.plugin.settings.savedSessions?.[this.project.id]) {
            this.project = this.plugin.settings.savedSessions[this.project.id]!;
        }

        const isStintActive = Boolean(
            this.plugin.session &&
            this.plugin.session.projectId === this.project.id
        );

        // Header
        const header = contentEl.createDiv();
        Object.assign(header.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
        });
        header.createEl("h2", { text: `📚 ${this.project.name}`, attr: { style: "margin: 0;" } });

        if (isStintActive) {
            header.createEl("span", {
                text: "🟢 Stint Active",
                attr: { style: "background: var(--interactive-accent); color: var(--text-on-accent); padding: 2px 8px; border-radius: 12px; font-size: 0.78em; font-weight: bold;" }
            });
        }

        // --- SECTION 1: MASTER PROJECT TELEMETRY (LIVE SYNCED) ---
        const macroCard = contentEl.createDiv();
        Object.assign(macroCard.style, {
            padding: "12px 14px",
            borderRadius: "8px",
            background: "var(--background-secondary)",
            border: "1px solid var(--background-modifier-border)",
            marginBottom: "16px",
            fontSize: "0.9em",
            lineHeight: "1.6"
        });

        // Live sync: include today's in-progress stint tasks in the macro count
        const stintDone = (isStintActive && this.plugin.session) ? (this.plugin.session.completedSegments || 0) : 0;
        const completed = (this.project.totalProjectCompleted || 0) + stintDone;
        const totalGoal = this.project.totalProjectGoal || 100;
        const pct = Math.round((completed / totalGoal) * 100);
        const paceWithLeeway = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(0, totalGoal - completed);
        const remainingProjectSeconds = remainingTasks * paceWithLeeway;

        macroCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1.05em; margin-bottom: 4px;">
                <span>Project Progress: ${completed} / ${totalGoal} Tasks</span>
                <span style="color: var(--text-accent);">${pct}% Complete</span>
            </div>
            <div style="color: var(--text-muted);">
                ⏱️ <b>Calibrated Pace:</b> ${formatHumanReadableDuration(paceWithLeeway).replace(/\s+/g, "")} per task (with leeway)<br>
                ⏳ <b>Est. Total Project Finish:</b> ~${formatHumanReadableDuration(remainingProjectSeconds)} remaining
            </div>
        `;

        // --- SECTION 2: ACTIVE STINT OR STINT LAUNCHER ---
        if (isStintActive && this.plugin.session) {
            const s = this.plugin.session;
            const stintCard = contentEl.createDiv();
            Object.assign(stintCard.style, {
                padding: "12px 14px",
                borderRadius: "8px",
                background: "var(--background-primary-alt)",
                border: "1px solid var(--interactive-accent)",
                marginBottom: "16px",
                fontSize: "0.9em",
                lineHeight: "1.6"
            });

            const quota = s.currentQuota || s.stintInitialGoal || 10;
            const baseGoal = s.stintInitialGoal || quota;
            const goalMet = stintDone >= baseGoal;
            const goalTag = goalMet ? `⭐ Baseline Goal of ${baseGoal} Met!` : `Baseline Goal: ${baseGoal}`;

            stintCard.innerHTML = `
                <div style="font-weight: 600; font-size: 1.05em; color: var(--text-accent); margin-bottom: 6px;">
                    ⏱️ Active Stint Progress
                </div>
                <div>
                    <b>Today's Work:</b> ${stintDone} / ${quota} Tasks <span style="color: ${goalMet ? "#eab308" : "var(--text-muted)"}; font-weight: ${goalMet ? "bold" : "normal"};">(${goalTag})</span><br>
                    <b>Time Elapsed:</b> ${formatPacingTime(s.globalTimeElapsed)} • <b>Active Timer:</b> ${formatTime(s.targetSegmentDuration)}
                </div>
            `;

            const btnRow = contentEl.createDiv();
            Object.assign(btnRow.style, { display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" });

            const cancelBtn = btnRow.createEl("button", {
                text: "🚫 Cancel Stint",
                attr: {
                    style: "padding: 6px 12px; cursor: pointer; font-size: 0.88em; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444);"
                }
            });
            cancelBtn.onmouseenter = () => {
                cancelBtn.style.background = "var(--text-error, #ef4444)";
                cancelBtn.style.color = "#ffffff";
            };
            cancelBtn.onmouseleave = () => {
                cancelBtn.style.background = "rgba(239, 68, 68, 0.12)";
                cancelBtn.style.color = "var(--text-error, #ef4444)";
            };
            cancelBtn.onclick = async () => {
                if (confirm(`Cancel active stint for "${this.project.name}"? Progress from this stint will not be banked.`)) {
                    await this.cancelStint();
                }
            };

            // ADJUST TASK COUNTDOWN BUTTON
            const adjustCountdownBtn = btnRow.createEl("button", {
                text: "⏱️ Adjust Countdown",
                attr: {
                    title: "Set what the current task countdown [S:...] should show",
                    style: "padding: 6px 12px; cursor: pointer; font-size: 0.88em; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-secondary); color: var(--text-normal);"
                }
            });
            adjustCountdownBtn.onclick = () => {
                new AdjustTaskCountdownModal(this.app, this.plugin, () => this.render()).open();
            };

            const adjustBtn = btnRow.createEl("button", {
                text: "⚙️ Adjust Stint",
                attr: { style: "padding: 6px 12px; cursor: pointer; font-size: 0.88em;" }
            });
            adjustBtn.onclick = () => {
                this.close();
                new AdjustSessionModal(this.app, this.plugin).open();
            };

            // BANK PROGRESS AND END STINT BUTTON
            const bankBtn = btnRow.createEl("button", {
                text: "💾 Bank Progress & End Stint",
                cls: "mod-cta",
                attr: { style: "padding: 6px 14px; cursor: pointer; font-size: 0.88em;" }
            });
            bankBtn.onclick = async () => {
                await this.bankAndEndStint();
            };
        } else {
            contentEl.createEl("h4", { text: "🚀 Launch Today's Stint", attr: { style: "margin: 8px 0;" } });

            new Setting(contentEl)
                .setName("Target Method")
                .setDesc("Choose whether to set a dedicated time window or a specific task quota for today.")
                .addDropdown(dropdown => {
                    dropdown
                        .addOption("time", "Stint Time Target")
                        .addOption("segments", "Stint Segment Target")
                        .setValue(this.stintTargetMode)
                        .onChange(value => {
                            this.stintTargetMode = value as "time" | "segments";
                            updateVisibility();
                            this.updatePreview();
                        });
                });

            const timeSetting = new Setting(contentEl)
                .setName("Stint Time Target")
                .setDesc("How long do you want to work on this project today? (e.g. '3h', '1.5h', '45m').")
                .addText(text => {
                    text.setValue(this.stintDurationRaw).onChange(v => {
                        this.stintDurationRaw = v;
                        this.updatePreview();
                    });
                });

            const segmentSetting = new Setting(contentEl)
                .setName("Stint Segment Target")
                .setDesc("Target task quota for today's session (e.g. '45', '30').")
                .addText(text => {
                    text.setValue(this.stintTasksRaw).onChange(v => {
                        this.stintTasksRaw = v;
                        this.updatePreview();
                    });
                });

            const updateVisibility = () => {
                const isTime = this.stintTargetMode === "time";
                timeSetting.settingEl.style.display = isTime ? "" : "none";
                segmentSetting.settingEl.style.display = isTime ? "none" : "";
            };
            updateVisibility();

            this.previewEl = contentEl.createEl("p");
            Object.assign(this.previewEl.style, { color: "var(--text-muted)", fontSize: "0.85em", margin: "10px 0" });
            this.updatePreview();

            const bottomRow = contentEl.createDiv();
            Object.assign(bottomRow.style, { 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginTop: "16px" 
            });

            const deleteBtn = bottomRow.createEl("button", {
                text: "🗑 Delete Project",
                attr: { 
                    style: "padding: 6px 14px; font-size: 0.88em; cursor: pointer; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444); transition: background 0.15s ease, color 0.15s ease;" 
                }
            });
            deleteBtn.onmouseenter = () => {
                deleteBtn.style.background = "var(--text-error, #ef4444)";
                deleteBtn.style.color = "#ffffff";
            };
            deleteBtn.onmouseleave = () => {
                deleteBtn.style.background = "rgba(239, 68, 68, 0.12)";
                deleteBtn.style.color = "var(--text-error, #ef4444)";
            };
            deleteBtn.onclick = async () => {
                if (confirm(`Delete project "${this.project.name}" permanently?`)) {
                    if (this.plugin.settings.savedSessions) {
                        delete this.plugin.settings.savedSessions[this.project.id];
                        await this.plugin.saveSettings();
                    }
                    this.close();
                }
            };

            const launchBtn = bottomRow.createEl("button", {
                text: "🚀 Start Stint",
                cls: "mod-cta",
                attr: { style: "padding: 6px 16px; font-size: 0.88em; cursor: pointer;" }
            });
            launchBtn.onclick = async () => {
                await this.launchStint();
            };
        }
    }

    updatePreview() {
        if (!this.previewEl) return;
        const pace = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(0, (this.project.totalProjectGoal || 100) - (this.project.totalProjectCompleted || 0));

        let duration = 0;
        let tasks = 0;

        if (this.stintTargetMode === "segments") {
            const parsed = parseInt(this.stintTasksRaw, 10);
            tasks = parsed > 0 ? Math.min(remainingTasks, parsed) : Math.min(remainingTasks, 10);
            duration = tasks * pace;
        } else {
            duration = parseDurationToSeconds(this.stintDurationRaw) || 10800;
            tasks = Math.min(remainingTasks, Math.floor(duration / pace));
        }

        const finishTimeStr = getFinishedTimeStr(Date.now(), duration);
        this.previewEl.textContent = `🎯 Today's Stint: ~${tasks} tasks budgeted in ${formatHumanReadableDuration(duration)} • Finish around ${finishTimeStr}`;
    }

    async launchStint() {
        const pace = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(1, (this.project.totalProjectGoal || 100) - (this.project.totalProjectCompleted || 0));

        let duration = 0;
        let tasks = 0;

        if (this.stintTargetMode === "segments") {
            const parsed = parseInt(this.stintTasksRaw, 10);
            tasks = parsed > 0 ? Math.min(remainingTasks, parsed) : Math.min(remainingTasks, 10);
            duration = tasks * pace;
        } else {
            duration = parseDurationToSeconds(this.stintDurationRaw) || 10800;
            tasks = Math.min(remainingTasks, Math.floor(duration / pace));
        }

        tasks = Math.max(1, tasks);
        duration = Math.max(60, duration);

        this.plugin.stopSession();

        const baseSession: PacingSessionState = {
            mode: "segmented",
            title: "G",
            initialSegmentDuration: pace,
            targetSegmentDuration: pace,
            totalSegments: tasks,
            defaultTotalTime: duration,
            completedSegments: 0,
            cumulativeDelta: 0,
            globalTimeElapsed: 0,
            segmentTimeElapsed: 0,
            isRunning: true,
            isFinished: false,
            lastTickTime: Date.now(),

            segmentedVaultThreshold: Math.max(60, pace * 3),
            segmentedCountUp: true,
            currentQuota: tasks,
            maxTargetSegments: remainingTasks,
            totalWorkTime: 0,
            benchmarkPace: this.project.benchmarkPace || 60,
            hardStopTotalSeconds: duration,
            earlyFinishBanked: 0,

            // Linked project metadata
            projectId: this.project.id,
            projectName: this.project.name,
            projectGoal: this.project.totalProjectGoal,
            projectCompletedInitial: this.project.totalProjectCompleted || 0,
            stintInitialGoal: tasks,

            rotationCategories: [],
            rotationIndex: 0,
            rotationCategoryElapsed: 0,
            rotationCategoryDuration: 0,
            rotationInInterrupt: false,
            rotationInterruptElapsed: 0
        };

        this.plugin.session = baseSession;
        this.plugin.updateStatusBar();
        this.plugin.startInterval();
        await this.plugin.saveSettings();

        this.plugin.showOverlay(`🚀 Stint Launched: ${tasks} Tasks for "${this.project.name}"!`, true);
        this.close();
    }

    // Calls the unified plugin method so button and Command+Space behave identically
    async bankAndEndStint() {
        await this.plugin.bankActiveStint();
        this.render();
    }

    async cancelStint() {
        this.plugin.stopSession();
        await this.plugin.saveSettings();
        this.plugin.showOverlay("🚫 Stint Canceled", false);
        this.render();
    }

    onClose() {
        this.contentEl.empty();
    }
}