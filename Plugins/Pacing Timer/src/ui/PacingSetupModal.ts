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
    footerContainer: HTMLDivElement | null = null;

    constructor(app: App, plugin: PacingTimerPlugin, onSubmit: (config: any) => void) {
        super(app);
        this.plugin = plugin;
        this.onSubmit = onSubmit;

        // 1. Prefer the currently running session's mode if active
        // 2. Otherwise fall back to the last selected mode in cache (defaulting to "segmented")
        if (plugin.session?.mode) {
            this.selectedMode = plugin.session.mode;
        } else if (plugin.settings.cache?.selectedMode) {
            this.selectedMode = plugin.settings.cache.selectedMode;
        } else {
            this.selectedMode = "segmented";
        }

        this.config.title = "G";
    }

    onOpen() {
        this.plugin.activeModal = this;
        const { contentEl } = this;
        contentEl.empty();
        Object.assign(contentEl.style, { display: "flex", flexDirection: "column", minHeight: "420px" });

        const headerRow = contentEl.createDiv();
        Object.assign(headerRow.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
        });
        headerRow.createEl("h3", { text: "⏱️ Pacing Setup", attr: { style: "margin: 0;" } });

        this.scope.register([], "Escape", (evt) => {
            evt.preventDefault();
            this.close();
        });

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
                dropdown.setValue(this.selectedMode).onChange(async value => {
                    this.selectedMode = value as TimerMode;
                    
                    // Immediately persist your selection so it's remembered next time
                    this.plugin.settings.cache.selectedMode = this.selectedMode;
                    await this.plugin.saveSettings();

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

        this.footerContainer = contentEl.createDiv();
        this.footerContainer.style.marginTop = "auto";
        new Setting(this.footerContainer).addButton(btn => btn.setButtonText("Launch Engine").setCta().onClick(() => this.submitForm()));

        this.toggleSettingsContainers();

        this.scope.register([], "Enter", (evt) => {
            if (this.selectedMode === "segmented") return;
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
                return;
            }
            evt.preventDefault();
            this.submitForm();
        });
        this.scope.register(["Meta"], "Enter", (evt) => { 
            if (this.selectedMode === "segmented") return;
            evt.preventDefault(); 
            this.submitForm(); 
        });
        this.scope.register(["Ctrl"], "Enter", (evt) => { 
            if (this.selectedMode === "segmented") return;
            evt.preventDefault(); 
            this.submitForm(); 
        });
    }

    toggleSettingsContainers() {
        for (const [id, container] of Object.entries(this.modeContainers)) {
            container.style.display = id === this.selectedMode ? "block" : "none";
        }
        if (this.footerContainer) {
            this.footerContainer.style.display = this.selectedMode === "segmented" ? "none" : "block";
        }
    }

    async submitForm() {
        this.config.mode = this.selectedMode;
        this.config.title = "G";
        this.plugin.settings.cache.selectedMode = this.selectedMode;
        await this.plugin.saveSettings();
        
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