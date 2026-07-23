import { App, Modal, Scope, ItemView } from 'obsidian';
import * as os from 'os';
import { execSync } from 'child_process';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import CustomTerminalPlugin, { WS_PORT } from './main';

export class TerminalModal extends Modal {
    isOpen = false;
    public isVisible = true; // Tracks if the modal is currently unhidden in the workspace

    private terminal: Terminal | null = null;
    private fitAddon: FitAddon | null = null;
    private resizeObserver: ResizeObserver | null = null;

    private ws: WebSocket | null = null;
    private sessionId: string;
    private wsReady = false;
    private inputQueue: string[] = [];
    private reconnectTimeout: any = null;
    private observerTimeout: any = null; // Debounce timer for layout changes
    private resizeThrottleTimer: any = null; // Throttle timer for mouse-drag fitting
    private isExited = false; // Tracks if the terminal process has terminated

    private lastCols = 0;
    private lastRows = 0;

    private dragState = { dragging: false, startX: 0, startY: 0, origLeft: 0, origTop: 0 };
    private dragOverlay: HTMLDivElement | null = null;
    private currentBounds = { left: 0, top: 0, width: 0, height: 0 };

    private inlineContainer: HTMLElement | null = null;
    private isInline = false;

    private focusBackdrop: HTMLDivElement | null = null;

    private persistentPaneEl: HTMLDivElement | null = null; // Preserves split-pane HTML layout
    private xtermWrapEl: HTMLElement | null = null; // Reference to the active text viewport wrapper

    private focusListener: (() => void) | null = null;

