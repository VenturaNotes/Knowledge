// PDFMarkdownDiff.js
// Script Runner plugin script.
// Open the markdown note you want to verify as the active file, then run this.
// A fuzzy PDF picker appears — pick the source PDF. A new note is created
// with the diff results.
//
// Requirements:
//   - Python 3 (ships with macOS)
//   - pdftotext: brew install poppler

module.exports = async ({ app, obsidian }) => {

const { SuggestModal, Notice, MarkdownView } = obsidian;
const { spawn } = require("child_process");
const path = require("path");
const fs   = require("fs");
const os   = require("os");

const vaultRoot = app.vault.adapter.basePath;

// Helper to extract clean paths from Obsidian wikilinks
function extractLinkPath(linkValue) {
  if (!linkValue || typeof linkValue !== "string") return null;
  const wikiMatch = linkValue.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  if (wikiMatch) {
    return wikiMatch[1].trim();
  }
  return linkValue.trim();
}

// Helper to generate the human-readable Markdown candidates list
function generateCandidatesMarkdown(candidates) {
  const lines = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    lines.push(`## Candidate ${i + 1}`);
    lines.push(``);
    lines.push(`| | Value |`);
    lines.push(`|---|---|`);
    lines.push(`| **PDF says** | \`${c.pdfWord}\` |`);
    lines.push(`| **MD has** | \`${c.mdWord}\` |`);
    if (c.pdfPage) {
      lines.push(`| **PDF Page** | ${c.pdfPage} |`);
    }
    lines.push(``);
    lines.push(`**PDF context:** ...${c.pdfContext}...`);
    lines.push(``);
    lines.push(`**MD context:** ...${c.mdContext}...`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }
  return lines.join("\n");
}

// ─── 1. Determine run mode (Resuming Tracker vs. Fresh Start) ─────────────────

const activeFile = app.workspace.getActiveFile();
if (!activeFile || activeFile.extension !== "md") {
  new Notice("PDFMarkdownDiff: Open a markdown file first.");
  return;
}

const fileCache = app.metadataCache.getFileCache(activeFile);
const frontmatter = fileCache?.frontmatter;

let targetMdPath = activeFile.path;
let targetPdfPath, pdfWordCount = 0, mdWordCount = 0, currentIndex = 0, cumulativeShift = 0, candidates = [], history = [];
let trackerFile = null;
let activeFileIsTracker = false;

// Resolve existing tracking files using the metadata cache and frontmatter DiffTracker link
const trackerLink = frontmatter?.DiffTracker || frontmatter?.diffTracker || frontmatter?.difftracker;

if (trackerLink) {
  const trackerCleanPath = extractLinkPath(trackerLink);
  if (trackerCleanPath) {
    const trackerTFile = app.metadataCache.getFirstLinkpathDest(trackerCleanPath, activeFile.path);
    if (trackerTFile) {
      try {
        const trackerText = await app.vault.read(trackerTFile);
        const data = JSON.parse(trackerText);
        
        if (data && data.type === "pdf-md-diff-tracker") {
          activeFileIsTracker = true;
          trackerFile = trackerTFile;
          
          targetMdPath = data.targetMdPath;
          targetPdfPath = data.targetPdfPath;
          pdfWordCount = data.pdfWordCount ?? 0;
          mdWordCount = data.mdWordCount ?? 0;
          currentIndex = data.currentIndex ?? 0;
          cumulativeShift = data.cumulativeShift ?? 0;
          candidates = data.candidates ?? [];
          history = data.history ?? [];
          
          new Notice(`PDFMarkdownDiff: Resuming session at mismatch ${currentIndex + 1} / ${candidates.length}`);
        }
      } catch (err) {
        new Notice("PDFMarkdownDiff: Failed to load or parse associated progress tracker JSON file.");
        console.error("PDFMarkdownDiff resume error:", err);
      }
    }
  }
}

// ─── 2. If Fresh Start: Execute analysis pipeline ───────────────────────────

if (!activeFileIsTracker) {
  const activeLeaf = app.workspace.getMostRecentLeaf();
  if (!activeLeaf || !(activeLeaf.view instanceof MarkdownView)) {
    new Notice("PDFMarkdownDiff: Open the Markdown editor pane first.");
    return;
  }
  const editor = activeLeaf.view.editor;
  
  const mdText = editor.getValue().replace(/\r\n/g, "\n");
  
  // Detect PDF source from frontmatter or ask user
  let chosenPDF = null;
  const sourceValue = frontmatter?.Source ?? frontmatter?.source;
  if (sourceValue) {
    const cleanPath = extractLinkPath(sourceValue);
    if (cleanPath) {
      chosenPDF = app.metadataCache.getFirstLinkpathDest(cleanPath, activeFile.path);
    }
    if (!chosenPDF) {
      new Notice(`PDFMarkdownDiff: PDF "${cleanPath}" not found. Loading picker.`);
    }
  }

  if (!chosenPDF) {
    const allPDFs = app.vault.getFiles().filter((f) => f.extension === "pdf");
    if (allPDFs.length === 0) {
      new Notice("PDFMarkdownDiff: No PDF files found in vault.");
      return;
    }

    chosenPDF = await new Promise((resolve) => {
      class PDFPicker extends SuggestModal {
        getSuggestions(query) {
          return allPDFs.filter((f) => f.path.toLowerCase().includes(query.toLowerCase()));
        }
        renderSuggestion(file, el) {
          el.createEl("div", { text: file.basename, cls: "suggestion-title" });
          el.createEl("small", { text: file.path,     cls: "suggestion-note" });
        }
        onChooseSuggestion(file) { resolve(file); }
        onClose() { setTimeout(() => resolve(null), 50); }
      }
      new PDFPicker(app).open();
    });
  }

  if (!chosenPDF) {
    new Notice("PDFMarkdownDiff: No PDF selected.");
    return;
  }
  
  targetPdfPath = chosenPDF.path;
  const pdfAbsPath = path.join(vaultRoot, chosenPDF.path);
  
  const tmpDir = os.tmpdir();
  const tmpMd  = path.join(tmpDir, `pdfmd_${Date.now()}.md`);
  const tmpPy  = path.join(tmpDir, `pdfmd_${Date.now()}.py`);
  fs.writeFileSync(tmpMd, mdText, "utf8");

  // Inline Python Text Extraction & Fuzzy Alignment Matcher
  const pythonScript = `
import sys, re, subprocess, difflib, json

PDFTOTEXT = "/opt/homebrew/bin/pdftotext"
PDF_PATH  = ${JSON.stringify(pdfAbsPath)}
MD_PATH   = ${JSON.stringify(tmpMd)}
CONTEXT   = 4

def progress(msg):
    print("PROGRESS: " + msg, flush=True)

def extract_pdf(path):
    progress("Extracting PDF text...")
    r = subprocess.run([PDFTOTEXT, "-layout", path, "-"],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print("ERROR: " + r.stderr, flush=True)
        sys.exit(1)
    return r.stdout

def tokenize(text):
    return re.findall(r"[a-z]+(?:-[a-z]+)*", text.lower())

def tokenize_with_spans(text):
    tokens = []
    # Match words, optionally including inline math dollar delimiters
    for m in re.finditer(r"\\$?[a-zA-Z]+\\$?(?:-\\$?[a-zA-Z]+\\$?)*", text):
        raw_word = m.group(0)
        clean_word = raw_word.replace("$", "").lower()
        if clean_word:
            tokens.append({
                "word": clean_word,
                "start": m.start(),
                "end": m.end()
            })
    return tokens

def is_noise(a, b):
    if len(a) <= 1 or len(b) <= 1:
        return True
    structural = {"page","chapter","figure","table","appendix"}
    if a in structural and b not in structural:
        return True
    return False

pdf_text  = extract_pdf(PDF_PATH)

progress("Reading raw Markdown...")
md_text   = open(MD_PATH, encoding="utf-8").read()

def mask_for_diff(text):
    # Replace non-prose regions with spaces so mdStart/mdEnd offsets stay valid.
    # Frontmatter tokens have no PDF counterpart and shift alignment indices.
    buf = list(text)
    def blank(m):
        for i in range(m.start(), m.end()):
            if buf[i] != '\\n':
                buf[i] = ' '
    for m in re.finditer(r'^---[\\s\\S]*?\\n---', text):
        blank(m)
        break
    for m in re.finditer(r'\\$\\$[\\s\\S]*?\\$\\$', text):
        blank(m)
    # Match inline math blocks
    for m in re.finditer(r'\\$[^$\\n]+\\$', text):
        inner = m.group(0)[1:-1] # strip the $ delimiters
        # If it is NOT a simple 1-2 character alphanumeric variable, blank it out
        if not re.match(r'^[a-zA-Z]{1,2}$', inner):
            blank(m)
    for m in re.finditer(r'<!--[\\s\\S]*?-->', text):
        blank(m)
    return ''.join(buf)

md_masked = mask_for_diff(md_text)
# Tokenize the masked text for both md_tokens and md_words.
# Masking replaces regions with spaces (same length), so spans from
# md_masked are identical to spans into the original md_text.
md_tokens = tokenize_with_spans(md_masked)
md_words  = [t["word"] for t in md_tokens]

progress("Tokenizing words page-by-page...")
pdf_words = []
pdf_word_pages = []

# Split using the standard form-feed character to trace page numbers
for page_idx, page_text in enumerate(pdf_text.split(chr(12))):
    page_num = page_idx + 1
    words_on_page = tokenize(page_text)
    pdf_words.extend(words_on_page)
    pdf_word_pages.extend([page_num] * len(words_on_page))

progress(f"Diffing {len(pdf_words):,} PDF words vs {len(md_words):,} MD words...")
matcher   = difflib.SequenceMatcher(None, pdf_words, md_words, autojunk=True)

progress("Scanning for mismatches...")
candidates = []
for tag, i1, i2, j1, j2 in matcher.get_opcodes():
    if tag != "replace":
        continue
    if (i2 - i1) != 1 or (j2 - j1) != 1:
        continue
    w_pdf = pdf_words[i1]
    w_md  = md_words[j1]
    if is_noise(w_pdf, w_md):
        continue
    ctx_pdf = " ".join(pdf_words[max(0, i1-CONTEXT):i1+CONTEXT+1])
    ctx_md  = " ".join(md_words[max(0, j1-CONTEXT):j1+CONTEXT+1])
    
    # Extract a 5-word localized phrase fingerprint for precise PDF targeting
    phrase_pdf = " ".join(pdf_words[max(0, i1-2):min(len(pdf_words), i1+3)])
    
    md_token = md_tokens[j1]
    raw_md_word = md_text[md_token["start"]:md_token["end"]]
    
    candidates.append({
        "pdfWord":    w_pdf,
        "mdWord":     raw_md_word,
        "pdfContext": ctx_pdf,
        "mdContext":  ctx_md,
        "mdStart":    md_token["start"],
        "mdEnd":      md_token["end"],
        "pdfPhrase":  phrase_pdf,
        "pdfPage":    pdf_word_pages[i1]
    })

progress(f"Found {len(candidates)} candidate(s). Writing output...")
print("RESULT: " + json.dumps({
    "pdfWordCount": len(pdf_words),
    "mdWordCount":  len(md_words),
    "candidates":   candidates,
}), flush=True)
`;

  fs.writeFileSync(tmpPy, pythonScript, "utf8");

  let activeNotice = new Notice("PDFMarkdownDiff: Running analysis...", 0);

  const result = await new Promise((resolve) => {
    const proc = spawn("python3", [tmpPy], { encoding: "utf8" });
    let stdoutBuffer = "";
    let fullStdout   = "";
    let stderr       = "";

    proc.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk;
      fullStdout   += chunk;
      const lines = stdoutBuffer.split("\n");
      stdoutBuffer = lines.pop();
      for (const line of lines) {
        if (line.startsWith("PROGRESS: ")) {
          activeNotice.hide();
          activeNotice = new Notice("PDFMarkdownDiff: " + line.slice(10), 0);
        }
      }
    });

    proc.stderr.on("data", (chunk) => { stderr += chunk; });
    proc.on("close", (code) => { resolve({ code, stdout: fullStdout, stderr }); });
  });

  try { fs.unlinkSync(tmpMd); } catch {}
  try { fs.unlinkSync(tmpPy); } catch {}
  activeNotice.hide();

  if (result.code !== 0) {
    new Notice("PDFMarkdownDiff: Python script failed.\n" + (result.stderr || "").slice(0, 300));
    return;
  }

  const allOutput  = result.stdout;
  const resultLine = allOutput.split("\n").find((l) => l.startsWith("RESULT: "));
  if (!resultLine) {
    new Notice("PDFMarkdownDiff: No result from Python.\n" + allOutput.slice(0, 200));
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(resultLine.slice("RESULT: ".length));
  } catch {
    new Notice("PDFMarkdownDiff: Could not parse Python output.");
    return;
  }

  candidates = parsed.candidates;
  pdfWordCount = parsed.pdfWordCount;
  mdWordCount = parsed.mdWordCount;

  if (candidates.length === 0) {
    new Notice("PDFMarkdownDiff: No mismatches found.");
    return;
  }

  // Create JSON Tracker file
  const timestamp  = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const trackerName = `Review - ${activeFile.basename} vs ${chosenPDF.basename} ${timestamp}.json`;
  const trackerFolder = activeFile.parent?.path ?? "";
  const trackerPath = trackerFolder ? `${trackerFolder}/${trackerName}` : trackerName;

  // 1. Read note raw text directly from the vault before adding frontmatter metadata
  const textBefore = await app.vault.read(activeFile);
  const lengthBeforeMetadata = textBefore.replace(/\r\n/g, "\n").length;

  try {
    // Process original Markdown file's frontmatter to link the JSON tracker
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
      fm["DiffTracker"] = `[[${trackerPath}]]`;
    });
  } catch (err) {
    new Notice("PDFMarkdownDiff: Failed to write DiffTracker link to frontmatter.");
    return;
  }

  // 2. Read note raw text directly from vault after file modifications are completed on disk
  const textAfter = await app.vault.read(activeFile);
  const lengthAfterMetadata = textAfter.replace(/\r\n/g, "\n").length;
  cumulativeShift = lengthAfterMetadata - lengthBeforeMetadata;

  // 3. Force-write the active editor's visual buffer to prevent background UI synchronization lag
  editor.setValue(textAfter);

  const initialContent = JSON.stringify({
    type: "pdf-md-diff-tracker",
    targetMdPath,
    targetPdfPath,
    pdfWordCount,
    mdWordCount,
    currentIndex: 0,
    cumulativeShift: cumulativeShift, // Correct offset captured securely
    candidates,
    history: []
  }, null, 2);

  try {
    await app.vault.create(trackerPath, initialContent);
    trackerFile = app.vault.getAbstractFileByPath(trackerPath);
  } catch (err) {
    new Notice("PDFMarkdownDiff: Failed to generate progress tracker JSON file.");
    return;
  }
}

