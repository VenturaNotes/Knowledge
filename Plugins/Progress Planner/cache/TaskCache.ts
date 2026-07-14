import { App, TFile } from "obsidian";
import { TaskNode, AgendaItem, ProgressPlannerSettings } from "../types";

export class TaskCache {
    private app: App;
    private settings: ProgressPlannerSettings;
    
    private fileCache: Map<string, {
        dashboardNode: TaskNode | null;
        agendaItems: AgendaItem[];
    }> = new Map();

    constructor(app: App, settings: ProgressPlannerSettings) {
        this.app = app;
        this.settings = settings;
    }

    public updateSettings(settings: ProgressPlannerSettings) {
        this.settings = settings;
    }

    async initialize() {
        const files = this.app.vault.getMarkdownFiles();
        for (const file of files) {
            await this.updateFile(file);
        }
    }

    async updateFile(file: TFile) {
        const skipPaths = this.settings.skipPaths;
        const targetFolders = this.settings.targetFolders;

        if (skipPaths.some(p => file.path.includes(p))) {
            this.fileCache.delete(file.path);
            return;
        }

        // Only scan if targetFolders list is empty, or the file matches any targeted path prefix
        const isInTargetFolder = targetFolders.length === 0 || targetFolders.some(folder => file.path.startsWith(folder));
        
        if (!isInTargetFolder) {
            this.fileCache.delete(file.path);
            return;
        }

        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache) {
            this.fileCache.delete(file.path);
            return;
        }

        const fm = cache.frontmatter || {};
        const cacheTags = (cache.tags || []).map(t => t.tag.toLowerCase());
        const fmTags = (Array.isArray(fm.tags) ? fm.tags : [fm.tags]).map(t => String(t || "").toLowerCase());
        const combinedTags = [...new Set([...cacheTags, ...fmTags])];

        const isTask = combinedTags.some(t => t.includes("task"));
        const isGoal = combinedTags.some(t => t.includes("goal"));

        let dashboardNode: TaskNode | null = null;
        const agendaItems: AgendaItem[] = [];

        // --- 1. Dashboard Cache Processing ---
        const statusStr = String(fm.status || "").toLowerCase();
        const hasValidStatus = !["done", "canceled"].includes(statusStr);

        if ((isTask || isGoal) && hasValidStatus) {
            const rawParent = fm.parent || [];
            const parentNames = (Array.isArray(rawParent) ? rawParent : [rawParent])
                .map(p => {
                    const parts = String(p).replace(/[\[\]]/g, "").split("|");
                    const basePart = parts[0];
                    return basePart ? basePart.trim() : "";
                })
                .filter(p => p.length > 0);

            dashboardNode = {
                id: file.path,
                file: file,
                basename: file.basename,
                title: fm.title || file.basename,
                isGoal: isGoal,
                isTask: isTask,
                parentNames: parentNames,
                children: [],
                parents: [],
                level: 0,
                status: statusStr
            };
        }

        // --- 2. Agenda Cache Processing ---
        const parseTime = (tStr: string | null) => {
            if (!tStr) return "";
            const m = (window as any).moment(tStr, ["HH:mm", "HH:mm:ss", "h:mmA", "h:mm A", "hh:mm a", "H:mm"]);
            return m.isValid() ? m.format("h:mmA") : "";
        };

