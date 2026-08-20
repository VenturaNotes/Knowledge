import { 
    App, 
    Plugin, 
    PluginSettingTab, 
    Setting, 
    MarkdownView, 
    Modal, 
    Notice 
} from 'obsidian';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';

interface AirSketchSettings {
    port: number;
    drawingsFolder: string;
}

const DEFAULT_SETTINGS: AirSketchSettings = {
    port: 4444,
    drawingsFolder: 'Private/Drawings'
};

// Modal for creating and embedding drawings at cursor
class CreateDrawingModal extends Modal {
    private plugin: AirSketchPlugin;
    private onConfirm: (name: string) => void;

    constructor(app: App, plugin: AirSketchPlugin, onConfirm: (name: string) => void) {
        super(app);
        this.plugin = plugin;
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h3', { text: '✈️ Create & Embed AirSketch' });

        const now = new Date();
        const defaultName = `drawing-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;

        let inputVal = defaultName;

        new Setting(contentEl)
            .setName('Drawing Name')
            .setDesc('Will be saved in ' + this.plugin.settings.drawingsFolder)
            .addText(text => {
                text.setValue(defaultName);
                text.onChange(v => { inputVal = v.trim(); });
                text.inputEl.focus();
                text.inputEl.select();
                text.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.close();
                        this.onConfirm(inputVal || defaultName);
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Cancel')
                .onClick(() => this.close())
            )
            .addButton(btn => btn
                .setButtonText('Create & Embed')
                .setCta()
                .onClick(() => {
                    this.close();
                    this.onConfirm(inputVal || defaultName);
                })
            );
    }

    onClose() {
        this.contentEl.empty();
    }
}

export default class AirSketchPlugin extends Plugin {
    settings: AirSketchSettings = DEFAULT_SETTINGS;
    private server: http.Server | null = null;
    private sseClients: http.ServerResponse[] = [];

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new AirSketchSettingTab(this.app, this));

        // 1. Start iPad Drawing Server
        await this.startServer();

        // 2. Command: Create and Embed at Cursor
        this.addCommand({
            id: 'create-embed-airsketch',
            name: 'Create and Embed New Drawing at Cursor',
            callback: () => this.handleCreateAndEmbed()
        });

        // 3. Command: Copy iPad URL
        this.addCommand({
            id: 'copy-ipad-url',
            name: 'Copy iPad AirSketch URL to Clipboard',
            callback: () => {
                const url = `http://${os.hostname()}:${this.settings.port}`;
                navigator.clipboard.writeText(url);
                new Notice(`📋 Copied AirSketch URL: ${url}`);
            }
        });
    }

    onunload() {
        this.stopServer();
    }

    private getVaultDrawingsPath(): string {
        return this.settings.drawingsFolder.replace(/^\//, '').replace(/\/$/, '');
    }

    private async handleCreateAndEmbed() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
            new Notice('⚠️ Open a Markdown note to embed the drawing at your cursor.');
            return;
        }

        new CreateDrawingModal(this.app, this, async (name) => {
            const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = cleanName.endsWith('.svg') ? cleanName : `${cleanName}.svg`;
            const folderPath = this.getVaultDrawingsPath();
            const filePath = `${folderPath}/${fileName}`;

            // 1. Ensure folder exists in vault
            if (!(await this.app.vault.adapter.exists(folderPath))) {
                await this.app.vault.adapter.mkdir(folderPath);
            }

            // 2. Create blank template SVG on disk if it doesn't exist
            if (!(await this.app.vault.adapter.exists(filePath))) {
                const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background:#18181b;">
  <metadata data-state="%7B%22strokes%22%3A%5B%5D%2C%22scale%22%3A1%2C%22panX%22%3A0%2C%22panY%22%3A0%7D"></metadata>
</svg>`;
                await this.app.vault.adapter.write(filePath, emptySvg);
            }

            // 3. Insert embed link right at active cursor in CodeMirror
            view.editor.replaceSelection(`\n![[${filePath}]]\n`);

            // 4. Live-broadcast to iPad to switch to this drawing instantly
            this.broadcastToIpad({ type: 'switch', name: fileName });

            new Notice(`✈️ Embedded & Pushed [[${fileName}]] to iPad`);
        }).open();
    }

    // Broadcasts real-time events to connected iPads via Server-Sent Events
    private broadcastToIpad(data: any) {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        this.sseClients = this.sseClients.filter(client => {
            try {
                client.write(payload);
                return true;
            } catch {
                return false;
            }
        });
    }

    private async startServer() {
        this.stopServer();

        const folderPath = this.getVaultDrawingsPath();
        if (!(await this.app.vault.adapter.exists(folderPath))) {
            await this.app.vault.adapter.mkdir(folderPath);
        }

        const HTML_CLIENT = this.getHtmlClient();

        this.server = http.createServer(async (req, res) => {
            const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

            if (url.pathname === '/' || url.pathname === '/index.html') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(HTML_CLIENT);
            } else if (url.pathname === '/api/events') {
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write('\n');
                this.sseClients.push(res);
                req.on('close', () => {
                    this.sseClients = this.sseClients.filter(c => c !== res);
                });
            } else if (url.pathname === '/api/list') {
                try {
                    const listing = await this.app.vault.adapter.list(folderPath);
                    const files = listing.files
                        .filter(f => f.endsWith('.svg'))
                        .map(f => path.basename(f));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(files));
                } catch {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end('[]');
                }
            } else if (url.pathname === '/api/load') {
                const name = path.basename(url.searchParams.get('name') ?? '');
                const filePath = `${folderPath}/${name}`;
                try {
                    if (await this.app.vault.adapter.exists(filePath)) {
                        const content = await this.app.vault.adapter.read(filePath);
                        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
                        res.end(content);
                    } else {
                        res.writeHead(404).end('Not found');
                    }
                } catch {
                    res.writeHead(500).end('Read error');
                }
            } else if (url.pathname === '/api/save' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', async () => {
                    try {
                        const { name, svg } = JSON.parse(body);
                        const cleanName = (name || 'scratchpad').replace(/[^a-zA-Z0-9_-]/g, '_');
                        const fileName = cleanName.endsWith('.svg') ? cleanName : `${cleanName}.svg`;
                        const filePath = `${folderPath}/${fileName}`;

                        await this.app.vault.adapter.write(filePath, svg);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, file: fileName }));
                    } catch (e: any) {
                        res.writeHead(500).end(e.message);
                    }
                });
            } else {
                res.writeHead(404).end();
            }
        });

        this.server.listen(this.settings.port, '0.0.0.0', () => {
            console.log(`[AirSketch] Server running on port ${this.settings.port}`);
        });
    }

    private stopServer() {
        if (this.server) {
            try { this.server.close(); } catch {}
            this.server = null;
        }
        this.sseClients.forEach(c => {
            try { c.end(); } catch {}
        });
        this.sseClients = [];
    }

    private getHtmlClient(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>AirSketch</title>
<style>
  * { box-sizing: border-box; touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
  body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #18181b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
  #canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: crosshair; touch-action: none; }
  .top-bar {
    position: fixed; top: 8px; left: 8px; right: 8px; height: 44px; display: flex; gap: 6px; align-items: center;
    background: rgba(28, 28, 32, 0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    padding: 4px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); z-index: 1000;
  }
  .btn {
    background: #2c2c30; color: #fff; border: 1px solid rgba(255,255,255,0.12); padding: 6px 12px; border-radius: 7px;
    font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; touch-action: manipulation;
  }
  .btn:active, .btn.active { background: #8b5cf6; border-color: #a78bfa; }
  .btn.primary { background: #22c55e; border-color: #4ade80; }
  .color-picker { display: flex; gap: 6px; margin: 0 4px; }
  .color-dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; touch-action: manipulation; }
  .color-dot.active { border-color: #fff; transform: scale(1.15); }
  input[type="text"], select {
    background: #202024; color: #fff; border: 1px solid rgba(255,255,255,0.15); padding: 5px 8px; border-radius: 6px; font-size: 13px; outline: none;
  }
  .spacer { flex: 1; }
  #status { font-size: 12px; color: #a1a1aa; margin-right: 4px; }
  #modalOverlay {
    display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
    z-index: 2000; align-items: center; justify-content: center;
  }
  .modal-card { background: #252528; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 18px; width: 300px; }
</style>
</head>
<body>

<div class="top-bar">
  <select id="fileList"><option value="">-- Load --</option></select>
  <button class="btn" id="newBtn">+ New</button>
  <input type="text" id="docName" placeholder="Drawing name..." value="scratchpad" style="width: 130px;">
  
  <div class="color-picker">
    <div class="color-dot active" style="background:#ffffff;" data-color="#ffffff"></div>
    <div class="color-dot" style="background:#a78bfa;" data-color="#a78bfa"></div>
    <div class="color-dot" style="background:#60a5fa;" data-color="#60a5fa"></div>
    <div class="color-dot" style="background:#34d399;" data-color="#34d399"></div>
    <div class="color-dot" style="background:#f87171;" data-color="#f87171"></div>
    <div class="color-dot" style="background:#fbbf24;" data-color="#fbbf24"></div>
  </div>

  <button class="btn active" id="penBtn">Pen</button>
  <button class="btn" id="highlighterBtn">Highlighter</button>
  <button class="btn" id="eraserBtn">Eraser</button>
  <button class="btn" id="undoBtn">↶ Undo</button>
  
  <div class="spacer"></div>
  <span id="status">Ready</span>
  <button class="btn primary" id="saveBtn">Save</button>
</div>

<canvas id="canvas"></canvas>

<div id="modalOverlay">
  <div class="modal-card">
    <h3 style="margin-top:0; margin-bottom:10px; font-size:15px;">New AirSketch</h3>
    <input type="text" id="modalInput" style="width:100%; margin-bottom:14px; padding:8px;" placeholder="Drawing name...">
    <div style="display:flex; gap:8px; justify-content:flex-end;">
      <button class="btn" id="modalCancel">Cancel</button>
      <button class="btn" id="modalConfirm" style="background:#8b5cf6;">Create</button>
    </div>
  </div>
</div>

<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let strokes = [];
let currentStroke = null;
let currentTool = 'pen';
let currentColor = '#ffffff';

let scale = 1, panX = 0, panY = 0;
let isDrawing = false, isPanning = false;
let prevPinchDist = null, prevPinchMid = null;
let autoSaveTimer = null;

const PEN_SIZE = 2.4;
const HIGHLIGHTER_SIZE = 18;
const ERASER_SIZE = 32;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  render();
}
window.addEventListener('resize', resize);

function toCanvasCoord(screenX, screenY) {
  return { x: (screenX - panX) / scale, y: (screenY - panY) / scale };
}

function render() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(scale, scale);

  strokes.forEach(s => {
    if (s.points.length < 1) return;
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (s.tool === 'highlighter') {
      ctx.strokeStyle = s.color + '66';
      ctx.lineWidth = HIGHLIGHTER_SIZE;
    } else if (s.tool === 'eraser') {
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = ERASER_SIZE;
    } else {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size || PEN_SIZE;
    }

    if (s.points.length === 1) {
      const radius = (s.tool === 'highlighter' ? HIGHLIGHTER_SIZE : (s.size || PEN_SIZE)) / 2;
      ctx.arc(s.points[0].x, s.points[0].y, radius, 0, Math.PI * 2);
      ctx.fillStyle = s.tool === 'eraser' ? '#18181b' : (s.tool === 'highlighter' ? s.color + '66' : s.color);
      ctx.fill();
    } else if (s.points.length === 2) {
      ctx.moveTo(s.points[0].x, s.points[0].y);
      ctx.lineTo(s.points[1].x, s.points[1].y);
      ctx.stroke();
    } else {
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length - 1; i++) {
        const midX = (s.points[i].x + s.points[i + 1].x) / 2;
        const midY = (s.points[i].y + s.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, midX, midY);
      }
      ctx.lineTo(s.points[s.points.length - 1].x, s.points[s.points.length - 1].y);
      ctx.stroke();
    }
  });

  ctx.restore();
}

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (e.touches.length === 1) {
    isPanning = false;
    isDrawing = true;
    const t = e.touches[0];
    const cPt = toCanvasCoord(t.clientX, t.clientY);
    currentStroke = {
      tool: currentTool,
      color: currentColor,
      size: currentTool === 'highlighter' ? HIGHLIGHTER_SIZE : (currentTool === 'eraser' ? ERASER_SIZE : PEN_SIZE),
      points: [cPt]
    };
    strokes.push(currentStroke);
    render();
  } else if (e.touches.length === 2) {
    if (currentStroke && currentStroke.points.length <= 2) {
      strokes.pop();
      currentStroke = null;
    }
    isDrawing = false;
    isPanning = true;
    const t1 = e.touches[0], t2 = e.touches[1];
    prevPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    prevPinchMid = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (isDrawing && e.touches.length === 1 && currentStroke) {
    const t = e.touches[0];
    currentStroke.points.push(toCanvasCoord(t.clientX, t.clientY));
    render();
    return;
  }
  if (isPanning && e.touches.length === 2 && prevPinchDist && prevPinchMid) {
    const t1 = e.touches[0], t2 = e.touches[1];
    const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    const currentMid = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
    if (currentDist > 0) {
      panX += (currentMid.x - prevPinchMid.x);
      panY += (currentMid.y - prevPinchMid.y);
      const newScale = Math.min(Math.max(0.2, scale * (currentDist / prevPinchDist)), 5.0);
      const canvasX = (currentMid.x - panX) / scale;
      const canvasY = (currentMid.y - panY) / scale;
      scale = newScale;
      panX = currentMid.x - canvasX * scale;
      panY = currentMid.y - canvasY * scale;
      prevPinchDist = currentDist;
      prevPinchMid = currentMid;
      render();
    }
  }
}, { passive: false });

function handleTouchEnd(e) {
  if (e.touches.length === 0) {
    isDrawing = false; isPanning = false; currentStroke = null;
    prevPinchDist = null; prevPinchMid = null;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(triggerAutoSave, 1200);
  } else if (e.touches.length === 1) {
    isPanning = false; isDrawing = false; currentStroke = null;
  }
}
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

function bindBtn(btnEl, callback) {
  const handler = (e) => { e.preventDefault(); e.stopPropagation(); callback(); isDrawing = false; isPanning = false; currentStroke = null; };
  btnEl.addEventListener('touchstart', handler, { passive: false });
  btnEl.addEventListener('mousedown', handler);
}

document.querySelectorAll('.color-dot').forEach(dot => {
  bindBtn(dot, () => {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    currentColor = dot.dataset.color;
    if (currentTool === 'eraser') {
      currentTool = 'pen';
      document.getElementById('penBtn').classList.add('active');
      document.getElementById('eraserBtn').classList.remove('active');
    }
  });
});

bindBtn(document.getElementById('penBtn'), () => {
  currentTool = 'pen';
  document.getElementById('penBtn').classList.add('active');
  document.getElementById('highlighterBtn').classList.remove('active');
  document.getElementById('eraserBtn').classList.remove('active');
});
bindBtn(document.getElementById('highlighterBtn'), () => {
  currentTool = 'highlighter';
  document.getElementById('highlighterBtn').classList.add('active');
  document.getElementById('penBtn').classList.remove('active');
  document.getElementById('eraserBtn').classList.remove('active');
});
bindBtn(document.getElementById('eraserBtn'), () => {
  currentTool = 'eraser';
  document.getElementById('eraserBtn').classList.add('active');
  document.getElementById('penBtn').classList.remove('active');
  document.getElementById('highlighterBtn').classList.remove('active');
});
bindBtn(document.getElementById('undoBtn'), () => {
  strokes.pop(); render(); triggerAutoSave();
});

async function triggerAutoSave() {
  const docName = document.getElementById('docName').value.trim() || 'scratchpad';
  document.getElementById('status').innerText = 'Saving...';
  let minX = 0, minY = 0, maxX = window.innerWidth, maxY = window.innerHeight;
  if (strokes.length > 0) {
    const allPts = strokes.flatMap(s => s.points);
    if (allPts.length > 0) {
      minX = Math.min(...allPts.map(p => p.x)) - 24;
      minY = Math.min(...allPts.map(p => p.y)) - 24;
      maxX = Math.max(...allPts.map(p => p.x)) + 24;
      maxY = Math.max(...allPts.map(p => p.y)) + 24;
    }
  }
  const width = Math.max(400, maxX - minX);
  const height = Math.max(300, maxY - minY);
  const pathElements = strokes.filter(s => s.tool !== 'eraser').map(s => {
    const strokeColor = s.tool === 'highlighter' ? s.color + '66' : s.color;
    const strokeWidth = s.tool === 'highlighter' ? HIGHLIGHTER_SIZE : (s.size || PEN_SIZE);
    if (s.points.length === 1) {
      return '<circle cx="' + s.points[0].x + '" cy="' + s.points[0].y + '" r="' + (strokeWidth / 2) + '" fill="' + strokeColor + '" />';
    }
    let d = 'M ' + s.points[0].x + ' ' + s.points[0].y;
    for (let i = 1; i < s.points.length - 1; i++) {
      const mx = (s.points[i].x + s.points[i+1].x) / 2;
      const my = (s.points[i].y + s.points[i+1].y) / 2;
      d += ' Q ' + s.points[i].x + ' ' + s.points[i].y + ', ' + mx + ' ' + my;
    }
    d += ' L ' + s.points[s.points.length-1].x + ' ' + s.points[s.points.length-1].y;
    return '<path d="' + d + '" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" fill="none" stroke-linecap="round" stroke-linejoin="round" />';
  }).join('\\n');

  const metaData = encodeURIComponent(JSON.stringify({ strokes, scale, panX, panY }));
  const svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${minX} \${minY} \${width} \${height}" width="100%" height="100%" style="background:#18181b;">
  <metadata data-state="\${metaData}"></metadata>
  \${pathElements}
</svg>\`;

  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: docName, svg })
    });
    if (res.ok) {
      document.getElementById('status').innerText = 'Saved ✓ ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      loadFilesList();
    }
  } catch(e) { document.getElementById('status').innerText = 'Save Error'; }
}
document.getElementById('saveBtn').onclick = triggerAutoSave;

async function loadFilesList() {
  try {
    const res = await fetch('/api/list');
    const files = await res.json();
    const sel = document.getElementById('fileList');
    const cur = sel.value;
    sel.innerHTML = '<option value="">-- Load --</option>';
    files.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f; opt.innerText = f;
      sel.appendChild(opt);
    });
    sel.value = cur;
  } catch(e) {}
}

async function loadDrawingFile(fileName) {
  if (!fileName) return;
  document.getElementById('status').innerText = 'Loading...';
  try {
    const res = await fetch('/api/load?name=' + encodeURIComponent(fileName));
    const text = await res.text();
    const match = text.match(/data-state="([^"]+)"/);
    if (match && match[1]) {
      const state = JSON.parse(decodeURIComponent(match[1]));
      strokes = state.strokes || [];
      scale = state.scale || 1;
      panX = state.panX || 0;
      panY = state.panY || 0;
      document.getElementById('docName').value = fileName.replace(/\\.svg$/, '');
      render();
      document.getElementById('status').innerText = 'Loaded ' + fileName;
    }
  } catch(err) { alert('Could not load drawing.'); }
}
document.getElementById('fileList').onchange = (e) => loadDrawingFile(e.target.value);

// --- Live Real-Time Sync From Obsidian ---
const sse = new EventSource('/api/events');
sse.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data);
    if (data.type === 'switch' && data.name) {
      loadDrawingFile(data.name);
      loadFilesList();
    }
  } catch(err) {}
};

// --- Modal Handlers ---
const modalOverlay = document.getElementById('modalOverlay');
const modalInput = document.getElementById('modalInput');
bindBtn(document.getElementById('newBtn'), () => {
  modalInput.value = 'drawing-' + Date.now().toString().slice(-4);
  modalOverlay.style.display = 'flex';
  modalInput.focus();
});
bindBtn(document.getElementById('modalCancel'), () => { modalOverlay.style.display = 'none'; });
bindBtn(document.getElementById('modalConfirm'), () => {
  const name = modalInput.value.trim() || 'scratchpad';
  document.getElementById('docName').value = name;
  modalOverlay.style.display = 'none';
  strokes = []; scale = 1; panX = 0; panY = 0;
  render(); triggerAutoSave();
});

resize();
loadFilesList();
</script>
</body>
</html>`;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class AirSketchSettingTab extends PluginSettingTab {
    plugin: AirSketchPlugin;

    constructor(app: App, plugin: AirSketchPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '✈️ AirSketch Settings' });

        const ipadUrl = `http://${os.hostname()}:${this.plugin.settings.port}`;

        // Status Card
        const statusBox = containerEl.createDiv({
            attr: { style: 'background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 14px; margin-bottom: 20px;' }
        });
        statusBox.createEl('div', { text: 'iPad AirSketch URL:', attr: { style: 'font-weight: bold; font-size: 13px; margin-bottom: 4px;' } });
        
        const urlRow = statusBox.createDiv({ attr: { style: 'display: flex; gap: 8px; align-items: center;' } });
        urlRow.createEl('code', { text: ipadUrl, attr: { style: 'font-size: 13px; padding: 4px 8px; background: var(--background-primary); border-radius: 4px;' } });
        
        const copyBtn = urlRow.createEl('button', { text: '📋 Copy URL', attr: { style: 'cursor: pointer;' } });
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(ipadUrl);
            new Notice('✓ Copied iPad URL to clipboard!');
        });

        // Folder Path Setting
        new Setting(containerEl)
            .setName('Drawings Vault Folder')
            .setDesc('Vault-relative path where drawing files will be stored')
            .addText(text => text
                .setPlaceholder('Private/Drawings')
                .setValue(this.plugin.settings.drawingsFolder)
                .onChange(async (val) => {
                    this.plugin.settings.drawingsFolder = val.trim() || 'Private/Drawings';
                    await this.plugin.saveSettings();
                })
            );

        // Port Setting
        new Setting(containerEl)
            .setName('Server Port')
            .setDesc('Local Wi-Fi port for iPad connections')
            .addText(text => text
                .setPlaceholder('4444')
                .setValue(String(this.plugin.settings.port))
                .onChange(async (val) => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num > 1024 && num < 65535) {
                        this.plugin.settings.port = num;
                        await this.plugin.saveSettings();
                    }
                })
            );
    }
}