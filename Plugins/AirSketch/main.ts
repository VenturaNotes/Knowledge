import { 
    App, 
    Plugin, 
    PluginSettingTab, 
    Setting, 
    MarkdownView, 
    Notice,
    TFile
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

interface ActiveDrawingState {
    svgFile: string;
    markdownNote: string;
}

const DEFAULT_SETTINGS: AirSketchSettings = {
    port: 4444,
    drawingsFolder: 'Private/Drawings',
    isPrivate: true,
    authToken: ''
};

export default class AirSketchPlugin extends Plugin {
    settings: AirSketchSettings = DEFAULT_SETTINGS;
    private server: http.Server | null = null;
    private sseClients: { res: http.ServerResponse, clientId: string }[] = [];
    private activeDoc: ActiveDrawingState | null = null;

    async onload() {
        await this.loadSettings();

        if (!this.settings.authToken) {
            this.settings.authToken = crypto.randomBytes(16).toString('hex');
            await this.saveSettings();
        }

        this.addSettingTab(new AirSketchSettingTab(this.app, this));
        await this.startServer();

        // 1. Command: Instant Create and Embed
        this.addCommand({
            id: 'create-embed-airsketch',
            name: 'Create and Embed New Drawing at Cursor',
            callback: () => this.handleCreateAndEmbed()
        });

        // 2. Command: Copy URL
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

        // 3. Cmd + Click on SVG Embed to send to iPad
        this.registerDomEvent(document, 'click', (e: MouseEvent) => {
            if (!(e.metaKey || e.ctrlKey)) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            const img = target.closest('img');
            const embed = target.closest('.image-embed');
            const link = target.closest('a.internal-link');

            let rawSrc = '';
            if (img) {
                rawSrc = img.parentElement?.getAttribute('src') || img.getAttribute('src') || img.getAttribute('alt') || '';
            } else if (embed) {
                rawSrc = embed.getAttribute('src') || '';
            } else if (link) {
                rawSrc = link.getAttribute('href') || '';
            }

            if (rawSrc && rawSrc.toLowerCase().includes('.svg')) {
                e.preventDefault();
                e.stopPropagation();

                const cleanSrc = rawSrc.split('?')[0] || '';
                const fileName = path.basename(decodeURIComponent(cleanSrc));
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                const parentNote = view?.file ? view.file.basename : 'Untitled';

                this.setActiveDrawing(fileName, parentNote);
                new Notice(`✈️ Loaded [[${fileName}]] on iPad (${parentNote})`);
            }
        }, true);
    }

    onunload() {
        this.stopServer();
    }

    private getVaultDrawingsPath(): string {
        return this.settings.drawingsFolder.replace(/^\//, '').replace(/\/$/, '');
    }

    private setActiveDrawing(svgFile: string, markdownNote: string) {
        this.activeDoc = { svgFile, markdownNote };
        this.broadcastToClients({
            type: 'switch',
            name: svgFile,
            markdownNote: markdownNote
        });
    }

    private refreshEmbeddedImages(fileName: string) {
        const allDocs = new Set<Document>([document]);
        this.app.workspace.iterateAllLeaves(leaf => {
            if (leaf.view?.containerEl?.ownerDocument) {
                allDocs.add(leaf.view.containerEl.ownerDocument);
            }
        });

        const timestamp = Date.now();
        allDocs.forEach(doc => {
            const images = doc.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src') || '';
                const alt = img.getAttribute('alt') || '';
                const parentSrc = img.parentElement?.getAttribute('src') || '';

                if (src.includes(fileName) || alt.includes(fileName) || parentSrc.includes(fileName)) {
                    const baseSrc = img.src.split('?')[0] || img.src;
                    img.src = `${baseSrc}?t=${timestamp}`;
                }
            });
        });
    }

    private async handleCreateAndEmbed() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
            new Notice('⚠️ Open a Markdown note to embed the drawing at your cursor.');
            return;
        }

        const editor = view.editor;

        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
        const fileName = `drawing-${timestamp}.svg`;
        const folderPath = this.getVaultDrawingsPath();
        const filePath = `${folderPath}/${fileName}`;

        if (!(await this.app.vault.adapter.exists(folderPath))) {
            await this.app.vault.adapter.mkdir(folderPath);
        }

        const emptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background:#18181b;">
  <metadata data-state="%7B%22items%22%3A%5B%5D%2C%22scale%22%3A1%2C%22panX%22%3A0%2C%22panY%22%3A0%7D"></metadata>
