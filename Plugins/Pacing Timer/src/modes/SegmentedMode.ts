import { Setting, Modal } from "obsidian";
import { ModeHandler } from "./ModeHandler";
import { 
    parseDurationToSeconds, 
    formatTime, 
    formatDelta, 
    getFinishedTimeStr, 
    formatHumanReadableDuration, 
    formatPacingTime, 
    parsePlaylistInput 
} from "../utils";
import { SavedSessionRecord, PacingSessionState, StintStopMode } from "../types";
import PacingTimerPlugin from "../main";
import { 
    parseEndTimeToSeconds, 
    EditProjectGoalModal, 
    AdjustTaskCountdownModal 
} from "../ui/ProjectModal";

export interface ParsedStintTarget {
    type: "tasks" | "duration" | "clockTime";
    tasks: number;
    duration: number;
    displayTarget: string;
}

export function parseSmartStintTarget(input: string, pace: number, remTasks: number): ParsedStintTarget {
    if (!input || !input.trim()) {
        const dur = 10800;
        const t = Math.max(1, Math.min(remTasks, Math.floor(dur / pace)));
        return { type: "duration", tasks: t, duration: dur, displayTarget: "3h" };
    }

    const str = input.trim().toLowerCase();

    const hasAmPm = /am|pm|a\.m\.|p\.m\./i.test(str);
    const hasColon = str.includes(":");
    const isExplicitDuration = /\d+(?:\.\d+)?\s*(?:h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)(?!\w)/i.test(str);

    // 1. Clock Time (e.g. "3:30pm", "11:00", "4pm")
    if (hasAmPm || (hasColon && !isExplicitDuration)) {
        const dur = parseEndTimeToSeconds(str);
        const safeDur = Math.max(60, dur);
        const t = Math.max(1, Math.min(remTasks, Math.floor(safeDur / pace)));
        const finishStr = getFinishedTimeStr(Date.now(), safeDur);
        return { type: "clockTime", tasks: t, duration: safeDur, displayTarget: finishStr };
    }

    // 2. Explicit Duration (e.g. "3h", "30m", "1h 30m", "45 mins")
    if (isExplicitDuration) {
        const dur = parseDurationToSeconds(str);
        const safeDur = Math.max(60, dur);
        const t = Math.max(1, Math.min(remTasks, Math.floor(safeDur / pace)));
        return { type: "duration", tasks: t, duration: safeDur, displayTarget: formatHumanReadableDuration(safeDur) };
    }

    // 3. Plain Number or Task Label (e.g. "15", "20 tasks", "10 segments")
    const taskMatch = str.match(/^\d+/);
    if (taskMatch) {
        const parsedTasks = parseInt(taskMatch[0], 10);
        const safeTasks = Math.max(1, Math.min(remTasks, parsedTasks || 10));
        const dur = safeTasks * pace;
        return { type: "tasks", tasks: safeTasks, duration: dur, displayTarget: `${safeTasks} Tasks` };
    }

    // Fallback
    const fallbackDur = parseDurationToSeconds(str) || 10800;
    const safeDur = Math.max(60, fallbackDur);
    const t = Math.max(1, Math.min(remTasks, Math.floor(safeDur / pace)));
    return { type: "duration", tasks: t, duration: safeDur, displayTarget: formatHumanReadableDuration(safeDur) };
}

function getTargetMethodBadge(s: PacingSessionState): string {
    const stopMode: StintStopMode = s.stintStopMode || (s.targetFinishTimestamp ? "hard" : "soft");

    if (stopMode === "hard" && s.targetFinishTimestamp) {
        const realTimeLeft = Math.max(0, Math.round((s.targetFinishTimestamp - Date.now()) / 1000));
        const endTimeStr = getFinishedTimeStr(s.targetFinishTimestamp, 0);
        return `🔴 ${formatHumanReadableDuration(realTimeLeft)} • ${endTimeStr}`;
    }

    if (stopMode === "medium") {
        const totalBudget = s.hardStopTotalSeconds || s.defaultTotalTime || 10800;
        const remainingBudget = Math.max(0, totalBudget - (s.globalTimeElapsed || 0));
        const endTimeStr = getFinishedTimeStr(Date.now(), remainingBudget);
        return `🟡 ${formatHumanReadableDuration(remainingBudget)} • ${endTimeStr}`;
    }

    // Soft Stop: Simplified format
    const quota = s.currentQuota || s.stintInitialGoal || 10;
    const tasksLeft = Math.max(0, quota - (s.completedSegments || 0));
    const pace = s.targetSegmentDuration || s.initialSegmentDuration || 60;
    const workTimeLeft = Math.max(0, tasksLeft * pace - (s.segmentTimeElapsed || 0));
    const endTimeStr = getFinishedTimeStr(Date.now(), workTimeLeft);
    return `🟢 ${formatHumanReadableDuration(workTimeLeft)} • ${endTimeStr}`;
}

function getProjectPaceStats(session: PacingSessionState, plugin: PacingTimerPlugin) {
    const isProjectStint = Boolean(session.projectId);
    const currentBenchmark = session.benchmarkPace || session.initialSegmentDuration || 60;

    let totalCompleted = session.completedSegments || 0;
    let totalWorkTime = session.totalWorkTime || 0;

    if (isProjectStint && session.projectId) {
        const project = plugin.settings.savedSessions?.[session.projectId];
        const initialCompleted = session.projectCompletedInitial ?? project?.totalProjectCompleted ?? 0;
        const initialWorkTime = session.projectWorkTimeInitial ?? project?.totalWorkTime ?? 0;

        totalCompleted += initialCompleted;
        totalWorkTime += initialWorkTime;
    }

    const avgPace = totalCompleted > 0 
        ? (totalWorkTime / totalCompleted) 
        : currentBenchmark;

    const paceRatio = Math.round((avgPace / currentBenchmark) * 100);

    return {
        totalCompleted,
        totalWorkTime,
        avgPace,
        paceRatio,
        currentBenchmark
    };
}

class CreateProjectModal extends Modal {
    plugin: PacingTimerPlugin;
    onCreated: (record: SavedSessionRecord) => void;

