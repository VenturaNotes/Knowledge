import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { SavedSessionRecord, PacingSessionState } from '../types';
import { parseDurationToSeconds, formatHumanReadableDuration, formatPacingTime, formatTime, getFinishedTimeStr } from '../utils';
import { AdjustSessionModal } from './AdjustSessionModal';

export class ProjectModal extends Modal {
    plugin: PacingTimerPlugin;
    project: SavedSessionRecord;

    // Stint configuration inputs
    stintDurationRaw: string = "3h";
    stintTasksRaw: string = "";
    previewEl: HTMLElement | null = null;

    constructor(app: App, plugin: PacingTimerPlugin, project: SavedSessionRecord) {
        super(app);
        this.plugin = plugin;
        this.project = project;
    }

    onOpen() {
        this.render();
    }

    render() {
        const { contentEl } = this;
        contentEl.empty();

        // Refresh project data from settings in case it updated
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

        // --- SECTION 1: MASTER PROJECT TELEMETRY ---
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

        const completed = this.project.totalProjectCompleted || 0;
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

            const stintDone = s.completedSegments || 0;
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

            // Action Buttons for Active Stint
            const btnRow = contentEl.createDiv();
            Object.assign(btnRow.style, { display: "flex", gap: "8px", justifyContent: "flex-end" });

            const cancelBtn = btnRow.createEl("button", {
                text: "🚫 Cancel Stint",
                attr: {
                    style: "padding: 6px 12px; cursor: pointer; font-size: 0.88em; background: transparent; border: 1px solid var(--background-modifier-border); color: var(--text-error, #ef4444);"
                }
            });
            cancelBtn.onclick = async () => {
                if (confirm(`Cancel active stint for "${this.project.name}"? Progress from this stint will not be banked to the project.`)) {
                    await this.cancelStint();
                }
            };

            const adjustBtn = btnRow.createEl("button", {
                text: "⚙️ Adjust Stint",
                attr: { style: "padding: 6px 12px; cursor: pointer; font-size: 0.88em;" }
            });
            adjustBtn.onclick = () => {
                this.close();
                new AdjustSessionModal(this.app, this.plugin).open();
            };

            const bankBtn = btnRow.createEl("button", {
                text: "💾 Bank Progress & End Stint",
                cls: "mod-cta",
                attr: { style: "padding: 6px 14px; cursor: pointer; font-size: 0.88em;" }
            });
            bankBtn.onclick = async () => {
                await this.bankAndEndStint();
            };
        } else {
            // Launch Stint Section
            contentEl.createEl("h4", { text: "🚀 Launch Today's Stint", attr: { style: "margin: 8px 0;" } });

            new Setting(contentEl)
                .setName("Stint Time Target")
                .setDesc("How long do you want to work on this project today? (e.g. '3h', '1.5h', '45m').")
                .addText(text => {
                    text.setValue(this.stintDurationRaw).onChange(v => {
                        this.stintDurationRaw = v;
                        this.stintTasksRaw = "";
                        this.updatePreview();
                    });
                });

            new Setting(contentEl)
                .setName("— OR — Stint Segment Target")
                .setDesc("Prefer a specific task quota for today? (e.g. '45', '30').")
                .addText(text => {
                    text.setValue(this.stintTasksRaw).onChange(v => {
                        this.stintTasksRaw = v;
                        this.updatePreview();
                    });
                });

            this.previewEl = contentEl.createEl("p");
            Object.assign(this.previewEl.style, { color: "var(--text-muted)", fontSize: "0.85em", margin: "10px 0" });
            this.updatePreview();

            const bottomRow = contentEl.createDiv();
            Object.assign(bottomRow.style, { display: "flex", justifyContent: "space-between", marginTop: "14px" });

            const deleteBtn = bottomRow.createEl("button", {
                text: "🗑 Delete Project",
                attr: { style: "background: transparent; border: none; color: var(--text-error, #ef4444); cursor: pointer; font-size: 0.85em;" }
            });
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

        if (this.stintTasksRaw && parseInt(this.stintTasksRaw, 10) > 0) {
            tasks = Math.min(remainingTasks, parseInt(this.stintTasksRaw, 10));
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

        if (this.stintTasksRaw && parseInt(this.stintTasksRaw, 10) > 0) {
            tasks = Math.min(remainingTasks, parseInt(this.stintTasksRaw, 10));
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
            maxTargetSegments: tasks,
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

    async bankAndEndStint() {
        const s = this.plugin.session;
        if (!s || s.projectId !== this.project.id) return;

        const doneToday = s.completedSegments || 0;
        const workTimeToday = s.totalWorkTime || 0;

        // Permanently commit today's work to the project record in data.json
        this.project.totalProjectCompleted = (this.project.totalProjectCompleted || 0) + doneToday;
        this.project.totalWorkTime = (this.project.totalWorkTime || 0) + workTimeToday;
        if (this.project.totalProjectCompleted > 0) {
            this.project.benchmarkPace = Math.max(1, Math.round(this.project.totalWorkTime / this.project.totalProjectCompleted));
        }
        this.project.savedAt = Date.now();

        if (this.plugin.settings.savedSessions) {
            this.plugin.settings.savedSessions[this.project.id] = this.project;
        }

        // Stop the live timer and clear status bar
        this.plugin.stopSession();
        await this.plugin.saveSettings();

        this.plugin.showOverlay(`💾 Stint Banked: +${doneToday} Tasks Logged!`, true);

        // Re-render modal in-place so user immediately sees fresh stats
        this.render();
    }

    async cancelStint() {
        // Discard active stint progress without modifying project macro totals
        this.plugin.stopSession();
        await this.plugin.saveSettings();
        this.plugin.showOverlay("🚫 Stint Canceled", false);
        this.render();
    }

    onClose() {
        this.contentEl.empty();
    }
}