    constructor(
        app: App,
        private plugin: CustomTerminalPlugin,
        inlineContainer?: HTMLElement,
    ) {
        super(app);

        if (inlineContainer) {
            this.isInline = true;
            this.inlineContainer = inlineContainer;
        }

        const sessionKey = this.isInline ? '_termSessionId_pane' : '_termSessionId_float';
        const stored = (this.plugin as any)[sessionKey] as string | undefined;

        if (stored) {
            this.sessionId = stored;
        } else {
            this.sessionId = `term-${this.isInline ? 'pane' : 'float'}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            (this.plugin as any)[sessionKey] = this.sessionId;
        }
    }

    // ── Persistence API (Hide / Show / Remount) ──────────────────────────

    hide() {
        if (this.isInline) return;
        this.isVisible = false;
        this.containerEl.style.display = 'none';
        if (this.focusBackdrop) {
            this.focusBackdrop.style.display = 'none';
        }
        
        if (this.scope) {
            try {
                this.app.keymap.popScope(this.scope);
            } catch (err) {
                console.error('[terminal] failed to pop scope on hide:', err);
            }
        }

        const activeView = this.app.workspace.getActiveViewOfType(ItemView);
        if (activeView) {
            activeView.containerEl.focus();
        }
    }

    show() {
        if (this.isInline) return;
        this.isVisible = true;
        this.containerEl.style.display = '';
        if (this.focusBackdrop) {
            this.focusBackdrop.style.display = '';
        }

        if (this.scope) {
            this.app.keymap.pushScope(this.scope);
        }

        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
            this.connectWS();
        }

        this.terminal?.focus();
        
        try {
            this.fitAddon?.fit();
        } catch {}
    }

    detach() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.observerTimeout) {
            clearTimeout(this.observerTimeout);
            this.observerTimeout = null;
        }

        if (this.persistentPaneEl) {
            this.persistentPaneEl.style.display = 'none';
            document.body.appendChild(this.persistentPaneEl);
        }

        this.inlineContainer = null;
        this.isOpen = false;
        this.isVisible = false;
    }

    remount(container: HTMLElement) {
        this.inlineContainer = container;
        this.isInline = true;
        this.isOpen = true;
        this.isVisible = true;

        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
            this.connectWS();
        }

        if (this.persistentPaneEl) {
            this.persistentPaneEl.style.display = 'flex';
            container.appendChild(this.persistentPaneEl);
        }

        if (this.xtermWrapEl) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.observerTimeout) {
                    clearTimeout(this.observerTimeout);
                }
                this.observerTimeout = setTimeout(() => {
                    try {
                        this.fitAddon?.fit();
                    } catch (e) {
                        console.error('[terminal] fit failed on resize:', e);
                    }
                    this.observerTimeout = null;
                }, 80);
            });
            this.resizeObserver.observe(this.xtermWrapEl);
        }

        requestAnimationFrame(() => {
            try {
                this.fitAddon?.fit();
            } catch {}
            this.terminal?.focus();
        });
    }

    // ── Entry points ──────────────────────────────────────────────────────

    onOpen() {
        this.isOpen = true;
        this.isVisible = true;
        
        if (this.scope) {
            this.app.keymap.popScope(this.scope);
        }

        this.scope = new Scope(this.app.scope);
        this.scope.register([], 'Escape', () => {
            return true;
        });
        this.app.keymap.pushScope(this.scope);

        this.setupFocusListener();
        this.buildFloatingUI();
    }

    openInline() {
        if (!this.inlineContainer) return;
        this.isOpen = true;
        this.isVisible = true;
        this.setupFocusListener();
        this.buildInlineUI(this.inlineContainer);
    }

    onClose() {
        this.isOpen = false;
        this.isVisible = false;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.observerTimeout) {
            clearTimeout(this.observerTimeout);
            this.observerTimeout = null;
        }
        if (this.resizeThrottleTimer) {
            clearTimeout(this.resizeThrottleTimer);
            this.resizeThrottleTimer = null;
        }

        this.teardownFocusListener();

        if (this.focusBackdrop) {
            try { this.focusBackdrop.remove(); } catch (_) {}
            this.focusBackdrop = null;
        }
        
        try { 
            this.saveWindowBounds(); 
        } catch (err) { 
            console.error('[terminal] saveWindowBounds failed during close:', err); 
        }

        if (this.plugin.modal === this) {
            this.plugin.modal = null;
        }

        try { 
            this.teardownKeyInterception(); 
        } catch (err) { 
            console.error('[terminal] teardownKeyInterception failed during close:', err); 
        }

        try { 
            this.disconnectWS(); 
        } catch (err) { 
            console.error('[terminal] disconnectWS failed during close:', err); 
        }

        try { 
            this.terminal?.dispose(); 
        } catch (err) { 
            console.error('[terminal] terminal dispose failed during close:', err); 
        }

        try { 
            this.resizeObserver?.disconnect(); 
        } catch (err) { 
            console.error('[terminal] resizeObserver disconnect failed during close:', err); 
        }

        this.terminal = null;

        try { 
            this.removeOverlay(); 
        } catch (err) { 
            console.error('[terminal] removeOverlay failed during close:', err); 
        }

        if (this.persistentPaneEl) {
            try { this.persistentPaneEl.remove(); } catch (_) {}
            this.persistentPaneEl = null;
        }
        this.xtermWrapEl = null;
        
        if (this.scope) {
            try {
                this.app.keymap.popScope(this.scope);
            } catch (err) {
                console.error('[terminal] popScope failed during close:', err);
            }
        }
    }

    destroy() {
        this.onClose();
    }

    // ── Window Focus Listener ─────────────────────────────────────────────

    private setupFocusListener() {
        if (!this.focusListener) {
            this.focusListener = () => {
                if (this.isOpen && (!this.ws || this.ws.readyState === WebSocket.CLOSED)) {
                    this.connectWS();
                }
            };
            window.addEventListener('focus', this.focusListener);
        }
    }

    private teardownFocusListener() {
        if (this.focusListener) {
            window.removeEventListener('focus', this.focusListener);
            this.focusListener = null;
        }
    }

    recenter() {
        if (this.isInline) return;
        this.modalEl.style.width = '820px';
        this.modalEl.style.height = '560px';
        this.modalEl.style.left = '50%';
        this.modalEl.style.top = '80px';
        this.modalEl.style.transform = 'none';
        this.fitAddon?.fit();
        requestAnimationFrame(() => this.captureBounds());
    }

    toggleFocusBackdrop(forceOn?: boolean) {
        if (this.isInline) return;

        const container = this.modalEl.parentElement;
        if (!container) return;

        const shouldBeOn = forceOn !== undefined ? forceOn : !this.focusBackdrop;

        if (!shouldBeOn) {
            if (this.focusBackdrop) {
                try { this.focusBackdrop.remove(); } catch (_) {}
                this.focusBackdrop = null;
            }
            this.plugin.backdropActive = false;
        } else {
            if (!this.focusBackdrop) {
                const backdrop = document.createElement('div');
                this.focusBackdrop = backdrop;
                backdrop.style.cssText = `
                    position: fixed;
                    inset: 0;
                    background: #0d0e10;
                    z-index: 34;
                    pointer-events: auto;
                `;

                this.modalEl.style.zIndex = '35';
                container.insertBefore(backdrop, this.modalEl);
            }
            this.plugin.backdropActive = true;
        }
    }

    // ── WebSocket ─────────────────────────────────────────────────────────

    private connectWS() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

        const token = this.plugin.serverToken || '';
        const ws = new WebSocket(`ws://127.0.0.1:${WS_PORT}?token=${token}`);
        this.ws = ws;

        ws.onopen = () => {
            this.wsReady = true;

            const spawnedKey = this.isInline ? '_termSpawned_pane' : '_termSpawned_float';
            const spawned = (this.plugin as any)[spawnedKey] as Set<string> | undefined;
            const alreadySpawned = spawned?.has(this.sessionId) ?? false;

            const cols = this.terminal && this.terminal.cols > 0 ? this.terminal.cols : 80;
            const rows = this.terminal && this.terminal.rows > 0 ? this.terminal.rows : 24;

            if (alreadySpawned) {
                ws.send(JSON.stringify({ type: 'attach', sessionId: this.sessionId }));
                
                const nudgeCols = cols > 80 ? cols - 1 : cols + 1;
                ws.send(JSON.stringify({ type: 'resize', sessionId: this.sessionId, cols: nudgeCols, rows }));
                
                if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = setTimeout(() => {
                    if (this.ws?.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'resize', sessionId: this.sessionId, cols, rows }));
                    }
                    this.reconnectTimeout = null;
                }, 50);
            } else {
                const cwd = this.plugin.settings.currentDir || this.plugin.getVaultPath() || os.homedir();
                ws.send(JSON.stringify({
                    type: 'spawn',
                    sessionId: this.sessionId,
                    cols,
                    rows,
                    cwd,
                }));
                if (!spawned) {
                    (this.plugin as any)[spawnedKey] = new Set([this.sessionId]);
                } else {
                    spawned.add(this.sessionId);
                }
            }

