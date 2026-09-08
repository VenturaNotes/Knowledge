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
        const remainingProjectSeconds = remainingTasks * paceWithLeeway;
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
            marginBottom: "4px"
        });

        const progressLeft = progressRow.createDiv();
        Object.assign(progressLeft.style, { display: "flex", alignItems: "center", gap: "8px" });
        progressLeft.createSpan({ text: `Project Progress: ${completed} / ${totalGoal} Tasks` });

        const editGoalBtn = progressLeft.createEl("button", {
            text: "✏️ Edit Goal",
            attr: { style: "font-size: 0.72em; padding: 2px 7px; cursor: pointer; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-muted);" }
        });
        editGoalBtn.onclick = () => {
            new EditProjectGoalModal(this.app, this.plugin, this.project, () => this.render()).open();
        };

        progressRow.createSpan({ text: `${pct}% Complete`, attr: { style: `color: ${pctColor};` } });

        const metaDiv = macroCard.createDiv();
        Object.assign(metaDiv.style, { color: "var(--text-muted)" });
        metaDiv.innerHTML = `⏱️ <b>Pacing:</b> ${formatHumanReadableDuration(paceWithLeeway).replace(/\s+/g, "")} per task<br>⏳ <b>Est. Total Project Finish:</b> ${finishLabel}`;

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
                <div style="font-weight: 600; font-size: 1.05em; color: var(--text-accent); margin-bottom: 6px;">⏱️ Active Stint Progress</div>
                <div><b>Today's Work:</b> ${stintDone} / ${quota} Tasks <span style="color: ${goalMet ? "#eab308" : "var(--text-muted)"}; font-weight: ${goalMet ? "bold" : "normal"};">(${goalTag})</span><br>
                <b>Time Elapsed:</b> ${formatPacingTime(s.globalTimeElapsed)} • <b>Active Timer:</b> ${formatTime(s.targetSegmentDuration)}${finishTargetText}</div>
            `;

            const btnRow = contentEl.createDiv();
            Object.assign(btnRow.style, { display: "flex", gap: "8px", justifyContent: "flex-end" });

            const cancelBtn = btnRow.createEl("button", {
                text: "🚫 Cancel Stint",
                attr: { style: "padding: 6px 14px; cursor: pointer; font-size: 0.88em; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444);" }
            });
            cancelBtn.onclick = async () => {
                if (confirm(`Cancel active stint for "${this.project.name}"? Progress from this stint will not be banked.`)) {
                    this.plugin.stopSession();
                    await this.plugin.saveSettings();
                    this.plugin.showOverlay("🚫 Stint Canceled", false);
                    this.render();
                }
            };

            const adjustCountdownBtn = btnRow.createEl("button", {
                text: "⏱️ Adjust Countdown",
                attr: { style: "padding: 6px 12px; cursor: pointer; font-size: 0.88em;" }
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
                await this.plugin.bankActiveStint();
                this.render();
            };
        } else {
            contentEl.createEl("p", {
                text: "Open the Pacing Setup Modal to manage projects and launch daily stints.",
                attr: { style: "color: var(--text-muted); font-size: 0.9em; text-align: center; padding: 20px 0;" }
            });
        }
    }

    onClose() {
        this.contentEl.empty();
    }
}