        const cleanText = (t: string) => t
            .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
            .replace(/⏰\s*\d{1,2}:\d{2}(?:\s?[APMapm]{2})?/g, "")
            .replace(/✅\s*\d{4}-\d{2}-\d{2}/g, "")
            .replace(/(?:^|\s)(#[^\s#]+)/g, "")
            .replace(/\s+/g, " ")
            .trim();

        const projectTags = fmTags
            .filter(t => String(t).toLowerCase() !== "task" && t.length > 0)
            .map(t => String(t).startsWith('#') ? t : '#' + t)
            .join(" ");

        const fileDateRaw = fm.scheduled || fm.due || fm.date;
        const fileDate = fileDateRaw ? (window as any).moment(fileDateRaw).format("YYYY-MM-DD") : null;
        
        let fileTimeStr = fm.time || "";
        if (!fileTimeStr && typeof fileDateRaw === "string" && fileDateRaw.includes("T")) {
            fileTimeStr = fileDateRaw.split("T")[1];
        }

        const rrule = fm.recurrence || fm.RRULE || null;
        const isFileDone = ["done", "canceled"].includes(String(fm.status || "").toLowerCase());

        const rawCompleteInstances = fm.complete_instances;
        const completeInstances = Array.isArray(rawCompleteInstances)
            ? rawCompleteInstances.map(d => {
                const m = (window as any).moment(d);
                return m.isValid() ? m.format("YYYY-MM-DD") : null;
              }).filter((d): d is string => d !== null)
            : [];

        agendaItems.push({
            text: cleanText(fm.title || file.basename),
            status: isFileDone ? "x" : " ",
            date: fileDate,
            rrule: rrule,
            time: parseTime(fileTimeStr),
            tags: projectTags,
            line: 0,
            isProject: true,
            file: file.basename,
            path: file.path,
            completeInstances: completeInstances
        });

        const content = await this.app.vault.cachedRead(file);
        const lines = content.split("\n");

        lines.forEach((l, i) => {
            const m = l.match(/- \[(.)\] (.*)/);
            if (m) {
                const statusVal = m[1] || " ";
                const textVal = m[2] || "";

                const dM = textVal.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
                if (!dM) return;

                const dateStr = dM[1];
                if (!dateStr) return;

                const inlineTagsMatch = textVal.match(/(?:^|\s)(#[^\s#]+)/g);
                const inlineTags = inlineTagsMatch
                    ? inlineTagsMatch.map(t => t.trim()).filter(t => t.toLowerCase() !== "#task").join(" ")
                    : "";

                const tM = textVal.match(/⏰\s*(\d{1,2}:\d{2}(?:\s?[APMapm]{2})?)/);
                const parsedTimeVal = tM ? (tM[1] || null) : null;

                agendaItems.push({
                    text: cleanText(textVal),
                    status: statusVal,
                    date: dateStr,
                    rrule: null,
                    time: parseTime(parsedTimeVal),
                    tags: inlineTags,
                    line: i,
                    isProject: false,
                    file: file.basename,
                    path: file.path,
                    completeInstances: []
                });
            }
        });

        this.fileCache.set(file.path, { dashboardNode, agendaItems });
    }

    removeFile(path: string) {
        this.fileCache.delete(path);
    }

    getDashboardTasks(): TaskNode[] {
        const allNodes: TaskNode[] = [];
        const titleToNode = new Map<string, TaskNode>();

        for (const [_, data] of this.fileCache.entries()) {
            if (data.dashboardNode) {
                const nodeClone: TaskNode = {
                    ...data.dashboardNode,
                    children: [],
                    parents: []
                };
                allNodes.push(nodeClone);
                titleToNode.set(nodeClone.title.toLowerCase().trim(), nodeClone);
                titleToNode.set(nodeClone.basename.toLowerCase().trim(), nodeClone);
            }
        }

        allNodes.forEach(node => {
            node.parentNames.forEach(pName => {
                const parentObj = titleToNode.get(pName.toLowerCase());
                if (parentObj) {
                    if (!parentObj.children.includes(node)) parentObj.children.push(node);
                    if (!node.parents.includes(parentObj)) node.parents.push(parentObj);
                }
            });
        });

        let changed = true;
        while (changed) {
            changed = false;
            allNodes.forEach(node => {
                let maxParentLevel = -1;
                node.parents.forEach(p => { if (p.level > maxParentLevel) maxParentLevel = p.level; });
                if (maxParentLevel + 1 > node.level) {
                    node.level = maxParentLevel + 1;
                    changed = true;
                }
            });
        }

        return allNodes;
    }

    getAgendaItems(): AgendaItem[] {
        const allItems: AgendaItem[] = [];
        for (const [_, data] of this.fileCache.entries()) {
            allItems.push(...data.agendaItems);
        }
        return allItems;
    }
}