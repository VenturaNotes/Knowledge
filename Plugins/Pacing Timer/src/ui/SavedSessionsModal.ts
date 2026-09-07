import { App, Modal } from 'obsidian';
import PacingTimerPlugin from '../main';
import { formatPacingTime } from '../utils';
import { PacingSessionState } from '../types';

export class SavedSessionsModal extends Modal {
    plugin: PacingTimerPlugin;

    constructor(app: App, plugin: PacingTimerPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        this.render();
    }

    render() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h3", { text: "📂 Saved Sessions" });

        const sessions = Object.values(this.plugin.settings.savedSessions || {})
            .sort((a, b) => b.savedAt - a.savedAt);

        if (sessions.length === 0) {
            contentEl.createEl("p", {
                text: "No saved sessions found. Use the 'Save Current Session As...' command while working to save your session.",
                attr: { style: "color: var(--text-muted); font-size: 0.9em;" }
            });
            return;
        }

        const listContainer = contentEl.createDiv({ cls: "pacing-saved-sessions-list" });
        Object.assign(listContainer.style, {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "380px",
            overflowY: "auto",
            paddingRight: "4px"
        });

        sessions.forEach(item => {
            const card = listContainer.createDiv();
            Object.assign(card.style, {
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--background-secondary)",
                border: "1px solid var(--background-modifier-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px"
            });

            const info = card.createDiv();
            info.style.flexGrow = "1";

            const titleRow = info.createDiv();
            titleRow.createEl("span", {
                text: item.name,
                attr: { style: "font-weight: 600; font-size: 1em; color: var(--text-normal);" }
            });

            const meta = info.createDiv();
            Object.assign(meta.style, { fontSize: "0.82em", color: "var(--text-muted)", marginTop: "3px" });

            const s = item.session;
            const modeLabel = s.mode.toUpperCase();
            const dateStr = new Date(item.savedAt).toLocaleDateString(undefined, {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            });

            let progressStr = "";
            if (s.mode === "segmented") {
                const quota = s.currentQuota || s.totalSegments;
                const maxGoal = s.maxTargetSegments || s.totalSegments;
                progressStr = ` • ${s.completedSegments}/${quota} tasks [Max: ${maxGoal}] • Elapsed: ${formatPacingTime(s.globalTimeElapsed)}`;
            } else {
                progressStr = ` • Completed: ${s.completedSegments} • Elapsed: ${formatPacingTime(s.globalTimeElapsed)}`;
            }

            meta.textContent = `${modeLabel} • Saved ${dateStr}${progressStr}`;

            const btnGroup = card.createDiv();
            btnGroup.style.display = "flex";
            btnGroup.style.gap = "6px";

            const resumeBtn = btnGroup.createEl("button", {
                text: "▶ Resume",
                cls: "mod-cta",
                attr: { style: "font-size: 0.82em; padding: 4px 10px; cursor: pointer;" }
            });
            resumeBtn.onclick = async () => {
                await this.resume(item.session, item.name);
            };

            const delBtn = btnGroup.createEl("button", {
                text: "✕",
                attr: {
                    title: "Delete Saved Session",
                    style: "font-size: 0.85em; padding: 4px 8px; cursor: pointer; background: transparent; border: 1px solid var(--background-modifier-border); color: var(--text-muted);"
                }
            });
            delBtn.onclick = async () => {
                if (this.plugin.settings.savedSessions) {
                    delete this.plugin.settings.savedSessions[item.id];
                    await this.plugin.saveSettings();
                    this.render();
                }
            };
        });
    }

    async resume(savedSession: PacingSessionState, name: string) {
        this.plugin.stopSession();

        const sessionToResume: PacingSessionState = JSON.parse(JSON.stringify(savedSession));
        sessionToResume.isRunning = true;
        sessionToResume.lastTickTime = Date.now();

        this.plugin.session = sessionToResume;
        this.plugin.updateStatusBar();
        this.plugin.startInterval();
        await this.plugin.saveSettings();
        this.plugin.showOverlay(`📂 Resumed: "${name}"`, true);
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}