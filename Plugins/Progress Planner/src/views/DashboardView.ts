import { ItemView, WorkspaceLeaf, SuggestModal, Modal, App, TFile, Notice } from "obsidian";
import ProgressPlannerPlugin from "../main";
import { GraphNode, TaskNode, CheckboxNode, GoalContainer } from "../types";

export const VIEW_TYPE_DASHBOARD = "tq-goals-graph-view";

const FILTER_STORAGE_KEY = "tq-goals-graph-filters";
const VIEW_STORAGE_KEY = "tq-goals-graph-view-state";

class ParentSuggestModal extends SuggestModal<string> {
    private choices: string[];
    private onSelect: (choice: string) => void;

    constructor(app: App, choices: string[], onSelect: (choice: string) => void) {
        super(app);
        this.choices = choices;
        this.onSelect = onSelect;
    }

    getSuggestions(query: string): string[] {
        return this.choices.filter(choice => choice.toLowerCase().includes(query.toLowerCase()));
    }

    renderSuggestion(value: string, el: HTMLElement) {
        el.createEl("div", { text: value });
    }

    onChooseSuggestion(item: string) {
        this.onSelect(item);
    }
}

/** Same idea as ParentSuggestModal, but picks from any GraphNode (file or checkbox) by title. */
class NodeSuggestModal extends SuggestModal<GraphNode> {
    private nodes: GraphNode[];
    private onSelect: (node: GraphNode) => void;

    constructor(app: App, nodes: GraphNode[], onSelect: (node: GraphNode) => void) {
        super(app);
        this.nodes = nodes;
        this.onSelect = onSelect;
    }

    getSuggestions(query: string): GraphNode[] {
        return this.nodes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
    }

    renderSuggestion(node: GraphNode, el: HTMLElement) {
        el.createEl("div", { text: node.kind === "checkbox" ? `☐ ${node.title}` : node.title });
    }

    onChooseSuggestion(node: GraphNode) {
        this.onSelect(node);
    }
}

/** Minimal single-field text modal, used for "+ Add Subtask". */
class TextPromptModal extends Modal {
    private placeholder: string;
    private onSubmit: (value: string) => void;

    constructor(app: App, placeholder: string, onSubmit: (value: string) => void) {
        super(app);
        this.placeholder = placeholder;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        const input = contentEl.createEl("input", { type: "text", placeholder: this.placeholder });
        input.style.width = "100%";

        const submit = () => {
            const value = input.value.trim();
            if (value.length > 0) this.onSubmit(value);
            this.close();
        };

        input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });

        const btn = contentEl.createEl("button", { text: "Add" });
        btn.setAttribute("style", "margin-top: 10px;");
        btn.onclick = submit;

        window.setTimeout(() => input.focus(), 0);
    }

    onClose() {
        this.contentEl.empty();
    }
}

export class DashboardView extends ItemView {
    private plugin: ProgressPlannerPlugin;
    private allNodes: GraphNode[] = [];
    private visibleTasks: GraphNode[] = [];
    private selectedGoalPaths: Set<string> = new Set(["all"]);
    private scale = 0.8;
    private offsetX = 100;
    private offsetY = 100;
    private activeNodeId: string | null = null;
    private goalQuery = "";
    private inboxQuery = "";
    private checkboxInboxQuery = "";
    private lastInboxScroll = 0;
    private isCollapsed = false;

    // Render scoping (Minecraft-style view distance, anchored on the current filter selection)
    private renderDistance = 6;
    private hideCompletedCheckboxes = true;

    // Camera Panning State
    private isPanning = false;
    private sx = 0;
    private sy = 0;
    private moveTimeout: any = null;
    private wasDragged = false;

    // Continuous Layout Physics Properties
    private nodePositions = new Map<string, { x: number; y: number; vx: number; vy: number }>();
    private nodeElements = new Map<string, HTMLElement>();
    private draggedNodeId: string | null = null;
    private simulationId: number | null = null;
    private edgeRepelFrameCounter = 0;

    constructor(leaf: WorkspaceLeaf, plugin: ProgressPlannerPlugin) {
        super(leaf);
        this.plugin = plugin;

        const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
        if (savedFilters) {
            this.selectedGoalPaths = new Set(JSON.parse(savedFilters));
        }

        const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
        if (savedView) {
            const parsed = JSON.parse(savedView);
            this.scale = parsed.scale ?? 0.8;
            this.offsetX = parsed.offsetX ?? 100;
            this.offsetY = parsed.offsetY ?? 100;
            this.renderDistance = parsed.renderDistance ?? 6;
            this.hideCompletedCheckboxes = parsed.hideCompletedCheckboxes ?? true;
        }
    }

    getViewType(): string {
        return VIEW_TYPE_DASHBOARD;
    }

    getDisplayText(): string {
        return "Goals Graph";
    }

    async onOpen() {
        this.contentEl.style.padding = "0";
        this.contentEl.style.height = "100%";
        this.contentEl.style.overflow = "hidden";
        this.render();
    }

    async onClose() {
        this.stopSimulation();
    }

    private startSimulation() {
        if (this.simulationId) return;
        const tick = () => {
            this.stepSimulation();
            this.simulationId = requestAnimationFrame(tick);
        };
        this.simulationId = requestAnimationFrame(tick);
    }

