import { ItemView, WorkspaceLeaf, SuggestModal, App, TFile } from "obsidian";
import ProgressPlannerPlugin from "../main";
import { TaskNode } from "../types";

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

export class DashboardView extends ItemView {
    private plugin: ProgressPlannerPlugin;
    private allTasks: TaskNode[] = [];
    private visibleTasks: TaskNode[] = [];
    private selectedGoalPaths: Set<string> = new Set(["all"]);
    private scale = 0.8;
    private offsetX = 100;
    private offsetY = 100;
    private activeNodeId: string | null = null;
    private goalQuery = "";
    private inboxQuery = "";
    private lastInboxScroll = 0;
    private isCollapsed = false;

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

        // 3. Radial centripetal gravity pull (anchors roots in center, branches float outwards)
        this.visibleTasks.forEach(t => {
            const p = coords.get(t.id);
            if (!p) return;

            if (t.id !== this.draggedNodeId) {
                const dx = center.x - p.x;
                const dy = center.y - p.y;

                // Root nodes (level 0) are pulled stronger to the center of the world.
                // Subtasks and leaves (level 1+) are pulled weaker so they orbit/branch outwards!
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
                    // Pushes coordinates apart immediately on overlap
                    const pushX = overlapX * 0.5;
                    const pushY = overlapY * 0.5;
                    const signX = dx >= 0 ? 1 : -1;
                    const signY = dy >= 0 ? 1 : -1;

                    if (overlapX < overlapY) {
                        if (t1.id !== this.draggedNodeId) p1.x += signX * pushX;
                        if (t2.id !== this.draggedNodeId) p2.x -= signX * pushX;
                        p1.vx *= 0.75; p2.vx *= 0.75; // Preserves inertia for smoother, quicker sliding
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

        // Apply updated coordinate values directly
        this.visibleTasks.forEach(t => {
            const pos = this.nodePositions.get(t.id);
            const nodeEl = this.nodeElements.get(t.id);
            if (pos && nodeEl) {
                nodeEl.style.width = `${NODE_W}px`;
                nodeEl.style.left = `${pos.x - NODE_W / 2}px`;
                nodeEl.style.top = `${pos.y - NODE_H / 2}px`;
            }
        });

        // Clear and redraw layout connection paths
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

                // Stop line at the base of the arrowhead instead of running it through the arrowhead
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

    public async render() {
        this.allTasks = this.plugin.taskCache.getDashboardTasks();

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
            localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ scale: this.scale, offsetX: this.offsetX, offsetY: this.offsetY }));
        };

        const renderSidebar = () => {
            const existingInboxList = sidebarInner.querySelector(".tq-sidebar-section:first-child .tq-scroll-list");
            if (existingInboxList) {
                this.lastInboxScroll = existingInboxList.scrollTop;
            }

            sidebarInner.empty();
            if (this.activeNodeId) {
                const task = this.allTasks.find(t => t.id === this.activeNodeId);
                if (!task) { this.activeNodeId = null; renderSidebar(); return; }

                const header = sidebarInner.createDiv("tq-sidebar-header");
                header.createSpan({ text: "Node Inspector" });
                const back = header.createSpan({ text: "Close", cls: "tq-back-btn" });
                back.onclick = () => { this.activeNodeId = null; this.render(); };

                sidebarInner.createDiv({ text: task.title, cls: "tq-inspector-title" });
                const scroll = sidebarInner.createDiv("tq-scroll-list");
                
                const customHeader = scroll.createDiv({ text: "Current Parents", cls: "tq-sidebar-header" });
                customHeader.setAttribute("style", "background:transparent; padding: 10px 0;");

                task.parentNames.forEach(pName => {
                    const pill = scroll.createDiv("tq-parent-pill");
                    pill.createSpan({ text: pName });
                    const remove = pill.createSpan({ text: "✕", cls: "tq-remove-btn" });
                    remove.onclick = async () => {
                        await this.app.fileManager.processFrontMatter(task.file, (fm) => {
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
                    const choices = this.allTasks.filter(t => t.id !== task.id).map(t => t.title);
                    new ParentSuggestModal(this.app, choices, async (choice) => {
                        if (choice) {
                            await this.app.fileManager.processFrontMatter(task.file, (fm) => {
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
                const inboxSec = sidebarInner.createDiv("tq-sidebar-section");
                const inboxHead = inboxSec.createDiv("tq-sidebar-header");
                const inboxTitle = inboxHead.createSpan();
                const inboxInput = inboxSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search inbox..." });
                inboxInput.value = this.inboxQuery;
                const inboxList = inboxSec.createDiv("tq-scroll-list");

                const goalSec = sidebarInner.createDiv("tq-sidebar-section");
                goalSec.createDiv("tq-sidebar-header").createSpan({ text: "Goal Filters" });
                const goalInput = goalSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search goals..." });
                goalInput.value = this.goalQuery;
                const goalList = goalSec.createDiv("tq-scroll-list");

                const updateInboxList = () => {
                    this.inboxQuery = inboxInput.value;
                    inboxList.empty();
                    const unparented = this.allTasks.filter(t => t.isTask && !t.isGoal && t.parents.length === 0);
                    const filtered = unparented.filter(t => t.title.toLowerCase().includes(this.inboxQuery.toLowerCase()));
                    inboxTitle.innerText = `Task Inbox (${filtered.length})`;
                    filtered.forEach(t => {
                        const item = inboxList.createDiv({ text: t.title, cls: "tq-inbox-item" });
                        item.draggable = true;
                        item.addEventListener("dragstart", (e: DragEvent) => {
                            if (e.dataTransfer) {
                                e.dataTransfer.setData("text/plain", t.id);
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
                                this.app.workspace.getLeaf(false).openFile(t.file);
                            }
                        };
                    });

                    inboxList.scrollTop = this.lastInboxScroll;
                };

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
                                this.selectedGoalPaths.clear();
                                this.selectedGoalPaths.add("all");
                            } else {
                                this.selectedGoalPaths.delete("all");
                                this.selectedGoalPaths.has(id) ? this.selectedGoalPaths.delete(id) : this.selectedGoalPaths.add(id);
                                if (this.selectedGoalPaths.size === 0) this.selectedGoalPaths.add("all");
                            }
                            saveGoalFilters();
                            this.render();
                        };
                    };
                    createFilter("Show All Goals", "all");
                    this.allTasks.filter(t => t.isGoal && t.title.toLowerCase().includes(this.goalQuery.toLowerCase())).forEach(g => createFilter(g.title, g.id));
                };

                inboxInput.oninput = updateInboxList;
                goalInput.oninput = updateGoalList;
                updateInboxList();
                updateGoalList();
            }
        };

        renderSidebar();

        const visibleTasksSet = new Set<TaskNode>();
        if (this.selectedGoalPaths.has("all")) {
            this.allTasks.filter(t => t.isGoal || t.parents.length > 0 || t.children.length > 0).forEach(t => visibleTasksSet.add(t));
        } else {
            this.selectedGoalPaths.forEach(id => {
                const rg = this.allTasks.find(t => t.id === id);
                if (rg) {
                    const walk = (n: TaskNode) => {
                        if (!visibleTasksSet.has(n)) {
                            visibleTasksSet.add(n);
                            n.children.forEach(walk);
                        }
                    };
                    walk(rg);
                }
            });
        }

        this.visibleTasks = Array.from(visibleTasksSet);
        this.nodeElements.clear();

        // 1. Maintain or assign positional tracking maps
        let seed = 42;
        function seededRandom() { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); }

        const center = { x: 1000, y: 1000 };
        let hasNewNodes = false;
        
        this.visibleTasks.forEach(t => {
            if (!this.nodePositions.has(t.id)) {
                hasNewNodes = true;

                // Find a parent node that already has a position assigned
                let parentPos = null;
                for (const parent of t.parents) {
                    if (this.nodePositions.has(parent.id)) {
                        parentPos = this.nodePositions.get(parent.id);
                        break;
                    }
                }

                if (parentPos) {
                    // Spawn children directly adjacent to their parents' current location.
                    // This allows them to untangle cleanly outward on their parent's side of the graph,
                    // preventing crossing-loops on initial load.
                    this.nodePositions.set(t.id, {
                        x: parentPos.x + (seededRandom() - 0.5) * 80,
                        y: parentPos.y + (seededRandom() - 0.5) * 80,
                        vx: 0,
                        vy: 0
                    });
                } else {
                    // Isolated or root nodes: Position around the center of the world
                    this.nodePositions.set(t.id, {
                        x: center.x + (seededRandom() - 0.5) * 200,
                        y: center.y + (seededRandom() - 0.5) * 200,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        });

        // 2. If new nodes are introduced, run a silent numerical pre-pass to separate them
        // before they are drawn on screen, eliminating the visible untangling delay
        if (hasNewNodes) {
            for (let k = 0; k < 150; k++) {
                this.calculatePhysicsStep();
            }
        }

        // 3. Build task node items
        this.visibleTasks.forEach(t => {
            const node = world.createDiv("tq-node");
            if (t.isGoal) node.classList.add("is-goal");
            if (t.id === this.activeNodeId) node.classList.add("is-active");
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
                    this.app.workspace.getLeaf(false).openFile(t.file);
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
                const childId = e.dataTransfer.getData("text/plain");
                const childFile = this.app.vault.getAbstractFileByPath(childId);
                if (childFile && childFile instanceof TFile) {
                    await this.app.fileManager.processFrontMatter(childFile, (fm) => {
                        let p = fm["parent"] || [];
                        if (!Array.isArray(p)) p = [p];
                        const link = `[[${t.file.basename}]]`;
                        if (!p.includes(link)) {
                            p.push(link);
                            fm["parent"] = p;
                        }
                    });
                    setTimeout(() => this.render(), 150);
                }
            });
        });

        updateWorldTransform();

        // 4. Setup Camera Panning
        mapArea.onclick = (e) => {
            if (this.wasDragged) {
                e.stopPropagation();
                return;
            }
            this.activeNodeId = null;
            this.render();
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

        // Initialize and fire continuous physics ticker loop
        this.startSimulation();
    }
}