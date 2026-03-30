"use strict";

// ── Parser ───────────────────────────────────────────────────────────────────

function parseFlashcards(content) {
  const cards = [];
  const body = content.replace(/^---[\s\S]*?---\n?/, ""); // strip frontmatter

  // ① Multi-line: blank-line-separated blocks with a lone `?` as separator
  for (const block of body.split(/\n{2,}/)) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const sep = lines.indexOf("?");
    if (sep > 0 && sep < lines.length - 1) {
      const q = lines.slice(0, sep).join("\n").trim();
      const a = lines.slice(sep + 1).join("\n").trim();
      if (q && a) cards.push({ question: q, answer: a });
    }
  }

  // ② Inline: Question::Answer
  for (const line of body.split("\n")) {
    const idx = line.indexOf("::");
    if (idx < 1) continue;
    const pre  = line.slice(0, idx).trim();
    const post = line.slice(idx + 2).trim();
    if (!pre || !post) continue;
    if (/^[a-z_]+$/i.test(pre)) continue; // skip YAML keys
    cards.push({ question: pre, answer: post });
  }

  return cards;
}

// ── Markdown + LaTeX Renderer ─────────────────────────────────────────────────

/**
 * Basic Markdown formatting for non-math text segments.
 */
function simpleMarkdown(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,         "<em>$1</em>")
    .replace(/`([^`]+)`/g,         "<code>$1</code>")
    .replace(/\n/g,                "<br>");
}

/**
 * Renders text into an element, handling MathJax and Markdown separately.
 */
async function renderInto(el, text) {
  el.innerHTML = ""; // Clear the container

  // Ensure MathJax is fully loaded
  if (window.MathJax?.startup?.promise) {
    await window.MathJax.startup.promise;
  }

  // Split text into tokens: Math vs. Plain Text
  // This regex captures both $$block$$ and $inline$ math
  const tokens = text.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);

  for (const token of tokens) {
    if (!token) continue;

    if (token.startsWith('$') && window.MathJax?.tex2chtml) {
      // --- HANDLE MATH ---
      const isDisplay = token.startsWith('$$');
      const rawLatex = isDisplay ? token.slice(2, -2) : token.slice(1, -1);
      
      try {
        // Create the MathJax node directly
        const mathNode = window.MathJax.tex2chtml(rawLatex, { display: isDisplay });
        el.appendChild(mathNode);
      } catch (err) {
        console.error("MathJax conversion error:", err);
        const errSpan = document.createElement("code");
        errSpan.textContent = token;
        el.appendChild(errSpan);
      }
    } else {
      // --- HANDLE PLAIN TEXT ---
      const textSpan = document.createElement("span");
      textSpan.innerHTML = simpleMarkdown(token);
      el.appendChild(textSpan);
    }
  }

  // Final typesetting pass to ensure everything is aligned
  if (window.MathJax?.typesetPromise) {
    await window.MathJax.typesetPromise([el]);
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const CSS = `
#fc-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,.65);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-interface, sans-serif);
  backdrop-filter: blur(2px);
}
#fc-box {
  background: var(--background-primary, #1e1e1e);
  color: var(--text-normal, #ddd);
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  padding: 1.75rem 2rem;
  width: min(600px, 90vw);
  max-height: 85vh;
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 1rem;
  box-shadow: 0 8px 40px rgba(0,0,0,.5);
}
.fc-header {
  display: flex; justify-content: space-between;
  font-size: .8rem; opacity: .55;
}
.fc-tag {
  font-size: .7rem; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; opacity: .45; margin-bottom: .2rem;
}
.fc-body {
  background: var(--background-secondary, #2a2a2a);
  border-radius: 8px; padding: 1.2rem;
  min-height: 3rem; line-height: 1.7; font-size: 1.1rem;
}
.fc-body code {
  background: var(--background-secondary-alt, #333);
  border-radius: 4px; padding: .1em .35em; font-size: .9em;
}
.fc-divider {
  border: none;
  border-top: 1px solid var(--background-modifier-border, #444);
  margin: .1rem 0;
}
.fc-btn-row {
  display: flex; gap: .75rem; flex-wrap: wrap;
}
.fc-btn-row button {
  flex: 1; min-width: 90px;
  padding: .65rem 1rem; border-radius: 6px;
  font-size: .95rem; cursor: pointer; border: none;
  font-weight: 600; transition: opacity .15s, transform 0.1s;
}
.fc-btn-row button:hover { opacity: .85; }
.fc-btn-row button:active { transform: translateY(1px); }
.fc-show      { background: var(--interactive-accent, #7c5cbf); color: #fff; }
.fc-correct   { background: #2a9d50; color: #fff; }
.fc-incorrect { background: #c0392b; color: #fff; }
.fc-skip      { background: var(--background-modifier-border, #444); color: var(--text-muted, #999); }
.fc-results   { text-align: center; padding: .5rem 0; }
.fc-bar-wrap  { background: var(--background-modifier-border, #444); border-radius: 999px; height: 10px; overflow: hidden; margin: 1rem 0; }
.fc-bar       { height: 100%; border-radius: 999px; background: #2a9d50; width: 0; transition: width .5s ease-out; }
`;

function injectStyles() {
  if (!document.getElementById("fc-styles")) {
    const s = document.createElement("style");
    s.id = "fc-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

// ── Flashcard UI ──────────────────────────────────────────────────────────────

function btn(label, cls, onClick) {
  const b = document.createElement("button");
  b.textContent = label;
  b.className = cls;
  b.onclick = onClick;
  return b;
}

function openFlashcardSession(cards) {
  injectStyles();

  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  let idx = 0;
  const score = { correct: 0, incorrect: 0, skipped: 0 };

  const overlay = document.createElement("div");
  overlay.id = "fc-overlay";
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

  const box = document.createElement("div");
  box.id = "fc-box";
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const onKey = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);

  function close() {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
  }

  async function renderCard() {
    box.innerHTML = "";

    if (idx >= shuffled.length) {
      renderResults();
      return;
    }

    const card = shuffled[idx];
    const total = shuffled.length;

    // Header
    const header = document.createElement("div");
    header.className = "fc-header";
    header.innerHTML = `<span>Card ${idx + 1} / ${total}</span><span>${
      Math.round((idx / total) * 100)
    }% complete</span>`;
    box.appendChild(header);

    // Question
    box.appendChild(Object.assign(document.createElement("div"), { className: "fc-tag", textContent: "Question" }));
    const qBody = document.createElement("div");
    qBody.className = "fc-body";
    box.appendChild(qBody);
    await renderInto(qBody, card.question);

    // Buttons
    const row = document.createElement("div");
    row.className = "fc-btn-row";
    box.appendChild(row);

    row.appendChild(btn("Show Answer", "fc-show", async () => {
      row.remove();
      box.appendChild(document.createElement("hr")).className = "fc-divider";
      box.appendChild(Object.assign(document.createElement("div"), { className: "fc-tag", textContent: "Answer" }));
      const aBody = document.createElement("div");
      aBody.className = "fc-body";
      box.appendChild(aBody);
      await renderInto(aBody, card.answer);

      const vRow = document.createElement("div");
      vRow.className = "fc-btn-row";
      box.appendChild(vRow);
      vRow.appendChild(btn("✓  Got it",    "fc-correct",   () => { score.correct++;   advance(); }));
      vRow.appendChild(btn("✗  Missed it", "fc-incorrect", () => { score.incorrect++; advance(); }));
      vRow.appendChild(btn("Skip",         "fc-skip",      () => { score.skipped++;   advance(); }));
    }));

    row.appendChild(btn("Skip", "fc-skip", () => { score.skipped++; advance(); }));
  }

  function advance() { idx++; renderCard(); }

  function renderResults() {
    const { correct, incorrect, skipped } = score;
    const answered = correct + incorrect;
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    box.innerHTML = `
      <div class="fc-results">
        <h2>Session complete</h2>
        <p style="font-size:1.2rem">${correct} / ${answered} correct (${pct}%)</p>
        <div class="fc-bar-wrap"><div class="fc-bar" id="fc-bar"></div></div>
        <p style="opacity:0.6; font-size:0.9rem">✓ ${correct} &nbsp; ✗ ${incorrect} &nbsp; ↷ ${skipped} skipped</p>
        <div class="fc-btn-row" style="justify-content:center; margin-top:1.5rem"></div>
      </div>`;

    setTimeout(() => {
      const bar = document.getElementById("fc-bar");
      if (bar) bar.style.width = pct + "%";
    }, 100);

    const btnRow = box.querySelector(".fc-btn-row");
    btnRow.appendChild(btn("Restart", "fc-show", () => { idx = 0; score.correct = score.incorrect = score.skipped = 0; renderCard(); }));
    btnRow.appendChild(btn("Close",   "fc-skip", close));
  }

  renderCard();
}

// ── Entry point ───────────────────────────────────────────────────────────────

module.exports = async (params) => {
  const { app } = params;

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("⚠️ No active file found.");
    return;
  }

  const content = await app.vault.read(file);
  const cards   = parseFlashcards(content);

  if (!cards.length) {
    new Notice("No flashcards found in this note.");
    return;
  }

  openFlashcardSession(cards);
};