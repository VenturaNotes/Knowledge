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

    constructor(app: App, plugin: PacingTimerPlugin, onSubmit: (config: any) => void) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;
        this.selectedMode = plugin.settings.cache.selectedMode || "stacking";
        this.config.title = "G";
    }

    onOpen() {
        this.plugin.activeModal = this;
        const { contentEl } = this;
        contentEl.empty();
        Object.assign(contentEl.style, { display: "flex", flexDirection: "column", minHeight: "380px" });

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

        // Only submit on plain Enter if the user is NOT actively typing in an input field
        this.scope.register([], "Enter", (evt) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
                return;
            }
            evt.preventDefault();
            this.submitForm();
        });
        this.scope.register(["Meta"], "Enter", (evt) => { evt.preventDefault(); this.submitForm(); });
        this.scope.register(["Ctrl"], "Enter", (evt) => { evt.preventDefault(); this.submitForm(); });
    }

    toggleSettingsContainers() {
        for (const [id, container] of Object.entries(this.modeContainers)) {
            container.style.display = id === this.selectedMode ? "block" : "none";
        }
    }

    submitForm() {
        this.config.mode = this.selectedMode;
        this.config.title = "G";
        this.plugin.settings.cache = { selectedMode: this.selectedMode, rawTitle: "" };
        
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