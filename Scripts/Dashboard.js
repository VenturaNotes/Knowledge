"use strict";

const SKIP_PATHS = ["Templates", "- Templates"];

async function collectTasks(app) {
    const allTasks = [];
    const titleToTask = new Map();
    const files = app.vault.getMarkdownFiles();

    for (const file of files) {
        if (SKIP_PATHS.some(p => file.path.includes(p))) continue;
        const cache = app.metadataCache.getFileCache(file);
        if (!cache) continue;

        const fmTags = cache.frontmatter?.tags || [];
        const allTags = (Array.isArray(fmTags) ? fmTags : [fmTags]).map(t => String(t).toLowerCase());
        if (!allTags.some(t => t.includes("task"))) continue;
        if (["done", "canceled"].includes(String(cache.frontmatter?.status || "").toLowerCase())) continue;

        const rawBlocked = cache.frontmatter?.blockedBy || cache.frontmatter?.["blocked-by"] || [];
        const blockedBy = (Array.isArray(rawBlocked) ? rawBlocked : [rawBlocked])
            .map(s => String(s).replace(/[\[\]"]/g, "").split("|")[0].trim());

        const task = {
            id: file.path,
            file: file,
            title: cache.frontmatter?.title || file.basename,
            priority: parseInt(cache.frontmatter?.priority) || 0,
            tags: allTags.filter(t => t !== "task"),
            blockedBy: blockedBy.filter(b => b.length > 0),
            unlocks: [],
            parents: [],
            level: 0
        };
        allTasks.push(task);
        titleToTask.set(task.title.toLowerCase().trim(), task);
    }

    allTasks.forEach(task => {
        task.blockedBy.forEach(bTitle => {
            const parent = titleToTask.get(bTitle.toLowerCase());
            if (parent) { parent.unlocks.push(task); task.parents.push(parent); }
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
    return { allTasks, titleToTask };
}

async function updateYAML(app, file, key, value) {
    await app.fileManager.processFrontMatter(file, (fm) => {
        fm[key] = value;
    });
}

const CSS = `
.tq-root { display: flex; width: 100%; height: 100%; background: var(--background-primary); overflow: hidden; font-family: var(--font-interface); }
.tq-sidebar { width: 320px; border-right: 1px solid var(--background-modifier-border); display: flex; flex-direction: column; background: var(--background-secondary); z-index: 20; }
.tq-sidebar-header { padding: 12px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; opacity: 0.5; border-bottom: 1px solid var(--background-modifier-border); background: var(--background-secondary-alt); }
.tq-inbox { flex: 1; overflow-y: auto; padding: 10px; }
.tq-inbox-item { padding: 10px; margin-bottom: 6px; background: var(--background-primary); border-radius: 6px; font-size: 0.85rem; cursor: pointer; border: 1px solid var(--background-modifier-border); }
.tq-inbox-item.selected { border-color: var(--interactive-accent); background: rgba(var(--interactive-accent-rgb), 0.1); }
.tq-bases-editor { padding: 18px; background: var(--background-secondary-alt); border-top: 2px solid var(--background-modifier-border); display: flex; flex-direction: column; gap: 12px; }
.tq-field { display: flex; flex-direction: column; gap: 5px; }
.tq-field label { font-size: 0.65rem; font-weight: bold; opacity: 0.5; text-transform: uppercase; }
.tq-field input, .tq-field select { background: var(--background-primary); border: 1px solid var(--background-modifier-border); color: var(--text-normal); padding: 5px; border-radius: 4px; font-size: 0.8rem; }

.tq-map { flex: 1; position: relative; overflow: hidden; background: var(--background-primary); cursor: grab; }
.tq-map:active { cursor: grabbing; }
.tq-world { position: absolute; transform-origin: 0 0; width: 10000px; height: 10000px; pointer-events: auto; }
.tq-node { position: absolute; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 10px; cursor: pointer; z-index: 10; box-shadow: var(--shadow-s); display: flex; align-items: center; justify-content: center; padding: 10px; pointer-events: auto; transition: opacity 0.3s; }

.tq-ready { border: 2px solid var(--text-success); box-shadow: 0 0 15px rgba(74, 222, 128, 0.1); opacity: 1; }
.tq-blocked { opacity: 0.45; border-style: dashed; }
.tq-blocked:hover { opacity: 0.8; }

.tq-node-title { font-size: 0.85rem; font-weight: 600; text-align: center; pointer-events: none; color: var(--text-normal); line-height: 1.2; }
.tq-line { stroke: var(--background-modifier-border); stroke-width: 2.5; fill: none; opacity: 0.7; }
.tq-arrowhead { fill: var(--background-modifier-border); opacity: 0.9; }
.tq-priority-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; }
`;

async function startDashboard(app, dashboardLeaf) {
    const container = dashboardLeaf.view.containerEl;
    container.empty();
    container.createEl("style", { text: CSS });

    const root = container.createDiv("tq-root");
    const sidebar = root.createDiv("tq-sidebar");
    const mapArea = root.createDiv("tq-map");
    const world = mapArea.createDiv("tq-world");
    const svg = world.createSvg("svg", { cls: "tq-svg" });
    svg.setAttribute("width", "10000"); svg.setAttribute("height", "10000");

    let allTasks = [];
    let selectedTask = null;
    let scale = 0.8, offsetX = 0, offsetY = 0;

    const openInNewTab = async (file) => {
        const newLeaf = app.workspace.createLeafInParent(dashboardLeaf.parent, dashboardLeaf.parent.children.length);
        await newLeaf.openFile(file);
    };

    const render = async () => {
        const data = await collectTasks(app);
        allTasks = data.allTasks;

        sidebar.empty();
        sidebar.createDiv({ text: "Inbox (Unlinked)", cls: "tq-sidebar-header" });
        const inbox = sidebar.createDiv("tq-inbox");
        
        const unlinked = allTasks.filter(t => t.parents.length === 0 && t.unlocks.length === 0);
        unlinked.forEach(t => {
            const item = inbox.createDiv({ text: t.title, cls: "tq-inbox-item" });
            if (selectedTask?.id === t.id) item.classList.add("selected");
            item.onclick = () => { selectedTask = t; render(); };
        });

        if (selectedTask) {
            sidebar.createDiv({ text: "Triage Properties", cls: "tq-sidebar-header" });
            const editor = sidebar.createDiv("tq-bases-editor");
            const pF = editor.createDiv("tq-field");
            pF.createEl("label", { text: "Priority" });
            const pS = pF.createEl("select");
            [0,1,2,3].forEach(v => pS.createEl("option", { text: `P${v}`, value: v }));
            pS.value = selectedTask.priority;
            pS.onchange = async () => { await updateYAML(app, selectedTask.file, "priority", parseInt(pS.value)); render(); };

            const bF = editor.createDiv("tq-field");
            bF.createEl("label", { text: "Blocked By" });
            const bI = bF.createEl("input", { value: selectedTask.blockedBy.join(", ") });
            bI.onblur = async () => {
                const val = bI.value.split(",").map(s => s.trim()).filter(s => s);
                await updateYAML(app, selectedTask.file, "blockedBy", val);
                render();
            };
            const openBtn = editor.createEl("button", { text: "Open Note ↗", style: "margin-top:5px; cursor:pointer;" });
            openBtn.onclick = () => openInNewTab(selectedTask.file);
        }

        // --- MAP RENDER (SUMMIT VIEW) ---
        world.querySelectorAll('.tq-node, .tq-line, .tq-arrowhead').forEach(n => n.remove());
        const treeTasks = allTasks.filter(t => t.parents.length > 0 || t.unlocks.length > 0);
        if (treeTasks.length === 0) return;

        const nodeCount = treeTasks.length;
        const NODE_W = nodeCount > 50 ? 140 : (nodeCount > 20 ? 160 : 180);
        const NODE_H = nodeCount > 50 ? 50 : 60;
        const HORIZ_GAP = NODE_W + (nodeCount > 50 ? 30 : 60);
        const VERT_GAP = NODE_H + (nodeCount > 50 ? 80 : 120);

        const coords = new Map();
        const levels = {};
        treeTasks.forEach(t => { if (!levels[t.level]) levels[t.level] = []; levels[t.level].push(t); });

        const maxLevel = Math.max(...treeTasks.map(t => t.level));
        const maxNodesInLevel = Math.max(...Object.values(levels).map(l => l.length));

        Object.keys(levels).forEach(lvl => {
            levels[lvl].forEach((t, i) => {
                const x = i * HORIZ_GAP + 100;
                const y = (maxLevel - t.level) * VERT_GAP + 100; 
                coords.set(t.id, { x, y });

                const node = world.createDiv("tq-node");
                node.style.width = `${NODE_W}px`;
                node.style.height = `${NODE_H}px`;
                node.style.left = `${x}px`; node.style.top = `${y}px`;
                
                // DIMMING LOGIC
                if (t.level === 0) node.classList.add("tq-ready");
                else node.classList.add("tq-blocked");

                const colors = ["transparent", "var(--text-muted)", "var(--text-warning)", "var(--text-error)"];
                node.createDiv({ cls: "tq-priority-dot" }).style.background = colors[t.priority] || "grey";
                node.createDiv({ text: t.title, cls: "tq-node-title" });
                node.onclick = () => openInNewTab(t.file);
            });
        });

        // --- ARROW LOGIC (Pointing UP from Foundation to Goal) ---
        treeTasks.forEach(parent => {
            const p = coords.get(parent.id);
            parent.unlocks.forEach(child => {
                const c = coords.get(child.id);
                
                // Ensure perfect center-alignment
                const x1 = p.x + (NODE_W / 2);
                const y1 = p.y; 
                const x2 = c.x + (NODE_W / 2);
                const y2 = c.y + NODE_H + 3; // Gap for the arrow base

                const path = svg.createSvg("path", { cls: "tq-line" });
                path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${y1-60}, ${x2} ${y2+60}, ${x2} ${y2}`);

                const arrowSize = 14;
                const triangle = svg.createSvg("polygon", { cls: "tq-arrowhead" });
                const points = [
                    `${x2},${y2-2}`,                     // Tip
                    `${x2 - arrowSize/2},${y2 + arrowSize}`, // Left
                    `${x2 + arrowSize/2},${y2 + arrowSize}`  // Right
                ].join(" ");
                triangle.setAttribute("points", points);
            });
        });

        // --- AUTO-FIT ON LOAD ---
        const graphW = maxNodesInLevel * HORIZ_GAP;
        const graphH = (maxLevel + 1) * VERT_GAP;
        const viewW = mapArea.clientWidth;
        const viewH = mapArea.clientHeight;

        const scaleW = (viewW - 100) / graphW;
        const scaleH = (viewH - 100) / graphH;
        scale = Math.min(scaleW, scaleH, 1.0);
        if (scale < 0.2) scale = 0.2;

        offsetX = (viewW - (graphW * scale)) / 2;
        offsetY = (viewH - (graphH * scale)) / 2;
        world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    // --- PAN/ZOOM (ZOOM TO CURSOR) ---
    let isPanning = false, startX, startY;
    mapArea.onmousedown = (e) => { 
        if (e.target.closest('.tq-node') || e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;
        isPanning = true; startX = e.clientX; startY = e.clientY;
        mapArea.style.cursor = 'grabbing';
    };

    window.onmousemove = (e) => { 
        if (!isPanning) return;
        offsetX += e.clientX - startX; offsetY += e.clientY - startY; 
        startX = e.clientX; startY = e.clientY; 
        world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    window.onmouseup = () => { isPanning = false; mapArea.style.cursor = 'grab'; };

    mapArea.onwheel = (e) => {
        e.preventDefault();
        const rect = mapArea.getBoundingClientRect();
        
        // Mouse position relative to the mapArea
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // "World" coordinates under the mouse (before new scale)
        const worldX = (mouseX - offsetX) / scale;
        const worldY = (mouseY - offsetY) / scale;

        // Apply new scale
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(0.1, scale * delta), 4.0);

        // Adjust offsets so the world point stays under the mouse
        offsetX = mouseX - worldX * newScale;
        offsetY = mouseY - worldY * newScale;
        scale = newScale;

        world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    };

    render();
    setTimeout(render, 100);
}

module.exports = async (params) => {
    const { app } = params;
    const leaf = app.workspace.getLeaf("tab");
    leaf.view.getDisplayText = () => "Dashboard";
    leaf.getDisplayText = () => "Dashboard";
    if (leaf.updateHeader) leaf.updateHeader();
    app.workspace.trigger("view-titles-changed");
    app.workspace.setActiveLeaf(leaf, { focus: true });
    await startDashboard(app, leaf);
};