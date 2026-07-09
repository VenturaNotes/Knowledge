import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';
import { FloatingCompanion } from './FloatingCompanion';

// ── CONFIGURATION & CONSTANTS ──────────────────────────────────────────
interface KineticCompanionSettings {
    enableSparkles: boolean;
    enableSlamPaste: boolean;
}

const DEFAULT_SETTINGS: KineticCompanionSettings = {
    enableSparkles: true,
    enableSlamPaste: true
};

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
        
        const desc = contentEl.createEl("p", { text: "How should Gemma 4 update your highlighted selection? (Leave blank to submit raw selection)" });
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
    audioCtx: AudioContext | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize the VaporNote-style floating DOM background companion
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

        // 2. Command to show, hide, or center the floating companion panel
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

        // 3. Register Editor Sparkle Visualizer
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                if (this.settings.enableSparkles) {
                    this.spawnCursorParticle(editor);
                }
            })
        );

        // 4. Register Heavy Slam Paste Listener
        this.registerEvent(
            this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor) => {
                if (this.settings.enableSlamPaste) {
                    this.triggerSlamEffect(editor);
                }
            })
        );

        this.addSettingTab(new KineticCompanionSettingTab(this.app, this));
    }

    async onunload() {
        if (this.audioCtx) {
            try {
                this.audioCtx.close();
            } catch(e) {}
        }
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

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSlamStamp() {
        this.initAudio();
        if (!this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            
            const lowOsc = this.audioCtx.createOscillator();
            const lowGain = this.audioCtx.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(90, now);
            lowOsc.frequency.linearRampToValueAtTime(30, now + 0.15);
            lowGain.gain.setValueAtTime(0.4, now);
            lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            lowOsc.connect(lowGain);
            lowGain.connect(this.audioCtx.destination);
            lowOsc.start(now);
            lowOsc.stop(now + 0.16);

            const clickOsc = this.audioCtx.createOscillator();
            const clickGain = this.audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(600, now);
            clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            clickOsc.connect(clickGain);
            clickGain.connect(this.audioCtx.destination);
            clickOsc.start(now);
            clickOsc.stop(now + 0.06);
        } catch(e) {}
    }

    spawnCursorParticle(editor: Editor) {
        try {
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                const particle = document.createElement("div");
                particle.className = "kc-cursor-particle";
                
                const offsetX = (Math.random() - 0.5) * 8;
                const offsetY = (Math.random() - 0.5) * 4;
                
                particle.style.left = `${coords.left + offsetX}px`;
                particle.style.top = `${coords.top + offsetY}px`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 400);
            }
        } catch (e) {
            // Fail silently
        }
    }

    triggerSlamEffect(editor: Editor) {
        try {
            this.playSlamStamp();
            
            const cursor = editor.getCursor();
            const coords = (editor as any).coordsAtPos(cursor);
            if (coords) {
                for (let i = 0; i < 4; i++) {
                    const dustLeft = document.createElement("div");
                    dustLeft.className = "kc-dust-particle kc-dust-left";
                    dustLeft.style.left = `${coords.left}px`;
                    dustLeft.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustLeft);

                    const dustRight = document.createElement("div");
                    dustRight.className = "kc-dust-particle kc-dust-right";
                    dustRight.style.left = `${coords.left}px`;
                    dustRight.style.top = `${coords.top + (Math.random() - 0.5) * 8}px`;
                    document.body.appendChild(dustRight);

                    setTimeout(() => {
                        dustLeft.remove();
                        dustRight.remove();
                    }, 300);
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    const el = activeView.containerEl;
                    el.classList.add("kc-shaking");
                    setTimeout(() => {
                        el.classList.remove("kc-shaking");
                    }, 150);
                }
            }
        } catch (e) {
            // Fail silently
        }
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

        new Setting(containerEl)
            .setName('Typing Caret Sparkles')
            .setDesc('Toggle ON to spawn beautiful glowing kinetic sparkles behind your cursor as you type.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSparkles)
                .onChange(async (value) => {
                    this.plugin.settings.enableSparkles = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Heavy Slam Paste Effect')
            .setDesc('Toggle ON to trigger a satisfying, tactile stamp thud, screen shake, and dust particles whenever you paste text.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableSlamPaste)
                .onChange(async (value) => {
                    this.plugin.settings.enableSlamPaste = value;
                    await this.plugin.saveSettings();
                }));
    }
}