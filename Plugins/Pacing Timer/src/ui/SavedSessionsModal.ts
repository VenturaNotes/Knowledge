import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { formatHumanReadableDuration, parseDurationToSeconds, parsePlaylistInput } from '../utils';
import { ProjectModal } from './ProjectModal';
import { SavedSessionRecord } from '../types';

export class SavedSessionsModal extends Modal {
    plugin: PacingTimerPlugin;

    constructor(app: App, plugin: PacingTimerPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        this.render();
    }

    render() {
        const { contentEl } = this;
        contentEl.empty();

        const headerRow = contentEl.createDiv();
        Object.assign(headerRow.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px"
        });
        headerRow.createEl("h3", { text: "📂 Project Library", attr: { style: "margin: 0;" } });

        const newProjBtn = headerRow.createEl("button", {
            text: "+ New Project",
            cls: "mod-cta",
            attr: { style: "font-size: 0.82em; padding: 4px 12px; cursor: pointer;" }
        });
        newProjBtn.onclick = () => {
            this.openCreateProjectModal();
        };

        const projects = Object.values(this.plugin.settings.savedSessions || {})
            .sort((a, b) => b.savedAt - a.savedAt);

        if (projects.length === 0) {
            contentEl.createEl("p", {
                text: "No projects found. Click '+ New Project' above to create a project with equal or custom-timed segments.",
                attr: { style: "color: var(--text-muted); font-size: 0.9em;" }
            });
            return;
        }

        const listContainer = contentEl.createDiv({ cls: "pacing-saved-sessions-list" });
        Object.assign(listContainer.style, {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "380px",
            overflowY: "auto",
            paddingRight: "4px"
        });

