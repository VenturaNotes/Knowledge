import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import ProgressPlannerPlugin from "../main";
import { AgendaItem } from "../types";

export const VIEW_TYPE_AGENDA = "v7-agenda-view";
const MAX_ITEMS_PER_DAY = 3;

export class AgendaView extends ItemView {
    private plugin: ProgressPlannerPlugin;
    private currentMoment: any;
    private selectedDateItems: AgendaItem[] | null = null;
    private selectedDateLabel = "";

    // Live Overdue Panel States
    private overdueQuery = "";
    private overdueSort = "date-desc"; // Newest to oldest default

    constructor(leaf: WorkspaceLeaf, plugin: ProgressPlannerPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.currentMoment = (window as any).moment().startOf('month');
    }

    getViewType(): string {
        return VIEW_TYPE_AGENDA;
    }

    getDisplayText(): string {
        return "Agenda Calendar";
    }

    async onOpen() {
        this.contentEl.style.padding = "0";
        this.contentEl.style.height = "100%";
        this.contentEl.style.overflow = "hidden";
        this.render();
    }

    async onClose() {}

    private isOccurringOn(rrule: string | null, dateMoment: any): boolean {
        if (!rrule) return false;

        const dtstartMatch = rrule.match(/DTSTART:(\d{8})/);
        if (dtstartMatch && dtstartMatch[1]) {
            const dtstart = (window as any).moment(dtstartMatch[1], "YYYYMMDD");
            if (dateMoment.isBefore(dtstart, 'day')) {
                return false;
            }
        }

        if (rrule.includes("FREQ=YEARLY")) {
            const monthMatch = rrule.match(/BYMONTH=(\d+)/);
            const dayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
            if (monthMatch && dayMatch && monthMatch[1] && dayMatch[1]) {
                return (dateMoment.month() + 1 === parseInt(monthMatch[1]) && dateMoment.date() === parseInt(dayMatch[1]));
            }
        }
        if (rrule.includes("FREQ=MONTHLY")) {
            const dayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
            if (dayMatch && dayMatch[1]) {
                return (dateMoment.date() === parseInt(dayMatch[1]));
            }
        }
        if (rrule.includes("FREQ=WEEKLY")) {
            const dayMap: { [key: string]: number } = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
            const targetDayMatch = rrule.match(/BYDAY=([A-Z,]+)/);
            if (targetDayMatch && targetDayMatch[1]) {
                return targetDayMatch[1].split(',').some(d => dayMap[d] === dateMoment.day());
            }
        }
        return false;
    }

    private createItemEl(item: AgendaItem, isPanel = false, showDueDetails = false): HTMLElement {
        const isDone = item.status !== " ";
        const el = document.createElement("div");
        el.className = (isPanel ? "v7-detail-card" : "v7-item") + (item.isProject ? " is-project" : "") + (isDone ? " is-done" : "");

        const timeDisplay = item.time || "";

        if (isPanel) {
            const tagsHtml = item.tags ? `<span class="v7-tag-span">${item.tags}</span>` : "";

            const parentLinkHtml = item.parentLink
                ? `<div class="v7-parent-link">🔗 ${item.parentLink}</div>`
                : "";

            let dueLabel = "";
            if (showDueDetails && item.date) {
                const formattedDate = (window as any).moment(item.date).format("MMM D, YYYY");
                dueLabel = `<div style="font-size:0.65rem; color:var(--text-error); margin-top:4px; font-weight:600;">
                                📅 Scheduled: ${formattedDate} ${item.time ? 'at ' + item.time : ''}
                            </div>`;
            }

            el.innerHTML = `<div style="font-size:0.7rem; color:var(--text-accent)">${timeDisplay} ${item.isProject ? '◈ PROJECT' : '○ TASK'}</div>
                            <div style="font-weight:bold">${isDone ? '✓ ' : ''}${item.text}</div>
                            ${parentLinkHtml}
                            ${dueLabel}
                            <div style="font-size:0.6rem; opacity:0.6; margin-top:5px; display:flex; align-items:center;">
                                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.file}</span>
                                ${tagsHtml}
                            </div>`;

            if (item.parentLink) {
                const linkEl = el.querySelector<HTMLElement>(".v7-parent-link");
                if (linkEl) {
                    linkEl.onclick = (e) => {
                        e.stopPropagation();
                        const linkPath = (item.parentLinkPath ?? item.parentLink ?? "").split("#")[0] ?? "";
                        const dest = this.app.metadataCache.getFirstLinkpathDest(linkPath, item.path);
                        if (dest) this.app.workspace.getLeaf(false).openFile(dest);
                    };
                }
            }
        } else {
            el.innerHTML = `<span>${isDone ? '✓ ' : ''}${timeDisplay} ${item.text}</span>`;
        }

        el.onclick = (e) => {
            e.stopPropagation();
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
        };
        return el;
    }

