"use strict";

const PRIVATE_FOLDER = "Private";
const SKIP_FOLDERS = [];  // "Archive", "Templates"
const MAX_ITEMS_PER_DAY = 3; 

let currentMoment = window.moment(); 
let selectedDateItems = null; 
let selectedDateLabel = "";

const isOccurringOn = (rrule, dateMoment) => {
    if (!rrule) return false;
    if (rrule.includes("FREQ=YEARLY")) {
        const monthMatch = rrule.match(/BYMONTH=(\d+)/);
        const dayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
        if (monthMatch && dayMatch) {
            return (dateMoment.month() + 1 === parseInt(monthMatch[1]) && dateMoment.date() === parseInt(dayMatch[1]));
        }
    }
    if (rrule.includes("FREQ=WEEKLY")) {
        const dayMap = { SU:0, MO:1, TU:2, WE:3, TH:4, FR:5, SA:6 };
        const targetDayMatch = rrule.match(/BYDAY=([A-Z,]+)/);
        if (targetDayMatch) return targetDayMatch[1].split(',').some(d => dayMap[d] === dateMoment.day());
    }
    return false;
};

async function collectData(app) {
    const files = app.vault.getMarkdownFiles().filter(f => 
        f.path.includes(PRIVATE_FOLDER) && !SKIP_FOLDERS.some(skip => f.path.includes(skip))
    );
    
    const allItems = [];

    const parseTime = (tStr) => {
        if (!tStr) return "";
        const m = window.moment(tStr, ["HH:mm", "HH:mm:ss", "h:mmA", "h:mm A", "hh:mm a", "H:mm"]);
        return m.isValid() ? m.format("h:mmA") : "";
    };

    const cleanText = (t) => t
        .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "")
        .replace(/⏰\s*\d{1,2}:\d{2}(?:\s?[APMapm]{2})?/g, "")
        .replace(/✅\s*\d{4}-\d{2}-\d{2}/g, "")
        .replace(/(?:^|\s)(#[^\s#]+)/g, "") 
        .replace(/\s+/g, " ") 
        .trim();

    for (const file of files) {
        const cache = app.metadataCache.getFileCache(file);
        const fm = cache?.frontmatter || {};
        const rawFmTags = Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []);
        
        // Filter out "task" from project-level tags
        const projectTags = rawFmTags
            .filter(t => String(t).toLowerCase() !== "task")
            .map(t => String(t).startsWith('#') ? t : '#' + t)
            .join(" ");

        if (!rawFmTags.some(t => String(t).toLowerCase().includes("task"))) continue;

        const fileDateRaw = fm.scheduled || fm.due || fm.date;
        const fileDate = fileDateRaw ? window.moment(fileDateRaw).format("YYYY-MM-DD") : null;
        
        let fileTimeStr = fm.time || "";
        if (!fileTimeStr && typeof fileDateRaw === "string" && fileDateRaw.includes("T")) {
            fileTimeStr = fileDateRaw.split("T")[1];
        }

        const rrule = fm.recurrence || fm.RRULE || null;
        const isFileDone = ["done", "canceled"].includes(String(fm.status).toLowerCase());

        allItems.push({
            text: cleanText(fm.title || file.basename),
            status: isFileDone ? "x" : " ",
            date: fileDate,
            rrule: rrule,
            time: parseTime(fileTimeStr),
            tags: projectTags,
            line: 0, isProject: true, file: file.basename, path: file.path
        });

        const content = await app.vault.cachedRead(file);
        const lines = content.split("\n");

        lines.forEach((l, i) => {
            const m = l.match(/- \[(?<status>.)\] (?<text>.*)/);
            if (m) {
                const {status, text} = m.groups;
                const dM = text.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
                if (!dM) return; 

                // Extract tags and filter out #task
                const inlineTagsMatch = text.match(/(?:^|\s)(#[^\s#]+)/g);
                const inlineTags = inlineTagsMatch 
                    ? inlineTagsMatch.map(t => t.trim()).filter(t => t.toLowerCase() !== "#task").join(" ") 
                    : "";

                const tM = text.match(/⏰\s*(\d{1,2}:\d{2}(?:\s?[APMapm]{2})?)/);
                allItems.push({
                    text: cleanText(text),
                    status, 
                    date: dM[1], 
                    rrule: null, 
                    time: parseTime(tM ? tM[1] : null), 
                    tags: inlineTags,
                    line: i, isProject: false, file: file.basename, path: file.path
                });
            }
        });
    }
    return allItems;
}

const CSS = `
.v7-root { display: flex; height: 100%; background: var(--background-primary); font-family: var(--font-interface); overflow: hidden; color: var(--text-normal); }
.v7-main { flex: 1; display: flex; flex-direction: column; min-width: 0; border-right: 1px solid var(--background-modifier-border); }
.v7-nav { padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--background-modifier-border); }
.v7-month-title { font-size: 1.3rem; font-weight: bold; }
.v7-btn { background: var(--interactive-accent); color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.v7-btn:hover { filter: brightness(1.1); }
.v7-btn-warn { background: var(--text-error); margin-left: 10px; }
.v7-grid { flex-grow: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-template-rows: auto repeat(6, 1fr); background: var(--background-modifier-border); gap: 1px; }
.v7-weekday { background: var(--background-secondary); padding: 5px; text-align: center; font-size: 0.7rem; font-weight: bold; opacity: 0.6; }
.v7-day { background: var(--background-primary); padding: 4px; overflow: hidden; display: flex; flex-direction: column; gap: 2px; cursor: pointer; min-height: 0; transition: background 0.1s; }
.v7-day:hover { background: var(--background-secondary-alt); }
.v7-day.other-month { opacity: 0.3; }
.v7-day.is-today { background: var(--background-primary-alt); box-shadow: inset 0 0 0 2px var(--interactive-accent); }
.v7-day-num { font-size: 0.75rem; font-weight: bold; opacity: 0.5; margin-bottom: 2px; }
.v7-item { font-size: 0.7rem; padding: 2px 4px; border-radius: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); transition: transform 0.05s, border-color 0.1s; }
.v7-item:hover { border-color: var(--interactive-accent); background: var(--background-modifier-hover); transform: translateX(2px); }
.v7-item.is-project { border-left: 3px solid var(--interactive-accent); font-weight: bold; }
.v7-item.is-done, .v7-detail-card.is-done { 
    background-color: rgba(68, 188, 100, 0.15) !important; 
    border-color: var(--text-success) !important; 
    color: var(--text-success);
}
.v7-item.is-done { opacity: 0.7; }
.v7-more { font-size: 0.65rem; color: var(--interactive-accent); font-weight: bold; text-align: center; margin-top: 2px; }

.v7-panel { width: 350px; flex-shrink: 0; background: var(--background-secondary); display: flex; flex-direction: column; border-left: 1px solid var(--background-modifier-border); }
.v7-panel-header { padding: 15px; background: var(--background-secondary-alt); border-bottom: 1px solid var(--background-modifier-border); font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
.v7-panel-content { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.v7-detail-card { background: var(--background-primary); padding: 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); cursor: pointer; transition: border-color 0.1s, transform 0.1s; }
.v7-detail-card:hover { border-color: var(--interactive-accent); transform: scale(1.02); background: var(--background-modifier-hover); }

.v7-panel-divider {
    margin: 15px 0 5px 0;
    display: flex;
    align-items: center;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: bold;
}
.v7-panel-divider::after {
    content: "";
    flex: 1;
    margin-left: 10px;
    height: 1px;
    background: var(--background-modifier-border);
}

/* Bright tags styling */
.v7-tag-span {
    color: #ff9f0a; /* Bright orange - pops on both themes */
    font-weight: 600;
    margin-left: 6px;
    filter: brightness(1.2);
}
`;

function createItemEl(item, app, isPanel = false) {
    const isDone = item.status !== " ";
    const el = document.createElement("div");
    el.className = (isPanel ? "v7-detail-card" : "v7-item") + (item.isProject ? " is-project" : "") + (isDone ? " is-done" : "");
    
    const timeDisplay = item.time || "";
    
    if (isPanel) {
        // Updated: use class for brighter tags and metadata display
        const tagsHtml = item.tags ? `<span class="v7-tag-span">${item.tags}</span>` : "";
        
        el.innerHTML = `<div style="font-size:0.7rem; color:var(--text-accent)">${timeDisplay} ${item.isProject ? '◈ PROJECT' : '○ TASK'}</div>
                        <div style="font-weight:bold">${isDone ? '✓ ' : ''}${item.text}</div>
                        <div style="font-size:0.6rem; opacity:0.6; margin-top:5px; display:flex; align-items:center;">
                            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.file}</span>
                            ${tagsHtml}
                        </div>`;
    } else {
        el.innerHTML = `<span>${isDone ? '✓ ' : ''}${timeDisplay} ${item.text}</span>`;
    }

    el.onclick = (e) => {
        e.stopPropagation();
        const file = app.vault.getAbstractFileByPath(item.path);
        if (!file) return;
        app.workspace.getLeaf(false).openFile(file).then(() => {
            const ed = app.workspace.activeLeaf.view.editor;
            if(ed && item.line >= 0) {
                ed.setCursor({line: item.line, ch: 0});
                ed.scrollIntoView({from:{line:item.line,ch:0}, to:{line:item.line,ch:0}}, true);
            }
        });
    };
    return el;
}

async function render(params, leaf) {
    const { app } = params;
    const container = leaf.view.containerEl; container.empty();
    const style = document.createElement("style"); style.innerHTML = CSS; container.appendChild(style);

    const allData = await collectData(app);
    const root = container.createDiv("v7-root");
    const main = root.createDiv("v7-main");

    const nav = main.createDiv("v7-nav");
    const leftNav = nav.createDiv();
    const prevBtn = leftNav.createEl("button", { cls: "v7-btn", text: "＜" });
    const nextBtn = leftNav.createEl("button", { cls: "v7-btn", text: "＞" });
    
    nav.createDiv({ cls: "v7-month-title", text: currentMoment.format("MMMM YYYY") });
    
    const overdueItems = allData.filter(i => i.date && i.date < window.moment().format("YYYY-MM-DD") && i.status === " ");
    const overdueBtn = nav.createEl("button", { cls: "v7-btn v7-btn-warn", text: `🚨 Overdue: ${overdueItems.length}` });

    prevBtn.onclick = () => { currentMoment.subtract(1, 'month'); render(params, leaf); };
    nextBtn.onclick = () => { currentMoment.add(1, 'month'); render(params, leaf); };
    overdueBtn.onclick = () => {
        selectedDateItems = overdueItems;
        selectedDateLabel = "🚨 Overdue Tasks";
        render(params, leaf);
    };

    const grid = main.createDiv("v7-grid");
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(d => grid.createDiv({ cls: "v7-weekday", text: d }));

    const startOfGrid = currentMoment.clone().startOf('month').startOf('isoWeek');
    const endOfGrid = currentMoment.clone().endOf('month').endOf('isoWeek');

    let day = startOfGrid.clone();
    while (day.isBefore(endOfGrid) || day.isSame(endOfGrid, 'day')) {
        const dateStr = day.format("YYYY-MM-DD");
        const dayRef = day.clone();
        const isToday = day.isSame(window.moment(), 'day');
        const isOtherMonth = !day.isSame(currentMoment, 'month');

        const dayBox = grid.createDiv(`v7-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''}`);
        dayBox.createDiv({ cls: "v7-day-num", text: day.format("D") });

        const dayItems = allData.filter(i => i.date === dateStr || isOccurringOn(i.rrule, dayRef))
                                .sort((a,b) => {
                                    if (!a.time) return 1;
                                    if (!b.time) return -1;
                                    return window.moment(a.time, "h:mmA").diff(window.moment(b.time, "h:mmA"));
                                });
        
        dayItems.slice(0, MAX_ITEMS_PER_DAY).forEach(i => dayBox.appendChild(createItemEl(i, app)));
        
        if (dayItems.length > MAX_ITEMS_PER_DAY) {
            dayBox.createDiv({ cls: "v7-more", text: `+ ${dayItems.length - MAX_ITEMS_PER_DAY} more` });
        }

        dayBox.onclick = () => {
            selectedDateItems = dayItems;
            selectedDateLabel = dayRef.format("MMMM D, YYYY");
            render(params, leaf);
        };
        
        day.add(1, 'day');
    }

    if (selectedDateItems) {
        const panel = root.createDiv("v7-panel");
        const pHead = panel.createDiv("v7-panel-header");
        pHead.createSpan({ text: selectedDateLabel });
        const closeBtn = pHead.createEl("button", { cls: "v7-btn", text: "✕", style: "background:transparent; color:var(--text-muted)" });
        closeBtn.onclick = () => { selectedDateItems = null; render(params, leaf); };

        const pContent = panel.createDiv("v7-panel-content");
        
        if (selectedDateItems.length === 0) {
            pContent.createDiv({text: "No tasks for this day.", style: "opacity:0.5"});
        } else {
            const untimedItems = selectedDateItems.filter(i => !i.time);
            const timedItems = selectedDateItems.filter(i => i.time);

            untimedItems.forEach(i => pContent.appendChild(createItemEl(i, app, true)));

            if (untimedItems.length > 0 && timedItems.length > 0) {
                pContent.createDiv({ cls: "v7-panel-divider", text: "Scheduled" });
            }

            timedItems.forEach(i => pContent.appendChild(createItemEl(i, app, true)));
        }
    }
}

module.exports = async (params) => {
    const leaf = params.app.workspace.getLeaf("tab");
    await render(params, leaf);
}