import { Setting } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { parseDurationToSeconds, formatTime, formatDelta, getFinishedTimeStr } from "../utils";

export const SegmentedMode: ModeHandler = {
    id: "segmented",
    displayName: "Classic Pacing",
    buildSettings(container, plugin, config, updatePreview) {
        config.segmentedTotalTimeRaw = config.segmentedTotalTimeRaw ?? "10m";
        config.segmentsRaw = config.segmentsRaw ?? "10";

        new Setting(container).setName("Total Session Time").setDesc("Target window (e.g. '10m', '1.5h').")
            .addText(text => {
                text.setValue(config.segmentedTotalTimeRaw).onChange(v => { config.segmentedTotalTimeRaw = v; updatePreview(); });
                setTimeout(() => text.inputEl.focus(), 10);
            });

        new Setting(container).setName("Total Target Segments").setDesc("Number of segments you expect to execute.")
            .addText(text => {
                text.setValue(config.segmentsRaw).onChange(v => { config.segmentsRaw = v; updatePreview(); });
            });

        const previewEl = container.createEl("p", { cls: "pacing-calculation-preview" });
        Object.assign(previewEl.style, { color: "var(--text-muted)", fontSize: "0.85em", marginTop: "10px", paddingLeft: "4px" });
        
        config.updatePreviewUI = () => {
            const segs = parseInt(config.segmentsRaw, 10);
            const time = parseDurationToSeconds(config.segmentedTotalTimeRaw);
            if (segs > 0 && time > 0) previewEl.textContent = `🎯 Each segment will take: ${formatTime(Math.round(time / segs))}`;
            else previewEl.textContent = "🎯 Enter total time and segments to see target calculations...";
        };
        config.updatePreviewUI();
    },
    createSessionState(config) {
        const segs = parseInt(config.segmentsRaw, 10) || 10;
        const totalTime = parseDurationToSeconds(config.segmentedTotalTimeRaw) || 600;
        const duration = Math.max(1, Math.round(totalTime / segs));
        return { initialSegmentDuration: duration, targetSegmentDuration: duration, totalSegments: segs };
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

        return `${clockPrefix}⏱️ [${displayTitle}:${formatTime(globalTimeRemaining)}] [S:<span style="${segmentStyle}">${segStr}</span>] [Δ<span style="${deltaStyle}">${deltaSign}${formatDelta(liveDelta)}</span>:&nbsp;${estFinishedTimeStr}] (${Math.max(0, session.totalSegments - session.completedSegments)})${pauseText}`;
    }
};