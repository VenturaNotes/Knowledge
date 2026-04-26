"use strict";

const SKIP_PATHS =["Templates", "- Templates", "Archive"];
const FILTER_STORAGE_KEY = "tq-goals-graph-filters";
const VIEW_STORAGE_KEY = "tq-goals-graph-view-state";

async function collectTasks(app) {
    const allTasks =[];
    const titleToTask = new Map();
    const files = app.vault.getMarkdownFiles();

    for (const file of files) {
        if (SKIP_PATHS.some(p => file.path.includes(p))) continue;
        const cache = app.metadataCache.getFileCache(file);
        if (!cache) continue;

        const fm = cache.frontmatter || {};
        const cacheTags = (cache.tags ||[]).map(t => t.tag.toLowerCase());
        const fmTags = (Array.isArray(fm.tags) ? fm.tags : [fm.tags]).map(t => String(t).toLowerCase());
        const combinedTags =[...new Set([...cacheTags, ...fmTags])];
        
        const isTask = combinedTags.some(t => t.includes("task"));
        const isGoal = combinedTags.some(t => t.includes("goal"));
        
        if (!isTask && !isGoal) continue;
        if (["done", "canceled"].includes(String(fm.status || "").toLowerCase())) continue;

        const rawParent = fm.parent || [];
        const parentNames = (Array.isArray(rawParent) ? rawParent : [rawParent])
            .map(p => String(p).replace(/[\[\]]/g, "").split("|")[0].trim())
            .filter(p => p.length > 0);

        const task = {
            id: file.path,
            file: file,
            title: fm.title || file.basename,
            isGoal: isGoal,
            isTask: isTask,
            parentNames: parentNames,
            children: [], 
            parents:[],  
            level: 0
        };
        allTasks.push(task);
        titleToTask.set(task.title.toLowerCase().trim(), task);
        titleToTask.set(file.basename.toLowerCase().trim(), task);
    }

    allTasks.forEach(task => {
        task.parentNames.forEach(pName => {
            const parentObj = titleToTask.get(pName.toLowerCase());
            if (parentObj) {
                if (!parentObj.children.includes(task)) parentObj.children.push(task);
                if (!task.parents.includes(parentObj)) task.parents.push(parentObj);
            }
        });
    });

    let changed = true;
    while (changed) {
        changed = false;
        allTasks.forEach(task => {
            let maxParentLevel = -1;
            task.parents.forEach(p => { if (p.level > maxParentLevel) maxParentLevel = p.level; });
            if (maxParentLevel + 1 > task.level) { task.level = maxParentLevel + 1; changed = true; }
        });
    }
    return { allTasks };
}

