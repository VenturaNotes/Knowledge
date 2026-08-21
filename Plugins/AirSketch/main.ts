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
import * as crypto from 'crypto';

interface AirSketchSettings {
    port: number;
    drawingsFolder: string;
    isPrivate: boolean;
    authToken: string;
}

const DEFAULT_SETTINGS: AirSketchSettings = {
    port: 4444,
    drawingsFolder: 'Private/Drawings',
    isPrivate: true,
    authToken: ''
};

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
    private sseClients: { res: http.ServerResponse, clientId: string }[] = [];

    async onload() {
        await this.loadSettings();

        if (!this.settings.authToken) {
            this.settings.authToken = crypto.randomBytes(16).toString('hex');
            await this.saveSettings();
        }

        this.addSettingTab(new AirSketchSettingTab(this.app, this));
        await this.startServer();

        this.addCommand({
            id: 'create-embed-airsketch',
            name: 'Create and Embed New Drawing at Cursor',
            callback: () => this.handleCreateAndEmbed()
        });

        this.addCommand({
            id: 'copy-ipad-url',
            name: 'Copy iPad AirSketch URL to Clipboard',
            callback: () => {
                const tokenQuery = this.settings.isPrivate ? `?token=${this.settings.authToken}` : '';
                const url = `http://${os.hostname()}:${this.settings.port}${tokenQuery}`;
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

            if (!(await this.app.vault.adapter.exists(folderPath))) {
                await this.app.vault.adapter.mkdir(folderPath);
            }

            if (!(await this.app.vault.adapter.exists(filePath))) {
                const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background:#18181b;">
  <metadata data-state="%7B%22items%22%3A%5B%5D%2C%22scale%22%3A1%2C%22panX%22%3A0%2C%22panY%22%3A0%7D"></metadata>
</svg>`;
                await this.app.vault.adapter.write(filePath, emptySvg);
            }

            view.editor.replaceSelection(`\n![[${filePath}]]\n`);
            this.broadcastToClients({ type: 'switch', name: fileName });
            new Notice(`✈️ Embedded & Pushed [[${fileName}]] to iPad`);
        }).open();
    }

    private broadcastToClients(data: any, excludeClientId?: string) {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        this.sseClients = this.sseClients.filter(client => {
            if (excludeClientId && client.clientId === excludeClientId) return true;
            try {
                client.res.write(payload);
                return true;
            } catch {
                return false;
            }
        });
    }

    async startServer() {
        this.stopServer();

        const folderPath = this.getVaultDrawingsPath();
        if (!(await this.app.vault.adapter.exists(folderPath))) {
            await this.app.vault.adapter.mkdir(folderPath);
        }

        const HTML_CLIENT = this.getHtmlClient();

        this.server = http.createServer(async (req, res) => {
            const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

            // Parse Cookies
            const cookies: Record<string, string> = {};
            (req.headers.cookie || '').split(';').forEach(c => {
                const [k, ...v] = c.trim().split('=');
                if (k && v.length > 0) cookies[k] = decodeURIComponent(v.join('='));
            });

            // 1. Initial Pairing: If visiting root with ?token=..., authenticate, set cookie, and redirect to clean URL
            if ((url.pathname === '/' || url.pathname === '/index.html') && url.searchParams.has('token')) {
                const queryToken = url.searchParams.get('token');
                if (this.settings.isPrivate && queryToken === this.settings.authToken) {
                    res.writeHead(302, {
                        'Set-Cookie': `airsketch_token=${this.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`,
                        'Location': '/'
                    });
                    res.end();
                    return;
                }
            }

            // 2. Authentication Guard for Private Mode
            if (this.settings.isPrivate) {
                const queryToken = url.searchParams.get('token');
                const headerToken = req.headers['x-airsketch-token'] as string | undefined;
                const cookieToken = cookies['airsketch_token'];
                const clientToken = queryToken || headerToken || cookieToken;

                if (clientToken !== this.settings.authToken) {
                    res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>401 Unauthorized</h1><p>AirSketch Private Server Mode is active. A valid token is required.</p>');
                    return;
                }
            }

            // 3. Serve Routes
            if (url.pathname === '/' || url.pathname === '/index.html') {
                if (this.settings.isPrivate) {
                    res.setHeader('Set-Cookie', `airsketch_token=${this.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`);
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(HTML_CLIENT);
            } else if (url.pathname === '/api/events') {
                // Refresh rolling cookie on wake-up / SSE reconnect
                if (this.settings.isPrivate) {
                    res.setHeader('Set-Cookie', `airsketch_token=${this.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`);
                }

                const clientId = url.searchParams.get('client') || Math.random().toString(36).slice(2);
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write('\n');
                const clientEntry = { res, clientId };
                this.sseClients.push(clientEntry);
                req.on('close', () => {
                    this.sseClients = this.sseClients.filter(c => c !== clientEntry);
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
                        const { name, svg, state, senderId } = JSON.parse(body);
                        const cleanName = (name || 'scratchpad').replace(/[^a-zA-Z0-9_-]/g, '_');
                        const fileName = cleanName.endsWith('.svg') ? cleanName : `${cleanName}.svg`;
                        const filePath = `${folderPath}/${fileName}`;

                        await this.app.vault.adapter.write(filePath, svg);

                        this.broadcastToClients({ 
                            type: 'doc-updated', 
                            name: fileName, 
                            state, 
                            senderId 
                        }, senderId);

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
            console.log(`[AirSketch] Server running on port ${this.settings.port} (Private: ${this.settings.isPrivate})`);
        });
    }

    private stopServer() {
        if (this.server) {
            try { this.server.close(); } catch {}
            this.server = null;
        }
        this.sseClients.forEach(c => {
            try { c.res.end(); } catch {}
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
    font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; touch-action: manipulation;
  }
  .btn:active, .btn.active { background: #8b5cf6; border-color: #a78bfa; }
  .btn.primary { background: #22c55e; border-color: #4ade80; }
  .btn.icon-only { padding: 6px 10px; }
  .btn svg { width: 15px; height: 15px; display: block; }
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
  #inlineTextEditor {
    display: none; position: absolute; background: rgba(30, 30, 35, 0.95); border: 1.5px solid #8b5cf6;
    border-radius: 6px; outline: none; color: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 6px 10px; font-size: 18px; z-index: 1500; min-width: 140px; box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    user-select: text; -webkit-user-select: text;
  }
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
  <button class="btn" id="eraserBtn">Eraser</button>
  <button class="btn" id="selectBtn">Select</button>
  <button class="btn" id="textBtn">Text (T)</button>
  
  <button class="btn icon-only" id="undoBtn" title="Undo (Cmd+Z)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 7v6h6"/>
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
    </svg>
  </button>

  <button class="btn icon-only" id="redoBtn" title="Redo (Cmd+Shift+Z)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 7v6h-6"/>
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
    </svg>
  </button>
  
  <div class="spacer"></div>
  <span id="status">Ready</span>
  <button class="btn primary" id="saveBtn">Save</button>
</div>

<canvas id="canvas"></canvas>
<input type="text" id="inlineTextEditor" placeholder="Type text...">

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
const CLIENT_ID = Math.random().toString(36).slice(2);

function authFetch(url, options = {}) {
  return fetch(url, options);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inlineEditor = document.getElementById('inlineTextEditor');

let items = [];
let selectedItems = new Set();
let currentStroke = null;
let currentTool = 'pen';
let currentColor = '#ffffff';

let scale = 1, panX = 0, panY = 0;
let isInteracting = false;
let isPanning = false;

let isMarquee = false;
let marqueeStart = null, marqueeEnd = null;
let dragStartPos = null;

const undoStack = [];
const redoStack = [];

function cloneState(arr) {
  return arr.map(it => {
    if (it.type === 'stroke') return { ...it, points: it.points.map(p => ({ ...p })) };
    return { ...it };
  });
}

function pushHistory() {
  undoStack.push(cloneState(items));
  if (undoStack.length > 50) undoStack.shift();
  redoStack.length = 0;
}

let activeDrawingTouchId = null;
let prevPinchDist = null, prevPinchMid = null;
let autoSaveTimer = null;
let activeTextTarget = null;

const PEN_SIZE = 2.4;
const ERASER_RADIUS = 16;

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

function distToSegment(p, v, w) {
  const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

function getItemBounds(item) {
  if (item.type === 'stroke') {
    const xs = item.points.map(p => p.x), ys = item.points.map(p => p.y);
    return { minX: Math.min(...xs)-4, minY: Math.min(...ys)-4, maxX: Math.max(...xs)+4, maxY: Math.max(...ys)+4 };
  } else if (item.type === 'text') {
    ctx.font = (item.fontSize || 18) + 'px -apple-system, sans-serif';
    const w = ctx.measureText(item.text).width;
    return { minX: item.x - 4, minY: item.y - (item.fontSize || 18) - 2, maxX: item.x + w + 4, maxY: item.y + 4 };
  } else if (item.type === 'image') {
    return { minX: item.x - 4, minY: item.y - 4, maxX: item.x + item.width + 4, maxY: item.y + item.height + 4 };
  }
  return null;
}

function getSelectedTotalBounds() {
  if (selectedItems.size === 0) return null;
  let sMinX = Infinity, sMinY = Infinity, sMaxX = -Infinity, sMaxY = -Infinity;
  selectedItems.forEach(it => {
    const b = getItemBounds(it);
    if (b) {
      sMinX = Math.min(sMinX, b.minX); sMinY = Math.min(sMinY, b.minY);
      sMaxX = Math.max(sMaxX, b.maxX); sMaxY = Math.max(sMaxY, b.maxY);
    }
  });
  if (sMinX === Infinity) return null;
  return { minX: sMinX, minY: sMinY, maxX: sMaxX, maxY: sMaxY };
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

  items.forEach(item => {
    if (item.type === 'stroke') {
      if (item.points.length < 1) return;
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.size || PEN_SIZE;

      if (item.points.length === 1) {
        ctx.arc(item.points[0].x, item.points[0].y, (item.size || PEN_SIZE) / 2, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
      } else if (item.points.length === 2) {
        ctx.moveTo(item.points[0].x, item.points[0].y);
        ctx.lineTo(item.points[1].x, item.points[1].y);
        ctx.stroke();
      } else {
        ctx.moveTo(item.points[0].x, item.points[0].y);
        for (let i = 1; i < item.points.length - 1; i++) {
          const midX = (item.points[i].x + item.points[i + 1].x) / 2;
          const midY = (item.points[i].y + item.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(item.points[i].x, item.points[i].y, midX, midY);
        }
        ctx.lineTo(item.points[item.points.length - 1].x, item.points[item.points.length - 1].y);
        ctx.stroke();
      }
    } else if (item.type === 'text') {
      ctx.fillStyle = item.color || '#fff';
      ctx.font = (item.fontSize || 18) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(item.text, item.x, item.y);
    } else if (item.type === 'image') {
      if (item.imgObj && item.imgObj.complete) {
        ctx.drawImage(item.imgObj, item.x, item.y, item.width, item.height);
      }
    }
  });

  const sBounds = getSelectedTotalBounds();
  if (sBounds) {
    const pad = 6;
    const x = sBounds.minX - pad, y = sBounds.minY - pad;
    const w = (sBounds.maxX - sBounds.minX) + pad * 2, h = (sBounds.maxY - sBounds.minY) + pad * 2;

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2 / scale;
    ctx.setLineDash([6 / scale, 4 / scale]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);

    const handleRadius = 4 / scale;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2 / scale;
    const corners = [{x, y}, {x: x + w, y}, {x, y: y + h}, {x: x + w, y: y + h}];
    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, handleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  if (isMarquee && marqueeStart && marqueeEnd) {
    const x = Math.min(marqueeStart.x, marqueeEnd.x);
    const y = Math.min(marqueeStart.y, marqueeEnd.y);
    const w = Math.abs(marqueeStart.x - marqueeEnd.x);
    const h = Math.abs(marqueeStart.y - marqueeEnd.y);

    ctx.fillStyle = 'rgba(167, 139, 250, 0.18)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5 / scale;
    ctx.setLineDash([5 / scale, 5 / scale]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
  }

  ctx.restore();
}

function eraseAt(cPt) {
  let changed = false;
  items = items.filter(item => {
    if (item.type === 'stroke') {
      for (let i = 0; i < item.points.length - 1; i++) {
        if (distToSegment(cPt, item.points[i], item.points[i+1]) <= ERASER_RADIUS + (item.size || PEN_SIZE)) {
          changed = true;
          return false;
        }
      }
      if (item.points.length === 1 && Math.hypot(cPt.x - item.points[0].x, cPt.y - item.points[0].y) <= ERASER_RADIUS + 4) {
        changed = true;
        return false;
      }
    } else if (item.type === 'text') {
      if (Math.hypot(cPt.x - item.x, cPt.y - item.y) <= ERASER_RADIUS + 12) {
        changed = true;
        return false;
      }
    } else if (item.type === 'image') {
      if (cPt.x >= item.x && cPt.x <= item.x + item.width && cPt.y >= item.y && cPt.y <= item.y + item.height) {
        changed = true;
        return false;
      }
    }
    return true;
  });

  if (changed) {
    render();
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(triggerAutoSave, 1000);
  }
}

function getItemAt(cPt) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (item.type === 'stroke') {
      for (let j = 0; j < item.points.length - 1; j++) {
        if (distToSegment(cPt, item.points[j], item.points[j+1]) <= 12) return item;
      }
    } else if (item.type === 'text') {
      if (Math.hypot(cPt.x - item.x, cPt.y - item.y) <= 24) return item;
    } else if (item.type === 'image') {
      if (cPt.x >= item.x && cPt.x <= item.x + item.width && cPt.y >= item.y && cPt.y <= item.y + item.height) return item;
    }
  }
  return null;
}

function selectItemsInBox(p1, p2) {
  const minX = Math.min(p1.x, p2.x), minY = Math.min(p1.y, p2.y);
  const maxX = Math.max(p1.x, p2.x), maxY = Math.max(p1.y, p2.y);

  selectedItems.clear();
  items.forEach(it => {
    const b = getItemBounds(it);
    if (b && b.minX < maxX && b.maxX > minX && b.minY < maxY && b.maxY > minY) {
      selectedItems.add(it);
    }
  });
  render();
}

function openInlineTextEditor(screenX, screenY, cPt, existingItem) {
  activeTextTarget = existingItem || { type: 'text', x: cPt.x, y: cPt.y, text: '', color: currentColor, fontSize: 18 };
  
  inlineEditor.style.left = screenX + 'px';
  inlineEditor.style.top = screenY + 'px';
  inlineEditor.style.display = 'block';
  inlineEditor.style.color = activeTextTarget.color || currentColor;
  inlineEditor.value = activeTextTarget.text || '';
  
  setTimeout(() => {
    inlineEditor.focus();
    inlineEditor.select();
  }, 50);
}

function commitInlineText() {
  if (inlineEditor.style.display === 'none') return;
  const val = inlineEditor.value.trim();
  inlineEditor.style.display = 'none';

  if (val && activeTextTarget) {
    pushHistory();
    activeTextTarget.text = val;
    if (!items.includes(activeTextTarget)) {
      items.push(activeTextTarget);
    }
    render();
    triggerAutoSave();
  }
  activeTextTarget = null;
}

inlineEditor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') commitInlineText();
  else if (e.key === 'Escape') { inlineEditor.style.display = 'none'; activeTextTarget = null; }
});
inlineEditor.addEventListener('blur', commitInlineText);

function handleStart(clientX, clientY) {
  if (inlineEditor.style.display === 'block') {
    commitInlineText();
  }

  const cPt = toCanvasCoord(clientX, clientY);

  if (currentTool === 'pen') {
    pushHistory();
    isInteracting = true;
    currentStroke = { type: 'stroke', color: currentColor, size: PEN_SIZE, points: [cPt] };
    items.push(currentStroke);
    render();
  } else if (currentTool === 'eraser') {
    pushHistory();
    isInteracting = true;
    eraseAt(cPt);
  } else if (currentTool === 'select') {
    isInteracting = true;
    dragStartPos = cPt;

    const sBounds = getSelectedTotalBounds();
    const pad = 10;
    const isInsideSelectionBounds = sBounds && 
      (cPt.x >= sBounds.minX - pad && cPt.x <= sBounds.maxX + pad && cPt.y >= sBounds.minY - pad && cPt.y <= sBounds.maxY + pad);

    if (isInsideSelectionBounds) {
      pushHistory();
      isMarquee = false;
    } else {
      const clicked = getItemAt(cPt);
      if (clicked) {
        pushHistory();
        selectedItems.clear();
        selectedItems.add(clicked);
        isMarquee = false;
      } else {
        selectedItems.clear();
        isMarquee = true;
        marqueeStart = cPt;
        marqueeEnd = cPt;
      }
    }
    render();
  } else if (currentTool === 'text') {
    openInlineTextEditor(clientX, clientY, cPt, null);
  }
}

function handleMove(clientX, clientY) {
  const cPt = toCanvasCoord(clientX, clientY);
  if (isInteracting) {
    if (currentTool === 'pen' && currentStroke) {
      currentStroke.points.push(cPt);
      render();
    } else if (currentTool === 'eraser') {
      eraseAt(cPt);
    } else if (currentTool === 'select') {
      if (isMarquee && marqueeStart) {
        marqueeEnd = cPt;
        selectItemsInBox(marqueeStart, marqueeEnd);
      } else if (dragStartPos && selectedItems.size > 0) {
        const dx = cPt.x - dragStartPos.x;
        const dy = cPt.y - dragStartPos.y;
        selectedItems.forEach(it => {
          if (it.type === 'stroke') it.points.forEach(p => { p.x += dx; p.y += dy; });
          else { it.x += dx; it.y += dy; }
        });
        dragStartPos = cPt;
        render();
      }
    }
  }
}

function handleEnd() {
  if (isInteracting) {
    isInteracting = false;
    currentStroke = null;
    dragStartPos = null;
    isMarquee = false;
    marqueeStart = null;
    marqueeEnd = null;
    render();
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(triggerAutoSave, 1000);
  }
}

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touches = Array.from(e.touches);
  const stylusTouch = touches.find(t => t.touchType === 'stylus');

  if (stylusTouch) {
    activeDrawingTouchId = stylusTouch.identifier;
    isPanning = false;
    handleStart(stylusTouch.clientX, stylusTouch.clientY);
    return;
  }

  if (touches.length === 2 && activeDrawingTouchId === null) {
    if (currentStroke && currentStroke.points.length <= 2) {
      items.pop();
      currentStroke = null;
    }
    isInteracting = false;
    isPanning = true;
    prevPinchDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    prevPinchMid = { x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 };
    return;
  }

  if (touches.length === 1 && activeDrawingTouchId === null) {
    const t = touches[0];
    const isPalm = (t.radiusX && t.radiusX > 16) || (t.radiusY && t.radiusY > 16);
    if (isPalm) return;

    activeDrawingTouchId = t.identifier;
    isPanning = false;
    handleStart(t.clientX, t.clientY);
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();

  if (activeDrawingTouchId !== null) {
    const drawTouch = Array.from(e.touches).find(t => t.identifier === activeDrawingTouchId);
    if (drawTouch) {
      handleMove(drawTouch.clientX, drawTouch.clientY);
      return;
    }
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
  e.preventDefault();
  const ended = Array.from(e.changedTouches).find(t => t.identifier === activeDrawingTouchId);
  if (ended) {
    activeDrawingTouchId = null;
    handleEnd();
  }
  if (e.touches.length < 2) {
    isPanning = false;
    prevPinchDist = null;
    prevPinchMid = null;
  }
}
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0) handleStart(e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
window.addEventListener('mouseup', () => handleEnd());

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) {
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.min(Math.max(0.2, scale * zoomFactor), 5.0);
    const mousePt = { x: e.clientX, y: e.clientY };
    const canvasX = (mousePt.x - panX) / scale;
    const canvasY = (mousePt.y - panY) / scale;
    scale = newScale;
    panX = mousePt.x - canvasX * scale;
    panY = mousePt.y - canvasY * scale;
  } else {
    panX -= e.deltaX;
    panY -= e.deltaY;
  }
  render();
}, { passive: false });

window.addEventListener('paste', async (e) => {
  const clipboardItems = e.clipboardData?.items;
  if (!clipboardItems) return;
  const centerPt = toCanvasCoord(window.innerWidth / 2, window.innerHeight / 2);

  for (const it of clipboardItems) {
    if (it.type.includes('image')) {
      const file = it.getAsFile();
      if (!file) continue;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          pushHistory();
          const maxDim = 400;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = (h / w) * maxDim; w = maxDim; }
            else { w = (w / h) * maxDim; h = maxDim; }
          }
          items.push({ type: 'image', x: centerPt.x - w/2, y: centerPt.y - h/2, width: w, height: h, dataUrl, imgObj: img });
          render();
          triggerAutoSave();
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    } else if (it.type === 'text/plain') {
      it.getAsString((text) => {
        if (text) {
          pushHistory();
          items.push({ type: 'text', text, x: centerPt.x, y: centerPt.y, color: currentColor, fontSize: 18 });
          render();
          triggerAutoSave();
        }
      });
    }
  }
});

function bindBtn(btnEl, callback) {
  const handler = (e) => {
    e.preventDefault(); e.stopPropagation();
    callback();
    isInteracting = false; isPanning = false; currentStroke = null;
  };
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
  document.querySelectorAll('.top-bar .btn').forEach(b => b.classList.remove('active'));
  document.getElementById('penBtn').classList.add('active');
});

bindBtn(document.getElementById('eraserBtn'), () => {
  currentTool = 'eraser';
  document.querySelectorAll('.top-bar .btn').forEach(b => b.classList.remove('active'));
  document.getElementById('eraserBtn').classList.add('active');
});

bindBtn(document.getElementById('selectBtn'), () => {
  currentTool = 'select';
  document.querySelectorAll('.top-bar .btn').forEach(b => b.classList.remove('active'));
  document.getElementById('selectBtn').classList.add('active');
});

bindBtn(document.getElementById('textBtn'), () => {
  currentTool = 'text';
  document.querySelectorAll('.top-bar .btn').forEach(b => b.classList.remove('active'));
  document.getElementById('textBtn').classList.add('active');
});

function doUndo() {
  if (undoStack.length > 0) {
    redoStack.push(cloneState(items));
    items = undoStack.pop();
    selectedItems.clear();
    render();
    triggerAutoSave();
  }
}

function doRedo() {
  if (redoStack.length > 0) {
    undoStack.push(cloneState(items));
    items = redoStack.pop();
    selectedItems.clear();
    render();
    triggerAutoSave();
  }
}

bindBtn(document.getElementById('undoBtn'), doUndo);
bindBtn(document.getElementById('redoBtn'), doRedo);

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'p' || e.key === 'P') document.getElementById('penBtn').click();
  if (e.key === 'e' || e.key === 'E') document.getElementById('eraserBtn').click();
  if (e.key === 's' || e.key === 'S' || e.key === 'v' || e.key === 'V') document.getElementById('selectBtn').click();
  if (e.key === 't' || e.key === 'T') document.getElementById('textBtn').click();
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) { doRedo(); }
  else if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) { doUndo(); }
  else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || e.key === 'Y')) { doRedo(); }
});

async function triggerAutoSave() {
  const docName = document.getElementById('docName').value.trim() || 'scratchpad';
  document.getElementById('status').innerText = 'Saving...';

  let minX = 0, minY = 0, maxX = window.innerWidth, maxY = window.innerHeight;
  if (items.length > 0) {
    const allPts = items.flatMap(it => {
      if (it.type === 'stroke') return it.points;
      if (it.type === 'image') return [{x: it.x, y: it.y}, {x: it.x + it.width, y: it.y + it.height}];
      if (it.type === 'text') return [{x: it.x, y: it.y - 20}, {x: it.x + 100, y: it.y}];
      return [];
    });
    if (allPts.length > 0) {
      minX = Math.min(...allPts.map(p => p.x)) - 24;
      minY = Math.min(...allPts.map(p => p.y)) - 24;
      maxX = Math.max(...allPts.map(p => p.x)) + 24;
      maxY = Math.max(...allPts.map(p => p.y)) + 24;
    }
  }
  const width = Math.max(400, maxX - minX);
  const height = Math.max(300, maxY - minY);

  const serializedItems = items.map(it => {
    if (it.type === 'image') {
      const { imgObj, ...rest } = it;
      return rest;
    }
    return it;
  });

  const svgElements = items.map(it => {
    if (it.type === 'stroke') {
      if (it.points.length === 1) {
        return '<circle cx="' + it.points[0].x + '" cy="' + it.points[0].y + '" r="' + ((it.size || PEN_SIZE) / 2) + '" fill="' + it.color + '" />';
      }
      let d = 'M ' + it.points[0].x + ' ' + it.points[0].y;
      for (let i = 1; i < it.points.length - 1; i++) {
        const mx = (it.points[i].x + it.points[i+1].x) / 2;
        const my = (it.points[i].y + it.points[i+1].y) / 2;
        d += ' Q ' + it.points[i].x + ' ' + it.points[i].y + ', ' + mx + ' ' + my;
      }
      d += ' L ' + it.points[it.points.length-1].x + ' ' + it.points[it.points.length-1].y;
      return '<path d="' + d + '" stroke="' + it.color + '" stroke-width="' + (it.size || PEN_SIZE) + '" fill="none" stroke-linecap="round" stroke-linejoin="round" />';
    } else if (it.type === 'text') {
      return '<text x="' + it.x + '" y="' + it.y + '" fill="' + it.color + '" font-size="' + (it.fontSize || 18) + '" font-family="sans-serif">' + it.text + '</text>';
    } else if (it.type === 'image') {
      return '<image href="' + it.dataUrl + '" x="' + it.x + '" y="' + it.y + '" width="' + it.width + '" height="' + it.height + '" />';
    }
    return '';
  }).join('\\n');

  const stateObj = { items: serializedItems, scale, panX, panY };
  const metaData = encodeURIComponent(JSON.stringify(stateObj));
  const svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${minX} \${minY} \${width} \${height}" width="100%" height="100%" style="background:#18181b;">
  <metadata data-state="\${metaData}"></metadata>
  \${svgElements}
</svg>\`;

  try {
    const res = await authFetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: docName, svg, state: stateObj, senderId: CLIENT_ID })
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
    const res = await authFetch('/api/list');
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
    const res = await authFetch('/api/load?name=' + encodeURIComponent(fileName));
    const text = await res.text();
    const match = text.match(/data-state="([^"]+)"/);
    if (match && match[1]) {
      const state = JSON.parse(decodeURIComponent(match[1]));
      items = (state.items || []).map(it => {
        if (it.type === 'image' && it.dataUrl) {
          const img = new Image();
          img.src = it.dataUrl;
          return { ...it, imgObj: img };
        }
        return it;
      });
      selectedItems.clear();
      undoStack.length = 0;
      redoStack.length = 0;
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

const sseUrl = '/api/events?client=' + CLIENT_ID;
const sse = new EventSource(sseUrl);
sse.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data);
    const curDoc = (document.getElementById('docName').value.trim() || 'scratchpad') + '.svg';
    
    if (data.type === 'switch' && data.name) {
      loadDrawingFile(data.name);
      loadFilesList();
    } else if (data.type === 'doc-updated' && data.name === curDoc && data.senderId !== CLIENT_ID) {
      if (!isInteracting) {
        items = (data.state.items || []).map(it => {
          if (it.type === 'image' && it.dataUrl) {
            const img = new Image();
            img.src = it.dataUrl;
            return { ...it, imgObj: img };
          }
          return it;
        });
        render();
        document.getElementById('status').innerText = 'Synced ↻ ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      }
    }
  } catch(err) {}
};

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
  pushHistory();
  items = []; selectedItems.clear(); scale = 1; panX = 0; panY = 0;
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

        const tokenQuery = this.plugin.settings.isPrivate ? `?token=${this.plugin.settings.authToken}` : '';
        const ipadUrl = `http://${os.hostname()}:${this.plugin.settings.port}${tokenQuery}`;

        const statusBox = containerEl.createDiv({
            attr: { style: 'background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 14px; margin-bottom: 20px;' }
        });
        statusBox.createEl('div', { 
            text: this.plugin.settings.isPrivate ? '🔒 Private AirSketch URL (One-Time Pairing Link):' : '🌐 Public AirSketch URL:', 
            attr: { style: 'font-weight: bold; font-size: 13px; margin-bottom: 6px;' } 
        });
        
        const urlRow = statusBox.createDiv({ attr: { style: 'display: flex; gap: 8px; align-items: center;' } });
        urlRow.createEl('code', { text: ipadUrl, attr: { style: 'font-size: 12px; padding: 4px 8px; background: var(--background-primary); border-radius: 4px; overflow-x: auto;' } });
        
        const copyBtn = urlRow.createEl('button', { text: '📋 Copy URL', attr: { style: 'cursor: pointer; flex-shrink: 0;' } });
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(ipadUrl);
            new Notice('✓ Copied AirSketch URL to clipboard!');
        });

        new Setting(containerEl)
            .setName('Private Access Mode')
            .setDesc('When enabled, only devices paired with your secret token can connect. Unauthorized network requests are blocked.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.isPrivate)
                .onChange(async (value) => {
                    this.plugin.settings.isPrivate = value;
                    await this.plugin.saveSettings();
                    await this.plugin.startServer();
                    this.display();
                })
            );

        if (this.plugin.settings.isPrivate) {
            new Setting(containerEl)
                .setName('Regenerate Security Token')
                .setDesc('Invalidates the current key. You will need to open the new link once on your iPad.')
                .addButton(btn => btn
                    .setButtonText('Regenerate Key')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings.authToken = crypto.randomBytes(16).toString('hex');
                        await this.plugin.saveSettings();
                        await this.plugin.startServer();
                        new Notice('✓ Generated new security token. Open the updated URL once on your iPad.');
                        this.display();
                    })
                );
        }

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
                        await this.plugin.startServer();
                    }
                })
            );
    }
}