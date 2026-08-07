import { Setting } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { parseDurationToSeconds, formatTime, getFinishedTimeStr } from "../utils";

export const DefaultMode: ModeHandler = {
    id: "default",
    displayName: "Simple Countdown",
    buildSettings(container, plugin, config) {
        config.defaultTotalTimeRaw = config.defaultTotalTimeRaw ?? "10m";
        new Setting(container)
            .setName("Total Session Duration")
            .setDesc("Supports formats like '15 minutes', '20m', '12:30', or '600'.")
            .addText(text => {
                text.setValue(config.defaultTotalTimeRaw).onChange(v => config.defaultTotalTimeRaw = v);
                setTimeout(() => text.inputEl.focus(), 10);
            });
    },
    createSessionState(config) {
        return {
            defaultTotalTime: parseDurationToSeconds(config.defaultTotalTimeRaw) || 600
        };
    },
    tick(session, plugin, deltaSeconds) {
        if (session.globalTimeElapsed >= session.defaultTotalTime) {
            plugin.triggerAlarmSequence();
        }
    },
    onComplete(session, plugin) {
        plugin.resetAndReopen();
    },
    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        const globalTimeRemaining = Math.max(0, session.defaultTotalTime - session.globalTimeElapsed);
        const globalColor = globalTimeRemaining === 0 ? "color: #ef4444;" : "";
        const formattedEndTime = getFinishedTimeStr(session.lastTickTime, globalTimeRemaining);
        return `${clockPrefix}⏱️ [${displayTitle}&nbsp;:&nbsp;<span style="${globalColor}">${formatTime(globalTimeRemaining)}</span>&nbsp;:&nbsp;${formattedEndTime}]${pauseText}`;
    }
};