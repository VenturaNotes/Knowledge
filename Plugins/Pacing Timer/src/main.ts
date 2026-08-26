import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { PacingSessionState, PacingTimerSettings, DEFAULT_SETTINGS, createBlankSession } from './types';
import { ModeRegistry } from './modes';
import { PacingSetupModal } from './ui/PacingSetupModal';
import { getCurrentTimeStr } from './utils';

class PacingTimerSettingTab extends PluginSettingTab {
    plugin: PacingTimerPlugin;
    constructor(app: App, plugin: PacingTimerPlugin) { super(app, plugin); this.plugin = plugin; }
    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "⏱️ Pacing Timer Settings" });
        new Setting(containerEl).setName("Show Current Time").addToggle(toggle => toggle
            .setValue(this.plugin.settings.showCurrentTime)
            .onChange(async (value) => {
                this.plugin.settings.showCurrentTime = value;
                await this.plugin.saveSettings();
                this.plugin.updateStatusBar();
            })
        );
    }
}

export default class PacingTimerPlugin extends Plugin {
    settings: PacingTimerSettings;
    statusBarItem: HTMLElement | null = null;
    session: PacingSessionState | null = null;
    activeModal: PacingSetupModal | null = null;
    
    private timerId: any = null;
    private alarmId: any = null;
    private audioCtx: AudioContext | null = null;
    private overlayEl: HTMLDivElement | null = null;
    private overlayTimeout: any = null;
    private lastStatusBarHTML = "";

    private glassBuffer: AudioBuffer | null = null;
    private heroBuffer: AudioBuffer | null = null;

    private lastNativeExecutionTime = 0;
    private lastIPCExecutionTime = 0;