// Get file handles
const chosenPDF = app.vault.getAbstractFileByPath(targetPdfPath);
const targetMdFile = app.vault.getAbstractFileByPath(targetMdPath);

if (!chosenPDF || !targetMdFile) {
  new Notice("PDFMarkdownDiff: Target files listed in progress tracker are missing.");
  return;
}

// ─── 3. Construct 3-Pane Side-by-Side Split Layout ───────────────────────────

let pdfLeaf, mdLeaf, controlLeaf;

const rootLeaves = [];
app.workspace.iterateRootLeaves((l) => {
  if (l.view && l.view.containerEl) {
    rootLeaves.push(l);
  }
});

// Group open tabs spatially by their physical X coordinate to accurately determine columns
const columns = [];
for (const leaf of rootLeaves) {
  const rect = leaf.view.containerEl.getBoundingClientRect();
  const left = rect.left;
  let col = columns.find(c => Math.abs(c.left - left) < 10);
  if (!col) {
    col = { left: left, leaves: [] };
    columns.push(col);
  }
  col.leaves.push(leaf);
}

// Sort columns horizontally from left-most to right-most split pane
columns.sort((a, b) => a.left - b.left);

if (columns.length >= 2) {
  // If vertical split panes are already open, append a tab inside the left-most and right-most panes
  const leftColumn = columns[0];
  const rightColumn = columns[columns.length - 1];
  
  const leftSourceLeaf = leftColumn.leaves[0];
  const rightSourceLeaf = rightColumn.leaves[0];
  
  app.workspace.setActiveLeaf(leftSourceLeaf);
  pdfLeaf = app.workspace.getLeaf('tab');
  
  app.workspace.setActiveLeaf(rightSourceLeaf);
  mdLeaf = app.workspace.getLeaf('tab');
  await mdLeaf.openFile(targetMdFile);
} else {
  // Fallback: split the single active column vertically, placing the new PDF pane on the left
  const activeLeaf = app.workspace.getMostRecentLeaf();
  pdfLeaf = app.workspace.createLeafBySplit(activeLeaf, 'vertical', true);
  mdLeaf = activeLeaf;
}

