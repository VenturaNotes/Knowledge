// PDFMarkdownDiff.js
// Script Runner plugin script.
// Open the markdown note you want to verify as the active file, then run this.
// A fuzzy PDF picker appears — pick the source PDF. A new note is created
// with the diff results.
//
// Requirements:
//   - Python 3 (ships with macOS)
//   - pdftotext: brew install poppler
//   - No extra Python packages needed (difflib is stdlib)

module.exports = async ({ app }) => {

const { execSync, spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// ─── 1. Get active markdown file ─────────────────────────────────────────────

const activeFile = app.workspace.getActiveFile();
if (!activeFile || activeFile.extension !== "md") {
  new Notice("PDFMarkdownDiff: Open the markdown note you want to verify first.");
  return;
}

const vaultRoot = app.vault.adapter.basePath;
const mdText = await app.vault.read(activeFile);

// ─── 2. Fuzzy PDF picker ──────────────────────────────────────────────────────

const allPDFs = app.vault.getFiles().filter((f) => f.extension === "pdf");
if (allPDFs.length === 0) {
  new Notice("PDFMarkdownDiff: No PDF files found in vault.");
  return;
}

const { SuggestModal } = require("obsidian");

const chosenPDF = await new Promise((resolve) => {
  class PDFPicker extends SuggestModal {
    getSuggestions(query) {
      const q = query.toLowerCase();
      return allPDFs.filter((f) => f.path.toLowerCase().includes(q));
    }
    renderSuggestion(file, el) {
      el.createEl("div", { text: file.basename, cls: "suggestion-title" });
      el.createEl("small", { text: file.path, cls: "suggestion-note" });
    }
    onChooseSuggestion(file) { resolve(file); }
    onClose() { setTimeout(() => resolve(null), 50); }
  }
  new PDFPicker(app).open();
});

if (!chosenPDF) {
  new Notice("PDFMarkdownDiff: No PDF selected.");
  return;
}

const pdfAbsPath = path.join(vaultRoot, chosenPDF.path);

// ─── 3. Write markdown to temp file ──────────────────────────────────────────

const tmpDir = os.tmpdir();
const tmpMd  = path.join(tmpDir, `pdfmd_${Date.now()}.md`);
const tmpPy  = path.join(tmpDir, `pdfmd_${Date.now()}.py`);
fs.writeFileSync(tmpMd, mdText, "utf8");

// ─── 4. Inline Python script ─────────────────────────────────────────────────
// Self-contained: extracts PDF text, strips MD/LaTeX, diffs with difflib,
// outputs JSON array of candidates to stdout.

const pythonScript = `
import sys, re, subprocess, difflib, json

PDFTOTEXT = "/opt/homebrew/bin/pdftotext"
PDF_PATH  = ${JSON.stringify(pdfAbsPath)}
MD_PATH   = ${JSON.stringify(tmpMd)}
CONTEXT   = 4

def extract_pdf(path):
    r = subprocess.run([PDFTOTEXT, "-layout", path, "-"],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(json.dumps({"error": r.stderr}))
        sys.exit(1)
    return r.stdout

def strip_md(text):
    t = text
    t = re.sub(r"^---.*?---\\s*", "", t, flags=re.DOTALL)
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.DOTALL)
    t = re.sub(r"!\\[\\[.*?\\]\\]", " ", t)
    t = re.sub(r"\\$\\$.*?\\$\\$", " ", t, flags=re.DOTALL)
    t = re.sub(r"\\$[^$]*\\$", " ", t)
    t = re.sub(r"\\\\tag\\{[^}]*\\}", " ", t)
    t = re.sub(r"\\\\\\[\\d+\\\\\\]", " ", t)
    t = re.sub(r"^#+\\s*", "", t, flags=re.MULTILINE)
    t = re.sub(r"\\*\\*([^*]+)\\*\\*", r"\\1", t)
    t = re.sub(r"\\*([^*]+)\\*", r"\\1", t)
    t = re.sub(r"^>.*$", " ", t, flags=re.MULTILINE)
    t = re.sub(r"^\\*\\*\\*$", " ", t, flags=re.MULTILINE)
    t = re.sub(r"\\[([^\\]]+)\\]\\([^)]+\\)", r"\\1", t)
    return t

def tokenize(text):
    return re.findall(r"[a-z]+(?:-[a-z]+)*", text.lower())

def is_noise(a, b):
    if len(a) <= 1 or len(b) <= 1:
        return True
    structural = {"page","chapter","figure","table","appendix"}
    if a in structural and b not in structural:
        return True
    return False

pdf_text = extract_pdf(PDF_PATH)
md_text  = open(MD_PATH, encoding="utf-8").read()
md_text  = strip_md(md_text)

pdf_words = tokenize(pdf_text)
md_words  = tokenize(md_text)

matcher = difflib.SequenceMatcher(None, pdf_words, md_words, autojunk=True)
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
    candidates.append({
        "pdfWord": w_pdf,
        "mdWord":  w_md,
        "pdfContext": ctx_pdf,
        "mdContext":  ctx_md,
    })

print(json.dumps({
    "pdfWordCount": len(pdf_words),
    "mdWordCount":  len(md_words),
    "candidates":   candidates,
}))
`;

fs.writeFileSync(tmpPy, pythonScript, "utf8");

// ─── 5. Run Python ────────────────────────────────────────────────────────────

new Notice("PDFMarkdownDiff: Running diff (may take a moment for large docs)...");

let result;
try {
  result = spawnSync("python3", [tmpPy], {
    encoding: "utf8",
    maxBuffer: 100 * 1024 * 1024,
    timeout: 300_000, // 5 min — generous for 200k-word docs
  });
} finally {
  // Clean up temp files regardless of outcome
  try { fs.unlinkSync(tmpMd); } catch {}
  try { fs.unlinkSync(tmpPy); } catch {}
}

if (result.error) {
  new Notice("PDFMarkdownDiff: Failed to run Python.\n" + result.error.message);
  return;
}
if (result.status !== 0) {
  new Notice("PDFMarkdownDiff: Python script failed.\n" + (result.stderr || "").slice(0, 300));
  return;
}

let parsed;
try {
  parsed = JSON.parse(result.stdout);
} catch {
  new Notice("PDFMarkdownDiff: Could not parse Python output.\n" + result.stdout.slice(0, 200));
  return;
}

if (parsed.error) {
  new Notice("PDFMarkdownDiff: pdftotext error.\n" + parsed.error.slice(0, 300));
  return;
}

const { pdfWordCount, mdWordCount, candidates } = parsed;

// ─── 6. Write output note ────────────────────────────────────────────────────

const timestamp  = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outputName = `Diff - ${activeFile.basename} vs ${chosenPDF.basename} ${timestamp}.md`;
const outputFolder = activeFile.parent?.path ?? "";
const outputPath   = outputFolder ? `${outputFolder}/${outputName}` : outputName;

const lines = [
  `# Diff: ${activeFile.basename} vs ${chosenPDF.basename}`,
  ``,
  `**Generated:** ${new Date().toLocaleString()}`,
  `**PDF word count:** ${pdfWordCount}`,
  `**Markdown word count:** ${mdWordCount}`,
  `**Candidates flagged:** ${candidates.length}`,
  ``,
  `> Word-level 1:1 substitutions only. Insertions/deletions (reformatting, stripped headers) are excluded.`,
  `> Each candidate may be a genuine typo OR correct reformatting — review manually.`,
  ``,
  `---`,
  ``,
];

if (candidates.length === 0) {
  lines.push("✅ No word-level mismatches found.");
} else {
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    lines.push(`## Candidate ${i + 1}`);
    lines.push(``);
    lines.push(`| | Word |`);
    lines.push(`|---|---|`);
    lines.push(`| **PDF says** | \`${c.pdfWord}\` |`);
    lines.push(`| **MD has** | \`${c.mdWord}\` |`);
    lines.push(``);
    lines.push(`**PDF context:** ...${c.pdfContext}...`);
    lines.push(``);
    lines.push(`**MD context:** ...${c.mdContext}...`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }
}

try {
  await app.vault.create(outputPath, lines.join("\n"));
  const outputFile = app.vault.getAbstractFileByPath(outputPath);
  await app.workspace.getLeaf("tab").openFile(outputFile);
  new Notice(`PDFMarkdownDiff: ${candidates.length} candidate(s) written to "${outputName}"`);
} catch (err) {
  new Notice("PDFMarkdownDiff: Failed to write output note.\n" + err.message);
}

};