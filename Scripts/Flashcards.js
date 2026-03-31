"use strict";

// ── Parser ───────────────────────────────────────────────────────────────────

function parseFlashcards(content) {
  const cards = [];
  const body = content.replace(/^---[\s\S]*?---\n?/, "");

  for (const block of body.split(/\n{2,}/)) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const sep = lines.indexOf("?");
    if (sep > 0 && sep < lines.length - 1) {
      const q = lines.slice(0, sep).join("\n").trim();
      const a = lines.slice(sep + 1).join("\n").trim();
      if (q && a) cards.push({ question: q, answer: a });
    }
  }

  for (const line of body.split("\n")) {
    const idx = line.indexOf("::");
    if (idx < 1) continue;
    const pre  = line.slice(0, idx).trim();
    const post = line.slice(idx + 2).trim();
    if (!pre || !post) continue;
    if (/^[a-z_]+$/i.test(pre)) continue;
    cards.push({ question: pre, answer: post });
  }

  return cards;
}

// ── Renderer ─────────────────────────────────────────────────────────────────

function simpleMarkdown(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,         "<em>$1</em>")
    .replace(/`([^`]+)`/g,         "<code>$1</code>")
    .replace(/\n/g,                "<br>");
}

async function renderInto(el, text, app, sourcePath) {
  el.innerHTML = "";
  if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;

  const tokens = text.split(/(```(?:\w+)?\n[\s\S]+?\n```|\$\$[\s\S]+?\$\$|\$.+?\$|!\[\[.+?\]\])/g);

  for (const token of tokens) {
    if (!token) continue;

    if (token.startsWith("```")) {
      const match = token.match(/```(\w+)?\n([\s\S]+?)\n```/);
      const lang = match?.[1] ?? "";
      const code = match?.[2] ?? token.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");

      const wrapper = document.createElement("div");
      wrapper.className = "fc-code-wrapper";

      if (lang) {
        const badge = document.createElement("div");
        badge.className = "fc-code-lang";
        badge.textContent = lang.toUpperCase();
        wrapper.appendChild(badge);
      }

      const pre = document.createElement("pre");
      pre.className = "fc-code-block";
      const codeEl = document.createElement("code");
      codeEl.textContent = code;
      pre.appendChild(codeEl);
      wrapper.appendChild(pre);
      el.appendChild(wrapper);
    }
    else if (token.startsWith("$") && window.MathJax?.tex2chtml) {
      const isDisplay = token.startsWith("$$");
      const rawLatex = isDisplay ? token.slice(2, -2) : token.slice(1, -1);
      try {
        el.appendChild(window.MathJax.tex2chtml(rawLatex, { display: isDisplay }));
      } catch {
        el.insertAdjacentHTML("beforeend", `<code>${token}</code>`);
      }
    }
    else if (token.startsWith("![[")) {
      const inner = token.slice(3, -2);
      const [linkPath, width] = inner.split("|");
      const file = app.metadataCache.getFirstLinkpathDest(linkPath, sourcePath);
      if (file) {
        const img = document.createElement("img");
        img.src = app.vault.getResourcePath(file);
        img.style.cssText = "display:block;margin:15px auto;max-width:100%;border-radius:8px;";
        if (width && !isNaN(width)) img.style.width = width + "px";
        el.appendChild(img);
      }
    }
    else {
      const span = document.createElement("span");
      span.innerHTML = simpleMarkdown(token);
      el.appendChild(span);
    }
  }

  if (window.MathJax?.typesetPromise) await window.MathJax.typesetPromise([el]);
}

// ── Styles ────────────────────────────────────────────────────────────────────