// Open the PDF in the left pane immediately during setup
await pdfLeaf.openFile(chosenPDF);

// Create the control pane horizontally split below the Markdown pane
controlLeaf = app.workspace.createLeafBySplit(mdLeaf, 'horizontal');
await controlLeaf.setViewState({ type: "empty" });

// Focus back onto the Markdown editor for selection navigation
app.workspace.setActiveLeaf(mdLeaf, { focus: true });

const mdView = mdLeaf.view;
if (!(mdView instanceof MarkdownView)) {
  new Notice("PDFMarkdownDiff: Markdown split pane view initialization failed.");
  return;
}
const editor = mdView.editor;

// ─── 4. Render HTML Control Panel inside bottom-right split ──────────────────

const container = controlLeaf.view.containerEl;
container.empty();

const styleEl = activeDocument.createElement("style");
styleEl.textContent = `
  .diff-control-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    height: 100%;
    overflow-y: auto;
    font-family: var(--font-interface);
    color: var(--text-normal);
  }
`;
container.appendChild(styleEl);

const panel = activeDocument.createElement("div");
panel.className = "diff-control-panel";
panel.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 4px;">
    <span style="font-weight: 600; font-size: 1.1em;">Review Mismatches</span>
    <span id="diff-counter" style="color: var(--text-muted); font-size: 0.9em;">0 / 0</span>
  </div>
  
  <div style="display: flex; gap: 12px; align-items: stretch;">
    <div style="flex: 1; overflow: hidden;">
      <div style="font-size: 0.8em; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 2px;">PDF Says</div>
      <div id="diff-pdf-word" style="font-family: var(--font-monospace); font-size: 1.1em; background: var(--background-primary); padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-color); color: var(--text-accent); font-weight: 600; text-align: center; height: 36px; line-height: 24px; box-sizing: border-box; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">word</div>
    </div>

    <div style="flex: 1; overflow: hidden;">
      <div style="font-size: 0.8em; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 2px;">Original MD</div>
      <div id="diff-md-word-original" style="font-family: var(--font-monospace); font-size: 1.1em; background: var(--background-primary); padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-color); color: var(--text-error, #ff4444); font-weight: 600; text-align: center; height: 36px; line-height: 24px; box-sizing: border-box; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">word</div>
    </div>
    
    <div style="flex: 1.2;">
      <div style="font-size: 0.8em; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 2px;">Correction (Editable)</div>
      <input id="diff-md-word-input" type="text" style="width: 100%; font-family: var(--font-monospace); font-size: 1.1em; background: var(--background-primary); padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-color); color: var(--text-normal); font-weight: 600; text-align: center; height: 36px; box-sizing: border-box;" />
    </div>
  </div>

  <div style="font-size: 0.9em; background: var(--background-primary-alt); padding: 10px; border-radius: 4px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 6px;">
    <div>
      <div style="font-size: 0.8em; color: var(--text-muted); font-weight: 600;">Context (PDF)</div>
      <div id="diff-pdf-context" style="color: var(--text-normal); font-style: italic; line-height: 1.3;">...</div>
    </div>
    <div>
      <div style="font-size: 0.8em; color: var(--text-muted); font-weight: 600; margin-top: 4px;">Context (Markdown)</div>
      <div id="diff-md-context" style="color: var(--text-normal); font-style: italic; line-height: 1.3;">...</div>
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 4px;">
    <button id="diff-btn-prev" class="btn" style="flex: 1; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 500;">◀ Prev</button>
    <button id="diff-btn-skip" class="btn" style="flex: 1; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 500;">Skip ⏭</button>
  </div>
  <div style="display: flex; justify-content: space-between; gap: 8px;">
    <button id="diff-btn-approve" class="btn mod-cta" style="flex: 2; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: 600; background-color: var(--interactive-accent); color: var(--text-on-accent);">✔ Approve Change</button>
    <button id="diff-btn-close" class="btn" style="flex: 1; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--text-error); font-weight: 500;">Close</button>
  </div>