            while (this.inputQueue.length > 0) {
                const data = this.inputQueue.shift();
                if (data && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'input', sessionId: this.sessionId, data }));
                }
            }
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data as string);
                if (msg.type === 'output') {
                    this.terminal?.write(msg.data);
                } else if (msg.type === 'exit') {
                    this.terminal?.write('\r\n\x1b[1;33m[Process exited. Press any key to restart.]\x1b[0m\r\n');
                    const spawnedKey = this.isInline ? '_termSpawned_pane' : '_termSpawned_float';
                    const s = (this.plugin as any)[spawnedKey] as Set<string> | undefined;
                    s?.delete(this.sessionId);
                    this.isExited = true;
                } else if (msg.type === 'error') {
                    this.terminal?.write(`\r\n\x1b[1;31m[Error] ${msg.message}\x1b[0m\r\n`);
                    
                    if (msg.message === 'Session not found') {
                        const spawnedKey = this.isInline ? '_termSpawned_pane' : '_termSpawned_float';
                        const s = (this.plugin as any)[spawnedKey] as Set<string> | undefined;
                        s?.delete(this.sessionId);

                        this.terminal?.write('\x1b[1;33m[System] Spawning a new terminal session...\x1b[0m\r\n');
                        this.spawnNewSession();
                    }
                }
            } catch {}
        };

        ws.onerror = () => {
            this.wsReady = false;
        };

        ws.onclose = () => { 
            this.wsReady = false; 
            if (this.isOpen) {
                if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = setTimeout(() => {
                    if (this.isOpen && (!this.ws || this.ws.readyState === WebSocket.CLOSED)) {
                        this.connectWS();
                    }
                }, 2000);
            }
        };
    }

    private disconnectWS() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            try { this.ws.close(); } catch {}
            this.ws = null;
        }
        this.wsReady = false;
    }

    private sendInput(data: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'input', sessionId: this.sessionId, data }));
        } else {
            this.inputQueue.push(data);
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this.connectWS();
            }
        }
    }

    private sendResize(cols: number, rows: number) {
        if (cols <= 0 || rows <= 0) return;
        if (cols === this.lastCols && rows === this.lastRows) return;
        this.lastCols = cols;
        this.lastRows = rows;

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'resize', sessionId: this.sessionId, cols, rows }));
        }
    }

    private spawnNewSession() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.connectWS();
            return;
        }

        const cols = this.terminal && this.terminal.cols > 0 ? this.terminal.cols : 80;
        const rows = this.terminal && this.terminal.rows > 0 ? this.terminal.rows : 24;
        const cwd = this.plugin.settings.currentDir || this.plugin.getVaultPath() || os.homedir();

        const spawnedKey = this.isInline ? '_termSpawned_pane' : '_termSpawned_float';
        let spawned = (this.plugin as any)[spawnedKey] as Set<string> | undefined;
        if (!spawned) {
            spawned = new Set();
            (this.plugin as any)[spawnedKey] = spawned;
        }
        spawned.add(this.sessionId);

        this.ws.send(JSON.stringify({
            type: 'spawn',
            sessionId: this.sessionId,
            cols,
            rows,
            cwd,
        }));
    }

    // ── Keyboard interception ─────────────────────────────────────────────

    private setupKeyInterception() {
        if (!this.terminal) return;

        this.terminal.attachCustomKeyEventHandler((event: KeyboardEvent) => {
            if (event.metaKey) {
                return false; 
            }

            event.stopPropagation();

            if (event.key === 'Escape') {
                event.preventDefault();
            }

            return true;
        });
    }

    private teardownKeyInterception() {}

    // ── Floating UI ───────────────────────────────────────────────────────

    private buildFloatingUI() {
        const { modalEl, containerEl, contentEl } = this;

        modalEl.querySelector('.modal-close-button')?.remove();
        modalEl.querySelectorAll('.modal-title, .modal-header').forEach(el => el.remove());
        containerEl.querySelector('.modal-bg')?.remove();

        containerEl.style.pointerEvents = 'none';

        modalEl.style.position    = 'fixed';
        modalEl.style.borderRadius = '8px';
        modalEl.style.overflow    = 'hidden';
        modalEl.style.border      = '1px solid #444';
        modalEl.style.boxShadow   = '0 8px 40px rgba(0,0,0,0.6)';
        modalEl.style.padding     = '0';
        modalEl.style.pointerEvents = 'auto';

        const settings = this.plugin.settings;
        let width  = parseInt(settings.width)  || 820;
        let height = parseInt(settings.height) || 560;
        if (width  > window.innerWidth)  width  = window.innerWidth  - 40;
        if (height > window.innerHeight) height = window.innerHeight - 40;
        modalEl.style.width  = `${width}px`;
        modalEl.style.height = `${height}px`;

        const left = settings.left ? parseInt(settings.left) : null;
        const top  = settings.top  ? parseInt(settings.top)  : null;

        if (left !== null && !isNaN(left) && top !== null && !isNaN(top)) {
            const safeLeft = Math.max(10, Math.min(left, window.innerWidth  - width  - 10));
            const safeTop  = Math.max(10, Math.min(top,  window.innerHeight - height - 10));
            modalEl.style.left      = `${safeLeft}px`;
            modalEl.style.top       = `${safeTop}px`;
            modalEl.style.transform = 'none';
        } else {
            modalEl.style.left      = '50%';
            modalEl.style.top       = '80px';
            modalEl.style.transform = 'translateX(-50%)';
        }

        contentEl.style.cssText = 'display:flex; flex-direction:column; width:100%; height:100%; overflow:hidden; padding:0; margin:0; box-sizing:border-box;';
        contentEl.empty();

        const titleBar = this.buildTitleBar(contentEl, false);
        this.makeDraggable(titleBar, modalEl);
        this.setupResizers(modalEl);

        const xtermWrap = contentEl.createEl('div');
        xtermWrap.style.cssText = 'flex:1; overflow:hidden; padding:4px; min-height:0; box-sizing:border-box;';

        requestAnimationFrame(() => {
            this.initXterm(xtermWrap, () => {
                this.captureBounds();
                this.connectWS();
            });
            if (this.plugin.backdropActive) {
                this.toggleFocusBackdrop(true);
            }
        });
    }

    // ── Inline (pane) UI ──────────────────────────────────────────────────

    private buildInlineUI(container: HTMLElement) {
        this.persistentPaneEl = document.createElement('div');
        this.persistentPaneEl.style.cssText = 'display:flex; flex-direction:column; width:100%; height:100%; overflow:hidden; padding:0; margin:0; background:#1a1a1a; box-sizing:border-box;';
        container.appendChild(this.persistentPaneEl);

        this.buildTitleBar(this.persistentPaneEl, true);

        const xtermWrap = this.persistentPaneEl.createEl('div');
        xtermWrap.style.cssText = 'flex:1; overflow:hidden; padding:4px; min-height:0; box-sizing:border-box;';
        this.xtermWrapEl = xtermWrap;

        const bottomSpacerHeight = '20px'; 
        const spacer = this.persistentPaneEl.createEl('div');
        spacer.style.cssText = `height:${bottomSpacerHeight}; flex-shrink:0; background:transparent; pointer-events:none;`;

        requestAnimationFrame(() => {
            this.initXterm(xtermWrap, () => {
                this.connectWS();
            });
        });
    }

    // ── Shared title bar ──────────────────────────────────────────────────

    private buildTitleBar(parent: HTMLElement, isPaneMode: boolean): HTMLElement {
        const bar = parent.createEl('div');
        bar.style.cssText = `
            display:flex; align-items:center; justify-content:space-between;
            padding:6px 12px; background:#252525;
            cursor:${isPaneMode ? 'default' : 'move'};
            border-bottom:1px solid #333; flex-shrink:0; user-select:none; box-sizing:border-box;
        `;

        bar.createEl('span', {
            text: '⚡ Terminal',
            attr: { style: 'color:#ccc; font-size:13px; font-family:monospace;' },
        });

        const controls = bar.createEl('div', { attr: { style: 'display:flex; gap:6px; align-items:center;' } });

        if (!isPaneMode) {
            const closeBtn = controls.createEl('button', { text: '✕' });
            closeBtn.style.cssText = 'background:transparent; border:none; color:#888; cursor:pointer; font-size:16px; padding:0 4px; line-height:1;';
            closeBtn.addEventListener('mousedown', e => e.stopPropagation());
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
            });
        }

        return bar;
    }

    // ── xterm.js ──────────────────────────────────────────────────────────

    private initXterm(container: HTMLElement, onReady?: () => void) {
        this.terminal = new Terminal({
            theme: {
                background: '#1a1a1a',
                foreground: '#e0e0e0',
                cursor: '#39ff14',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 13,
            lineHeight: 1.1,
            scrollback: 10000,
            allowProposedApi: true,
        });

        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(container);

        container.addEventListener('mousedown', () => {
            this.terminal?.focus();
        });

        this.setupKeyInterception();

        requestAnimationFrame(() => {
            try {
                this.fitAddon?.fit();
            } catch (e) {
                console.error('[terminal] fit failed during layout:', e);
            }
            this.terminal?.focus();
            if (onReady) onReady();
        });

        this.terminal.onData((data: string) => {
            if (this.isExited) {
                this.isExited = false;
                this.terminal?.reset();
                this.spawnNewSession();
            } else {
                this.sendInput(data);
            }
        });

        this.terminal.onResize(({ cols, rows }) => this.sendResize(cols, rows));

        this.resizeObserver = new ResizeObserver(() => {
            if (this.observerTimeout) {
                clearTimeout(this.observerTimeout);
            }
            this.observerTimeout = setTimeout(() => {
                try {
                    this.fitAddon?.fit();
                } catch (e) {
                    console.error('[terminal] fit failed on resize:', e);
                }
                this.observerTimeout = null;
            }, 80);
        });
        this.resizeObserver.observe(container);
    }

    // ── Bounds / drag / resize ────────────────────────────────────────────

    private captureBounds() {
        const rect = this.modalEl.getBoundingClientRect();
        this.currentBounds = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }

    private saveWindowBounds() {
        if (this.isInline) return;
        const { left, top, width, height } = this.currentBounds;
        this.plugin.settings.width  = `${width}px`;
        this.plugin.settings.height = `${height}px`;
        this.plugin.settings.left   = `${left}px`;
        this.plugin.settings.top    = `${top}px`;
        this.plugin.saveSettings();
    }

    private makeDraggable(handle: HTMLElement, target: HTMLElement) {
        handle.addEventListener('mousedown', (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('button, select')) return;

            const rect = target.getBoundingClientRect();
            this.dragState = {
                dragging: true,
                startX: e.clientX, startY: e.clientY,
                origLeft: rect.left, origTop: rect.top,
            };
            target.style.transform = 'none';
            target.style.left = `${rect.left}px`;
            target.style.top  = `${rect.top}px`;
            this.showOverlay('move');

            const onMove = (ev: MouseEvent) => {
                if (!this.dragState.dragging) return;
                const newLeft = this.dragState.origLeft + ev.clientX - this.dragState.startX;
                const newTop  = this.dragState.origTop  + ev.clientY - this.dragState.startY;
                target.style.left = `${newLeft}px`;
                target.style.top  = `${newTop}px`;
                this.currentBounds.left = newLeft;
                this.currentBounds.top  = newTop;
            };
            const onUp = () => {
                try {
                    this.dragState.dragging = false;
                    this.removeOverlay();
                } catch (err) {
                    console.error('[terminal] Error during drag teardown:', err);
                } finally {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                }
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    private setupResizers(modalEl: HTMLElement) {
        const handles = [
            { side: 'n',  cursor: 'ns-resize',   css: 'top:-3px;left:6px;right:6px;height:6px;' },
            { side: 's',  cursor: 'ns-resize',   css: 'bottom:-3px;left:6px;right:6px;height:6px;' },
            { side: 'e',  cursor: 'ew-resize',   css: 'right:-3px;top:6px;bottom:6px;width:6px;' },
            { side: 'w',  cursor: 'ew-resize',   css: 'left:-3px;top:6px;bottom:6px;width:6px;' },
            { side: 'nw', cursor: 'nwse-resize', css: 'top:-3px;left:-3px;width:10px;height:10px;' },
            { side: 'ne', cursor: 'nesw-resize', css: 'top:-3px;right:-3px;width:10px;height:10px;' },
            { side: 'sw', cursor: 'nesw-resize', css: 'bottom:-3px;left:-3px;width:10px;height:10px;' },
            { side: 'se', cursor: 'nwse-resize', css: 'bottom:-3px;right:-3px;width:10px;height:10px;' },
        ];

        handles.forEach(({ side, cursor, css }) => {
            const h = modalEl.createEl('div');
            h.style.cssText = `${css}position:absolute;cursor:${cursor};z-index:10000;background:transparent;`;

            h.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = modalEl.getBoundingClientRect();
                const startX = e.clientX, startY = e.clientY;
                this.showOverlay(cursor);

                const onMove = (ev: MouseEvent) => {
                    const dx = ev.clientX - startX;
                    const dy = ev.clientY - startY;
                    let width = rect.width;
                    let height = rect.height;
                    let left = rect.left;
                    let top = rect.top;

                    if (side.includes('e')) {
                        width = Math.max(300, rect.width + dx);
                    }
                    if (side.includes('w')) {
                        width = Math.max(300, rect.width - dx);
                        left = rect.left + (rect.width - width);
                    }
                    if (side.includes('s')) {
                        height = Math.max(200, rect.height + dy);
                    }
                    if (side.includes('n')) {
                        height = Math.max(200, rect.height - dy);
                        top = rect.top + (rect.height - height);
                    }

                    modalEl.style.width  = `${width}px`;
                    modalEl.style.height = `${height}px`;
                    modalEl.style.left   = `${left}px`;
                    modalEl.style.top    = `${top}px`;
                    modalEl.style.transform = 'none';
                    this.currentBounds = { left, top, width, height };

                    if (!this.resizeThrottleTimer) {
                        this.resizeThrottleTimer = setTimeout(() => {
                            this.resizeThrottleTimer = null;
                            try {
                                this.fitAddon?.fit();
                            } catch {}
                        }, 80);
                    }
                };

                const onUp = () => {
                    try {
                        if (this.resizeThrottleTimer) {
                            clearTimeout(this.resizeThrottleTimer);
                            this.resizeThrottleTimer = null;
                        }
                        this.removeOverlay();
                        this.fitAddon?.fit();
                    } catch (err) {
                        console.error('[terminal] Error during resize teardown:', err);
                    } finally {
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                    }
                };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });
        });
    }

    private showOverlay(cursor: string) {
        if (this.dragOverlay) return;
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;inset:0;z-index:999999;background:transparent;cursor:${cursor};pointer-events:auto;`;
        document.body.appendChild(overlay);
        this.dragOverlay = overlay;
        document.querySelectorAll('webview').forEach(wv => {
            if (wv instanceof HTMLElement) wv.style.pointerEvents = 'none';
        });
    }

    private removeOverlay() {
        if (!this.dragOverlay) return;
        document.querySelectorAll('webview').forEach(wv => {
            if (wv instanceof HTMLElement) wv.style.pointerEvents = '';
        });
        this.dragOverlay.remove();
        this.dragOverlay = null;
    }

    private getShellPath(): string {
        const current = process.env.PATH || '';
        if (os.platform() !== 'darwin') return current;
        try {
            const p = execSync('/bin/zsh -lc "echo $PATH"', { encoding: 'utf8', timeout: 1000 }).trim();
            if (p) return p;
        } catch {}
        return `/opt/homebrew/bin:/usr/local/bin:${current}`;
    }
}