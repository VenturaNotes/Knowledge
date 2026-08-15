"use strict";

// ── Audio Beep Generator ──────────────────────────────────────────────────────
let audioCtx = null;
function playBeep(freq = 600, duration = 0.15) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

// ── Parser & Serializer ───────────────────────────────────────────────────────

function parseWorkout(content) {
  const lines = content.split("\n");
  const items = [];
  let currentSection = "General";

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    const headerMatch = raw.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      currentSection = headerMatch[2].trim();
      continue;
    }

    let lineToParse = raw;
    let reps = 0;
    let hasRepTag = false;
    
    const repMatch = lineToParse.match(/\{(\d+)\/\d+\}\s*$/);
    if (repMatch) {
      reps = parseInt(repMatch[1], 10);
      if (reps > 36) reps = 36; 
      hasRepTag = true;
      lineToParse = lineToParse.slice(0, repMatch.index).trim();
    }

    const taskMatch = lineToParse.match(/^(\s*)-\s+\[([ xX])\]\s*(?:\(([^)]+)\)\s*|\[([^\]]+)\]\s*)?(.*)$/i);
    if (taskMatch) {
      const indent = taskMatch[1];
      const isChecked = taskMatch[2].toLowerCase() === "x";
      const prefix = (taskMatch[3] || taskMatch[4] || "").trim().toLowerCase();
      const body = taskMatch[5].trim();

      let count = 1;
      let baseCount = 1;

      if (prefix) {
        if (prefix.includes("/")) {
          const parts = prefix.split("/");
          count = parseInt(parts[0], 10) || 1;
          baseCount = parseInt(parts[1], 10) || 1;
        } else if (prefix.startsWith("x") || prefix.endsWith("x")) {
          baseCount = parseInt(prefix.replace("x", ""), 10) || 1;
          count = isChecked ? 0 : baseCount;
        } else {
          const num = parseInt(prefix, 10) || 1;
          count = num;
          baseCount = 1;
        }
      }
      if (isChecked) count = 0;

      let bodyToParse = body;
      let repsPerSet = 3;
      
      // Extract ratio tag FIRST so its inner colon doesn't interfere with title/details colon
      const ratioMatch = bodyToParse.match(/\[([\d.]+):1\]/);
      if (ratioMatch) {
        repsPerSet = parseFloat(ratioMatch[1]) || 3;
        bodyToParse = bodyToParse.replace(ratioMatch[0], "").trim();
      }

      let title = bodyToParse;
      let details1 = "";
      let details2 = "";
      
      const colonIndex = bodyToParse.indexOf(":");
      if (colonIndex !== -1) {
        title = bodyToParse.slice(0, colonIndex).trim();
        const rawDetails = bodyToParse.slice(colonIndex + 1).trim();
        
        // Split by hyphen for the two input fields
        const dashIndex = rawDetails.indexOf("-");
        if (dashIndex !== -1) {
          details1 = rawDetails.slice(0, dashIndex).trim();
          details2 = rawDetails.slice(dashIndex + 1).trim();
        } else {
          details1 = rawDetails;
        }
      }

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
        baseCount,
        count,
        title,
        details1,
        details2,
        notes,
        reps,
        repsPerSet,
        hasRepTag,
        isExpanded: false,
        justUndone: false
      });
    }
  }

  return { lines, items };
}