    private stopSimulation() {
        if (this.simulationId) {
            cancelAnimationFrame(this.simulationId);
            this.simulationId = null;
        }
    }

    private stepSimulation() {
        this.calculatePhysicsStep();
        this.updateDomElements();
    }

    // ------------------------------------------------------------------
    // Render scoping: which nodes are eligible to be drawn at all
    // ------------------------------------------------------------------

    /**
     * BFS outward from the current anchor set (selected filters, or all goals
     * if "all" is selected), capped at renderDistance hops. Undirected —
     * parents count as "closer" the same as children, since a checkbox a few
     * hops up its parent chain is just as relevant as one a few hops down.
     */
    private getNodesWithinDistance(anchors: GraphNode[], maxDist: number): Set<GraphNode> {
        const dist = new Map<string, number>();
        const found = new Map<string, GraphNode>();
        const queue: GraphNode[] = [];

        anchors.forEach(a => { dist.set(a.id, 0); found.set(a.id, a); queue.push(a); });

        let head = 0;
        while (head < queue.length) {
            const node = queue[head++];
            if (!node) continue;
            const d = dist.get(node.id)!;
            if (d >= maxDist) continue;

            for (const nb of [...node.children, ...node.parents]) {
                if (!dist.has(nb.id)) {
                    dist.set(nb.id, d + 1);
                    found.set(nb.id, nb);
                    queue.push(nb);
                }
            }
        }
        return new Set(found.values());
    }

    /**
     * Walks the FULL graph (not the distance-clipped subset) — a done node
     * just outside render range can still have an incomplete descendant that
     * matters, so this can't be limited to what's currently visible.
     */
    private hasIncompleteDescendant(node: GraphNode, memo: Map<string, boolean>): boolean {
        if (memo.has(node.id)) return memo.get(node.id)!;
        memo.set(node.id, false); // cycle guard: multi-parent checkboxes can form cycles
        const result = node.children.some(child => child.status !== "done" || this.hasIncompleteDescendant(child, memo));
        memo.set(node.id, result);
        return result;
    }

    private isRenderable(n: GraphNode, memo: Map<string, boolean>): boolean {
        const hasLink = n.isGoal || n.parents.length > 0 || n.children.length > 0;
        if (!hasLink) return false; // true orphan — sidebar inbox only, never the canvas

        if (n.status !== "done") return true;
        if (!this.hideCompletedCheckboxes) return true; // toggle off: done nodes always stay visible

        return this.hasIncompleteDescendant(n, memo);
    }

    /**
     * Radial force calculation step. Pulls parent nodes tightly toward
     * the center and allows subtasks to radiate outward cleanly.
     */
    private calculatePhysicsStep() {
        const visibleTasksSet = new Set(this.visibleTasks);
        const coords = this.nodePositions;

        const NODE_W = 160;
        const NODE_H = 50;

        // Radial layout forces
        const K_REPEL = 50000;
        const K_SPRING = 0.055;
        const SPRING_LEN = 160;
        const G_ACCEL = 0.0035;
        const DAMPING = 0.80;

        const center = { x: 1000, y: 1000 };

        // 1. Repulsion forces (long-range separation)
        for (let i = 0; i < this.visibleTasks.length; i++) {
            const t1 = this.visibleTasks[i];
            if (!t1) continue;
            const p1 = coords.get(t1.id);
            if (!p1) continue;

            for (let j = i + 1; j < this.visibleTasks.length; j++) {
                const t2 = this.visibleTasks[j];
                if (!t2) continue;
                const p2 = coords.get(t2.id);
                if (!p2) continue;

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < 100) {
                    distSq = 100;
                }
                const dist = Math.sqrt(distSq);

                const force = K_REPEL / distSq;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (t1.id !== this.draggedNodeId) {
                    p1.vx += fx; p1.vy += fy;
                }
                if (t2.id !== this.draggedNodeId) {
                    p2.vx -= fx; p2.vy -= fy;
                }
            }
        }

        // 2. Spring forces (Parent-child alignment links)
        this.visibleTasks.forEach(parent => {
            const p1 = coords.get(parent.id);
            if (!p1) return;
            parent.children.forEach(child => {
                if (!visibleTasksSet.has(child)) return;
                const p2 = coords.get(child.id);
                if (!p2) return;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = (dist - SPRING_LEN) * K_SPRING;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (child.id !== this.draggedNodeId) {
                    p2.vx -= fx; p2.vy -= fy;
                }
                if (parent.id !== this.draggedNodeId) {
                    p1.vx += fx; p1.vy += fy;
                }
            });
        });