const CSS = `
/* 
  fc-root is position:absolute inside .workspace-leaf-content which Obsidian
  gives an explicit pixel height. inset:0 fills it exactly.
*/
.fc-root {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--background-primary);
  font-family: var(--font-interface, sans-serif);
  overflow: hidden;
  z-index: 5;
}

/* Scrollable content — takes all space above the footer */
.fc-main {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 16px;
}
.fc-box {
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Footer — rigid, never pushed by content */
.fc-footer {
  flex: 0 0 auto;
  padding: 14px 20px;
  background: var(--background-secondary);
  border-top: 1px solid var(--background-modifier-border);
  display: flex;
  justify-content: center;
}
.fc-btn-row {
  width: min(760px, 100%);
  display: flex;
  gap: 1rem;
}
.fc-btn-row button {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: filter .15s;
}
.fc-btn-row button:hover { filter: brightness(1.12); }
.fc-show      { background: var(--interactive-accent); color: var(--text-on-accent); }
.fc-correct   { background: var(--text-success, #4caf50); color: #fff; }
.fc-incorrect { background: var(--text-error,   #e53935); color: #fff; }

/* Progress bar */
.fc-progress {
  display: flex;
  justify-content: space-between;
  font-size: .78rem;
  opacity: .45;
  letter-spacing: .03em;
}

.fc-tag {
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: .4;
  letter-spacing: .08em;
}

/* Question: capped, scrollable internally */
.fc-body-q {
  background: var(--background-primary-alt);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  line-height: 1.65;
  font-size: 1.15rem;
  border: 1px solid var(--background-modifier-border);
  max-height: 28vh;
  overflow-y: auto;
}

/* Answer: slightly taller cap */
.fc-body-a {
  background: var(--background-primary-alt);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  line-height: 1.65;
  font-size: 1.15rem;
  border: 1px solid var(--background-modifier-border);
  max-height: 35vh;
  overflow-y: auto;
}

.fc-divider {
  border: none;
  border-top: 1px solid var(--background-modifier-border);
  opacity: .25;
  margin: .25rem 0;
}

/* Code blocks */
.fc-code-wrapper {
  position: relative;
  margin: .75rem 0;
  border-radius: 6px;
  overflow: hidden;
}
.fc-code-block {
  display: block;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 2rem 1rem 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: .9rem;
  line-height: 1.5;
  white-space: pre;
}
.fc-code-lang {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--interactive-accent);
  color: #fff;
  font-size: 10px;
  padding: 3px 10px;
  border-bottom-left-radius: 6px;
  font-weight: 700;
  letter-spacing: .06em;
  z-index: 1;
}
`;