    constructor(app: any, plugin: PacingTimerPlugin, onCreated: (record: SavedSessionRecord) => void) {
        super(app);
        this.plugin = plugin;
        this.onCreated = onCreated;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "📚 Create New Project" });

        let name = "New Project";
        let timingMode: "equal" | "custom" = "equal";
        let goal = "100";
        let pace = "1m15s";
        let customInput = "";
        let multiplier = "1.25";

        new Setting(contentEl)
            .setName("Project Name")
            .addText(t => t.setValue(name).onChange(v => name = v));

        const timingSetting = new Setting(contentEl)
            .setName("Segment Timing Type")
            .setDesc("Choose whether all tasks share equal duration, or if tasks have custom lengths (videos, chapters).")
            .addDropdown(drop => drop
                .addOption("equal", "Equal Duration Segments")
                .addOption("custom", "Custom / Variable Segments (Paste Timestamps)")
                .setValue(timingMode)
                .onChange(v => {
                    timingMode = v as "equal" | "custom";
                    updateVisibility();
                })
            );

        const equalGoalSetting = new Setting(contentEl)
            .setName("Total Project Goal")
            .setDesc("Total segments to complete (e.g. '100').")
            .addText(t => t.setValue(goal).onChange(v => goal = v));

        const equalPaceSetting = new Setting(contentEl)
            .setName("Estimated Pace per Task")
            .setDesc("Default segment duration (e.g. '1m', '45s').")
            .addText(t => t.setValue(pace).onChange(v => pace = v));

        const customAreaSetting = new Setting(contentEl)
            .setName("Custom Timings / Table")
            .setDesc("Paste timestamps, markdown tables, or comma-separated durations.")
            .addTextArea(area => {
                area.setPlaceholder("| 0:06:31 |\n| 0:12:01 |\n| 0:08:26 |")
                    .setValue(customInput)
                    .onChange(v => customInput = v);
                area.inputEl.rows = 5;
                area.inputEl.style.width = "100%";
                area.inputEl.style.fontFamily = "monospace";
            });

        const customMultSetting = new Setting(contentEl)
            .setName("Pacing Multiplier")
            .setDesc("Time leeway multiplier (e.g. '1.25' = 1.25x task length).")
            .addText(t => t.setValue(multiplier).onChange(v => multiplier = v));

        const updateVisibility = () => {
            const isCustom = timingMode === "custom";
            equalGoalSetting.settingEl.style.display = isCustom ? "none" : "";
            equalPaceSetting.settingEl.style.display = isCustom ? "none" : "";
            customAreaSetting.settingEl.style.display = isCustom ? "" : "none";
            customMultSetting.settingEl.style.display = isCustom ? "" : "none";
        };
        updateVisibility();

        new Setting(contentEl).addButton(btn => btn.setButtonText("Create Project").setCta().onClick(async () => {
            const id = Date.now().toString();

            if (timingMode === "custom") {
                const durations = parsePlaylistInput(customInput);
                const safeDurations = durations.length > 0 ? durations : [600];
                const totalGoal = safeDurations.length;
                const totalBase = safeDurations.reduce((a, b) => a + b, 0);
                const avgBase = Math.max(1, Math.round(totalBase / safeDurations.length));
                const mult = Math.max(1.0, parseFloat(multiplier) || 1.25);
                const firstBase = safeDurations[0] || 600;
                const firstDuration = Math.max(1, Math.round(firstBase * mult));

                const record: SavedSessionRecord = {
                    id,
                    name: name.trim() || "Untitled Project",
                    savedAt: Date.now(),
                    totalProjectGoal: totalGoal,
                    totalProjectCompleted: 0,
                    totalWorkTime: 0,
                    benchmarkPace: avgBase,
                    customSegmentDurations: safeDurations,
                    paceMultiplier: mult,
                    session: {
                        mode: "segmented",
                        title: "G",
                        initialSegmentDuration: firstDuration,
                        targetSegmentDuration: firstDuration,
                        totalSegments: totalGoal,
                        defaultTotalTime: 600,
                        completedSegments: 0,
                        cumulativeDelta: 0,
                        globalTimeElapsed: 0,
                        segmentTimeElapsed: 0,
                        isRunning: false,
                        isFinished: false,
                        lastTickTime: Date.now(),
                        maxTargetSegments: totalGoal,
                        benchmarkPace: avgBase,
                        customSegmentDurations: safeDurations,
                        paceMultiplier: mult,
                        rotationCategories: [],
                        rotationIndex: 0,
                        rotationCategoryElapsed: 0,
                        rotationCategoryDuration: 0,
                        rotationInInterrupt: false,
                        rotationInterruptElapsed: 0
                    }
                };

                if (!this.plugin.settings.savedSessions) this.plugin.settings.savedSessions = {};
                this.plugin.settings.savedSessions[id] = record;
                await this.plugin.saveSettings();
                this.close();
                this.onCreated(record);
            } else {
                const totalGoal = parseInt(goal, 10) || 100;
                const paceSecs = Math.max(1, parseDurationToSeconds(pace) || 60);

                const record: SavedSessionRecord = {
                    id,
                    name: name.trim() || "Untitled Project",
                    savedAt: Date.now(),
                    totalProjectGoal: totalGoal,
                    totalProjectCompleted: 0,
                    totalWorkTime: 0,
                    benchmarkPace: paceSecs,
                    session: {
                        mode: "segmented",
                        title: "G",
                        initialSegmentDuration: paceSecs,
                        targetSegmentDuration: paceSecs,
                        totalSegments: totalGoal,
                        defaultTotalTime: paceSecs * totalGoal,
                        completedSegments: 0,
                        cumulativeDelta: 0,
                        globalTimeElapsed: 0,
                        segmentTimeElapsed: 0,
                        isRunning: false,
                        isFinished: false,
                        lastTickTime: Date.now(),
                        maxTargetSegments: totalGoal,
                        benchmarkPace: paceSecs,
                        rotationCategories: [],
                        rotationIndex: 0,
                        rotationCategoryElapsed: 0,
                        rotationCategoryDuration: 0,
                        rotationInInterrupt: false,
                        rotationInterruptElapsed: 0
                    }
                };

                if (!this.plugin.settings.savedSessions) this.plugin.settings.savedSessions = {};
                this.plugin.settings.savedSessions[id] = record;
                await this.plugin.saveSettings();
                this.close();
                this.onCreated(record);
            }
        }));
    }

    onClose() {
        this.contentEl.empty();
    }
}