        // 2.5 Edge-edge crossing repulsion — the spring pass above only cares
        // about each edge's own two endpoints, so nothing stops two unrelated
        // edges from crossing straight through each other. This pass detects
        // actual crossings between edges that don't share a node, and pushes
        // both edges' midpoints apart until they don't. Throttled to every
        // 3rd frame since it's O(edges²) and doesn't need to run every tick
        // to still converge.
        this.edgeRepelFrameCounter++;
        if (this.edgeRepelFrameCounter % 3 === 0) {
            const K_EDGE_REPEL = 900;

            const edges: { p: { x: number; y: number; vx: number; vy: number }; c: { x: number; y: number; vx: number; vy: number }; parentId: string; childId: string }[] = [];
            this.visibleTasks.forEach(parent => {
                const pp = coords.get(parent.id);
                if (!pp) return;
                parent.children.forEach(child => {
                    if (!visibleTasksSet.has(child)) return;
                    const cp = coords.get(child.id);
                    if (!cp) return;
                    edges.push({ p: pp, c: cp, parentId: parent.id, childId: child.id });
                });
            });

            // Standard "do segments AB and CD intersect" orientation test.
            const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
                (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

            for (let i = 0; i < edges.length; i++) {
                const e1 = edges[i];
                if (!e1) continue;
                for (let j = i + 1; j < edges.length; j++) {
                    const e2 = edges[j];
                    if (!e2) continue;

                    // Edges sharing an endpoint just meet at a node — that's
                    // not visual clutter, skip it.
                    if (e1.parentId === e2.parentId || e1.parentId === e2.childId ||
                        e1.childId === e2.parentId || e1.childId === e2.childId) continue;

                    const a = e1.p, b = e1.c, c = e2.p, d = e2.c;
                    const crossing =
                        ccw(a.x, a.y, c.x, c.y, d.x, d.y) !== ccw(b.x, b.y, c.x, c.y, d.x, d.y) &&
                        ccw(a.x, a.y, b.x, b.y, c.x, c.y) !== ccw(a.x, a.y, b.x, b.y, d.x, d.y);
                    if (!crossing) continue;

                    // Push each edge's midpoint away from the other's — a
                    // cheap approximation of "un-cross these" that converges
                    // over a handful of frames without exact intersection math.
                    const m1x = (a.x + b.x) / 2, m1y = (a.y + b.y) / 2;
                    const m2x = (c.x + d.x) / 2, m2y = (c.y + d.y) / 2;
                    const dx = m1x - m2x, dy = m1y - m2y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = K_EDGE_REPEL / (dist * dist);
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;

                    if (e1.parentId !== this.draggedNodeId) { a.vx += fx * 0.5; a.vy += fy * 0.5; }
                    if (e1.childId !== this.draggedNodeId) { b.vx += fx * 0.5; b.vy += fy * 0.5; }
                    if (e2.parentId !== this.draggedNodeId) { c.vx -= fx * 0.5; c.vy -= fy * 0.5; }
                    if (e2.childId !== this.draggedNodeId) { d.vx -= fx * 0.5; d.vy -= fy * 0.5; }
                }
            }
        }

        // 3. Radial centripetal gravity pull (anchors roots in center, branches float outwards)
        this.visibleTasks.forEach(t => {
            const p = coords.get(t.id);
            if (!p) return;

            if (t.id !== this.draggedNodeId) {
                const dx = center.x - p.x;
                const dy = center.y - p.y;

                const gravityScale = t.level === 0 ? 1.6 : 0.7;
                p.vx += dx * G_ACCEL * gravityScale;
                p.vy += dy * G_ACCEL * gravityScale;

                p.x += p.vx;
                p.y += p.vy;

                p.vx *= DAMPING;
                p.vy *= DAMPING;
            }
        });

        // 4. Rigid Direct Positional push-out (Guarantees zero overlap)
        for (let i = 0; i < this.visibleTasks.length; i++) {
            const t1 = this.visibleTasks[i];
            if (!t1) continue;
            const p1 = coords.get(t1.id);
            if (!p1) continue;

            for (let j = i + 1; j < this.visibleTasks.length; j++) {
                const t2 = this.visibleTasks[j];
                if (!t2) continue;
                const p2 = coords.get(t2.id);
                if (!p2) continue;

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;

                const halfW = (NODE_W / 2) + 12;
                const halfH = (NODE_H / 2) + 8;

                const overlapX = (halfW * 2) - Math.abs(dx);
                const overlapY = (halfH * 2) - Math.abs(dy);

                if (overlapX > 0 && overlapY > 0) {
                    const pushX = overlapX * 0.5;
                    const pushY = overlapY * 0.5;
                    const signX = dx >= 0 ? 1 : -1;
                    const signY = dy >= 0 ? 1 : -1;

                    if (overlapX < overlapY) {
                        if (t1.id !== this.draggedNodeId) p1.x += signX * pushX;
                        if (t2.id !== this.draggedNodeId) p2.x -= signX * pushX;
                        p1.vx *= 0.75; p2.vx *= 0.75;
                    } else {
                        if (t1.id !== this.draggedNodeId) p1.y += signY * pushY;
                        if (t2.id !== this.draggedNodeId) p2.y -= signY * pushY;
                        p1.vy *= 0.75; p2.vy *= 0.75;
                    }
                }
            }
        }
    }

