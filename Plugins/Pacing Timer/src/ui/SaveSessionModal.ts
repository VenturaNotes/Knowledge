import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { SavedSessionRecord } from '../types';

export class SaveSessionModal extends Modal {
    plugin: PacingTimerPlugin;
    sessionName: string = "";

    constructor(app: App, plugin: PacingTimerPlugin) {
        super(app);
        this.plugin = plugin;
        const dateStr = new Date().toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        this.sessionName = this.plugin.session?.projectName || `Project - ${dateStr}`;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "💾 Save Project / Session" });

        new Setting(contentEl)
            .setName("Project Name")
            .setDesc("Give this project a name so you can manage daily stints for it.")
            .addText(text => {
                text.setValue(this.sessionName).onChange(v => this.sessionName = v);
                setTimeout(() => text.inputEl.focus(), 10);
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this.save();
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Save to Library")
                .setCta()
                .onClick(() => this.save())
            );
    }

    async save() {
        const s = this.plugin.session;
        if (!s) {
            this.close();
            return;
        }

        const name = this.sessionName.trim() || "Untitled Project";
        const id = s.projectId || Date.now().toString();

        if (!this.plugin.settings.savedSessions) {
            this.plugin.settings.savedSessions = {};
        }

        const totalGoal = s.projectGoal || s.maxTargetSegments || s.totalSegments || 100;
        const completed = (s.projectCompletedInitial || 0) + (s.completedSegments || 0);
        const workTime = s.totalWorkTime || 0;
        const benchmark = s.benchmarkPace || s.initialSegmentDuration || 60;

        const record: SavedSessionRecord = {
            id,
            name,
            savedAt: Date.now(),
            totalProjectGoal: totalGoal,
            totalProjectCompleted: completed,
            totalWorkTime: workTime,
            benchmarkPace: benchmark,
            session: JSON.parse(JSON.stringify(s))
        };

        this.plugin.settings.savedSessions[id] = record;

        // Link active session to this project
        s.projectId = id;
        s.projectName = name;
        s.projectGoal = totalGoal;

        await this.plugin.saveSettings();
        this.plugin.showOverlay(`💾 Saved to Library: "${name}"`, true);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}