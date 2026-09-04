import { Setting, TextComponent } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { 
    parseDurationToSeconds, 
    formatTime, 
    formatDelta, 
    getFinishedTimeStr, 
    formatHumanReadableDuration, 
    formatPacingTime 
} from "../utils";

export const SegmentedMode: ModeHandler = {
    id: "segmented",
    displayName: "Classic Pacing",
    buildSettings(container, plugin, config, updatePreview) {
        config.segmentedInputMode = config.segmentedInputMode ?? plugin.settings.segmentedInputMode ?? "total";
        config.segmentedTotalTimeRaw = config.segmentedTotalTimeRaw ?? plugin.settings.segmentedTotalTimeRaw ?? "10m";
        config.segmentedSegmentDurationRaw = config.segmentedSegmentDurationRaw ?? plugin.settings.segmentedSegmentDurationRaw ?? "1m";
        config.segmentsRaw = config.segmentsRaw ?? plugin.settings.segmentedSegmentsRaw ?? "10";

        let totalTimeComponent: TextComponent | null = null;
        let segmentDurationComponent: TextComponent | null = null;

        new Setting(container)
            .setName("Target Calculation")
            .setDesc("Choose whether to divide total time into segments or multiply segment duration by segments.")
            .addDropdown(dropdown => {
                dropdown
                    .addOption("total", "Total Session Time (Total ÷ Segments)")
                    .addOption("segment", "Segment Duration (Segment × Segments)")
                    .setValue(config.segmentedInputMode)
                    .onChange(value => {
                        const prevMode = config.segmentedInputMode;
                        config.segmentedInputMode = value as "total" | "segment";

                        const segs = parseInt(config.segmentsRaw, 10);
                        if (prevMode === "total" && config.segmentedInputMode === "segment") {
                            const totalTime = parseDurationToSeconds(config.segmentedTotalTimeRaw);
                            if (segs > 0 && totalTime > 0) {
                                const segDuration = Math.max(1, Math.round(totalTime / segs));
                                config.segmentedSegmentDurationRaw = formatHumanReadableDuration(segDuration);
                                segmentDurationComponent?.setValue(config.segmentedSegmentDurationRaw);
                            }
                        } else if (prevMode === "segment" && config.segmentedInputMode === "total") {
                            const segDuration = parseDurationToSeconds(config.segmentedSegmentDurationRaw);
                            if (segs > 0 && segDuration > 0) {
                                const totalTime = segs * segDuration;
                                config.segmentedTotalTimeRaw = formatHumanReadableDuration(totalTime);
                                totalTimeComponent?.setValue(config.segmentedTotalTimeRaw);
                            }
                        }

                        updateVisibility();
                        updatePreview();
                    });
            });

        const totalTimeSetting = new Setting(container)
            .setName("Total Session Time")
            .setDesc("Target window for entire session (e.g. '10m', '1.5h', '45:00').")
            .addText(text => {
                totalTimeComponent = text;
                text.setValue(config.segmentedTotalTimeRaw).onChange(v => {
                    config.segmentedTotalTimeRaw = v;
                    updatePreview();
                });
            });

        const segmentDurationSetting = new Setting(container)
            .setName("Segment Duration")
            .setDesc("Target duration per segment (e.g. '1m', '90s', '5m').")
            .addText(text => {
                segmentDurationComponent = text;
                text.setValue(config.segmentedSegmentDurationRaw).onChange(v => {
                    config.segmentedSegmentDurationRaw = v;
                    updatePreview();
                });
            });

        new Setting(container)
            .setName("Total Target Segments")
            .setDesc("Number of segments you expect to execute.")
            .addText(text => {
                text.setValue(config.segmentsRaw).onChange(v => {
                    config.segmentsRaw = v;
                    updatePreview();
                });
            });

        const previewEl = container.createEl("p", { cls: "pacing-calculation-preview" });
        Object.assign(previewEl.style, { color: "var(--text-muted)", fontSize: "0.85em", marginTop: "10px", paddingLeft: "4px" });

        const updateVisibility = () => {
            const isTotal = config.segmentedInputMode === "total";
            totalTimeSetting.settingEl.style.display = isTotal ? "" : "none";
            segmentDurationSetting.settingEl.style.display = isTotal ? "none" : "";
            if (isTotal) {
                setTimeout(() => totalTimeComponent?.inputEl.focus(), 10);
            } else {
                setTimeout(() => segmentDurationComponent?.inputEl.focus(), 10);
            }
        };

        config.updatePreviewUI = () => {
            const segs = parseInt(config.segmentsRaw, 10);
            if (config.segmentedInputMode === "segment") {
                const segDuration = parseDurationToSeconds(config.segmentedSegmentDurationRaw);
                if (segs > 0 && segDuration > 0) {
                    const totalTime = segs * segDuration;
                    previewEl.textContent = `🎯 Total session time: ${formatPacingTime(totalTime)} (${segs} segments × ${formatHumanReadableDuration(segDuration)})`;
                } else {
                    previewEl.textContent = "🎯 Enter segment duration and segments to see target calculations...";
                }
            } else {
                const totalTime = parseDurationToSeconds(config.segmentedTotalTimeRaw);
                if (segs > 0 && totalTime > 0) {
                    const segDuration = Math.max(1, Math.round(totalTime / segs));
                    previewEl.textContent = `🎯 Each segment will take: ${formatTime(segDuration)} (Total: ${formatPacingTime(totalTime)})`;
                } else {
                    previewEl.textContent = "🎯 Enter total time and segments to see target calculations...";
                }
            }
        };

        updateVisibility();
        config.updatePreviewUI();
    },

    saveSettings(config, settings) {
        settings.segmentedInputMode = config.segmentedInputMode;
        settings.segmentedTotalTimeRaw = config.segmentedTotalTimeRaw;
        settings.segmentedSegmentDurationRaw = config.segmentedSegmentDurationRaw;
        settings.segmentedSegmentsRaw = config.segmentsRaw;
    },

    createSessionState(config) {
        const segs = Math.max(1, parseInt(config.segmentsRaw, 10) || 10);
        let duration = 60;

        if (config.segmentedInputMode === "segment") {
            duration = Math.max(1, parseDurationToSeconds(config.segmentedSegmentDurationRaw) || 60);
        } else {
            const totalTime = parseDurationToSeconds(config.segmentedTotalTimeRaw) || 600;
            duration = Math.max(1, Math.round(totalTime / segs));
        }

        return {
            initialSegmentDuration: duration,
            targetSegmentDuration: duration,
            totalSegments: segs
        };
    },

    tick(session, plugin, deltaSeconds) { /* Handled generically by main interval */ },

    onComplete(session, plugin) {
        plugin.playMechClack();
        const savedOffset = session.initialSegmentDuration - session.segmentTimeElapsed;
        session.cumulativeDelta += savedOffset;
        session.completedSegments++;
        session.segmentTimeElapsed = 0;

        if (session.completedSegments >= session.totalSegments) {
            session.isRunning = false;
            session.isFinished = true;
            plugin.stopInterval();
        } else {
            const remainingSegments = session.totalSegments - session.completedSegments;
            if (remainingSegments > 0) {
                if (session.cumulativeDelta < 0) {
                    const adjusted = session.initialSegmentDuration + (session.cumulativeDelta / remainingSegments);
                    session.targetSegmentDuration = Math.max(1, Math.round(adjusted));
                } else {
                    session.targetSegmentDuration = session.initialSegmentDuration;
                }
            }
        }
    },

    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        if (session.isFinished) {
            const liveDelta = session.cumulativeDelta;
            const deltaSign = liveDelta > 0 ? "+" : "";
            const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");
            const deltaStr = formatDelta(liveDelta);
            
            return `${clockPrefix}⏱️ [${displayTitle}:00:00] [Δ<span style="${deltaStyle}">${deltaSign}${deltaStr}</span>] 🏆 Done! (${session.completedSegments}/${session.totalSegments})`;
        }
        
        const globalTimeLimit = session.initialSegmentDuration * session.totalSegments;
        const globalTimeRemaining = Math.max(0, globalTimeLimit - session.globalTimeElapsed);
        const segmentTimeLeft = session.targetSegmentDuration - session.segmentTimeElapsed;

        const segStr = segmentTimeLeft >= 0 ? formatTime(segmentTimeLeft) : `-${formatTime(Math.abs(segmentTimeLeft))}`;
        const segmentStyle = segmentTimeLeft < 0 ? "color: #ef4444; font-weight: bold;" : "";
        
        const globalOvertime = session.segmentTimeElapsed > session.initialSegmentDuration ? session.segmentTimeElapsed - session.initialSegmentDuration : 0;
        const liveDelta = session.cumulativeDelta - globalOvertime;
        const deltaSign = liveDelta > 0 ? "+" : "";
        const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");
        const estFinishedTimeStr = getFinishedTimeStr(session.lastTickTime, Math.max(0, globalTimeRemaining - liveDelta));

        const formattedGlobalTime = formatPacingTime(globalTimeRemaining);

        return `${clockPrefix}⏱️ [${displayTitle}:${formattedGlobalTime}] [S:<span style="${segmentStyle}">${segStr}</span>] [Δ<span style="${deltaStyle}">${deltaSign}${formatDelta(liveDelta)}</span>:&nbsp;${estFinishedTimeStr}] (${Math.max(0, session.totalSegments - session.completedSegments)})${pauseText}`;
    }
};