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
        config.segmentedVaultThresholdRaw = config.segmentedVaultThresholdRaw ?? plugin.settings.segmentedVaultThresholdRaw ?? "5m";
        config.segmentedAllowLevelDown = config.segmentedAllowLevelDown ?? plugin.settings.segmentedAllowLevelDown ?? true;
        config.segmentedCountUp = config.segmentedCountUp ?? plugin.settings.segmentedCountUp ?? false;

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

        new Setting(container)
            .setName("Count Up Completed Segments")
            .setDesc("Display progress counting up as (completed/total), e.g. (15/100), instead of counting down remaining segments, e.g. (85).")
            .addToggle(toggle => {
                toggle.setValue(config.segmentedCountUp).onChange(v => {
                    config.segmentedCountUp = v;
                });
            });

        // --- Vault Settings ---
        new Setting(container)
            .setName("Vault Level Threshold")
            .setDesc("Surplus required to earn a Level and pull finish time earlier (e.g. '5m', '10m', '300s').")
            .addText(text => {
                text.setValue(config.segmentedVaultThresholdRaw).onChange(v => {
                    config.segmentedVaultThresholdRaw = v;
                    updatePreview();
                });
            });

        new Setting(container)
            .setName("Allow Level-Down")
            .setDesc("If enabled, falling behind by the threshold consumes a level as a shield. If disabled, earned levels are permanent.")
            .addToggle(toggle => {
                toggle.setValue(config.segmentedAllowLevelDown).onChange(v => {
                    config.segmentedAllowLevelDown = v;
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
            let timeStr = "";

            if (config.segmentedInputMode === "segment") {
                const segDuration = parseDurationToSeconds(config.segmentedSegmentDurationRaw);
                if (segs > 0 && segDuration > 0) {
                    const totalTime = segs * segDuration;
                    const finishTime = getFinishedTimeStr(Date.now(), totalTime);
                    timeStr = `🎯 Total session time: ${formatPacingTime(totalTime)} (${segs} segments × ${formatHumanReadableDuration(segDuration)}) • Finish by ${finishTime}`;
                } else {
                    timeStr = "🎯 Enter segment duration and segments to see target calculations...";
                }
            } else {
                const totalTime = parseDurationToSeconds(config.segmentedTotalTimeRaw);
                if (segs > 0 && totalTime > 0) {
                    const segDuration = Math.round(totalTime / segs);
                    const finishTime = getFinishedTimeStr(Date.now(), totalTime);
                    timeStr = `🎯 Each segment will take: ${formatTime(segDuration)} (Total: ${formatPacingTime(totalTime)} • Finish by ${finishTime})`;
                } else {
                    timeStr = "🎯 Enter total time and segments to see target calculations...";
                }
            }

            const thSecs = parseDurationToSeconds(config.segmentedVaultThresholdRaw) || 300;
            timeStr += `<br><span style="color: var(--text-accent); font-size: 0.9em;">⭐ Vault: Level Up every ${formatHumanReadableDuration(thSecs)} banked (Window: [±${formatHumanReadableDuration(thSecs)}])</span>`;

            previewEl.innerHTML = timeStr;
        };

        updateVisibility();
        config.updatePreviewUI();
    },

    saveSettings(config, settings) {
        settings.segmentedInputMode = config.segmentedInputMode;
        settings.segmentedTotalTimeRaw = config.segmentedTotalTimeRaw;
        settings.segmentedSegmentDurationRaw = config.segmentedSegmentDurationRaw;
        settings.segmentedSegmentsRaw = config.segmentsRaw;
        settings.segmentedVaultThresholdRaw = config.segmentedVaultThresholdRaw;
        settings.segmentedAllowLevelDown = config.segmentedAllowLevelDown;
        settings.segmentedCountUp = config.segmentedCountUp;
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

        const vaultThreshold = parseDurationToSeconds(config.segmentedVaultThresholdRaw) || 300;
        const allowLevelDown = config.segmentedAllowLevelDown ?? true;
        const countUp = config.segmentedCountUp ?? false;

        return {
            initialSegmentDuration: duration,
            targetSegmentDuration: duration,
            totalSegments: segs,
            segmentedVaultEnabled: true,
            segmentedVaultThreshold: vaultThreshold,
            segmentedAllowLevelDown: allowLevelDown,
            segmentedCountUp: countUp,
            segmentedLevel: 0,
            cumulativeDelta: 0,
            completedSegments: 0
        };
    },

    tick(session, plugin, deltaSeconds) {
        // Live Level-Down Shield check if segment overtime drops past the negative threshold
        if (!session.segmentedAllowLevelDown) return;
        if ((session.segmentedLevel || 0) <= 0) return;

        const threshold = session.segmentedVaultThreshold || 300;
        const globalOvertime = session.segmentTimeElapsed > session.initialSegmentDuration
            ? session.segmentTimeElapsed - session.initialSegmentDuration
            : 0;
        const liveDelta = session.cumulativeDelta - globalOvertime;

        if (liveDelta <= -threshold) {
            let levelsLost = 0;
            while ((session.segmentedLevel || 0) > 0 && (session.cumulativeDelta - globalOvertime) <= -threshold) {
                session.segmentedLevel = (session.segmentedLevel || 0) - 1;
                session.cumulativeDelta += threshold;
                levelsLost++;
            }
            if (levelsLost > 0) {
                plugin.playShieldBash();
                plugin.showOverlay(
                    `⚠️ Level Down (L${session.segmentedLevel}) | Shield Absorbed -${formatHumanReadableDuration(levelsLost * threshold)}`,
                    false,
                    "down"
                );
            }
        }
    },

    onComplete(session, plugin) {
        plugin.playMechClack();
        const savedOffset = session.initialSegmentDuration - session.segmentTimeElapsed;
        session.cumulativeDelta += savedOffset;
        session.completedSegments++;
        session.segmentTimeElapsed = 0;

        const threshold = session.segmentedVaultThreshold || 300;

        // Level Up: Bank surplus into discrete levels
        let levelsGained = 0;
        while (session.cumulativeDelta >= threshold) {
            session.segmentedLevel = (session.segmentedLevel || 0) + 1;
            session.cumulativeDelta -= threshold;
            levelsGained++;
        }
        if (levelsGained > 0) {
            plugin.playVictoryChime();
            plugin.showOverlay(
                `⭐ Level ${session.segmentedLevel}! Banked +${formatHumanReadableDuration(levelsGained * threshold)}`,
                true,
                "up"
            );
        }

        // Level Down on complete (if overtime was not already absorbed during live tick)
        if (session.segmentedAllowLevelDown && (session.segmentedLevel || 0) > 0 && session.cumulativeDelta <= -threshold) {
            let levelsLost = 0;
            while ((session.segmentedLevel || 0) > 0 && session.cumulativeDelta <= -threshold) {
                session.segmentedLevel = (session.segmentedLevel || 0) - 1;
                session.cumulativeDelta += threshold;
                levelsLost++;
            }
            if (levelsLost > 0) {
                plugin.playShieldBash();
                plugin.showOverlay(
                    `⚠️ Level Down (L${session.segmentedLevel}) | Shield Absorbed -${formatHumanReadableDuration(levelsLost * threshold)}`,
                    false,
                    "down"
                );
            }
        }

        // Target duration stays fair and stable (never compressed)
        session.targetSegmentDuration = session.initialSegmentDuration;

        if (session.completedSegments >= session.totalSegments) {
            session.isRunning = false;
            session.isFinished = true;
            plugin.stopInterval();
        }
    },

    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        if (session.isFinished) {
            const liveDelta = session.cumulativeDelta;
            const deltaSign = liveDelta > 0 ? "+" : "";
            const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");
            const deltaStr = formatDelta(liveDelta);
            
            return `${clockPrefix}⏱️ [${displayTitle}:00:00] [L${session.segmentedLevel || 0}: <span style="${deltaStyle}">${deltaSign}${deltaStr}</span>] 🏆 Done! (${session.completedSegments}/${session.totalSegments})`;
        }
        
        const globalTimeLimit = session.initialSegmentDuration * session.totalSegments;
        const globalTimeRemaining = Math.max(0, globalTimeLimit - session.globalTimeElapsed);
        const segmentTimeLeft = session.targetSegmentDuration - session.segmentTimeElapsed;

        const segStr = segmentTimeLeft >= 0 ? formatTime(segmentTimeLeft) : `-${formatTime(Math.abs(segmentTimeLeft))}`;
        const segmentStyle = segmentTimeLeft < 0 ? "color: #ef4444; font-weight: bold;" : "";
        
        const globalOvertime = session.segmentTimeElapsed > session.initialSegmentDuration 
            ? session.segmentTimeElapsed - session.initialSegmentDuration 
            : 0;
        const liveDelta = session.cumulativeDelta - globalOvertime;
        const deltaSign = liveDelta > 0 ? "+" : "";
        const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");

        const threshold = session.segmentedVaultThreshold || 300;
        const bankedSeconds = (session.segmentedLevel || 0) * threshold;
        const targetSessionSeconds = Math.max(0, globalTimeLimit - bankedSeconds);
        const remainingForLevel = Math.max(0, targetSessionSeconds - session.globalTimeElapsed);
        
        // Stepped Horizon: strictly pinned to the current level milestone
        const estFinishedTimeStr = getFinishedTimeStr(session.lastTickTime, remainingForLevel);
        const deltaDisplay = `[L${session.segmentedLevel || 0}: <span style="${deltaStyle}">${deltaSign}${formatDelta(liveDelta)}</span>: ${estFinishedTimeStr}]`;

        const formattedGlobalTime = formatPacingTime(globalTimeRemaining);

        // Segment counter: (15/100) if counting up, or (85) if countdown
        const segmentCountDisplay = session.segmentedCountUp
            ? `(${session.completedSegments}/${session.totalSegments})`
            : `(${Math.max(0, session.totalSegments - session.completedSegments)})`;

        return `${clockPrefix}⏱️ [${displayTitle}:${formattedGlobalTime}] [S:<span style="${segmentStyle}">${segStr}</span>] ${deltaDisplay} ${segmentCountDisplay}${pauseText}`;
    }
};