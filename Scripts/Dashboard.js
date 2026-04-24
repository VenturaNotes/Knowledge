"use strict";

const SKIP_PATHS = ["Templates", "- Templates", "Archive"];

async function collectTasks(app) {
    const allTasks = [];
    const titleToTask = new Map();
    const files = app.vault.getMarkdownFiles();

    for (const file of files) {
        if (SKIP_PATHS.some(p => file.path.includes(p))) continue;
        const cache = app.metadataCache.getFileCache(file);
        if (!cache) continue;

        const fm = cache.frontmatter || {};
        const cacheTags = (cache.tags || []).map(t => t.tag.toLowerCase());
        const fmTags = (Array.isArray(fm.tags) ? fm.tags : [fm.tags]).map(t => String(t).toLowerCase());
        const combinedTags = [...new Set([...cacheTags, ...fmTags])];
        
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
            parents: [],  
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

.tq-map { flex: 1; position: relative; overflow: hidden; cursor: grab; }
.tq-world { position: absolute; transform-origin: 0 0; width: 20000px; height: 10000px; }

/* NODE STYLES */
.tq-node { 
    position: absolute; 
    background: var(--background-secondary); 
    border: 1px solid var(--background-modifier-border); 
    border-radius: 8px; 
    cursor: pointer; 
    z-index: 10; 
    display: flex; 
    flex-direction: column; 
    padding: 10px; 
    box-shadow: var(--shadow-s); 
    transition: transform 0.2s ease, border 0.2s ease, background 0.2s ease; 
}

/* THE HOVER EFFECT YOU ASKED FOR */
.tq-node:hover {
    border-color: var(--interactive-accent);
    background: var(--background-modifier-hover);
    transform: translateY(-2px); /* Slight lift to indicate it's active */
}

.tq-node.is-goal { border-top: 3px solid var(--interactive-accent); background: var(--background-secondary-alt); }
.tq-node.is-active { border: 2px solid var(--interactive-accent); box-shadow: 0 0 10px var(--interactive-accent); }
.tq-node.drop-hover { border: 2px dashed var(--interactive-accent) !important; background: rgba(var(--interactive-accent-rgb), 0.15) !important; transform: scale(1.05); z-index: 20; }
.tq-node-title { font-size: 0.8rem; font-weight: 600; pointer-events: none; text-align: center; line-height: 1.2; }
.tq-line { stroke: var(--background-modifier-border); stroke-width: 2; fill: none; opacity: 0.3; }

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
    
    let allTasks = [];
    let selectedGoalPaths = new Set(["all"]); 
    let activeNodeId = null;
    let goalQuery = "", inboxQuery = "";
    let scale = 0.8, offsetX = 100, offsetY = 100;

    const updateWorldTransform = () => {
        world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    const renderSidebar = () => {
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
                        let p = fm["parent"] || [];
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
                        let p = fm["parent"] || [];
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
                        if (e.metaKey || e.ctrlKey) { activeNodeId = t.id; render(); }
                        else app.workspace.getLeaf(false).openFile(t.file);
                    };
                });
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
                        render();
                    };
                };
                createFilter("Show All Goals", "all");
                allTasks.filter(t => t.isGoal && t.title.toLowerCase().includes(goalQuery.toLowerCase()))
                        .forEach(g => createFilter(g.title, g.id));
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

        world.querySelectorAll('.tq-node, .tq-line').forEach(n => n.remove());
        let visibleTasksSet = new Set();
        let roots = [];

        if (selectedGoalPaths.has("all")) {
            allTasks.filter(t => t.isGoal || t.parents.length > 0 || t.children.length > 0).forEach(t => visibleTasksSet.add(t));
            roots = allTasks.filter(t => t.parents.length === 0 && visibleTasksSet.has(t));
        } else {
            selectedGoalPaths.forEach(id => {
                const rg = allTasks.find(t => t.id === id);
                if (rg) {
                    const walk = (n) => { if (!visibleTasksSet.has(n)) { visibleTasksSet.add(n); n.children.forEach(walk); } };
                    roots.push(rg); walk(rg);
                }
            });
        }

        const visibleTasks = Array.from(visibleTasksSet);
        const coords = new Map();
        const NODE_W = 160, NODE_H = 50, HORIZ_GAP = 200, VERT_GAP = 120;
        let currentTreeX = 150;

        const initialPassX = (node) => {
            if (coords.has(node.id)) return coords.get(node.id).x;
            const validChildren = node.children.filter(c => visibleTasksSet.has(c));
            if (validChildren.length === 0) {
                const x = currentTreeX;
                coords.set(node.id, { x, y: node.level * VERT_GAP + 100 });
                currentTreeX += HORIZ_GAP;
                return x;
            } else {
                const childXs = validChildren.map(c => initialPassX(c));
                const minX = Math.min(...childXs);
                const maxX = Math.max(...childXs);
                const centerX = (minX + maxX) / 2;
                coords.set(node.id, { x: centerX, y: node.level * VERT_GAP + 100 });
                return centerX;
            }
        };

        roots.forEach(root => { initialPassX(root); currentTreeX += HORIZ_GAP; });

        const lvls = [...new Set(visibleTasks.map(t => t.level))].sort((a,b) => a-b);
        lvls.forEach(lvl => {
            const levelNodes = visibleTasks.filter(t => t.level === lvl).sort((a,b) => (coords.get(a.id)?.x || 0) - (coords.get(b.id)?.x || 0));
            for(let i=1; i<levelNodes.length; i++) {
                const prev = coords.get(levelNodes[i-1].id);
                const curr = coords.get(levelNodes[i].id);
                if (curr && prev && curr.x < prev.x + HORIZ_GAP) curr.x = prev.x + HORIZ_GAP;
            }
        });

        visibleTasks.forEach(t => {
            const pos = coords.get(t.id);
            if (!pos) return;
            const node = world.createDiv("tq-node");
            if (t.isGoal) node.classList.add("is-goal");
            if (t.id === activeNodeId) node.classList.add("is-active");
            node.style.width = `${NODE_W}px`;
            node.style.left = `${pos.x}px`; node.style.top = `${pos.y}px`;
            node.createDiv({ text: t.title, cls: "tq-node-title" });
            
            node.onclick = (e) => {
                e.stopPropagation();
                if (e.metaKey || e.ctrlKey) {
                    activeNodeId = t.id;
                    root.classList.remove("is-collapsed");
                    render();
                } else app.workspace.getLeaf(false).openFile(t.file);
            };

            node.addEventListener("dragover", (e) => { e.preventDefault(); node.classList.add("drop-hover"); });
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
                        if (!p.includes(link)) { p.push(link); fm["parent"] = p; }
                    });
                    setTimeout(() => render(), 150);
                }
            });
        });

        visibleTasks.forEach(parent => {
            const p = coords.get(parent.id);
            parent.children.forEach(child => {
                if (!visibleTasksSet.has(child)) return;
                const c = coords.get(child.id);
                if (!p || !c) return;
                const x1 = p.x + (NODE_W/2), y1 = p.y + NODE_H;
                const x2 = c.x + (NODE_W/2), y2 = c.y;
                const path = svg.createSvg("path", { cls: "tq-line" });
                path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${y1+40}, ${x2} ${y2-40}, ${x2} ${y2}`);
            });
        });

        updateWorldTransform();
    };

    mapArea.onclick = () => { activeNodeId = null; render(); };

    let isPanning = false, sx, sy;
    mapArea.onmousedown = (e) => { if (e.target === mapArea || e.target === world || e.target === svg) { isPanning = true; sx = e.clientX; sy = e.clientY; } };
    window.onmousemove = (e) => { if (isPanning) { offsetX += e.clientX - sx; offsetY += e.clientY - sy; sx = e.clientX; sy = e.clientY; updateWorldTransform(); } };
    window.onmouseup = () => isPanning = false;

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