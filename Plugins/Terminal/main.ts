import { Plugin, PluginSettingTab, Setting, App, WorkspaceLeaf, ItemView, Scope, Notice } from 'obsidian';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto'; 
import { spawn, execSync, ChildProcess } from 'child_process';
import { TerminalModal } from './TerminalModal';

// Python server code is injected at build time by esbuild
declare const __SERVER_CODE__: string;

export const TERMINAL_VIEW_TYPE = 'custom-terminal-pane';
export const WS_PORT = 7703;

export interface TerminalSettings {
    width: string;
    height: string;
    left: string;
    top: string;
    commandHistory: string[];
    currentDir: string;
    scriptsFolder: string;
    serverToken: string; // Token persisted inside data.json
}

const DEFAULT_SETTINGS: TerminalSettings = {
    width: '820px',
    height: '560px',
    left: '',
    top: '',
    commandHistory: [],
    currentDir: '',
    scriptsFolder: 'TerminalScripts',
    serverToken: '',
};

export default class CustomTerminalPlugin extends Plugin {
    settings: TerminalSettings = DEFAULT_SETTINGS;
    modal: TerminalModal | null = null;
    public paneModal: TerminalModal | null = null; // Persists split-pane terminal modal
    private serverProcess: ChildProcess | null = null;
    private serverReady = false;
    public serverToken = ''; // Holds the active token for this session
    public backdropActive = false; // Persistent backdrop active state across modal sessions

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new TerminalSettingTab(this.app, this));

        // Register the split-pane view
        this.registerView(TERMINAL_VIEW_TYPE, (leaf) => new TerminalPaneView(leaf, this));

        this.addCommand({
            id: 'open-terminal-float',
            name: 'Floating',
            callback: () => this.openFloat(),
        });

        this.addCommand({
            id: 'open-terminal-pane',
            name: 'Split Pane',
            callback: () => this.openPane(),
        });

        this.addCommand({
            id: 'toggle-terminal-backdrop',
            name: 'Toggle Focus Backdrop',
            callback: () => {
                if (this.modal && this.modal.isOpen) {
                    this.modal.toggleFocusBackdrop();
                } else {
                    new Notice('No active floating terminal window open.');
                }
            }
        });

        this.addCommand({
            id: 'recenter-terminal',
            name: 'Recenter Floating Terminal',
            callback: () => {
                this.settings.left = '';
                this.settings.top = '';
                this.settings.width = '820px';
                this.settings.height = '560px';
                this.saveSettings();
                if (this.modal?.isOpen) this.modal.recenter();
            },
        });

        this.app.workspace.onLayoutReady(async () => {
            const vaultPath = this.getVaultPath();
            if (vaultPath) {
                this.ensureScriptsDir(vaultPath);
                await this.startServer(vaultPath);
            }
        });

        // URI handler for hot-reload during development
        this.registerObsidianProtocolHandler('reload-plugin', async (params) => {
            const id = params['id'];
            if (!id) return;
            const plugins = (this.app as any).plugins;
            const wasOpen = this.modal?.isOpen ?? false;
            if (this.modal) this.modal.close();
            if (this.paneModal) this.paneModal.close();
            await plugins.disablePlugin(id);
            await plugins.enablePlugin(id);
            if (wasOpen) plugins.__terminalReopenAfterReload = true;
        });

        const plugins = (this.app as any).plugins;
        if (plugins.__terminalReopenAfterReload) {
            delete plugins.__terminalReopenAfterReload;
            setTimeout(() => this.openFloat(), 150);
        }
    }

    onunload() {
        if (this.modal) this.modal.close();
        if (this.paneModal) this.paneModal.close(); // Clean up active split pane on unload
        this.stopServer();
    }

    // ── Public API ──────────────────────────────────────────────────────────

    getVaultPath(): string {
        const adapter = this.app.vault.adapter as any;
        return typeof adapter.getBasePath === 'function' ? adapter.getBasePath() : '';
    }

    openFloat() {
        if (this.modal) {
            if (this.modal.isVisible) {
                this.modal.hide();
            } else {
                this.modal.show();
            }
            return;
        }
        this.modal = new TerminalModal(this.app, this);
        this.modal.open();
    }

    async openPane() {
        // If already open in a pane, just focus it
        const existing = this.app.workspace.getLeavesOfType(TERMINAL_VIEW_TYPE);
        const existingLeaf = existing[0];
        if (existingLeaf) {
            this.app.workspace.revealLeaf(existingLeaf);
            return;
        }
        // Open in a new right split
        const leaf = this.app.workspace.getLeaf('split');
        if (!leaf) return;
        await leaf.setViewState({ type: TERMINAL_VIEW_TYPE, active: true });
        this.app.workspace.revealLeaf(leaf);
    }

    // ── Server lifecycle ────────────────────────────────────────────────────

    private ensureScriptsDir(vaultPath: string) {
        const dir = path.resolve(vaultPath, this.settings.scriptsFolder || 'TerminalScripts');
        if (!fs.existsSync(dir)) {
            try { fs.mkdirSync(dir, { recursive: true }); } catch {}
        }
    }

    private getServerPath(vaultPath: string): string {
        const dir = path.resolve(vaultPath, this.settings.scriptsFolder || 'TerminalScripts');
        return path.join(dir, 'terminal-server.py');
    }

    private resolvePython(): string {
        // Prefer the user's login shell Python so their virtualenv/pyenv is respected
        for (const cmd of [
            '/bin/zsh -lc "which python3"',
            '/bin/bash -lc "which python3"',
        ]) {
            try {
                const p = execSync(cmd, { encoding: 'utf8', timeout: 2000 }).trim();
                if (p && fs.existsSync(p)) return p;
            } catch {}
        }
        // Fallback candidates
        for (const candidate of ['/usr/bin/python3', '/usr/local/bin/python3', '/opt/homebrew/bin/python3']) {
            if (fs.existsSync(candidate)) return candidate;
        }
        return 'python3';
    }

    private ensureWebsockets(pythonBin: string): boolean {
        try {
            execSync(`"${pythonBin}" -c "import websockets"`, { stdio: 'ignore', timeout: 3000 });
            return true;
        } catch {
            // Not installed — try to pip install it silently
            try {
                execSync(`"${pythonBin}" -m pip install websockets --quiet`, { timeout: 30000 });
                return true;
            } catch {
                return false;
            }
        }
    }

    private isServerRunning(): boolean {
        try {
            execSync(`lsof -i :${WS_PORT} -t`, { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    }

    private async startServer(vaultPath: string) {
        const serverPath = this.getServerPath(vaultPath);

        // Write the embedded Python server to disk
        try {
            fs.writeFileSync(serverPath, __SERVER_CODE__, 'utf8');
        } catch (err: any) {
            console.error('[terminal] Could not write server.py:', err.message);
            return;
        }

        const running = this.isServerRunning();

        if (running) {
            // Server is active. Retrieve the existing token from plugin settings to connect to it.
            if (this.settings.serverToken) {
                this.serverToken = this.settings.serverToken;
                console.log('[terminal] Server already running on port', WS_PORT, 'attaching with active token.');
                this.serverReady = true;
                return;
            } else {
                // Stale process check: If server is running but no token is found in settings,
                // terminate the process and allow a fresh start.
                console.log('[terminal] Server active but no token found in settings. Restarting server...');
                try {
                    execSync(`kill -9 $(lsof -t -i:${WS_PORT})`, { stdio: 'ignore' });
                } catch {}
            }
        }

        // Fresh server startup. Generate a brand new cryptographically secure token.
        const token = crypto.randomBytes(32).toString('hex');
        this.settings.serverToken = token;
        await this.saveSettings();
        this.serverToken = token;

        const pythonBin = this.resolvePython();

        // Ensure websockets package is available (auto-installs if missing)
        if (!this.ensureWebsockets(pythonBin)) {
            console.error('[terminal] Could not install websockets package. Run: pip3 install websockets');
            return;
        }

        try {
            this.serverProcess = spawn(pythonBin, [serverPath], {
                detached: true,
                stdio: 'ignore',
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: '1',
                    TERMINAL_SERVER_TOKEN: this.serverToken, // Pass token to the Python process env
                },
            });
            this.serverProcess.unref();
            this.serverReady = true;
            console.log('[terminal] Python PTY server started with fresh token');
        } catch (err: any) {
            console.error('[terminal] Failed to start server:', err.message);
        }
    }

    private stopServer() {
        // Maintain background server process to protect persistent Neovim sessions.
        this.serverProcess = null;
        this.serverReady = false;
    }

    // ── Settings ────────────────────────────────────────────────────────────

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

// ── Split pane view ─────────────────────────────────────────────────────────

export class TerminalPaneView extends ItemView {
    private modal: TerminalModal | null = null;

    constructor(leaf: WorkspaceLeaf, private plugin: CustomTerminalPlugin) {
        super(leaf);
        
        // Setup an active keyboard scope for this view so that Obsidian yields focus
        // priority to this custom pane when focused.
        this.scope = new Scope(this.app.scope);
        this.scope.register([], 'Escape', () => {
            // Returning true consumes the event and prevents Obsidian's default
            // action of defocusing the tab or moving to adjacent markdown tabs.
            return true;
        });
    }

    getViewType() { return TERMINAL_VIEW_TYPE; }
    getDisplayText() { return 'Terminal'; }
    getIcon() { return 'terminal'; }

    async onOpen() {
        // If a split-pane terminal was already created, remount it seamlessly
        if (this.plugin.paneModal) {
            this.modal = this.plugin.paneModal;
            this.modal.remount(this.contentEl);
        } else {
            this.modal = new TerminalModal(this.app, this.plugin, this.contentEl);
            this.plugin.paneModal = this.modal;
            this.modal.openInline();
        }
    }

    async onClose() {
        if (this.modal) {
            this.modal.detach(); // Detach and preserve the DOM element
            this.modal = null;
        }
    }
}

// ── Settings tab ─────────────────────────────────────────────────────────────

class TerminalSettingTab extends PluginSettingTab {
    constructor(app: App, private plugin: CustomTerminalPlugin) {
        super(app, plugin);
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: '⚡ Terminal Settings' });

        new Setting(containerEl)
            .setName('Terminal Scripts Folder')
            .setDesc('Vault-relative path where the PTY server script is stored.')
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