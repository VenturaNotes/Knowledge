import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { SavedSessionRecord, PacingSessionState } from '../types';
import { parseDurationToSeconds, formatHumanReadableDuration, formatPacingTime, formatTime, getFinishedTimeStr } from '../utils';

export function parseDurationWithSign(input: string): number {
    if (!input) return 0;
    const trimmed = input.trim().toLowerCase();
    const isNeg = trimmed.startsWith("-");
    const clean = isNeg ? trimmed.slice(1).trim() : trimmed;
    const val = parseDurationToSeconds(clean);
    return isNeg ? -val : val;
}

export function parseEndTimeToSeconds(input: string, now: Date = new Date()): number {
    if (!input) return 0;
    const str = input.trim().toLowerCase();

    const isPm = /pm|p\.m\./i.test(str);
    const isAm = /am|a\.m\./i.test(str);
    const clean = str.replace(/am|pm|a\.m\.|p\.m\./ig, '').trim();

    let hours = 0;
    let minutes = 0;

    if (clean.includes(':')) {
        const parts = clean.split(':').map(s => parseInt(s.trim(), 10));
        hours = !isNaN(parts[0]!) ? parts[0]! : 0;
        minutes = !isNaN(parts[1]!) ? parts[1]! : 0;
    } else {
        hours = parseInt(clean, 10) || 0;
        minutes = 0;
    }

    if (isPm) {
        if (hours < 12) hours += 12;
    } else if (isAm) {
        if (hours === 12) hours = 0;
    }

    const target = new Date(now.getTime());
    target.setHours(hours, minutes, 0, 0);

    let diffSecs = Math.round((target.getTime() - now.getTime()) / 1000);

    if (!isAm && !isPm && diffSecs <= 0 && hours < 12) {
        target.setHours(hours + 12, minutes, 0, 0);
        diffSecs = Math.round((target.getTime() - now.getTime()) / 1000);
    }

    if (diffSecs <= 0) {
        target.setDate(target.getDate() + 1);
        diffSecs = Math.round((target.getTime() - now.getTime()) / 1000);
    }

    return Math.max(0, diffSecs);
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

export class EditProjectGoalModal extends Modal {
    plugin: PacingTimerPlugin;
    project: SavedSessionRecord;
    onUpdated: () => void;
    goalInputRaw: string;

    constructor(app: App, plugin: PacingTimerPlugin, project: SavedSessionRecord, onUpdated: () => void) {
        super(app);
        this.plugin = plugin;
        this.project = project;
        this.onUpdated = onUpdated;
        this.goalInputRaw = (project.totalProjectGoal || 100).toString();
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: `🎯 Change Task Goal: ${this.project.name}` });

        const completed = this.project.totalProjectCompleted || 0;

        new Setting(contentEl)
            .setName("Total Project Goal")
            .setDesc(`Current progress: ${completed} tasks completed. Enter your desired total task quota:`)
            .addText(text => {
                text.setValue(this.goalInputRaw).onChange(v => this.goalInputRaw = v);
                setTimeout(() => {
                    text.inputEl.focus();
                    text.inputEl.select();
                }, 10);
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this.save();
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Update Goal")
                .setCta()
                .onClick(() => this.save())
            );
    }

    async save() {
        const val = parseInt(this.goalInputRaw, 10);
        if (!isNaN(val) && val > 0) {
            this.project.totalProjectGoal = val;
            if (this.plugin.settings.savedSessions?.[this.project.id]) {
                this.plugin.settings.savedSessions[this.project.id]!.totalProjectGoal = val;
            }
            if (this.plugin.session && this.plugin.session.projectId === this.project.id) {
                this.plugin.session.projectGoal = val;
                this.plugin.updateStatusBar();
            }
            await this.plugin.saveSettings();
            this.onUpdated();
            this.close();
        } else {
            alert("Please enter a valid positive number for the task goal.");
        }
    }

    onClose() {
        this.contentEl.empty();
    }
}

export class ProjectModal extends Modal {
    plugin: PacingTimerPlugin;
    project: SavedSessionRecord;

    stintTargetMode: "time" | "segments" | "endTime" = "time";
    stintDurationRaw: string = "3h";
    stintTasksRaw: string = "45";
    stintEndTimeRaw: string = "";
    previewEl: HTMLElement | null = null;