        projects.forEach(item => {
            const card = listContainer.createDiv();
            const isActive = Boolean(this.plugin.session && this.plugin.session.projectId === item.id);

            Object.assign(card.style, {
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--background-secondary)",
                border: isActive ? "1px solid var(--interactive-accent)" : "1px solid var(--background-modifier-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer"
            });

            card.onclick = () => {
                this.close();
                new ProjectModal(this.app, this.plugin, item).open();
            };

            const info = card.createDiv();
            info.style.flexGrow = "1";

            const titleRow = info.createDiv();
            Object.assign(titleRow.style, { display: "flex", alignItems: "center", gap: "8px" });
            titleRow.createEl("span", {
                text: `📚 ${item.name}`,
                attr: { style: "font-weight: 600; font-size: 1em; color: var(--text-normal);" }
            });

            if (isActive) {
                titleRow.createEl("span", {
                    text: "🟢 Stint Active",
                    attr: { style: "background: var(--interactive-accent); color: var(--text-on-accent); padding: 1px 6px; border-radius: 8px; font-size: 0.72em; font-weight: bold;" }
                });
            }

            const meta = info.createDiv();
            Object.assign(meta.style, { fontSize: "0.82em", color: "var(--text-muted)", marginTop: "3px" });

            const done = item.totalProjectCompleted || 0;
            const goal = item.totalProjectGoal || 100;
            const pct = Math.round((done / goal) * 100);
            const pace = Math.max(1, Math.round((item.benchmarkPace || 60) * 1.25));
            const remaining = Math.max(0, goal - done);
            
            let estRemainingTime = 0;
            if (item.customSegmentDurations && item.customSegmentDurations.length > 0) {
                let baseSum = 0;
                for (let i = done; i < item.customSegmentDurations.length; i++) {
                    baseSum += item.customSegmentDurations[i] || 0;
                }
                estRemainingTime = Math.round(baseSum * (item.paceMultiplier || 1.25));
            } else {
                estRemainingTime = remaining * pace;
            }

            const timingLabel = item.customSegmentDurations?.length ? "Custom Timings" : `Pace: ${formatHumanReadableDuration(pace).replace(/\s+/g, "")}`;
            meta.textContent = `${done}/${goal} Tasks (${pct}%) • ${timingLabel} • Est: ~${formatHumanReadableDuration(estRemainingTime)}`;

            const btnGroup = card.createDiv();
            btnGroup.onclick = (e) => e.stopPropagation();

            const openBtn = btnGroup.createEl("button", {
                text: "Open Dashboard →",
                attr: { style: "font-size: 0.82em; padding: 4px 10px; cursor: pointer;" }
            });
            openBtn.onclick = () => {
                this.close();
                new ProjectModal(this.app, this.plugin, item).open();
            };
        });
    }

    openCreateProjectModal() {
        const modal = new Modal(this.app);
        modal.contentEl.empty();
        modal.contentEl.createEl("h3", { text: "📚 Create New Project" });

        let name = "New Project";
        let timingMode: "equal" | "custom" = "equal";
        let goal = "100";
        let pace = "1m15s";
        let customInput = "";
        let multiplier = "1.25";

        new Setting(modal.contentEl)
            .setName("Project Name")
            .addText(t => t.setValue(name).onChange(v => name = v));

        const timingSetting = new Setting(modal.contentEl)
            .setName("Segment Timing Type")
            .setDesc("Choose whether all tasks share equal duration, or if tasks have custom lengths (videos, readings, chapters).")
            .addDropdown(drop => drop
                .addOption("equal", "Equal Duration Segments")
                .addOption("custom", "Custom / Variable Segments (Paste Timestamps)")
                .setValue(timingMode)
                .onChange(v => {
                    timingMode = v as "equal" | "custom";
                    updateVisibility();
                })
            );

        const equalGoalSetting = new Setting(modal.contentEl)
            .setName("Total Project Goal")
            .setDesc("Total segments to complete (e.g. '190').")
            .addText(t => t.setValue(goal).onChange(v => goal = v));

        const equalPaceSetting = new Setting(modal.contentEl)
            .setName("Estimated Pace per Task")
            .setDesc("Default segment duration (e.g. '1m', '45s').")
            .addText(t => t.setValue(pace).onChange(v => pace = v));

        const customAreaSetting = new Setting(modal.contentEl)
            .setName("Custom Timings / Table")
            .setDesc("Paste YouTube timestamps, markdown tables, or comma-separated durations (e.g. '0:06:31', '12:01', '8m26s').")
            .addTextArea(area => {
                area.setPlaceholder("| 0:06:31 |\n| 0:12:01 |\n| 0:08:26 |")
                    .setValue(customInput)
                    .onChange(v => customInput = v);
                area.inputEl.rows = 5;
                area.inputEl.style.width = "100%";
                area.inputEl.style.fontFamily = "monospace";
            });

        const customMultSetting = new Setting(modal.contentEl)
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

        new Setting(modal.contentEl).addButton(btn => btn.setButtonText("Create Project").setCta().onClick(async () => {
            const id = Date.now().toString();

            if (timingMode === "custom") {
                const durations = parsePlaylistInput(customInput);
                const safeDurations = durations.length > 0 ? durations : [600];
                const totalGoal = safeDurations.length;
                const totalBase = safeDurations.reduce((a, b) => a + b, 0);
                const avgBase = Math.max(1, Math.round(totalBase / safeDurations.length));
                const mult = Math.max(1.0, parseFloat(multiplier) || 1.25);
                
                // Fallback prevents TS2532 undefined index error
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
                        ...this.plugin.session!,
                        mode: "segmented",
                        maxTargetSegments: totalGoal,
                        totalSegments: totalGoal,
                        benchmarkPace: avgBase,
                        initialSegmentDuration: firstDuration,
                        targetSegmentDuration: firstDuration,
                        customSegmentDurations: safeDurations,
                        paceMultiplier: mult
                    }
                };

                if (!this.plugin.settings.savedSessions) {
                    this.plugin.settings.savedSessions = {};
                }
                this.plugin.settings.savedSessions[id] = record;
                await this.plugin.saveSettings();
                modal.close();
                this.close();
                new ProjectModal(this.app, this.plugin, record).open();
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
                        ...this.plugin.session!,
                        mode: "segmented",
                        maxTargetSegments: totalGoal,
                        totalSegments: totalGoal,
                        benchmarkPace: paceSecs,
                        initialSegmentDuration: paceSecs,
                        targetSegmentDuration: paceSecs
                    }
                };

                if (!this.plugin.settings.savedSessions) {
                    this.plugin.settings.savedSessions = {};
                }
                this.plugin.settings.savedSessions[id] = record;
                await this.plugin.saveSettings();
                modal.close();
                this.close();
                new ProjectModal(this.app, this.plugin, record).open();
            }
        }));

        modal.open();
    }

    onClose() {
        this.contentEl.empty();
    }
}