function injectStyles() {
  const ID = "fc-styles-v4";
  if (!document.getElementById(ID)) {
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mkEl(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function makeBtn(label, cls, onClick) {
  const b = mkEl("button", cls, label);
  b.onclick = onClick;
  return b;
}

// ── Session ───────────────────────────────────────────────────────────────────

async function startFlashcardSession(app, cards, sourcePath, leaf) {
  injectStyles();

  // Obsidian's tab DOM (simplified):
  //   .workspace-leaf
  //     .workspace-leaf-content    ← Obsidian sets an explicit height here
  //       .view-header
  //       .view-content            ← leaf.view.containerEl (often no height)
  //
  // We walk UP from containerEl until we hit .workspace-leaf-content,
  // then inject fc-root (position:absolute, inset:0) directly into it.
  // That way fc-root fills the real sized element, not an unsized wrapper.

  const containerEl = leaf.view.containerEl;
  containerEl.empty();

  // Find .workspace-leaf-content
  let pane = containerEl;
  while (pane && !pane.classList.contains("workspace-leaf-content")) {
    pane = pane.parentElement;
  }
  // Fallback to parent of containerEl if class not found
  if (!pane) pane = containerEl.parentElement || containerEl;

  // Ensure it's a positioning context
  const paneStyle = getComputedStyle(pane);
  if (paneStyle.position === "static") pane.style.position = "relative";

  const root   = pane.appendChild(mkEl("div", "fc-root"));
  const main   = root.appendChild(mkEl("div", "fc-main"));
  const box    = main.appendChild(mkEl("div", "fc-box"));
  const footer = root.appendChild(mkEl("div", "fc-footer"));

  let currentQueue   = [...cards].sort(() => Math.random() - 0.5);
  let nextRoundQueue = [];

  // Tracks what the Space/1/2 keys should do right now.
  // "question" → Space reveals answer
  // "answer"   → 1 = got it, 2 = missed it
  // "done"     → no card shortcuts active
  let phase = "question";

  // Single persistent keyboard handler for the whole session.
  // Uses event.code (physical key position) so it works on any layout,
  // including Programmer Dvorak where the number row produces & and [.
  function onKey(e) {
    // Don't fire if the user is typing in an input/textarea
    if (e.target.matches("input, textarea, select, [contenteditable]")) return;

    if (phase === "question" && e.code === "Space") {
      e.preventDefault();
      // Click the Show Answer button
      const btn = footer.querySelector(".fc-show");
      if (btn) btn.click();
    } else if (phase === "answer") {
      if (e.code === "Digit1") {
        e.preventDefault();
        const btn = footer.querySelector(".fc-correct");
        if (btn) btn.click();
      } else if (e.code === "Digit2") {
        e.preventDefault();
        const btn = footer.querySelector(".fc-incorrect");
        if (btn) btn.click();
      }
    }
  }
  document.addEventListener("keydown", onKey);

  // Clean up the listener if the leaf is closed via the tab × button.
  // We wrap leaf.detach so cleanup always runs.
  const _origDetach = leaf.detach.bind(leaf);
  leaf.detach = () => {
    document.removeEventListener("keydown", onKey);
    root.remove();
    _origDetach();
  };

  async function showAnswer(btnRow) {
    phase = "answer"; // switch keyboard mode before awaiting render
    btnRow.innerHTML = "";

    box.appendChild(mkEl("hr", "fc-divider"));
    box.appendChild(mkEl("div", "fc-tag", "Answer"));
    const aBody = box.appendChild(mkEl("div", "fc-body-a"));
    await renderInto(aBody, card.answer, app, sourcePath);

    main.scrollTo({ top: main.scrollHeight, behavior: "smooth" });

    btnRow.appendChild(makeBtn("✓ Got it  [1]", "fc-correct", () => {
      currentQueue.shift();
      renderCard();
    }));
    btnRow.appendChild(makeBtn("✗ Missed it  [2]", "fc-incorrect", () => {
      nextRoundQueue.push(currentQueue.shift());
      renderCard();
    }));
  }

  // card is referenced inside showAnswer — hoist it to function scope
  let card;

  async function renderCard() {
    box.innerHTML    = "";
    footer.innerHTML = "";
    phase = "question";

    if (currentQueue.length === 0) {
      if (nextRoundQueue.length > 0) {
        currentQueue   = [...nextRoundQueue].sort(() => Math.random() - 0.5);
        nextRoundQueue = [];
        renderCard();
      } else {
        renderDone();
      }
      return;
    }

    card = currentQueue[0];
    const btnRow = footer.appendChild(mkEl("div", "fc-btn-row"));

    // Progress — two spans, space-between
    const prog   = box.appendChild(mkEl("div", "fc-progress"));
    const pLeft  = prog.appendChild(mkEl("span"));
    const pRight = prog.appendChild(mkEl("span"));
    pLeft.textContent  = `${currentQueue.length} left this round`;
    pRight.textContent = `${currentQueue.length + nextRoundQueue.length} remaining`;

    // Question
    box.appendChild(mkEl("div", "fc-tag", "Question"));
    const qBody = box.appendChild(mkEl("div", "fc-body-q"));
    await renderInto(qBody, card.question, app, sourcePath);

    // Show Answer button — Space shortcut hint in label
    btnRow.appendChild(makeBtn("Show Answer  [Space]", "fc-show", () => showAnswer(btnRow)));
  }

  function renderDone() {
    phase = "done";
    box.innerHTML    = "";
    footer.innerHTML = "";

    const msg = box.appendChild(mkEl("div"));
    msg.style.cssText = "text-align:center;padding:3rem 0;";
    msg.innerHTML = "<h1 style='margin-bottom:.5rem'>🎉 All cards mastered!</h1><p style='opacity:.6'>You cleared every card in this session.</p>";

    const btnRow = footer.appendChild(mkEl("div", "fc-btn-row"));
    btnRow.appendChild(makeBtn("Restart Fresh", "fc-show", () => {
      currentQueue   = [...cards].sort(() => Math.random() - 0.5);
      nextRoundQueue = [];
      renderCard();
    }));
    btnRow.appendChild(makeBtn("Close Tab", "fc-incorrect", () => leaf.detach()));
  }

  renderCard();
}

// ── Entry point ───────────────────────────────────────────────────────────────

module.exports = async (params) => {
  const { app } = params;
  const file = app.workspace.getActiveFile();
  if (!file) return;

  const content = await app.vault.read(file);
  const cards   = parseFlashcards(content);
  if (!cards.length) return;

  const leaf = app.workspace.getLeaf("tab");
  app.workspace.setActiveLeaf(leaf, { focus: true });

  // Set the tab title by directly finding and updating the tab header DOM element.
  // We try multiple strategies since Obsidian's internals vary across versions.
  function setTabTitle(title) {
    // Strategy 1: walk up from containerEl to .workspace-leaf, then find the
    // sibling .workspace-tab-header that belongs to this leaf.
    try {
      let leafEl = leaf.view.containerEl;
      while (leafEl && !leafEl.classList.contains("workspace-leaf")) {
        leafEl = leafEl.parentElement;
      }
      if (leafEl) {
        // The tab header is in the same .workspace-tabs parent, in a
        // .workspace-tab-header-container sibling.
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

    // Strategy 2: leaf.tabHeaderEl is set on some Obsidian versions
    try {
      const titleEl = leaf.tabHeaderEl?.querySelector(".workspace-tab-header-inner-title");
      if (titleEl) { titleEl.textContent = title; return; }
    } catch(e) {}

    // Strategy 3: patch getDisplayText and force a refresh
    try {
      leaf.view.getDisplayText = () => title;
      app.workspace.trigger("layout-change");
    } catch(e) {}
  }

  // Run immediately, then retry after a short delay in case the tab DOM
  // isn't fully painted yet when the script first runs.
  setTabTitle("Flashcard Practice");
  setTimeout(() => setTabTitle("Flashcard Practice"), 100);

  startFlashcardSession(app, cards, file.path, leaf);
};