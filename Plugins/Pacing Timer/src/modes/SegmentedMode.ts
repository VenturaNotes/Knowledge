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
import { SavedSessionRecord, PacingSessionState } from "../types";
import PacingTimerPlugin from "../main";
import { 
    parseEndTimeToSeconds, 
    EditProjectGoalModal, 
    AdjustTaskCountdownModal 
} from "../ui/ProjectModal";

function parseStintDurationInput(raw: string): number {
    if (!raw) return 0;
    if (/am|pm|a\.m\.|p\.m\./i.test(raw)) {
        return parseEndTimeToSeconds(raw);
    }
    return parseDurationToSeconds(raw);
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

        // Restore the last opened project dashboard if it still exists
        const lastId = plugin.session?.projectId || plugin.settings.lastOpenProjectId;
        if (lastId && plugin.settings.savedSessions?.[lastId]) {
            activeProject = plugin.settings.savedSessions[lastId];
            currentView = "dashboard";
        }

        let stintTargetMode: "time" | "segments" | "endTime" = "time";
        let stintDurationRaw = "3h";
        let stintTasksRaw = "45";
        let stintEndTimeRaw = getFinishedTimeStr(Date.now(), 10800);
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

            // Navigation Row: Back button clears the saved project so it returns to the library next time
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
            progLeft.createSpan({ text: `Project: ${completed} / ${totalGoal} Tasks`, attr: { style: "font-weight: 600;" } });

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
                stintCard.innerHTML = `
                    <div style="font-weight: 600; color: var(--text-accent); margin-bottom: 4px;">⏱️ Active Stint Progress</div>
                    <div><b>Today:</b> ${stintDone} / ${quota} Tasks • <b>Elapsed:</b> ${formatPacingTime(s.globalTimeElapsed)} • <b>Active Timer:</b> ${formatTime(s.targetSegmentDuration)}</div>
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
                        plugin.showOverlay("🚫 Stint Canceled", false);
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
                    .setName("Target Method")
                    .addDropdown(drop => drop
                        .addOption("time", "Stint Time Target")
                        .addOption("segments", "Stint Segment Target")
                        .addOption("endTime", "Target Finish Time")
                        .setValue(stintTargetMode)
                        .onChange(v => {
                            stintTargetMode = v as "time" | "segments" | "endTime";
                            updateFormVisibility();
                            updateStintPreview();
                        })
                    );

                const timeSetting = new Setting(container)
                    .setName("Stint Time Target")
                    .setDesc("How long do you want to work? (e.g. '3h', '45m', or clock time like '3:30PM').")
                    .addText(t => t.setValue(stintDurationRaw).onChange(v => { stintDurationRaw = v; updateStintPreview(); }));

                const segmentSetting = new Setting(container)
                    .setName("Stint Segment Target")
                    .addText(t => t.setValue(stintTasksRaw).onChange(v => { stintTasksRaw = v; updateStintPreview(); }));

                const endTimeSetting = new Setting(container)
                    .setName("Target Finish Time")
                    .addText(t => t.setValue(stintEndTimeRaw).onChange(v => { stintEndTimeRaw = v; updateStintPreview(); }));

                const updateFormVisibility = () => {
                    timeSetting.settingEl.style.display = stintTargetMode === "time" ? "" : "none";
                    segmentSetting.settingEl.style.display = stintTargetMode === "segments" ? "" : "none";
                    endTimeSetting.settingEl.style.display = stintTargetMode === "endTime" ? "" : "none";
                };
                updateFormVisibility();

                previewEl = container.createEl("p");
                Object.assign(previewEl.style, { color: "var(--text-muted)", fontSize: "0.85em", margin: "8px 0" });

                const updateStintPreview = () => {
                    if (!previewEl) return;
                    const pace = Math.max(1, Math.round((project.benchmarkPace || 60) * 1.25));
                    const remTasks = Math.max(0, (project.totalProjectGoal || 100) - (project.totalProjectCompleted || 0));

                    let duration = 0;
                    let tasks = 0;

                    if (stintTargetMode === "segments") {
                        const parsed = parseInt(stintTasksRaw, 10);
                        tasks = parsed > 0 ? Math.min(remTasks, parsed) : Math.min(remTasks, 10);
                        duration = tasks * pace;
                    } else if (stintTargetMode === "endTime") {
                        duration = parseEndTimeToSeconds(stintEndTimeRaw);
                        tasks = Math.min(remTasks, Math.floor(duration / pace));
                    } else {
                        // Interprets duration strings (e.g. '3h', '45m') as well as clock times (e.g. '3:30PM')
                        duration = parseStintDurationInput(stintDurationRaw);
                        if (duration <= 0 && !stintDurationRaw.trim()) {
                            duration = 10800;
                        }
                        tasks = Math.min(remTasks, Math.floor(duration / pace));
                    }

                    if (duration <= 0) {
                        previewEl.textContent = "🎯 Enter a valid time target (e.g. '3h', '3:30PM')...";
                        return;
                    }

                    const finishStr = stintTargetMode === "endTime" 
                        ? getFinishedTimeStr(Date.now() + duration * 1000, 0)
                        : getFinishedTimeStr(Date.now(), duration);
                    previewEl.textContent = `🎯 Today's Stint: ~${tasks} tasks budgeted in ${formatHumanReadableDuration(duration)} • Finish around ${finishStr}`;
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

                    let duration = 0;
                    let tasks = 0;

                    if (stintTargetMode === "segments") {
                        const parsed = parseInt(stintTasksRaw, 10);
                        tasks = parsed > 0 ? Math.min(remTasks, parsed) : Math.min(remTasks, 10);
                        duration = tasks * pace;
                    } else if (stintTargetMode === "endTime") {
                        duration = parseEndTimeToSeconds(stintEndTimeRaw);
                        if (duration < 60) {
                            plugin.showOverlay("⚠️ Please enter a future time (e.g. '3:14PM')", false);
                            return;
                        }
                        tasks = Math.min(remTasks, Math.floor(duration / pace));
                    } else {
                        duration = parseStintDurationInput(stintDurationRaw) || 10800;
                        if (/am|pm|a\.m\.|p\.m\./i.test(stintDurationRaw) && duration < 60) {
                            plugin.showOverlay("⚠️ Please enter a future time (e.g. '3:30PM')", false);
                            return;
                        }
                        tasks = Math.min(remTasks, Math.floor(duration / pace));
                    }

                    tasks = Math.max(1, tasks);
                    duration = Math.max(60, duration);

                    plugin.stopSession();

                    // Only set targetFinishTimestamp when the user selects "Target Finish Time"
                    // In "Stint Time Target" mode, it is undefined so pauses push back the finish time naturally
                    const targetFinishTimestamp = stintTargetMode === "endTime"
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
                        segmentedCountUp: true,
                        currentQuota: tasks,
                        maxTargetSegments: remTasks,
                        totalWorkTime: 0,
                        benchmarkPace: project.benchmarkPace || 60,
                        hardStopTotalSeconds: duration,
                        earlyFinishBanked: 0,
                        targetFinishTimestamp,
                        projectId: project.id,
                        projectName: project.name,
                        projectGoal: project.totalProjectGoal,
                        projectCompletedInitial: project.totalProjectCompleted || 0,
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

                    plugin.showOverlay(`🚀 Stint Launched: ${tasks} Tasks for "${project.name}"!`, true);
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

        const currentBenchmark = session.benchmarkPace || session.initialSegmentDuration || 60;
        const sessionAvg = session.completedSegments > 0 
            ? (session.totalWorkTime / session.completedSegments) 
            : currentBenchmark;

        const paceRatio = Math.round((sessionAvg / currentBenchmark) * 100);

        if (session.cumulativeDelta >= threshold) {
            const maxGoal = session.maxTargetSegments || session.totalSegments;
            const prevQuota = session.currentQuota || maxGoal;
            const isAtMax = prevQuota >= maxGoal;

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
                plugin.showOverlay(`🏆 Max Quota: -${pullStr}`, true, "up");
            } else {
                const earnedSegments = Math.max(1, Math.floor(threshold / session.targetSegmentDuration));
                session.currentQuota = Math.min(maxGoal, (session.currentQuota || session.totalSegments) + earnedSegments);
                session.cumulativeDelta -= threshold;
                plugin.playVictoryChime();
                plugin.showOverlay(`⭐ Rhythm Milestone: +${earnedSegments} Tasks`, true, "up");
            }
        } else if (session.cumulativeDelta <= -threshold) {
            const prevQuota = session.currentQuota || session.maxTargetSegments || session.totalSegments;
            const actualAvg = session.totalWorkTime / session.completedSegments;
            
            const proposedDuration = Math.max(1, Math.round(actualAvg * 1.25));
            const newDuration = Math.max(session.targetSegmentDuration, proposedDuration);

            session.benchmarkPace = Math.max(session.benchmarkPace || 60, Math.round(actualAvg));
            session.targetSegmentDuration = newDuration;
            session.initialSegmentDuration = newDuration;

            const remainingAchievable = Math.floor(Math.max(0, trueTimeLeft) / newDuration);
            session.currentQuota = Math.min(session.maxTargetSegments || session.totalSegments, session.completedSegments + remainingAchievable);

            const remainingTasks = Math.max(0, session.currentQuota - session.completedSegments);
            const remainingWorkTime = remainingTasks * newDuration;
            const totalNeeded = session.globalTimeElapsed + remainingWorkTime;
            session.earlyFinishBanked = Math.max(0, hardStop - totalNeeded);

            session.cumulativeDelta = 0;

            const quotaDiff = session.currentQuota - prevQuota;
            const quotaDiffSign = quotaDiff >= 0 ? "+" : "";
            const paceStr = formatHumanReadableDuration(newDuration).replace(/\s+/g, "");

            plugin.playShieldBash();
            plugin.showOverlay(`🛟 Rescue: ${paceStr} Pace, ${quotaDiffSign}${quotaDiff} Tasks`, false, "down");
        }

        const isProjectStint = Boolean(session.projectId && session.projectGoal);
        if (isProjectStint) {
            const totalProjectDone = (session.projectCompletedInitial || 0) + session.completedSegments;
            const projectFinished = totalProjectDone >= (session.projectGoal || 100);
            const timeRanOut = trueTimeLeft <= 0;

            if (projectFinished || timeRanOut) {
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

        if (session.isFinished) {
            const liveDelta = session.cumulativeDelta;
            const deltaSign = liveDelta > 0 ? "+" : "";
            const deltaStyle = liveDelta > 0 ? "color: #10b981;" : (liveDelta < 0 ? "color: #ef4444;" : "");
            const deltaStr = formatDelta(liveDelta);
            
            return `${clockPrefix}⏱️ [${displayTitle}:00:00] [<span style="${deltaStyle}">${deltaSign}${deltaStr}</span>] 🏆 Done! (${session.completedSegments}/${currentQuota}) [Max: ${maxGoal}]`;
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
                remainingDisplaySeconds = Math.min(hardTimeLeft, workTimeLeft);
            } else {
                const totalProjectDone = (session.projectCompletedInitial || 0) + session.completedSegments;
                const projectTasksLeft = Math.max(0, (session.projectGoal || 100) - totalProjectDone);
                const projectWorkTimeLeft = Math.max(0, projectTasksLeft * session.targetSegmentDuration - session.segmentTimeElapsed);
                effectiveWorkTimeLeft = projectWorkTimeLeft;
                isWorkShorterThanHardTime = projectWorkTimeLeft < hardTimeLeft;
                remainingDisplaySeconds = Math.min(hardTimeLeft, projectWorkTimeLeft);
            }
        } else {
            const remainingTasks = Math.max(0, currentQuota - session.completedSegments);
            const workTimeLeft = Math.max(0, remainingTasks * session.targetSegmentDuration - session.segmentTimeElapsed);
            effectiveWorkTimeLeft = workTimeLeft;
            isWorkShorterThanHardTime = workTimeLeft < hardTimeLeft;
            remainingDisplaySeconds = Math.min(hardTimeLeft, workTimeLeft);
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

        const deltaTargetDisplay = `${deltaSign}${formatTime(Math.abs(liveDelta))}/${formatTime(threshold)}`;
        const deltaDisplay = `[<span style="${deltaStyle}">${deltaTargetDisplay}</span> ${ratioDisplay}: ${estFinishedTimeStr}]`;

        let countDisplay = "";
        if (isProjectStint) {
            const completedToday = session.completedSegments;
            const baseGoal = session.stintInitialGoal || 5;
            const quotaToday = Math.max(baseGoal, session.currentQuota || baseGoal);
            const goalMet = completedToday >= baseGoal;
            const starTag = goalMet ? ` ⭐${baseGoal}` : ` • ${baseGoal}`;
            const totalProjCompleted = (session.projectCompletedInitial || 0) + completedToday;

            countDisplay = `(${completedToday}/${quotaToday}${starTag}) [Proj: ${totalProjCompleted}/${session.projectGoal}]`;
        } else {
            countDisplay = session.segmentedCountUp
                ? `(${session.completedSegments}/${currentQuota}) [Max: ${maxGoal}]`
                : `(${Math.max(0, currentQuota - session.completedSegments)}) [Max: ${maxGoal}]`;
        }

        return `${clockPrefix}⏱️ [${displayTitle}:${formattedGlobalTime}] [S:<span style="${segmentStyle}">${segStr}</span>] ${deltaDisplay} ${countDisplay}${pauseText}`;
    }
};