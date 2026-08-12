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
    private isCollapsed = false;
    private settingsPanelOpen = false;
    private focusSectionExpanded = true;
    private viewSectionExpanded = true;

    private renderDistance = 6;
    private hideCompletedCheckboxes = true;

    private expandedHubIds: Set<string> = new Set();
    private depthExpandedIds: Set<string> = new Set();

    private isPanning = false;
    private sx = 0;
    private sy = 0;
    private moveTimeout: any = null;
    private wasDragged = false;

    private nodePositions = new Map<string, { x: number; y: number; vx: number; vy: number }>();
    private nodeElements = new Map<string, HTMLElement>();
    private draggedNodeId: string | null = null;
    private simulationId: number | null = null;
    private edgeRepelFrameCounter = 0;

    private idleFrameCount = 0;
    private readonly IDLE_SPEED_THRESHOLD = 0.05;
    private readonly IDLE_FRAMES_TO_STOP = 30;

    private lastGraphRef: GraphNode[] | null = null;
    private lastRenderConfig: string = "";
    private hubHiddenIds: Set<string> = new Set();
    private frontierCutoffCounts: Map<string, number> = new Map();
    private renderMemo: Map<string, boolean> = new Map();
    
    private nodeById: Map<string, GraphNode> = new Map();

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
            this.depthExpandedIds = new Set(parsed.depthExpandedIds ?? []);
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
        this.idleFrameCount = 0;
        const tick = () => {
            const stillMoving = this.stepSimulation();
            if (stillMoving) {
                this.idleFrameCount = 0;
            } else {
                this.idleFrameCount++;
            }

            if (this.idleFrameCount >= this.IDLE_FRAMES_TO_STOP) {
                this.simulationId = null;
                return;
            }
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

    private stepSimulation(): boolean {
        const stillMoving = this.calculatePhysicsStep(false);
        this.updateDomElements();
        return stillMoving;
    }

    private countAllDescendants(node: GraphNode, hiddenIds: Set<string>): number {
        const seen = new Set<string>();
        const stack: GraphNode[] = [...node.children];
        while (stack.length) {
            const n = stack.pop()!;
            if (seen.has(n.id) || hiddenIds.has(n.id) || !this.isRenderable(n)) continue;
            seen.add(n.id);
            stack.push(...n.children);
        }
        return seen.size;
    }

    private foldDepthBranch(node: GraphNode, seen: Set<string> = new Set()): void {
        if (seen.has(node.id)) return;
        seen.add(node.id);
        this.depthExpandedIds.delete(node.id);
        node.children.forEach(c => this.foldDepthBranch(c, seen));
    }

    private getNodesWithinDistance(anchors: GraphNode[], maxDist: number, hiddenIds: Set<string>): { nodes: Set<GraphNode>; frontierCutoffCounts: Map<string, number> } {
        const budget = new Map<string, number>();
        const found = new Map<string, GraphNode>();
        const frontierCutoffCounts = new Map<string, number>();
        const queue: GraphNode[] = [];

        anchors.forEach(a => {
            if (!hiddenIds.has(a.id) && this.isRenderable(a)) {
                budget.set(a.id, maxDist);
                found.set(a.id, a);
                queue.push(a);
            }
        });

        let head = 0;
        while (head < queue.length) {
            const node = queue[head++];
            if (!node) continue;
            let remaining = budget.get(node.id)!;

            if (remaining <= 0) {
                if (this.depthExpandedIds.has(node.id)) {
                    remaining = 1;
                    budget.set(node.id, remaining);
                } else {
                    const hiddenCount = this.countAllDescendants(node, hiddenIds);
                    if (hiddenCount > 0) frontierCutoffCounts.set(node.id, hiddenCount);
                    continue;
                }
            }

            for (const nb of node.children) {
                if (!hiddenIds.has(nb.id) && !budget.has(nb.id) && this.isRenderable(nb)) {
                    budget.set(nb.id, remaining - 1);
                    found.set(nb.id, nb);
                    queue.push(nb);
                }
            }
        }
        return { nodes: new Set(found.values()), frontierCutoffCounts };
    }

    private hasIncompleteDescendant(node: GraphNode): boolean {
        if (this.renderMemo.has(node.id)) return this.renderMemo.get(node.id)!;
        this.renderMemo.set(node.id, false);
        const result = node.children.some(child => child.status !== "done" || this.hasIncompleteDescendant(child));
        this.renderMemo.set(node.id, result);
        return result;
    }

    private isRenderable(n: GraphNode): boolean {
        const hasLink = n.isGoal || n.parents.length > 0 || n.children.length > 0;
        if (!hasLink) return false;

        if (n.status !== "done") return true;
        if (!this.hideCompletedCheckboxes) return true;

        return this.hasIncompleteDescendant(n);
    }

    private impactRank(impact: string): number {
        if (impact === "high") return 3;
        if (impact === "medium") return 2;
        if (impact === "low") return 1;
        return 0;
    }

    private childPriorityRank(n: GraphNode): number {
        const impactPenalty = 3 - this.impactRank(n.impact); 
        const kindPenalty = n.kind === "file" ? 0 : 1; 
        return impactPenalty * 10 + kindPenalty;
    }

    private computeHubHiddenIds(anchorNodeIds: Set<string>): Set<string> {
        const threshold = this.plugin.settings.hubChildThreshold;
        const minRank = this.impactRank(this.plugin.settings.hubMinImpact);
        const hidden = new Set<string>();

        const hubCandidates = this.allNodes.filter(n => n.children.length > threshold);

        hubCandidates.forEach(parent => {
            if (this.expandedHubIds.has(parent.id)) return;
            
            const visibleChildren = parent.children.filter(c => this.isRenderable(c));
            if (visibleChildren.length <= threshold) return;

            const ranked = [...visibleChildren].sort((a, b) => {
                const rankDiff = this.childPriorityRank(a) - this.childPriorityRank(b);
                if (rankDiff !== 0) return rankDiff;
                return a.title.localeCompare(b.title);
            });

            for (let i = threshold; i < ranked.length; i++) {
                const child = ranked[i];
                if (child) {
                    hidden.add(child.id);
                }
            }
        });

        const descendantPassMemo = new Map<string, boolean>();
        const hasPassingDescendant = (node: GraphNode): boolean => {
            if (descendantPassMemo.has(node.id)) return descendantPassMemo.get(node.id)!;
            descendantPassMemo.set(node.id, false);
            const result = node.children.some(child =>
                this.impactRank(child.impact) >= minRank || hasPassingDescendant(child)
            );
            descendantPassMemo.set(node.id, result);
            return result;
        };

        Array.from(hidden).forEach(id => {
            const node = this.nodeById.get(id);
            if (!node) return;

            const rescuedByNonHubParent = node.parents.some(p => {
                const pVis = p.children.filter(c => this.isRenderable(c));
                return pVis.length <= threshold || this.expandedHubIds.has(p.id);
            });
            
            if (rescuedByNonHubParent || hasPassingDescendant(node) || anchorNodeIds.has(id)) {
                hidden.delete(id);
            }
        });

        return hidden;
    }

    private calculatePhysicsStep(isInitialBurst: boolean = false): boolean {
        const visibleTasksSet = new Set(this.visibleTasks);
        const coords = this.nodePositions;

        const NODE_W = 160;
        const NODE_H = 90;

        const K_REPEL = 55000;
        const K_SPRING = 0.055;
        const SPRING_LEN = 190; 
        const G_ACCEL = 0.0035;
        const DAMPING = 0.80;
        const MAX_SPEED = 40;

        const center = { x: 1000, y: 1000 };
        const MAX_NODES_FOR_N2_CALCS = 400; 

        for (const p of coords.values()) {
            if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
                p.x = center.x;
                p.y = center.y;
                p.vx = 0;
                p.vy = 0;
            }
        }

        if (this.visibleTasks.length <= MAX_NODES_FOR_N2_CALCS) {
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
        }

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

        this.edgeRepelFrameCounter++;
        if (this.edgeRepelFrameCounter % 3 === 0 && this.visibleTasks.length <= 250) {
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

            const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
                (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

            for (let i = 0; i < edges.length; i++) {
                const e1 = edges[i];
                if (!e1) continue;
                for (let j = i + 1; j < edges.length; j++) {
                    const e2 = edges[j];
                    if (!e2) continue;

                    if (e1.parentId === e2.parentId || e1.parentId === e2.childId ||
                        e1.childId === e2.parentId || e1.childId === e2.childId) continue;

                    const a = e1.p, b = e1.c, c = e2.p, d = e2.c;
                    const crossing =
                        ccw(a.x, a.y, c.x, c.y, d.x, d.y) !== ccw(b.x, b.y, c.x, c.y, d.x, d.y) &&
                        ccw(a.x, a.y, b.x, b.y, c.x, c.y) !== ccw(a.x, a.y, b.x, b.y, d.x, d.y);
                    if (!crossing) continue;

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

        this.visibleTasks.forEach(t => {
            const p = coords.get(t.id);
            if (!p) return;

            if (t.id !== this.draggedNodeId) {
                const hasVisibleParent = t.parents.some(par => visibleTasksSet.has(par));
                if (!hasVisibleParent) {
                    const dx = center.x - p.x;
                    const dy = center.y - p.y;
                    p.vx += dx * G_ACCEL * 1.6;
                    p.vy += dy * G_ACCEL * 1.6;
                }

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > MAX_SPEED) {
                    const clampScale = MAX_SPEED / speed;
                    p.vx *= clampScale;
                    p.vy *= clampScale;
                }

                p.x += p.vx;
                p.y += p.vy;

                p.vx *= DAMPING;
                p.vy *= DAMPING;
            }
        });

        if (!isInitialBurst && this.visibleTasks.length <= MAX_NODES_FOR_N2_CALCS) {
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

        const idleThresholdSq = this.IDLE_SPEED_THRESHOLD * this.IDLE_SPEED_THRESHOLD;
        let stillMoving = false;
        for (const t of this.visibleTasks) {
            const p = coords.get(t.id);
            if (!p) continue;
            if (p.vx * p.vx + p.vy * p.vy > idleThresholdSq) {
                stillMoving = true;
                break;
            }
        }
        return stillMoving;
    }

    private updateDomElements() {
        const world = this.contentEl.querySelector(".tq-world") as HTMLElement;
        const svg = this.contentEl.querySelector(".tq-svg") as SVGElement & SVGSVGElement;
        if (!world || !svg) return;

        const NODE_W = 160, NODE_H = 90;

        this.visibleTasks.forEach(t => {
            const pos = this.nodePositions.get(t.id);
            const nodeEl = this.nodeElements.get(t.id);
            if (pos && nodeEl) {
                nodeEl.style.width = `${NODE_W}px`;
                nodeEl.style.height = `${NODE_H}px`;
                nodeEl.style.left = `${pos.x - NODE_W / 2}px`;
                nodeEl.style.top = `${pos.y - NODE_H / 2}px`;
            }
        });

        svg.empty();
        const visibleTasksSet = new Set(this.visibleTasks);

        type EdgeInfo = { parent: GraphNode; child: GraphNode; p: { x: number; y: number }; c: { x: number; y: number } };
        const edges: EdgeInfo[] = [];
        this.visibleTasks.forEach(parent => {
            const p = this.nodePositions.get(parent.id);
            if (!p) return;
            parent.children.forEach(child => {
                if (!visibleTasksSet.has(child)) return;
                const c = this.nodePositions.get(child.id);
                if (!c) return;
                const dist = Math.hypot(p.x - c.x, p.y - c.y);
                if (dist < 20) return;
                edges.push({ parent, child, p, c });
            });
        });

        const MIN_SEP = 0.22;
        type Attachment = { edgeIdx: number; end: "parent" | "child"; angle: number };
        const byNode = new Map<string, Attachment[]>();

        edges.forEach((e, idx) => {
            const dx = e.p.x - e.c.x, dy = e.p.y - e.c.y;
            const angleAtChild = Math.atan2(dy, dx);     
            const angleAtParent = Math.atan2(-dy, -dx);  

            if (!byNode.has(e.child.id)) byNode.set(e.child.id, []);
            byNode.get(e.child.id)!.push({ edgeIdx: idx, end: "child", angle: angleAtChild });

            if (!byNode.has(e.parent.id)) byNode.set(e.parent.id, []);
            byNode.get(e.parent.id)!.push({ edgeIdx: idx, end: "parent", angle: angleAtParent });
        });

        const adjustedAngle = new Map<string, number>();
        byNode.forEach(list => {
            if (list.length <= 1) {
                list.forEach(a => adjustedAngle.set(`${a.edgeIdx}-${a.end}`, a.angle));
                return;
            }
            const sorted = [...list].sort((a, b) => a.angle - b.angle);
            const n = sorted.length;

            if (n * MIN_SEP >= Math.PI * 2) {
                const step = (Math.PI * 2) / n;
                sorted.forEach((a, i) => { a.angle = sorted[0]!.angle + i * step; });
            } else {
                for (let i = 1; i < n; i++) {
                    const prev = sorted[i - 1]!, cur = sorted[i]!;
                    if (cur.angle - prev.angle < MIN_SEP) cur.angle = prev.angle + MIN_SEP;
                }
                const first = sorted[0]!, last = sorted[n - 1]!;
                const span = last.angle - first.angle;
                const maxSpan = Math.PI * 2 - MIN_SEP;
                if (span > maxSpan) {
                    const scale = maxSpan / span;
                    for (let i = 1; i < n; i++) {
                        sorted[i]!.angle = first.angle + (sorted[i]!.angle - first.angle) * scale;
                    }
                }
            }
            sorted.forEach(a => adjustedAngle.set(`${a.edgeIdx}-${a.end}`, a.angle));
        });

        const rectExitPoint = (angle: number) => {
            if (!Number.isFinite(angle)) return { x: 0, y: 0 };
            const cosA = Math.cos(angle), sinA = Math.sin(angle);
            const tX = Math.abs(cosA) > 0.0001 ? (NODE_W / 2) / Math.abs(cosA) : Infinity;
            const tY = Math.abs(sinA) > 0.0001 ? (NODE_H / 2) / Math.abs(sinA) : Infinity;
            const t = Math.min(tX, tY);
            return { x: cosA * t, y: sinA * t };
        };

        edges.forEach((e, idx) => {
            const childExit = rectExitPoint(adjustedAngle.get(`${idx}-child`)!);
            const parentExit = rectExitPoint(adjustedAngle.get(`${idx}-parent`)!);

            const startX = e.c.x + childExit.x;
            const startY = e.c.y + childExit.y;
            const endX = e.p.x + parentExit.x;
            const endY = e.p.y + parentExit.y;

            if (!Number.isFinite(startX) || !Number.isFinite(startY) || !Number.isFinite(endX) || !Number.isFinite(endY)) {
                return;
            }

            const dx = endX - startX, dy = endY - startY;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 5) return;

            const ux = dx / dist, uy = dy / dist;

            const arrowSize = 9;
            const baseCenterX = endX - ux * arrowSize;
            const baseCenterY = endY - uy * arrowSize;
            const perpX = -uy * (arrowSize * 0.55);
            const perpY = ux * (arrowSize * 0.55);

            const p1 = `${endX},${endY}`;
            const p2 = `${baseCenterX + perpX},${baseCenterY + perpY}`;
            const p3 = `${baseCenterX - perpX},${baseCenterY - perpY}`;

            const path = svg.createSvg("path", { cls: "tq-line" });
            path.setAttribute("d", `M ${startX} ${startY} L ${baseCenterX} ${baseCenterY}`);

            const arrowhead = svg.createSvg("polygon", { cls: "tq-arrowhead" });
            arrowhead.setAttribute("points", `${p1} ${p2} ${p3}`);
        });
    }

    private canvasTitle(title: string): string {
        const match = title.match(/\p{Extended_Pictographic}/u);
        if (!match || match.index === undefined) return title;
        const stripped = title.slice(0, match.index).trim();
        return stripped.length > 0 ? stripped : title;
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

    private updateSelection() {
        this.nodeElements.forEach((el, id) => {
            el.classList.toggle("is-active", id === this.activeNodeId);
        });

        const sidebarInner = this.contentEl.querySelector(".tq-sidebar-inner");
        if (sidebarInner) {
            this.renderSidebar(sidebarInner as HTMLElement);
        }
    }

    private renderSidebar(sidebarInner: HTMLElement) {
        sidebarInner.empty();
        
        if (this.activeNodeId) {
            const task = this.nodeById.get(this.activeNodeId);
            if (!task) { this.activeNodeId = null; this.renderSidebar(sidebarInner); return; }

            const header = sidebarInner.createDiv("tq-sidebar-header");
            header.createSpan({ text: "Node Inspector" });
            const back = header.createSpan({ text: "Close", cls: "tq-back-btn" });
            back.onclick = () => { this.activeNodeId = null; this.updateSelection(); }; 

            sidebarInner.createDiv({ text: task.title, cls: "tq-inspector-title" });
            const scroll = sidebarInner.createDiv("tq-scroll-list");

            const impactHeader = scroll.createDiv({ text: "Impact Level", cls: "tq-sidebar-header" });
            impactHeader.setAttribute("style", "background:transparent; padding: 10px 0 5px 0; margin-top: 5px; border-bottom: none;");

            const impactSelect = scroll.createEl("select", { cls: "tq-select" });
            impactSelect.style.width = "100%";
            impactSelect.style.marginBottom = "15px";

            const options = [
                { val: "", text: "None" },
                { val: "low", text: "Low" },
                { val: "medium", text: "Medium" },
                { val: "high", text: "High" }
            ];
            options.forEach(o => {
                const opt = impactSelect.createEl("option", { value: o.val, text: o.text });
                if (task.impact === o.val) opt.selected = true;
            });

            impactSelect.onchange = async () => {
                const val = impactSelect.value as "" | "low" | "medium" | "high";
                await this.plugin.taskCache.setNodeImpact(task, val);
                setTimeout(() => this.render(), 200);
            };

            const parentsHeader = scroll.createDiv({ text: "Current Parents", cls: "tq-sidebar-header" });
            parentsHeader.setAttribute("style", "background:transparent; padding: 10px 0; border-top: 1px solid var(--background-modifier-border);");

            if (task.kind === "file") {
                const fileTask = task as TaskNode;
                fileTask.parentNames.forEach(pName => {
                    const pill = scroll.createDiv("tq-parent-pill");
                    pill.createSpan({ text: pName });
                    const remove = pill.createSpan({ text: "✕", cls: "tq-remove-btn" });
                    remove.onclick = async () => {
                        await this.app.fileManager.processFrontMatter(fileTask.file, (fm) => {
                            let p = fm["parent"] || fm["parents"] || [];
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
                                let p = fm["parent"] || fm["parents"] || [];
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

            const visibleChildCount = task.children.filter(c => this.isRenderable(c)).length;
            const isHub = visibleChildCount > this.plugin.settings.hubChildThreshold;
            const filteredChildren = task.children.filter(c => this.hubHiddenIds.has(c.id));
            
            if (isHub) {
                const filteredHeader = scroll.createDiv({
                    text: filteredChildren.length > 0
                        ? `Filtered Children (${filteredChildren.length})`
                        : `Hub Children (${task.children.length})`,
                    cls: "tq-sidebar-header"
                });
                filteredHeader.setAttribute("style", "background:transparent; padding: 10px 0; margin-top: 10px;");

                if (filteredChildren.length > 0) {
                    const filteredSearch = scroll.createEl("input", { cls: "tq-small-input", placeholder: "Search filtered children..." });
                    const filteredList = scroll.createDiv();
                    filteredList.setAttribute("style", "display:flex; flex-direction:column; gap:6px; margin-top:6px;");

                    const updateFilteredList = () => {
                        filteredList.empty();
                        const q = filteredSearch.value.toLowerCase();
                        filteredChildren
                            .filter(c => c.title.toLowerCase().includes(q))
                            .forEach(c => {
                                const item = filteredList.createDiv("tq-inbox-item");
                                item.setAttribute("style", "display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 10px; cursor: default; position: relative;");
                                
                                const titleSpan = item.createSpan({ text: (c.kind === "checkbox" ? "☐ " : "") + c.title });
                                titleSpan.setAttribute("style", "flex: 1; word-break: break-word; line-height: 1.3; cursor: pointer; padding-right: 25px;");
                                titleSpan.onclick = () => this.openNodeInEditor(c);
                                
                                const getImpactColor = (imp: string) => {
                                    if (imp === "high") return "var(--text-error)";
                                    if (imp === "medium") return "#ffaa00";
                                    if (imp === "low") return "var(--text-muted)";
                                    return "transparent";
                                };

                                const squareWrap = item.createDiv();
                                squareWrap.setAttribute("style", "position: absolute; top: 6px; right: 10px; width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--background-modifier-border); cursor: pointer; background-color: " + getImpactColor(c.impact) + "; overflow: hidden;");
                                
                                const childImpactSelect = squareWrap.createEl("select");
                                childImpactSelect.setAttribute("style", "opacity: 0; width: 100%; height: 100%; cursor: pointer; position: absolute; top: 0; left: 0; -webkit-appearance: none; appearance: none;");
                                
                                const childOpts = [
                                    { val: "", text: "None" },
                                    { val: "low", text: "Low" },
                                    { val: "medium", text: "Med" },
                                    { val: "high", text: "High" }
                                ];
                                childOpts.forEach(o => {
                                    const opt = childImpactSelect.createEl("option", { value: o.val, text: o.text });
                                    if (c.impact === o.val) opt.selected = true;
                                });
                                
                                childImpactSelect.onclick = (e) => e.stopPropagation();
                                childImpactSelect.onchange = async () => {
                                    const val = childImpactSelect.value as "" | "low" | "medium" | "high";
                                    await this.plugin.taskCache.setNodeImpact(c, val);
                                    setTimeout(() => this.render(), 200);
                                };
                            });
                    };
                    filteredSearch.oninput = updateFilteredList;
                    updateFilteredList();
                }
            }
        } else {
            sidebarInner.createDiv("tq-sidebar-header").createSpan({ text: "Node Inspector" });
            const emptyMsg = sidebarInner.createDiv();
            emptyMsg.setAttribute("style", "padding: 24px 16px; opacity: 0.55; font-size: 0.82rem; text-align: center; line-height: 1.4;");
            emptyMsg.setText("Select a node on the canvas to inspect it here. Focus Filters and View Settings have moved to the gear icon, top right.");
        }
    }

    private renderSettingsPanel(mapArea: HTMLElement) {
        const settingsBtn = mapArea.createDiv("tq-settings-btn");
        settingsBtn.setText("⚙");
        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            this.settingsPanelOpen = !this.settingsPanelOpen;
            this.render();
        };

        if (!this.settingsPanelOpen) return;

        const panel = mapArea.createDiv("tq-settings-panel");
        panel.onpointerdown = (e) => e.stopPropagation();
        panel.onclick = (e) => e.stopPropagation();

        const panelHeader = panel.createDiv("tq-settings-panel-header");
        panelHeader.createSpan({ text: "Graph Settings" });
        const closeBtn = panelHeader.createSpan({ text: "✕", cls: "tq-settings-close" });
        closeBtn.onclick = () => {
            this.settingsPanelOpen = false;
            this.render();
        };

        const focusSec = panel.createDiv("tq-settings-section");
        const focusHeader = focusSec.createDiv("tq-settings-section-header");
        focusHeader.createSpan({ text: (this.focusSectionExpanded ? "▾ " : "▸ ") + "Focus Filters" });
        focusHeader.onclick = () => {
            this.focusSectionExpanded = !this.focusSectionExpanded;
            this.render();
        };

        if (this.focusSectionExpanded) {
            const focusBody = focusSec.createDiv("tq-settings-section-body");
            const filterWrap = focusBody.createDiv("tq-search-container");

            const focusInput = filterWrap.createEl("input", { cls: "tq-small-input", placeholder: "Search individual goals..." });
            focusInput.value = this.goalQuery;

            const containers = this.plugin.settings.goalContainers;
            
            const currentGoalSelection = this.selectedGoalPaths.has("all")
                ? []
                : Array.from(this.selectedGoalPaths).filter(id => {
                      const n = this.nodeById.get(id);
                      return n ? n.isGoal : false;
                  });

            if (containers.length > 0) {
                const selectWrap = filterWrap.createDiv();
                selectWrap.setAttribute("style", "display: flex; gap: 5px; margin-top: 8px;");

                const select = selectWrap.createEl("select", { cls: "tq-select" });
                select.setAttribute("style", "flex: 1; min-width: 0; text-align: left; text-align-last: left;");

                select.createEl("option", { text: "-- Saved Containers --", value: "" });

                let activeIndex = -1;
                containers.forEach((c, idx) => {
                    const opt = select.createEl("option", { text: `📦 ${c.name}`, value: String(idx) });
                    const isActive = !this.selectedGoalPaths.has("all") &&
                        this.selectedGoalPaths.size === c.goalIds.length &&
                        c.goalIds.every(id => this.selectedGoalPaths.has(id));
                    if (isActive) {
                        opt.selected = true;
                        activeIndex = idx;
                    }
                });

                const delBtn = selectWrap.createEl("button", { text: "✕", title: "Delete selected container" });
                delBtn.setAttribute("style", "background: transparent; border: 1px solid var(--background-modifier-border); color: var(--text-error); cursor: pointer; border-radius: 4px; padding: 0 8px;");
                delBtn.disabled = activeIndex === -1;
                if (activeIndex === -1) delBtn.style.opacity = "0.5";

                select.onchange = () => {
                    if (select.value === "") return;
                    const idx = parseInt(select.value, 10);
                    const c = containers[idx];
                    if (c) {
                        this.selectedGoalPaths = new Set(c.goalIds);
                        this.saveGoalFilters();
                        this.render();
                    }
                };

                delBtn.onclick = async () => {
                    if (select.value === "") return;
                    const idx = parseInt(select.value, 10);
                    const c = containers[idx];
                    if (c) {
                        await this.plugin.saveGoalContainers(containers.filter(x => x !== c));
                        this.render();
                    }
                };
            }

            const saveContainerBtn = filterWrap.createEl("button", { text: "+ Save selection as container", cls: "tq-add-parent-btn" });
            saveContainerBtn.setAttribute("style", "margin-top: 8px; font-size: 0.7rem;");
            if (currentGoalSelection.length === 0) {
                saveContainerBtn.disabled = true;
                saveContainerBtn.setAttribute("title", "Select one or more goals below first");
            }

            saveContainerBtn.onclick = () => {
                if (currentGoalSelection.length === 0) return;
                new TextPromptModal(this.app, "Container name...", async (name) => {
                    await this.plugin.saveGoalContainers([...containers, { name, goalIds: currentGoalSelection }]);
                    this.render();
                }).open();
            };

            const focusList = focusBody.createDiv("tq-scroll-list");
            focusList.setAttribute("style", "max-height: 220px;");

            const updateFocusList = () => {
                this.goalQuery = focusInput.value;
                focusList.empty();

                const allItem = focusList.createDiv("tq-goal-filter-item");
                const allCb = allItem.createEl("input", { type: "checkbox" });
                allCb.checked = this.selectedGoalPaths.has("all");
                const allSpan = allItem.createSpan({ text: "Show All Goals" });
                allSpan.style.fontWeight = "bold";
                allItem.onclick = () => {
                    if (this.selectedGoalPaths.has("all")) {
                        this.selectedGoalPaths.clear();
                    } else {
                        this.selectedGoalPaths.clear();
                        this.selectedGoalPaths.add("all");
                    }
                    this.saveGoalFilters();
                    this.render();
                };

                const matchingGoals = this.allNodes
                    .filter(n => n.isGoal && n.title.toLowerCase().includes(this.goalQuery.toLowerCase()));

                matchingGoals.forEach(n => {
                    const item = focusList.createDiv("tq-goal-filter-item");
                    const cb = item.createEl("input", { type: "checkbox" });
                    cb.checked = this.selectedGoalPaths.has(n.id);
                    item.createSpan({ text: n.title }).setAttribute("style", "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;");
                    item.onclick = () => {
                        this.selectedGoalPaths.delete("all");
                        if (this.selectedGoalPaths.has(n.id)) {
                            this.selectedGoalPaths.delete(n.id);
                        } else {
                            this.selectedGoalPaths.add(n.id);
                        }
                        this.saveGoalFilters();
                        this.render();
                    };
                });
            };

            focusInput.oninput = updateFocusList;
            updateFocusList();
        }

        const viewSec = panel.createDiv("tq-settings-section");
        const viewHeader = viewSec.createDiv("tq-settings-section-header");
        viewHeader.createSpan({ text: (this.viewSectionExpanded ? "▾ " : "▸ ") + "View Settings" });
        viewHeader.onclick = () => {
            this.viewSectionExpanded = !this.viewSectionExpanded;
            this.render();
        };

        if (this.viewSectionExpanded) {
            const viewBody = viewSec.createDiv("tq-settings-section-body");
            const distWrap = viewBody.createDiv("tq-search-container");

            distWrap.createSpan({ text: "Render distance", cls: "tq-view-settings-label" });
            const distInput = distWrap.createEl("input", { type: "number", cls: "tq-small-input" });
            distInput.value = String(this.renderDistance);
            distInput.min = "1";
            distInput.onchange = () => {
                const v = parseInt(distInput.value);
                if (!isNaN(v) && v > 0) {
                    this.renderDistance = v;
                    this.saveViewState();
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
                this.saveViewState();
                this.render();
            };
        }
    }

    private saveGoalFilters() {
        localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(Array.from(this.selectedGoalPaths)));
    }

    private saveViewState() {
        localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({
            scale: this.scale,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            renderDistance: this.renderDistance,
            hideCompletedCheckboxes: this.hideCompletedCheckboxes,
            depthExpandedIds: Array.from(this.depthExpandedIds)
        }));
    }

    public async render() {
        this.allNodes = this.plugin.taskCache.getGraphNodes();

        if (this.lastGraphRef !== this.allNodes) {
            this.nodeById.clear();
            for (const node of this.allNodes) {
                this.nodeById.set(node.id, node);
            }
        }

        const currentConfig = JSON.stringify({
            dist: this.renderDistance,
            hide: this.hideCompletedCheckboxes,
            goals: Array.from(this.selectedGoalPaths).sort(),
            hub: Array.from(this.expandedHubIds).sort(),
            depth: Array.from(this.depthExpandedIds).sort()
        });

        const dataChanged = this.lastGraphRef !== this.allNodes || this.lastRenderConfig !== currentConfig;

        if (dataChanged) {
            this.lastGraphRef = this.allNodes;
            this.lastRenderConfig = currentConfig;
            this.renderMemo.clear();

            let anchorNodes: GraphNode[];
            if (this.selectedGoalPaths.has("all")) {
                anchorNodes = this.allNodes.filter(n => n.isGoal);
            } else {
                anchorNodes = this.allNodes.filter(n => this.selectedGoalPaths.has(n.id));
            }
            const anchorNodeIds = new Set(anchorNodes.map(n => n.id));

            this.hubHiddenIds = this.computeHubHiddenIds(anchorNodeIds);
            
            const { nodes: withinRange, frontierCutoffCounts } = this.getNodesWithinDistance(anchorNodes, this.renderDistance, this.hubHiddenIds);
            this.frontierCutoffCounts = frontierCutoffCounts;
            this.visibleTasks = this.allNodes.filter(n => withinRange.has(n) && this.isRenderable(n) && !this.hubHiddenIds.has(n.id));
        }

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

        this.renderSidebar(sidebarInner);
        this.renderSettingsPanel(mapArea);

        if (dataChanged) {
            this.nodeElements.clear();

            let seed = 42;
            const rand = () => { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

            const center = { x: 1000, y: 1000 };
            let hasNewNodes = false;

            const newSiblingIndex = new Map<string, number>();

            this.visibleTasks.forEach(t => {
                if (!this.nodePositions.has(t.id)) {
                    hasNewNodes = true;
                }
            });

            if (hasNewNodes) {
                const maxLevel = Math.max(...this.visibleTasks.map(t => t.level), 0);
                
                for (let l = 0; l <= maxLevel; l++) {
                    const nodesInLayer = this.visibleTasks.filter(t => t.level === l && !this.nodePositions.has(t.id));
                    
                    nodesInLayer.forEach(t => {
                        let parentPos = null;
                        let parentId: string | null = null;
                        for (const parent of t.parents) {
                            if (this.nodePositions.has(parent.id)) {
                                parentPos = this.nodePositions.get(parent.id);
                                parentId = parent.id;
                                break;
                            }
                        }

                        if (parentPos && parentId) {
                            const idx = newSiblingIndex.get(parentId) ?? 0;
                            newSiblingIndex.set(parentId, idx + 1);
                            const angle = idx * 2.399963; 
                            const radius = 80 + Math.sqrt(idx) * 60; 

                            this.nodePositions.set(t.id, {
                                x: parentPos.x + Math.cos(angle) * radius,
                                y: parentPos.y + Math.sin(angle) * radius,
                                vx: 0,
                                vy: 0
                            });
                        } else {
                            this.nodePositions.set(t.id, {
                                x: center.x + (rand() - 0.5) * 200,
                                y: center.y + (rand() - 0.5) * 200,
                                vx: 0,
                                vy: 0
                            });
                        }
                    });

                    if (nodesInLayer.length > 0) {
                        for (let k = 0; k < 40; k++) {
                            this.calculatePhysicsStep(true); 
                        }
                    }
                }

                for (let k = 0; k < 100; k++) {
                    this.calculatePhysicsStep(true);
                }
            }
        }

        this.nodeElements.clear();

        this.visibleTasks.forEach(t => {
            const node = world.createDiv("tq-node");
            if (t.isGoal) node.classList.add("is-goal");
            if (t.id === this.activeNodeId) node.classList.add("is-active");
            if (t.status === "done") node.classList.add("is-done-node");
            if (t.kind === "checkbox") node.classList.add("is-checkbox-node");
            if (t.impact) node.classList.add(`impact-${t.impact}`);

            node.createDiv({ text: this.canvasTitle(t.title), cls: "tq-node-title" });

            const hubHiddenChildCount = t.children.filter(c => this.hubHiddenIds.has(c.id)).length;
            if (hubHiddenChildCount > 0) {
                const hubBadge = node.createDiv({ cls: "tq-hub-badge", text: `+${hubHiddenChildCount}` });
                hubBadge.onclick = (e) => {
                    e.stopPropagation();
                    this.expandedHubIds.add(t.id);
                    this.render();
                };
            } else if (this.expandedHubIds.has(t.id)) {
                const hubFoldBadge = node.createDiv({ cls: "tq-hub-fold-badge", text: "⌃" });
                hubFoldBadge.onclick = (e) => {
                    e.stopPropagation();
                    this.expandedHubIds.delete(t.id);
                    this.render();
                };
            }

            const depthHiddenCount = this.frontierCutoffCounts.get(t.id) ?? 0;
            if (depthHiddenCount > 0) {
                const depthBadge = node.createDiv({ cls: "tq-depth-badge", text: `⋯${depthHiddenCount}` });
                depthBadge.onclick = (e) => {
                    e.stopPropagation();
                    this.depthExpandedIds.add(t.id);
                    this.saveViewState();
                    this.render();
                };
            } else if (this.depthExpandedIds.has(t.id)) {
                const foldBadge = node.createDiv({ cls: "tq-depth-fold-badge", text: "⌃" });
                foldBadge.onclick = (e) => {
                    e.stopPropagation();
                    this.foldDepthBranch(t);
                    this.saveViewState();
                    this.render();
                };
            }

            this.nodeElements.set(t.id, node);

            node.onclick = (e) => {
                e.stopPropagation();
                if (e.metaKey || e.ctrlKey) {
                    this.openNodeInEditor(t);
                } else {
                    this.activeNodeId = t.id;
                    this.isCollapsed = false;
                    root.classList.remove("is-collapsed");
                    collapseBtn.innerText = "◀";
                    this.updateSelection(); 
                }
            };

            let isDraggingNode = false;
            let nodeStartX = 0, nodeStartY = 0;
            let pointerStartX = 0, pointerStartY = 0;

            node.onpointerdown = (pe) => {
                if ((pe.target as HTMLElement).closest(".tq-hub-badge, .tq-hub-fold-badge, .tq-depth-badge, .tq-depth-fold-badge")) return;

                pe.stopPropagation();
                isDraggingNode = true;
                this.draggedNodeId = t.id;
                const pos = this.nodePositions.get(t.id)!;
                nodeStartX = pos.x;
                nodeStartY = pos.y;
                pointerStartX = pe.clientX;
                pointerStartY = pe.clientY;
                node.setPointerCapture(pe.pointerId);
                this.startSimulation();
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
                    if (t.kind !== "file") return;
                    const childFile = this.app.vault.getAbstractFileByPath(payload.id);
                    if (childFile && childFile instanceof TFile) {
                        await this.app.fileManager.processFrontMatter(childFile, (fm) => {
                            let p = fm["parent"] || fm["parents"] || [];
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
                    const childNode = this.nodeById.get(payload.id) as CheckboxNode | undefined;
                    if (childNode) {
                        await this.plugin.taskCache.linkNodeToParent(childNode, t);
                        setTimeout(() => this.render(), 150);
                    }
                }
            });
        });

        updateWorldTransform();
        this.updateDomElements();

        mapArea.onclick = (e) => {
            if (this.wasDragged) {
                e.stopPropagation();
                return;
            }
            this.activeNodeId = null;
            this.updateSelection();
        };

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
                this.saveViewState();
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
            if ((e.target as HTMLElement).closest(".tq-settings-panel")) return;

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
                this.saveViewState();
            }
        };
        mapArea.addEventListener("wheel", handleWheel, { passive: false });

        this.startSimulation();
    }
}