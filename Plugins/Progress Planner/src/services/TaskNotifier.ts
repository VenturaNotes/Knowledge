import { App, MarkdownView, TFile } from "obsidian";
import { EditorView } from "@codemirror/view";
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

        // Request notification permissions
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

        // Reset notified tasks when the day rolls over
        if (this.lastCheckedDate !== todayStr) {
            this.notifiedKeys.clear();
            this.lastCheckedDate = todayStr;
        }

        const allItems: AgendaItem[] = this.plugin.taskCache.getAgendaItems();

        for (const item of allItems) {
            // Must have an explicit time and not already be completed
            if (!item.time || item.status !== " ") continue;

            const isToday = item.date === todayStr || this.isOccurringOn(item.rrule, now);
            if (!isToday) continue;

            if (Array.isArray(item.completeInstances) && item.completeInstances.includes(todayStr)) {
                continue;
            }

            const taskMoment = moment(`${todayStr} ${item.time}`, "YYYY-MM-DD h:mmA");
            if (!taskMoment.isValid()) continue;

            const diffMinutes = now.diff(taskMoment, "minutes", true);

            // 5-minute grace period
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

        // System notification only
        this.sendSystemNotification(title, message, item);
    }

    private sendSystemNotification(title: string, message: string, item: AgendaItem): void {
        const isMac = typeof process !== "undefined" && process.platform === "darwin";

        // Play macOS "Ping" sound in background
        if (isMac) {
            try {
                const req = (window as any).require;
                if (req) {
                    const cp = req("child_process");
                    if (cp) {
                        cp.exec("afplay /System/Library/Sounds/Ping.aiff");
                    }
                }
            } catch (e) {}
        }

        let sent = false;

        // Tier 1: Electron Native Notification (attributed to Obsidian)
        try {
            const req = (window as any).require;
            const electron = req ? req("electron") : null;
            const remote = electron ? (electron.remote || electron.main) : null;
            if (remote && remote.Notification && remote.Notification.isSupported()) {
                const notif = new remote.Notification({
                    title,
                    body: message,
                    silent: isMac
                });
                notif.on("click", () => {
                    this.bringObsidianToFront();
                    this.openTaskInEditor(item);
                });
                notif.show();
                sent = true;
            }
        } catch (e) {}

        // Tier 2: HTML5 Notification (attributed to Obsidian)
        if (!sent && "Notification" in window) {
            const showWebNotification = () => {
                const notif = new Notification(title, {
                    body: message,
                    silent: isMac
                });
                notif.onclick = () => {
                    this.bringObsidianToFront();
                    this.openTaskInEditor(item);
                };
            };

            if (Notification.permission === "granted") {
                showWebNotification();
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(perm => {
                    if (perm === "granted") showWebNotification();
                });
            }
        }
    }

    private bringObsidianToFront(): void {
        // Switch macOS Spaces and focus Obsidian
        try {
            const req = (window as any).require;
            if (req && process.platform === "darwin") {
                const cp = req("child_process");
                if (cp) {
                    cp.exec('osascript -e "tell application \\"Obsidian\\" to activate"');
                }
            }
        } catch (e) {}

        // Restore window if minimized and bring to front
        try {
            const req = (window as any).require;
            const electron = req ? req("electron") : null;
            const remote = electron ? (electron.remote || electron.main) : null;
            const win = remote ? remote.getCurrentWindow() : null;
            if (win) {
                if (win.isMinimized()) win.restore();
                win.focus();
            }
        } catch (e) {}

        window.focus();
    }

    private async openTaskInEditor(item: AgendaItem): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(item.path);
        if (!file || !(file instanceof TFile)) return;

        // 1. Open in a new tab in the active pane
        const leaf = this.app.workspace.getLeaf("tab");
        await leaf.openFile(file);
        this.app.workspace.setActiveLeaf(leaf, { focus: true });

        // 2. Wait 120ms for setActiveLeaf side-effects and split-pane layout to settle
        window.setTimeout(() => {
            const view = leaf.view instanceof MarkdownView 
                ? leaf.view 
                : this.app.workspace.getActiveViewOfType(MarkdownView);
            
            if (!view || !view.editor) return;
            const editor = view.editor;

            // Resolve target line (dynamic scan fallback)
            let targetLine = item.line;
            if (targetLine < 0 || targetLine >= editor.lineCount() || !editor.getLine(targetLine).includes(item.text)) {
                for (let i = 0; i < editor.lineCount(); i++) {
                    const lineStr = editor.getLine(i);
                    if (lineStr.includes(item.text) && (item.time ? lineStr.includes(item.time) : true)) {
                        targetLine = i;
                        break;
                    }
                }
            }

            const lineContent = editor.getLine(targetLine) ?? "";
            const lineLength = lineContent.length;
            const startOffset = editor.posToOffset({ line: targetLine, ch: 0 });

            // 3. Highlight line selection (ScopedSearch pattern)
            editor.setCursor({ line: targetLine, ch: 0 });
            editor.setSelection(
                { line: targetLine, ch: 0 },
                { line: targetLine, ch: lineLength }
            );

            const cm = (editor as any).cm as EditorView | undefined;
            if (cm) {
                // Focus CodeMirror WITHOUT triggering the browser's default focus-scroll
                if (cm.contentDOM) {
                    cm.contentDOM.focus({ preventScroll: true });
                }

                // CodeMirror 6 center-scroll effect
                cm.dispatch({
                    selection: { anchor: startOffset, head: startOffset + lineLength },
                    effects: EditorView.scrollIntoView(startOffset, { y: "center" })
                });

                // Directly calculate the exact centered scrollTop on the pane's scroller
                try {
                    const block = cm.lineBlockAt(startOffset);
                    const paneHeight = cm.scrollDOM.clientHeight;
                    if (block && paneHeight > 0) {
                        const targetTop = Math.max(0, block.top - (paneHeight / 2) + (block.height / 2));
                        cm.scrollDOM.scrollTop = targetTop;
                    }
                } catch (e) {}

                cm.requestMeasure();
            } else {
                editor.scrollIntoView(
                    { from: { line: targetLine, ch: 0 }, to: { line: targetLine, ch: lineLength } },
                    true
                );
            }
        }, 120);
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