import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {}

const DEFAULT_SETTINGS: KineticCompanionSettings = {};

// ── CUSTOM INLINE SELECTION PROMPT MODAL ────────────────────────────────
class SelectionPromptModal extends Modal {
    onSubmit: (instruction: string) => void;
    inputEl!: HTMLInputElement;

    constructor(app: App, onSubmit: (instruction: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "Kinetic Prompt Selection" });
        
        const desc = contentEl.createEl("p", { text: "How should Google AI Studio update your highlighted selection? (Leave blank to submit raw selection)" });
        desc.style.cssText = "color: var(--text-muted); font-size: 0.85em; margin-top: 10px;";

        this.inputEl = contentEl.createEl("input", { type: "text" });
        this.inputEl.style.width = "100%";
        this.inputEl.placeholder = "e.g., make it sound warmer, rewrite as bullet list...";
        
        setTimeout(() => this.inputEl.focus(), 20);

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.submit();
        });
    }

    submit() {
        const value = this.inputEl.value.trim();
        // Pass the value directly—even if empty—to support raw selection submissions
        this.onSubmit(value);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ── CORE PLUGIN IMPLEMENTATION ──────────────────────────────────────────
export default class KineticCompanionPlugin extends Plugin {
    settings!: KineticCompanionSettings;
    companion!: FloatingCompanion;

    async onload() {
        await this.loadSettings();

        // Initialize the floating DOM background companion
        this.companion = new FloatingCompanion(this.app);
        this.companion.init();

        // 1. Command to prompt with active highlighted selection
        this.addCommand({
            id: 'kinetic-selection-prompt',
            name: 'Prompt with Selection',
            editorCallback: (editor: Editor) => {
                const selection = editor.getSelection().trim();
                if (!selection) {
                    new Notice("Please select some text to prompt with.");
                    return;
                }
                
                const rangeFrom = editor.getCursor('from');
                const rangeTo = editor.getCursor('to');

                const promptModal = new SelectionPromptModal(this.app, (instruction) => {
                    const compiledPrompt = instruction ? `${instruction}:\n\n${selection}` : selection;
                    this.companion.executeStreamSession(editor, compiledPrompt, selection, rangeFrom, rangeTo);
                });
                promptModal.open();
            }
        });

        // 2. Command to show, hide, or toggle the floating companion panel
        this.addCommand({
            id: 'toggle-companion-webview',
            name: 'Toggle Companion Webview',
            callback: () => {
                this.companion.toggleVisibility();
            }
        });

        // Ribbon icon opens and shows the floating companion panel
        this.addRibbonIcon("comment-discussion", "Open Companion View", () => {
            this.companion.show();
        });

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.companion) {
            this.companion.cleanup();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

// ── SETTINGS TAB CLASS ─────────────────────────────────────────────────
class KineticCompanionSettingTab extends PluginSettingTab {
    plugin: KineticCompanionPlugin;

    constructor(app: App, plugin: KineticCompanionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Kinetic Companion Settings' });
        containerEl.createEl('p', { 
            text: 'Kinetic Companion embeds and streams responses from Google AI Studio directly into your notes.',
            cls: 'setting-item-description'
        });
    }
}