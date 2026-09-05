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
            .setDesc("Initial dream goal for segments to complete.")
            .addText(text => {
                text.setValue(config.segmentsRaw).onChange(v => {
                    config.segmentsRaw = v;
                    updatePreview();
                });
            });

        new Setting(container)
            .setName("Count Up Completed Segments")
            .setDesc("Display progress counting up as (completed/quota) [Max: goal] instead of counting down remaining segments.")
            .addToggle(toggle => {
                toggle.setValue(config.segmentedCountUp).onChange(v => {
                    config.segmentedCountUp = v;
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
            let segDuration = 60;

            if (config.segmentedInputMode === "segment") {
                segDuration = parseDurationToSeconds(config.segmentedSegmentDurationRaw) || 60;
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
                    segDuration = Math.round(totalTime / segs);
                    const finishTime = getFinishedTimeStr(Date.now(), totalTime);
                    timeStr = `🎯 Each segment will take: ${formatTime(segDuration)} (Total: ${formatPacingTime(totalTime)} • Finish by ${finishTime})`;
                } else {
                    timeStr = "🎯 Enter total time and segments to see target calculations...";
                }
            }

            const autoThreshold = Math.max(60, segDuration * 3);
            timeStr += `<br><span style="color: var(--text-accent); font-size: 0.9em;">⚡ Telemetry Active: Milestones auto-scaled to 3× segment timer (±${formatHumanReadableDuration(autoThreshold)})</span>`;

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
        settings.segmentedCountUp = config.segmentedCountUp;
    },

    createSessionState(config) {
        const segs = Math.max(1, parseInt(config.segmentsRaw, 10) || 10);
        let duration = 60;
        let totalTime = 600;

        if (config.segmentedInputMode === "segment") {
            duration = Math.max(1, parseDurationToSeconds(config.segmentedSegmentDurationRaw) || 60);
            totalTime = duration * segs;
        } else {
            totalTime = parseDurationToSeconds(config.segmentedTotalTimeRaw) || 600;
            duration = Math.max(1, Math.round(totalTime / segs));
        }

        const autoThreshold = Math.max(60, duration * 3);
        const countUp = config.segmentedCountUp ?? false;

        return {
            initialSegmentDuration: duration,
            targetSegmentDuration: duration,
            totalSegments: segs,
            segmentedVaultThreshold: autoThreshold,
            segmentedCountUp: countUp,
            cumulativeDelta: 0,
            completedSegments: 0,
            currentQuota: segs,
            maxTargetSegments: segs,
            totalWorkTime: 0,
            benchmarkPace: duration,
            hardStopTotalSeconds: totalTime,
            earlyFinishBanked: 0
        };
    },

    tick(session, plugin, deltaSeconds) {
        session.segmentedVaultThreshold = Math.max(60, Math.round(session.targetSegmentDuration * 3));
    },

    onComplete(session, plugin) {
        plugin.playMechClack();
        const splitDuration = session.segmentTimeElapsed;
        const savedOffset = session.targetSegmentDuration - splitDuration;

        session.cumulativeDelta += savedOffset;
        session.completedSegments++;
        session.totalWorkTime = (session.totalWorkTime || 0) + splitDuration;
        session.segmentTimeElapsed = 0;

        // Dynamic 3x threshold
        const threshold = Math.max(60, Math.round(session.targetSegmentDuration * 3));
        session.segmentedVaultThreshold = threshold;

        // True remaining time in dedicated session base
        const hardStop = session.hardStopTotalSeconds || (session.initialSegmentDuration * session.totalSegments);
        const trueTimeLeft = Math.max(0, hardStop - session.globalTimeElapsed);

        const currentBenchmark = session.benchmarkPace || session.initialSegmentDuration || 60;
        
        // Exact decimal division
        const sessionAvg = session.completedSegments > 0 
            ? (session.totalWorkTime / session.completedSegments) 
            : currentBenchmark;

        const paceRatio = Math.round((sessionAvg / currentBenchmark) * 100);

        // --- SURPLUS MILESTONE CHECK (+threshold) ---
        if (session.cumulativeDelta >= threshold) {
            const maxGoal = session.maxTargetSegments || session.totalSegments;
            const prevQuota = session.currentQuota || maxGoal;
            const isAtMax = prevQuota >= maxGoal;

            // PRIORITY 1: GEAR SHIFT! (Pace proved <= 50% of benchmark)
            if (paceRatio <= 50) {
                const newBenchmark = Math.max(1, Math.round(sessionAvg));
                const newDuration = Math.max(1, Math.round(sessionAvg * 1.25));
                session.benchmarkPace = newBenchmark;
                session.targetSegmentDuration = newDuration;
                session.initialSegmentDuration = newDuration;

                const paceStr = formatHumanReadableDuration(newDuration).replace(/\s+/g, "");

                if (isAtMax) {
                    const remainingTasks = Math.max(0, maxGoal - session.completedSegments);
                    const newRemainingWorkTime = remainingTasks * newDuration;
                    const totalNeeded = session.globalTimeElapsed + newRemainingWorkTime;
                    session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);
                    session.cumulativeDelta = 0;

                    plugin.playVictoryChime();
                    plugin.showOverlay(
                        `⚡ Gear Shift: ${paceStr} Pace, +0 Tasks`,
                        true,
                        "up"
                    );
                } else {
                    const remainingAchievable = Math.floor(trueTimeLeft / newDuration);
                    session.currentQuota = Math.min(maxGoal, session.completedSegments + remainingAchievable);
                    
                    const remainingTasks = Math.max(0, session.currentQuota - session.completedSegments);
                    const newRemainingWorkTime = remainingTasks * newDuration;
                    const totalNeeded = session.globalTimeElapsed + newRemainingWorkTime;
                    session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);
                    session.cumulativeDelta = 0;

                    const quotaDiff = Math.max(0, session.currentQuota - prevQuota);
                    plugin.playVictoryChime();
                    plugin.showOverlay(
                        `⚡ Gear Shift: ${paceStr} Pace, +${quotaDiff} Tasks`,
                        true,
                        "up"
                    );
                }
            }
            // PRIORITY 2: EARLY CHECKOUT (At Max Quota, normal pace > 50%)
            else if (isAtMax) {
                session.earlyFinishBanked = (session.earlyFinishBanked || 0) + threshold;
                session.cumulativeDelta -= threshold;

                const pullStr = formatHumanReadableDuration(threshold).replace(/\s+/g, "");
                plugin.playVictoryChime();
                plugin.showOverlay(
                    `🏆 Max Quota: -${pullStr}`,
                    true,
                    "up"
                );
            }
            // PRIORITY 3: RHYTHM RULE (Below Max Quota, normal pace > 50%)
            else {
                const earnedSegments = Math.max(1, Math.floor(threshold / session.targetSegmentDuration));
                session.currentQuota = Math.min(maxGoal, (session.currentQuota || session.totalSegments) + earnedSegments);
                session.cumulativeDelta -= threshold;

                plugin.playVictoryChime();
                plugin.showOverlay(
                    `⭐ Rhythm Milestone: +${earnedSegments} Tasks`,
                    true,
                    "up"
                );
            }
        }

        // --- DEFICIT CHECK ON COMPLETE (-threshold) ---
        else if (session.cumulativeDelta <= -threshold) {
            const prevQuota = session.currentQuota || session.maxTargetSegments || session.totalSegments;
            const actualAvg = session.totalWorkTime / session.completedSegments;
            
            // DIRECTIONALITY LOCK: Never tighten timer during a deficit!
            const proposedDuration = Math.max(1, Math.round(actualAvg * 1.25));
            const newDuration = Math.max(session.targetSegmentDuration, proposedDuration);

            session.benchmarkPace = Math.max(session.benchmarkPace || 60, Math.round(actualAvg));
            session.targetSegmentDuration = newDuration;
            session.initialSegmentDuration = newDuration;

            // Calculate achievable tasks in remaining time
            const remainingAchievable = Math.floor(trueTimeLeft / newDuration);
            session.currentQuota = Math.min(session.maxTargetSegments || session.totalSegments, session.completedSegments + remainingAchievable);

            // PRESERVE EARLY FINISH: Synchronize earlyFinishBanked to the true remaining workload
            const remainingTasks = Math.max(0, session.currentQuota - session.completedSegments);
            const remainingWorkTime = remainingTasks * newDuration;
            const totalNeeded = session.globalTimeElapsed + remainingWorkTime;
            session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);

            session.cumulativeDelta = 0;

            const quotaDiff = session.currentQuota - prevQuota;
            const quotaDiffSign = quotaDiff >= 0 ? "+" : "";
            const paceStr = formatHumanReadableDuration(newDuration).replace(/\s+/g, "");

            plugin.playShieldBash();
            plugin.showOverlay(
                `🛟 Rescue: ${paceStr} Pace, ${quotaDiffSign}${quotaDiff} Tasks`,
                false,
                "down"
            );
        }

        // Finish condition
        if (session.completedSegments >= (session.currentQuota || session.totalSegments)) {
            session.isRunning = false;
            session.isFinished = true;
            plugin.stopInterval();
        }
    },

    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        const maxGoal = session.maxTargetSegments || session.totalSegments;
        const currentQuota = session.currentQuota || session.totalSegments;

        if (session.isFinished) {
            const liveDelta = session.cumulativeDelta;
            const deltaSign = liveDelta > 0 ? "+" : "";
            const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");
            const deltaStr = formatDelta(liveDelta);
            
            return `${clockPrefix}⏱️ [${displayTitle}:00:00] [<span style="${deltaStyle}">${deltaSign}${deltaStr}</span>] 🏆 Done! (${session.completedSegments}/${currentQuota}) [Max: ${maxGoal}]`;
        }

        // Segment Countdown: Bold Yellow (#eab308) when positive, Bold Red (#ef4444) when in overtime
        const segmentTimeLeft = session.targetSegmentDuration - session.segmentTimeElapsed;
        const segStr = segmentTimeLeft >= 0 ? formatTime(segmentTimeLeft) : `-${formatTime(Math.abs(segmentTimeLeft))}`;
        const segmentStyle = segmentTimeLeft >= 0 
            ? "color: #eab308; font-weight: bold;" 
            : "color: #ef4444; font-weight: bold;";

        const globalOvertime = session.segmentTimeElapsed > session.targetSegmentDuration 
            ? session.segmentTimeElapsed - session.targetSegmentDuration 
            : 0;
        const liveDelta = session.cumulativeDelta - globalOvertime;
        const deltaSign = liveDelta > 0 ? "+" : (liveDelta < 0 ? "-" : "");
        const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");

        // STEPPED MILESTONE HORIZON:
        const hardStop = session.hardStopTotalSeconds || (session.initialSegmentDuration * session.totalSegments);
        const earlyBanked = session.earlyFinishBanked || 0;
        const steppedTotalSeconds = Math.max(0, hardStop - earlyBanked);
        const remainingSteppedSeconds = Math.max(0, steppedTotalSeconds - session.globalTimeElapsed);

        // [G:...] and the finish clock now both reflect the true remaining work time
        const formattedGlobalTime = formatPacingTime(remainingSteppedSeconds);
        const estFinishedTimeStr = getFinishedTimeStr(session.lastTickTime, remainingSteppedSeconds);

        const threshold = Math.max(60, Math.round(session.targetSegmentDuration * 3));

        // Exact decimal telemetry
        const currentBenchmark = session.benchmarkPace || session.initialSegmentDuration || 60;
        const sessionAvg = session.completedSegments > 0 
            ? ((session.totalWorkTime || 0) / session.completedSegments) 
            : currentBenchmark;
        const paceRatio = Math.round((sessionAvg / currentBenchmark) * 100);

        let ratioDisplay = `(${paceRatio}%)`;
        if (paceRatio <= 50) {
            ratioDisplay = `(<span style="color: #a6e3a1; font-weight: bold;">⚡${paceRatio}%</span>)`;
        } else if (paceRatio > 100) {
            ratioDisplay = `(<span style="color: #f38ba8;">${paceRatio}%</span>)`;
        }

        // Target boundary display: +01:15/03:00
        const deltaTargetDisplay = `${deltaSign}${formatTime(Math.abs(liveDelta))}/${formatTime(threshold)}`;
        const deltaDisplay = `[<span style="${deltaStyle}">${deltaTargetDisplay}</span> ${ratioDisplay}: ${estFinishedTimeStr}]`;

        const countDisplay = session.segmentedCountUp
            ? `(${session.completedSegments}/${currentQuota}) [Max: ${maxGoal}]`
            : `(${Math.max(0, currentQuota - session.completedSegments)}) [Max: ${maxGoal}]`;

        return `${clockPrefix}⏱️ [${displayTitle}:${formattedGlobalTime}] [S:<span style="${segmentStyle}">${segStr}</span>] ${deltaDisplay} ${countDisplay}${pauseText}`;
    }
};