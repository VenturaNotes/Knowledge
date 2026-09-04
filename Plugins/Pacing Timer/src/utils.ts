import { App } from 'obsidian';

export const formatPacingTime = (seconds: number): string => {
    const neg = seconds < 0;
    const abs_s = Math.abs(seconds);
    const h = Math.floor(abs_s / 3600);
    const m = Math.floor((abs_s % 3600) / 60);

    if (h > 0) {
        const mStr = m < 10 ? `0${m}m` : `${m}m`;
        return `${neg ? "-" : ""}${h}h${mStr}`;
    }

    const mins = Math.floor(abs_s / 60);
    const secs = abs_s % 60;
    return `${neg ? "-" : ""}${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimeHMS = (totalSeconds: number): string => {
    const neg = totalSeconds < 0;
    const abs_s = Math.abs(totalSeconds);
    const h = Math.floor(abs_s / 3600);
    const m = Math.floor((abs_s % 3600) / 60);
    const s = abs_s % 60;
    return `${neg ? "-" : ""}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const formatTime = (seconds: number): string => {
    const neg = seconds < 0;
    const abs_s = Math.abs(seconds);
    const mins = Math.floor(abs_s / 60);
    const secs = abs_s % 60;
    return `${neg ? "-" : ""}${mins.toString()}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimeAllowNeg = (seconds: number): string => {
    const neg = seconds < 0;
    const abs_s = Math.abs(seconds);
    const mins = Math.floor(abs_s / 60);
    const secs = abs_s % 60;
    return `${neg ? "-" : ""}${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDelta = (seconds: number): string => {
    const neg = seconds < 0;
    const abs_s = Math.abs(seconds);
    const mins = Math.floor(abs_s / 60);
    const secs = abs_s % 60;
    if (mins > 0) return `${neg ? "-" : ""}${mins}:${secs.toString().padStart(2, '0')}`;
    return `${neg ? "-" : ""}${secs}`;
};

export const formatHumanReadableDuration = (totalSeconds: number): string => {
    if (!totalSeconds || totalSeconds <= 0) return "0s";
    const abs_s = Math.abs(totalSeconds);
    const h = Math.floor(abs_s / 3600);
    const m = Math.floor((abs_s % 3600) / 60);
    const s = abs_s % 60;

    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0) parts.push(`${s}s`);

    return parts.length > 0 ? parts.join(" ") : "0s";
};

export const formatCategoryDurations = (durations?: number[], fallback?: number): string => {
    if (durations && durations.length > 1) {
        return durations.map(d => formatHumanReadableDuration(d)).join(", ");
    }
    return formatHumanReadableDuration((durations && durations[0]) || fallback || 900);
};

export const getFinishedTimeStr = (anchorTime: number, secondsRemaining: number): string => {
    const targetDate = new Date(anchorTime + secondsRemaining * 1000);
    let hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
};

export const getCurrentTimeStr = (): string => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const findPluginHotkeys = (app: App, pluginId: string, cmdId: string): any[] => {
    const hotkeys: any[] = [];
    const fullCmdId = `${pluginId}:${cmdId}`;
    const hotkeyManager = (app as any).hotkeyManager;
    if (!hotkeyManager) return hotkeys;
    
    let custom = hotkeyManager.customKeys?.[fullCmdId];
    if (custom && custom.length > 0) hotkeys.push(...custom);
    else {
        let defaultKeys = hotkeyManager.defaultKeys?.[fullCmdId];
        if (defaultKeys && defaultKeys.length > 0) hotkeys.push(...defaultKeys);
    }
    return hotkeys;
};

export const mapKey = (key: string, modifiers: string[] = []): string => {
    if (!key) return key;
    if (key.length === 1) {
        const hasShift = modifiers.some(m => m.toLowerCase() === "shift");
        return hasShift ? key.toUpperCase() : key.toLowerCase();
    }
    return key;
};

export const parseDurationToSeconds = (input: string): number => {
    if (!input) return 0;
    const str = input.trim().toLowerCase();
    
    if (/^\d+(?::\d+){1,2}$/.test(str)) {
        const parts = str.split(':').map(Number);
        if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined) {
            return parts[0] * 60 + parts[1];
        }
        if (parts.length === 3 && parts[0] !== undefined && parts[1] !== undefined && parts[2] !== undefined) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
    }

    const hrMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)/);
    const minMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)/);
    const secMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)/);

    let totalSeconds = 0, matchedAny = false;
    if (hrMatch && hrMatch[1]) { totalSeconds += parseFloat(hrMatch[1]) * 3600; matchedAny = true; }
    if (minMatch && minMatch[1]) { totalSeconds += parseFloat(minMatch[1]) * 60; matchedAny = true; }
    if (secMatch && secMatch[1]) { totalSeconds += parseFloat(secMatch[1]); matchedAny = true; }

    if (matchedAny) return Math.round(totalSeconds);
    const fallback = parseFloat(str);
    return !isNaN(fallback) ? Math.round(fallback) : 0;
};

export const parseCategoryDurations = (input: string): { durations: number[], fallback: number } => {
    if (!input) return { durations: [900], fallback: 900 };
    const parts = input.split(",").map(p => parseDurationToSeconds(p)).filter(n => n > 0);
    if (parts.length === 0) return { durations: [900], fallback: 900 };
    return {
        durations: parts,
        fallback: parts[0] || 900
    };
};