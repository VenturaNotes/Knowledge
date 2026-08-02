import { App, TFile, MarkdownView } from "obsidian";
import { TaskNode, CheckboxNode, GraphNode, GraphEdge, AgendaItem, ProgressPlannerSettings } from "../types";

export class TaskCache {
    private app: App;
    private settings: ProgressPlannerSettings;

    private fileCache: Map<string, {
        dashboardNode: TaskNode | null;
        agendaItems: AgendaItem[];
    }> = new Map();

    // --- Checkbox graph state, kept per-file so a single edit only ever
    // re-parses the one file that changed, never the whole vault. ---
    private checkboxNodesByFile: Map<string, CheckboxNode[]> = new Map();
    private edgesByFile: Map<string, GraphEdge[]> = new Map();

    constructor(app: App, settings: ProgressPlannerSettings) {
        this.app = app;
        this.settings = settings;
    }

    public updateSettings(settings: ProgressPlannerSettings) {
        this.settings = settings;
    }

    /**
     * Reads an #impact/low|medium|high tag out of a list of already-lowercased
     * tag strings. Optional by design — most nodes won't have one, and an
     * untagged node just renders with no impact indicator at all.
     */
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

        if (skipPaths.some(p => file.path.includes(p))) {
            this.removeFile(file.path);
            return;
        }

        const isInTargetFolder = targetFolders.length === 0 || targetFolders.some(folder => file.path.startsWith(folder));