function serializeItem(item) {
  const checkStr = item.checked ? "x" : " ";
  let countStr = "";

  if (item.checked) {
    if (item.baseCount > 1) countStr = `(${item.baseCount}/${item.baseCount}) `;
  } else {
    if (item.baseCount > 1) {
      countStr = `(${item.count}/${item.baseCount}) `;
    } else {
      if (item.count > 1) countStr = `(${item.count}) `;
    }
  }

  const ratioStr = item.repsPerSet !== 3 ? ` [${item.repsPerSet}:1]` : "";
  
  let combinedDetails = "";
  if (item.details1 && item.details2) {
    combinedDetails = `${item.details1} - ${item.details2}`;
  } else if (item.details1) {
    combinedDetails = item.details1;
  } else if (item.details2) {
    combinedDetails = item.details2;
  }
  const detailsStr = combinedDetails ? `: ${combinedDetails}` : "";
  
  const repTagStr = (item.reps > 0 || item.hasRepTag) ? ` {${item.reps}/36}` : "";
  
  return `${item.indent}- [${checkStr}] ${countStr}${item.title}${ratioStr}${detailsStr}${repTagStr}`;
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
.gt-root { position: absolute; inset: 0; display: flex; flex-direction: column; background: var(--background-primary); font-family: var(--font-interface, sans-serif); overflow: hidden; z-index: 5; }

/* Top Header */
.gt-header { flex: 0 0 auto; padding: 32px 18px 12px 18px; background: var(--background-secondary); border-bottom: 1px solid var(--background-modifier-border); display: flex; flex-direction: column; gap: 10px; }
.gt-timer-card { background: var(--background-primary-alt); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }

/* CSS Grid for perfect centering of stats */
.gt-timer-stats { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; width: 100%; gap: 8px; }
.gt-timer-set { font-size: 0.88rem; font-weight: 800; color: var(--text-normal); text-align: left; }
.gt-timer-earned { font-size: 1.05rem; font-weight: 800; color: #4caf50; text-align: center; white-space: nowrap; }
.gt-timer-time { font-size: 0.95rem; font-weight: 800; color: var(--interactive-accent); font-family: var(--font-monospace); text-align: right; }

.gt-timer-meta { font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; gap: 12px; }

/* Controls Row */
.gt-controls-row { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-top: 2px; }
.gt-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--interactive-normal); color: var(--text-normal); font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.gt-btn:hover { background: var(--interactive-hover); }

/* Scrollable Body */
.gt-body { flex: 1 1 0; min-height: 0; overflow-y: auto; padding: 16px 20px 40px; display: flex; flex-direction: column; align-items: center; }
.gt-container { width: min(760px, 100%); display: flex; flex-direction: column; gap: 1.25rem; }

/* Exercise Cards */
.gt-card { background: var(--background-primary-alt); border: 1px solid var(--background-modifier-border); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; position: relative; transition: all 0.2s ease-out; }
.gt-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.gt-title-group { display: flex; align-items: flex-start; gap: 10px; flex: 1; }
.gt-check-box { width: 28px; height: 28px; border-radius: 6px; border: 2px solid var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; background: var(--background-primary); font-weight: bold; font-size: 1.1rem; margin-top: 1px; transition: all 0.15s ease-out; }
.gt-card.gt-done .gt-check-box { background: var(--text-success, #4caf50); border-color: var(--text-success, #4caf50); color: white; }
.gt-card-title { font-size: 1.05rem; font-weight: 700; color: var(--text-normal); line-height: 1.3; margin-top: 3px;}

/* Animations for Completion States & Undo */
@keyframes gt-flash-undo-full {
  0% { transform: scale(1); background: rgba(245, 158, 11, 0.4); border-color: #f59e0b; }
  50% { transform: scale(1.02); background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; }
  100% { transform: scale(1); background: var(--background-primary-alt); border-color: var(--background-modifier-border); }
}
@keyframes gt-flash-undo-partial {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); background: var(--background-primary-alt); }
  50% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); background: rgba(245, 158, 11, 0.1); border-color: #f59e0b; }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); background: var(--background-primary-alt); }
}
@keyframes gt-pulse-partial {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); background: var(--background-primary-alt); }
  50% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); background: rgba(76, 175, 80, 0.1); border-color: #4caf50; }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); background: var(--background-primary-alt); }
}
@keyframes gt-flash-complete {
  0% { transform: scale(1); opacity: 1; background: var(--background-primary-alt); }
  40% { transform: scale(1.02); opacity: 1; background: rgba(76, 175, 80, 0.2); border-color: #4caf50; }
  100% { transform: scale(0.9); opacity: 0; background: rgba(76, 175, 80, 0.3); border-color: transparent; }
}

.gt-anim-undo-full { animation: gt-flash-undo-full 0.45s ease-out forwards; }
.gt-anim-undo-partial { animation: gt-flash-undo-partial 0.45s ease-out forwards; }
.gt-anim-partial { animation: gt-pulse-partial 0.4s ease-out forwards; }
.gt-anim-complete { animation: gt-flash-complete 0.4s ease-out forwards; pointer-events: none; }

/* Top Right Group inside Card */
.gt-top-right-group { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-top: 4px; }
.gt-badge { background: #f59e0b; color: #000; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 12px; letter-spacing: 0.04em; white-space: nowrap; }
.gt-expand-btn { background: none; border: none; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; padding: 2px 4px; margin: 0; font-weight: bold; white-space: nowrap; transition: color 0.15s; }
.gt-expand-btn:hover { color: var(--text-normal); }

/* Details row for side-by-side inputs */
.gt-details-row { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important; }
.gt-details-input { flex: 1 1 0% !important; width: 0 !important; min-width: 0 !important; box-sizing: border-box !important; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 8px 12px; font-size: 0.92rem; color: var(--text-normal); font-family: var(--font-monospace); text-align: center; transition: border-color 0.15s ease, background 0.15s ease; }
.gt-details-input:focus { border-color: var(--interactive-accent); outline: none; }

/* Snappy 0.6s Blue Flash indicator when input is saved to Markdown */
@keyframes gt-saved-pulse-blue {
  0% { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important; background: rgba(59, 130, 246, 0.12) !important; }
  60% { border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15) !important; background: rgba(59, 130, 246, 0.05) !important; }
  100% { border-color: var(--background-modifier-border) !important; box-shadow: none !important; background: var(--background-primary) !important; }
}
.gt-input-saved-blue {
  animation: gt-saved-pulse-blue 0.3s ease-out !important;
}

/* Expanded Rep Tracking UI */
.gt-rep-row { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }
.gt-w-50 { width: 50px; text-align: center; }
.gt-rep-input { background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 4px; padding: 4px; color: var(--text-normal); font-family: var(--font-monospace); font-weight: 700; }
.gt-rep-input:focus { border-color: var(--interactive-accent); outline: none; }
.gt-btn-plus { padding: 4px 10px; border-radius: 4px; border: none; background: var(--interactive-accent); color: var(--text-on-accent); font-weight: bold; cursor: pointer; }

/* Advanced Section (Accordion) */
.gt-advanced-container { display: none; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 8px; border-top: 1px dashed var(--background-modifier-border); }
.gt-advanced-container.is-expanded { display: flex; }
.gt-notes { font-size: 0.82rem; color: var(--text-muted); font-style: italic; padding-left: 6px; border-left: 2px solid var(--background-modifier-border); }

/* Sticky Bottom Footer - Edge to edge bottom divider line */
.gt-footer { flex: 0 0 auto; padding: 12px 0 50px 0; background: var(--background-secondary); border-top: 1px solid var(--background-modifier-border); display: flex; flex-direction: column; }
.gt-footer-btn-row { display: flex; gap: 10px; align-items: center; justify-content: space-between; padding: 0 18px 12px 18px; border-bottom: 1px solid var(--background-modifier-border); }
.gt-timer-btn-bottom { flex: 1; padding: 12px 10px; border-radius: 8px; border: 1px solid var(--background-modifier-border); background: var(--interactive-normal); color: var(--text-normal); font-size: 0.92rem; font-weight: 700; cursor: pointer; text-align: center; transition: all 0.15s ease; }
.gt-timer-btn-bottom:hover { background: var(--interactive-hover); }
.gt-timer-btn-primary { background: var(--interactive-accent); color: var(--text-on-accent); border: none; }
`;

function injectStyles() {
  const ID = "gt-styles-v35";
  if (!document.getElementById(ID)) {
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

// Helper to accurately smooth-scroll to exact center and play animation on arrival
function smoothScrollAndAnimate(container, targetCard, onCentered) {
  const containerRect = container.getBoundingClientRect();
  const cardRect = targetCard.getBoundingClientRect();
  
  // Calculate exact scrollTop needed to center targetCard inside container
  const relativeCardTop = cardRect.top - containerRect.top + container.scrollTop;
  const targetScrollTop = Math.max(0, Math.min(
    relativeCardTop - (container.clientHeight / 2) + (cardRect.height / 2),
    container.scrollHeight - container.clientHeight
  ));

  // If already centered (within 10px), trigger immediately
  if (Math.abs(container.scrollTop - targetScrollTop) < 10) {
    onCentered();
    return;
  }

  // Smooth scroll to target position
  container.scrollTo({ top: targetScrollTop, behavior: "smooth" });

  let lastTop = container.scrollTop;
  let sameCount = 0;
  let startTime = Date.now();
  
  // Poll scroll position to trigger animation EXACTLY when arrival occurs
  const checkArrival = setInterval(() => {
    const currentTop = container.scrollTop;
    const dist = Math.abs(currentTop - targetScrollTop);
    const isStuck = Math.abs(currentTop - lastTop) < 2;
    
    // Stop polling if within 8px of target, or scroll stopped, or max timeout reached (1.2s)
    if (dist < 8 || (isStuck && sameCount++ > 3) || (Date.now() - startTime > 1200)) {
      clearInterval(checkArrival);
      onCentered();
    } else {
      lastTop = currentTop;
    }
  }, 40);
}

// ── UI Renderer ───────────────────────────────────────────────────────────────

async function startGymSession(app, file, leaf) {
  injectStyles();

  let content = await app.vault.read(file);
  let parsed = parseWorkout(content);
  
  let lines = parsed.lines;
  let items = parsed.items;
  
  let sessionEarnedSets = 0;
  let undoStack = []; 

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

  // Attempt Auto-Fullscreen on startup + fallback touch trigger
  const enterFS = () => {
    if (!document.fullscreenElement) {
      root.requestFullscreen().catch(() => {});
    }
  };
  enterFS();
  const autoFSTrigger = () => {
    enterFS();
    root.removeEventListener("click", autoFSTrigger);
    root.removeEventListener("touchstart", autoFSTrigger);
  };
  root.addEventListener("click", autoFSTrigger);
  root.addEventListener("touchstart", autoFSTrigger);

  // 1. Header
  const header = root.appendChild(document.createElement("div"));
  header.className = "gt-header";

  // 2. Body
  const body = root.appendChild(document.createElement("div"));
  body.className = "gt-body";
  const container = body.appendChild(document.createElement("div"));
  container.className = "gt-container";

  // 3. Footer
  const footer = root.appendChild(document.createElement("div"));
  footer.className = "gt-footer";

  const footerBtnRow = footer.appendChild(document.createElement("div"));
  footerBtnRow.className = "gt-footer-btn-row";

  // ── Timestamp-Based 48-Set Timer State ──────────────────────────────────────
  const TOTAL_SETS = 48;
  const SET_DURATION = 75; 
  
  let currentSet = 1;
  let secondsLeftInSet = SET_DURATION;
  let expectedEndTime = Date.now() + (SET_DURATION * 1000);
  let isRunning = true;
  let timerInterval = null;

  const timerCard = header.appendChild(document.createElement("div"));
  timerCard.className = "gt-timer-card";

  const timerStats = timerCard.appendChild(document.createElement("div"));
  timerStats.className = "gt-timer-stats";

  const setEl = timerStats.appendChild(document.createElement("div"));
  setEl.className = "gt-timer-set";

  const earnedEl = timerStats.appendChild(document.createElement("div"));
  earnedEl.className = "gt-timer-earned";

  const timeEl = timerStats.appendChild(document.createElement("div"));
  timeEl.className = "gt-timer-time";

  const metaEl = timerCard.appendChild(document.createElement("div"));
  metaEl.className = "gt-timer-meta";

  const totalLeftEl = metaEl.appendChild(document.createElement("span"));
  const finishTimeEl = metaEl.appendChild(document.createElement("span"));

  // Bottom Footer Timer Controls
  const prevBtn = footerBtnRow.appendChild(document.createElement("button"));
  prevBtn.className = "gt-timer-btn-bottom";
  prevBtn.textContent = "⏪ Prev Set";

  const playBtn = footerBtnRow.appendChild(document.createElement("button"));
  playBtn.className = "gt-timer-btn-bottom gt-timer-btn-primary";

  const nextBtn = footerBtnRow.appendChild(document.createElement("button"));
  nextBtn.className = "gt-timer-btn-bottom";
  nextBtn.textContent = "Next Set ⏩";

  function updateTimerUI() {
    const isCompleted = (currentSet === TOTAL_SETS && secondsLeftInSet === 0);

    if (isCompleted) {
      setEl.textContent = `Set ${TOTAL_SETS}/${TOTAL_SETS} 🎉`;
      timeEl.textContent = `0m 00s`;
      totalLeftEl.textContent = `⏱️ Workout Complete!`;
      finishTimeEl.textContent = `🏁 Done`;
      playBtn.textContent = "▶ Restart";
    } else {
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
  }

  function tick() {
    if (!isRunning) return;
    
    const now = Date.now();
    const msLeft = expectedEndTime - now;

    if (msLeft <= 0) {
      // Calculate how much time passed in case device was asleep
      const overflow = -msLeft;
      const setsSkipped = Math.floor(overflow / (SET_DURATION * 1000)) + 1;
      
      if (currentSet + setsSkipped > TOTAL_SETS) {
        currentSet = TOTAL_SETS;
        secondsLeftInSet = 0;
        isRunning = false;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      } else {
        currentSet += setsSkipped;
        playBeep(880, 0.4);
        
        // Calculate remainder to keep the timer strictly accurate
        const remainder = overflow % (SET_DURATION * 1000);
        expectedEndTime = now + (SET_DURATION * 1000) - remainder;
        secondsLeftInSet = Math.ceil((expectedEndTime - now) / 1000);
      }
    } else {
      secondsLeftInSet = Math.ceil(msLeft / 1000);
    }
    updateTimerUI();
  }

  timerInterval = setInterval(tick, 1000);

  playBtn.onclick = () => {
    if (!audioCtx) playBeep(0, 0.001); 
    
    if (currentSet === TOTAL_SETS && secondsLeftInSet === 0) {
      currentSet = 1;
      secondsLeftInSet = SET_DURATION;
      expectedEndTime = Date.now() + (SET_DURATION * 1000);
      isRunning = true;
      if (!timerInterval) timerInterval = setInterval(tick, 1000);
    } else {
      isRunning = !isRunning;
      if (isRunning) {
        // Recalculate end time based on the exact seconds left right now
        expectedEndTime = Date.now() + (secondsLeftInSet * 1000);
        if (!timerInterval) timerInterval = setInterval(tick, 1000);
      } else {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
    }
    updateTimerUI();
  };

  nextBtn.onclick = () => {
    playBeep(523.25, 0.15);
    if (currentSet < TOTAL_SETS) {
      currentSet++;
      secondsLeftInSet = SET_DURATION;
      expectedEndTime = Date.now() + (SET_DURATION * 1000);
    } else {
      secondsLeftInSet = 0;
      isRunning = false;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
    updateTimerUI();
  };

  prevBtn.onclick = () => {
    playBeep(523.25, 0.15); 
    if (currentSet > 1 || secondsLeftInSet < SET_DURATION) {
      if (secondsLeftInSet < SET_DURATION) {
        secondsLeftInSet = SET_DURATION;
      } else if (currentSet > 1) {
        currentSet--;
        secondsLeftInSet = SET_DURATION;
      }
      expectedEndTime = Date.now() + (SET_DURATION * 1000);
      updateTimerUI();
    }
  };

  updateTimerUI();

  const _origDetach = leaf.detach.bind(leaf);
  leaf.detach = () => {
    if (timerInterval) clearInterval(timerInterval);
    _origDetach();
  };

  // ── Top Action Controls (Undo, Reset, Fullscreen) ─────────────────────────
  const controlsRow = header.appendChild(document.createElement("div"));
  controlsRow.className = "gt-controls-row";

  const undoBtn = controlsRow.appendChild(document.createElement("button"));
  undoBtn.className = "gt-btn";
  undoBtn.onclick = async () => {
    if (undoStack.length === 0) return;
    const lastOp = undoStack.pop();
    
    // Determine the type of animation based on whether the item is returning from checked state
    if (lastOp.item.checked && !lastOp.oldChecked) {
      lastOp.item.justUndone = 'full';
    } else {
      lastOp.item.justUndone = 'partial';
    }
    
    lastOp.item.checked = lastOp.oldChecked;
    lastOp.item.count = lastOp.oldCount;
    lastOp.item.reps = lastOp.oldReps;
    sessionEarnedSets = lastOp.oldSessionEarned;

    await saveWorkoutFile(app, file, lines, items);
    renderUI();
  };

  const resetBtn = controlsRow.appendChild(document.createElement("button"));
  resetBtn.className = "gt-btn";
  resetBtn.textContent = "Reset Cycle";
  resetBtn.onclick = async () => {
    if (!confirm("Reset cycle? Completed exercises will uncheck, and skipped exercises will carry over into the new cycle.")) return;
    
    for (const item of items) {
      if (item.checked) {
        item.checked = false;
        item.count = item.baseCount;
      } else {
        item.count += item.baseCount;
      }
    }
    
    // Kept sessionEarnedSets accumulating across resets as requested
    undoStack = []; 
    
    await saveWorkoutFile(app, file, lines, items);
    renderUI();
  };

  const fullscreenBtn = controlsRow.appendChild(document.createElement("button"));
  fullscreenBtn.className = "gt-btn";
  fullscreenBtn.textContent = "⛶"; 
  fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
      root.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Render Exercise Cards
  function renderUI() {
    container.innerHTML = "";

    earnedEl.textContent = `🎯 Earned: ${Number(sessionEarnedSets.toFixed(1))} Sets`;

    if (undoStack.length > 0) {
      undoBtn.style.display = "inline-flex";
      undoBtn.textContent = `⟲ Undo`;
    } else {
      undoBtn.style.display = "none";
    }

    const visibleItems = items.filter(i => !i.checked);
    let itemToAnimate = null;

    for (const item of visibleItems) {
      const card = container.appendChild(document.createElement("div"));
      card.className = "gt-card";

      // Tag for animation after layout calculation
      if (item.justUndone) {
        itemToAnimate = { card, animType: item.justUndone };
        item.justUndone = false;
      }

      const cardTop = card.appendChild(document.createElement("div"));
      cardTop.className = "gt-card-top";

      const titleGroup = cardTop.appendChild(document.createElement("div"));
      titleGroup.className = "gt-title-group";

      const checkBox = titleGroup.appendChild(document.createElement("div"));
      checkBox.className = "gt-check-box";
      checkBox.textContent = "";

      // Checkbox Completion Logic with Animation
      checkBox.onclick = async (e) => {
        e.stopPropagation();

        if (card.classList.contains("gt-animating")) return;
        card.classList.add("gt-animating");
        
        // Strip any residual animations completely before triggering the completion check
        card.classList.remove("gt-anim-undo-full", "gt-anim-undo-partial", "gt-anim-complete", "gt-anim-partial");
        
        undoStack.push({ 
          item: item, 
          oldChecked: item.checked, 
          oldCount: item.count, 
          oldReps: item.reps, 
          oldSessionEarned: sessionEarnedSets 
        });
        if (undoStack.length > 20) undoStack.shift();

        let isComplete = false;

        if (item.checked) {
          item.checked = false;
          item.count = item.baseCount;
        } else if (item.count > 1) {
          item.count -= 1;
          let remainingReps = 36 - item.reps;
          sessionEarnedSets += remainingReps / item.repsPerSet;
          item.reps = 0; 

          card.classList.add("gt-anim-partial");
          checkBox.style.background = "var(--text-success, #4caf50)";
          
          setTimeout(() => { checkBox.style.background = ""; }, 300);

        } else {
          item.checked = true;
          let remainingReps = 36 - item.reps;
          sessionEarnedSets += remainingReps / item.repsPerSet;
          item.reps = 0; 
          isComplete = true;

          card.classList.add("gt-anim-complete");
          checkBox.style.background = "var(--text-success, #4caf50)";
          checkBox.style.borderColor = "var(--text-success, #4caf50)";
          checkBox.innerHTML = "✓";
          checkBox.style.color = "white";
        }
        
        const animDuration = isComplete ? 400 : 350;
        await new Promise(r => setTimeout(r, animDuration));

        await saveWorkoutFile(app, file, lines, items);
        renderUI();
      };

      const titleEl = titleGroup.appendChild(document.createElement("div"));
      titleEl.className = "gt-card-title";
      titleEl.textContent = item.title;

      const topRightGroup = cardTop.appendChild(document.createElement("div"));
      topRightGroup.className = "gt-top-right-group";

      if (item.count > 1) {
        const badge = topRightGroup.appendChild(document.createElement("div"));
        badge.className = "gt-badge";
        badge.textContent = `${item.count} LEFT`;
      }

      const expandBtn = topRightGroup.appendChild(document.createElement("button"));
      expandBtn.className = "gt-expand-btn";
      expandBtn.innerHTML = item.isExpanded ? "▲" : "▼";

      // ── Split Details Row (Side by Side) ──────────
      const detailsRow = card.appendChild(document.createElement("div"));
      detailsRow.className = "gt-details-row";

      const input1 = detailsRow.appendChild(document.createElement("input"));
      input1.className = "gt-details-input";
      input1.type = "text";
      input1.value = item.details1;
      input1.placeholder = "Weight / Reps";

      const input2 = detailsRow.appendChild(document.createElement("input"));
      input2.className = "gt-details-input";
      input2.type = "text";
      input2.value = item.details2;
      input2.placeholder = "Weight / Reps";

      const updateDetails = async (inputEl) => {
        item.details1 = input1.value.trim();
        item.details2 = input2.value.trim();
        await saveWorkoutFile(app, file, lines, items);

        // Flash snappy blue save animation (0.6s) on the specific input element that was modified
        if (inputEl) {
          inputEl.classList.remove("gt-input-saved-blue");
          void inputEl.offsetWidth; // Force reflow so animation re-triggers if edited repeatedly
          
          inputEl.classList.add("gt-input-saved-blue");

          clearTimeout(inputEl._saveTimer);
          inputEl._saveTimer = setTimeout(() => {
            inputEl.classList.remove("gt-input-saved-blue");
          }, 300);
        }
      };

      input1.onchange = (e) => updateDetails(e.target);
      input2.onchange = (e) => updateDetails(e.target);

      // ── Rep Tracker Row ──────────
      const repRow1 = card.appendChild(document.createElement("div"));
      repRow1.className = "gt-rep-row";
      
      repRow1.appendChild(document.createTextNode("Reps: "));
      
      const repInput = repRow1.appendChild(document.createElement("input"));
      repInput.className = "gt-rep-input gt-w-50";
      repInput.type = "number";
      repInput.min = 0;
      repInput.max = 36;
      repInput.value = item.reps;

      repRow1.appendChild(document.createTextNode(" / 36 \u00A0\u00A0Add: "));

      const addInput = repRow1.appendChild(document.createElement("input"));
      addInput.className = "gt-rep-input gt-w-50";
      addInput.type = "number";
      addInput.placeholder = "0";

      const addBtn = repRow1.appendChild(document.createElement("button"));
      addBtn.className = "gt-btn-plus";
      addBtn.textContent = "+";

      const saveReps = async () => {
        let newReps = parseInt(repInput.value, 10) || 0;
        if (newReps < 0) newReps = 0;
        if (newReps > 36) newReps = 36; 
        
        let repDiff = newReps - item.reps;
        sessionEarnedSets += repDiff / item.repsPerSet; 
        
        item.reps = newReps;
        item.hasRepTag = true;
        await saveWorkoutFile(app, file, lines, items);
        earnedEl.textContent = `🎯 Earned: ${Number(sessionEarnedSets.toFixed(1))} Sets`;
      };

      repInput.onchange = saveReps;

      addBtn.onclick = () => {
        const toAdd = parseInt(addInput.value, 10) || 0;
        if (toAdd !== 0) {
          let targetReps = parseInt(repInput.value, 10) + toAdd;
          if (targetReps > 36) targetReps = 36; 
          if (targetReps < 0) targetReps = 0;
          repInput.value = targetReps;
          addInput.value = "";
          saveReps();
        }
      };

      // ── Advanced Settings & Notes (Accordion) ──────────
      const advancedContainer = card.appendChild(document.createElement("div"));
      advancedContainer.className = "gt-advanced-container";
      if (item.isExpanded) advancedContainer.classList.add("is-expanded");

      expandBtn.onclick = () => {
        item.isExpanded = !item.isExpanded;
        if (item.isExpanded) {
          advancedContainer.classList.add("is-expanded");
          expandBtn.innerHTML = "▲";
        } else {
          advancedContainer.classList.remove("is-expanded");
          expandBtn.innerHTML = "▼";
        }
      };

      const repRow2 = advancedContainer.appendChild(document.createElement("div"));
      repRow2.className = "gt-rep-row";
      repRow2.appendChild(document.createTextNode("Ratio: "));
      
      const ratioInput = repRow2.appendChild(document.createElement("input"));
      ratioInput.className = "gt-rep-input gt-w-50";
      ratioInput.type = "number";
      ratioInput.min = 0.1;
      ratioInput.step = 0.1;
      ratioInput.value = item.repsPerSet;

      repRow2.appendChild(document.createTextNode(" reps = 1 set"));

      ratioInput.onchange = async () => {
        item.repsPerSet = parseFloat(ratioInput.value) || 3;
        await saveWorkoutFile(app, file, lines, items);
      };

      if (item.notes.length > 0) {
        const notesEl = advancedContainer.appendChild(document.createElement("div"));
        notesEl.className = "gt-notes";
        notesEl.textContent = item.notes.join(" • ");
      }
    }

    // Execute smooth scroll and trigger animation ONLY upon mathematical arrival
    if (itemToAnimate) {
      requestAnimationFrame(() => {
        smoothScrollAndAnimate(body, itemToAnimate.card, () => {
          const animClass = itemToAnimate.animType === 'full' ? "gt-anim-undo-full" : "gt-anim-undo-partial";
          itemToAnimate.card.classList.add(animClass);

          itemToAnimate.card.addEventListener("animationend", () => {
            itemToAnimate.card.classList.remove(animClass);
          }, { once: true });
        });
      });
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