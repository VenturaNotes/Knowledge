import { App, Modal, Setting } from 'obsidian';
import PacingTimerPlugin from '../main';
import { ModeRegistry } from '../modes';
import { TimerMode } from '../types';
import { findPluginHotkeys, mapKey } from '../utils';

export class PacingSetupModal extends Modal {
    plugin: PacingTimerPlugin;
    onSubmit: (config: any) => void;
    
    selectedMode: TimerMode;
    config: Record<string, any> = {};
    modeContainers: Record<string, HTMLDivElement> = {};
    titleSettingEl: HTMLElement | null = null;

    constructor(app: App, plugin: PacingTimerPlugin, onSubmit: (config: any) => void) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
        this.selectedMode = plugin.settings.cache.selectedMode || "stacking";
        this.config.title = plugin.settings.cache.rawTitle && plugin.settings.cache.rawTitle !== "undefined" ? plugin.settings.cache.rawTitle : "";
    }

    onOpen() {
        this.plugin.activeModal = this;
        const { contentEl } = this;
        contentEl.empty();
        Object.assign(contentEl.style, { display: "flex", flexDirection: "column", minHeight: "440px" });

        contentEl.createEl("h3", { text: "⏱️ Pacing Setup" });

        // Register Escape key to close modal
        this.scope.register([], "Escape", (evt) => {
            evt.preventDefault();
            this.close();
        });

        // Register any hotkeys assigned to pacing-timer-setup on the modal scope to close modal when pressed
        findPluginHotkeys(this.app, "pacing-timer", "pacing-timer-setup").forEach(hk => {
            this.scope.register(hk.modifiers || [], mapKey(hk.key, hk.modifiers || []), (evt) => {
                evt.preventDefault();
                this.close();
            });
        });

        const formContainer = contentEl.createDiv();
        formContainer.style.flexGrow = "1";

        new Setting(formContainer).setName("Timer Mode").setDesc("Choose your focus tracking framework.")
            .addDropdown(dropdown => {
                Object.values(ModeRegistry).forEach(h => dropdown.addOption(h.id, h.displayName));
                dropdown.setValue(this.selectedMode).onChange(value => {
                    this.selectedMode = value as TimerMode;
                    this.toggleSettingsContainers();
                });
            });

        const titleSetting = new Setting(formContainer)
            .setName("Session Title")
            .setDesc("Optional label showing on the bar (e.g. 'Writing', 'Code').")
            .addText(text => text.setValue(this.config.title).setPlaceholder("G").onChange(v => this.config.title = v));
        this.titleSettingEl = titleSetting.settingEl;

        for (const [id, handler] of Object.entries(ModeRegistry)) {
            const container = formContainer.createDiv({ cls: `pacing-${id}-settings` });
            this.modeContainers[id] = container;
            handler.buildSettings(container, this.plugin, this.config, () => {
                if (this.config.updatePreviewUI) this.config.updatePreviewUI();
            });
        }
        this.toggleSettingsContainers();

        const footerContainer = contentEl.createDiv();
        footerContainer.style.marginTop = "auto";
        new Setting(footerContainer).addButton(btn => btn.setButtonText("Launch Engine").setCta().onClick(() => this.submitForm()));

        this.scope.register([], "Enter", (evt) => { evt.preventDefault(); this.submitForm(); });
        this.scope.register(["Meta"], "Enter", (evt) => { evt.preventDefault(); this.submitForm(); });
        this.scope.register(["Ctrl"], "Enter", (evt) => { evt.preventDefault(); this.submitForm(); });
    }

    toggleSettingsContainers() {
        if (this.titleSettingEl) {
            this.titleSettingEl.style.display = this.selectedMode === "rotation" ? "none" : "";
        }

        for (const [id, container] of Object.entries(this.modeContainers)) {
            container.style.display = id === this.selectedMode ? "block" : "none";
        }
    }

    submitForm() {
        this.config.mode = this.selectedMode;
        this.plugin.settings.cache = { selectedMode: this.selectedMode, rawTitle: this.config.title };
        
        for (const handler of Object.values(ModeRegistry)) {
            if (handler.saveSettings) handler.saveSettings(this.config, this.plugin.settings);
        }

        this.onSubmit(this.config);
        this.close();
    }

    onClose() {
        this.plugin.activeModal = null;
        this.contentEl.empty();
    }
}