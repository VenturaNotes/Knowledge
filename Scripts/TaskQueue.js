"use strict";

const SKIP_PATHS = ["Templates", "- Templates"];

async function collectTasks(app) {
    const allTasks = [];
    const titleToTask = new Map();

    // 1. Collect
    const files = app.vault.getMarkdownFiles();
    for (const file of files) {
        if (SKIP_PATHS.some(p => file.path.includes(p))) continue;
        const cache = app.metadataCache.getFileCache(file);
        if (!cache) continue;

        const fmTags = cache.frontmatter?.tags || [];
        const allTags = (Array.isArray(fmTags) ? fmTags : [fmTags]).map(t => String(t).toLowerCase());
        if (!allTags.some(t => t.includes("task"))) continue;

        const status = String(cache.frontmatter?.status || "").toLowerCase();
        if (status === "done" || status === "canceled") continue;

        const rawBlocked = cache.frontmatter?.blockedBy || cache.frontmatter?.["blocked-by"] || [];
        const blockedBy = (Array.isArray(rawBlocked) ? rawBlocked : [rawBlocked])
            .map(s => String(s).replace(/[\[\]"]/g, "").split("|")[0].trim());

        const task = {
            id: file.path,
            title: cache.frontmatter?.title || file.basename,
            priority: parseInt(cache.frontmatter?.priority) || 0,
            blockedBy: blockedBy.filter(b => b.length > 0),
            unlocks: [],
            parents: [],
            level: 0
        };
        allTasks.push(task);
        titleToTask.set(task.title.toLowerCase().trim(), task);
    }

    // 2. Link & Leveling
    allTasks.forEach(task => {
        task.blockedBy.forEach(bTitle => {
            const parent = titleToTask.get(bTitle.toLowerCase());
            if (parent) {
                parent.unlocks.push(task);
                task.parents.push(parent);
            }
        });
    });

    // Calculate hierarchy levels (Topological Sort)
    let changed = true;
    while (changed) {
        changed = false;
        allTasks.forEach(task => {
            let maxParentLevel = -1;
            task.parents.forEach(p => { if (p.level > maxParentLevel) maxParentLevel = p.level; });
            if (maxParentLevel + 1 > task.level) {
                task.level = maxParentLevel + 1;
                changed = true;
            }
        });
    }

    return allTasks;
}

const CSS = `
.tq-graph-container { 
    position: relative; width: 100%; height: 100%; 
    background: var(--background-primary); overflow: auto;
    font-family: var(--font-interface);
}
.tq-svg-layer { 
    position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1; 
}
.tq-node-layer { 
    position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; 
}
.tq-node {
    position: absolute; width: 180px; padding: 12px;
    background: var(--background-secondary); border: 1px solid var(--background-modifier-border);
    border-radius: 8px; cursor: pointer; text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
}
.tq-node:hover { transform: scale(1.05); z-index: 10; border-color: var(--interactive-accent); }

.tq-ready { border: 2px solid #4ade80; box-shadow: 0 0 10px rgba(74, 222, 128, 0.2); }
.tq-impact { border: 2px solid #fb923c; box-shadow: 0 0 15px rgba(251, 146, 60, 0.3); }
.tq-blocked { opacity: 0.7; border-style: dashed; }

.tq-title { font-size: 0.85rem; font-weight: 600; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; }
.tq-p-dot { position: absolute; top: 5px; right: 5px; width: 6px; height: 6px; border-radius: 50%; }

.tq-line { stroke: var(--background-modifier-border); stroke-width: 2; fill: none; }
.tq-line-active { stroke: var(--interactive-accent); opacity: 0.5; }
`;

async function startDashboard(app, leaf) {
    const containerEl = leaf.view.containerEl;
    containerEl.empty();
    containerEl.createEl("style", { text: CSS });

    const tasks = await collectTasks(app);
    const root = containerEl.createDiv("tq-graph-container");
    const svgLayer = root.createSvg("svg", { cls: "tq-svg-layer" });
    const nodeLayer = root.createDiv("tq-node-layer");

    // Layout Constants
    const HORIZ_GAP = 220;
    const VERT_GAP = 150;
    const NODE_WIDTH = 180;

    const levels = {};
    tasks.forEach(t => {
        if (!levels[t.level]) levels[t.level] = [];
        levels[t.level].push(t);
    });

    const taskCoords = new Map();

    // Position Nodes
    Object.keys(levels).forEach(lvl => {
        const levelTasks = levels[lvl];
        levelTasks.forEach((task, i) => {
            const x = i * HORIZ_GAP + 50;
            const y = lvl * VERT_GAP + 50;
            taskCoords.set(task.id, { x, y });

            const node = nodeLayer.createDiv("tq-node");
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;

            // Styling logic
            if (task.parents.length === 0) node.classList.add("tq-ready");
            else node.classList.add("tq-blocked");
            if (task.unlocks.length >= 2) node.classList.add("tq-impact");

            // Priority Dot
            const colors = ["transparent", "grey", "#ffab40", "#ff5252"];
            node.createDiv({ cls: "tq-p-dot" }).style.background = colors[task.priority] || "grey";

            node.createDiv({ text: task.title, cls: "tq-title" });
            
            node.onclick = () => app.workspace.getLeaf().openFile(app.vault.getAbstractFileByPath(task.id));
        });
    });

    // Resize SVG to fit content
    const maxLevels = Math.max(...tasks.map(t => t.level));
    const maxNodesInLevel = Math.max(...Object.values(levels).map(l => l.length));
    svgLayer.setAttribute("width", (maxNodesInLevel * HORIZ_GAP + 200).toString());
    svgLayer.setAttribute("height", (maxLevels * VERT_GAP + 200).toString());

    // Draw Lines
    tasks.forEach(parent => {
        const pCoord = taskCoords.get(parent.id);
        parent.unlocks.forEach(child => {
            const cCoord = taskCoords.get(child.id);
            const line = svgLayer.createSvg("path", { cls: "tq-line" });
            
            const x1 = pCoord.x + NODE_WIDTH / 2;
            const y1 = pCoord.y + 45; // Approx bottom of node
            const x2 = cCoord.x + NODE_WIDTH / 2;
            const y2 = cCoord.y; // Top of child node

            // Draw a curved path
            const midY = (y1 + y2) / 2;
            line.setAttribute("d", `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`);
        });
    });
}

module.exports = async (params) => {
    const { app } = params;
    const leaf = app.workspace.getLeaf("tab");
    app.workspace.setActiveLeaf(leaf, { focus: true });
    await startDashboard(app, leaf);
};