    private lastSetupNativeExecutionTime = 0;
    private lastSetupIPCExecutionTime = 0;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new PacingTimerSettingTab(this.app, this));
        this.statusBarItem = this.addStatusBarItem();
        this.statusBarItem.classList.add("status-bar-pacing-timer");

        // Setup Modal command (Toggles modal visibility, does NOT turn off session)
        this.addCommand({ id: 'pacing-timer-setup', name: 'Setup Modal', callback: () => this.handleCommandTrigger() });
        
        // Distinct command to completely turn off the active pacing timer session
        this.addCommand({ id: 'pacing-timer-turn-off', name: 'Turn Off / Stop Pacing Timer', callback: () => {
            if (this.activeModal) this.activeModal.close();
            if (this.session) {
                this.stopSession();
                this.showOverlay("⏹ Timer Turned Off");
            }
        }});

        this.addCommand({ id: "pacing-timer-pause", name: "Pause/Resume Session", hotkeys: [{ modifiers: ["Ctrl", "Meta"], key: "c" }], checkCallback: (c) => {
            if (this.session) { if (!c) this.togglePause(); return true; } return false;
        }});
        this.addCommand({ id: "pacing-timer-complete", name: "Complete Segment / Reset", checkCallback: (c) => {
            if (this.session) { if (!c) this.triggerGlobalComplete(); return true; } return false;
        }});
        
        this.addCommand({ id: "pacing-timer-rotation-interrupt", name: "Rotation: Toggle Quick Interrupt", checkCallback: (c) => {
            if (this.session && this.session.mode === "rotation") {
                if (!c) {
                    ModeRegistry["rotation"]!.onInterrupt?.(this.session, this);
                    this.updateStatusBar();
                    this.saveSettings();
                }
                return true;
            } return false;
        }});
        this.addCommand({ id: "pacing-timer-rotation-skip", name: "Rotation: Skip to Next Category", checkCallback: (c) => {
            if (this.session && this.session.mode === "rotation") {
                if (!c) {
                    ModeRegistry["rotation"]!.onSkip?.(this.session, this);
                    this.updateStatusBar();
                    this.saveSettings();
                }
                return true;
            } return false;
        }});
        this.addCommand({ id: "pacing-timer-rotation-skip-back", name: "Rotation: Skip Back a Category", checkCallback: (c) => {
            if (this.session && this.session.mode === "rotation") {
                if (!c) {
                    ModeRegistry["rotation"]!.onSkipBack?.(this.session, this);
                    this.updateStatusBar();
                    this.saveSettings();
                }
                return true;
            } return false;
        }});

        if (this.settings.activeSession) {
            this.session = this.settings.activeSession;
            if (this.session.isRunning) {
                const elapsedSecs = Math.floor((Date.now() - this.session.lastTickTime) / 1000);
                if (elapsedSecs > 0) {
                    this.session.globalTimeElapsed += elapsedSecs;
                    this.session.segmentTimeElapsed += elapsedSecs;
                    ModeRegistry[this.session.mode]!.tick(this.session, this, elapsedSecs);
                }
                this.session.lastTickTime = Date.now();
            }
        }

        this.updateStatusBar();
        this.startInterval();
        this.preloadSystemSounds();
        await this.saveSettings();
    }

    onunload() {
        this.stopInterval();
        if (this.overlayTimeout) clearTimeout(this.overlayTimeout);
        if (this.overlayEl) this.overlayEl.remove();
        if (this.statusBarItem) { this.statusBarItem.remove(); this.statusBarItem = null; }
        if (this.session) this.saveSettings();
    }

    async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
    async saveSettings() { 
        this.settings.activeSession = this.session; 
        if (this.session && this.session.mode === "rotation") {
            this.settings.lastRotationSession = { ...this.session };
        }
        await this.saveData(this.settings); 
    }

    handleCommandTrigger() {
        const stack = new Error().stack || '';
        const isNativeHotkey = stack.includes("handleKey") || stack.includes("executeCommand") || stack.includes("checkCallback");
        const now = Date.now();

        if (isNativeHotkey) {
            if (now - this.lastSetupIPCExecutionTime < 150) return;
            this.lastSetupNativeExecutionTime = now;
        } else {
            if (now - this.lastSetupNativeExecutionTime < 500 || now - this.lastSetupIPCExecutionTime < 150) return;
            this.lastSetupIPCExecutionTime = now;
        }

        if (this.activeModal) { 
            this.activeModal.close(); 
            return; 
        }

        const modal = new PacingSetupModal(this.app, this, (config) => {
            this.stopSession(); 
            const base = createBlankSession();
            base.mode = config.mode;
            base.title = config.title || "G";
            
            const modeState = ModeRegistry[config.mode]!.createSessionState(config, this);
            this.session = { ...base, ...modeState } as PacingSessionState;
            
            this.updateStatusBar();
            this.startInterval();
            this.saveSettings();
        });
        modal.open();
    }

    stopSession() {
        this.session = null;
        this.stopAlarmSequence();
        this.saveSettings();
        this.updateStatusBar();
    }

    public triggerGlobalComplete() {
        if (!this.session) return;

        const stack = new Error().stack || '';
        const isNativeHotkey = stack.includes("handleKey") || stack.includes("executeCommand") || stack.includes("checkCallback");
        const now = Date.now();

        if (isNativeHotkey) {
            if (now - this.lastIPCExecutionTime < 150) return;
            this.lastNativeExecutionTime = now;
        } else {
            if (now - this.lastNativeExecutionTime < 500 || now - this.lastIPCExecutionTime < 150) return;
            this.lastIPCExecutionTime = now;
        }

        if (this.session.isFinished) {
            this.resetAndReopen();
        } else if (this.session.isRunning) {
            ModeRegistry[this.session.mode]!.onComplete(this.session, this);
            this.updateStatusBar();
            this.saveSettings(); // Instantly persist state change to disk
        }
    }

    public stopInterval() {
        if (this.timerId) { clearInterval(this.timerId); this.timerId = null; }
        this.stopAlarmSequence();
    }

    public startInterval() {
        this.stopInterval();
        this.timerId = window.setInterval(() => {
            this.updateStatusBar();
            if (!this.session || !this.session.isRunning) return;
            const now = Date.now();
            const deltaSeconds = Math.floor((now - this.session.lastTickTime) / 1000);
            if (deltaSeconds >= 1) {
                this.session.globalTimeElapsed += deltaSeconds;
                this.session.segmentTimeElapsed += deltaSeconds;
                ModeRegistry[this.session.mode]!.tick(this.session, this, deltaSeconds);
                if (this.session && this.session.mode === "rotation") {
                    this.settings.lastRotationSession = { ...this.session };
                }
                this.session.lastTickTime += deltaSeconds * 1000;
            }
        }, 200);
    }

    togglePause() {
        if (!this.session) return;
        this.session.isRunning = !this.session.isRunning;
        if (!this.session.isRunning) { this.stopAlarmSequence(); this.showOverlay("⏸ Paused"); }
        else { this.session.lastTickTime = Date.now(); this.showOverlay("▶ Resumed"); }
        this.updateStatusBar();
        this.saveSettings();
    }

    public resetAndReopen() { this.stopSession(); this.handleCommandTrigger(); }

    updateStatusBar() {
        if (!this.statusBarItem) return;
        const clockPrefix = this.settings.showCurrentTime ? `<span style='margin-right: 8px;'>[${getCurrentTimeStr()}]</span>` : "";
        if (!this.session) {
            const idleHTML = this.settings.showCurrentTime ? `<span style="font-family: monospace;">[${getCurrentTimeStr()}]</span>` : "";
            if (this.lastStatusBarHTML !== idleHTML) { this.statusBarItem.innerHTML = idleHTML; this.lastStatusBarHTML = idleHTML; }
            return;
        }

        const pauseText = this.session.isRunning ? "" : " <span style='color: var(--text-muted);'>(Paused)</span>";
        const displayTitle = (this.session.title && this.session.title !== "undefined") ? this.session.title : "G";
        const newHTML = ModeRegistry[this.session.mode]!.renderStatusBar(this.session, this, clockPrefix, pauseText, displayTitle);

        if (this.lastStatusBarHTML !== newHTML) {
            this.statusBarItem.innerHTML = newHTML;
            this.lastStatusBarHTML = newHTML;
        }
    }

    public showOverlay(message: string, isPositive: boolean | null = null, levelChange: "up" | "down" | null = null) {
        if (this.overlayTimeout) clearTimeout(this.overlayTimeout);
        if (this.overlayEl) this.overlayEl.remove();

        this.overlayEl = document.createElement("div");
        Object.assign(this.overlayEl.style, { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(30, 30, 46, 0.95)", border: "2px solid #313244", borderRadius: "12px", padding: "16px 28px", zIndex: "999999", color: "#cdd6f4", fontFamily: "monospace", fontSize: "24px", fontWeight: "bold", textAlign: "center", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)", pointerEvents: "none", transition: "opacity 0.3s ease", opacity: "1" });

        let coloredMessage = message;
        if (levelChange === "up") coloredMessage = message.replace("Upgrade", "<span style='color: #a6e3a1;'>Upgrade</span>");
        else if (levelChange === "down") coloredMessage = message.replace("Downgrade", "<span style='color: #f38ba8;'>Downgrade</span>");
        else if (isPositive !== null) {
            const parts = message.split(" | ");
            if (parts[parts.length - 1]) parts[parts.length - 1] = `<span style="color: ${isPositive ? "#a6e3a1" : "#f38ba8"};">${parts[parts.length - 1]}</span>`;
            coloredMessage = parts.join(" | ");
        }

        this.overlayEl.innerHTML = coloredMessage;
        document.body.appendChild(this.overlayEl);
        this.overlayTimeout = setTimeout(() => { if (this.overlayEl) { this.overlayEl.style.opacity = "0"; setTimeout(() => { this.overlayEl?.remove(); this.overlayEl = null; }, 300); } }, 1200);
    }

    public triggerAlarmSequence() {
        if (!this.alarmId) {
            this.playAlarmSound();
            this.alarmId = window.setInterval(() => { if (this.session && this.session.isRunning) this.playAlarmSound(); }, 1500);
        }
    }

    public triggerGlassAlarmSequence() {
        if (!this.alarmId) {
            this.playGlassSound();
            this.alarmId = window.setInterval(() => { if (this.session && this.session.isRunning) this.playGlassSound(); }, 1500);
        }
    }

    public stopAlarmSequence() {
        if (this.alarmId) { clearInterval(this.alarmId); this.alarmId = null; }
    }

    private initAudio() {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        return this.audioCtx;
    }

    private async preloadSystemSounds() {
        try {
            if (typeof require === 'undefined') return;
            const fs = require('fs');
            const os = require('os');
            const path = require('path');
            const { exec } = require('child_process');

            const ctx = this.initAudio();
            const tmpDir = os.tmpdir();

            const loadAndConvert = async (sourceAiff: string, tmpWav: string): Promise<AudioBuffer | null> => {
                return new Promise((resolve) => {
                    if (!fs.existsSync(sourceAiff)) {
                        resolve(null);
                        return;
                    }
                    exec(`afconvert -f WAVE -d I16@44100 "${sourceAiff}" "${tmpWav}"`, async (err: any) => {
                        if (err || !fs.existsSync(tmpWav)) {
                            resolve(null);
                            return;
                        }
                        try {
                            const buf = fs.readFileSync(tmpWav);
                            const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                            const decoded = await ctx.decodeAudioData(ab);
                            resolve(decoded);
                        } catch (e) {
                            resolve(null);
                        }
                    });
                });
            };

            this.glassBuffer = await loadAndConvert('/System/Library/Sounds/Glass.aiff', path.join(tmpDir, 'obsidian_pacing_glass.wav'));
            this.heroBuffer = await loadAndConvert('/System/Library/Sounds/Hero.aiff', path.join(tmpDir, 'obsidian_pacing_hero.wav'));
        } catch (e) {
            console.warn("Pacing Timer: Failed to preload native macOS sounds", e);
        }
    }

    public playGlassSound() {
        const ctx = this.initAudio();
        if (this.glassBuffer) {
            const source = ctx.createBufferSource();
            source.buffer = this.glassBuffer;
            source.connect(ctx.destination);
            source.start(0);
            return;
        }

        try {
            if (typeof require !== 'undefined') {
                const { exec } = require('child_process');
                exec('afplay "/System/Library/Sounds/Glass.aiff"');
            }
        } catch (e) {}
    }

    public playHeroSound() {
        const ctx = this.initAudio();
        if (this.heroBuffer) {
            const source = ctx.createBufferSource();
            source.buffer = this.heroBuffer;
            source.connect(ctx.destination);
            source.start(0);
            return;
        }

        try {
            if (typeof require !== 'undefined') {
                const { exec } = require('child_process');
                exec('afplay "/System/Library/Sounds/Hero.aiff"');
            }
        } catch (e) {}
    }

    public playAlarmSound() {
        const ctx = this.initAudio();
        try {
            const now = ctx.currentTime;
            const triggerNote = (freq: number, start: number) => {
                const osc = ctx.createOscillator(), gain = ctx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.2, start + 0.005); gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
                osc.connect(gain); gain.connect(ctx.destination); osc.start(start); osc.stop(start + 0.85);
            };
            triggerNote(523.25, now); triggerNote(659.25, now + 0.05); triggerNote(783.99, now + 0.10); triggerNote(1046.50, now + 0.15);
        } catch (e) {}
    }

    public playMechClack() {
        const ctx = this.initAudio();
        try {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(1200, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.35, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.04);
            const lowOsc = ctx.createOscillator(), lowGain = ctx.createGain();
            lowOsc.type = 'triangle'; lowOsc.frequency.setValueAtTime(150, ctx.currentTime); lowOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
            lowGain.gain.setValueAtTime(0.25, ctx.currentTime); lowGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            lowOsc.connect(lowGain); lowGain.connect(ctx.destination); lowOsc.start(); lowOsc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }

    public playSwordSlash() {
        const ctx = this.initAudio();
        try {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.type = "triangle"; osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain); gain.connect(ctx.destination); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }

    public playShieldBash() {
        const ctx = this.initAudio();
        try {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.type = "sawtooth"; osc.frequency.setValueAtTime(220, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.4, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.connect(gain); gain.connect(ctx.destination); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.31);
        } catch (e) {}
    }

    public playVictoryChime() { this.playAlarmSound(); }
}