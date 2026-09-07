import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { parseDurationToSeconds, formatHumanReadableDuration, formatPacingTime } from '../utils';

export class AdjustSessionModal extends Modal {
    plugin: PacingTimerPlugin;
    totalTimeRaw: string = "";
    goalSegmentsRaw: string = "";

    constructor(app: App, plugin: PacingTimerPlugin) {
        super(app);
        this.plugin = plugin;
        const s = plugin.session;
        if (s) {
            const totalSecs = s.hardStopTotalSeconds || (s.initialSegmentDuration * s.totalSegments) || 3600;
            this.totalTimeRaw = formatHumanReadableDuration(totalSecs);
            this.goalSegmentsRaw = (s.maxTargetSegments || s.totalSegments || 10).toString();
        }
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "⚙️ Adjust Active Session" });

        const s = this.plugin.session;
        if (!s) {
            contentEl.createEl("p", { text: "No active session to adjust." });
            return;
        }

        const summaryCard = contentEl.createDiv();
        Object.assign(summaryCard.style, {
            padding: "8px 12px",
            borderRadius: "6px",
            background: "var(--background-secondary)",
            border: "1px solid var(--background-modifier-border)",
            fontSize: "0.85em",
            marginBottom: "14px",
            color: "var(--text-muted)",
            lineHeight: "1.5"
        });

        const quota = s.currentQuota || s.totalSegments;
        const maxGoal = s.maxTargetSegments || s.totalSegments;
        summaryCard.innerHTML = `
            <b>Completed:</b> ${s.completedSegments}/${quota} tasks [Max: ${maxGoal}]<br>
            <b>Elapsed:</b> ${formatPacingTime(s.globalTimeElapsed)} • <b>Pace Timer:</b> ${formatHumanReadableDuration(s.targetSegmentDuration)}
        `;

        new Setting(contentEl)
            .setName("Total Session Time (Hard Stop)")
            .setDesc("Adjust the total dedicated time window allocated for this session (e.g. '2h', '8h', '45m').")
            .addText(text => {
                text.setValue(this.totalTimeRaw).onChange(v => this.totalTimeRaw = v);
                setTimeout(() => text.inputEl.focus(), 10);
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this.applyChanges();
                    }
                });
            });

        new Setting(contentEl)
            .setName("Target Goal Segments")
            .setDesc("Adjust your stretch goal for total segments to complete (e.g. '100', '150').")
            .addText(text => {
                text.setValue(this.goalSegmentsRaw).onChange(v => this.goalSegmentsRaw = v);
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this.applyChanges();
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Apply Changes")
                .setCta()
                .onClick(() => this.applyChanges())
            );
    }

    async applyChanges() {
        const s = this.plugin.session;
        if (!s) {
            this.close();
            return;
        }

        const newTotalSeconds = parseDurationToSeconds(this.totalTimeRaw);
        const newGoal = parseInt(this.goalSegmentsRaw, 10);

        if (newTotalSeconds > 0) {
            s.hardStopTotalSeconds = newTotalSeconds;
        }
        if (newGoal > 0) {
            s.maxTargetSegments = newGoal;
            s.totalSegments = newGoal;
        }

        // Maintain previous pacing telemetry while updating achievable quota & workload
        if (s.mode === "segmented") {
            const hardStop = s.hardStopTotalSeconds || 3600;
            const trueTimeLeft = Math.max(0, hardStop - s.globalTimeElapsed);
            const currentDuration = s.targetSegmentDuration || s.initialSegmentDuration || 60;

            const remainingAchievable = Math.floor(trueTimeLeft / currentDuration);
            s.currentQuota = Math.min(s.maxTargetSegments || 10, (s.completedSegments || 0) + remainingAchievable);

            const remainingTasks = Math.max(0, s.currentQuota - (s.completedSegments || 0));
            const remainingWorkTime = remainingTasks * currentDuration;
            const totalNeeded = s.globalTimeElapsed + remainingWorkTime;
            s.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);
        }

        this.plugin.updateStatusBar();
        await this.plugin.saveSettings();
        this.plugin.showOverlay(
            `⚙️ Session Adjusted: Quota ${s.currentQuota || s.totalSegments} [Max: ${s.maxTargetSegments || s.totalSegments}]`,
            true
        );
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}