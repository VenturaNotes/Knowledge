"use strict";

// ── Parser & Serializer ───────────────────────────────────────────────────────

function parseWorkout(content) {
  const lines = content.split("\n");
  const items = [];
  let currentSection = "General";

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    // Detect section headers (e.g. ## Workout 1)
    const headerMatch = raw.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      currentSection = headerMatch[2].trim();
      continue;
    }

    // Match task checkbox: - [ ] (2) Title: Details
    const taskMatch = raw.match(/^(\s*)-\s+\[([ xX])\]\s*(?:\((\d+)\)\s*)?(.*)$/);
    if (taskMatch) {
      const indent = taskMatch[1];
      const isChecked = taskMatch[2].toLowerCase() === "x";
      const count = taskMatch[3] ? parseInt(taskMatch[3], 10) : 1;
      const body = taskMatch[4].trim();

      // Separate exercise name and weight/rep details by first colon
      let title = body;
      let details = "";
      const colonIndex = body.indexOf(":");
      if (colonIndex !== -1) {
        title = body.slice(0, colonIndex).trim();
        details = body.slice(colonIndex + 1).trim();
      }

      // Collect indented sub-bullet notes
      const notes = [];
      let nextLineIndex = i + 1;
      while (nextLineIndex < lines.length) {
        const nextRaw = lines[nextLineIndex];
        if (nextRaw.match(/^(\s{2,}|\t+)-\s+.+/)) {
          notes.push(nextRaw.trim().replace(/^-\s+/, ""));
          nextLineIndex++;
        } else {
          break;
        }
      }

      items.push({
        lineIndex: i,
        indent,
        section: currentSection,
        checked: isChecked,
        count: count,
        title,
        details,
        notes
      });
    }
  }

  return { lines, items };
}

function serializeItem(item) {
  const checkStr = item.checked ? "x" : " ";
  const countStr = item.count > 1 ? `(${item.count}) ` : "";
  const detailsStr = item.details ? `: ${item.details}` : "";
  return `${item.indent}- [${checkStr}] ${countStr}${item.title}${detailsStr}`;
}

async function saveWorkoutFile(app, file, lines, items) {
  for (const item of items) {
    lines[item.lineIndex] = serializeItem(item);
  }
  const newContent = lines.join("\n");
  await app.vault.modify(file, newContent);
}

// ── CSS Styles ────────────────────────────────────────────────────────────────

const CSS = `
.gt-root {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--background-primary);
  font-family: var(--font-interface, sans-serif);
  overflow: hidden;
  z-index: 5;
}

.gt-header {
  flex: 0 0 auto;
  padding: 12px 18px;
  background: var(--background-secondary);
  border-bottom: 1px solid var(--background-modifier-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Timer Stats Display */
.gt-timer-card {
  background: var(--background-primary-alt);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gt-timer-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.gt-timer-set {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-normal);
}

.gt-timer-time {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--interactive-accent);
  font-family: var(--font-monospace);
}

.gt-timer-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.gt-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.gt-progress-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.gt-controls {
  display: flex;
  gap: 8px;
}

.gt-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--background-modifier-border);
  background: var(--interactive-normal);
  color: var(--text-normal);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.gt-btn:hover { background: var(--interactive-hover); }

/* Scrollable Exercise List Body */
.gt-body {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gt-container {
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.gt-section-header {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-muted);
  border-bottom: 2px solid var(--background-modifier-border);
  padding-bottom: 4px;
  margin-top: 10px;
}

.gt-card {
  background: var(--background-primary-alt);
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gt-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.gt-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.gt-check-box {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  background: var(--background-primary);
  font-weight: bold;
}

.gt-card.gt-done .gt-check-box {
  background: var(--text-success, #4caf50);
  border-color: var(--text-success, #4caf50);
  color: white;
}

.gt-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-normal);
  line-height: 1.3;
}

.gt-badge {
  background: #f59e0b;
  color: #000;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 12px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.gt-details-input {
  width: 100%;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.92rem;
  color: var(--text-normal);
  font-family: var(--font-monospace);
}

.gt-details-input:focus {
  border-color: var(--interactive-accent);
  outline: none;
}

.gt-notes {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-style: italic;
  padding-left: 6px;
  border-left: 2px solid var(--background-modifier-border);
}

/* Sticky Bottom Footer for Phone Thumb Navigation */
.gt-footer {
  flex: 0 0 auto;
  padding: 12px 18px;
  background: var(--background-secondary);
  border-top: 1px solid var(--background-modifier-border);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.gt-timer-btn-bottom {
  flex: 1;
  padding: 12px 10px;
  border-radius: 8px;
  border: 1px solid var(--background-modifier-border);
  background: var(--interactive-normal);
  color: var(--text-normal);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.gt-timer-btn-bottom:hover {
  background: var(--interactive-hover);
}

.gt-timer-btn-primary {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border: none;
}
`;