    constructor(app: App, plugin: PacingTimerPlugin, project: SavedSessionRecord) {
        super(app);
        this.plugin = plugin;
        this.project = project;

        const pace = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(0, (this.project.totalProjectGoal || 100) - (this.project.totalProjectCompleted || 0));
        const estimatedTasks = remainingTasks > 0 ? Math.min(remainingTasks, Math.floor(10800 / pace)) : 0;
        this.stintTasksRaw = Math.max(1, estimatedTasks || 1).toString();
        this.stintEndTimeRaw = getFinishedTimeStr(Date.now(), 10800);
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

        const stintDone = (isStintActive && this.plugin.session) ? (this.plugin.session.completedSegments || 0) : 0;
        const completed = (this.project.totalProjectCompleted || 0) + stintDone;
        const totalGoal = this.project.totalProjectGoal || 100;
        const isProjectCompleted = completed >= totalGoal;

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
        } else if (isProjectCompleted) {
            header.createEl("span", {
                text: "✅ Completed",
                attr: { style: "background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 8px; border-radius: 12px; font-size: 0.78em; font-weight: bold;" }
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

        const pct = Math.round((completed / totalGoal) * 100);
        const paceWithLeeway = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(0, totalGoal - completed);

        let remainingProjectSeconds = 0;
        if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
            let baseSum = 0;
            for (let i = completed; i < this.project.customSegmentDurations.length; i++) {
                baseSum += this.project.customSegmentDurations[i] || 0;
            }
            remainingProjectSeconds = Math.round(baseSum * (this.project.paceMultiplier || 1.25));
        } else {
            remainingProjectSeconds = remainingTasks * paceWithLeeway;
        }

        const paceLabel = this.project.customSegmentDurations?.length 
            ? `Custom Timings (${this.project.paceMultiplier || 1.25}x)` 
            : `${formatHumanReadableDuration(paceWithLeeway).replace(/\s+/g, "")} per task`;

        const finishLabel = isProjectCompleted
            ? `<span style="color: #10b981; font-weight: 600;">Completed! 🎉</span>`
            : `~${formatHumanReadableDuration(remainingProjectSeconds)} remaining`;

        const pctColor = isProjectCompleted ? "#10b981" : "var(--text-accent)";

        const progressRow = macroCard.createDiv();
        Object.assign(progressRow.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "600",
            fontSize: "1.05em",
            marginBottom: "4px",
            flexWrap: "wrap",
            gap: "6px"
        });

        const progressLeft = progressRow.createDiv();
        Object.assign(progressLeft.style, {
            display: "flex",
            alignItems: "center",
            gap: "8px"
        });
        progressLeft.createSpan({ text: `Project Progress: ${completed} / ${totalGoal} Tasks` });

        const editGoalBtn = progressLeft.createEl("button", {
            text: "✏️ Edit Goal",
            attr: {
                title: "Change total project task goal",
                style: "font-size: 0.72em; padding: 2px 7px; cursor: pointer; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-muted); line-height: 1.2;"
            }
        });
        editGoalBtn.onmouseenter = () => editGoalBtn.style.color = "var(--text-normal)";
        editGoalBtn.onmouseleave = () => editGoalBtn.style.color = "var(--text-muted)";
        editGoalBtn.onclick = () => {
            new EditProjectGoalModal(this.app, this.plugin, this.project, () => this.render()).open();
        };

        progressRow.createSpan({
            text: `${pct}% Complete`,
            attr: { style: `color: ${pctColor};` }
        });

        const metaDiv = macroCard.createDiv();
        Object.assign(metaDiv.style, { color: "var(--text-muted)" });
        metaDiv.innerHTML = `
            ⏱️ <b>Pacing:</b> ${paceLabel}<br>
            ⏳ <b>Est. Total Project Finish:</b> ${finishLabel}
        `;

        // --- SECTION 2: ACTIVE STINT OR COMPLETED STATE OR STINT LAUNCHER ---
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
            const finishTargetText = s.targetFinishTimestamp ? ` • <b>Target End:</b> ${getFinishedTimeStr(s.targetFinishTimestamp, 0)}` : "";

            stintCard.innerHTML = `
                <div style="font-weight: 600; font-size: 1.05em; color: var(--text-accent); margin-bottom: 6px;">
                    ⏱️ Active Stint Progress
                </div>
                <div>
                    <b>Today's Work:</b> ${stintDone} / ${quota} Tasks <span style="color: ${goalMet ? "#eab308" : "var(--text-muted)"}; font-weight: ${goalMet ? "bold" : "normal"};">(${goalTag})</span><br>
                    <b>Time Elapsed:</b> ${formatPacingTime(s.globalTimeElapsed)} • <b>Active Timer:</b> ${formatTime(s.targetSegmentDuration)}${finishTargetText}
                </div>
            `;

            const btnRow = contentEl.createDiv();
            Object.assign(btnRow.style, { display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" });

            const cancelBtn = btnRow.createEl("button", {
                text: "🚫 Cancel Stint",
                attr: {
                    style: "padding: 6px 14px; cursor: pointer; font-size: 0.88em; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444);"
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

            const bankBtn = btnRow.createEl("button", {
                text: "💾 Bank Progress & End Stint",
                cls: "mod-cta",
                attr: { style: "padding: 6px 14px; cursor: pointer; font-size: 0.88em;" }
            });
            bankBtn.onclick = async () => {
                await this.bankAndEndStint();
            };
        } else if (isProjectCompleted) {
            // --- SECTION 2B: PROJECT FULLY COMPLETED ---
            const completedCard = contentEl.createDiv();
            Object.assign(completedCard.style, {
                padding: "18px 16px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                marginBottom: "16px",
                textAlign: "center",
                lineHeight: "1.6"
            });

            completedCard.createEl("h3", {
                text: "🎉 Project Completed!",
                attr: { style: "margin: 0 0 6px 0; color: #10b981;" }
            });
            completedCard.createEl("p", {
                text: `All ${totalGoal} tasks for "${this.project.name}" have been finished (${completed} tasks total). New stints cannot be launched for this completed project.`,
                attr: { style: "margin: 0; color: var(--text-muted); font-size: 0.9em;" }
            });

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
        } else {
            // --- SECTION 2C: STANDARD LAUNCH TODAY'S STINT ---
            contentEl.createEl("h4", { text: "🚀 Launch Today's Stint", attr: { style: "margin: 8px 0;" } });

            new Setting(contentEl)
                .setName("Target Method")
                .setDesc("Choose whether to set a dedicated duration, task quota, or target finish clock time.")
                .addDropdown(dropdown => {
                    dropdown
                        .addOption("time", "Stint Time Target")
                        .addOption("segments", "Stint Segment Target")
                        .addOption("endTime", "Target Finish Time")
                        .setValue(this.stintTargetMode)
                        .onChange(value => {
                            this.stintTargetMode = value as "time" | "segments" | "endTime";
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

            const endTimeSetting = new Setting(contentEl)
                .setName("Target Finish Time")
                .setDesc("What time should this stint finish? (e.g. '3:14PM', '15:14', '5:00 PM').")
                .addText(text => {
                    text.setValue(this.stintEndTimeRaw).onChange(v => {
                        this.stintEndTimeRaw = v;
                        this.updatePreview();
                    });
                });

            const updateVisibility = () => {
                timeSetting.settingEl.style.display = this.stintTargetMode === "time" ? "" : "none";
                segmentSetting.settingEl.style.display = this.stintTargetMode === "segments" ? "" : "none";
                endTimeSetting.settingEl.style.display = this.stintTargetMode === "endTime" ? "" : "none";
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
            
            if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
                let baseSum = 0;
                const startIdx = this.project.totalProjectCompleted || 0;
                for (let i = startIdx; i < Math.min(this.project.customSegmentDurations.length, startIdx + tasks); i++) {
                    baseSum += this.project.customSegmentDurations[i] || 0;
                }
                duration = Math.round(baseSum * (this.project.paceMultiplier || 1.25));
            } else {
                duration = tasks * pace;
            }
        } else if (this.stintTargetMode === "endTime") {
            duration = parseEndTimeToSeconds(this.stintEndTimeRaw);
            if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
                const mult = this.project.paceMultiplier || 1.25;
                const startIdx = this.project.totalProjectCompleted || 0;
                let accumulatedSecs = 0;
                let count = 0;
                for (let i = startIdx; i < this.project.customSegmentDurations.length; i++) {
                    const taskDur = Math.round((this.project.customSegmentDurations[i] || 0) * mult);
                    if (accumulatedSecs + taskDur <= duration) {
                        accumulatedSecs += taskDur;
                        count++;
                    } else {
                        break;
                    }
                }
                tasks = Math.max(1, count);
            } else {
                tasks = Math.min(remainingTasks, Math.floor(duration / pace));
            }
        } else {
            duration = parseDurationToSeconds(this.stintDurationRaw) || 10800;
            if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
                const mult = this.project.paceMultiplier || 1.25;
                const startIdx = this.project.totalProjectCompleted || 0;
                let accumulatedSecs = 0;
                let count = 0;
                for (let i = startIdx; i < this.project.customSegmentDurations.length; i++) {
                    const taskDur = Math.round((this.project.customSegmentDurations[i] || 0) * mult);
                    if (accumulatedSecs + taskDur <= duration) {
                        accumulatedSecs += taskDur;
                        count++;
                    } else {
                        break;
                    }
                }
                tasks = Math.max(1, count);
            } else {
                tasks = Math.min(remainingTasks, Math.floor(duration / pace));
            }
        }

        if (duration <= 0) {
            this.previewEl.textContent = "🎯 Enter a valid future finish time (e.g. '3:14PM') to calculate today's stint...";
            return;
        }

        const finishTimeStr = this.stintTargetMode === "endTime"
            ? getFinishedTimeStr(Date.now() + duration * 1000, 0)
            : getFinishedTimeStr(Date.now(), duration);

        this.previewEl.textContent = `🎯 Today's Stint: ~${tasks} tasks budgeted in ${formatHumanReadableDuration(duration)} • Finish around ${finishTimeStr}`;
    }

    async launchStint() {
        const completed = this.project.totalProjectCompleted || 0;
        const totalGoal = this.project.totalProjectGoal || 100;
        if (completed >= totalGoal) {
            this.plugin.showOverlay("🎉 Project is already completed!", true);
            return;
        }

        const pace = Math.max(1, Math.round((this.project.benchmarkPace || 60) * 1.25));
        const remainingTasks = Math.max(1, totalGoal - completed);

        let duration = 0;
        let tasks = 0;

        if (this.stintTargetMode === "segments") {
            const parsed = parseInt(this.stintTasksRaw, 10);
            tasks = parsed > 0 ? Math.min(remainingTasks, parsed) : Math.min(remainingTasks, 10);
            if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
                let baseSum = 0;
                const startIdx = this.project.totalProjectCompleted || 0;
                for (let i = startIdx; i < Math.min(this.project.customSegmentDurations.length, startIdx + tasks); i++) {
                    baseSum += this.project.customSegmentDurations[i] || 0;
                }
                duration = Math.round(baseSum * (this.project.paceMultiplier || 1.25));
            } else {
                duration = tasks * pace;
            }
        } else if (this.stintTargetMode === "endTime") {
            duration = parseEndTimeToSeconds(this.stintEndTimeRaw);
            if (duration < 60) {
                this.plugin.showOverlay("⚠️ Please enter a future time (e.g. '3:14PM')", false);
                return;
            }
            if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
                const mult = this.project.paceMultiplier || 1.25;
                const startIdx = this.project.totalProjectCompleted || 0;
                let accumulatedSecs = 0;
                let count = 0;
                for (let i = startIdx; i < this.project.customSegmentDurations.length; i++) {
                    const taskDur = Math.round((this.project.customSegmentDurations[i] || 0) * mult);
                    if (accumulatedSecs + taskDur <= duration) {
                        accumulatedSecs += taskDur;
                        count++;
                    } else {
                        break;
                    }
                }
                tasks = Math.max(1, count);
            } else {
                tasks = Math.min(remainingTasks, Math.floor(duration / pace));
            }
        } else {
            duration = parseDurationToSeconds(this.stintDurationRaw) || 10800;
            if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > 0) {
                const mult = this.project.paceMultiplier || 1.25;
                const startIdx = this.project.totalProjectCompleted || 0;
                let accumulatedSecs = 0;
                let count = 0;
                for (let i = startIdx; i < this.project.customSegmentDurations.length; i++) {
                    const taskDur = Math.round((this.project.customSegmentDurations[i] || 0) * mult);
                    if (accumulatedSecs + taskDur <= duration) {
                        accumulatedSecs += taskDur;
                        count++;
                    } else {
                        break;
                    }
                }
                tasks = Math.max(1, count);
            } else {
                tasks = Math.min(remainingTasks, Math.floor(duration / pace));
            }
        }

        tasks = Math.max(1, tasks);
        duration = Math.max(60, duration);

        this.plugin.stopSession();

        let firstDuration = pace;
        if (this.project.customSegmentDurations && this.project.customSegmentDurations.length > (this.project.totalProjectCompleted || 0)) {
            const firstBase = this.project.customSegmentDurations[this.project.totalProjectCompleted || 0] || 60;
            firstDuration = Math.max(1, Math.round(firstBase * (this.project.paceMultiplier || 1.25)));
        }

        const targetFinishTimestamp = this.stintTargetMode === "endTime"
            ? Date.now() + duration * 1000
            : undefined;

        const baseSession: PacingSessionState = {
            mode: "segmented",
            title: "G",
            initialSegmentDuration: firstDuration,
            targetSegmentDuration: firstDuration,
            totalSegments: tasks,
            defaultTotalTime: duration,
            completedSegments: 0,
            cumulativeDelta: 0,
            globalTimeElapsed: 0,
            segmentTimeElapsed: 0,
            isRunning: true,
            isFinished: false,
            lastTickTime: Date.now(),

            segmentedVaultThreshold: Math.max(60, firstDuration * 3),
            segmentedCountUp: true,
            currentQuota: tasks,
            maxTargetSegments: remainingTasks,
            totalWorkTime: 0,
            benchmarkPace: this.project.benchmarkPace || 60,
            hardStopTotalSeconds: duration,
            earlyFinishBanked: 0,
            targetFinishTimestamp,

            customSegmentDurations: this.project.customSegmentDurations,
            paceMultiplier: this.project.paceMultiplier || 1.25,

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