`;
container.appendChild(panel);

// ─── 5. State, Navigation, and Serialization Logic ────────────────────────────

const counterEl = container.querySelector("#diff-counter");
const pdfWordEl = container.querySelector("#diff-pdf-word");
const mdWordOriginalEl = container.querySelector("#diff-md-word-original");
const mdWordInputEl = container.querySelector("#diff-md-word-input");
const pdfCtxEl = container.querySelector("#diff-pdf-context");
const mdCtxEl = container.querySelector("#diff-md-context");

const btnPrev = container.querySelector("#diff-btn-prev");
const btnSkip = container.querySelector("#diff-btn-skip");
const btnApprove = container.querySelector("#diff-btn-approve");
const btnClose = container.querySelector("#diff-btn-close");

// Sequential Write Lock Queue to prevent file writing race conditions
let isWriting = false;
let pendingWriteContent = null;

async function writeTrackerFileSequential(content) {
  if (isWriting) {
    pendingWriteContent = content;
    return;
  }
  isWriting = true;
  try {
    await app.vault.modify(trackerFile, content);
  } catch (err) {
    console.error("PDFMarkdownDiff: Error during file write:", err);
  }
  isWriting = false;
  if (pendingWriteContent) {
    const nextContent = pendingWriteContent;
    pendingWriteContent = null;
    await writeTrackerFileSequential(nextContent);
  }
}

async function saveTrackerState() {
  if (trackerFile) {
    const updatedContent = JSON.stringify({
      type: "pdf-md-diff-tracker",
      targetMdPath,
      targetPdfPath,
      pdfWordCount,
      mdWordCount,
      currentIndex,
      cumulativeShift,
      candidates,
      history
    }, null, 2);
    
    await writeTrackerFileSequential(updatedContent);
  }
}

// Concurrency locks to handle fast skips and prevent parallel write clashes on large documents
let currentRenderId = 0;
let isFinishing = false;

async function updateUI() {
  const myRenderId = ++currentRenderId;

  if (currentIndex < 0 || currentIndex >= candidates.length) {
    // Only permit the completion cleanup block to execute exactly once
    if (isFinishing) return;
    isFinishing = true;

    cleanup();
    if (trackerFile) {
      try {
        // Delete JSON tracker file on complete finish
        await app.vault.delete(trackerFile);
      } catch (err) {
        console.warn("PDFMarkdownDiff: Tracker file deletion bypassed or already deleted.", err);
      }

      // Clean up DiffTracker frontmatter and add the "DiffChecked" tag
      const origFile = app.vault.getAbstractFileByPath(targetMdPath);
      if (origFile) {
        await app.fileManager.processFrontMatter(origFile, (fm) => {
          // Clean up state tracking keys
          delete fm["DiffTracker"];
          delete fm["diffTracker"];
          delete fm["difftracker"];
          
          // Retrieve existing tags properties
          let tags = fm["tags"] || fm["tag"] || [];
          
          // Parse tag list safely
          if (typeof tags === "string") {
            if (tags.trim() === "") {
              tags = ["DiffChecked"];
            } else {
              const splitTags = tags.split(/[\s,]+/).map(t => t.replace(/^#/, "").trim()).filter(Boolean);
              if (!splitTags.includes("DiffChecked")) {
                splitTags.push("DiffChecked");
              }
              tags = splitTags;
            }
          } else if (Array.isArray(tags)) {
            const cleanedTags = tags.map(t => typeof t === "string" ? t.replace(/^#/, "").trim() : t).filter(Boolean);
            if (!cleanedTags.includes("DiffChecked")) {
              cleanedTags.push("DiffChecked");
            }
            tags = cleanedTags;
          } else {
            tags = ["DiffChecked"];
          }
          
          fm["tags"] = tags;
        });
      }
    }
    new Notice(`PDFMarkdownDiff: Review finished!`);
    return;
  }
  
  const candidate = candidates[currentIndex];
  
  counterEl.textContent = `${currentIndex + 1} / ${candidates.length}`;
  pdfWordEl.textContent = candidate.pdfWord;
  mdWordOriginalEl.textContent = candidate.mdWord;
  pdfCtxEl.textContent = `...${candidate.pdfContext}...`;
  mdCtxEl.textContent = `...${candidate.mdContext}...`;
  
  // Set default replacement text (PDF word) inside the editable input field, matching original capitalization
  let defaultReplacement = candidate.pdfWord;
  if (candidate.mdWord && candidate.mdWord[0] === candidate.mdWord[0].toUpperCase()) {
    defaultReplacement = defaultReplacement.charAt(0).toUpperCase() + defaultReplacement.slice(1);
  }
  mdWordInputEl.value = defaultReplacement;

  btnPrev.disabled = currentIndex === 0;
  btnPrev.style.opacity = currentIndex === 0 ? "0.5" : "1";
  btnPrev.style.cursor = currentIndex === 0 ? "not-allowed" : "pointer";
  
  // Target raw word for exact find query match
  let basePhrase = candidate.pdfWord;

  // Mathematical variables or short words (like "ith", "d", "gcd") often fail to match 
  // exactly in PDF.js due to typesetting spans. Fall back to a longer neighbor word 
  // from the context to ensure the PDF viewer successfully scrolls to the paragraph.
  if (basePhrase.length <= 3) {
    const contextWords = candidate.pdfContext.split(/\s+/).filter(w => w.length > 4);
    if (contextWords.length > 0) {
      // Exclude generic structural words that might appear elsewhere on the page
      const structural = ["page", "chapter", "figure", "table", "appendix"];
      const clearWords = contextWords.filter(w => !structural.includes(w.toLowerCase()));
      if (clearWords.length > 0) {
        // Sort by length descending to target the most unique surrounding word
        clearWords.sort((a, b) => b.length - a.length);
        basePhrase = clearWords[0];
      }
    }
  }

  // Pre-evaluation check: Cancel execution if a newer skip command has already been triggered
  if (myRenderId !== currentRenderId) return;
  
  // 1. Update native view state to navigate correct PDF file path
  let subpath = "";
  if (candidate.pdfPage) {
    subpath = `page=${candidate.pdfPage}`;
  }

  try {
    await pdfLeaf.setViewState({
      type: "pdf",
      state: {
        file: chosenPDF.path,
        subpath: subpath
      }
    });
  } catch (err) {
    console.warn("PDFMarkdownDiff: Failed to trigger PDF page navigation.", err);
  }

  if (myRenderId !== currentRenderId) return;

  // Allow a short moment for the PDF viewer layout to resolve
  await new Promise(r => setTimeout(r, 120));
  if (myRenderId !== currentRenderId) return;

  try {
    const pdfViewer = pdfLeaf.view?.viewer?.child?.pdfViewer?.pdfViewer;
    const eventBus   = pdfLeaf.view?.viewer?.child?.pdfViewer?.eventBus;

    if (pdfViewer) {
      // Direct jump to the target page via PDF.js API
      if (candidate.pdfPage) {
        pdfViewer.currentPageNumber = candidate.pdfPage;
      }

      // Configure programmatic search highlighting on the PDF canvas using event-driven find queries
      const searchOptions = {
        query: basePhrase,
        caseSensitive: false,
        entireWord: false,
        highlightAll: true,
        findPrevious: false
      };

      if (eventBus && typeof eventBus.dispatch === "function") {
        eventBus.dispatch("find", searchOptions);
      } else if (pdfViewer.findController && typeof pdfViewer.findController.executeCommand === "function") {
        pdfViewer.findController.executeCommand("find", searchOptions);
      }
    }
  } catch (err) {
    console.warn("PDFMarkdownDiff: PDFJS programmatic search highlight failed.", err);
  }

  if (myRenderId !== currentRenderId) return;

  // 2. Force focus back onto the Markdown editor split pane
  app.workspace.setActiveLeaf(mdLeaf, { focus: true });

  // 3. Highlight Markdown mismatched text (centered dynamically in viewport)
  const start = candidate.mdStart + cumulativeShift;
  const end = candidate.mdEnd + cumulativeShift;
  const from = editor.offsetToPos(start);
  const to = editor.offsetToPos(end);
  
  editor.setSelection(from, to);
  editor.scrollIntoView({ from, to }, true);

  if (myRenderId !== currentRenderId) return;

  await saveTrackerState();
}

// Bind hitting Enter in the text input box to trigger the Approve Change button action
mdWordInputEl.onkeydown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btnApprove.click();
  }
};

function cleanup() {
  if (controlLeaf) {
    controlLeaf.detach();
  }
}

// Transaction-Based Undo System: surgically reverses the last action in place of cloning the text
btnPrev.onclick = async () => {
  if (currentIndex > 0) {
    currentIndex--;
    const state = history[currentIndex];
    
    if (state && state.type === "approve") {
      const from = editor.offsetToPos(state.startOffset);
      const to = editor.offsetToPos(state.endOffset);
      editor.replaceRange(state.originalWord, from, to);
    }
    
    cumulativeShift = state.cumulativeShift;
    await updateUI();
  }
};

btnSkip.onclick = async () => {
  history[currentIndex] = {
    type: "skip",
    cumulativeShift: cumulativeShift
  };
  currentIndex++;
  await updateUI();
};

btnApprove.onclick = async () => {
  const candidate = candidates[currentIndex];
  const start = candidate.mdStart + cumulativeShift;
  const end = candidate.mdEnd + cumulativeShift;
  
  const from = editor.offsetToPos(start);
  const to = editor.offsetToPos(end);
  
  // Use the exact custom text typed into the editable input field
  const replacement = mdWordInputEl.value;
  const originalWord = editor.getRange(from, to);

  history[currentIndex] = {
    type: "approve",
    cumulativeShift: cumulativeShift,
    originalWord: originalWord,
    replacementWord: replacement,
    startOffset: start,
    endOffset: start + replacement.length
  };
  
  editor.replaceRange(replacement, from, to);
  
  const lengthDiff = replacement.length - (end - start);
  cumulativeShift += lengthDiff;
  
  currentIndex++;
  await updateUI();
};

btnClose.onclick = async () => {
  cleanup();
  await saveTrackerState();
  new Notice("PDFMarkdownDiff: Progress suspended. Run script inside tracker note to resume.");
};

// Start or Resume Review Session
await updateUI();

};