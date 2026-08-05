import { App, TFile, MarkdownView } from "obsidian";
import { TaskNode, CheckboxNode, GraphNode, GraphEdge, AgendaItem, ProgressPlannerSettings } from "../types";

export class TaskCache {
    private app: App;
    private settings: ProgressPlannerSettings;

    private fileCache: Map<string, {
        dashboardNode: TaskNode | null;
        agendaItems: AgendaItem[];
    }> = new Map();

    private checkboxNodesByFile: Map<string, CheckboxNode[]> = new Map();
    private edgesByFile: Map<string, GraphEdge[]> = new Map();

    constructor(app: App, settings: ProgressPlannerSettings) {
        this.app = app;
        this.settings = settings;
    }

    public updateSettings(settings: ProgressPlannerSettings) {
        this.settings = settings;
    }

    private parseImpact(tags: string[]): "" | "low" | "medium" | "high" {
        for (const t of tags) {
            const m = t.match(/^#?impact\/(low|medium|high)$/);
            if (m && m[1]) return m[1] as "low" | "medium" | "high";
        }
        return "";
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

        if (skipPaths.some((p: string) => file.path.includes(p))) {
            this.removeFile(file.path);
            return;
        }

        const isInTargetFolder = targetFolders.length === 0 || targetFolders.some((folder: string) => file.path.startsWith(folder));

        if (!isInTargetFolder) {
            this.removeFile(file.path);
            return;
        }

        let cache = this.app.metadataCache.getFileCache(file);
        
        let retries = 0;
        while (!cache && retries < 4) {
            await new Promise(r => setTimeout(r, 150));
            cache = this.app.metadataCache.getFileCache(file);
            retries++;
        }

        if (!cache) {
            this.removeFile(file.path);
            return;
        }

        const fm = cache.frontmatter || {};
        const cacheTags = (cache.tags || []).map((t: any) => t.tag.toLowerCase());
        
        let rawFmTags = fm.tags || fm.tag;
        if (typeof rawFmTags === 'string') {
            rawFmTags = rawFmTags.split(',').map((t: string) => t.trim());
        } else if (!Array.isArray(rawFmTags)) {
            rawFmTags = rawFmTags ? [rawFmTags] : [];
        }
        const fmTags: string[] = rawFmTags.map((t: any) => String(t || "").toLowerCase());
        
        const combinedTags = [...new Set([...cacheTags, ...fmTags])];

        const isTask = combinedTags.some(t => t.includes("task"));
        const isGoal = combinedTags.some(t => t.includes("goal"));

        let dashboardNode: TaskNode | null = null;
        const agendaItems: AgendaItem[] = [];

        const statusStr = String(fm.status || "").toLowerCase();
        const hasValidStatus = !["done", "canceled"].includes(statusStr);

        if ((isTask || isGoal) && hasValidStatus) {
            const rawParent = fm.parent || fm.parents || fm.Parent || fm.Parents || fm.up || fm.project || [];
            const rawParentArray = Array.isArray(rawParent) ? rawParent : [rawParent];

            const fmLinks = (cache.frontmatterLinks || []).map((l: any) => l.link);
            const combinedParentStrings = [...rawParentArray, ...fmLinks];

            const parentNames = [...new Set(
                combinedParentStrings
                    .map((p: any) => {
                        if (!p) return "";
                        const clean = String(p)
                            .replace(/[\[\]]/g, "")
                            .split("#")[0]
                            ?.split("|")[0]
                            ?.trim();
                        return clean || "";
                    })
                    .filter((p: string) => p.length > 0)
            )];

            dashboardNode = {
                id: file.path,
                kind: "file",
                file: file,
                basename: file.basename,
                title: fm.title ? String(fm.title) : file.basename,
                isGoal: isGoal,
                isTask: isTask,
                parentNames: parentNames,
                children: [],
                parents: [],
                level: 0,
                status: statusStr,
                impact: this.parseImpact(fmTags)
            };
        }

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
            .filter((t: string) => String(t).toLowerCase() !== "task" && t.length > 0)
            .map((t: string) => String(t).startsWith('#') ? t : '#' + t)
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
            ? rawCompleteInstances.map((d: any) => {
                const m = (window as any).moment(d);
                return m.isValid() ? m.format("YYYY-MM-DD") : null;
              }).filter((d: any): d is string => d !== null)
            : [];

        agendaItems.push({
            text: cleanText(fm.title ? String(fm.title) : file.basename),
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

        lines.forEach((l: string, i: number) => {
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
                    ? inlineTagsMatch.map((t: string) => t.trim()).filter((t: string) => t.toLowerCase() !== "#task").join(" ")
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

        const { nodes, byLine } = this.parseCheckboxNodes(file, lines, cache);
        this.checkboxNodesByFile.set(file.path, nodes);
        this.edgesByFile.set(file.path, this.resolveEdgesForFile(file, cache, byLine));
    }

    removeFile(path: string) {
        this.fileCache.delete(path);
        this.checkboxNodesByFile.delete(path);
        this.edgesByFile.delete(path);
    }

    private parseCheckboxNodes(file: TFile, lines: string[], cache: any): { nodes: CheckboxNode[]; byLine: Map<number, CheckboxNode> } {
        const listItems: any[] = cache?.listItems ?? [];
        const nodes: CheckboxNode[] = [];
        const byLine = new Map<number, CheckboxNode>();

        for (const item of listItems) {
            if (item.task === undefined) continue;
            const lineIdx = item.position.start.line;
            const rawLine = lines[lineIdx] ?? "";

            const anchorMatch = rawLine.match(/\^([a-zA-Z0-9-]+)\s*$/);
            const blockId = anchorMatch ? (anchorMatch[1] ?? "") : "";
            const id = blockId ? `${file.path}#^${blockId}` : `${file.path}::${lineIdx}`;

            const inlineTagsMatch = rawLine.match(/(?:^|\s)(#[^\s#]+)/g);
            const inlineTags = inlineTagsMatch ? inlineTagsMatch.map((t: string) => t.trim().toLowerCase()) : [];
            const impact = this.parseImpact(inlineTags);

            const title = rawLine
                .replace(/^\s*-\s*\[.\]\s*/, "")
                .replace(/\^[a-zA-Z0-9-]+\s*$/, "")
                .replace(/\[\[[^\]]+\]\]/g, "")
                .replace(/(?:^|\s)#impact\/(?:low|medium|high)\b/i, "")
                .trim();

            const node: CheckboxNode = {
                id,
                kind: "checkbox",
                title: title.length > 0 ? title : "(untitled subtask)",
                isGoal: false,
                isTask: true,
                children: [],
                parents: [],
                level: 0,
                status: item.task === " " ? "" : "done",
                impact,
                blockId,
                sourceFile: file,
                sourceLine: lineIdx
            };

            nodes.push(node);
            byLine.set(lineIdx, node);
        }

        return { nodes, byLine };
    }

    private resolveEdgesForFile(file: TFile, cache: any, byLine: Map<number, CheckboxNode>): GraphEdge[] {
        const links: any[] = cache?.links ?? [];
        const listItems: any[] = cache?.listItems ?? [];
        const edges: GraphEdge[] = [];

        const lineToItem = new Map<number, any>();
        listItems.forEach(item => {
            lineToItem.set(item.position.start.line, item);
        });

        for (const [lineIdx, childNode] of byLine.entries()) {
            let parentLine = lineToItem.get(lineIdx)?.parent;
            let foundParentCheckbox = false;

            while (parentLine !== undefined && parentLine >= 0) {
                if (byLine.has(parentLine)) {
                    edges.push({ parentId: byLine.get(parentLine)!.id, childId: childNode.id });
                    foundParentCheckbox = true;
                    break;
                }
                parentLine = lineToItem.get(parentLine)?.parent;
            }

            if (!foundParentCheckbox) {
                edges.push({ parentId: file.path, childId: childNode.id });
            }
        }

        for (const link of links) {
            const childNode = byLine.get(link.position.start.line);
            if (!childNode) continue;

            const [linkPath = "", anchor] = String(link.link).split("#^");
            if (!linkPath) continue;
            const targetPath = this.resolveLinkedFilePath(linkPath, file);
            if (!targetPath) continue;

            const parentId = anchor ? `${targetPath}#^${anchor}` : targetPath;
            edges.push({ parentId, childId: childNode.id });
        }

        return edges;
    }

    private resolveLinkedFilePath(linkPath: string, sourceFile: TFile): string | null {
        const dest = this.app.metadataCache.getFirstLinkpathDest(linkPath, sourceFile.path);
        return dest ? dest.path : null;
    }

    async quickCaptureTask(text: string): Promise<void> {
        const path = this.settings.quickCaptureFile;
        if (!path) {
            throw new Error("No quick-capture file is set — pick one in Progress Planner settings.");
        }

        const file = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) {
            throw new Error(`Quick-capture file not found: ${path}`);
        }

        const content = await this.app.vault.read(file);
        const lines = content.split("\n");
        const newLine = `- [ ] ${text}`;

        const cache = this.app.metadataCache.getFileCache(file);
        const fmEndLine = cache?.frontmatterPosition?.end?.line;

        if (fmEndLine !== undefined && fmEndLine >= 0 && fmEndLine < lines.length) {
            lines.splice(fmEndLine + 1, 0, newLine);
        } else {
            lines.unshift(newLine);
        }

        await this.app.vault.modify(file, lines.join("\n"));
    }

    async ensureBlockAnchor(file: TFile, line: number): Promise<string> {
        const content = await this.app.vault.read(file);
        const lines = content.split("\n");
        const existing = (lines[line] ?? "").match(/\^([a-zA-Z0-9-]+)\s*$/);
        if (existing && existing[1]) return existing[1];

        const newId = `tsk-${Math.random().toString(36).slice(2, 8)}`;
        lines[line] = `${lines[line] ?? ""} ^${newId}`;
        await this.app.vault.modify(file, lines.join("\n"));
        return newId;
    }

    async addCheckboxSubtask(file: TFile, text: string, parentLink?: string): Promise<void> {
        const content = await this.app.vault.read(file);
        const anchor = `tsk-${Math.random().toString(36).slice(2, 8)}`;
        const linkSuffix = parentLink ? ` ${parentLink}` : "";
        const newLine = `- [ ] ${text}${linkSuffix} ^${anchor}`;
        const sep = content.length === 0 || content.endsWith("\n") ? "" : "\n";
        await this.app.vault.modify(file, content + sep + newLine + "\n");
    }

    async addSubtaskUnder(parent: GraphNode, text: string): Promise<void> {
        let parentLink: string;
        let targetFile: TFile;

        if (parent.kind === "file") {
            const p = parent as TaskNode;
            targetFile = p.file;
            parentLink = `[[${p.basename}]]`;
        } else {
            const p = parent as CheckboxNode;
            targetFile = p.sourceFile;
            const anchor = await this.ensureBlockAnchor(p.sourceFile, p.sourceLine);
            parentLink = `[[${p.sourceFile.basename}#^${anchor}]]`;
        }

        await this.addCheckboxSubtask(targetFile, text, parentLink);
    }

    async linkNodeToParent(child: CheckboxNode, parent: GraphNode): Promise<void> {
        let parentLink: string;

        if (parent.kind === "file") {
            parentLink = `[[${(parent as TaskNode).basename}]]`;
        } else {
            const p = parent as CheckboxNode;
            const anchor = await this.ensureBlockAnchor(p.sourceFile, p.sourceLine);
            parentLink = `[[${p.sourceFile.basename}#^${anchor}]]`;
        }

        const content = await this.app.vault.read(child.sourceFile);
        const lines = content.split("\n");
        const lineText = lines[child.sourceLine] ?? "";
        if (lineText.includes(parentLink)) return;

        const anchorMatch = lineText.match(/(\s*\^[a-zA-Z0-9-]+)\s*$/);
        lines[child.sourceLine] = anchorMatch
            ? lineText.slice(0, anchorMatch.index) + ` ${parentLink}` + anchorMatch[0]
            : `${lineText} ${parentLink}`;

        await this.app.vault.modify(child.sourceFile, lines.join("\n"));
    }

    async unlinkFromParent(child: CheckboxNode, parent: GraphNode): Promise<void> {
        let parentLink: string;

        if (parent.kind === "file") {
            parentLink = `[[${(parent as TaskNode).basename}]]`;
        } else {
            const p = parent as CheckboxNode;
            if (!p.blockId) return;
            parentLink = `[[${p.sourceFile.basename}#^${p.blockId}]]`;
        }

        const content = await this.app.vault.read(child.sourceFile);
        const lines = content.split("\n");
        const lineText = lines[child.sourceLine] ?? "";
        if (!lineText.includes(parentLink)) return;

        lines[child.sourceLine] = lineText.replace(parentLink, "").replace(/\s{2,}/g, " ").trimEnd();
        await this.app.vault.modify(child.sourceFile, lines.join("\n"));
    }

    async toggleCheckboxStatus(file: TFile, line: number): Promise<void> {
        const openLeaf = this.app.workspace.getLeavesOfType("markdown")
            .find(l => (l.view as MarkdownView)?.file?.path === file.path);

        if (openLeaf) {
            const editor = (openLeaf.view as MarkdownView).editor;
            const lineText = editor.getLine(line);
            editor.setLine(line, this.flipCheckbox(lineText));
            return;
        }

        const content = await this.app.vault.read(file);
        const lines = content.split("\n");
        if (lines[line] === undefined) return;
        lines[line] = this.flipCheckbox(lines[line]);
        await this.app.vault.modify(file, lines.join("\n"));
    }

    private flipCheckbox(lineText: string): string {
        return lineText.replace(/\[.\]/, m => (m === "[ ]" ? "[x]" : "[ ]"));
    }

    async setNodeImpact(node: GraphNode, newImpact: "" | "low" | "medium" | "high"): Promise<void> {
        if (node.kind === "file") {
            const fileNode = node as TaskNode;
            await this.app.fileManager.processFrontMatter(fileNode.file, (fm) => {
                let tags = fm.tags;
                if (!tags) {
                    tags = [];
                } else if (typeof tags === 'string') {
                    tags = tags.split(',').map((t: string) => t.trim());
                } else if (!Array.isArray(tags)) {
                    tags = [String(tags)];
                }
                
                tags = tags.filter((t: string) => !/^#?impact\/(low|medium|high)$/i.test(t));
                
                if (newImpact) {
                    tags.push(`impact/${newImpact}`);
                }
                
                fm.tags = tags;
            });
        } else {
            const cbNode = node as CheckboxNode;
            const content = await this.app.vault.read(cbNode.sourceFile);
            const lines = content.split("\n");
            let lineText = lines[cbNode.sourceLine] ?? "";
            
            lineText = lineText.replace(/(?:^|\s)#impact\/(low|medium|high)\b/ig, "");
            
            if (newImpact) {
                const tag = ` #impact/${newImpact}`;
                const anchorMatch = lineText.match(/(\s*\^[a-zA-Z0-9-]+)\s*$/);
                if (anchorMatch) {
                    lineText = lineText.slice(0, anchorMatch.index) + tag + anchorMatch[0];
                } else {
                    lineText += tag;
                }
            }
            
            lines[cbNode.sourceLine] = lineText;
            await this.app.vault.modify(cbNode.sourceFile, lines.join("\n"));
        }
    }

    getGraphNodes(): GraphNode[] {
        const allNodes: GraphNode[] = [];
        const nodesById = new Map<string, GraphNode>();

        for (const [, data] of this.fileCache.entries()) {
            if (data.dashboardNode) {
                const clone: TaskNode = { ...data.dashboardNode, children: [], parents: [] };
                allNodes.push(clone);
                nodesById.set(clone.id, clone);
            }
        }

        for (const [, nodes] of this.checkboxNodesByFile.entries()) {
            nodes.forEach((n: CheckboxNode) => {
                const clone: CheckboxNode = { ...n, children: [], parents: [] };
                allNodes.push(clone);
                nodesById.set(clone.id, clone);
            });
        }

        const titleToNodes = new Map<string, TaskNode[]>();
        allNodes.forEach((n: GraphNode) => {
            if (n.kind === "file") {
                const fileNode = n as TaskNode;
                const keys = [
                    fileNode.title.toLowerCase().trim(),
                    fileNode.basename.toLowerCase().trim(),
                    fileNode.file.path.toLowerCase().trim()
                ];
                keys.forEach((k: string) => {
                    if (k) {
                        if (!titleToNodes.has(k)) titleToNodes.set(k, []);
                        const arr = titleToNodes.get(k)!;
                        if (!arr.includes(fileNode)) arr.push(fileNode);
                    }
                });
            }
        });

        allNodes.forEach((n: GraphNode) => {
            if (n.kind !== "file") return;
            const childFileNode = n as TaskNode;

            childFileNode.parentNames.forEach((pName: string) => {
                const matchedParents: GraphNode[] = [];

                const dest = this.app.metadataCache.getFirstLinkpathDest(pName, childFileNode.file.path);
                if (dest) {
                    const resolved = nodesById.get(dest.path);
                    if (resolved) matchedParents.push(resolved);
                }

                if (matchedParents.length === 0) {
                    const cleanPName = pName.toLowerCase().trim();
                    const candidates = titleToNodes.get(cleanPName) || [];
                    matchedParents.push(...candidates);
                }

                matchedParents.forEach((parentObj: GraphNode) => {
                    if (parentObj && parentObj !== childFileNode) {
                        if (!parentObj.children.includes(childFileNode)) parentObj.children.push(childFileNode);
                        if (!childFileNode.parents.includes(parentObj)) childFileNode.parents.push(parentObj);
                    }
                });
            });
        });

        for (const [, edges] of this.edgesByFile.entries()) {
            edges.forEach(({ parentId, childId }: GraphEdge) => {
                const parent = nodesById.get(parentId);
                const child = nodesById.get(childId);
                if (parent && child && parent !== child) {
                    if (!parent.children.includes(child)) parent.children.push(child);
                    if (!child.parents.includes(parent)) child.parents.push(parent);
                }
            });
        }

        let changed = true;
        let iterations = 0;
        while (changed && iterations++ < allNodes.length + 10) {
            changed = false;
            allNodes.forEach((node: GraphNode) => {
                let maxParentLevel = -1;
                node.parents.forEach((p: GraphNode) => { if (p.level > maxParentLevel) maxParentLevel = p.level; });
                if (maxParentLevel + 1 > node.level) {
                    node.level = maxParentLevel + 1;
                    changed = true;
                }
            });
        }

        return allNodes;
    }

    getDashboardTasks(): TaskNode[] {
        return this.getGraphNodes().filter((n: GraphNode): n is TaskNode => n.kind === "file");
    }

    getAgendaItems(): AgendaItem[] {
        const allItems: AgendaItem[] = [];
        for (const [, data] of this.fileCache.entries()) {
            allItems.push(...data.agendaItems);
        }
        return allItems;
    }
}