export const SegmentedMode: ModeHandler = {
    id: "segmented",
    displayName: "Classic Pacing",

    buildSettings(container, plugin, config, updatePreview) {
        let activeProject: SavedSessionRecord | null = null;
        let currentView: "library" | "dashboard" = "library";

        const lastId = plugin.session?.projectId || plugin.settings.lastOpenProjectId;
        if (lastId && plugin.settings.savedSessions?.[lastId]) {
            activeProject = plugin.settings.savedSessions[lastId];
            currentView = "dashboard";
        }

        let stintTargetRaw = plugin.settings.segmentedTargetRaw || "3h";
        let stopMode: StintStopMode = plugin.settings.segmentedStopMode || "soft";
        let countDownEnabled = !(plugin.settings.segmentedCountUp ?? true);
        let previewEl: HTMLElement | null = null;

        const render = () => {
            container.empty();

            if (currentView === "dashboard" && activeProject) {
                renderDashboard(activeProject);
            } else {
                renderLibrary();
            }
        };

        const selectProject = async (item: SavedSessionRecord) => {
            activeProject = item;
            currentView = "dashboard";
            plugin.settings.lastOpenProjectId = item.id;
            await plugin.saveSettings();
            render();
        };

        const renderLibrary = () => {
            const headerRow = container.createDiv();
            Object.assign(headerRow.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
            });

            headerRow.createEl("span", {
                text: "📚 Project Library",
                attr: { style: "font-weight: 600; font-size: 1.05em;" }
            });

            const newBtn = headerRow.createEl("button", {
                text: "+ New Project",
                cls: "mod-cta",
                attr: { style: "font-size: 0.82em; padding: 4px 12px; cursor: pointer;" }
            });
            newBtn.onclick = () => {
                new CreateProjectModal(plugin.app, plugin, async (created) => {
                    await selectProject(created);
                }).open();
            };

            const projects = Object.values(plugin.settings.savedSessions || {})
                .sort((a, b) => b.savedAt - a.savedAt);

            if (projects.length === 0) {
                container.createEl("p", {
                    text: "No projects found. Click '+ New Project' above to create one.",
                    attr: { style: "color: var(--text-muted); font-size: 0.9em; padding: 16px 0; text-align: center;" }
                });
                return;
            }

            const listContainer = container.createDiv();
            Object.assign(listContainer.style, {
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "330px",
                overflowY: "auto",
                paddingRight: "4px"
            });

            projects.forEach(item => {
                const card = listContainer.createDiv();
                const isActive = Boolean(plugin.session && plugin.session.projectId === item.id);
                const done = item.totalProjectCompleted || 0;
                const goal = item.totalProjectGoal || 100;
                const isCompleted = done >= goal;

                Object.assign(card.style, {
                    padding: "9px 12px",
                    borderRadius: "6px",
                    background: "var(--background-secondary)",
                    border: isActive ? "1px solid var(--interactive-accent)" : "1px solid var(--background-modifier-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "border-color 0.15s ease"
                });

                card.onclick = () => selectProject(item);

                const info = card.createDiv();
                info.style.flexGrow = "1";

                const titleRow = info.createDiv();
                Object.assign(titleRow.style, { display: "flex", alignItems: "center", gap: "6px" });
                titleRow.createSpan({ text: `📚 ${item.name}`, attr: { style: "font-weight: 600; font-size: 0.95em;" } });

                if (isActive) {
                    titleRow.createSpan({
                        text: "🟢 Active",
                        attr: { style: "background: var(--interactive-accent); color: var(--text-on-accent); padding: 1px 6px; border-radius: 8px; font-size: 0.7em; font-weight: bold;" }
                    });
                } else if (isCompleted) {
                    titleRow.createSpan({
                        text: "✅ Completed",
                        attr: { style: "background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 1px 6px; border-radius: 8px; font-size: 0.7em; font-weight: bold;" }
                    });
                }

                const meta = info.createDiv();
                Object.assign(meta.style, { fontSize: "0.8em", color: "var(--text-muted)", marginTop: "2px" });

                const pct = Math.round((done / goal) * 100);
                const pace = Math.max(1, Math.round((item.benchmarkPace || 60) * 1.25));
                const remaining = Math.max(0, goal - done);
                const estRemainingTime = remaining * pace;

                const finishLabel = isCompleted ? "Completed! 🎉" : `Est: ~${formatHumanReadableDuration(estRemainingTime)}`;
                meta.textContent = `${done}/${goal} Tasks (${pct}%) • Est: ${finishLabel}`;

                const openBtn = card.createEl("button", {
                    text: "Open →",
                    attr: { style: "font-size: 0.8em; padding: 3px 8px; cursor: pointer;" }
                });
                openBtn.onclick = (e) => {
                    e.stopPropagation();
                    selectProject(item);
                };
            });
        };

        const renderDashboard = (project: SavedSessionRecord) => {
            if (plugin.settings.savedSessions?.[project.id]) {
                project = plugin.settings.savedSessions[project.id]!;
            }

            const isStintActive = Boolean(plugin.session && plugin.session.projectId === project.id);
            const stintDone = (isStintActive && plugin.session) ? (plugin.session.completedSegments || 0) : 0;
            const completed = (project.totalProjectCompleted || 0) + stintDone;
            const totalGoal = project.totalProjectGoal || 100;
            const isProjectCompleted = completed >= totalGoal;

            const topNav = container.createDiv();
            Object.assign(topNav.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px"
            });

            const backBtn = topNav.createEl("button", {
                text: "← Back to Projects",
                attr: { style: "font-size: 0.8em; padding: 3px 9px; cursor: pointer;" }
            });
            backBtn.onclick = async () => {
                currentView = "library";
                activeProject = null;
                plugin.settings.lastOpenProjectId = null;
                await plugin.saveSettings();
                render();
            };

            if (isStintActive) {
                topNav.createSpan({
                    text: "🟢 Stint Active",
                    attr: { style: "background: var(--interactive-accent); color: var(--text-on-accent); padding: 1px 7px; border-radius: 10px; font-size: 0.74em; font-weight: bold;" }
                });
            } else if (isProjectCompleted) {
                topNav.createSpan({
                    text: "✅ Completed",
                    attr: { style: "background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 1px 7px; border-radius: 10px; font-size: 0.74em; font-weight: bold;" }
                });
            }

            // Master Telemetry Card
            const macroCard = container.createDiv();
            Object.assign(macroCard.style, {
                padding: "10px 12px",
                borderRadius: "6px",
                background: "var(--background-secondary)",
                border: "1px solid var(--background-modifier-border)",
                marginBottom: "12px",
                fontSize: "0.88em",
                lineHeight: "1.5"
            });

            const pct = Math.round((completed / totalGoal) * 100);
            const paceWithLeeway = Math.max(1, Math.round((project.benchmarkPace || 60) * 1.25));
            const remainingTasks = Math.max(0, totalGoal - completed);
            const remainingProjectSeconds = remainingTasks * paceWithLeeway;
            const pctColor = isProjectCompleted ? "#10b981" : "var(--text-accent)";
            const finishLabel = isProjectCompleted ? "<span style='color: #10b981; font-weight: 600;'>Completed! 🎉</span>" : `~${formatHumanReadableDuration(remainingProjectSeconds)} remaining`;

            const progRow = macroCard.createDiv();
            Object.assign(progRow.style, { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" });
            
            const progLeft = progRow.createDiv();
            Object.assign(progLeft.style, { display: "flex", alignItems: "center", gap: "8px" });

            const titleSpan = progLeft.createSpan({ attr: { style: "font-weight: 600;" } });
            const leftLabel = isProjectCompleted ? "" : ` <span style="font-weight: normal; color: var(--text-muted); font-size: 0.9em;">(${remainingTasks} left)</span>`;
            titleSpan.innerHTML = `Project: ${completed} / ${totalGoal} Tasks${leftLabel}`;

            const editGoalBtn = progLeft.createEl("button", {
                text: "✏️ Edit Goal",
                attr: { style: "font-size: 0.72em; padding: 1px 6px; cursor: pointer; border-radius: 3px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-muted);" }
            });
            editGoalBtn.onclick = () => {
                new EditProjectGoalModal(plugin.app, plugin, project, () => render()).open();
            };

            progRow.createSpan({ text: `${pct}%`, attr: { style: `color: ${pctColor}; font-weight: bold;` } });

            const metaDiv = macroCard.createDiv();
            metaDiv.innerHTML = `⏱️ <b>Pacing:</b> ${formatHumanReadableDuration(paceWithLeeway).replace(/\s+/g, "")} per task • ⏳ <b>Finish:</b> ${finishLabel}`;

            if (isStintActive && plugin.session) {
                const s = plugin.session;
                const stintCard = container.createDiv();
                Object.assign(stintCard.style, {
                    padding: "10px 12px",
                    borderRadius: "6px",
                    background: "var(--background-primary-alt)",
                    border: "1px solid var(--interactive-accent)",
                    marginBottom: "12px",
                    fontSize: "0.88em",
                    lineHeight: "1.5"
                });

                const quota = s.currentQuota || s.stintInitialGoal || 10;
                const stintTasksLeft = Math.max(0, quota - stintDone);
                const currentPause = (!s.isRunning && s.pausedAt) 
                    ? Math.max(0, Math.floor((Date.now() - s.pausedAt) / 1000)) 
                    : 0;
                const totalPaused = (s.totalPausedSeconds || 0) + currentPause;
                const methodBadge = getTargetMethodBadge(s);

                const isCountdown = s.segmentedCountUp === false;
                const totalProjCompleted = (s.projectCompletedInitial || 0) + stintDone;
                const totalProjGoal = s.projectGoal || 100;
                const initRemaining = Math.max(0, totalProjGoal - (s.projectCompletedInitial || 0));
                const currentRemaining = Math.max(0, totalProjGoal - totalProjCompleted);
                const targetRemaining = Math.max(0, initRemaining - quota);

                const taskCountHTML = isCountdown
                    ? `<b>Remaining:</b> ${currentRemaining} / ${targetRemaining} Tasks`
                    : `<b>Today:</b> ${stintDone} / ${quota} Tasks`;

                stintCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: 600; color: var(--text-accent);">
                            ⏱️ Active Stint Progress <span style="font-weight: normal; color: var(--text-muted); font-size: 0.9em;">(${stintTasksLeft} left)</span>
                        </span>
                        <span style="font-size: 0.8em; color: var(--text-muted); background: var(--background-secondary); border: 1px solid var(--background-modifier-border); padding: 1px 7px; border-radius: 10px;">${methodBadge}</span>
                    </div>
                    <div>${taskCountHTML} • <b>Elapsed:</b> ${formatPacingTime(s.globalTimeElapsed)} • <b>Paused:</b> ${formatPacingTime(totalPaused)} • <b>Pacing:</b> ${formatTime(s.targetSegmentDuration)}</div>
                `;

                const btnRow = container.createDiv();
                Object.assign(btnRow.style, { display: "flex", gap: "8px", justifyContent: "flex-end" });

                const cancelBtn = btnRow.createEl("button", {
                    text: "🚫 Cancel Stint",
                    attr: { style: "padding: 5px 12px; cursor: pointer; font-size: 0.85em; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444);" }
                });
                cancelBtn.onclick = async () => {
                    if (confirm(`Cancel active stint for "${project.name}"? Progress from this stint will not be banked.`)) {
                        plugin.stopSession();
                        await plugin.saveSettings();
                        render();
                    }
                };

                const adjustCountdownBtn = btnRow.createEl("button", {
                    text: "⏱️ Adjust Countdown",
                    attr: { style: "padding: 5px 10px; cursor: pointer; font-size: 0.85em;" }
                });
                adjustCountdownBtn.onclick = () => {
                    new AdjustTaskCountdownModal(plugin.app, plugin, () => render()).open();
                };

                const bankBtn = btnRow.createEl("button", {
                    text: "💾 Bank Progress & End Stint",
                    cls: "mod-cta",
                    attr: { style: "padding: 5px 12px; cursor: pointer; font-size: 0.85em;" }
                });
                bankBtn.onclick = async () => {
                    await plugin.bankActiveStint();
                    render();
                };
            } else if (isProjectCompleted) {
                const completedCard = container.createDiv();
                Object.assign(completedCard.style, {
                    padding: "16px 14px",
                    borderRadius: "6px",
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    marginBottom: "12px",
                    textAlign: "center",
                    lineHeight: "1.5"
                });

                completedCard.createEl("h4", { text: "🎉 Project Completed!", attr: { style: "margin: 0 0 4px 0; color: #10b981;" } });
                completedCard.createEl("p", {
                    text: `All ${totalGoal} tasks for "${project.name}" have been completed (${completed} total). Stints cannot be launched for completed projects.`,
                    attr: { style: "margin: 0; color: var(--text-muted); font-size: 0.88em;" }
                });

                const bottomRow = container.createDiv();
                Object.assign(bottomRow.style, { display: "flex", justifyContent: "flex-start", marginTop: "12px" });

                const deleteBtn = bottomRow.createEl("button", {
                    text: "🗑 Delete Project",
                    attr: { style: "padding: 5px 12px; font-size: 0.85em; cursor: pointer; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444);" }
                });
                deleteBtn.onclick = async () => {
                    if (confirm(`Delete project "${project.name}" permanently?`)) {
                        delete plugin.settings.savedSessions![project.id];
                        plugin.settings.lastOpenProjectId = null;
                        await plugin.saveSettings();
                        currentView = "library";
                        activeProject = null;
                        render();
                    }
                };
            } else {
                container.createEl("h4", { text: "🚀 Launch Today's Stint", attr: { style: "margin: 6px 0 10px 0;" } });

                new Setting(container)
                    .setName("Stint Target")
                    .setDesc("Enter task count (e.g. '15', '20 tasks'), duration (e.g. '3h', '45m'), or clock finish time (e.g. '3:30PM').")
                    .addText(t => t.setValue(stintTargetRaw).onChange(v => {
                        stintTargetRaw = v;
                        updateStintPreview();
                    }));

                new Setting(container)
                    .setName("Stop Mode")
                    .setDesc("Choose when this stint completes: Soft (finish all tasks), Medium (log full work time), or Hard (strict clock deadline).")
                    .addDropdown(drop => drop
                        .addOption("soft", "🟢 Soft Stop (Finish all tasks)")
                        .addOption("medium", "🟡 Medium Stop (Log full work time)")
                        .addOption("hard", "🔴 Hard Stop (Strict clock deadline)")
                        .setValue(stopMode)
                        .onChange(v => {
                            stopMode = v as StintStopMode;
                            updateStintPreview();
                        })
                    );

                new Setting(container)
                    .setName("Count Down Tasks")
                    .setDesc("Display remaining project tasks counting down (e.g. 118/78) instead of counting up completed stint tasks (e.g. 0/40).")
                    .addToggle(toggle => toggle.setValue(countDownEnabled).onChange(v => {
                        countDownEnabled = v;
                        updateStintPreview();
                    }));

                previewEl = container.createEl("p");
                Object.assign(previewEl.style, { color: "var(--text-muted)", fontSize: "0.85em", margin: "8px 0" });

                const updateStintPreview = () => {
                    if (!previewEl) return;
                    const pace = Math.max(1, Math.round((project.benchmarkPace || 60) * 1.25));
                    const remTasks = Math.max(0, (project.totalProjectGoal || 100) - (project.totalProjectCompleted || 0));

                    const parsed = parseSmartStintTarget(stintTargetRaw, pace, remTasks);
                    const finishStr = getFinishedTimeStr(Date.now(), parsed.duration);

                    let modeTag = "🟢 soft stop";
                    if (stopMode === "hard") modeTag = "🔴 hard stop";
                    else if (stopMode === "medium") modeTag = "🟡 medium stop";

                    const countTag = countDownEnabled 
                        ? ` • Countdown: ${remTasks} → ${Math.max(0, remTasks - parsed.tasks)}` 
                        : "";

                    previewEl.textContent = `🎯 Today's Stint: ~${parsed.tasks} tasks budgeted in ${formatHumanReadableDuration(parsed.duration)} • Finish around ${finishStr} (${modeTag})${countTag}`;
                };
                updateStintPreview();

                const bottomRow = container.createDiv();
                Object.assign(bottomRow.style, { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" });

                const deleteBtn = bottomRow.createEl("button", {
                    text: "🗑 Delete Project",
                    attr: { style: "padding: 5px 12px; font-size: 0.85em; cursor: pointer; border-radius: 4px; border: 1px solid var(--text-error, #ef4444); background: rgba(239, 68, 68, 0.12); color: var(--text-error, #ef4444);" }
                });
                deleteBtn.onclick = async () => {
                    if (confirm(`Delete project "${project.name}" permanently?`)) {
                        delete plugin.settings.savedSessions![project.id];
                        plugin.settings.lastOpenProjectId = null;
                        await plugin.saveSettings();
                        currentView = "library";
                        activeProject = null;
                        render();
                    }
                };

                const launchBtn = bottomRow.createEl("button", {
                    text: "🚀 Start Stint",
                    cls: "mod-cta",
                    attr: { style: "padding: 5px 16px; font-size: 0.85em; cursor: pointer;" }
                });
                launchBtn.onclick = async () => {
                    const pace = Math.max(1, Math.round((project.benchmarkPace || 60) * 1.25));
                    const remTasks = Math.max(1, (project.totalProjectGoal || 100) - (project.totalProjectCompleted || 0));

                    const parsed = parseSmartStintTarget(stintTargetRaw, pace, remTasks);
                    const duration = Math.max(60, parsed.duration);
                    const tasks = Math.max(1, parsed.tasks);

                    plugin.stopSession();

                    plugin.settings.segmentedTargetRaw = stintTargetRaw;
                    plugin.settings.segmentedStopMode = stopMode;
                    plugin.settings.segmentedCountUp = !countDownEnabled;

                    const targetFinishTimestamp = stopMode === "hard"
                        ? Date.now() + duration * 1000
                        : undefined;

                    const baseSession: PacingSessionState = {
                        mode: "segmented",
                        title: "G",
                        initialSegmentDuration: pace,
                        targetSegmentDuration: pace,
                        totalSegments: tasks,
                        defaultTotalTime: duration,
                        completedSegments: 0,
                        cumulativeDelta: 0,
                        globalTimeElapsed: 0,
                        segmentTimeElapsed: 0,
                        isRunning: true,
                        isFinished: false,
                        lastTickTime: Date.now(),
                        segmentedVaultThreshold: Math.max(60, pace * 3),
                        segmentedCountUp: !countDownEnabled,
                        currentQuota: tasks,
                        maxTargetSegments: remTasks,
                        totalWorkTime: 0,
                        benchmarkPace: project.benchmarkPace || 60,
                        hardStopTotalSeconds: duration,
                        earlyFinishBanked: 0,
                        targetFinishTimestamp,
                        stintStopMode: stopMode,
                        stintTargetInputRaw: stintTargetRaw,
                        stintTargetType: parsed.type,
                        stintTargetValueRaw: parsed.displayTarget,
                        totalPausedSeconds: 0,
                        pausedAt: undefined,
                        pauseBufferSeconds: 0,
                        quotaAtPauseStart: undefined,
                        projectId: project.id,
                        projectName: project.name,
                        projectGoal: project.totalProjectGoal,
                        projectCompletedInitial: project.totalProjectCompleted || 0,
                        projectWorkTimeInitial: project.totalWorkTime || 0,
                        stintInitialGoal: tasks,
                        rotationCategories: [],
                        rotationIndex: 0,
                        rotationCategoryElapsed: 0,
                        rotationCategoryDuration: 0,
                        rotationInInterrupt: false,
                        rotationInterruptElapsed: 0
                    };

                    plugin.session = baseSession;
                    plugin.settings.cache.selectedMode = "segmented";
                    plugin.settings.lastOpenProjectId = project.id;
                    plugin.updateStatusBar();
                    plugin.startInterval();
                    await plugin.saveSettings();

                    plugin.activeModal?.close();
                };
            }
        };

        render();
    },

    createSessionState(config) {
        return {
            mode: "segmented",
            title: "G",
            initialSegmentDuration: 60,
            targetSegmentDuration: 60,
            totalSegments: 10,
            defaultTotalTime: 600,
            completedSegments: 0,
            cumulativeDelta: 0,
            globalTimeElapsed: 0,
            segmentTimeElapsed: 0,
            isRunning: true,
            isFinished: false,
            lastTickTime: Date.now()
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

        const threshold = Math.max(60, Math.round(session.targetSegmentDuration * 3));
        session.segmentedVaultThreshold = threshold;

        const hardStop = session.hardStopTotalSeconds || (session.initialSegmentDuration * session.totalSegments);
        const trueTimeLeft = session.targetFinishTimestamp
            ? Math.round((session.targetFinishTimestamp - Date.now()) / 1000)
            : Math.max(0, hardStop - session.globalTimeElapsed);

        const { avgPace: sessionAvg, paceRatio, currentBenchmark } = getProjectPaceStats(session, plugin);
        const stopMode: StintStopMode = session.stintStopMode || (session.targetFinishTimestamp ? "hard" : "soft");
        const isSoftStop = stopMode === "soft";

        if (session.cumulativeDelta >= threshold) {
            const maxGoal = session.maxTargetSegments || session.totalSegments;
            const prevQuota = session.currentQuota || maxGoal;
            // In Soft Stop, quota is permanently locked to the user's target
            const isAtMax = isSoftStop || prevQuota >= maxGoal;

            if (paceRatio <= 50) {
                const newBenchmark = Math.max(1, Math.round(sessionAvg));
                const newDuration = Math.max(1, Math.round(sessionAvg * 1.25));
                session.benchmarkPace = newBenchmark;
                session.targetSegmentDuration = newDuration;
                session.initialSegmentDuration = newDuration;

                const paceStr = formatHumanReadableDuration(newDuration).replace(/\s+/g, "");

                if (isAtMax) {
                    const remainingTasks = Math.max(0, prevQuota - session.completedSegments);
                    const newRemainingWorkTime = remainingTasks * newDuration;
                    const totalNeeded = session.globalTimeElapsed + newRemainingWorkTime;
                    session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);
                    session.cumulativeDelta = 0;

                    plugin.playVictoryChime();
                    plugin.showOverlay(`⚡ Gear Shift: ${paceStr} Pace, +0 Tasks`, true, "up");
                } else {
                    const remainingAchievable = Math.floor(Math.max(0, trueTimeLeft) / newDuration);
                    session.currentQuota = Math.min(maxGoal, session.completedSegments + remainingAchievable);
                    
                    const remainingTasks = Math.max(0, session.currentQuota - session.completedSegments);
                    const newRemainingWorkTime = remainingTasks * newDuration;
                    const totalNeeded = session.globalTimeElapsed + newRemainingWorkTime;
                    session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);
                    session.cumulativeDelta = 0;

                    const quotaDiff = Math.max(0, session.currentQuota - prevQuota);
                    plugin.playVictoryChime();
                    plugin.showOverlay(`⚡ Gear Shift: ${paceStr} Pace, +${quotaDiff} Tasks`, true, "up");
                }
            } else if (isAtMax) {
                session.earlyFinishBanked = (session.earlyFinishBanked || 0) + threshold;
                session.cumulativeDelta -= threshold;
                const pullStr = formatHumanReadableDuration(threshold).replace(/\s+/g, "");
                plugin.playVictoryChime();
                plugin.showOverlay(isSoftStop ? `⭐ Rhythm Milestone: -${pullStr}` : `🏆 Max Quota: -${pullStr}`, true, "up");
            } else {
                const earnedSegments = Math.max(1, Math.floor(threshold / session.targetSegmentDuration));
                session.currentQuota = Math.min(maxGoal, (session.currentQuota || session.totalSegments) + earnedSegments);
                session.cumulativeDelta -= threshold;
                plugin.playVictoryChime();
                plugin.showOverlay(`⭐ Rhythm Milestone: +${earnedSegments} Tasks`, true, "up");
            }
        } else if (session.cumulativeDelta <= -threshold) {
            const maxGoal = session.maxTargetSegments || session.totalSegments;
            const prevQuota = session.currentQuota || maxGoal;
            const actualAvg = sessionAvg;
            
            const proposedDuration = Math.max(1, Math.round(actualAvg * 1.25));
            const newDuration = Math.max(session.targetSegmentDuration, proposedDuration);

            session.benchmarkPace = Math.max(session.benchmarkPace || 60, Math.round(actualAvg));
            session.targetSegmentDuration = newDuration;
            session.initialSegmentDuration = newDuration;

            // In Soft Stop, quota is locked and never reduced on rescue
            if (!isSoftStop) {
                const remainingAchievable = Math.floor(Math.max(0, trueTimeLeft) / newDuration);
                session.currentQuota = Math.min(maxGoal, session.completedSegments + remainingAchievable);
            } else {
                session.currentQuota = prevQuota;
            }

            const activeQuota = session.currentQuota ?? prevQuota;
            const remainingTasks = Math.max(0, activeQuota - session.completedSegments);
            const remainingWorkTime = remainingTasks * newDuration;
            const totalNeeded = session.globalTimeElapsed + remainingWorkTime;
            session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);

            session.cumulativeDelta = 0;

            const quotaDiff = activeQuota - prevQuota;
            const quotaDiffSign = quotaDiff >= 0 ? "+" : "";
            const paceStr = formatHumanReadableDuration(newDuration).replace(/\s+/g, "");

            plugin.playShieldBash();
            plugin.showOverlay(`🛟 Rescue: ${paceStr} Pace, ${quotaDiffSign}${quotaDiff} Tasks`, false, "down");
        }

        // STOP MODE COMPLETION CRITERIA
        const isProjectStint = Boolean(session.projectId && session.projectGoal);
        if (isProjectStint) {
            const totalProjectDone = (session.projectCompletedInitial || 0) + session.completedSegments;
            const projectFinished = totalProjectDone >= (session.projectGoal || 100);
            const stintQuotaMet = session.completedSegments >= (session.currentQuota || session.stintInitialGoal || session.totalSegments);

            let shouldFinish = projectFinished;

            if (stopMode === "hard") {
                const wallTimeLeft = session.targetFinishTimestamp ? Math.round((session.targetFinishTimestamp - Date.now()) / 1000) : 0;
                if (wallTimeLeft <= 0) shouldFinish = true;
            } else if (stopMode === "medium") {
                const workTimeRemaining = Math.max(0, hardStop - session.globalTimeElapsed);
                if (workTimeRemaining <= 0 || stintQuotaMet) shouldFinish = true;
            } else {
                // Soft Stop: ONLY ends when all designated stint tasks are finished
                if (stintQuotaMet) shouldFinish = true;
            }

            if (shouldFinish) {
                session.isRunning = false;
                session.isFinished = true;
                plugin.stopAlarmSequence();
                plugin.playVictoryChime();
            }
        } else {
            if (session.completedSegments >= (session.currentQuota || session.totalSegments)) {
                session.isRunning = false;
                session.isFinished = true;
                plugin.stopAlarmSequence();
            }
        }
    },

    renderStatusBar(session, plugin, clockPrefix, pauseText, displayTitle) {
        const isProjectStint = Boolean(session.projectId && session.projectGoal);
        const maxGoal = session.maxTargetSegments || session.totalSegments;
        const currentQuota = session.currentQuota || session.totalSegments;

        // Finish Screen: Shows cumulative project progress cleanly without residual delta numbers
        if (session.isFinished) {
            const totalProjDone = (session.projectCompletedInitial || 0) + session.completedSegments;
            const totalProjGoal = session.projectGoal || 100;
            const projDisplay = isProjectStint ? ` [Proj: ${totalProjDone}/${totalProjGoal}]` : ` [Max: ${maxGoal}]`;
            return `${clockPrefix}⏱️ [${displayTitle}:00:00] 🏆 Done! (${session.completedSegments}/${currentQuota})${projDisplay}`;
        }

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

        const stopMode: StintStopMode = session.stintStopMode || (session.targetFinishTimestamp ? "hard" : "soft");

        let hardTimeLeft = 0;
        if (session.targetFinishTimestamp) {
            hardTimeLeft = Math.max(0, Math.round((session.targetFinishTimestamp - Date.now()) / 1000));
        } else {
            const hardStop = session.hardStopTotalSeconds || (session.initialSegmentDuration * session.totalSegments);
            hardTimeLeft = Math.max(0, hardStop - session.globalTimeElapsed);
        }

        let remainingDisplaySeconds = hardTimeLeft;
        let isWorkShorterThanHardTime = false;
        let effectiveWorkTimeLeft = 0;

        if (isProjectStint) {
            const baseGoal = session.stintInitialGoal || session.currentQuota || session.totalSegments;
            const tasksLeftToGoal = Math.max(0, baseGoal - session.completedSegments);

            if (tasksLeftToGoal > 0) {
                const workTimeLeft = Math.max(0, tasksLeftToGoal * session.targetSegmentDuration - session.segmentTimeElapsed);
                effectiveWorkTimeLeft = workTimeLeft;
                isWorkShorterThanHardTime = workTimeLeft < hardTimeLeft;
                // Soft stop always displays task work time left
                remainingDisplaySeconds = (stopMode === "soft") ? workTimeLeft : Math.min(hardTimeLeft, workTimeLeft);
            } else {
                const totalProjectDone = (session.projectCompletedInitial || 0) + session.completedSegments;
                const projectTasksLeft = Math.max(0, (session.projectGoal || 100) - totalProjectDone);
                const projectWorkTimeLeft = Math.max(0, projectTasksLeft * session.targetSegmentDuration - session.segmentTimeElapsed);
                effectiveWorkTimeLeft = projectWorkTimeLeft;
                isWorkShorterThanHardTime = projectWorkTimeLeft < hardTimeLeft;
                remainingDisplaySeconds = (stopMode === "soft") ? projectWorkTimeLeft : Math.min(hardTimeLeft, projectWorkTimeLeft);
            }
        } else {
            const remainingTasks = Math.max(0, currentQuota - session.completedSegments);
            const workTimeLeft = Math.max(0, remainingTasks * session.targetSegmentDuration - session.segmentTimeElapsed);
            effectiveWorkTimeLeft = workTimeLeft;
            isWorkShorterThanHardTime = workTimeLeft < hardTimeLeft;
            remainingDisplaySeconds = (stopMode === "soft") ? workTimeLeft : Math.min(hardTimeLeft, workTimeLeft);
        }

        const formattedGlobalTime = formatPacingTime(remainingDisplaySeconds);

        let estFinishedTimeStr = "";
        if (session.targetFinishTimestamp) {
            if (isWorkShorterThanHardTime) {
                estFinishedTimeStr = getFinishedTimeStr(Date.now(), effectiveWorkTimeLeft);
            } else {
                estFinishedTimeStr = getFinishedTimeStr(session.targetFinishTimestamp, 0);
            }
        } else {
            estFinishedTimeStr = getFinishedTimeStr(session.lastTickTime, remainingDisplaySeconds);
        }

        const threshold = Math.max(60, Math.round(session.targetSegmentDuration * 3));
        const { paceRatio } = getProjectPaceStats(session, plugin);

        let ratioDisplay = `(${paceRatio}%)`;
        if (paceRatio <= 50) {
            ratioDisplay = `(<span style="color: #a6e3a1; font-weight: bold;">⚡${paceRatio}%</span>)`;
        } else if (paceRatio > 100) {
            ratioDisplay = `(<span style="color: #f38ba8;">${paceRatio}%</span>)`;
        }

        const deltaTargetDisplay = `${deltaSign}${formatTime(Math.abs(liveDelta))}/${formatTime(threshold)}`;
        const deltaDisplay = `[<span style="${deltaStyle}">${deltaTargetDisplay}</span> ${ratioDisplay}: ${estFinishedTimeStr}]`;

        let countDisplay = "";
        if (isProjectStint) {
            const completedToday = session.completedSegments;
            const baseGoal = session.stintInitialGoal || 5;

            // In Hard Stop mode: deduct tasks based strictly on time spent paused
            if (stopMode === "hard" && session.targetFinishTimestamp) {
                if (!session.isRunning) {
                    if (!session.pausedAt) {
                        session.pausedAt = Date.now();
                        session.quotaAtPauseStart = session.currentQuota || baseGoal;
                    }
                    const currentPauseSeconds = Math.max(0, Math.floor((Date.now() - session.pausedAt) / 1000));
                    const totalAccumulatedPause = (session.pauseBufferSeconds || 0) + currentPauseSeconds;
                    const lostTasks = Math.floor(totalAccumulatedPause / session.targetSegmentDuration);
                    
                    const startQuota = session.quotaAtPauseStart || baseGoal;
                    session.currentQuota = Math.max(completedToday, startQuota - lostTasks);
                } else if (session.pausedAt) {
                    const pauseDuration = Math.max(0, Math.floor((Date.now() - session.pausedAt) / 1000));
                    session.totalPausedSeconds = (session.totalPausedSeconds || 0) + pauseDuration;
                    const totalAccumulatedPause = (session.pauseBufferSeconds || 0) + pauseDuration;
                    const lostTasks = Math.floor(totalAccumulatedPause / session.targetSegmentDuration);
                    
                    const startQuota = session.quotaAtPauseStart || baseGoal;
                    session.currentQuota = Math.max(completedToday, startQuota - lostTasks);
                    session.pauseBufferSeconds = totalAccumulatedPause % session.targetSegmentDuration;
                    session.pausedAt = undefined;
                    session.quotaAtPauseStart = undefined;
                }
            } else if (!session.isRunning && !session.pausedAt) {
                session.pausedAt = Date.now();
            } else if (session.isRunning && session.pausedAt) {
                const pauseDuration = Math.max(0, Math.floor((Date.now() - session.pausedAt) / 1000));
                session.totalPausedSeconds = (session.totalPausedSeconds || 0) + pauseDuration;
                session.pausedAt = undefined;
            }

            const quotaToday = session.currentQuota || baseGoal;
            const totalProjCompleted = (session.projectCompletedInitial || 0) + completedToday;
            const totalProjGoal = session.projectGoal || 100;

            // COUNTDOWN vs COUNT UP LOGIC
            if (session.segmentedCountUp === false) {
                const initRemaining = Math.max(0, totalProjGoal - (session.projectCompletedInitial || 0));
                const currentRemaining = Math.max(0, totalProjGoal - totalProjCompleted);
                const targetRemaining = Math.max(0, initRemaining - quotaToday);
                const baseGoalRemaining = Math.max(0, initRemaining - baseGoal);

                const goalMet = currentRemaining <= baseGoalRemaining;
                const starTag = goalMet ? ` ⭐${baseGoalRemaining}` : ` • ${baseGoalRemaining}`;

                countDisplay = `(${currentRemaining}/${targetRemaining}${starTag}) [Proj: ${totalProjCompleted}/${totalProjGoal}]`;
            } else {
                const goalMet = completedToday >= baseGoal;
                const starTag = goalMet ? ` ⭐${baseGoal}` : ` • ${baseGoal}`;

                countDisplay = `(${completedToday}/${quotaToday}${starTag}) [Proj: ${totalProjCompleted}/${totalProjGoal}]`;
            }
        } else {
            countDisplay = session.segmentedCountUp
                ? `(${session.completedSegments}/${currentQuota}) [Max: ${maxGoal}]`
                : `(${Math.max(0, currentQuota - session.completedSegments)}) [Max: ${maxGoal}]`;
        }

        return `${clockPrefix}⏱️ [${displayTitle}:${formattedGlobalTime}] [S:<span style="${segmentStyle}">${segStr}</span>] ${deltaDisplay} ${countDisplay}${pauseText}`;
    }
};