    private renderPanel(pContent: HTMLElement) {
        pContent.empty();
        if (!this.selectedDateItems) return;

        const isOverdueView = this.selectedDateLabel === "🚨 Overdue Tasks";

        if (isOverdueView) {
            // Render Query Box
            const searchContainer = pContent.createDiv();
            searchContainer.setAttribute("style", "padding: 0 0 10px 0; background: transparent;");
            const searchInput = searchContainer.createEl("input", { cls: "tq-small-input", placeholder: "Search overdue..." });
            searchInput.value = this.overdueQuery;

            // Render Sort Trigger Select Option
            const sortContainer = pContent.createDiv();
            sortContainer.setAttribute("style", "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.75rem; opacity: 0.8;");
            sortContainer.createSpan({ text: "Sort by:" });
            const sortSelect = sortContainer.createEl("select", { cls: "v7-select" });
            
            const o1 = sortSelect.createEl("option", { value: "date-desc", text: "Due Date (Newest First)" });
            const o2 = sortSelect.createEl("option", { value: "date-asc", text: "Due Date (Oldest First)" });
            const o3 = sortSelect.createEl("option", { value: "name-asc", text: "Name (A-Z)" });

            o1.selected = this.overdueSort === "date-desc";
            o2.selected = this.overdueSort === "date-asc";
            o3.selected = this.overdueSort === "name-asc";

            const listContainer = pContent.createDiv();
            listContainer.setAttribute("style", "display: flex; flex-direction: column; gap: 10px;");

            const updateList = () => {
                this.overdueQuery = searchInput.value;
                this.overdueSort = sortSelect.value;
                listContainer.empty();

                let items = [...(this.selectedDateItems || [])];

                if (this.overdueQuery) {
                    const q = this.overdueQuery.toLowerCase();
                    items = items.filter(i => i.text.toLowerCase().includes(q) || i.file.toLowerCase().includes(q));
                }

                items.sort((a, b) => {
                    if (this.overdueSort === "name-asc") {
                        return a.text.localeCompare(b.text);
                    }
                    
                    const dA = a.date || "0000-00-00";
                    const dB = b.date || "0000-00-00";

                    if (this.overdueSort === "date-desc") {
                        if (dA !== dB) return dB.localeCompare(dA);
                        return (b.time || "").localeCompare(a.time || "");
                    } else {
                        if (dA !== dB) return dA.localeCompare(dB);
                        return (a.time || "").localeCompare(b.time || "");
                    }
                });

                if (items.length === 0) {
                    const emptyEl = listContainer.createDiv({ text: "No matching overdue tasks." });
                    emptyEl.setAttribute("style", "opacity: 0.5; font-size: 0.8rem;");
                } else {
                    items.forEach(i => {
                        listContainer.appendChild(this.createItemEl(i, true, true));
                    });
                }
            };

            searchInput.oninput = updateList;
            sortSelect.onchange = updateList;
            updateList();

        } else {
            // Re-render date-day lists separated by schedule groups
            if (this.selectedDateItems.length === 0) {
                const noTasksEl = pContent.createDiv({ text: "No tasks for this day." });
                noTasksEl.setAttribute("style", "opacity:0.5");
            } else {
                const untimedItems = this.selectedDateItems.filter(i => !i.time);
                const timedItems = this.selectedDateItems.filter(i => i.time);

                untimedItems.forEach(i => pContent.appendChild(this.createItemEl(i, true)));

                if (untimedItems.length > 0 && timedItems.length > 0) {
                    pContent.createDiv({ cls: "v7-panel-divider", text: "Scheduled" });
                }

                timedItems.forEach(i => pContent.appendChild(this.createItemEl(i, true)));
            }
        }
    }

