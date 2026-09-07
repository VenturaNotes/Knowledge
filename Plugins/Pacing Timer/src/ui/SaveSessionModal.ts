import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';

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
        this.sessionName = `Session - ${dateStr}`;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "💾 Save Current Session" });

        new Setting(contentEl)
            .setName("Session Name")
            .setDesc("Give this session a name so you can resume it later.")
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
                .setButtonText("Save Session")
                .setCta()
                .onClick(() => this.save())
            );
    }

    async save() {
        if (!this.plugin.session) {
            this.close();
            return;
        }

        const name = this.sessionName.trim() || "Untitled Session";
        const id = Date.now().toString();

        if (!this.plugin.settings.savedSessions) {
            this.plugin.settings.savedSessions = {};
        }

        this.plugin.settings.savedSessions[id] = {
            id,
            name,
            savedAt: Date.now(),
            session: JSON.parse(JSON.stringify(this.plugin.session))
        };

        await this.plugin.saveSettings();
        this.plugin.showOverlay(`💾 Saved: "${name}"`, true);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}