const CSS = `
.tq-root { display: block; width: 100%; height: 100%; background: var(--background-primary); overflow: hidden; font-family: var(--font-interface); color: var(--text-normal); position: relative; }

.tq-sidebar { 
    position: absolute; left: 0; top: 0; bottom: 0; width: 300px; 
    border-right: 1px solid var(--background-modifier-border); 
    display: flex; flex-direction: column; background: var(--background-secondary); 
    z-index: 100; 
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, border-color 0.3s ease; 
    overflow: hidden; 
}
.tq-root.is-collapsed .tq-sidebar { width: 45px; background: transparent; border-right: 1px solid transparent; pointer-events: none; }

.tq-sidebar-inner { width: 300px; height: 100%; display: flex; flex-direction: column; transition: opacity 0.2s ease; }
.tq-root.is-collapsed .tq-sidebar-inner { opacity: 0; }

.tq-collapse-btn { 
    position: absolute; right: 10px; top: 7px; width: 26px; height: 26px; 
    display: flex; align-items: center; justify-content: center; 
    cursor: pointer; border-radius: 4px; background: var(--background-secondary); 
    border: 1px solid var(--background-modifier-border); font-size: 0.8rem; z-index: 110;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: auto;
}
.tq-collapse-btn:hover { background: var(--background-modifier-hover); }

.tq-main { 
    position: absolute; left: 0; top: 0; width: 100%; height: 100%; 
    display: flex; flex-direction: column; 
    transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding-left: 300px;
}
.tq-root.is-collapsed .tq-main { padding-left: 0; }

.tq-sidebar-section { display: flex; flex-direction: column; min-height: 0; flex: 1; border-bottom: 1px solid var(--background-modifier-border); }
.tq-sidebar-header { padding: 6px 10px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; opacity: 0.8; background: var(--background-secondary-alt); min-height: 40px; display: flex; align-items: center; white-space: nowrap; }
.tq-search-container { padding: 5px 10px; background: var(--background-secondary-alt); }
.tq-small-input { width: 100%; background: var(--background-primary); border: 1px solid var(--background-modifier-border); color: var(--text-normal); border-radius: 4px; padding: 4px 8px; font-size: 0.75rem; }
.tq-scroll-list { flex: 1; overflow-y: auto; padding: 10px; }

.tq-inspector-title { padding: 15px 10px; font-weight: bold; font-size: 1.1rem; border-bottom: 1px solid var(--background-modifier-border); color: var(--interactive-accent); text-align:center; }
.tq-back-btn { cursor: pointer; opacity: 0.6; font-size: 0.7rem; text-decoration: underline; margin-left: auto; margin-right: 35px; }

.tq-parent-pill { display: flex; justify-content: space-between; align-items: center; background: var(--background-primary); padding: 6px 10px; margin-bottom: 5px; border-radius: 4px; border: 1px solid var(--background-modifier-border); font-size: 0.85rem; }
.tq-remove-btn { cursor: pointer; color: var(--text-error); font-weight: bold; padding: 0 5px; }
.tq-add-parent-btn { width: 100%; margin-top: 10px; padding: 8px; cursor: pointer; background: var(--interactive-accent); color: white; border: none; border-radius: 4px; font-size: 0.8rem; }

.tq-map { flex: 1; position: relative; overflow: hidden; cursor: grab; touch-action: none; }
.tq-root.is-grabbing, .tq-root.is-grabbing * { cursor: grabbing !important; }

.tq-world { position: absolute; transform-origin: 0 0; width: 20000px; height: 10000px; }
.tq-svg { position: absolute; top: 0; left: 0; z-index: 5; pointer-events: none; }
.tq-node { position: absolute; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; cursor: pointer; z-index: 10; display: flex; flex-direction: column; padding: 10px; box-shadow: var(--shadow-s); transition: transform 0.2s ease, border 0.2s ease, background 0.2s ease; }
.tq-node:hover { border-color: var(--interactive-accent); background: var(--background-modifier-hover); }

.tq-node.is-goal { border-top: 3px solid var(--interactive-accent); background: var(--background-secondary-alt); }
.tq-node.is-active { border: 2px solid var(--interactive-accent); box-shadow: 0 0 10px var(--interactive-accent); }
.tq-node.drop-hover { border: 2px dashed var(--interactive-accent) !important; background: rgba(var(--interactive-accent-rgb), 0.15) !important; transform: scale(1.05); z-index: 20; }
.tq-node-title { font-size: 0.8rem; font-weight: 600; pointer-events: none; text-align: center; line-height: 1.2; }
.tq-line { stroke: var(--text-muted); stroke-width: 1.5; fill: none; opacity: 0.5; }
.tq-arrowhead { fill: var(--text-muted); opacity: 0.5; }

.tq-inbox-item { padding: 10px; margin-bottom: 8px; background: var(--background-primary); border-radius: 6px; font-size: 0.85rem; cursor: grab; border: 1px solid var(--background-modifier-border); box-shadow: var(--shadow-s); transition: border-color 0.2s ease; }
.tq-inbox-item:hover { border-color: var(--interactive-accent); }
.tq-goal-filter-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 0.85rem; cursor: pointer; }
`;