    public async render() {
        const container = this.contentEl;
        container.empty();

        const allData = this.plugin.taskCache.getAgendaItems();
        const root = container.createDiv("v7-root");
        const main = root.createDiv("v7-main");

        const nav = main.createDiv("v7-nav");
        const leftNav = nav.createDiv();
        const prevBtn = leftNav.createEl("button", { cls: "v7-btn", text: "＜" });
        const nextBtn = leftNav.createEl("button", { cls: "v7-btn", text: "＞" });

        const monthTitle = nav.createDiv({ cls: "v7-month-title", text: this.currentMoment.format("MMMM YYYY") });

        monthTitle.onclick = () => {
            monthTitle.onclick = null;
            monthTitle.empty();

            const monthSelect = monthTitle.createEl("select", { cls: "v7-select" });
            for (let i = 0; i < 12; i++) {
                const opt = monthSelect.createEl("option", { value: String(i), text: (window as any).moment().month(i).format("MMMM") });
                if (i === this.currentMoment.month()) opt.selected = true;
            }

            const yearSelect = monthTitle.createEl("select", { cls: "v7-select" });
            const baseYear = (window as any).moment().year();
            const startYear = baseYear - 10;
            const endYear = baseYear + 10;
            for (let y = startYear; y <= endYear; y++) {
                const opt = yearSelect.createEl("option", { value: String(y), text: String(y) });
                if (y === this.currentMoment.year()) opt.selected = true;
            }

            const btnContainer = monthTitle.createSpan();
            btnContainer.setAttribute("style", "display: flex; gap: 4px; margin-left: 5px;");
            
            const okBtn = btnContainer.createEl("button", { cls: "v7-btn", text: "✓" });
            const cancelBtn = btnContainer.createEl("button", { cls: "v7-btn", text: "✕" });
            cancelBtn.setAttribute("style", "background: var(--background-modifier-border); color: var(--text-normal);");

            okBtn.onclick = (e) => {
                e.stopPropagation();
                this.currentMoment.date(1).month(parseInt(monthSelect.value)).year(parseInt(yearSelect.value));
                this.render();
            };

            cancelBtn.onclick = (e) => {
                e.stopPropagation();
                this.render();
            };

            monthSelect.onclick = (e) => e.stopPropagation();
            yearSelect.onclick = (e) => e.stopPropagation();
        };

        const todayStr = (window as any).moment().format("YYYY-MM-DD");
        const overdueItems = allData.filter(i => i.date && i.date < todayStr && i.status === " ");
        const overdueBtn = nav.createEl("button", { cls: "v7-btn v7-btn-warn", text: `🚨 Overdue: ${overdueItems.length}` });

        prevBtn.onclick = () => { this.currentMoment.subtract(1, 'month'); this.render(); };
        nextBtn.onclick = () => { this.currentMoment.add(1, 'month'); this.render(); };
        overdueBtn.onclick = () => {
            this.selectedDateItems = overdueItems;
            this.selectedDateLabel = "🚨 Overdue Tasks";
            this.render();
        };

        const grid = main.createDiv("v7-grid");
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(d => grid.createDiv({ cls: "v7-weekday", text: d }));

        const startOfGrid = this.currentMoment.clone().startOf('month').startOf('isoWeek');
        const endOfGrid = this.currentMoment.clone().endOf('month').endOf('isoWeek');

        const day = startOfGrid.clone();
        while (day.isBefore(endOfGrid) || day.isSame(endOfGrid, 'day')) {
            const dateStr = day.format("YYYY-MM-DD");
            const dayRef = day.clone();
            const isToday = day.isSame((window as any).moment(), 'day');
            const isOtherMonth = !day.isSame(this.currentMoment, 'month');

            const dayBox = grid.createDiv(`v7-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''}`);
            dayBox.createDiv({ cls: "v7-day-num", text: day.format("D") });

            const dayItems = allData.filter(i => i.date === dateStr || this.isOccurringOn(i.rrule, dayRef))
                .map(i => {
                    const isInstanceDone = Array.isArray(i.completeInstances) && i.completeInstances.includes(dateStr);
                    return {
                        ...i,
                        status: (i.status !== " " || isInstanceDone) ? "x" : " "
                    };
                })
                .sort((a, b) => {
                    if (!a.time) return 1;
                    if (!b.time) return -1;
                    return (window as any).moment(a.time, "h:mmA").diff((window as any).moment(b.time, "h:mmA"));
                });

            dayItems.slice(0, MAX_ITEMS_PER_DAY).forEach(i => dayBox.appendChild(this.createItemEl(i)));

            if (dayItems.length > MAX_ITEMS_PER_DAY) {
                dayBox.createDiv({ cls: "v7-more", text: `+ ${dayItems.length - MAX_ITEMS_PER_DAY} more` });
            }

            dayBox.onclick = () => {
                this.selectedDateItems = dayItems;
                this.selectedDateLabel = dayRef.format("MMMM D, YYYY");
                this.render();
            };

            day.add(1, 'day');
        }

        if (this.selectedDateItems) {
            const panel = root.createDiv("v7-panel");
            const pHead = panel.createDiv("v7-panel-header");
            pHead.createSpan({ text: this.selectedDateLabel });
            
            const closeBtn = pHead.createEl("button", { cls: "v7-btn", text: "✕" });
            closeBtn.setAttribute("style", "background:transparent; color:var(--text-muted)");
            closeBtn.onclick = () => { this.selectedDateItems = null; this.render(); };

            const pContent = panel.createDiv("v7-panel-content");
            this.renderPanel(pContent);
        }
    }
}