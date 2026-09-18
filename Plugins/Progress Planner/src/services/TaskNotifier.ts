import { App, ItemView, Notice, TFile } from "obsidian";
import ProgressPlannerPlugin from "../main";
import { AgendaItem } from "../types";

export class TaskNotifier {
    private plugin: ProgressPlannerPlugin;
    private app: App;
    private intervalId: number | null = null;
    private notifiedKeys: Set<string> = new Set();
    private lastCheckedDate: string = "";

    constructor(plugin: ProgressPlannerPlugin) {
        this.plugin = plugin;
        this.app = plugin.app;
    }

    public start(): void {
        if (this.intervalId !== null) return;

        // Request Web Notification permission if necessary
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        // Check every 15 seconds
        this.intervalId = window.setInterval(() => {
            this.checkScheduledTasks();
        }, 15000);

        // Run an immediate check on startup
        this.checkScheduledTasks();
    }

    public stop(): void {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private checkScheduledTasks(): void {
        if (this.plugin.settings.enableTimeNotifications === false) return;

        const moment = (window as any).moment;
        const now = moment();
        const todayStr = now.format("YYYY-MM-DD");

        // Reset notified tasks set when the day changes to keep memory clean
        if (this.lastCheckedDate !== todayStr) {
            this.notifiedKeys.clear();
            this.lastCheckedDate = todayStr;
        }

        const allItems: AgendaItem[] = this.plugin.taskCache.getAgendaItems();

        for (const item of allItems) {
            // Must have an explicit time and not already be marked completed
            if (!item.time || item.status !== " ") continue;

            const isToday = item.date === todayStr || this.isOccurringOn(item.rrule, now);
            if (!isToday) continue;

            // Check if specific instance was completed (for recurring tasks)
            if (Array.isArray(item.completeInstances) && item.completeInstances.includes(todayStr)) {
                continue;
            }

            // Parse full scheduled moment (e.g., "2026-09-18 3:45PM")
            const taskMoment = moment(`${todayStr} ${item.time}`, "YYYY-MM-DD h:mmA");
            if (!taskMoment.isValid()) continue;

            // Calculate difference in minutes from current time
            const diffMinutes = now.diff(taskMoment, "minutes", true);

            // Trigger window: Scheduled time has arrived (>= 0 min) and is within the last 5 minutes
            const isDueNow = diffMinutes >= 0 && diffMinutes < 5;

            const taskKey = `${item.path}::${item.line}::${todayStr}::${item.time}`;

            if (isDueNow && !this.notifiedKeys.has(taskKey)) {
                this.notifiedKeys.add(taskKey);
                this.notifyTask(item);
            }
        }
    }

    private notifyTask(item: AgendaItem): void {
        const title = "⏰ Task Reminder";
        const message = `${item.text} (${item.time})`;

        // 1. In-app Notice
        new Notice(`⏰ ${item.text}`, 7000);

        // 2. System-level notification
        this.sendSystemNotification(title, message, item);
    }

    private sendSystemNotification(title: string, message: string, item: AgendaItem): void {
        let sent = false;

        // Tier 1: AppleScript notification with Ping sound (macOS across all Spaces)
        try {
            const req = (window as any).require;
            if (req) {
                const cp = req("child_process");
                if (cp && process.platform === "darwin") {
                    const script = `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)} sound name "Ping"`;
                    cp.exec(`osascript -e ${JSON.stringify(script)}`);
                    sent = true;
                }
            }
        } catch (e) {}

        // Tier 2: Electron Native Notification (supports click-to-open)
        if (!sent) {
            try {
                const req = (window as any).require;
                const electron = req ? req("electron") : null;
                const remote = electron ? (electron.remote || electron.main) : null;
                if (remote && remote.Notification && remote.Notification.isSupported()) {
                    const notif = new remote.Notification({ title, body: message, silent: false });
                    notif.on("click", () => {
                        this.openTaskInEditor(item);
                    });
                    notif.show();
                    sent = true;
                }
            } catch (e) {}
        }

        // Tier 3: HTML5 Web Notification fallback
        if (!sent && "Notification" in window && Notification.permission === "granted") {
            try {
                const notif = new Notification(title, { body: message });
                notif.onclick = () => {
                    window.focus();
                    this.openTaskInEditor(item);
                };
            } catch (e) {}
        }
    }

    private openTaskInEditor(item: AgendaItem): void {
        const file = this.app.vault.getAbstractFileByPath(item.path);
        if (!file || !(file instanceof TFile)) return;

        this.app.workspace.getLeaf(false).openFile(file).then(() => {
            const view = this.app.workspace.getActiveViewOfType(ItemView);
            const ed = (view as any)?.editor;
            if (ed && item.line >= 0) {
                ed.setCursor({ line: item.line, ch: 0 });
                ed.scrollIntoView({ from: { line: item.line, ch: 0 }, to: { line: item.line, ch: 0 } }, true);
            }
        });
    }

    private isOccurringOn(rrule: string | null, dateMoment: any): boolean {
        if (!rrule) return false;

        const dtstartMatch = rrule.match(/DTSTART:(\d{8})/);
        if (dtstartMatch && dtstartMatch[1]) {
            const dtstart = (window as any).moment(dtstartMatch[1], "YYYYMMDD");
            if (dateMoment.isBefore(dtstart, "day")) return false;
        }

        if (rrule.includes("FREQ=YEARLY")) {
            const monthMatch = rrule.match(/BYMONTH=(\d+)/);
            const dayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
            if (monthMatch && dayMatch && monthMatch[1] && dayMatch[1]) {
                return dateMoment.month() + 1 === parseInt(monthMatch[1]) && dateMoment.date() === parseInt(dayMatch[1]);
            }
        }
        if (rrule.includes("FREQ=MONTHLY")) {
            const dayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
            if (dayMatch && dayMatch[1]) {
                return dateMoment.date() === parseInt(dayMatch[1]);
            }
        }
        if (rrule.includes("FREQ=WEEKLY")) {
            const dayMap: { [key: string]: number } = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
            const targetDayMatch = rrule.match(/BYDAY=([A-Z,]+)/);
            if (targetDayMatch && targetDayMatch[1]) {
                return targetDayMatch[1].split(",").some(d => dayMap[d] === dateMoment.day());
            }
        }
        return false;
    }
}