        if (!isInTargetFolder) {
            this.removeFile(file.path);
            return;
        }

        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache) {
            this.removeFile(file.path);
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

        // --- 1. Dashboard Cache Processing (unchanged from before) ---
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
                kind: "file",
                file: file,
                basename: file.basename,
                title: fm.title || file.basename,
                isGoal: isGoal,
                isTask: isTask,
                parentNames: parentNames,
                children: [],
                parents: [],
                level: 0,
                status: statusStr,
                impact: this.parseImpact(combinedTags)
            };
        }

        // --- 2. Agenda Cache Processing (unchanged — powers AgendaView's calendar) ---
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

        // --- 3. Checkbox graph processing (new) ---
        // Every checkbox line becomes a node whether or not it currently links
        // to anything. A checkbox with no anchor and no links just ends up with
        // parents.length === 0 && children.length === 0 once edges are wired in
        // getGraphNodes() — that's exactly what makes it an "orphan" for the
        // sidebar list, no separate bookkeeping required.
        const { nodes, byLine } = this.parseCheckboxNodes(file, lines, cache);
        this.checkboxNodesByFile.set(file.path, nodes);
        this.edgesByFile.set(file.path, this.resolveEdgesForFile(file, cache, byLine));
    }

    removeFile(path: string) {
        this.fileCache.delete(path);
        this.checkboxNodesByFile.delete(path);
        this.edgesByFile.delete(path);
    }

    // ------------------------------------------------------------------
    // Checkbox graph: parsing
    // ------------------------------------------------------------------

    private parseCheckboxNodes(file: TFile, lines: string[], cache: any): { nodes: CheckboxNode[]; byLine: Map<number, CheckboxNode> } {
        const listItems: any[] = cache?.listItems ?? [];
        const nodes: CheckboxNode[] = [];
        const byLine = new Map<number, CheckboxNode>();

        for (const item of listItems) {
            if (item.task === undefined) continue; // not a checkbox line
            const lineIdx = item.position.start.line;
            const rawLine = lines[lineIdx] ?? "";

            const anchorMatch = rawLine.match(/\^([a-zA-Z0-9-]+)\s*$/);
            const blockId = anchorMatch ? (anchorMatch[1] ?? "") : "";
            const id = blockId ? `${file.path}#^${blockId}` : `${file.path}::${lineIdx}`;

            const inlineTagsMatch = rawLine.match(/(?:^|\s)(#[^\s#]+)/g);
            const inlineTags = inlineTagsMatch ? inlineTagsMatch.map(t => t.trim().toLowerCase()) : [];
            const impact = this.parseImpact(inlineTags);

            const title = rawLine
                .replace(/^\s*-\s*\[.\]\s*/, "")
                .replace(/\^[a-zA-Z0-9-]+\s*$/, "")
                .replace(/\[\[[^\]]+\]\]/g, "") // strip parent-link wikilinks from the display title
                .replace(/(?:^|\s)#impact\/(?:low|medium|high)\b/i, "") // impact is metadata, not task text
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

    /**
     * Resolves the edges THIS file contributes, using cache.links (already
     * parsed by Obsidian's own MetadataCache — no custom wikilink regex needed).
     * A link with a #^anchor fragment means "parent is that checkbox";
     * a plain file link means "parent is that file's TaskNode".
     */
    private resolveEdgesForFile(file: TFile, cache: any, byLine: Map<number, CheckboxNode>): GraphEdge[] {
        const links: any[] = cache?.links ?? [];
        const edges: GraphEdge[] = [];

        for (const link of links) {
            const childNode = byLine.get(link.position.start.line);
            if (!childNode) continue; // link isn't sitting on a checkbox line in this file

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

    /**
     * Appends a new checkbox line to the configured quick-capture file, right
     * after its frontmatter block (or at the very top if it has none). Used by
     * the "double-click empty canvas" flow in DashboardView — this deliberately
     * does NOT set a parent link, since the whole point is frictionless capture
     * without having to think about hierarchy first.
     */
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
            // Insert right after the closing "---" of the frontmatter block,
            // pushing everything below it down by one line.
            lines.splice(fmEndLine + 1, 0, newLine);
        } else {
            // No frontmatter — insert at the very top of the file.
            lines.unshift(newLine);
        }

        await this.app.vault.modify(file, lines.join("\n"));
    }

    // ------------------------------------------------------------------
    // Checkbox graph: write-back helpers
    // ------------------------------------------------------------------

    /** Ensures the checkbox at `line` has a block anchor, generating one if needed. Returns the anchor id. */
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

    /** Appends a new checkbox line to `file`, auto-generating its anchor, optionally pre-linked to a parent. */
    async addCheckboxSubtask(file: TFile, text: string, parentLink?: string): Promise<void> {
        const content = await this.app.vault.read(file);
        const anchor = `tsk-${Math.random().toString(36).slice(2, 8)}`;
        const linkSuffix = parentLink ? ` ${parentLink}` : "";
        const newLine = `- [ ] ${text}${linkSuffix} ^${anchor}`;
        const sep = content.length === 0 || content.endsWith("\n") ? "" : "\n";
        await this.app.vault.modify(file, content + sep + newLine + "\n");
    }

    /**
     * Convenience wrapper: add a subtask underneath any GraphNode (file or checkbox),
     * landing the new checkbox line in the same file the parent lives in.
     */
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

    /** Links an existing checkbox to a new parent (file or checkbox) by inserting a wikilink into its line. */
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
        if (lineText.includes(parentLink)) return; // already linked

        // Insert the link right before the trailing block anchor (if any) so the anchor stays last on the line
        const anchorMatch = lineText.match(/(\s*\^[a-zA-Z0-9-]+)\s*$/);
        lines[child.sourceLine] = anchorMatch
            ? lineText.slice(0, anchorMatch.index) + ` ${parentLink}` + anchorMatch[0]
            : `${lineText} ${parentLink}`;

        await this.app.vault.modify(child.sourceFile, lines.join("\n"));
    }

    /** Removes an existing wikilink to `parent` from `child`'s line, undoing linkNodeToParent. */
    async unlinkFromParent(child: CheckboxNode, parent: GraphNode): Promise<void> {
        let parentLink: string;

        if (parent.kind === "file") {
            parentLink = `[[${(parent as TaskNode).basename}]]`;
        } else {
            const p = parent as CheckboxNode;
            if (!p.blockId) return; // no anchor means nothing could have linked to it
            parentLink = `[[${p.sourceFile.basename}#^${p.blockId}]]`;
        }

        const content = await this.app.vault.read(child.sourceFile);
        const lines = content.split("\n");
        const lineText = lines[child.sourceLine] ?? "";
        if (!lineText.includes(parentLink)) return;

        lines[child.sourceLine] = lineText.replace(parentLink, "").replace(/\s{2,}/g, " ").trimEnd();
        await this.app.vault.modify(child.sourceFile, lines.join("\n"));
    }

    /**
     * Toggles a checkbox's status. Prefers the live Editor when the file is
     * already open, since that avoids racing against a stale line index if the
     * user is actively editing the same file — falls back to a direct vault
     * write when it's closed.
     */
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

    // ------------------------------------------------------------------
    // Unified graph accessor
    // ------------------------------------------------------------------

    /**
     * Builds the full unified graph (TaskNodes + CheckboxNodes, fully wired
     * with children/parents) fresh on every call. This is O(total nodes +
     * total edges) — array pushes, not re-parsing — so it's fine to call
     * once per render(), same cost category as the old getDashboardTasks().
     */
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
            nodes.forEach(n => {
                const clone: CheckboxNode = { ...n, children: [], parents: [] };
                allNodes.push(clone);
                nodesById.set(clone.id, clone);
            });
        }

        // 1. Wire file-level frontmatter `parent:` edges (unchanged logic from before)
        const titleToNode = new Map<string, GraphNode>();
        allNodes.forEach(n => {
            if (n.kind === "file") {
                titleToNode.set(n.title.toLowerCase().trim(), n);
                titleToNode.set((n as TaskNode).basename.toLowerCase().trim(), n);
            }
        });
        allNodes.forEach(n => {
            if (n.kind !== "file") return;
            (n as TaskNode).parentNames.forEach(pName => {
                const parentObj = titleToNode.get(pName.toLowerCase());
                if (parentObj) {
                    if (!parentObj.children.includes(n)) parentObj.children.push(n);
                    if (!n.parents.includes(parentObj)) n.parents.push(parentObj);
                }
            });
        });

        // 2. Wire block-reference edges (checkbox -> checkbox, checkbox -> file)
        for (const [, edges] of this.edgesByFile.entries()) {
            edges.forEach(({ parentId, childId }) => {
                const parent = nodesById.get(parentId);
                const child = nodesById.get(childId);
                if (parent && child && parent !== child) {
                    if (!parent.children.includes(child)) parent.children.push(child);
                    if (!child.parents.includes(parent)) child.parents.push(parent);
                }
            });
        }

        // 3. Level propagation — capped so a link cycle (possible now that
        // multi-parent checkboxes exist) can't spin forever.
        let changed = true;
        let iterations = 0;
        while (changed && iterations++ < allNodes.length + 10) {
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

    /** Retained for anything still keying off file-only nodes (e.g. settings UI, future use). */
    getDashboardTasks(): TaskNode[] {
        return this.getGraphNodes().filter((n): n is TaskNode => n.kind === "file");
    }

    getAgendaItems(): AgendaItem[] {
        const allItems: AgendaItem[] = [];
        for (const [, data] of this.fileCache.entries()) {
            allItems.push(...data.agendaItems);
        }
        return allItems;
    }
}