</svg>`;
        await this.app.vault.adapter.write(filePath, emptySvg);

        editor.replaceSelection(`![[${filePath}]]`);

        const parentNote = view.file ? view.file.basename : 'Untitled';
        this.setActiveDrawing(fileName, parentNote);
        new Notice(`✈️ Created [[${fileName}]] & Pushed to iPad`);
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

            const cookies: Record<string, string> = {};
            (req.headers.cookie || '').split(';').forEach(c => {
                const [k, ...v] = c.trim().split('=');
                if (k && v.length > 0) cookies[k] = decodeURIComponent(v.join('='));
            });

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

            if (url.pathname === '/' || url.pathname === '/index.html') {
                if (this.settings.isPrivate) {
                    res.setHeader('Set-Cookie', `airsketch_token=${this.settings.authToken}; Max-Age=34560000; Path=/; SameSite=Lax`);
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(HTML_CLIENT);
            } else if (url.pathname === '/api/current') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ activeDoc: this.activeDoc }));
            } else if (url.pathname === '/api/events') {
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

                if (this.activeDoc) {
                    res.write(`data: ${JSON.stringify({ type: 'switch', name: this.activeDoc.svgFile, markdownNote: this.activeDoc.markdownNote })}\n\n`);
                }

                req.on('close', () => {
                    this.sseClients = this.sseClients.filter(c => c !== clientEntry);
                });
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
                        
                        const rawName = (name || 'scratchpad').replace(/\.svg$/i, '');
                        const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
                        const fileName = `${cleanName}.svg`;
                        const filePath = `${folderPath}/${fileName}`;

                        const tFile = this.app.vault.getAbstractFileByPath(filePath);
                        if (tFile instanceof TFile) {
                            await this.app.vault.modify(tFile, svg);
                        } else {
                            await this.app.vault.adapter.write(filePath, svg);
                        }

                        this.refreshEmbeddedImages(fileName);

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
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>AirSketch</title>
<style>
  * { box-sizing: border-box; touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
  body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #18181b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
  #canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: crosshair; touch-action: none; }
  
  .top-bar {
    position: fixed; top: 8px; left: 8px; right: 8px; height: 44px; display: flex; gap: 6px; align-items: center;
    background: rgba(28, 28, 32, 0.94); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    padding: 4px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); z-index: 1000;
  }
  
  #noteBadge {
    display: inline-flex; align-items: center; gap: 6px; background: #202024;
    border: 1px solid rgba(255,255,255,0.15); padding: 5px 10px; border-radius: 7px;
    font-size: 13px; font-weight: 600; color: #e4e4e7; max-width: 170px;
  }
  #parentNoteName {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .btn {
    background: #2c2c30; color: #fff; border: 1px solid rgba(255,255,255,0.12); padding: 6px 11px; border-radius: 7px;
    font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px; touch-action: manipulation;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  .btn:active, .btn.active { background: #8b5cf6 !important; border-color: #a78bfa !important; }
  .btn.icon-only { padding: 6px 9px; }
  .btn svg { width: 15px; height: 15px; display: block; }
  
  .color-picker { display: flex; gap: 5px; margin: 0 3px; }
  .color-dot { width: 22px; height: 22px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; touch-action: manipulation; }
  .color-dot.active { border-color: #fff; transform: scale(1.15); }
  
  /* Shape Tool Dropdown Menu */
  .dropdown-wrapper { position: relative; display: inline-block; }
  #shapeMenu {
    display: none; position: absolute; top: 42px; left: 0; background: rgba(28, 28, 32, 0.98);
    border: 1px solid rgba(167, 139, 250, 0.4); border-radius: 8px; padding: 4px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6); z-index: 1300; min-width: 130px; flex-direction: column; gap: 2px;
  }
  #shapeMenu .shape-item {
    background: transparent; border: none; color: #f4f4f5; padding: 6px 10px; border-radius: 5px;
    font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; text-align: left;
  }
  #shapeMenu .shape-item:hover, #shapeMenu .shape-item.active { background: #8b5cf6; color: #fff; }

  .spacer { flex: 1; }
  #status { font-size: 12px; color: #a1a1aa; margin-right: 4px; }
  
  #waitingOverlay {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: absolute; inset: 0; background: #18181b; z-index: 500; text-align: center; padding: 24px;
  }
  
  /* Multiline In-Place Text Editor */
  #inlineTextEditor {
    display: none; position: absolute; background: rgba(24, 24, 27, 0.9);
    border: 1.5px dashed rgba(167, 139, 250, 0.9); border-radius: 4px;
    outline: none; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 3px 6px; margin: 0; line-height: 1.25; z-index: 1500; min-width: 40px; min-height: 28px;
    white-space: pre-wrap; word-break: break-word; caret-color: #a78bfa; user-select: text !important;
    -webkit-user-select: text !important; touch-action: auto !important; box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    resize: none; overflow: hidden;
  }

  /* Floating Selection & Paste Popups */
  #selectionPopup, #pastePopup {
    display: none; position: fixed; z-index: 1200;
    background: rgba(28, 28, 32, 0.96); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(167, 139, 250, 0.4); border-radius: 8px; padding: 4px 6px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.6); gap: 5px; align-items: center; touch-action: manipulation;
  }
  #selectionPopup .btn, #pastePopup .btn { font-size: 12px; padding: 5px 10px; }
  #selectionPopup .btn.danger { background: #ef4444; border-color: #f87171; color: #fff; }
  #selectionPopup .btn.danger:active { background: #dc2626; }
</style>
</head>
<body>

<div id="waitingOverlay">
  <div style="font-size: 44px; margin-bottom: 12px;">✈️</div>
  <div style="font-size: 19px; font-weight: 600; color: #f4f4f5; margin-bottom: 6px;">Waiting for sketch from Obsidian</div>
  <div style="font-size: 13px; color: #a1a1aa; max-width: 320px; line-height: 1.5;">
    Create an AirSketch or <b>Cmd + Click</b> on any drawing in Obsidian to load it here.
  </div>
</div>

<div class="top-bar">
  <div id="noteBadge">
    <span>📝</span>
    <span id="parentNoteName">No Active Note</span>
  </div>
  
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
  
  <!-- Shape Tool Dropdown -->
  <div class="dropdown-wrapper">
    <button class="btn" id="shapeBtn" title="Shape Tool">
      <span id="shapeIconHolder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="1"/></svg>
      </span>
      <span style="font-size: 10px; margin-left: 2px;">▼</span>
    </button>
    <div id="shapeMenu">
      <button class="shape-item active" data-shape="rect">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="1"/></svg> Rectangle
      </button>
      <button class="shape-item" data-shape="square">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="1"/></svg> Square
      </button>
      <button class="shape-item" data-shape="circle">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg> Circle
      </button>
      <button class="shape-item" data-shape="arrow">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="10 5 19 5 19 14"/></svg> Arrow
      </button>
      <button class="shape-item" data-shape="line">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="20" x2="20" y2="4"/></svg> Line
      </button>
    </div>
  </div>

  <!-- Box Select Tool Button (Mouse Cursor Icon) -->
  <button class="btn icon-only" id="selectBtn" title="Box Select">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
      <path d="M13 13l6 6"/>
    </svg>
  </button>

  <!-- Pan / Hand Tool Button -->
  <button class="btn icon-only" id="handBtn" title="Pan Tool (Hand)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v5"/>
      <path d="M14 10V4a2 2 0 0 0-4 0v6"/>
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8"/>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  </button>

  <button class="btn" id="lassoBtn">Lasso</button>
  <button class="btn" id="textBtn">Text</button>
  
  <!-- Dynamic Live Zoom Button -->
  <button class="btn" id="resetZoomBtn" title="Reset Zoom to 100% (Anchored to View)">
    <span style="font-size: 13px;">⟲</span>
    <span id="zoomPercentText" style="min-width: 36px; text-align: center; display: inline-block;">100%</span>
  </button>

  <!-- Lock / Unlock Pan & Zoom -->
  <button class="btn icon-only" id="lockNavBtn" title="Lock Pan & Zoom">
    <svg id="lockNavSvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path id="lockShackle" d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
  </button>

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
</div>

<canvas id="canvas"></canvas>
<textarea id="inlineTextEditor" placeholder=""></textarea>

<!-- Selection Action Menu -->
<div id="selectionPopup">
  <button class="btn" id="copySelectionBtn">📋 Copy</button>
  <button class="btn danger" id="deleteSelectionBtn">🗑️ Delete</button>
</div>

<!-- Paste Popup -->
<div id="pastePopup">
  <button class="btn" id="doPasteBtn">📋 Paste</button>
</div>

<script>
const CLIENT_ID = Math.random().toString(36).slice(2);
let currentFileName = null;

function authFetch(url, options = {}) {
  return fetch(url, options);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inlineEditor = document.getElementById('inlineTextEditor');
const selectionPopup = document.getElementById('selectionPopup');
const pastePopup = document.getElementById('pastePopup');
const shapeMenu = document.getElementById('shapeMenu');
const waitingOverlay = document.getElementById('waitingOverlay');
const parentNoteEl = document.getElementById('parentNoteName');

let items = [];
let selectedItems = new Set();
let clipboardItems = [];
let currentStroke = null;
let currentShape = null;

let currentTool = 'pen';
let activeShapeType = 'rect';
let currentColor = '#ffffff';

let scale = 1, panX = 0, panY = 0;
let isInteracting = false;
let isPanning = false;
let isNavLocked = false;
let isOpeningTextEditor = false;

let isMarquee = false;
let marqueeStart = null, marqueeEnd = null;

let isLassoing = false;
let lassoPoints = [];

let dragStartPos = null;
let panToolStart = null;
let pasteTargetPos = null;
let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let selectionTapCandidate = null;

const undoStack = [];
const redoStack = [];

const PEN_SIZE = 2.4;
const ERASER_RADIUS = 16;
let autoSaveTimer = null;
let activeTextTarget = null;

/* ====================================================
   MODULAR GEOMETRY & MATH HELPERS
==================================================== */
function distToSegment(p, v, w) {
  const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

function segmentsIntersect(a, b, c, d) {
  function ccw(p1, p2, p3) {
    return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
  }
  return (ccw(a, c, d) !== ccw(b, c, d)) && (ccw(a, b, c) !== ccw(a, b, d));
}

function pointInPolygon(p, vs) {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x, yi = vs[i].y;
    const xj = vs[j].x, yj = vs[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y))
        && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function getArrowGeometry(x1, y1, x2, y2, size) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  if (dist < 2) return null;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = Math.min(Math.max(14, (size || PEN_SIZE) * 4.5), dist * 0.8);
  const lineEndX = x2 - (headLen * 0.6) * Math.cos(angle);
  const lineEndY = y2 - (headLen * 0.6) * Math.sin(angle);
  const p1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
  const p1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
  const p2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
  const p2y = y2 - headLen * Math.sin(angle + Math.PI / 6);
  return { dist, angle, headLen, lineEndX, lineEndY, p1: { x: p1x, y: p1y }, p2: { x: p2x, y: p2y } };
}

function getShapeSegments(shape) {
  const { shapeType, x1, y1, x2, y2 } = shape;
  if (shapeType === 'line') {
    return [{ p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } }];
  }
  if (shapeType === 'arrow') {
    const geom = getArrowGeometry(x1, y1, x2, y2, shape.size || PEN_SIZE);
    if (!geom) return [{ p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } }];
    return [
      { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } },
      { p1: { x: x2, y: y2 }, p2: geom.p1 },
      { p1: { x: x2, y: y2 }, p2: geom.p2 },
      { p1: geom.p1, p2: geom.p2 }
    ];
  }
  if (shapeType === 'rect' || shapeType === 'square') {
    const rx = Math.min(x1, x2), ry = Math.min(y1, y2);
    const rw = Math.abs(x2 - x1), rh = Math.abs(y2 - y1);
    const tl = { x: rx, y: ry }, tr = { x: rx + rw, y: ry };
    const br = { x: rx + rw, y: ry + rh }, bl = { x: rx, y: ry + rh };
    return [
      { p1: tl, p2: tr },
      { p1: tr, p2: br },
      { p1: br, p2: bl },
      { p1: bl, p2: tl }
    ];
  }
  if (shapeType === 'circle') {
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    const rx = Math.max(0.1, Math.abs(x2 - x1) / 2);
    const ry = Math.max(0.1, Math.abs(y2 - y1) / 2);
    const segs = [];
    const steps = 16;
    for (let i = 0; i < steps; i++) {
      const a1 = (i / steps) * Math.PI * 2;
      const a2 = ((i + 1) / steps) * Math.PI * 2;
      segs.push({
        p1: { x: cx + rx * Math.cos(a1), y: cy + ry * Math.sin(a1) },
        p2: { x: cx + rx * Math.cos(a2), y: cy + ry * Math.sin(a2) }
      });
    }
    return segs;
  }
  return [];
}

function isPointNearShape(p, shape, threshold) {
  const segs = getShapeSegments(shape);
  for (const s of segs) {
    if (distToSegment(p, s.p1, s.p2) <= threshold) return true;
  }
  return false;
}

function getItemBounds(item) {
  const pad = (item.size || PEN_SIZE) / 2 + 2;
  if (item.type === 'stroke') {
    if (!item.points || item.points.length === 0) return null;
    const xs = item.points.map(p => p.x), ys = item.points.map(p => p.y);
    return { minX: Math.min(...xs) - pad, minY: Math.min(...ys) - pad, maxX: Math.max(...xs) + pad, maxY: Math.max(...ys) + pad };
  } else if (item.type === 'shape') {
    if (item.shapeType === 'circle') {
      const cx = (item.x1 + item.x2) / 2, cy = (item.y1 + item.y2) / 2;
      const rx = Math.max(0.1, Math.abs(item.x2 - item.x1) / 2);
      const ry = Math.max(0.1, Math.abs(item.y2 - item.y1) / 2);
      return { minX: cx - rx - pad, minY: cy - ry - pad, maxX: cx + rx + pad, maxY: cy + ry + pad };
    }
    if (item.shapeType === 'arrow') {
      const geom = getArrowGeometry(item.x1, item.y1, item.x2, item.y2, item.size || PEN_SIZE);
      if (geom) {
        const xs = [item.x1, item.x2, geom.p1.x, geom.p2.x];
        const ys = [item.y1, item.y2, geom.p1.y, geom.p2.y];
        return { minX: Math.min(...xs) - pad, minY: Math.min(...ys) - pad, maxX: Math.max(...xs) + pad, maxY: Math.max(...ys) + pad };
      }
    }
    const minX = Math.min(item.x1, item.x2) - pad;
    const minY = Math.min(item.y1, item.y2) - pad;
    const maxX = Math.max(item.x1, item.x2) + pad;
    const maxY = Math.max(item.y1, item.y2) + pad;
    return { minX, minY, maxX, maxY };
  } else if (item.type === 'text') {
    ctx.font = (item.fontSize || 18) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
    const lines = (item.text || '').split('\\n');
    let maxW = 0;
    lines.forEach(l => { maxW = Math.max(maxW, ctx.measureText(l || '').width); });
    const h = (item.fontSize || 18) * 1.25 * Math.max(1, lines.length);
    return { minX: item.x - 2, minY: item.y - 2, maxX: item.x + maxW + 4, maxY: item.y + h + 2 };
  } else if (item.type === 'image') {
    return { minX: item.x - pad, minY: item.y - pad, maxX: item.x + item.width + pad, maxY: item.y + item.height + pad };
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

/* ====================================================
   MODULAR SVG SERIALIZERS
==================================================== */
function shapeToSvg(it) {
  const size = it.size || PEN_SIZE;
  if (it.shapeType === 'rect' || it.shapeType === 'square') {
    const rx = Math.min(it.x1, it.x2), ry = Math.min(it.y1, it.y2);
    const rw = Math.abs(it.x2 - it.x1), rh = Math.abs(it.y2 - it.y1);
    return '<rect x="' + rx + '" y="' + ry + '" width="' + rw + '" height="' + rh + '" fill="none" stroke="' + it.color + '" stroke-width="' + size + '" />';
  }
  if (it.shapeType === 'circle') {
    const cx = (it.x1 + it.x2) / 2, cy = (it.y1 + it.y2) / 2;
    const rx = Math.abs(it.x2 - it.x1) / 2, ry = Math.abs(it.y2 - it.y1) / 2;
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + Math.max(0.1, rx) + '" ry="' + Math.max(0.1, ry) + '" fill="none" stroke="' + it.color + '" stroke-width="' + size + '" />';
  }
  if (it.shapeType === 'line') {
    return '<line x1="' + it.x1 + '" y1="' + it.y1 + '" x2="' + it.x2 + '" y2="' + it.y2 + '" stroke="' + it.color + '" stroke-width="' + size + '" stroke-linecap="round" />';
  }
  if (it.shapeType === 'arrow') {
    const geom = getArrowGeometry(it.x1, it.y1, it.x2, it.y2, size);
    if (!geom) return '';
    return '<line x1="' + it.x1 + '" y1="' + it.y1 + '" x2="' + geom.lineEndX + '" y2="' + geom.lineEndY + '" stroke="' + it.color + '" stroke-width="' + size + '" stroke-linecap="round" />' +
           '<polygon points="' + it.x2 + ',' + it.y2 + ' ' + geom.p1.x + ',' + geom.p1.y + ' ' + geom.p2.x + ',' + geom.p2.y + '" fill="' + it.color + '" />';
  }
  return '';
}

function itemToSvg(it) {
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
  }
  if (it.type === 'shape') {
    return shapeToSvg(it);
  }
  if (it.type === 'text') {
    const lines = (it.text || '').split('\\n');
    const tspans = lines.map((l, idx) => {
      const escaped = l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return '<tspan x="' + it.x + '" dy="' + (idx === 0 ? 0 : (it.fontSize || 18) * 1.25) + '">' + escaped + '</tspan>';
    }).join('');
    return '<text x="' + it.x + '" y="' + it.y + '" fill="' + it.color + '" font-size="' + (it.fontSize || 18) + '" font-family="-apple-system, BlinkMacSystemFont, sans-serif" dominant-baseline="hanging">' + tspans + '</text>';
  }
  if (it.type === 'image') {
    return '<image href="' + it.dataUrl + '" x="' + it.x + '" y="' + it.y + '" width="' + it.width + '" height="' + it.height + '" />';
  }
  return '';
}

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

function updateZoomDisplay() {
  const zoomText = document.getElementById('zoomPercentText');
  if (zoomText) {
    zoomText.innerText = Math.round(scale * 100) + '%';
  }
}

function toggleNavLock() {
  isNavLocked = !isNavLocked;
  const btn = document.getElementById('lockNavBtn');
  const shackle = document.getElementById('lockShackle');
  if (isNavLocked) {
    btn.classList.add('active');
    btn.title = "Pan & Zoom Locked (Click to Unlock)";
    if (shackle) shackle.setAttribute('d', 'M7 11V7a5 5 0 0 1 10 0v4');
  } else {
    btn.classList.remove('active');
    btn.title = "Lock Pan & Zoom";
    if (shackle) shackle.setAttribute('d', 'M7 11V7a5 5 0 0 1 9.9-1');
  }
}

function updateSelectionPopupPosition() {
  const sBounds = getSelectedTotalBounds();
  if (!sBounds || selectedItems.size === 0) {
    selectionPopup.style.display = 'none';
    return;
  }

  const pad = 6;
  const screenMinX = (sBounds.minX - pad) * scale + panX;
  const screenMinY = (sBounds.minY - pad) * scale + panY;
  const screenMaxX = (sBounds.maxX + pad) * scale + panX;

  selectionPopup.style.display = 'flex';
  const popupWidth = selectionPopup.offsetWidth || 150;
  const popupHeight = selectionPopup.offsetHeight || 38;

  let posX = (screenMinX + screenMaxX) / 2 - popupWidth / 2;
  let posY = screenMinY - popupHeight - 10;

  posX = Math.max(12, Math.min(window.innerWidth - popupWidth - 12, posX));
  if (posY < 56) {
    posY = (sBounds.maxY + pad) * scale + panY + 10;
  }

  selectionPopup.style.left = posX + 'px';
  selectionPopup.style.top = posY + 'px';
}

function showPastePopup(clientX, clientY, cPt) {
  if (clipboardItems.length === 0) return;
  pasteTargetPos = cPt;
  pastePopup.style.display = 'flex';
  const w = pastePopup.offsetWidth || 85;
  const h = pastePopup.offsetHeight || 36;
  const posX = Math.max(12, Math.min(window.innerWidth - w - 12, clientX - w / 2));
  const posY = Math.max(56, Math.min(window.innerHeight - h - 12, clientY - h - 8));
  pastePopup.style.left = posX + 'px';
  pastePopup.style.top = posY + 'px';
}

function hidePastePopup() {
  pastePopup.style.display = 'none';
  pasteTargetPos = null;
}

function copySelectedItems() {
  if (selectedItems.size === 0) return;
  clipboardItems = cloneState(Array.from(selectedItems));

  const copyBtn = document.getElementById('copySelectionBtn');
  if (copyBtn) {
    copyBtn.classList.add('active');
    const origHtml = copyBtn.innerHTML;
    copyBtn.innerHTML = '✓ Copied';
    setTimeout(() => {
      copyBtn.classList.remove('active');
      copyBtn.innerHTML = origHtml;
    }, 800);
  }

  document.getElementById('status').innerText = 'Copied ✓';
  setTimeout(() => { document.getElementById('status').innerText = 'Ready'; }, 1500);
}

function pasteItemsAt(targetCanvasX, targetCanvasY) {
  if (!clipboardItems || clipboardItems.length === 0) return;
  pushHistory();

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  clipboardItems.forEach(it => {
    const b = getItemBounds(it);
    if (b) {
      minX = Math.min(minX, b.minX); minY = Math.min(minY, b.minY);
      maxX = Math.max(maxX, b.maxX); maxY = Math.max(maxY, b.maxY);
    }
  });

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const dx = targetCanvasX - centerX;
  const dy = targetCanvasY - centerY;

  const newItems = cloneState(clipboardItems).map(it => {
    if (it.type === 'stroke') {
      it.points.forEach(p => { p.x += dx; p.y += dy; });
    } else if (it.type === 'shape') {
      it.x1 += dx; it.y1 += dy; it.x2 += dx; it.y2 += dy;
    } else {
      it.x += dx; it.y += dy;
    }
    return it;
  });

  selectedItems.clear();
  newItems.forEach(it => {
    items.push(it);
    selectedItems.add(it);
  });

  hidePastePopup();
  updateSelectionPopupPosition();
  render();
  triggerAutoSave();
}

function deleteSelectedItems() {
  if (selectedItems.size === 0) return;
  pushHistory();
  items = items.filter(it => !selectedItems.has(it));
  selectedItems.clear();
  updateSelectionPopupPosition();
  render();
  triggerAutoSave();
}

function resetZoom() {
  const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const canvasCenter = toCanvasCoord(centerScreen.x, centerScreen.y);
  
  scale = 1.0;
  panX = centerScreen.x - canvasCenter.x * scale;
  panY = centerScreen.y - canvasCenter.y * scale;

  updateInlineEditorPosition();
  updateSelectionPopupPosition();
  updateZoomDisplay();
  render();
}

function drawArrowShape(context, x1, y1, x2, y2, size, color) {
  const geom = getArrowGeometry(x1, y1, x2, y2, size);
  if (!geom) return;

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(geom.lineEndX, geom.lineEndY);
  context.strokeStyle = color;
  context.lineWidth = size;
  context.lineCap = 'round';
  context.stroke();

  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(geom.p1.x, geom.p1.y);
  context.lineTo(geom.p2.x, geom.p2.y);
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

function renderItem(item) {
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
  } else if (item.type === 'shape') {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.size || PEN_SIZE;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (item.shapeType === 'rect' || item.shapeType === 'square') {
      const rx = Math.min(item.x1, item.x2), ry = Math.min(item.y1, item.y2);
      const rw = Math.abs(item.x2 - item.x1), rh = Math.abs(item.y2 - item.y1);
      ctx.strokeRect(rx, ry, rw, rh);
    } else if (item.shapeType === 'circle') {
      const cx = (item.x1 + item.x2) / 2, cy = (item.y1 + item.y2) / 2;
      const rx = Math.abs(item.x2 - item.x1) / 2, ry = Math.abs(item.y2 - item.y1) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (item.shapeType === 'line') {
      ctx.beginPath();
      ctx.moveTo(item.x1, item.y1);
      ctx.lineTo(item.x2, item.y2);
      ctx.stroke();
    } else if (item.shapeType === 'arrow') {
      drawArrowShape(ctx, item.x1, item.y1, item.x2, item.y2, item.size || PEN_SIZE, item.color);
    }
  } else if (item.type === 'text') {
    if (item === activeTextTarget) return;
    ctx.fillStyle = item.color || '#fff';
    ctx.font = (item.fontSize || 18) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textBaseline = 'top';
    const lines = (item.text || '').split('\\n');
    lines.forEach((l, idx) => {
      ctx.fillText(l, item.x, item.y + idx * (item.fontSize || 18) * 1.25);
    });
  } else if (item.type === 'image') {
    if (item.imgObj && item.imgObj.complete) {
      ctx.drawImage(item.imgObj, item.x, item.y, item.width, item.height);
    }
  }
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

  items.forEach(item => renderItem(item));
  if (currentShape) renderItem(currentShape);

  const sBounds = getSelectedTotalBounds();
  if (sBounds) {
    // 1. Sub-selection bounding boxes for each individual selected item (when multiple are selected)
    if (selectedItems.size > 1) {
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.45)';
      ctx.lineWidth = 1 / scale;
      ctx.setLineDash([]);
      selectedItems.forEach(it => {
        const b = getItemBounds(it);
        if (b) {
          ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
        }
      });
    }

    // 2. Main Outer Selection Container
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

  if (isLassoing && lassoPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
    for (let i = 1; i < lassoPoints.length; i++) {
      ctx.lineTo(lassoPoints[i].x, lassoPoints[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(167, 139, 250, 0.18)';
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5 / scale;
    ctx.setLineDash([5 / scale, 5 / scale]);
    ctx.stroke();
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
    } else if (item.type === 'shape') {
      if (isPointNearShape(cPt, item, ERASER_RADIUS + (item.size || PEN_SIZE))) {
        changed = true;
        return false;
      }
    } else if (item.type === 'text') {
      const b = getItemBounds(item);
      if (b && cPt.x >= b.minX - ERASER_RADIUS && cPt.x <= b.maxX + ERASER_RADIUS &&
              cPt.y >= b.minY - ERASER_RADIUS && cPt.y <= b.maxY + ERASER_RADIUS) {
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
    } else if (item.type === 'shape') {
      if (isPointNearShape(cPt, item, 12 + (item.size || PEN_SIZE))) return item;
    } else if (item.type === 'text') {
      const b = getItemBounds(item);
      if (b && cPt.x >= b.minX - 4 && cPt.x <= b.maxX + 4 && cPt.y >= b.minY - 4 && cPt.y <= b.maxY + 4) return item;
    } else if (item.type === 'image') {
      if (cPt.x >= item.x && cPt.x <= item.x + item.width && cPt.y >= item.y && cPt.y <= item.y + item.height) return item;
    }
  }
  return null;
}

/* Precise Hollow-Aware Selection Checkers */
function isItemInBox(item, minX, minY, maxX, maxY) {
  const boxEdges = [
    { p1: { x: minX, y: minY }, p2: { x: maxX, y: minY } },
    { p1: { x: maxX, y: minY }, p2: { x: maxX, y: maxY } },
    { p1: { x: maxX, y: maxY }, p2: { x: minX, y: maxY } },
    { p1: { x: minX, y: maxY }, p2: { x: minX, y: minY } }
  ];

  function ptInBox(p) {
    return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
  }

  if (item.type === 'stroke') {
    if (item.points.some(ptInBox)) return true;
    for (let i = 0; i < item.points.length - 1; i++) {
      const p1 = item.points[i], p2 = item.points[i + 1];
      if (boxEdges.some(e => segmentsIntersect(p1, p2, e.p1, e.p2))) return true;
    }
    return false;
  }

  if (item.type === 'shape') {
    const segs = getShapeSegments(item);
    if (segs.some(s => ptInBox(s.p1) || ptInBox(s.p2))) return true;
    for (const s of segs) {
      if (boxEdges.some(e => segmentsIntersect(s.p1, s.p2, e.p1, e.p2))) return true;
    }
    return false;
  }

  if (item.type === 'text' || item.type === 'image') {
    const b = getItemBounds(item);
    return b && b.minX < maxX && b.maxX > minX && b.minY < maxY && b.maxY > minY;
  }

  return false;
}

function isItemInLasso(item, poly) {
  if (poly.length < 3) return false;

  const polyEdges = [];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    polyEdges.push({ p1: poly[j], p2: poly[i] });
  }

  if (item.type === 'stroke') {
    if (item.points.some(p => pointInPolygon(p, poly))) return true;
    for (let i = 0; i < item.points.length - 1; i++) {
      const p1 = item.points[i], p2 = item.points[i + 1];
      if (polyEdges.some(e => segmentsIntersect(p1, p2, e.p1, e.p2))) return true;
    }
    return false;
  }

  if (item.type === 'shape') {
    const segs = getShapeSegments(item);
    if (segs.some(s => pointInPolygon(s.p1, poly) || pointInPolygon(s.p2, poly))) return true;
    for (const s of segs) {
      if (polyEdges.some(e => segmentsIntersect(s.p1, s.p2, e.p1, e.p2))) return true;
    }
    return false;
  }

  if (item.type === 'text' || item.type === 'image') {
    const b = getItemBounds(item);
    if (!b) return false;
    const corners = [
      { x: b.minX, y: b.minY },
      { x: b.maxX, y: b.minY },
      { x: b.maxX, y: b.maxY },
      { x: b.minX, y: b.maxY }
    ];
    if (corners.some(c => pointInPolygon(c, poly))) return true;
    const center = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
    if (pointInPolygon(center, poly)) return true;
    const rectEdges = [
      { p1: corners[0], p2: corners[1] },
      { p1: corners[1], p2: corners[2] },
      { p1: corners[2], p2: corners[3] },
      { p1: corners[3], p2: corners[0] }
    ];
    for (const re of rectEdges) {
      if (polyEdges.some(pe => segmentsIntersect(re.p1, re.p2, pe.p1, pe.p2))) return true;
    }
    return false;
  }

  return false;
}

function selectItemsInBox(p1, p2) {
  const minX = Math.min(p1.x, p2.x), minY = Math.min(p1.y, p2.y);
  const maxX = Math.max(p1.x, p2.x), maxY = Math.max(p1.y, p2.y);

  selectedItems.clear();
  items.forEach(it => {
    if (isItemInBox(it, minX, minY, maxX, maxY)) {
      selectedItems.add(it);
    }
  });
  updateSelectionPopupPosition();
  render();
}

function selectItemsInLasso(poly) {
  if (poly.length < 3) return;
  selectedItems.clear();
  items.forEach(it => {
    if (isItemInLasso(it, poly)) {
      selectedItems.add(it);
    }
  });
  updateSelectionPopupPosition();
  render();
}

const shapeIcons = {
  rect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="1"/></svg>',
  square: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="1"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="10 5 19 5 19 14"/></svg>',
  line: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="20" x2="20" y2="4"/></svg>'
};

function updateShapeButtonIcon() {
  const holder = document.getElementById('shapeIconHolder');
  if (holder && shapeIcons[activeShapeType]) {
    holder.innerHTML = shapeIcons[activeShapeType];
  }
}

function notifyNativeTouchBridge(enabled) {
  try {
    if (typeof window !== 'undefined' && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.touchBridge) {
      window.webkit.messageHandlers.touchBridge.postMessage({ overlayEnabled: enabled });
    }
  } catch(e) {}
}

function setTool(tool) {
  currentTool = tool;
  
  document.querySelectorAll('.top-bar .btn').forEach(b => b.classList.remove('active'));
  if (tool === 'pen') document.getElementById('penBtn').classList.add('active');
  else if (tool === 'eraser') document.getElementById('eraserBtn').classList.add('active');
  else if (tool === 'shape') document.getElementById('shapeBtn').classList.add('active');
  else if (tool === 'select') document.getElementById('selectBtn').classList.add('active');
  else if (tool === 'hand') document.getElementById('handBtn').classList.add('active');
  else if (tool === 'lasso') document.getElementById('lassoBtn').classList.add('active');
  else if (tool === 'text') document.getElementById('textBtn').classList.add('active');

  if (tool === 'hand') {
    canvas.style.cursor = 'grab';
  } else {
    canvas.style.cursor = 'crosshair';
  }

  if (isNavLocked) {
    document.getElementById('lockNavBtn').classList.add('active');
  }

  if (tool === 'text') {
    notifyNativeTouchBridge(false);
  } else {
    notifyNativeTouchBridge(true);
  }

  if (inlineEditor.style.display === 'block') {
    commitInlineText();
  }

  hidePastePopup();
  shapeMenu.style.display = 'none';

  if (selectedItems.size > 0 && tool !== 'select' && tool !== 'lasso') {
    selectedItems.clear();
    updateSelectionPopupPosition();
    render();
  }
}

function adjustEditorSize() {
  if (!activeTextTarget) return;
  const lines = (inlineEditor.value || 'A').split('\\n');
  ctx.font = ((activeTextTarget.fontSize || 18) * scale) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
  let maxW = 0;
  lines.forEach(l => { maxW = Math.max(maxW, ctx.measureText(l || 'A').width); });
  inlineEditor.style.width = Math.max(maxW + 20, 40) + 'px';
  inlineEditor.style.height = ((activeTextTarget.fontSize || 18) * scale * 1.25 * lines.length + 8) + 'px';
}

function updateInlineEditorPosition() {
  if (inlineEditor.style.display !== 'block' || !activeTextTarget) return;
  const screenX = activeTextTarget.x * scale + panX;
  const screenY = activeTextTarget.y * scale + panY;
  inlineEditor.style.left = screenX + 'px';
  inlineEditor.style.top = screenY + 'px';
  inlineEditor.style.fontSize = ((activeTextTarget.fontSize || 18) * scale) + 'px';
  adjustEditorSize();
}

function openInlineTextEditor(cPt, existingItem) {
  if (inlineEditor.style.display === 'block') {
    commitInlineText();
  }

  isOpeningTextEditor = true;
  notifyNativeTouchBridge(false);

  if (existingItem) {
    activeTextTarget = existingItem;
  } else {
    activeTextTarget = {
      type: 'text',
      x: cPt.x,
      y: cPt.y,
      text: '',
      color: currentColor,
      fontSize: 18,
      isNew: true
    };
  }

  inlineEditor.value = activeTextTarget.text || '';
  inlineEditor.style.color = activeTextTarget.color || currentColor;
  inlineEditor.style.display = 'block';
  updateInlineEditorPosition();
  render();

  setTimeout(() => {
    inlineEditor.focus();
    if (!activeTextTarget.isNew && activeTextTarget.text) {
      inlineEditor.select();
    }
    isOpeningTextEditor = false;
  }, 25);
}

function commitInlineText() {
  if (inlineEditor.style.display === 'none' || !activeTextTarget) return;
  const val = inlineEditor.value.trim();
  inlineEditor.style.display = 'none';

  if (currentTool !== 'text') {
    notifyNativeTouchBridge(true);
  }

  if (val) {
    pushHistory();
    activeTextTarget.text = val;
    if (activeTextTarget.isNew) {
      delete activeTextTarget.isNew;
      items.push(activeTextTarget);
    }
  } else if (!activeTextTarget.isNew) {
    pushHistory();
    items = items.filter(it => it !== activeTextTarget);
  }

  activeTextTarget = null;
  render();
  triggerAutoSave();
}

inlineEditor.addEventListener('input', adjustEditorSize);
inlineEditor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    commitInlineText();
  } else if (e.key === 'Escape') {
    inlineEditor.style.display = 'none';
    if (currentTool !== 'text') notifyNativeTouchBridge(true);
    activeTextTarget = null;
    render();
  }
});
inlineEditor.addEventListener('blur', () => {
  if (isOpeningTextEditor) return;
  commitInlineText();
});

function handleStart(clientX, clientY) {
  if (!currentFileName) return;
  lastMousePos = { x: clientX, y: clientY };

  if (shapeMenu.style.display === 'flex') {
    const smRect = shapeMenu.getBoundingClientRect();
    if (clientX >= smRect.left && clientX <= smRect.right && clientY >= smRect.top && clientY <= smRect.bottom) {
      const shapeBtns = document.querySelectorAll('#shapeMenu .shape-item');
      for (const sBtn of shapeBtns) {
        const bRect = sBtn.getBoundingClientRect();
        if (clientX >= bRect.left && clientX <= bRect.right && clientY >= bRect.top && clientY <= bRect.bottom) {
          activeShapeType = sBtn.dataset.shape;
          document.querySelectorAll('#shapeMenu .shape-item').forEach(i => i.classList.remove('active'));
          sBtn.classList.add('active');
          updateShapeButtonIcon();
          shapeMenu.style.display = 'none';
          setTool('shape');
          return;
        }
      }
    }
  }

  if (selectionPopup.style.display === 'flex') {
    const popRect = selectionPopup.getBoundingClientRect();
    if (clientX >= popRect.left && clientX <= popRect.right && clientY >= popRect.top && clientY <= popRect.bottom) {
      const copyBtn = document.getElementById('copySelectionBtn');
      const cpRect = copyBtn.getBoundingClientRect();
      if (clientX >= cpRect.left && clientX <= cpRect.right && clientY >= cpRect.top && clientY <= cpRect.bottom) {
        copySelectedItems();
        return;
      }
      const delBtn = document.getElementById('deleteSelectionBtn');
      const dRect = delBtn.getBoundingClientRect();
      if (clientX >= dRect.left && clientX <= dRect.right && clientY >= dRect.top && clientY <= dRect.bottom) {
        deleteSelectedItems();
        return;
      }
    }
  }

  if (pastePopup.style.display === 'flex') {
    const pRect = pastePopup.getBoundingClientRect();
    if (clientX >= pRect.left && clientX <= pRect.right && clientY >= pRect.top && clientY <= popRect.bottom) {
      const doPBtn = document.getElementById('doPasteBtn');
      const dpRect = doPBtn.getBoundingClientRect();
      if (clientX >= dpRect.left && clientX <= dpRect.right && clientY >= dpRect.top && clientY <= dpRect.bottom) {
        if (pasteTargetPos) pasteItemsAt(pasteTargetPos.x, pasteTargetPos.y);
        return;
      }
    }
  }

  hidePastePopup();

  if (inlineEditor.style.display === 'block') {
    commitInlineText();
  }

  if (currentTool === 'hand') {
    isPanning = true;
    panToolStart = { x: clientX, y: clientY, startPanX: panX, startPanY: panY };
    canvas.style.cursor = 'grabbing';
    return;
  }

  const cPt = toCanvasCoord(clientX, clientY);

  if (currentTool === 'pen') {
    pushHistory();
    isInteracting = true;
    currentStroke = { type: 'stroke', color: currentColor, size: PEN_SIZE, points: [cPt] };
    items.push(currentStroke);
    render();
  } else if (currentTool === 'shape') {
    isInteracting = true;
    currentShape = {
      type: 'shape',
      shapeType: activeShapeType,
      x1: cPt.x,
      y1: cPt.y,
      x2: cPt.x,
      y2: cPt.y,
      color: currentColor,
      size: PEN_SIZE
    };
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
        selectionTapCandidate = { clientX, clientY, cPt, isDrag: false };
        isMarquee = true;
        marqueeStart = cPt;
        marqueeEnd = cPt;
      }
    }
    updateSelectionPopupPosition();
    render();
  } else if (currentTool === 'lasso') {
    isInteracting = true;
    dragStartPos = cPt;

    const sBounds = getSelectedTotalBounds();
    const pad = 10;
    const isInsideSelectionBounds = sBounds && 
      (cPt.x >= sBounds.minX - pad && cPt.x <= sBounds.maxX + pad && cPt.y >= sBounds.minY - pad && cPt.y <= sBounds.maxY + pad);

    if (isInsideSelectionBounds) {
      pushHistory();
      isLassoing = false;
    } else {
      selectedItems.clear();
      selectionTapCandidate = { clientX, clientY, cPt, isDrag: false };
      isLassoing = true;
      lassoPoints = [cPt];
    }
    updateSelectionPopupPosition();
    render();
  } else if (currentTool === 'text') {
    const clicked = getItemAt(cPt);
    if (clicked && clicked.type === 'text') {
      openInlineTextEditor(cPt, clicked);
    } else {
      openInlineTextEditor(cPt, null);
    }
  }
}

function handleMove(clientX, clientY) {
  if (!currentFileName) return;
  lastMousePos = { x: clientX, y: clientY };

  if (currentTool === 'hand' && isPanning && panToolStart) {
    panX = panToolStart.startPanX + (clientX - panToolStart.x);
    panY = panToolStart.startPanY + (clientY - panToolStart.y);
    updateInlineEditorPosition();
    updateSelectionPopupPosition();
    render();
    return;
  }

  if (selectionTapCandidate) {
    if (Math.hypot(clientX - selectionTapCandidate.clientX, clientY - selectionTapCandidate.clientY) > 5) {
      selectionTapCandidate.isDrag = true;
    }
  }

  const cPt = toCanvasCoord(clientX, clientY);

  if (isInteracting) {
    if (currentTool === 'pen' && currentStroke) {
      currentStroke.points.push(cPt);
      render();
    } else if (currentTool === 'shape' && currentShape) {
      if (currentShape.shapeType === 'square' || currentShape.shapeType === 'circle') {
        const dx = cPt.x - currentShape.x1;
        const dy = cPt.y - currentShape.y1;
        const side = Math.max(Math.abs(dx), Math.abs(dy));
        currentShape.x2 = currentShape.x1 + Math.sign(dx || 1) * side;
        currentShape.y2 = currentShape.y1 + Math.sign(dy || 1) * side;
      } else {
        currentShape.x2 = cPt.x;
        currentShape.y2 = cPt.y;
      }
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
          else if (it.type === 'shape') { it.x1 += dx; it.y1 += dy; it.x2 += dx; it.y2 += dy; }
          else { it.x += dx; it.y += dy; }
        });
        dragStartPos = cPt;
        updateSelectionPopupPosition();
        render();
      }
    } else if (currentTool === 'lasso') {
      if (isLassoing) {
        lassoPoints.push(cPt);
        render();
      } else if (dragStartPos && selectedItems.size > 0) {
        const dx = cPt.x - dragStartPos.x;
        const dy = cPt.y - dragStartPos.y;
        selectedItems.forEach(it => {
          if (it.type === 'stroke') it.points.forEach(p => { p.x += dx; p.y += dy; });
          else if (it.type === 'shape') { it.x1 += dx; it.y1 += dy; it.x2 += dx; it.y2 += dy; }
          else { it.x += dx; it.y += dy; }
        });
        dragStartPos = cPt;
        updateSelectionPopupPosition();
        render();
      }
    }
  }
}

function handleEnd() {
  if (!currentFileName) return;

  if (currentTool === 'hand') {
    isPanning = false;
    panToolStart = null;
    canvas.style.cursor = 'grab';
    return;
  }

  if (isInteracting) {
    isInteracting = false;
    currentStroke = null;
    dragStartPos = null;
    isMarquee = false;
    marqueeStart = null;
    marqueeEnd = null;

    if (currentTool === 'shape' && currentShape) {
      const dist = Math.hypot(currentShape.x2 - currentShape.x1, currentShape.y2 - currentShape.y1);
      if (dist > 4) {
        pushHistory();
        items.push(currentShape);
      }
      currentShape = null;
    }

    if (isLassoing) {
      isLassoing = false;
      selectItemsInLasso(lassoPoints);
      lassoPoints = [];
    }

    if (selectionTapCandidate && !selectionTapCandidate.isDrag) {
      if (selectedItems.size === 0 && clipboardItems.length > 0) {
        showPastePopup(selectionTapCandidate.clientX, selectionTapCandidate.clientY, selectionTapCandidate.cPt);
      }
    }
    selectionTapCandidate = null;

    updateSelectionPopupPosition();
    render();
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(triggerAutoSave, 1000);
  }
}

let activeStylusId = null;
let nativeSinglePan = null;
let nativePinchDist = null;
let nativePinchMid = null;

window.onNativeTouch = function(phase, touchArray) {
  if (!currentFileName || !touchArray || touchArray.length === 0) return;

  const stylus = touchArray.find(t => t.type === 'stylus');
  const fingers = touchArray.filter(t => t.type === 'direct');

  // 1. STYLUS HAS ABSOLUTE PRIORITY OVER FINGERS
  if (stylus) {
    nativeSinglePan = null;
    nativePinchDist = null;

    if (activeStylusId === null) {
      activeStylusId = stylus.id;
      handleStart(stylus.x, stylus.y);
    } else if (activeStylusId === stylus.id) {
      if (stylus.phase === 'ended' || stylus.phase === 'cancelled') {
        activeStylusId = null;
        handleEnd();
      } else {
        handleMove(stylus.x, stylus.y);
      }
    }
    return;
  }

  // If stylus is active, ignore finger touches to keep shape/stroke anchor fixed
  if (activeStylusId !== null) {
    activeStylusId = null;
    handleEnd();
    return;
  }

  // 2. FINGER TOUCH NAVIGATION (Independent of selected tool when unlocked)
  if (activeStylusId === null) {
    if (isNavLocked) {
      return;
    }

    // 1-Finger Pan
    if (fingers.length === 1) {
      const f = fingers[0];
      if (phase === 'start' || !nativeSinglePan) {
        isPanning = true;
        nativePinchDist = null;
        nativeSinglePan = { x: f.x, y: f.y, startPanX: panX, startPanY: panY };
      } else if (phase === 'move' && isPanning && nativeSinglePan) {
        panX = nativeSinglePan.startPanX + (f.x - nativeSinglePan.x);
        panY = nativeSinglePan.startPanY + (f.y - nativeSinglePan.y);
        updateInlineEditorPosition();
        updateSelectionPopupPosition();
        render();
      } else if (phase === 'end' || phase === 'cancel' || f.phase === 'ended' || f.phase === 'cancelled') {
        isPanning = false;
        nativeSinglePan = null;
      }
      return;
    }

    // 2-Finger Pinch Zoom & Pan
    if (fingers.length >= 2) {
      nativeSinglePan = null;
      const f1 = fingers[0], f2 = fingers[1];
      const currentDist = Math.hypot(f1.x - f2.x, f1.y - f2.y);
      const currentMid = { x: (f1.x + f2.x) / 2, y: (f1.y + f2.y) / 2 };

      if (phase === 'start' || !nativePinchDist) {
        isPanning = true;
        nativePinchDist = currentDist;
        nativePinchMid = currentMid;
      } else if (phase === 'move' && nativePinchDist && currentDist > 0) {
        panX += (currentMid.x - nativePinchMid.x);
        panY += (currentMid.y - nativePinchMid.y);
        
        const newScale = Math.min(Math.max(0.2, scale * (currentDist / nativePinchDist)), 5.0);
        const canvasX = (currentMid.x - panX) / scale;
        const canvasY = (currentMid.y - panY) / scale;
        scale = newScale;
        panX = currentMid.x - canvasX * scale;
        panY = currentMid.y - canvasY * scale;

        nativePinchDist = currentDist;
        nativePinchMid = currentMid;
        updateInlineEditorPosition();
        updateSelectionPopupPosition();
        updateZoomDisplay();
        render();
      } else if (phase === 'end' || phase === 'cancel') {
        isPanning = false;
        nativePinchDist = null;
        nativePinchMid = null;
      }
      return;
    }
  }

  if (phase === 'end' || phase === 'cancel') {
    isPanning = false;
    nativeSinglePan = null;
    nativePinchDist = null;
    nativePinchMid = null;
  }
};

let activeTouchId = null;
let singleFingerPan = null;
let prevPinchDist = null, prevPinchMid = null;

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touches = Array.from(e.touches);
  const stylusTouch = touches.find(t => t.touchType === 'stylus');

  if (stylusTouch) {
    if (activeTouchId !== stylusTouch.identifier) {
      activeTouchId = stylusTouch.identifier;
      singleFingerPan = null;
      handleStart(stylusTouch.clientX, stylusTouch.clientY);
    }
    return;
  }

  if (activeTouchId !== null) return;

  if (touches.length === 2) {
    if (isNavLocked) return;
    isInteracting = false;
    isPanning = true;
    singleFingerPan = null;
    prevPinchDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    prevPinchMid = { x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 };
    return;
  }

  if (touches.length === 1) {
    if (isNavLocked) return;
    isPanning = true;
    singleFingerPan = { x: touches[0].clientX, y: touches[0].clientY, startPanX: panX, startPanY: panY };
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (activeTouchId !== null) {
    const drawTouch = Array.from(e.touches).find(t => t.identifier === activeTouchId);
    if (drawTouch) {
      handleMove(drawTouch.clientX, drawTouch.clientY);
      return;
    }
  }

  if (isNavLocked) {
    return;
  }

  if (isPanning && singleFingerPan && e.touches.length === 1) {
    const t = e.touches[0];
    panX = singleFingerPan.startPanX + (t.clientX - singleFingerPan.x);
    panY = singleFingerPan.startPanY + (t.clientY - singleFingerPan.y);
    updateInlineEditorPosition();
    updateSelectionPopupPosition();
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
      updateInlineEditorPosition();
      updateSelectionPopupPosition();
      updateZoomDisplay();
      render();
    }
  }
}, { passive: false });

function handleTouchEnd(e) {
  e.preventDefault();
  const ended = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
  if (ended) {
    activeTouchId = null;
    handleEnd();
  }
  if (e.touches.length === 0) {
    isPanning = false;
    singleFingerPan = null;
    prevPinchDist = null;
    prevPinchMid = null;
  } else if (e.touches.length === 1 && activeTouchId === null) {
    if (isNavLocked) {
      isPanning = false;
      singleFingerPan = null;
      return;
    }
    isPanning = true;
    prevPinchDist = null;
    prevPinchMid = null;
    singleFingerPan = { x: e.touches[0].clientX, y: e.touches[0].clientY, startPanX: panX, startPanY: panY };
  }
}
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    if (currentTool === 'text' && e.target === canvas) {
      e.preventDefault();
    }
    handleStart(e.clientX, e.clientY);
  }
});
window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
window.addEventListener('mouseup', () => handleEnd());

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();

  if (e.ctrlKey || e.metaKey) {
    if (isNavLocked) return;

    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.min(Math.max(0.2, scale * zoomFactor), 5.0);
    const mousePt = { x: e.clientX, y: e.clientY };
    const canvasX = (mousePt.x - panX) / scale;
    const canvasY = (mousePt.y - panY) / scale;
    scale = newScale;
    panX = mousePt.x - canvasX * scale;
    panY = mousePt.y - canvasY * scale;
    updateZoomDisplay();
  } else {
    if (isNavLocked && currentTool !== 'hand') return;
    panX -= e.deltaX;
    panY -= e.deltaY;
  }
  updateInlineEditorPosition();
  updateSelectionPopupPosition();
  render();
}, { passive: false });

window.addEventListener('paste', async (e) => {
  if (!currentFileName) return;
  const clipboardItemsList = e.clipboardData?.items;
  if (!clipboardItemsList) return;
  const targetPt = toCanvasCoord(lastMousePos.x, lastMousePos.y);

  for (const it of clipboardItemsList) {
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
          items.push({ type: 'image', x: targetPt.x - w/2, y: targetPt.y - h/2, width: w, height: h, dataUrl, imgObj: img });
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
          items.push({ type: 'text', text, x: targetPt.x, y: targetPt.y, color: currentColor, fontSize: 18 });
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
    isInteracting = false; isPanning = false; currentStroke = null; currentShape = null;
  };
  btnEl.addEventListener('touchstart', handler, { passive: false });
  btnEl.addEventListener('mousedown', handler);
}

document.querySelectorAll('.color-dot').forEach(dot => {
  bindBtn(dot, () => {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    currentColor = dot.dataset.color;
    if (currentTool === 'eraser' || currentTool === 'hand') {
      setTool('pen');
    }
  });
});

bindBtn(document.getElementById('penBtn'), () => setTool('pen'));
bindBtn(document.getElementById('eraserBtn'), () => setTool('eraser'));

bindBtn(document.getElementById('shapeBtn'), () => {
  if (currentTool !== 'shape') {
    setTool('shape');
    shapeMenu.style.display = 'none';
  } else {
    const isOpened = shapeMenu.style.display === 'flex';
    shapeMenu.style.display = isOpened ? 'none' : 'flex';
  }
});

document.querySelectorAll('#shapeMenu .shape-item').forEach(item => {
  bindBtn(item, () => {
    activeShapeType = item.dataset.shape;
    document.querySelectorAll('#shapeMenu .shape-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    updateShapeButtonIcon();
    shapeMenu.style.display = 'none';
    setTool('shape');
  });
});

bindBtn(document.getElementById('selectBtn'), () => setTool('select'));
bindBtn(document.getElementById('handBtn'), () => setTool('hand'));
bindBtn(document.getElementById('lassoBtn'), () => setTool('lasso'));
bindBtn(document.getElementById('textBtn'), () => setTool('text'));

bindBtn(document.getElementById('resetZoomBtn'), () => resetZoom());
bindBtn(document.getElementById('lockNavBtn'), () => toggleNavLock());

bindBtn(document.getElementById('copySelectionBtn'), () => copySelectedItems());
bindBtn(document.getElementById('deleteSelectionBtn'), () => deleteSelectedItems());

bindBtn(document.getElementById('doPasteBtn'), () => {
  if (pasteTargetPos) pasteItemsAt(pasteTargetPos.x, pasteTargetPos.y);
});

function doUndo() {
  if (undoStack.length > 0) {
    redoStack.push(cloneState(items));
    items = undoStack.pop();
    selectedItems.clear();
    updateSelectionPopupPosition();
    render();
    triggerAutoSave();
  }
}

function doRedo() {
  if (redoStack.length > 0) {
    undoStack.push(cloneState(items));
    items = redoStack.pop();
    selectedItems.clear();
    updateSelectionPopupPosition();
    render();
    triggerAutoSave();
  }
}

bindBtn(document.getElementById('undoBtn'), doUndo);
bindBtn(document.getElementById('redoBtn'), doRedo);

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if ((e.metaKey || e.ctrlKey) && (e.key === 'c' || e.key === 'C')) {
    if (selectedItems.size > 0) {
      e.preventDefault();
      copySelectedItems();
      return;
    }
  }

  if ((e.metaKey || e.ctrlKey) && (e.key === 'v' || e.key === 'V')) {
    if (clipboardItems.length > 0) {
      e.preventDefault();
      const targetPt = toCanvasCoord(lastMousePos.x, lastMousePos.y);
      pasteItemsAt(targetPt.x, targetPt.y);
      return;
    }
  }

  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItems.size > 0) {
    e.preventDefault();
    deleteSelectedItems();
    return;
  }

  if (e.key === 'p' || e.key === 'P') { setTool('pen'); return; }
  if (e.key === 'e' || e.key === 'E') { setTool('eraser'); return; }
  if (e.key === 's' || e.key === 'S' || e.key === 'v' || e.key === 'V' || e.key === 'b' || e.key === 'B') { setTool('select'); return; }
  if (e.key === 'h' || e.key === 'H') { setTool('hand'); return; }
  if (e.key === 'l' || e.key === 'L') { setTool('lasso'); return; }
  if (e.key === 't' || e.key === 'T') { setTool('text'); return; }

  if ((e.metaKey || e.ctrlKey) && (e.key === '0')) { e.preventDefault(); resetZoom(); return; }

  if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) { doRedo(); }
  else if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) { doUndo(); }
  else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || e.key === 'Y')) { doRedo(); }
});

async function triggerAutoSave() {
  if (!currentFileName) return;
  document.getElementById('status').innerText = 'Saving...';

  let minX = 0, minY = 0, maxX = window.innerWidth, maxY = window.innerHeight;
  if (items.length > 0) {
    const allBounds = items.map(it => getItemBounds(it)).filter(Boolean);
    if (allBounds.length > 0) {
      minX = Math.min(...allBounds.map(b => b.minX)) - 32;
      minY = Math.min(...allBounds.map(b => b.minY)) - 32;
      maxX = Math.max(...allBounds.map(b => b.maxX)) + 32;
      maxY = Math.max(...allBounds.map(b => b.maxY)) + 32;
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

  const svgElements = items.map(it => itemToSvg(it)).join('\\n');

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
      body: JSON.stringify({ name: currentFileName, svg, state: stateObj, senderId: CLIENT_ID })
    });
    if (res.ok) {
      document.getElementById('status').innerText = 'Saved ✓ ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }
  } catch(e) { document.getElementById('status').innerText = 'Save Error'; }
}

async function loadDrawingFile(fileName, markdownNote) {
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
      
      currentFileName = fileName;
      if (markdownNote) {
        parentNoteEl.innerText = markdownNote;
      }
      waitingOverlay.style.display = 'none';
      updateSelectionPopupPosition();
      updateZoomDisplay();
      render();
      document.getElementById('status').innerText = 'Ready';
    }
  } catch(err) { alert('Could not load drawing.'); }
}

async function checkInitialActiveDoc() {
  try {
    const res = await authFetch('/api/current');
    const data = await res.json();
    if (data && data.activeDoc) {
      loadDrawingFile(data.activeDoc.svgFile, data.activeDoc.markdownNote);
    } else {
      waitingOverlay.style.display = 'flex';
    }
  } catch (e) {
    waitingOverlay.style.display = 'flex';
  }
}

const sseUrl = '/api/events?client=' + CLIENT_ID;
const sse = new EventSource(sseUrl);
sse.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data);
    if (data.type === 'switch' && data.name) {
      loadDrawingFile(data.name, data.markdownNote);
    } else if (data.type === 'doc-updated' && data.name === currentFileName && data.senderId !== CLIENT_ID) {
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

resize();
updateShapeButtonIcon();
checkInitialActiveDoc();
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