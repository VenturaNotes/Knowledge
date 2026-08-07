import { Setting } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { parseDurationToSeconds, formatTimeHMS, formatTimeAllowNeg } from "../utils";

export const StackingMode: ModeHandler = {
    id: "stacking",
    displayName: "Dungeon Stacking",
    buildSettings(container, plugin, config) {
        config.stackingDurationRaw = config.stackingDurationRaw ?? "10m";
        config.stackingGoalRaw = config.stackingGoalRaw ?? formatTimeHMS(plugin.settings.stackingGoal);
        config.stackingGoalPositiveOnly = config.stackingGoalPositiveOnly ?? plugin.settings.stackingGoalPositiveOnly;
        config.stackingUseGlobalDuration = config.stackingUseGlobalDuration ?? plugin.settings.stackingUseGlobalDuration;

        new Setting(container).setName("Segment Time Target").addText(t => t.setValue(config.stackingDurationRaw).onChange(v => config.stackingDurationRaw = v));
        new Setting(container).setName("Stacking Level Goal").addText(t => t.setValue(config.stackingGoalRaw).onChange(v => config.stackingGoalRaw = v));
        new Setting(container).setName("Positive Goal Only").addToggle(t => t.setValue(config.stackingGoalPositiveOnly).onChange(v => config.stackingGoalPositiveOnly = v));
        new Setting(container).setName("Use Initial Duration Only").addToggle(t => t.setValue(config.stackingUseGlobalDuration).onChange(v => config.stackingUseGlobalDuration = v));
    },
    saveSettings(config, settings) {
        settings.stackingGoal = parseDurationToSeconds(config.stackingGoalRaw) || 900;
        settings.stackingGoalPositiveOnly = config.stackingGoalPositiveOnly;
        settings.stackingUseGlobalDuration = config.stackingUseGlobalDuration;
    },
    createSessionState(config) {
        const duration = parseDurationToSeconds(config.stackingDurationRaw) || 600;
        return {
            initialSegmentDuration: duration, targetSegmentDuration: duration,
            stackingIsActive: true, stackingLevel: 1, stackingTotalTimeLeft: 0,
            stackingSectionTimeLeft: duration, stackingCurrentSplitElapsed: 0,
            stackingGlobalSumCount: 0, stackingGlobalTotalSplits: 0, stackingPendingDowngrade: false
        };
    },
    tick(session, plugin, deltaSeconds) {
        session.stackingSectionTimeLeft -= deltaSeconds;
        session.stackingCurrentSplitElapsed += deltaSeconds;

        if (session.stackingSectionTimeLeft <= 0) {
            session.stackingTotalTimeLeft -= deltaSeconds;
            if (!plugin.settings.stackingGoalPositiveOnly && session.stackingTotalTimeLeft <= -plugin.settings.stackingGoal && !session.stackingPendingDowngrade) {
                session.stackingPendingDowngrade = true;
            }
        }
    },
    onComplete(session, plugin) {
        plugin.playMechClack();
        const isVengeanceAttack = !plugin.settings.stackingGoalPositiveOnly && (session.stackingTotalTimeLeft <= -plugin.settings.stackingGoal || session.stackingPendingDowngrade);
        
        if (session.stackingSectionTimeLeft > 0) session.stackingTotalTimeLeft += session.stackingSectionTimeLeft;

        const splitDuration = session.segmentTimeElapsed;
        const lastSplitDelta = session.targetSegmentDuration - splitDuration;

        session.stackingGlobalSumCount += splitDuration;
        session.stackingGlobalTotalSplits += 1;
        session.completedSegments += 1;
        session.segmentTimeElapsed = 0;

        let levelChange = 0;
        if (session.stackingPendingDowngrade && !plugin.settings.stackingGoalPositiveOnly) { session.stackingPendingDowngrade = false; levelChange = -1; }
        else if (session.stackingPendingDowngrade) { session.stackingPendingDowngrade = false; }
        else if (session.stackingTotalTimeLeft >= plugin.settings.stackingGoal) { levelChange = +1; }

        const oldLevel = session.stackingLevel;
        if (levelChange !== 0) {
            session.stackingLevel = Math.max(1, session.stackingLevel + levelChange);
            session.stackingTotalTimeLeft = 0;
            if (plugin.settings.stackingUseGlobalDuration) {
                session.targetSegmentDuration = session.initialSegmentDuration;
            } else {
                const globalAvg = session.stackingGlobalSumCount / session.stackingGlobalTotalSplits;
                session.targetSegmentDuration = Math.max(1, Math.round(globalAvg * 1.25));
            }
            session.stackingSectionTimeLeft = session.targetSegmentDuration;
            plugin.playVictoryChime();
        } else {
            session.stackingSectionTimeLeft = session.targetSegmentDuration;
        }

        if (isVengeanceAttack) plugin.playShieldBash();
        else plugin.playSwordSlash();

        if (session.stackingLevel !== oldLevel) {
            const wentUp = session.stackingLevel > oldLevel;
            plugin.showOverlay(`L${session.stackingLevel} ${wentUp ? "Upgrade" : "Downgrade"} | Target: ${formatTimeHMS(session.targetSegmentDuration)}`, wentUp, wentUp ? "up" : "down");
        } else {
            const totalStr = formatTimeAllowNeg(session.stackingTotalTimeLeft);
            const deltaStr = lastSplitDelta >= 0 ? `+${formatTimeAllowNeg(lastSplitDelta)}` : formatTimeAllowNeg(lastSplitDelta);
            if (isVengeanceAttack) plugin.showOverlay(`💥 Shield Bash! L${session.stackingLevel} | HP Reset`);
            else plugin.showOverlay(`L${session.stackingLevel} | ${totalStr} | ${deltaStr}`, lastSplitDelta >= 0);
        }
    },
    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        return `${clockPrefix}⏱️ [${session.completedSegments} | L${session.stackingLevel} | ${formatTimeAllowNeg(session.stackingTotalTimeLeft)} | ${formatTimeAllowNeg(session.stackingSectionTimeLeft)}]${pauseText}`;
    }
};