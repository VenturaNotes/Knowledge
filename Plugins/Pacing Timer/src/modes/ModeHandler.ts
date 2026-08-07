import { PacingSessionState, PacingTimerSettings } from "../types";
import PacingTimerPlugin from "../main";

export type ModeConfig = Record<string, any>;

export interface ModeHandler {
    id: string;
    displayName: string;

    // Modal UI & Setup
    buildSettings(container: HTMLElement, plugin: PacingTimerPlugin, config: ModeConfig, updatePreview: () => void): void;
    saveSettings?(config: ModeConfig, pluginSettings: PacingTimerSettings): void;
    createSessionState(config: ModeConfig, plugin?: PacingTimerPlugin): Partial<PacingSessionState>;

    // Engine Core
    tick(session: PacingSessionState, plugin: PacingTimerPlugin, deltaSeconds: number): void;
    onComplete(session: PacingSessionState, plugin: PacingTimerPlugin): void;
    renderStatusBar(session: PacingSessionState, plugin: PacingTimerPlugin, clockPrefix: string, pauseText: string, displayTitle: string): string;

    // Optional Mode-Specific Actions
    onInterrupt?: (session: PacingSessionState, plugin: PacingTimerPlugin) => void;
    onSkip?: (session: PacingSessionState, plugin: PacingTimerPlugin) => void;
    onSkipBack?: (session: PacingSessionState, plugin: PacingTimerPlugin) => void;
}