function injectStyles() {
  const ID = "gt-styles-v3";
  if (!document.getElementById(ID)) {
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

// ── UI Renderer ───────────────────────────────────────────────────────────────

async function startGymSession(app, file, leaf) {
  injectStyles();

  let content = await app.vault.read(file);
  let { lines, items } = parseWorkout(content);

  const containerEl = leaf.view.containerEl;
  containerEl.empty();

  let pane = containerEl;
  while (pane && !pane.classList.contains("workspace-leaf-content")) {
    pane = pane.parentElement;
  }
  if (!pane) pane = containerEl.parentElement || containerEl;
  if (getComputedStyle(pane).position === "static") pane.style.position = "relative";

  const root = pane.appendChild(document.createElement("div"));
  root.className = "gt-root";

  // 1. Header (Top Stats + Controls)
  const header = root.appendChild(document.createElement("div"));
  header.className = "gt-header";

  // 2. Body (Middle Scrollable Exercise List)
  const body = root.appendChild(document.createElement("div"));
  body.className = "gt-body";

  const container = body.appendChild(document.createElement("div"));
  container.className = "gt-container";

  // 3. Footer (Bottom Sticky Phone Controls)
  const footer = root.appendChild(document.createElement("div"));
  footer.className = "gt-footer";

  let showCompleted = false;

  // ── 48-Set Timer State ──────────────────────────────────────────────────────
  const TOTAL_SETS = 48;
  const SET_DURATION = 75; // 75 seconds per set
  
  let currentSet = 1;
  let secondsLeftInSet = SET_DURATION;
  let isRunning = true; // Auto-start on launch!
  let timerInterval = null;

  // Timer Top Display Card
  const timerCard = header.appendChild(document.createElement("div"));
  timerCard.className = "gt-timer-card";

  const timerStats = timerCard.appendChild(document.createElement("div"));
  timerStats.className = "gt-timer-stats";

  const setEl = timerStats.appendChild(document.createElement("div"));
  setEl.className = "gt-timer-set";

  const timeEl = timerStats.appendChild(document.createElement("div"));
  timeEl.className = "gt-timer-time";

  const metaEl = timerCard.appendChild(document.createElement("div"));
  metaEl.className = "gt-timer-meta";

  const totalLeftEl = metaEl.appendChild(document.createElement("span"));
  const finishTimeEl = metaEl.appendChild(document.createElement("span"));

  // Bottom Footer Timer Controls
  const prevBtn = footer.appendChild(document.createElement("button"));
  prevBtn.className = "gt-timer-btn-bottom";
  prevBtn.textContent = "⏪ Prev Set";

  const playBtn = footer.appendChild(document.createElement("button"));
  playBtn.className = "gt-timer-btn-bottom gt-timer-btn-primary";

  const nextBtn = footer.appendChild(document.createElement("button"));
  nextBtn.className = "gt-timer-btn-bottom";
  nextBtn.textContent = "Next Set ⏩";

  // Updates timer display text without interrupting exercise card scrolling/inputs
  function updateTimerUI() {
    setEl.textContent = `Set ${currentSet}/${TOTAL_SETS}`;
    
    const m = Math.floor(secondsLeftInSet / 60);
    const s = secondsLeftInSet % 60;
    timeEl.textContent = `${m}m ${s < 10 ? '0' : ''}${s}s`;

    const totalRemainingSec = ((TOTAL_SETS - currentSet) * SET_DURATION) + secondsLeftInSet;
    const totalM = Math.floor(totalRemainingSec / 60);
    const totalS = totalRemainingSec % 60;
    totalLeftEl.textContent = `⏱️ ${totalM}m ${totalS > 0 ? totalS + 's' : ''} left`;

    const finishDate = new Date(Date.now() + totalRemainingSec * 1000);
    finishTimeEl.textContent = `🏁 Finish: ${finishDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

    playBtn.textContent = isRunning ? "⏸ Pause" : "▶ Start";
  }

  function tick() {
    if (secondsLeftInSet > 0) {
      secondsLeftInSet--;
    } else {
      if (currentSet < TOTAL_SETS) {
        currentSet++;
        secondsLeftInSet = SET_DURATION;
      } else {
        isRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
    updateTimerUI();
  }

  // Auto-start timer immediately
  timerInterval = setInterval(tick, 1000);

  playBtn.onclick = () => {
    isRunning = !isRunning;
    if (isRunning && !timerInterval) {
      timerInterval = setInterval(tick, 1000);
    } else if (!isRunning && timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    updateTimerUI();
  };

  nextBtn.onclick = () => {
    if (currentSet < TOTAL_SETS) {
      currentSet++;
      secondsLeftInSet = SET_DURATION;
      updateTimerUI();
    }
  };

  prevBtn.onclick = () => {
    if (currentSet > 1) {
      currentSet--;
      secondsLeftInSet = SET_DURATION;
      updateTimerUI();
    }
  };

  updateTimerUI();

  // Clean up timer interval if tab is closed
  const _origDetach = leaf.detach.bind(leaf);
  leaf.detach = () => {
    if (timerInterval) clearInterval(timerInterval);
    _origDetach();
  };

  // ── Exercise List Header Controls ───────────────────────────────────────────
  const progressRow = header.appendChild(document.createElement("div"));
  progressRow.className = "gt-progress-row";

  const pSub = progressRow.appendChild(document.createElement("div"));
  pSub.className = "gt-progress-sub";

  const controls = progressRow.appendChild(document.createElement("div"));
  controls.className = "gt-controls";

  const toggleBtn = controls.appendChild(document.createElement("button"));
  toggleBtn.className = "gt-btn";
  toggleBtn.textContent = "Show Done";
  toggleBtn.onclick = () => {
    showCompleted = !showCompleted;
    toggleBtn.textContent = showCompleted ? "Hide Done" : "Show Done";
    renderUI();
  };

  const resetBtn = controls.appendChild(document.createElement("button"));
  resetBtn.className = "gt-btn";
  resetBtn.textContent = "Reset Cycle";
  resetBtn.onclick = async () => {
    if (!confirm("Reset cycle? Completed items will uncheck, and skipped items will get a (+1) badge.")) return;
    
    for (const item of items) {
      if (item.checked) {
        item.checked = false;
        item.count = 1;
      } else {
        item.count += 1;
      }
    }
    await saveWorkoutFile(app, file, lines, items);
    renderUI();
  };

  // Render Exercise Cards
  function renderUI() {
    container.innerHTML = "";

    const activeCount = items.filter(i => !i.checked).length;
    pSub.textContent = `${activeCount} exercises remaining in queue`;

    const sections = {};
    for (const item of items) {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    }

    for (const [sectionName, sectionItems] of Object.entries(sections)) {
      const visibleItems = sectionItems.filter(i => showCompleted || !i.checked);
      if (visibleItems.length === 0) continue;

      const secHeader = container.appendChild(document.createElement("div"));
      secHeader.className = "gt-section-header";
      secHeader.textContent = sectionName;

      for (const item of visibleItems) {
        const card = container.appendChild(document.createElement("div"));
        card.className = "gt-card" + (item.checked ? " gt-done" : "");

        const cardTop = card.appendChild(document.createElement("div"));
        cardTop.className = "gt-card-top";

        const titleGroup = cardTop.appendChild(document.createElement("div"));
        titleGroup.className = "gt-title-group";

        const checkBox = titleGroup.appendChild(document.createElement("div"));
        checkBox.className = "gt-check-box";
        checkBox.textContent = item.checked ? "✓" : "";

        const handleTap = async () => {
          if (item.checked) {
            item.checked = false;
          } else if (item.count > 1) {
            item.count -= 1;
          } else {
            item.checked = true;
          }
          await saveWorkoutFile(app, file, lines, items);
          renderUI();
        };

        checkBox.onclick = (e) => { e.stopPropagation(); handleTap(); };
        titleGroup.onclick = handleTap;

        const titleEl = titleGroup.appendChild(document.createElement("div"));
        titleEl.className = "gt-card-title";
        titleEl.textContent = item.title;

        if (item.count > 1 && !item.checked) {
          const badge = cardTop.appendChild(document.createElement("div"));
          badge.className = "gt-badge";
          badge.textContent = `${item.count} LEFT`;
        }

        const input = card.appendChild(document.createElement("input"));
        input.className = "gt-details-input";
        input.type = "text";
        input.value = item.details;
        input.placeholder = "Weight / Reps";

        input.onchange = async () => {
          item.details = input.value.trim();
          await saveWorkoutFile(app, file, lines, items);
        };

        if (item.notes.length > 0) {
          const notesEl = card.appendChild(document.createElement("div"));
          notesEl.className = "gt-notes";
          notesEl.textContent = item.notes.join(" • ");
        }
      }
    }
  }

  renderUI();
}

// ── Entry Point for ScriptRunner ──────────────────────────────────────────────

function setTabTitle(leaf, title) {
  try {
    let leafEl = leaf.view.containerEl;
    while (leafEl && !leafEl.classList.contains("workspace-leaf")) {
      leafEl = leafEl.parentElement;
    }
    if (leafEl) {
      const tabsEl = leafEl.parentElement;
      if (tabsEl) {
        const headers = tabsEl.querySelectorAll(".workspace-tab-header");
        const idx = Array.from(tabsEl.querySelectorAll(".workspace-leaf")).indexOf(leafEl);
        if (headers[idx]) {
          const titleEl = headers[idx].querySelector(".workspace-tab-header-inner-title");
          if (titleEl) { titleEl.textContent = title; return; }
        }
      }
    }
  } catch(e) {}

  try {
    const titleEl = leaf.tabHeaderEl?.querySelector(".workspace-tab-header-inner-title");
    if (titleEl) { titleEl.textContent = title; return; }
  } catch(e) {}

  try {
    leaf.view.getDisplayText = () => title;
    app.workspace.trigger("layout-change");
  } catch(e) {}
}

module.exports = async (params) => {
  const { app } = params;
  const file = app.workspace.getActiveFile();
  if (!file) return;

  const leaf = app.workspace.getLeaf("tab");
  app.workspace.setActiveLeaf(leaf, { focus: true });

  setTabTitle(leaf, "Gym Tracker");
  setTimeout(() => setTabTitle(leaf, "Gym Tracker"), 100);

  startGymSession(app, file, leaf);
};