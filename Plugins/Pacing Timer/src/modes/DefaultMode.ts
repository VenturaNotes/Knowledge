import { Setting } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { parseDurationToSeconds, formatTime, getFinishedTimeStr } from "../utils";

export const DefaultMode: ModeHandler = {
    id: "default",
    displayName: "Simple Countdown",
    buildSettings(container, plugin, config) {
        config.defaultTotalTimeRaw = config.defaultTotalTimeRaw ?? "10m";
        config.defaultCountEnabled = config.defaultCountEnabled ?? plugin.settings.defaultCountEnabled ?? false;

        new Setting(container)
            .setName("Total Session Duration")
            .setDesc("Supports formats like '15 minutes', '20m', '12:30', or '600'.")
            .addText(text => {
                text.setValue(config.defaultTotalTimeRaw).onChange(v => config.defaultTotalTimeRaw = v);
                setTimeout(() => text.inputEl.focus(), 10);
            });

        new Setting(container)
            .setName("Enable Task Counter")
            .setDesc("Show a completed task counter (e.g. [1 : 5:00]) and reset the section countdown upon completing each task.")
            .addToggle(toggle => {
                toggle.setValue(config.defaultCountEnabled).onChange(v => config.defaultCountEnabled = v);
            });
    },
    saveSettings(config, settings) {
        settings.defaultCountEnabled = config.defaultCountEnabled;
    },
    createSessionState(config) {
        return {
            defaultTotalTime: parseDurationToSeconds(config.defaultTotalTimeRaw) || 600,
            defaultCountEnabled: config.defaultCountEnabled ?? false,
            completedSegments: 0
        };
    },
    tick(session, plugin, deltaSeconds) {
        if (session.globalTimeElapsed >= session.defaultTotalTime) {
            plugin.triggerAlarmSequence();
        }
    },
    onComplete(session, plugin) {
        if (session.defaultCountEnabled) {
            plugin.stopAlarmSequence();
            plugin.playMechClack();
            session.completedSegments += 1;
            session.globalTimeElapsed = 0;
            session.segmentTimeElapsed = 0;
            session.lastTickTime = Date.now();
        } else {
            plugin.resetAndReopen();
        }
    },
    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        const globalTimeRemaining = Math.max(0, session.defaultTotalTime - session.globalTimeElapsed);
        const globalColor = globalTimeRemaining === 0 ? "color: #ef4444;" : "";
        const formattedEndTime = getFinishedTimeStr(session.lastTickTime, globalTimeRemaining);
        const timeHTML = `<span style="${globalColor}">${formatTime(globalTimeRemaining)}</span>`;

        if (session.defaultCountEnabled) {
            const countLabel = (displayTitle && displayTitle !== "G")
                ? `${displayTitle}&nbsp;:&nbsp;${session.completedSegments}`
                : `${session.completedSegments}`;
            return `${clockPrefix}⏱️ [${countLabel}&nbsp;:&nbsp;${timeHTML}&nbsp;:&nbsp;${formattedEndTime}]${pauseText}`;
        }

        return `${clockPrefix}⏱️ [${displayTitle}&nbsp;:&nbsp;${timeHTML}&nbsp;:&nbsp;${formattedEndTime}]${pauseText}`;
    }
};