async function startDashboard(params, dashboardLeaf) {
    const { app, quickAddApi } = params;
    const container = dashboardLeaf.view.containerEl;
    container.empty();
    container.createEl("style", { text: CSS });

    const root = container.createDiv("tq-root");
    const main = root.createDiv("tq-main");
    const mapArea = main.createDiv("tq-map");
    const world = mapArea.createDiv("tq-world");
    
    const svg = world.createSvg("svg", { cls: "tq-svg" });
    svg.setAttribute("width", "20000"); svg.setAttribute("height", "10000");

    const sidebar = root.createDiv("tq-sidebar");
    const collapseBtn = sidebar.createDiv("tq-collapse-btn");
    collapseBtn.innerText = "◀";
    collapseBtn.onclick = () => {
        const isCollapsed = root.classList.toggle("is-collapsed");
        collapseBtn.innerText = isCollapsed ? "▶" : "◀";
    };

    const sidebarInner = sidebar.createDiv("tq-sidebar-inner");
    
    let allTasks =[];
    const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
    let selectedGoalPaths = new Set(savedFilters ? JSON.parse(savedFilters) : ["all"]);

    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
    const viewState = savedView ? JSON.parse(savedView) : { scale: 0.8, offsetX: 100, offsetY: 100 };
    
    let scale = viewState.scale;
    let offsetX = viewState.offsetX;
    let offsetY = viewState.offsetY;

    let activeNodeId = null;
    let goalQuery = "", inboxQuery = "";
    
    // ADDED BACK: Tracks the scroll position of the inbox list
    let lastInboxScroll = 0;

    const updateWorldTransform = () => {
        world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    const saveGoalFilters = () => {
        localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(Array.from(selectedGoalPaths)));
    };

    const saveViewState = () => {
        localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ scale, offsetX, offsetY }));
    };

    const renderSidebar = () => {
        // ADDED BACK: Capture the current scroll state before clearing the sidebar
        const existingInboxList = sidebarInner.querySelector(".tq-sidebar-section:first-child .tq-scroll-list");
        if (existingInboxList) {
            lastInboxScroll = existingInboxList.scrollTop;
        }

        sidebarInner.empty();
        if (activeNodeId) {
            const task = allTasks.find(t => t.id === activeNodeId);
            if (!task) { activeNodeId = null; renderSidebar(); return; }

            const header = sidebarInner.createDiv("tq-sidebar-header");
            header.createSpan({ text: "Node Inspector" });
            const back = header.createSpan({ text: "Close", cls: "tq-back-btn" });
            back.onclick = () => { activeNodeId = null; render(); };

            sidebarInner.createDiv({ text: task.title, cls: "tq-inspector-title" });
            const scroll = sidebarInner.createDiv("tq-scroll-list");
            scroll.createDiv({ text: "Current Parents", cls: "tq-sidebar-header", style: "background:transparent; padding: 10px 0;" });
            
            task.parentNames.forEach(pName => {
                const pill = scroll.createDiv("tq-parent-pill");
                pill.createSpan({ text: pName });
                const remove = pill.createSpan({ text: "✕", cls: "tq-remove-btn" });
                remove.onclick = async () => {
                    await app.fileManager.processFrontMatter(task.file, (fm) => {
                        let p = fm["parent"] ||[];
                        if (!Array.isArray(p)) p = [p];
                        fm["parent"] = p.filter(linkStr => {
                            const clean = String(linkStr).replace(/[\[\]]/g, "").split("|")[0].trim();
                            return clean.toLowerCase() !== pName.toLowerCase();
                        });
                    });
                    setTimeout(() => render(), 200);
                };
            });

            const addBtn = scroll.createEl("button", { text: "+ Add Parent", cls: "tq-add-parent-btn" });
            addBtn.onclick = async () => {
                const choices = allTasks.filter(t => t.id !== task.id).map(t => t.title);
                const choice = await quickAddApi.suggester(choices, choices);
                if (choice) {
                    await app.fileManager.processFrontMatter(task.file, (fm) => {
                        let p = fm["parent"] ||[];
                        if (!Array.isArray(p)) p = [p];
                        const link = `[[${choice}]]`;
                        if (!p.includes(link)) { p.push(link); fm["parent"] = p; }
                    });
                    setTimeout(() => render(), 200);
                }
            };
        } else {
            const inboxSec = sidebarInner.createDiv("tq-sidebar-section");
            const inboxHead = inboxSec.createDiv("tq-sidebar-header");
            const inboxTitle = inboxHead.createSpan();
            const inboxInput = inboxSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search inbox..." });
            inboxInput.value = inboxQuery;
            const inboxList = inboxSec.createDiv("tq-scroll-list");

            const goalSec = sidebarInner.createDiv("tq-sidebar-section");
            goalSec.createDiv("tq-sidebar-header").createSpan({ text: "Goal Filters" });
            const goalInput = goalSec.createDiv("tq-search-container").createEl("input", { cls: "tq-small-input", placeholder: "Search goals..." });
            goalInput.value = goalQuery;
            const goalList = goalSec.createDiv("tq-scroll-list");

            const updateInboxList = () => {
                inboxQuery = inboxInput.value;
                inboxList.empty();
                const unparented = allTasks.filter(t => t.isTask && !t.isGoal && t.parents.length === 0);
                const filtered = unparented.filter(t => t.title.toLowerCase().includes(inboxQuery.toLowerCase()));
                inboxTitle.innerText = `Task Inbox (${filtered.length})`;
                filtered.forEach(t => {
                    const item = inboxList.createDiv({ text: t.title, cls: "tq-inbox-item" });
                    item.draggable = true;
                    item.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", t.id));
                    item.onclick = (e) => {
                        if (e.metaKey || e.ctrlKey) { activeNodeId = t.id; root.classList.remove("is-collapsed"); render(); }
                        else app.workspace.getLeaf(false).openFile(t.file);
                    };
                });
                
                // ADDED BACK: Restore the saved scroll position
                inboxList.scrollTop = lastInboxScroll;
            };

            const updateGoalList = () => {
                goalQuery = goalInput.value;
                goalList.empty();
                const createFilter = (label, id) => {
                    const item = goalList.createDiv("tq-goal-filter-item");
                    const cb = item.createEl("input", { type: "checkbox" });
                    cb.checked = selectedGoalPaths.has(id);
                    item.createSpan({ text: label });
                    item.onclick = () => {
                        if (id === "all") { selectedGoalPaths.clear(); selectedGoalPaths.add("all"); }
                        else { 
                            selectedGoalPaths.delete("all");
                            selectedGoalPaths.has(id) ? selectedGoalPaths.delete(id) : selectedGoalPaths.add(id);
                            if (selectedGoalPaths.size === 0) selectedGoalPaths.add("all");
                        }
                        saveGoalFilters();
                        render();
                    };
                };
                createFilter("Show All Goals", "all");
                allTasks.filter(t => t.isGoal && t.title.toLowerCase().includes(goalQuery.toLowerCase())).forEach(g => createFilter(g.title, g.id));
            };

            inboxInput.oninput = updateInboxList;
            goalInput.oninput = updateGoalList;
            updateInboxList(); updateGoalList();
        }
    };

    const render = async () => {
        const data = await collectTasks(app);
        allTasks = data.allTasks;
        renderSidebar();

        svg.empty();
        world.querySelectorAll('.tq-node').forEach(n => n.remove());
        
        let visibleTasksSet = new Set();
        if (selectedGoalPaths.has("all")) {
            allTasks.filter(t => t.isGoal || t.parents.length > 0 || t.children.length > 0).forEach(t => visibleTasksSet.add(t));
        } else {
            selectedGoalPaths.forEach(id => {
                const rg = allTasks.find(t => t.id === id);
                if (rg) {
                    const walk = (n) => { if (!visibleTasksSet.has(n)) { visibleTasksSet.add(n); n.children.forEach(walk); } };
                    walk(rg);
                }
            });
        }

        const visibleTasks = Array.from(visibleTasksSet);
        const coords = new Map();
        const NODE_W = 160, NODE_H = 50;

        let seed = 42;
        function seededRandom() { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); }

        visibleTasks.forEach(t => {
            coords.set(t.id, { x: (seededRandom() - 0.5) * 1200, y: (seededRandom() - 0.5) * 1200, vx: 0, vy: 0 });
        });

        const ITERATIONS = 400;
        const SPRING_LEN = 130;
        const K_REPEL = 600000;
        const K_SPRING = 0.25;
        const DAMPING = 0.70;

        for (let iter = 0; iter < ITERATIONS; iter++) {
            for (let i = 0; i < visibleTasks.length; i++) {
                let t1 = visibleTasks[i]; let p1 = coords.get(t1.id);
                for (let j = i + 1; j < visibleTasks.length; j++) {
                    let t2 = visibleTasks[j]; let p2 = coords.get(t2.id);
                    let dx = p1.x - p2.x, dy = p1.y - p2.y;
                    let distSq = dx*dx + dy*dy;
                    if (distSq < 10) { dx = seededRandom() * 10 - 5; dy = seededRandom() * 10 - 5; distSq = dx*dx + dy*dy + 10; }
                    let forceMult = (t1.parents.length === 0 && t2.parents.length === 0) ? 5.0 : 1.0;
                    if (distSq < (3000000 * forceMult)) { 
                        let dist = Math.sqrt(distSq); let f = (K_REPEL * forceMult) / distSq;
                        p1.vx += (dx / dist) * f; p1.vy += (dy / dist) * f;
                        p2.vx -= (dx / dist) * f; p2.vy -= (dy / dist) * f;
                    }
                }
            }
            visibleTasks.forEach(parent => {
                let p1 = coords.get(parent.id);
                parent.children.forEach(child => {
                    if (!visibleTasksSet.has(child)) return;
                    let p2 = coords.get(child.id);
                    let dx = p2.x - p1.x, dy = p2.y - p1.y;
                    let dist = Math.sqrt(dx*dx + dy*dy) || 1;
                    let f = (dist - SPRING_LEN) * K_SPRING;
                    p2.vx -= (dx / dist) * f; p2.vy -= (dy / dist) * f;
                    p1.vx += (dx / dist) * f; p1.vy += (dy / dist) * f;
                });
            });
            visibleTasks.forEach(t => {
                let p = coords.get(t.id);
                let grav = t.parents.length === 0 ? 0.02 : 0.005;
                p.vx -= p.x * grav; p.vy -= p.y * grav;
                p.vx -= p.y * 0.005; p.vy += p.x * 0.005;
                p.x += p.vx; p.y += p.vy;
                p.vx *= DAMPING; p.vy *= DAMPING;
            });
        }

        let minX = Infinity, minY = Infinity;
        visibleTasks.forEach(t => {
            let p = coords.get(t.id);
            if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
        });
        visibleTasks.forEach(t => {
            let p = coords.get(t.id); p.x += (400 - minX); p.y += (400 - minY);
        });

        visibleTasks.forEach(t => {
            const pos = coords.get(t.id);
            const node = world.createDiv("tq-node");
            if (t.isGoal) node.classList.add("is-goal");
            if (t.id === activeNodeId) node.classList.add("is-active");
            node.style.width = `${NODE_W}px`;
            node.style.left = `${pos.x - NODE_W/2}px`; node.style.top = `${pos.y - NODE_H/2}px`;
            node.createDiv({ text: t.title, cls: "tq-node-title" });
            
            node.onclick = (e) => {
                e.stopPropagation();
                if (e.metaKey || e.ctrlKey) { activeNodeId = t.id; root.classList.remove("is-collapsed"); render(); }
                else app.workspace.getLeaf(false).openFile(t.file);
            };

            node.addEventListener("dragover", (e) => { 
                e.preventDefault(); 
                node.classList.add("drop-hover"); 
            });
            
            node.addEventListener("dragleave", () => node.classList.remove("drop-hover"));
            
            node.addEventListener("drop", async (e) => {
                e.preventDefault();
                node.classList.remove("drop-hover");
                const childId = e.dataTransfer.getData("text/plain");
                const childFile = app.vault.getAbstractFileByPath(childId);
                if (childFile) {
                    await app.fileManager.processFrontMatter(childFile, (fm) => { 
                        let p = fm["parent"] || [];
                        if (!Array.isArray(p)) p = [p];
                        const link = `[[${t.file.basename}]]`;
                        if (!p.includes(link)) { 
                            p.push(link); 
                            fm["parent"] = p; 
                        }
                    });
                    setTimeout(() => render(), 150);
                }
            });
        });

        // DRAWING EDGES MANUALLY WITH CALCULATED ARROWHEADS
        visibleTasks.forEach(parent => {
            const p = coords.get(parent.id);
            parent.children.forEach(child => {
                if (!visibleTasksSet.has(child)) return;
                const c = coords.get(child.id);
                
                const dx = p.x - c.x;
                const dy = p.y - c.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 20) return;

                // Intersection Logic for Rectangle
                const absDx = Math.max(Math.abs(dx), 0.001);
                const absDy = Math.max(Math.abs(dy), 0.001);
                const scaleToEdge = Math.min((NODE_W/2) / absDx, (NODE_H/2) / absDy);
                
                // Coordinates at the boundary of parent and child
                const startX = c.x + dx * scaleToEdge;
                const startY = c.y + dy * scaleToEdge;
                const endX = p.x - dx * scaleToEdge;
                const endY = p.y - dy * scaleToEdge;

                // Main Line
                const path = svg.createSvg("path", { cls: "tq-line" });
                path.setAttribute("d", `M ${startX} ${startY} L ${endX} ${endY}`);

                // Manual Arrowhead (Triangle)
                const arrowSize = 10;
                const ux = dx / dist; // Unit vector
                const uy = dy / dist;
                
                // Backtrack from end point to find base of triangle
                const baseCenterX = endX - ux * arrowSize;
                const baseCenterY = endY - uy * arrowSize;
                
                // Perpendicular vector for the "wings" of the triangle
                const perpX = -uy * (arrowSize * 0.6);
                const perpY = ux * (arrowSize * 0.6);
                
                const p1 = `${endX},${endY}`;
                const p2 = `${baseCenterX + perpX},${baseCenterY + perpY}`;
                const p3 = `${baseCenterX - perpX},${baseCenterY - perpY}`;

                const arrowhead = svg.createSvg("polygon", { cls: "tq-arrowhead" });
                arrowhead.setAttribute("points", `${p1} ${p2} ${p3}`);
            });
        });

        updateWorldTransform();
    };

    mapArea.onclick = () => { activeNodeId = null; render(); };

    let isPanning = false, sx, sy, moveTimeout;
    const endPanning = () => {
        if (isPanning) {
            isPanning = false; clearTimeout(moveTimeout);
            root.classList.remove("is-grabbing"); saveViewState();
        }
    };
    mapArea.onpointerdown = (e) => {
        if (e.target === mapArea || e.target === world || e.target === svg) {
            isPanning = true; sx = e.clientX; sy = e.clientY;
            mapArea.setPointerCapture(e.pointerId);
            root.classList.add("is-grabbing");
        }
    };
    window.onpointermove = (e) => {
        if (isPanning) {
            offsetX += e.clientX - sx; offsetY += e.clientY - sy;
            sx = e.clientX; sy = e.clientY;
            updateWorldTransform();
            root.classList.add("is-grabbing");
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => { if (isPanning) root.classList.remove("is-grabbing"); }, 100);
        }
    };
    window.onpointerup = endPanning;
    window.onpointercancel = endPanning;
    window.onblur = endPanning;

    mapArea.onwheel = (e) => {
        e.preventDefault();
        const rect = mapArea.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const zoom = e.deltaY > 0 ? 0.9 : 1.1;
        const oldS = scale;
        scale = Math.min(Math.max(0.1, scale * zoom), 4.0);
        if (scale !== oldS) {
            const ratio = scale / oldS;
            offsetX = mx - (mx - offsetX) * ratio;
            offsetY = my - (my - offsetY) * ratio;
            updateWorldTransform();
            saveViewState();
        }
    };

    render();
}

module.exports = async (params) => {
    const { app } = params;
    const leaf = app.workspace.getLeaf("tab");
    leaf.view.getDisplayText = () => "Goals Graph";
    if (leaf.updateHeader) leaf.updateHeader();
    app.workspace.trigger("view-titles-changed");
    await startDashboard(params, leaf);
};