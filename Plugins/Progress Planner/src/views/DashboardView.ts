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
    private inboxQuery = "";
    private checkboxInboxQuery = "";
    private lastInboxScroll = 0;
    private isCollapsed = false;

    private renderDistance = 6;
    private hideCompletedCheckboxes = true;

    private expandedHubIds: Set<string> = new Set();

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
        // Run live physics frame with rigid collisions enabled (false = not initial burst)
        const stillMoving = this.calculatePhysicsStep(false);
        this.updateDomElements();
        return stillMoving;
    }

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

    private hasIncompleteDescendant(node: GraphNode, memo: Map<string, boolean>): boolean {
        if (memo.has(node.id)) return memo.get(node.id)!;
        memo.set(node.id, false);
        const result = node.children.some(child => child.status !== "done" || this.hasIncompleteDescendant(child, memo));
        memo.set(node.id, result);
        return result;
    }

    private isRenderable(n: GraphNode, memo: Map<string, boolean>): boolean {
        const hasLink = n.isGoal || n.parents.length > 0 || n.children.length > 0;
        if (!hasLink) return false;

        if (n.status !== "done") return true;
        if (!this.hideCompletedCheckboxes) return true;

        return this.hasIncompleteDescendant(n, memo);
    }

    private impactRank(impact: string): number {
        if (impact === "high") return 3;
        if (impact === "medium") return 2;
        if (impact === "low") return 1;
        return 0;
    }

    private computeHubHiddenIds(withinRange: Set<GraphNode>): Set<string> {
        const threshold = this.plugin.settings.hubChildThreshold;
        const minRank = this.impactRank(this.plugin.settings.hubMinImpact);
        const hidden = new Set<string>();

        // 1. Mark low impact children under closed hubs
        this.allNodes.forEach(parent => {
            if (parent.children.length <= threshold) return;
            if (this.expandedHubIds.has(parent.id)) return;

            parent.children.forEach(child => {
                if (this.impactRank(child.impact) < minRank) {
                    hidden.add(child.id);
                }
            });
        });

        // 2. Rescue node subtrees if they have high impact children
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
            const node = this.allNodes.find(n => n.id === id);
            if (!node) return;

            const rescuedByNonHubParent = node.parents.some(p =>
                p.children.length <= threshold || this.expandedHubIds.has(p.id)
            );
            if (rescuedByNonHubParent || hasPassingDescendant(node)) {
                hidden.delete(id);
            }
        });

        // 3. Prevent Orphans: Propagate hidden status DOWNWARD to descendants of hidden nodes.
        let changed = true;
        while (changed) {
            changed = false;
            for (const node of this.allNodes) {
                if (hidden.has(node.id) || !withinRange.has(node) || node.isGoal) continue;

                if (node.parents.length > 0) {
                    const allParentsMissing = node.parents.every(p => hidden.has(p.id) || !withinRange.has(p));
                    if (allParentsMissing) {
                        hidden.add(node.id);
                        changed = true;
                    }
                }
            }
        }

        return hidden;
    }

    /**
     * @param isInitialBurst - If true, rigid overlap constraints are disabled (annealing).
     * This allows newly spawned layered nodes to pass through each other to find optimal spreads.
     */
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

        for (const p of coords.values()) {
            if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
                p.x = center.x;
                p.y = center.y;
                p.vx = 0;
                p.vy = 0;
            }
        }

        // 1. Repulsion forces
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

        // 2. Spring forces
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

        // 2.5 Edge-edge crossing repulsion
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

        // 3. Radial centripetal gravity
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

        // 4. Rigid push-out (Skipped during initial burst annealing to let nodes untangle)
        if (!isInitialBurst) {
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

        // 5. Idle check
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

        // We determine the direction the child is located relative to the parent and vice-versa
        edges.forEach((e, idx) => {
            const dx = e.p.x - e.c.x, dy = e.p.y - e.c.y; // Points from child TO parent
            const angleAtChild = Math.atan2(dy, dx);     
            const angleAtParent = Math.atan2(-dy, -dx);  

            if (!byNode.has(e.child.id)) byNode.set(e.child.id, []);
            byNode.get(e.child.id)!.push({ edgeIdx: idx, end: "child", angle: angleAtChild });

            if (!byNode.has(e.parent.id)) byNode.set(e.parent.id, []);
            byNode.get(e.parent.id)!.push({ edgeIdx: idx, end: "parent", angle: angleAtParent });
        });

        // Fan-out adjustments
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

            // 100% guarantee line draws from Child to Parent
            const startX = e.c.x + childExit.x;
            const startY = e.c.y + childExit.y;
            const endX = e.p.x + parentExit.x;
            const endY = e.p.y + parentExit.y;

            if (!Number.isFinite(startX) || !Number.isFinite(startY) || !Number.isFinite(endX) || !Number.isFinite(endY)) {
                return;
            }

            const dx = endX - startX, dy = endY - startY;
            const dist = Math.hypot(dx, dy);
            
            // Safeguard against overlapping nodes resulting in NaN drawing lines
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

    public async render() {
        this.allNodes = this.plugin.taskCache.getGraphNodes();
        let hubHiddenIds = new Set<string>();

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

                const isHub = task.children.length > this.plugin.settings.hubChildThreshold;
                const filteredChildren = task.children.filter(c => hubHiddenIds.has(c.id));
                if (isHub) {
                    const filteredHeader = scroll.createDiv({
                        text: filteredChildren.length > 0
                            ? `Filtered Children (${filteredChildren.length})`
                            : `Hub Children (${task.children.length})`,
                        cls: "tq-sidebar-header"
                    });
                    filteredHeader.setAttribute("style", "background:transparent; padding: 10px 0; margin-top: 10px;");

                    if (!this.expandedHubIds.has(task.id)) {
                        const expandBtn = scroll.createEl("button", { text: "Show all on canvas", cls: "tq-add-parent-btn" });
                        expandBtn.setAttribute("style", "margin-bottom: 8px; opacity: 0.85;");
                        expandBtn.onclick = () => {
                            this.expandedHubIds.add(task.id);
                            this.render();
                        };
                    } else {
                        const collapseBtnEl = scroll.createEl("button", { text: "Hide all on canvas", cls: "tq-add-parent-btn" });
                        collapseBtnEl.setAttribute("style", "margin-bottom: 8px; opacity: 0.85;");
                        collapseBtnEl.onclick = () => {
                            this.expandedHubIds.delete(task.id);
                            this.render();
                        };
                    }

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
                                    item.setText((c.kind === "checkbox" ? "☐ " : "") + c.title);
                                    item.onclick = () => this.openNodeInEditor(c);
                                });
                        };
                        filteredSearch.oninput = updateFilteredList;
                        updateFilteredList();
                    }
                }
            } else {
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
                                this.openNodeInEditor(t);
                            } else {
                                this.activeNodeId = t.id;
                                this.isCollapsed = false;
                                root.classList.remove("is-collapsed");
                                collapseBtn.innerText = "◀";
                                this.render();
                            }
                        };
                    });

                    inboxList.scrollTop = this.lastInboxScroll;
                };

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
                                this.openNodeInEditor(n);
                            } else {
                                this.activeNodeId = n.id;
                                this.isCollapsed = false;
                                root.classList.remove("is-collapsed");
                                collapseBtn.innerText = "◀";
                                this.render();
                            }
                        };
                    });
                };

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
                                if (this.selectedGoalPaths.has("all")) {
                                    this.selectedGoalPaths.clear();
                                } else {
                                    this.selectedGoalPaths.clear();
                                    this.selectedGoalPaths.add("all");
                                }
                            } else {
                                this.selectedGoalPaths.delete("all");
                                this.selectedGoalPaths.has(id) ? this.selectedGoalPaths.delete(id) : this.selectedGoalPaths.add(id);
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

        const memo = new Map<string, boolean>();
        let anchorNodes: GraphNode[];
        if (this.selectedGoalPaths.has("all")) {
            anchorNodes = this.allNodes.filter(n => n.isGoal);
        } else {
            anchorNodes = this.allNodes.filter(n => this.selectedGoalPaths.has(n.id));
        }
        
        const withinRange = this.getNodesWithinDistance(anchorNodes, this.renderDistance);
        hubHiddenIds = this.computeHubHiddenIds(withinRange);
        this.visibleTasks = this.allNodes.filter(n => withinRange.has(n) && this.isRenderable(n, memo) && !hubHiddenIds.has(n.id));

        renderSidebar();

        this.nodeElements.clear();

        let seed = 42;
        const rand = () => { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

        const center = { x: 1000, y: 1000 };
        let hasNewNodes = false;

        const newSiblingIndex = new Map<string, number>();

        // 1. Check for any missing nodes in nodePositions map
        this.visibleTasks.forEach(t => {
            if (!this.nodePositions.has(t.id)) {
                hasNewNodes = true;
            }
        });

        // 2. Sequential Layer Spawning & Annealing Burst 
        // We only perform this if new nodes are being added (e.g., unfolding a hub or starting the plugin).
        if (hasNewNodes) {
            const maxLevel = Math.max(...this.visibleTasks.map(t => t.level), 0);
            
            for (let l = 0; l <= maxLevel; l++) {
                const nodesInLayer = this.visibleTasks.filter(t => t.level === l && !this.nodePositions.has(t.id));
                
                nodesInLayer.forEach(t => {
                    let parentPos = null;
                    let parentId: string | null = null;
                    // Find the deepest parent already spawned
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
                        const angle = idx * 2.399963; // Golden angle
                        const radius = 80 + Math.sqrt(idx) * 60; // Widen spiral radius

                        this.nodePositions.set(t.id, {
                            x: parentPos.x + Math.cos(angle) * radius,
                            y: parentPos.y + Math.sin(angle) * radius,
                            vx: 0,
                            vy: 0
                        });
                    } else {
                        // Root nodes or orphans placed near the center
                        this.nodePositions.set(t.id, {
                            x: center.x + (rand() - 0.5) * 200,
                            y: center.y + (rand() - 0.5) * 200,
                            vx: 0,
                            vy: 0
                        });
                    }
                });

                // Run an annealing physics burst for THIS layer.
                // Annealing = passing true, which disables rigid box collision allowing nodes to slide through each other.
                if (nodesInLayer.length > 0) {
                    for (let k = 0; k < 40; k++) {
                        this.calculatePhysicsStep(true); 
                    }
                }
            }

            // Final settling burst for all newly spawned layers acting together
            for (let k = 0; k < 100; k++) {
                this.calculatePhysicsStep(true);
            }
        }

        // 3. Render HTML Nodes
        this.visibleTasks.forEach(t => {
            const node = world.createDiv("tq-node");
            if (t.isGoal) node.classList.add("is-goal");
            if (t.id === this.activeNodeId) node.classList.add("is-active");
            if (t.status === "done") node.classList.add("is-done-node");
            if (t.kind === "checkbox") node.classList.add("is-checkbox-node");
            if (t.impact) node.classList.add(`impact-${t.impact}`);

            node.createDiv({ text: this.canvasTitle(t.title), cls: "tq-node-title" });

            const hubHiddenChildCount = t.children.filter(c => hubHiddenIds.has(c.id)).length;
            if (hubHiddenChildCount > 0) {
                const hubBadge = node.createDiv({ cls: "tq-hub-badge", text: `+${hubHiddenChildCount}` });
                hubBadge.onclick = (e) => {
                    e.stopPropagation();
                    this.expandedHubIds.add(t.id);
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
                    this.render();
                }
            };

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
                    const childNode = this.allNodes.find(n => n.id === payload.id) as CheckboxNode | undefined;
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
            this.render();
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