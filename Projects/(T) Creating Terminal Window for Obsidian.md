---
status: done
tags:
  - task
---
## Guide
- Use the `edit` command to modify a file such as a script
- `pbcopy < filename.txt`
	- This copies the text within a document to your clipboard.
- `ls -l` command: The standard way to see a file's last modified time (mtime) in a long list format.
	- So `ls -l sample.txt`
## Stabe V1

### TerminalModal
```ts
import { App, Modal } from 'obsidian';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { spawn, execSync, ChildProcess } from 'child_process';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import CustomTerminalPlugin from './main';

interface AutocompleteState {
    originalInput: string;
    matches: string[];
    index: number;
    startIdx: number;
    isQuoted: boolean;
    quoteChar: string;
    pathPrefix: string;
}

export class TerminalModal extends Modal {
    isOpen = false;
    private activeProcess: ChildProcess | null = null;
    private terminal: Terminal | null = null;
    private fitAddon: FitAddon | null = null;
    private currentDir: string;
    private inputBuffer = '';
    private dragState = { dragging: false, startX: 0, startY: 0, origLeft: 0, origTop: 0 };
    private resizeObserver: ResizeObserver | null = null;
    private dragOverlay: HTMLDivElement | null = null;

    // Tracks the modal's last known on-screen bounds. Obsidian detaches
    // modalEl from the DOM before onClose() fires, so getBoundingClientRect()
    // inside onClose() always returns zeros. We track bounds live instead
    // (on drag, on resize, on initial paint) so onClose() has real numbers to save.
    private currentBounds = { left: 0, top: 0, width: 0, height: 0 };

    // References to alternate UI panels
    private xtermContainer: HTMLDivElement | null = null;
    private editorContainer: HTMLDivElement | null = null;
    private bookmarkSelect: HTMLSelectElement | null = null;
    
    // Command history variables
    private commandHistory: string[] = [];
    private historyIndex = 0;
    private tempInput = '';

    // Cached system environment path
    private resolvedPath: string;

    // Autocomplete cycling state
    private autocompleteState: AutocompleteState | null = null;

    constructor(app: App, private plugin: CustomTerminalPlugin) {
        super(app);
        
        const adapter = this.app.vault.adapter as any;
        const vaultPath = typeof adapter.getBasePath === 'function' ? adapter.getBasePath() as string : '';
        
        // Restore last active working directory landmark, defaulting to the Vault path
        this.currentDir = this.plugin.settings.currentDir || vaultPath || os.homedir();
        
        this.resolvedPath = this.getShellPath();
        
        // Load persisted command history
        this.commandHistory = [...(this.plugin.settings.commandHistory || [])];
        this.historyIndex = this.commandHistory.length;
    }

    onOpen() {
        this.isOpen = true;
        this.buildUI();

        // Release Obsidian's global keyboard interceptor scope.
        // This stops the modal from consuming hotkeys, giving you 100% control over background commands (like Cmd+P)
        if (this.scope) {
            this.app.keymap.popScope(this.scope);
        }
    }

    onClose() {
        this.isOpen = false;
        this.saveWindowBounds();
        
        // Cleanly clear the plugin reference on close to allow deterministic toggle toggles
        if (this.plugin.modal === this) {
            this.plugin.modal = null;
        }

        this.destroy();
    }

    destroy() {
        this.removeOverlay();
        if (this.activeProcess) {
            try {
                this.activeProcess.kill('SIGKILL');
            } catch (e) {}
            this.activeProcess = null;
        }
        this.terminal?.dispose();
        this.resizeObserver?.disconnect();
        this.terminal = null;
    }

    /**
     * Snapshots modalEl's current on-screen position/size into currentBounds.
     * Must only be called while modalEl is still attached to the DOM
     * (i.e. not from onClose, where Obsidian has already detached it).
     */
    private captureBounds() {
        const rect = this.modalEl.getBoundingClientRect();
        this.currentBounds = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }

    /**
     * Resolves the real system PATH on macOS/Linux by querying the login shell,
     * ensuring node, npm, git, Homebrew, and environment managers (NVM) are discovered.
     */
    private getShellPath(): string {
        const currentPath = process.env.PATH || '';
        if (os.platform() !== 'darwin') {
            return currentPath;
        }

        try {
            // Execute zsh as a login shell once to read all user profile paths (.zprofile, .zshrc)
            const shellPath = execSync('/bin/zsh -lc "echo \\$PATH"', { 
                encoding: 'utf8', 
                timeout: 1000 
            }).trim();
            
            if (shellPath) return shellPath;
        } catch (e) {
            // Fallback to manual path resolution if shell invocation fails
        }

        // Standard fallback including Apple Silicon Homebrew and Intel Homebrew paths
        return `/opt/homebrew/bin:/usr/local/bin:${currentPath}`;
    }

    /**
     * Saves the final dimensions, position coordinates, and working directory to settings.
     */
    private saveWindowBounds() {
        // Use the live-tracked bounds rather than querying modalEl directly:
        // by the time onClose() runs, Obsidian has already detached modalEl
        // from the DOM, so getBoundingClientRect() would return all zeros here.
        const { left, top, width, height } = this.currentBounds;
        this.plugin.settings.width = `${width}px`;
        this.plugin.settings.height = `${height}px`;
        this.plugin.settings.left = `${left}px`;
        this.plugin.settings.top = `${top}px`;
        this.plugin.settings.currentDir = this.currentDir; // Save directory location
        this.plugin.saveSettings();
    }

    /**
     * Center the window on command trigger
     */
    recenter() {
        this.modalEl.style.width = '820px';
        this.modalEl.style.height = '560px';
        this.modalEl.style.left = '50%';
        this.modalEl.style.top = '80px';
        this.modalEl.style.transform = 'translateX(-50%)';
        this.fitAddon?.fit();
        // 50%/transform positioning can't be read back as plain left/top until
        // layout settles, so snapshot the resolved rect on the next frame.
        requestAnimationFrame(() => this.captureBounds());
    }

    private buildUI() {
        const { modalEl, contentEl, containerEl } = this;

        // Clear Obsidian's standard modal header and padding spacing to avoid empty areas
        modalEl.querySelector('.modal-close-button')?.remove();
        modalEl.querySelectorAll('.modal-title').forEach(el => el.remove());
        modalEl.querySelectorAll('.modal-header').forEach(el => el.remove());

        // HIDE THE BACKDROP: removes the dark blocker overlay entirely
        containerEl.querySelector('.modal-bg')?.remove();

        // CLICK-THROUGH HOOK: container allows click-through, but modal captures interaction
        containerEl.style.display = 'block';
        containerEl.style.pointerEvents = 'none';
        modalEl.style.pointerEvents = 'auto';

        // Restore window sizes and locations from stored settings
        const settings = this.plugin.settings;
        modalEl.style.position = 'fixed';
        modalEl.style.borderRadius = '8px';
        modalEl.style.overflow = 'hidden';
        modalEl.style.border = '1px solid #444';
        modalEl.style.boxShadow = '0 8px 40px rgba(0,0,0,0.6)';
        modalEl.style.padding = '0';

        // Parse and constrain saved width/height settings to current viewport dimensions
        let width = parseInt(settings.width) || 820;
        let height = parseInt(settings.height) || 560;
        if (width > window.innerWidth) width = window.innerWidth - 40;
        if (height > window.innerHeight) height = window.innerHeight - 40;

        modalEl.style.width = `${width}px`;
        modalEl.style.height = `${height}px`;

        let left = settings.left ? parseInt(settings.left) : null;
        let top = settings.top ? parseInt(settings.top) : null;

        // Viewport safe-boundary constraint algorithm to prevent off-screen spawns
        if (left !== null && !isNaN(left) && top !== null && !isNaN(top)) {
            if (left < 0) left = 10;
            if (left + width > window.innerWidth) {
                left = window.innerWidth - width - 10;
            }
            if (top < 0) top = 10;
            if (top + height > window.innerHeight) {
                top = window.innerHeight - height - 10;
            }

            modalEl.style.left = `${left}px`;
            modalEl.style.top = `${top}px`;
            modalEl.style.transform = 'none';
        } else {
            // Default center positioning
            modalEl.style.left = '50%';
            modalEl.style.top = '80px';
            modalEl.style.transform = 'translateX(-50%)';
        }

        // Force full scale layout area on contentEl
        contentEl.style.cssText = `
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 0;
            margin: 0;
        `;
        contentEl.empty();

        // --- Title bar ---
        const titleBar = contentEl.createEl('div');
        titleBar.style.cssText = `
            display: flex; align-items: center; justify-content: space-between;
            padding: 6px 12px; background: #252525; cursor: move;
            border-bottom: 1px solid #333; flex-shrink: 0; user-select: none;
        `;
        titleBar.createEl('span', {
            text: '⚡ Dev Terminal',
            attr: { style: 'color:#ccc; font-size:13px; font-family:monospace;' }
        });

        const shortcuts = titleBar.createEl('div', { attr: { style: 'display:flex; gap:6px; align-items:center;' } });
        const adapter = this.app.vault.adapter as any;
        const vaultPath = typeof adapter.getBasePath === 'function' ? adapter.getBasePath() as string : '';
        
        // Bookmarks select dropdown menu
        this.bookmarkSelect = shortcuts.createEl('select');
        this.bookmarkSelect.style.cssText = 'font-size:11px; background:#333; color:#ccc; border:1px solid #555; border-radius:3px; padding:2px; cursor:pointer; outline:none;';
        this.updateBookmarksDropdown();
        this.bookmarkSelect.addEventListener('change', () => {
            if (this.bookmarkSelect) {
                const dir = this.bookmarkSelect.value;
                if (dir) {
                    this.cdAndRun(dir);
                }
                this.bookmarkSelect.value = '📂 Bookmarks';
            }
        });
        // Prevent mousedown from triggering dragging on the parent bar
        this.bookmarkSelect.addEventListener('mousedown', (e) => e.stopPropagation());

        // Documentation Button
        const docBtn = shortcuts.createEl('button', { text: '❓ Help' });
        docBtn.style.cssText = 'font-size:11px; padding:2px 7px; cursor:pointer; background:#333; color:#a2a9b0; border:1px solid #555; border-radius:3px;';
        docBtn.addEventListener('click', () => {
            this.openHelp();
        });
        // Prevent mousedown from triggering dragging on the parent bar
        docBtn.addEventListener('mousedown', (e) => e.stopPropagation());

        const reloadBtn = shortcuts.createEl('button', { text: '🔄 Reload Plugin' });
        reloadBtn.style.cssText = 'font-size:11px; padding:2px 7px; cursor:pointer; background:#2a3a2a; color:#7fc97f; border:1px solid #4a6a4a; border-radius:3px;';
        reloadBtn.addEventListener('click', () => {
            const plugins = (this.app as any).plugins;
            const id = 'my-custom-terminal';
            plugins.__terminalReopenAfterReload = true;
            plugins.disablePlugin(id).then(() => plugins.enablePlugin(id));
        });
        // Prevent mousedown from triggering dragging on the parent bar
        reloadBtn.addEventListener('mousedown', (e) => e.stopPropagation());

        const closeBtn = titleBar.createEl('button', { text: '✕' });
        closeBtn.style.cssText = 'background:transparent; border:none; color:#888; cursor:pointer; font-size:16px; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.close());
        // Prevent mousedown from triggering dragging on the parent bar
        closeBtn.addEventListener('mousedown', (e) => e.stopPropagation());

        this.makeDraggable(titleBar, modalEl);
        this.setupResizers();

        // --- Terminal area ---
        this.xtermContainer = contentEl.createEl('div');
        this.xtermContainer.style.cssText = 'flex:1; overflow:hidden; padding:4px; min-height:0;';

        requestAnimationFrame(() => {
            if (this.xtermContainer) {
                this.initXterm(this.xtermContainer);
            }
            // Snapshot wherever the modal actually landed (restored position,
            // viewport-clamped position, or the default center) now that layout
            // has settled, so we have a valid bounds fallback even if the user
            // never drags or resizes before closing.
            this.captureBounds();
        });
    }

    private updateBookmarksDropdown() {
        if (!this.bookmarkSelect) return;
        this.bookmarkSelect.empty();
        const placeholder = this.bookmarkSelect.createEl('option', { text: '📂 Bookmarks' });
        placeholder.disabled = true;
        placeholder.selected = true;

        const bookmarks = this.plugin.settings.bookmarks || {};
        for (const [name, dir] of Object.entries(bookmarks)) {
            this.bookmarkSelect.createEl('option', { text: name, value: dir });
        }
    }

    /**
     * Injects a full-screen mouse-capture block and disables interactions 
     * with webviews to prevent mouse event loss.
     */
    private showOverlay(cursor: string) {
        if (this.dragOverlay) return;
        
        const doc = this.containerEl.ownerDocument || document;
        const overlay = doc.createElement('div');
        overlay.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor}; pointer-events: auto;`;
        doc.body.appendChild(overlay);
        this.dragOverlay = overlay;

        doc.querySelectorAll('webview').forEach((wv) => {
            if (wv instanceof HTMLElement) {
                wv.style.pointerEvents = 'none';
            }
        });
    }

    /**
     * Clears the capture overlay and restores normal mouse interactions for webviews.
     */
    private removeOverlay() {
        if (this.dragOverlay) {
            const doc = this.dragOverlay.ownerDocument || document;
            doc.querySelectorAll('webview').forEach((wv) => {
                if (wv instanceof HTMLElement) {
                    wv.style.pointerEvents = '';
                }
            });
            this.dragOverlay.remove();
            this.dragOverlay = null;
        }
    }

    private setupResizers() {
        const { modalEl } = this;
        const resizers = [
            { side: 'n',  cursor: 'ns-resize', css: 'top: -3px; left: 6px; right: 6px; height: 6px;' },
            { side: 's',  cursor: 'ns-resize', css: 'bottom: -3px; left: 6px; right: 6px; height: 6px;' },
            { side: 'e',  cursor: 'ew-resize', css: 'right: -3px; top: 6px; bottom: 6px; width: 6px;' },
            { side: 'w',  cursor: 'ew-resize', css: 'left: -3px; top: 6px; bottom: 6px; width: 6px;' },
            { side: 'nw', cursor: 'nwse-resize', css: 'top: -3px; left: -3px; width: 10px; height: 10px;' },
            { side: 'ne', cursor: 'nesw-resize', css: 'top: -3px; right: -3px; width: 10px; height: 10px;' },
            { side: 'sw', cursor: 'nesw-resize', css: 'bottom: -3px; left: -3px; width: 10px; height: 10px;' },
            { side: 'se', cursor: 'nwse-resize', css: 'bottom: -3px; right: -3px; width: 10px; height: 10px;' },
        ];

        resizers.forEach(({ side, cursor, css }) => {
            const handle = modalEl.createEl('div');
            handle.style.cssText = css + `position: absolute; cursor: ${cursor}; z-index: 10000; background: transparent;`;

            handle.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = modalEl.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;

                this.showOverlay(cursor);

                const onMouseMove = (moveEvent: MouseEvent) => {
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;

                    let newWidth = rect.width;
                    let newHeight = rect.height;
                    let newLeft = rect.left;
                    let newTop = rect.top;

                    if (side.includes('e')) {
                        newWidth = Math.max(300, rect.width + dx);
                    }
                    if (side.includes('w')) {
                        const potentialWidth = rect.width - dx;
                        if (potentialWidth >= 300) {
                            newWidth = potentialWidth;
                            newLeft = rect.left + dx;
                        }
                    }
                    if (side.includes('s')) {
                        newHeight = Math.max(200, rect.height + dy);
                    }
                    if (side.includes('n')) {
                        const potentialHeight = rect.height - dy;
                        if (potentialHeight >= 200) {
                            newHeight = potentialHeight;
                            newTop = rect.top + dy;
                        }
                    }

                    modalEl.style.width = `${newWidth}px`;
                    modalEl.style.height = `${newHeight}px`;
                    modalEl.style.left = `${newLeft}px`;
                    modalEl.style.top = `${newTop}px`;
                    modalEl.style.transform = 'none';

                    this.currentBounds = { left: newLeft, top: newTop, width: newWidth, height: newHeight };

                    this.fitAddon?.fit();
                };

                const onMouseUp = () => {
                    this.removeOverlay();
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });
    }

    private initXterm(container: HTMLElement) {
        this.terminal = new Terminal({
            theme: {
                background: '#1a1a1a',
                foreground: '#e0e0e0',
                cursor: '#39ff14',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 13,
            scrollback: 5000,
            convertEol: true,
            scrollOnEraseInDisplay: true, // Pushes erased viewport contents into scrollback
        });

        this.fitAddon = new FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(container);

        requestAnimationFrame(() => {
            this.fitAddon?.fit();
            this.printPrompt();
        });

        this.resizeObserver = new ResizeObserver(() => {
            this.fitAddon?.fit();
        });
        this.resizeObserver.observe(container);

        this.terminal.onData((data: string) => {
            if (this.activeProcess) {
                // Ctrl+C signals
                if (data === '\x03') { 
                    this.terminal?.write('^C\r\n');
                    this.activeProcess.kill('SIGINT');
                    if (os.platform() === 'win32') {
                        this.activeProcess.kill();
                    }
                } else if (this.activeProcess.stdin && this.activeProcess.stdin.writable) {
                    // Send keyboard input to running program standard input stream
                    this.activeProcess.stdin.write(data);
                }
                return;
            }

            // Command History Navigation: Up Arrow
            if (data === '\x1b[A') {
                if (this.commandHistory.length === 0) return;
                if (this.historyIndex === this.commandHistory.length) {
                    this.tempInput = this.inputBuffer;
                }
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    const oldLength = this.inputBuffer.length;
                    this.inputBuffer = this.commandHistory[this.historyIndex] || '';
                    this.clearCurrentLine(oldLength);
                    this.terminal?.write(this.inputBuffer);
                }
                return;
            }

            // Command History Navigation: Down Arrow
            if (data === '\x1b[B') {
                if (this.historyIndex < this.commandHistory.length) {
                    this.historyIndex++;
                    const oldLength = this.inputBuffer.length;
                    if (this.historyIndex === this.commandHistory.length) {
                        this.inputBuffer = this.tempInput;
                    } else {
                        this.inputBuffer = this.commandHistory[this.historyIndex] || '';
                    }
                    this.clearCurrentLine(oldLength);
                    this.terminal?.write(this.inputBuffer);
                }
                return;
            }

            // Shift + Tab Key (Backwards Autocomplete Iteration)
            if (data === '\x1b[Z') {
                this.handleAutocomplete(true);
                return;
            }

            // Standard Tab Key (Forwards Autocomplete Iteration)
            if (data === '\t' || data === '\x09') {
                this.handleAutocomplete(false);
                return;
            }

            // Reset autocomplete cycling state for any other input sequence
            this.autocompleteState = null;

            // Ignore system escape characters (like raw arrow key outputs)
            if (data.startsWith('\x1b')) {
                return;
            }

            for (const char of data) {
                if (char === '\r' || char === '\n') {
                    const cmd = this.inputBuffer;
                    this.inputBuffer = '';
                    this.runCommand(cmd);
                    break;
                } else if (char === '\x7f' || char === '\x08') { // Backspace
                    if (this.inputBuffer.length > 0) {
                        this.inputBuffer = this.inputBuffer.slice(0, -1);
                        this.terminal?.write('\b \b');
                    }
                } else if (char === '\x03') { // Ctrl+C
                    this.terminal?.write('^C\r\n');
                    this.inputBuffer = '';
                    this.printPrompt();
                } else if (char === '\x15') { // Ctrl+U (Clear entire line)
                    const oldLength = this.inputBuffer.length;
                    this.inputBuffer = '';
                    this.clearCurrentLine(oldLength);
                } else if (char === '\x17') { // Ctrl+W (Delete last word)
                    const oldLength = this.inputBuffer.length;
                    const trimmed = this.inputBuffer.trimEnd();
                    const lastSpaceIndex = trimmed.lastIndexOf(' ');
                    if (lastSpaceIndex === -1) {
                        this.inputBuffer = '';
                    } else {
                        this.inputBuffer = trimmed.substring(0, lastSpaceIndex + 1);
                    }
                    this.clearCurrentLine(oldLength);
                    this.terminal?.write(this.inputBuffer);
                } else if (char === '\x0c') { // Ctrl+L (Soft clear screen)
                    this.terminal?.write('\x1b[H\x1b[2J');
                    this.printPromptRaw();
                    this.terminal?.write(this.inputBuffer);
                } else if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127) {
                    this.inputBuffer += char;
                    this.terminal?.write(char);
                }
            }
        });
    }

    private clearCurrentLine(oldInputLength: number) {
        const cols = this.terminal?.cols || 80;
        const displayDir = this.currentDir.replace(os.homedir(), '~');
        // Visual prompt length is displayDir.length + 3 (for " $ ")
        const promptLength = displayDir.length + 3;
        const totalLength = promptLength + oldInputLength;
        
        // Calculate how many times the input layout has wrapped onto a new line
        const numRowsUp = Math.max(0, Math.floor((totalLength - 1) / cols));

        const moveUpSequence = numRowsUp > 0 ? `\x1b[${numRowsUp}A` : '';
        
        // \r moves cursor to column 0
        // Move up by the wrapped row count, then clear everything to the bottom of the screen (\x1b[J)
        this.terminal?.write(`\r${moveUpSequence}\x1b[J`);
        this.printPromptRaw();
    }

    /**
     * Parses the current input string to determine where the last path segment starts.
     * Keeps track of whether it resides inside unclosed single or double quotes.
     */
    private getLastToken(input: string): { text: string; startIdx: number; isQuoted: boolean; quoteChar: string } {
        let inDoubleQuote = false;
        let inSingleQuote = false;
        let lastTokenStart = 0;

        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char === '"' && !inSingleQuote) {
                if (inDoubleQuote) {
                    inDoubleQuote = false;
                } else {
                    inDoubleQuote = true;
                    lastTokenStart = i;
                }
            } else if (char === "'" && !inDoubleQuote) {
                if (inSingleQuote) {
                    inSingleQuote = false;
                } else {
                    inSingleQuote = true;
                    lastTokenStart = i;
                }
            } else if (char === ' ' && !inDoubleQuote && !inSingleQuote) {
                lastTokenStart = i + 1;
            }
        }

        let text = input.substring(lastTokenStart);
        let isQuoted = false;
        let quoteChar = '';
        if (text.startsWith('"')) {
            isQuoted = true;
            quoteChar = '"';
            text = text.substring(1);
        } else if (text.startsWith("'")) {
            isQuoted = true;
            quoteChar = "'";
            text = text.substring(1);
        }

        return { text, startIdx: lastTokenStart, isQuoted, quoteChar };
    }

    /**
     * Finds directory folders and file elements matching the partial target path,
     * maintaining quotes, trailing slash appends, and allowing cycling on subsequent Tab inputs.
     */
    private handleAutocomplete(backwards: boolean) {
        if (this.autocompleteState) {
            const state = this.autocompleteState;
            if (state.matches.length === 0) return;

            if (backwards) {
                state.index = (state.index - 1 + state.matches.length) % state.matches.length;
            } else {
                state.index = (state.index + 1) % state.matches.length;
            }
            this.applyAutocompleteMatch();
            return;
        }

        const parsed = this.getLastToken(this.inputBuffer);
        const text = parsed.text;
        const startIdx = parsed.startIdx;
        const isQuoted = parsed.isQuoted;
        const quoteChar = parsed.quoteChar;

        let searchDir = this.currentDir;
        let filePrefix = text;
        let pathPrefix = '';

        const lastSlash = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'));
        if (lastSlash !== -1) {
            pathPrefix = text.substring(0, lastSlash + 1);
            filePrefix = text.substring(lastSlash + 1);

            let resolvedPathPart = pathPrefix;
            if (pathPrefix.startsWith('~')) {
                resolvedPathPart = path.join(os.homedir(), pathPrefix.slice(1));
            } else {
                resolvedPathPart = path.resolve(this.currentDir, pathPrefix);
            }
            searchDir = resolvedPathPart;
        } else if (text.startsWith('~')) {
            searchDir = os.homedir();
            filePrefix = text.slice(1);
            pathPrefix = '~';
        }

        let matches: string[] = [];
        try {
            if (fs.existsSync(searchDir)) {
                const files = fs.readdirSync(searchDir);
                const rawMatches = files.filter(f => f.toLowerCase().startsWith(filePrefix.toLowerCase()));
                rawMatches.sort();

                matches = rawMatches.map(f => {
                    try {
                        const fullPath = path.join(searchDir, f);
                        const stat = fs.statSync(fullPath);
                        if (stat.isDirectory()) {
                            return f + (os.platform() === 'win32' ? '\\' : '/');
                        }
                    } catch (e) {}
                    return f;
                });
            }
        } catch (e) {}

        if (matches.length === 0) {
            return;
        }

        this.autocompleteState = {
            originalInput: this.inputBuffer,
            matches,
            index: backwards ? matches.length - 1 : 0, // Cycle from the back if Shift + Tab is pressed first
            startIdx,
            isQuoted,
            quoteChar,
            pathPrefix
        };

        this.applyAutocompleteMatch();
    }

    /**
     * Translates the active autocomplete state to a string, rewriting
     * quotes as needed and outputting the update onto the terminal line.
     */
    private applyAutocompleteMatch() {
        if (!this.autocompleteState) return;
        const state = this.autocompleteState;
        const match = state.matches[state.index];
        if (!match) return;

        let replacement = state.pathPrefix + match;
        if (replacement.includes(' ')) {
            if (!state.isQuoted) {
                replacement = `"${replacement}"`;
            } else {
                replacement = state.quoteChar + replacement;
                if (!replacement.endsWith('/') && !replacement.endsWith('\\')) {
                    replacement += state.quoteChar;
                }
            }
        } else {
            if (state.isQuoted) {
                replacement = state.quoteChar + replacement;
                if (!replacement.endsWith('/') && !replacement.endsWith('\\')) {
                    replacement += state.quoteChar;
                }
            }
        }

        const prefix = state.originalInput.substring(0, state.startIdx);
        const oldLength = this.inputBuffer.length;
        this.inputBuffer = prefix + replacement;

        this.clearCurrentLine(oldLength);
        this.terminal?.write(this.inputBuffer);
    }

    private async runCommand(cmdLine: string) {
        cmdLine = cmdLine.trim();
        if (!cmdLine) {
            this.printPrompt();
            return;
        }

        // Add to historical buffer if unique
        if (this.commandHistory.length === 0 || this.commandHistory[this.commandHistory.length - 1] !== cmdLine) {
            this.commandHistory.push(cmdLine);
            if (this.commandHistory.length > 100) this.commandHistory.shift();
            this.plugin.settings.commandHistory = [...this.commandHistory];
            this.plugin.saveSettings();
        }
        this.historyIndex = this.commandHistory.length;

        // Custom Command: saveDirectory / save <name>
        const saveMatch = cmdLine.match(/^(?:saveDirectory|save)\s+(.+)$/);
        if (saveMatch) {
            const rawName = saveMatch[1];
            if (rawName) {
                const name = rawName.trim();
                if (!this.plugin.settings.bookmarks) this.plugin.settings.bookmarks = {};
                this.plugin.settings.bookmarks[name] = this.currentDir;
                this.plugin.saveSettings().then(() => this.updateBookmarksDropdown());
                this.terminal?.write(`\r\n\x1b[1;32mDirectory bookmarked as "${name}" -> ${this.currentDir}\x1b[0m`);
            }
            this.printPrompt();
            return;
        }

        // Custom Command: goto <name>
        const gotoMatch = cmdLine.match(/^goto\s+(.+)$/);
        if (gotoMatch) {
            const rawName = gotoMatch[1];
            if (rawName) {
                const name = rawName.trim();
                const bookmarks = this.plugin.settings.bookmarks || {};
                const target = bookmarks[name];
                if (target && fs.existsSync(target)) {
                    this.cdAndRun(target);
                } else if (target) {
                    this.terminal?.write(`\r\n\x1b[1;31mBookmark exists but folder no longer exists: ${target}\x1b[0m`);
                    this.printPrompt();
                } else {
                    this.terminal?.write(`\r\n\x1b[1;31mNo bookmark named "${name}" exists\x1b[0m`);
                    this.printPrompt();
                }
            }
            return;
        }

        // Custom Command: bookmarks
        if (cmdLine === 'bookmarks') {
            const bookmarks = this.plugin.settings.bookmarks || {};
            const keys = Object.keys(bookmarks);
            if (keys.length === 0) {
                this.terminal?.write(`\r\n\x1b[1;33mNo saved bookmarks. Save one using: saveDirectory <name>\x1b[0m`);
            } else {
                this.terminal?.write(`\r\n\x1b[1;36mSaved landmarks:\x1b[0m`);
                for (const [name, dir] of Object.entries(bookmarks)) {
                    this.terminal?.write(`\r\n  - \x1b[1;32m${name}\x1b[0m -> ${dir}`);
                }
            }
            this.printPrompt();
            return;
        }

        // Custom Command: deleteBookmark <name>
        const delMatch = cmdLine.match(/^deleteBookmark\s+(.+)$/);
        if (delMatch) {
            const rawName = delMatch[1];
            if (rawName) {
                const name = rawName.trim();
                const bookmarks = this.plugin.settings.bookmarks || {};
                if (bookmarks[name]) {
                    delete bookmarks[name];
                    this.plugin.saveSettings().then(() => this.updateBookmarksDropdown());
                    this.terminal?.write(`\r\n\x1b[1;32mDeleted bookmark "${name}"\x1b[0m`);
                } else {
                    this.terminal?.write(`\r\n\x1b[1;31mNo bookmark found named "${name}"\x1b[0m`);
                }
            }
            this.printPrompt();
            return;
        }

        // Custom Command: help
        if (cmdLine === 'help') {
            this.openHelp();
            return;
        }

        // Intercept 'edit <file>' commands to launch the integrated code editor
        const editMatch = cmdLine.match(/^edit\s+(.+)$/);
        if (editMatch) {
            const fileGroup = editMatch[1];
            if (fileGroup) {
                let targetFile = fileGroup.trim();
                if ((targetFile.startsWith('"') && targetFile.endsWith('"')) ||
                    (targetFile.startsWith("'") && targetFile.endsWith("'"))) {
                    targetFile = targetFile.slice(1, -1);
                }
                if (targetFile.startsWith('~')) {
                    targetFile = path.join(os.homedir(), targetFile.slice(1));
                } else {
                    targetFile = path.resolve(this.currentDir, targetFile);
                }
                this.openEditor(targetFile);
            }
            return;
        }

        // Manually parse cd commands to manage directory state transitions
        const cdMatch = cmdLine.match(/^cd\s+(.+)$/);
        if (cdMatch) {
            const pathGroup = cdMatch[1];
            if (pathGroup) {
                let targetDir = pathGroup.trim();
                if ((targetDir.startsWith('"') && targetDir.endsWith('"')) ||
                    (targetDir.startsWith("'") && targetDir.endsWith("'"))) {
                    targetDir = targetDir.slice(1, -1);
                }
                if (targetDir.startsWith('~')) {
                    targetDir = path.join(os.homedir(), targetDir.slice(1));
                } else {
                    targetDir = path.resolve(this.currentDir, targetDir);
                }

                try {
                    const stats = fs.statSync(targetDir);
                    if (stats.isDirectory()) {
                        this.currentDir = targetDir;
                    } else {
                        this.terminal?.write(`\r\ncd: not a directory: ${targetDir}`);
                    }
                } catch (e: any) {
                    this.terminal?.write(`\r\ncd: no such file or directory: ${targetDir}`);
                }
            }
            this.printPrompt();
            return;
        }

        // --- Intercept Custom Folder Scripts ---
        const args = cmdLine.trim().split(/\s+/);
        const commandVerb = args[0] || '';
        const commandArgs = args.slice(1);

        const adapter = this.app.vault.adapter as any;
        const vaultPath = typeof adapter.getBasePath === 'function' ? adapter.getBasePath() as string : '';
        const scriptsDir = path.resolve(vaultPath, this.plugin.settings.scriptsFolder || 'TerminalScripts');

        let scriptPath = '';
        let ext = '';

        try {
            if (fs.existsSync(scriptsDir)) {
                const files = fs.readdirSync(scriptsDir);
                const matchFile = files.find(f => {
                    const nameWithoutExt = path.parse(f).name;
                    return nameWithoutExt.toLowerCase() === commandVerb.toLowerCase();
                });

                if (matchFile) {
                    scriptPath = path.join(scriptsDir, matchFile);
                    ext = path.extname(matchFile).toLowerCase();
                }
            }
        } catch (e) {}

        if (scriptPath) {
            if (ext === '.js') {
                this.terminal?.write('\r\n');
                const ctx = {
                    app: this.app,
                    terminal: this.terminal,
                    currentDir: this.currentDir,
                    args: commandArgs,
                    fs: fs,
                    path: path
                };

                try {
                    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
                    const runScript = new Function('ctx', `
                        const { app, terminal, currentDir, args, fs, path } = ctx;
                        return (async () => {
                            ${scriptContent}
                        })();
                    `);
                    await runScript(ctx);
                } catch (err: any) {
                    this.terminal?.write(`\r\n\x1b[1;31mScript Error: ${err.message}\x1b[0m`);
                }
                this.printPrompt();
                return;
            } else if (['.py', '.sh', '.bat', '.ps1', '.rb', '.pl'].includes(ext)) {
                this.terminal?.write('\r\n');
                let spawnCmd = '';
                let spawnArgs: string[] = [];

                if (ext === '.py') {
                    spawnCmd = os.platform() === 'win32' ? 'python' : 'python3';
                    spawnArgs = [scriptPath, ...commandArgs];
                } else if (ext === '.sh') {
                    spawnCmd = 'bash';
                    spawnArgs = [scriptPath, ...commandArgs];
                } else if (ext === '.ps1') {
                    spawnCmd = 'powershell.exe';
                    spawnArgs = ['-File', scriptPath, ...commandArgs];
                } else if (ext === '.bat') {
                    spawnCmd = 'cmd.exe';
                    spawnArgs = ['/c', scriptPath, ...commandArgs];
                } else {
                    spawnCmd = scriptPath;
                    spawnArgs = commandArgs;
                }

                try {
                    this.activeProcess = spawn(spawnCmd, spawnArgs, {
                        cwd: this.currentDir,
                        env: {
                            ...process.env,
                            PATH: this.resolvedPath,
                            FORCE_COLOR: '1',
                            TERM: 'xterm-256color',
                            OBSIDIAN_VAULT_PATH: vaultPath,
                            OBSIDIAN_CURRENT_DIR: this.currentDir
                        }
                    });

                    this.activeProcess.stdout?.on('data', (data: Buffer) => {
                        this.terminal?.write(data.toString());
                    });

                    this.activeProcess.stderr?.on('data', (data: Buffer) => {
                        this.terminal?.write(data.toString());
                    });

                    this.activeProcess.on('error', (err: any) => {
                        this.terminal?.write(`\r\nError: ${err.message}\r\n`);
                    });

                    this.activeProcess.on('close', (code: number) => {
                        this.activeProcess = null;
                        this.printPrompt();
                    });
                } catch (e: any) {
                    this.terminal?.write(`\r\nFailed to start command: ${e.message}\r\n`);
                    this.activeProcess = null;
                    this.printPrompt();
                }
                return;
            }
        }

        // --- Standard shell fallback execution ---
        this.terminal?.write('\r\n');
        const shell = os.platform() === 'win32' ? 'powershell.exe' : true;

        try {
            this.activeProcess = spawn(cmdLine, {
                cwd: this.currentDir,
                shell: shell,
                env: {
                    ...process.env,
                    PATH: this.resolvedPath, // Injects standard user profiles PATH
                    FORCE_COLOR: '1', // Request terminal colors from build tools (npm, webpack, etc.)
                    TERM: 'xterm-256color'
                }
            });

            this.activeProcess.stdout?.on('data', (data: Buffer) => {
                this.terminal?.write(data.toString());
            });

            this.activeProcess.stderr?.on('data', (data: Buffer) => {
                this.terminal?.write(data.toString());
            });

            this.activeProcess.on('error', (err: any) => {
                this.terminal?.write(`\r\nError: ${err.message}\r\n`);
            });

            this.activeProcess.on('close', (code: number) => {
                this.activeProcess = null;
                this.printPrompt();
            });
        } catch (e: any) {
            this.terminal?.write(`\r\nFailed to start command: ${e.message}\r\n`);
            this.activeProcess = null;
            this.printPrompt();
        }
    }

    private openHelp() {
        // Prevent duplicate panels if an overlay is already active
        if (this.editorContainer) return;

        if (this.xtermContainer) {
            this.xtermContainer.style.display = 'none';
        }

        this.editorContainer = this.contentEl.createEl('div');
        this.editorContainer.style.cssText = 'flex:1; display:flex; flex-direction:column; background:#1e1e1e; padding:10px; min-height:0;';

        const editorBar = this.editorContainer.createEl('div');
        editorBar.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
        
        editorBar.createEl('span', { 
            text: '❓ Dev Terminal - Guide & Manual', 
            attr: { style: 'color:#aaa; font-size:12px; font-family:monospace;' } 
        });

        const closeBtn = editorBar.createEl('button', { text: '✕ Close Help' });
        closeBtn.style.cssText = 'font-size:11px; padding:3px 10px; background:#333; color:#ccc; border:1px solid #555; border-radius:3px; cursor:pointer;';
        // Prevent mousedown from triggering dragging on the parent bar
        closeBtn.addEventListener('mousedown', (e) => e.stopPropagation());

        const helpText = this.editorContainer.createEl('div');
        helpText.style.cssText = 'flex:1; background:#151515; color:#e0e0e0; font-family:Menlo, Monaco, "Courier New", monospace; font-size:13px; line-height:1.5; border:1px solid #333; border-radius:4px; padding:15px; overflow-y:auto;';
        
        helpText.createEl('h3', { text: '⚡ Custom Commands', attr: { style: 'color:#7fc97f; border-bottom:1px solid #333; padding-bottom:4px; margin-bottom:8px; font-size:14px;' } });
        helpText.createEl('p', { text: 'These commands are processed by the plugin container directly to circumvent standard PTY limitations:' });
        
        const list = helpText.createEl('ul', { attr: { style: 'padding-left:16px; line-height:1.6; margin:0 0 16px 0;' } });
        
        list.createEl('li').innerHTML = '<strong>edit &lt;file&gt;</strong>: Opens the browser-native code editor to quickly write, edit, or paste your file contents (e.g. <code style="background:#222; padding:1px 4px; border-radius:3px;">edit src/main.ts</code>).';
        list.createEl('li').innerHTML = '<strong>saveDirectory &lt;name&gt;</strong>: Saves your current directory under a custom shortcut name (e.g. <code style="color:#7fc97f; font-family:monospace;">saveDirectory plugins</code>).';
        list.createEl('li').innerHTML = '<strong>bookmarks</strong>: Displays all directory bookmarks saved in your profile.';
        list.createEl('li').innerHTML = '<strong>goto &lt;name&gt;</strong>: Instantly changes your working directory to the matching bookmarked folder.';
        list.createEl('li').innerHTML = '<strong>deleteBookmark &lt;name&gt;</strong>: Removes a bookmark from your profile.';
        list.createEl('li').innerHTML = '<strong>help</strong>: Shows this documentation window.';

        helpText.createEl('h3', { text: '🔑 Workspace Features', attr: { style: 'color:#7fc97f; border-bottom:1px solid #333; padding-bottom:4px; margin-top:16px; margin-bottom:8px; font-size:14px;' } });
        const list2 = helpText.createEl('ul', { attr: { style: 'padding-left:16px; line-height:1.6; margin:0;' } });
        list2.createEl('li').innerHTML = '<strong>Tab Autocomplete</strong>: Complete folders and file names inside your terminal window using the Tab key. Cycles matches dynamically.';
        list2.createEl('li').innerHTML = '<strong>Arrow Keys (Up / Down)</strong>: Cycle backwards and forwards through command execution history.';
        list2.createEl('li').innerHTML = '<strong>8-Edge Window Resizing</strong>: Hover and drag <em>any</em> border or corner of the window to expand or shrink the modal scale.';
        list2.createEl('li').innerHTML = '<strong>State and Position Memory</strong>: The window remembers its width, height, position, and active directory bookmarks across restarts.';
        list2.createEl('li').innerHTML = '<strong>Sticky Overlay</strong>: You can click anywhere outside the window; it remains active until you click the top close button.';

        closeBtn.addEventListener('click', () => {
            this.closeEditor();
        });
    }

    private openEditor(filePath: string) {
        // Prevent duplicate panels if an overlay is already active
        if (this.editorContainer) return;

        let content = '';
        try {
            if (fs.existsSync(filePath)) {
                content = fs.readFileSync(filePath, 'utf8');
            } else {
                // If it doesn't exist, create directory tree and an empty file
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                fs.writeFileSync(filePath, '', 'utf8');
            }
        } catch (e: any) {
            this.terminal?.write(`\r\nError reading file: ${e.message}`);
            this.printPrompt();
            return;
        }

        // Hide terminal output screen
        if (this.xtermContainer) {
            this.xtermContainer.style.display = 'none';
        }

        // Build the text editor screen layout
        this.editorContainer = this.contentEl.createEl('div');
        this.editorContainer.style.cssText = 'flex:1; display:flex; flex-direction:column; background:#1e1e1e; padding:10px; min-height:0;';

        const editorBar = this.editorContainer.createEl('div');
        editorBar.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
        
        editorBar.createEl('span', { 
            text: `Editing: ${path.basename(filePath)}`, 
            attr: { style: 'color:#aaa; font-size:12px; font-family:monospace;' } 
        });

        const btnGroup = editorBar.createEl('div', { attr: { style: 'display:flex; gap:8px;' } });
        
        const saveBtn = btnGroup.createEl('button', { text: '💾 Save & Close' });
        saveBtn.style.cssText = 'font-size:11px; padding:3px 10px; background:#2a3a2a; color:#7fc97f; border:1px solid #4a6a4a; border-radius:3px; cursor:pointer; font-weight:bold;';
        // Prevent mousedown from triggering dragging on the parent bar
        saveBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        
        const cancelBtn = btnGroup.createEl('button', { text: 'Cancel' });
        cancelBtn.style.cssText = 'font-size:11px; padding:3px 10px; background:#333; color:#ccc; border:1px solid #555; border-radius:3px; cursor:pointer;';
        // Prevent mousedown from triggering dragging on the parent bar
        cancelBtn.addEventListener('mousedown', (e) => e.stopPropagation());

        const textarea = this.editorContainer.createEl('textarea');
        textarea.value = content;
        textarea.placeholder = '// Paste code here...';
        textarea.style.cssText = `
            flex:1;
            background:#151515;
            color:#e0e0e0;
            font-family: Menlo, Monaco, "Courier New", monospace;
            font-size:13px;
            line-height:1.5;
            border:1px solid #333;
            border-radius:4px;
            padding:10px;
            resize:none;
            outline:none;
            caret-color: #39ff14;
        `;

        // Isolation: Intercept keydown events to prevent Obsidian hotkeys from triggering
        textarea.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });

        // Set immediate focus so the user can hit Cmd+A and paste
        requestAnimationFrame(() => {
            textarea.focus();
        });

        // Event hooks
        saveBtn.addEventListener('click', () => {
            try {
                fs.writeFileSync(filePath, textarea.value, 'utf8');
                this.terminal?.write(`\r\n\x1b[1;32mSaved successfully: ${path.basename(filePath)}\x1b[0m`);
            } catch (e: any) {
                this.terminal?.write(`\r\n\x1b[1;31mError saving: ${e.message}\x1b[0m`);
            }
            this.closeEditor();
        });

        cancelBtn.addEventListener('click', () => {
            this.terminal?.write(`\r\n\x1b[1;33mEdit canceled\x1b[0m`);
            this.closeEditor();
        });
    }

    private closeEditor() {
        if (this.editorContainer) {
            this.editorContainer.remove();
            this.editorContainer = null;
        }
        if (this.xtermContainer) {
            this.xtermContainer.style.display = 'block';
        }
        // Force the terminal engine to recalculate geometry layout and focus
        requestAnimationFrame(() => {
            this.fitAddon?.fit();
            this.terminal?.focus();
            this.printPrompt();
        });
    }

    private printPrompt() {
        this.terminal?.write('\r\n');
        this.printPromptRaw();
    }

    private printPromptRaw() {
        const displayDir = this.currentDir.replace(os.homedir(), '~');
        this.terminal?.write(`\x1b[1;36m${displayDir}\x1b[0m \x1b[1;32m$\x1b[0m `);
    }

    private cdAndRun(dir: string) {
        if (this.activeProcess) {
            this.terminal?.write(`\r\nCannot change directory while another process is running.\r\n`);
            return;
        }
        this.currentDir = dir;
        const cmd = os.platform() === 'win32' ? 'Get-ChildItem -Name' : 'ls -1';
        this.terminal?.write(`\r\n\x1b[1;33mcd ${dir} && ${os.platform() === 'win32' ? 'Get-ChildItem -Name' : 'ls -1'}\x1b[0m`);
        
        const adapter = this.app.vault.adapter as any;
        const vaultPath = typeof adapter.getBasePath === 'function' ? adapter.getBasePath() as string : '';
        
        this.runCommand(dir === vaultPath ? 'git status' : cmd); // List git status on vault jump or default
    }

    private makeDraggable(handle: HTMLElement, target: HTMLElement) {
        handle.addEventListener('mousedown', (e: MouseEvent) => {
            const rect = target.getBoundingClientRect();
            this.dragState = {
                dragging: true,
                startX: e.clientX,
                startY: e.clientY,
                origLeft: rect.left,
                origTop: rect.top,
            };
            target.style.transform = 'none';
            target.style.left = `${rect.left}px`;
            target.style.top = `${rect.top}px`;

            this.showOverlay('move');

            const onMouseMove = (e: MouseEvent) => {
                if (!this.dragState.dragging) return;
                const dx = e.clientX - this.dragState.startX;
                const dy = e.clientY - this.dragState.startY;
                const newLeft = this.dragState.origLeft + dx;
                const newTop = this.dragState.origTop + dy;
                target.style.left = `${newLeft}px`;
                target.style.top  = `${newTop}px`;
                this.currentBounds.left = newLeft;
                this.currentBounds.top = newTop;
            };
            const onMouseUp = () => {
                this.dragState.dragging = false;
                this.removeOverlay();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}
```
### Main
```ts
import { Plugin, PluginSettingTab, Setting, App } from 'obsidian';
import * as path from 'path';
import * as fs from 'fs';
import { TerminalModal } from './TerminalModal';

export interface TerminalSettings {
    width: string;
    height: string;
    left: string;
    top: string;
    bookmarks: Record<string, string>;
    commandHistory: string[];
    currentDir: string;
    scriptsFolder: string; // Dynamic scripts directory
}

const DEFAULT_SETTINGS: TerminalSettings = {
    width: '820px',
    height: '560px',
    left: '',
    top: '',
    bookmarks: {},
    commandHistory: [],
    currentDir: '',
    scriptsFolder: 'TerminalScripts'
};

export default class CustomTerminalPlugin extends Plugin {
    settings: TerminalSettings = DEFAULT_SETTINGS;
    modal: TerminalModal | null = null; // Expose reference to allow clean state tracking

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new TerminalSettingTab(this.app, this));

        // Standard command to toggle terminal view state
        this.addCommand({
            id: 'open-floating-terminal',
            name: 'Open Floating Terminal',
            callback: () => this.toggleTerminal(),
        });

        // Command to force-recenter the terminal window if it ever gets lost
        this.addCommand({
            id: 'recenter-floating-terminal',
            name: 'Recenter Floating Terminal',
            callback: () => {
                this.settings.left = '';
                this.settings.top = '';
                this.settings.width = '820px';
                this.settings.height = '560px';
                this.saveSettings();
                if (this.modal && this.modal.isOpen) {
                    this.modal.recenter();
                }
            }
        });

        // Check and cleanly create the scripts folder if it does not exist (but leave it empty)
        this.app.workspace.onLayoutReady(() => {
            const adapter = this.app.vault.adapter as any;
            const vaultPath = typeof adapter.getBasePath === 'function' ? adapter.getBasePath() as string : '';
            if (vaultPath) {
                const scriptsDir = path.resolve(vaultPath, this.settings.scriptsFolder || 'TerminalScripts');
                if (!fs.existsSync(scriptsDir)) {
                    try {
                        fs.mkdirSync(scriptsDir, { recursive: true });
                    } catch (err) {}
                }
            }
        });

        // URI handler: obsidian://reload-plugin?id=my-custom-terminal
        this.registerObsidianProtocolHandler('reload-plugin', async (params) => {
            const id = params['id'];
            if (!id) return;

            const plugins = (this.app as any).plugins;

            // Preserve terminal open state across reload so it re-opens automatically
            const wasOpen = this.modal?.isOpen ?? false;
            
            // Cleanly close the modal and remove it from the DOM
            if (this.modal) {
                this.modal.close();
            }

            await plugins.disablePlugin(id);
            await plugins.enablePlugin(id);

            // After enablePlugin the old `this` is dead ‚Äî the new instance handles re-open
            // via the REOPEN_AFTER_RELOAD flag set below before disable fires
            if (wasOpen) {
                // Store intent on the plugins object ‚Äî survives across the reload boundary
                plugins.__terminalReopenAfterReload = true;
            }
        });

        // On load, check if a previous instance requested re-open after reload
        const plugins = (this.app as any).plugins;
        if (plugins.__terminalReopenAfterReload) {
            delete plugins.__terminalReopenAfterReload;
            // Small delay so Obsidian finishes mounting the plugin before opening modal
            setTimeout(() => this.toggleTerminal(), 150);
        }
    }

    onunload() {
        // Cleanly dismiss the modal from the DOM. This automatically triggers
        // onClose() -> destroy() to kill processes and dispose of terminal listeners.
        if (this.modal) {
            this.modal.close();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private toggleTerminal() {
        if (this.modal) {
            this.modal.close();
        } else {
            this.modal = new TerminalModal(this.app, this);
            this.modal.open();
        }
    }
}

class TerminalSettingTab extends PluginSettingTab {
    plugin: CustomTerminalPlugin;

    constructor(app: App, plugin: CustomTerminalPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '‚ö° Dev Terminal Settings' });

        new Setting(containerEl)
            .setName('Terminal Scripts Folder')
            .setDesc('Vault-relative path where custom terminal utilities (.js, .py, .sh) are saved.')
            .addText(text => text
                .setPlaceholder('TerminalScripts')
                .setValue(this.plugin.settings.scriptsFolder || 'TerminalScripts')
                .onChange(async (value) => {
                    this.plugin.settings.scriptsFolder = value.trim() || 'TerminalScripts';
                    await this.plugin.saveSettings();
                })
            );
    }
}
```