    private updateDomElements() {
        const world = this.contentEl.querySelector(".tq-world") as HTMLElement;
        const svg = this.contentEl.querySelector(".tq-svg") as SVGElement & SVGSVGElement;
        if (!world || !svg) return;

        const NODE_W = 160, NODE_H = 50;

        this.visibleTasks.forEach(t => {
            const pos = this.nodePositions.get(t.id);
            const nodeEl = this.nodeElements.get(t.id);
            if (pos && nodeEl) {
                nodeEl.style.width = `${NODE_W}px`;
                nodeEl.style.left = `${pos.x - NODE_W / 2}px`;
                nodeEl.style.top = `${pos.y - NODE_H / 2}px`;
            }
        });

        svg.empty();
        const visibleTasksSet = new Set(this.visibleTasks);

        this.visibleTasks.forEach(parent => {
            const p = this.nodePositions.get(parent.id);
            if (!p) return;
            parent.children.forEach(child => {
                if (!visibleTasksSet.has(child)) return;
                const c = this.nodePositions.get(child.id);
                if (!c) return;

                const dx = p.x - c.x;
                const dy = p.y - c.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) return;

                const absDx = Math.max(Math.abs(dx), 0.001);
                const absDy = Math.max(Math.abs(dy), 0.001);
                const scaleToEdge = Math.min((NODE_W / 2) / absDx, (NODE_H / 2) / absDy);

                const startX = c.x + dx * scaleToEdge;
                const startY = c.y + dy * scaleToEdge;
                const endX = p.x - dx * scaleToEdge;
                const endY = p.y - dy * scaleToEdge;

                const arrowSize = 8;
                const ux = dx / dist;
                const uy = dy / dist;

                const baseCenterX = endX - ux * arrowSize;
                const baseCenterY = endY - uy * arrowSize;

                const perpX = -uy * (arrowSize * 0.5);
                const perpY = ux * (arrowSize * 0.5);

                const p1 = `${endX},${endY}`;
                const p2 = `${baseCenterX + perpX},${baseCenterY + perpY}`;
                const p3 = `${baseCenterX - perpX},${baseCenterY - perpY}`;

                const path = svg.createSvg("path", { cls: "tq-line" });
                path.setAttribute("d", `M ${startX} ${startY} L ${baseCenterX} ${baseCenterY}`);

                const arrowhead = svg.createSvg("polygon", { cls: "tq-arrowhead" });
                arrowhead.setAttribute("points", `${p1} ${p2} ${p3}`);
            });
        });
    }

    private openNodeInEditor(t: GraphNode) {
        if (t.kind === "file") {
            this.app.workspace.getLeaf(false).openFile((t as TaskNode).file);
            return;
        }
        const cb = t as CheckboxNode;
        this.app.workspace.getLeaf(false).openFile(cb.sourceFile).then(() => {
            const view = this.app.workspace.getActiveViewOfType(ItemView);
            const ed = (view as any)?.editor;
            if (ed) {
                ed.setCursor({ line: cb.sourceLine, ch: 0 });
                ed.scrollIntoView({ from: { line: cb.sourceLine, ch: 0 }, to: { line: cb.sourceLine, ch: 0 } }, true);
            }
        });
    }

    public async render() {
        this.allNodes = this.plugin.taskCache.getGraphNodes();

        const container = this.contentEl;
        container.empty();

        const root = container.createDiv("tq-root");
        if (this.isCollapsed) root.classList.add("is-collapsed");

        const main = root.createDiv("tq-main");
        const mapArea = main.createDiv("tq-map");
        const world = mapArea.createDiv("tq-world");

        const svg = world.createSvg("svg", { cls: "tq-svg" });
        svg.setAttribute("width", "20000");
        svg.setAttribute("height", "10000");

        const sidebar = root.createDiv("tq-sidebar");
        const collapseBtn = sidebar.createDiv("tq-collapse-btn");
        collapseBtn.innerText = this.isCollapsed ? "▶" : "◀";

        collapseBtn.onclick = (e) => {
            e.stopPropagation();
            this.isCollapsed = !this.isCollapsed;
            root.classList.toggle("is-collapsed", this.isCollapsed);
            collapseBtn.innerText = this.isCollapsed ? "▶" : "◀";
        };

        const sidebarInner = sidebar.createDiv("tq-sidebar-inner");

        const updateWorldTransform = () => {
            world.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
        };

        const saveGoalFilters = () => {
            localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(Array.from(this.selectedGoalPaths)));
        };

        const saveViewState = () => {
            localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({
                scale: this.scale,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                renderDistance: this.renderDistance,
                hideCompletedCheckboxes: this.hideCompletedCheckboxes
            }));
        };

        const renderSidebar = () => {
            const existingInboxList = sidebarInner.querySelector(".tq-sidebar-section:first-child .tq-scroll-list");
            if (existingInboxList) {
                this.lastInboxScroll = existingInboxList.scrollTop;
            }

            sidebarInner.empty();
            if (this.activeNodeId) {
                const task = this.allNodes.find(n => n.id === this.activeNodeId);
                if (!task) { this.activeNodeId = null; renderSidebar(); return; }

                const header = sidebarInner.createDiv("tq-sidebar-header");
                header.createSpan({ text: "Node Inspector" });
                const back = header.createSpan({ text: "Close", cls: "tq-back-btn" });
                back.onclick = () => { this.activeNodeId = null; this.render(); };

                sidebarInner.createDiv({ text: task.title, cls: "tq-inspector-title" });
                const scroll = sidebarInner.createDiv("tq-scroll-list");

                const parentsHeader = scroll.createDiv({ text: "Current Parents", cls: "tq-sidebar-header" });
                parentsHeader.setAttribute("style", "background:transparent; padding: 10px 0;");

                if (task.kind === "file") {
                    const fileTask = task as TaskNode;
                    fileTask.parentNames.forEach(pName => {
                        const pill = scroll.createDiv("tq-parent-pill");
                        pill.createSpan({ text: pName });
                        const remove = pill.createSpan({ text: "✕", cls: "tq-remove-btn" });
                        remove.onclick = async () => {
                            await this.app.fileManager.processFrontMatter(fileTask.file, (fm) => {
                                let p = fm["parent"] || [];
                                if (!Array.isArray(p)) p = [p];
                                fm["parent"] = p.filter((linkStr: any) => {
                                    const parts = String(linkStr).replace(/[\[\]]/g, "").split("|");
                                    const clean = parts[0] ? parts[0].trim() : "";
                                    return clean.toLowerCase() !== pName.toLowerCase();
                                });
                            });
                            setTimeout(() => this.render(), 200);
                        };
                    });

                    const addBtn = scroll.createEl("button", { text: "+ Add Parent", cls: "tq-add-parent-btn" });
                    addBtn.onclick = () => {
                        const choices = this.allNodes.filter(n => n.kind === "file" && n.id !== task.id).map(n => n.title);
                        new ParentSuggestModal(this.app, choices, async (choice) => {
                            if (choice) {
                                await this.app.fileManager.processFrontMatter(fileTask.file, (fm) => {
                                    let p = fm["parent"] || [];
                                    if (!Array.isArray(p)) p = [p];
                                    const link = `[[${choice}]]`;
                                    if (!p.includes(link)) { p.push(link); fm["parent"] = p; }
                                });
                                setTimeout(() => this.render(), 200);
                            }
                        }).open();
                    };
                } else {
                    const cbTask = task as CheckboxNode;
                    task.parents.forEach(parent => {
                        const pill = scroll.createDiv("tq-parent-pill");
                        pill.createSpan({ text: parent.title });
                        const remove = pill.createSpan({ text: "✕", cls: "tq-remove-btn" });
                        remove.onclick = async () => {
                            await this.plugin.taskCache.unlinkFromParent(cbTask, parent);
                            setTimeout(() => this.render(), 200);
                        };
                    });

                    const addBtn = scroll.createEl("button", { text: "+ Add Parent", cls: "tq-add-parent-btn" });
                    addBtn.onclick = () => {
                        const choices = this.allNodes.filter(n => n.id !== task.id);
                        new NodeSuggestModal(this.app, choices, async (chosen) => {
                            await this.plugin.taskCache.linkNodeToParent(cbTask, chosen);
                            setTimeout(() => this.render(), 200);
                        }).open();
                    };
                }

                const subtaskBtn = scroll.createEl("button", { text: "+ Add Subtask", cls: "tq-add-parent-btn" });
                subtaskBtn.setAttribute("style", "margin-top: 8px; opacity: 0.85;");
                subtaskBtn.onclick = () => {
                    new TextPromptModal(this.app, "New subtask...", async (text) => {
                        await this.plugin.taskCache.addSubtaskUnder(task, text);
                        setTimeout(() => this.render(), 200);
                    }).open();
                };
            } else {
                // --- Task Inbox: orphaned FILE tasks (unchanged from before) ---
                const inboxSec = sidebarInner.createDiv("tq-sidebar-section");
                const inboxHead = inboxSec.createDiv("tq-sidebar-header");
                const inboxTitle = inboxHead.createSpan();
                const inboxInput = inboxSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search inbox..." });
                inboxInput.value = this.inboxQuery;
                const inboxList = inboxSec.createDiv("tq-scroll-list");

                const updateInboxList = () => {
                    this.inboxQuery = inboxInput.value;
                    inboxList.empty();
                    const unparented = this.allNodes.filter(n => n.kind === "file" && n.isTask && !n.isGoal && n.parents.length === 0);
                    const filtered = unparented.filter(t => t.title.toLowerCase().includes(this.inboxQuery.toLowerCase()));
                    inboxTitle.innerText = `Task Inbox (${filtered.length})`;
                    filtered.forEach(t => {
                        const item = inboxList.createDiv({ text: t.title, cls: "tq-inbox-item" });
                        item.draggable = true;
                        item.addEventListener("dragstart", (e: DragEvent) => {
                            if (e.dataTransfer) {
                                e.dataTransfer.setData("text/plain", JSON.stringify({ kind: "file", id: t.id }));
                            }
                        });
                        item.onclick = (e) => {
                            if (e.metaKey || e.ctrlKey) {
                                this.activeNodeId = t.id;
                                this.isCollapsed = false;
                                root.classList.remove("is-collapsed");
                                collapseBtn.innerText = "◀";
                                this.render();
                            } else {
                                this.openNodeInEditor(t);
                            }
                        };
                    });

                    inboxList.scrollTop = this.lastInboxScroll;
                };

                // --- Checkbox Inbox: orphaned checkboxes (no parent AND no children) ---
                const cbInboxSec = sidebarInner.createDiv("tq-sidebar-section");
                const cbInboxHead = cbInboxSec.createDiv("tq-sidebar-header");
                const cbInboxTitle = cbInboxHead.createSpan();
                const cbInboxInput = cbInboxSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search orphan checkboxes..." });
                cbInboxInput.value = this.checkboxInboxQuery;
                const cbInboxList = cbInboxSec.createDiv("tq-scroll-list");

                const updateCheckboxInboxList = () => {
                    this.checkboxInboxQuery = cbInboxInput.value;
                    cbInboxList.empty();
                    const orphaned = this.allNodes.filter(n => n.kind === "checkbox" && n.parents.length === 0 && n.children.length === 0);
                    const filtered = orphaned.filter(n => n.title.toLowerCase().includes(this.checkboxInboxQuery.toLowerCase()));
                    cbInboxTitle.innerText = `Orphan Checkboxes (${filtered.length})`;
                    filtered.forEach(n => {
                        const item = cbInboxList.createDiv({ text: n.title, cls: "tq-inbox-item" });
                        item.draggable = true;
                        item.addEventListener("dragstart", (e: DragEvent) => {
                            if (e.dataTransfer) {
                                e.dataTransfer.setData("text/plain", JSON.stringify({ kind: "checkbox", id: n.id }));
                            }
                        });
                        item.onclick = (e) => {
                            if (e.metaKey || e.ctrlKey) {
                                this.activeNodeId = n.id;
                                this.isCollapsed = false;
                                root.classList.remove("is-collapsed");
                                collapseBtn.innerText = "◀";
                                this.render();
                            } else {
                                this.openNodeInEditor(n);
                            }
                        };
                    });
                };

                // --- Focus filters: only nodes tagged #goal show up here ---
                const goalSec = sidebarInner.createDiv("tq-sidebar-section");
                goalSec.createDiv("tq-sidebar-header").createSpan({ text: "Focus Filters" });
                const goalInput = goalSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search goals..." });
                goalInput.value = this.goalQuery;
                const goalList = goalSec.createDiv("tq-scroll-list");

                const updateGoalList = () => {
                    this.goalQuery = goalInput.value;
                    goalList.empty();
                    const createFilter = (label: string, id: string) => {
                        const item = goalList.createDiv("tq-goal-filter-item");
                        const cb = item.createEl("input", { type: "checkbox" });
                        cb.checked = this.selectedGoalPaths.has(id);
                        item.createSpan({ text: label });
                        item.onclick = () => {
                            if (id === "all") {
                                // Toggle: clicking it while active clears the selection
                                // entirely (empty = show nothing), same as deselecting
                                // every individual goal by hand.
                                if (this.selectedGoalPaths.has("all")) {
                                    this.selectedGoalPaths.clear();
                                } else {
                                    this.selectedGoalPaths.clear();
                                    this.selectedGoalPaths.add("all");
                                }
                            } else {
                                this.selectedGoalPaths.delete("all");
                                this.selectedGoalPaths.has(id) ? this.selectedGoalPaths.delete(id) : this.selectedGoalPaths.add(id);
                                // Deliberately no fallback to "all" here — if you deselect
                                // everything, the canvas empties out. That's the point.
                            }
                            saveGoalFilters();
                            this.render();
                        };
                    };
                    createFilter("Show All Goals", "all");
                    this.allNodes
                        .filter(n => n.isGoal && n.title.toLowerCase().includes(this.goalQuery.toLowerCase()))
                        .forEach(n => createFilter(n.title, n.id));
                };

                // --- Goal Containers: saved multi-goal Focus Filter presets, e.g.
                // "Job Search Sprint" = 3 goals selected together in one click ---
                const containerSec = sidebarInner.createDiv("tq-sidebar-section");
                containerSec.createDiv("tq-sidebar-header").createSpan({ text: "Goal Containers" });
                const containerBody = containerSec.createDiv("tq-search-container");

                const isContainerActive = (c: GoalContainer) =>
                    !this.selectedGoalPaths.has("all") &&
                    this.selectedGoalPaths.size === c.goalIds.length &&
                    c.goalIds.every(id => this.selectedGoalPaths.has(id));

                const containers = this.plugin.settings.goalContainers;
                containers.forEach(c => {
                    const pill = containerBody.createDiv("tq-parent-pill");
                    if (isContainerActive(c)) pill.classList.add("is-active-container");
                    pill.createSpan({ text: `📦 ${c.name} (${c.goalIds.length})` });
                    const remove = pill.createSpan({ text: "✕", cls: "tq-remove-btn" });
                    remove.onclick = async (e) => {
                        e.stopPropagation();
                        await this.plugin.saveGoalContainers(containers.filter(x => x !== c));
                        this.render();
                    };
                    pill.onclick = () => {
                        this.selectedGoalPaths = new Set(c.goalIds);
                        saveGoalFilters();
                        this.render();
                    };
                });

                const currentGoalSelection = this.selectedGoalPaths.has("all")
                    ? []
                    : Array.from(this.selectedGoalPaths).filter(id => this.allNodes.some(n => n.id === id && n.isGoal));

                const saveContainerBtn = containerBody.createEl("button", { text: "+ Save current selection as container", cls: "tq-add-parent-btn" });
                saveContainerBtn.setAttribute("style", "margin-top: 8px; font-size: 0.7rem;");
                if (currentGoalSelection.length === 0) {
                    saveContainerBtn.disabled = true;
                    saveContainerBtn.setAttribute("title", "Select one or more goals above first");
                }
                saveContainerBtn.onclick = () => {
                    if (currentGoalSelection.length === 0) return;
                    new TextPromptModal(this.app, "Container name...", async (name) => {
                        await this.plugin.saveGoalContainers([...containers, { name, goalIds: currentGoalSelection }]);
                        this.render();
                    }).open();
                };

                // --- Render distance + hide-completed toggle ---
                const distSec = sidebarInner.createDiv("tq-sidebar-section");
                distSec.createDiv("tq-sidebar-header").createSpan({ text: "View Settings" });
                const distWrap = distSec.createDiv("tq-search-container");

                distWrap.createSpan({ text: "Render distance", cls: "tq-view-settings-label" });
                const distInput = distWrap.createEl("input", { type: "number", cls: "tq-small-input" });
                distInput.value = String(this.renderDistance);
                distInput.min = "1";
                distInput.onchange = () => {
                    const v = parseInt(distInput.value);
                    if (!isNaN(v) && v > 0) {
                        this.renderDistance = v;
                        saveViewState();
                        this.render();
                    }
                };

                const hideItem = distWrap.createDiv("tq-goal-filter-item");
                hideItem.setAttribute("style", "margin-top: 8px;");
                const hideCb = hideItem.createEl("input", { type: "checkbox" });
                hideCb.checked = this.hideCompletedCheckboxes;
                hideItem.createSpan({ text: "Hide completed subtasks" });
                hideItem.onclick = () => {
                    this.hideCompletedCheckboxes = !this.hideCompletedCheckboxes;
                    saveViewState();
                    this.render();
                };

                inboxInput.oninput = updateInboxList;
                cbInboxInput.oninput = updateCheckboxInboxList;
                goalInput.oninput = updateGoalList;
                updateInboxList();
                updateCheckboxInboxList();
                updateGoalList();
            }
        };

        renderSidebar();

        // --- Determine which nodes are within render range of the current focus filters ---
        const memo = new Map<string, boolean>();
        let anchorNodes: GraphNode[];
        if (this.selectedGoalPaths.has("all")) {
            anchorNodes = this.allNodes.filter(n => n.isGoal);
        } else {
            anchorNodes = this.allNodes.filter(n => this.selectedGoalPaths.has(n.id));
        }
        const withinRange = this.getNodesWithinDistance(anchorNodes, this.renderDistance);
        this.visibleTasks = this.allNodes.filter(n => withinRange.has(n) && this.isRenderable(n, memo));

        this.nodeElements.clear();

        // 1. Maintain or assign positional tracking maps
        let seed = 42;
        function seededRandom() { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); }

        const center = { x: 1000, y: 1000 };
        let hasNewNodes = false;

        this.visibleTasks.forEach(t => {
            if (!this.nodePositions.has(t.id)) {
                hasNewNodes = true;

                let parentPos = null;
                for (const parent of t.parents) {
                    if (this.nodePositions.has(parent.id)) {
                        parentPos = this.nodePositions.get(parent.id);
                        break;
                    }
                }

                if (parentPos) {
                    this.nodePositions.set(t.id, {
                        x: parentPos.x + (seededRandom() - 0.5) * 80,
                        y: parentPos.y + (seededRandom() - 0.5) * 80,
                        vx: 0,
                        vy: 0
                    });
                } else {
                    this.nodePositions.set(t.id, {
                        x: center.x + (seededRandom() - 0.5) * 200,
                        y: center.y + (seededRandom() - 0.5) * 200,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        });

        if (hasNewNodes) {
            for (let k = 0; k < 150; k++) {
                this.calculatePhysicsStep();
            }
        }

        // 2. Build graph node items
        this.visibleTasks.forEach(t => {
            const node = world.createDiv("tq-node");
            if (t.isGoal) node.classList.add("is-goal");
            if (t.id === this.activeNodeId) node.classList.add("is-active");
            if (t.status === "done") node.classList.add("is-done-node");
            if (t.kind === "checkbox") node.classList.add("is-checkbox-node");
            if (t.impact) node.classList.add(`impact-${t.impact}`);

            if (t.kind === "checkbox") {
                const toggle = node.createDiv({ cls: "tq-node-toggle", text: t.status === "done" ? "☑" : "☐" });
                toggle.onclick = (e) => {
                    e.stopPropagation();
                    const cb = t as CheckboxNode;
                    this.plugin.taskCache.toggleCheckboxStatus(cb.sourceFile, cb.sourceLine)
                        .then(() => setTimeout(() => this.render(), 150));
                };
            }

            node.createDiv({ text: t.title, cls: "tq-node-title" });

            this.nodeElements.set(t.id, node);

            node.onclick = (e) => {
                e.stopPropagation();
                if (e.metaKey || e.ctrlKey) {
                    this.activeNodeId = t.id;
                    this.isCollapsed = false;
                    root.classList.remove("is-collapsed");
                    collapseBtn.innerText = "◀";
                    this.render();
                } else {
                    this.openNodeInEditor(t);
                }
            };

            // Custom local drag behaviors using direct pointer captures
            let isDraggingNode = false;
            let nodeStartX = 0, nodeStartY = 0;
            let pointerStartX = 0, pointerStartY = 0;

            node.onpointerdown = (pe) => {
                pe.stopPropagation();
                isDraggingNode = true;
                this.draggedNodeId = t.id;
                const pos = this.nodePositions.get(t.id)!;
                nodeStartX = pos.x;
                nodeStartY = pos.y;
                pointerStartX = pe.clientX;
                pointerStartY = pe.clientY;
                node.setPointerCapture(pe.pointerId);
            };

            node.onpointermove = (pe) => {
                if (isDraggingNode && this.draggedNodeId === t.id) {
                    pe.stopPropagation();
                    const dx = (pe.clientX - pointerStartX) / this.scale;
                    const dy = (pe.clientY - pointerStartY) / this.scale;
                    const pos = this.nodePositions.get(t.id)!;
                    pos.x = nodeStartX + dx;
                    pos.y = nodeStartY + dy;
                    pos.vx = 0;
                    pos.vy = 0;
                }
            };

            node.onpointerup = (pe) => {
                if (isDraggingNode && this.draggedNodeId === t.id) {
                    pe.stopPropagation();
                    isDraggingNode = false;
                    this.draggedNodeId = null;
                    node.releasePointerCapture(pe.pointerId);
                }
            };

            // Inbox Drag-Over Handlers
            node.addEventListener("dragover", (e) => {
                e.preventDefault();
                node.classList.add("drop-hover");
            });

            node.addEventListener("dragleave", () => node.classList.remove("drop-hover"));

            node.addEventListener("drop", async (e: DragEvent) => {
                e.preventDefault();
                node.classList.remove("drop-hover");
                if (!e.dataTransfer) return;

                let payload: { kind: "file" | "checkbox"; id: string };
                try {
                    payload = JSON.parse(e.dataTransfer.getData("text/plain"));
                } catch {
                    return;
                }

                if (payload.kind === "file") {
                    // Frontmatter parent-linking only makes sense against a file node
                    if (t.kind !== "file") return;
                    const childFile = this.app.vault.getAbstractFileByPath(payload.id);
                    if (childFile && childFile instanceof TFile) {
                        await this.app.fileManager.processFrontMatter(childFile, (fm) => {
                            let p = fm["parent"] || [];
                            if (!Array.isArray(p)) p = [p];
                            const link = `[[${(t as TaskNode).basename}]]`;
                            if (!p.includes(link)) {
                                p.push(link);
                                fm["parent"] = p;
                            }
                        });
                        setTimeout(() => this.render(), 150);
                    }
                } else {
                    const childNode = this.allNodes.find(n => n.id === payload.id) as CheckboxNode | undefined;
                    if (childNode) {
                        await this.plugin.taskCache.linkNodeToParent(childNode, t);
                        setTimeout(() => this.render(), 150);
                    }
                }
            });
        });

        updateWorldTransform();

        // 3. Setup Camera Panning
        mapArea.onclick = (e) => {
            if (this.wasDragged) {
                e.stopPropagation();
                return;
            }
            this.activeNodeId = null;
            this.render();
        };

        // Double-click empty canvas → quick-capture a checkbox into the
        // configured target file. Single click is already "deselect", so this
        // stays on dblclick to avoid a prompt firing on every deselect.
        mapArea.ondblclick = (e) => {
            if (e.target !== mapArea && e.target !== world && e.target !== svg) return;
            if (!this.plugin.settings.quickCaptureFile) {
                new Notice("Set a quick-capture file in Progress Planner settings first.");
                return;
            }
            new TextPromptModal(this.app, "New task...", async (text) => {
                try {
                    await this.plugin.taskCache.quickCaptureTask(text);
                    setTimeout(() => this.render(), 150);
                } catch (err) {
                    new Notice(err instanceof Error ? err.message : String(err));
                }
            }).open();
        };

        const endPanning = () => {
            if (this.isPanning) {
                this.isPanning = false;
                clearTimeout(this.moveTimeout);
                root.classList.remove("is-grabbing");
                saveViewState();
            }
        };

        mapArea.onpointerdown = (e) => {
            if (e.target === mapArea || e.target === world || e.target === svg) {
                this.isPanning = true;
                this.wasDragged = false;
                this.sx = e.clientX;
                this.sy = e.clientY;
                mapArea.setPointerCapture(e.pointerId);
                root.classList.add("is-grabbing");
            }
        };

        window.onpointermove = (e) => {
            if (this.isPanning) {
                this.wasDragged = true;
                this.offsetX += e.clientX - this.sx;
                this.offsetY += e.clientY - this.sy;
                this.sx = e.clientX;
                this.sy = e.clientY;
                updateWorldTransform();
                root.classList.add("is-grabbing");
                clearTimeout(this.moveTimeout);
                this.moveTimeout = setTimeout(() => { if (this.isPanning) root.classList.remove("is-grabbing"); }, 100);
            }
        };

        window.onpointerup = endPanning;
        window.onpointercancel = endPanning;
        window.onblur = endPanning;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const rect = mapArea.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            const zoom = e.deltaY > 0 ? 0.9 : 1.1;
            const oldS = this.scale;
            this.scale = Math.min(Math.max(0.1, this.scale * zoom), 4.0);
            if (this.scale !== oldS) {
                const ratio = this.scale / oldS;
                this.offsetX = mx - (mx - this.offsetX) * ratio;
                this.offsetY = my - (my - this.offsetY) * ratio;
                updateWorldTransform();
                saveViewState();
            }
        };
        mapArea.addEventListener("wheel", handleWheel, { passive: false });

        this.startSimulation();
    }
}