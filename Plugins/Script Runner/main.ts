import { App, Plugin, PluginSettingTab, Setting, SuggestModal, AbstractInputSuggest, Notice, TFile, TFolder } from 'obsidian';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

interface ScriptFolderConfig {
    path: string;
    isTerminalScripts: boolean;
}

interface ScriptRunnerSettings {
    startupScripts: string[];
    scriptsFolders: ScriptFolderConfig[];
    secrets: Record<string, string>;
}

const DEFAULT_SETTINGS: ScriptRunnerSettings = {
    startupScripts: [],
    scriptsFolders: [{ path: 'Scripts', isTerminalScripts: false }],
    secrets: {}
};

// Walks the vault tree and returns every folder path. Used to power the
// folder autosuggest in settings — no Obsidian API call for "all folders"
// is guaranteed stable across versions, so this is done manually.
function getAllFolderPaths(app: App): string[] {
    const folders: string[] = [];
    const walk = (folder: TFolder) => {
        for (const child of folder.children) {
            if (child instanceof TFolder) {
                folders.push(child.path);
                walk(child);
            }
        }
    };
    walk(app.vault.getRoot());
    return folders;
}

// --- Autosuggest for startup script input ---
class StartupScriptSuggest extends AbstractInputSuggest<string> {
    private getAvailable: () => string[];
    private input: HTMLInputElement;

    constructor(app: App, inputEl: HTMLInputElement, getAvailable: () => string[]) {
        super(app, inputEl);
        this.input = inputEl;
        this.getAvailable = getAvailable;
    }

    getSuggestions(query: string): string[] {
        return this.getAvailable().filter(s =>
            s.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createEl('span', { text: value });
    }

    selectSuggestion(value: string): void {
        this.input.value = value;
        this.input.dispatchEvent(new Event('input'));
        this.close();
    }
}

// --- Autosuggest for scripts-folder input ---
class FolderSuggest extends AbstractInputSuggest<string> {
    private getAvailable: () => string[];
    private input: HTMLInputElement;

    constructor(app: App, inputEl: HTMLInputElement, getAvailable: () => string[]) {
        super(app, inputEl);
        this.input = inputEl;
        this.getAvailable = getAvailable;
    }

    getSuggestions(query: string): string[] {
        return this.getAvailable().filter(s =>
            s.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createEl('span', { text: value });
    }

    selectSuggestion(value: string): void {
        this.input.value = value;
        this.input.dispatchEvent(new Event('input'));
        this.close();
    }
}

// --- Script palette modal ---
class ScriptPaletteModal extends SuggestModal<{ name: string, scriptPath: string, folder: string }> {
    private scripts: { name: string, scriptPath: string, folder: string }[];
    private runScript: (scriptPath: string) => void;

    constructor(app: App, scripts: { name: string, scriptPath: string, folder: string }[], runScript: (scriptPath: string) => void) {
        super(app);
        this.scripts = scripts;
        this.runScript = runScript;
        this.setPlaceholder('Search scripts...');
    }

    onOpen(): void {
        super.onOpen();
        setTimeout(() => this.inputEl.focus(), 50);
    }

    getSuggestions(query: string): { name: string, scriptPath: string, folder: string }[] {
        return this.scripts.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(item: { name: string, scriptPath: string, folder: string }, el: HTMLElement): void {
        el.createEl('span', { text: item.name });
    }

    onChooseSuggestion(item: { name: string, scriptPath: string, folder: string }): void {
        this.runScript(item.scriptPath);
    }
}

// --- Main plugin ---
export default class ScriptRunner extends Plugin {
    settings: ScriptRunnerSettings;
    loadedScripts: { name: string, scriptPath: string, folder: string }[] = [];
    registeredCommandIds: string[] = [];
    private reloadDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    // QuickAdd-style Execution Lock (Per-Script to allow startup scripts to run simultaneously)
    private executingScripts = new Set<string>();

    // Returns the configured folders, normalized (no trailing slash).
    private getNormalizedFolders(): string[] {
        return this.settings.scriptsFolders.map(f => f.path.replace(/\/$/, ''));
    }

    // True if this file lives under ANY configured scripts folder.
    private isInScriptsFolders(file: TFile): boolean {
        if (file.extension !== 'js') return false;
        const folders = this.getNormalizedFolders();
        return folders.some(folder => file.path.startsWith(folder + '/'));
    }

    // Returns true if the file resides inside any folder designated as a Terminal Scripts folder.
    private isInsideTerminalScriptFolder(file: TFile): boolean {
        return this.settings.scriptsFolders.some(f => {
            if (!f.isTerminalScripts) return false;
            const normalized = f.path.replace(/\/$/, '');
            return file.path.startsWith(normalized + '/');
        });
    }

    // Sets read, write, and execute permissions (755) on a file
    private makeFileExecutable(file: TFile) {
        try {
            const fs = require('fs');
            const basePath = (this.app.vault.adapter as any).basePath;
            const absolutePath = path.join(basePath, file.path);
            
            // Set executable permissions (0o755 gives rwxr-xr-x)
            fs.chmodSync(absolutePath, 0o755);
        } catch (err) {
            console.error(`[ScriptRunner] Failed to set executable permissions on ${file.name}:`, err);
        }
    }

    // Busts the require cache for a single script and re-runs it fresh.
    // No other scripts are touched.
    async runScript(scriptPath: string) {
        // If THIS specific script is already executing, swallow the phantom duplicate instantly
        if (this.executingScripts.has(scriptPath)) return;

        this.executingScripts.add(scriptPath);

        try {
            const fs = require('fs');
            const content = fs.readFileSync(scriptPath, 'utf8');
            const moduleObj: { exports: any } = { exports: {} };
            const wrapper = new Function('module', 'exports', 'require', '__filename', '__dirname', content);
            wrapper(moduleObj, moduleObj.exports, require, scriptPath, path.dirname(scriptPath));

            const fn = moduleObj.exports;

            // Execute the script. `secrets` is a plain object lookup against
            // settings.secrets — no script edit required unless it actually
            // needs a key, and adding a new key never requires touching this file.
            const result = fn({ app: this.app, obsidian: require('obsidian'), secrets: this.settings.secrets });

            // If the script is async (like DailyFile.js), wait for it to finish naturally
            if (result instanceof Promise) {
                await result;
            }
        } catch (error) {
            console.error(`Script Runner Error executing ${scriptPath}:`, error);
        } finally {
            // Yield a tiny micro-task to the event loop. This ensures that any pending
            // Webview IPC messages are processed and dropped *before* we unlock the script.
            await new Promise(resolve => setTimeout(resolve, 10));
            this.executingScripts.delete(scriptPath);
        }
    }

    private scheduleReload() {
        if (this.reloadDebounceTimer) clearTimeout(this.reloadDebounceTimer);
        this.reloadDebounceTimer = setTimeout(async () => {
            await this.reloadScripts();
        }, 500);
    }

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new ScriptRunnerSettingTab(this.app, this));
        // Register all script commands immediately, then run startup scripts
        // only once the workspace is fully ready (so they can safely access
        // the editor, active leaf, etc.)
        await this.reloadScripts();
        this.app.workspace.onLayoutReady(() => this.runStartupScripts());

        // Auto-reload on create
        this.registerEvent(this.app.vault.on('create', (file) => {
            if (!(file instanceof TFile)) return;
            
            // Apply chmod +x if it lives in any folder designated as a Terminal Scripts folder
            if (this.isInsideTerminalScriptFolder(file)) {
                this.makeFileExecutable(file);
            }
            
            // Only index JS files that live in your standard ScriptRunner folders
            if (this.isInScriptsFolders(file)) {
                this.scheduleReload();
            }
        }));

        // On delete: remove from startup list if present, then reload
        this.registerEvent(this.app.vault.on('delete', (file) => {
            if (!(file instanceof TFile)) return;
            if (file.extension !== 'js') return;
            if (!this.isInScriptsFolders(file)) return;

            const deletedName = file.basename;
            const idx = this.settings.startupScripts.indexOf(deletedName);
            if (idx !== -1) {
                this.settings.startupScripts.splice(idx, 1);
                this.saveSettings();
            }

            this.scheduleReload();
        }));

        // Rename/Move: Handles name updates, moving scripts into/out of scripts folders, and migrations
        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            if (!(file instanceof TFile)) return;

            // Apply chmod if the file moves into or is renamed inside any terminal scripts folder
            const isInTerminal = this.isInsideTerminalScriptFolder(file);
            if (isInTerminal) {
                this.makeFileExecutable(file);
            }

            const folders = this.getNormalizedFolders();
            const wasInScripts = folders.some(folder => oldPath.startsWith(folder + '/'));
            const isInScripts = this.isInScriptsFolders(file);

            // If the file was never in a standard scripts folder, and still isn't, ignore indexing
            if (!wasInScripts && !isInScripts) return;

            // Safely strip any extension (.js, .py, etc.) to get the base name
            const oldName = oldPath.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
            const newName = file.basename;

            // Scenario 1: Script was moved OUT of the dedicated script folders
            if (wasInScripts && !isInScripts) {
                if (oldPath.endsWith('.js')) {
                    const idx = this.settings.startupScripts.indexOf(oldName);
                    if (idx !== -1) {
                        this.settings.startupScripts.splice(idx, 1);
                        this.saveSettings();
                    }
                    this.scheduleReload();
                }
                return;
            }

            // Scenario 2: Script was moved INTO one of the dedicated script folders
            if (!wasInScripts && isInScripts) {
                if (file.extension === 'js') {
                    this.scheduleReload();
                }
                return;
            }

            // Scenario 3: Script was renamed or moved internally between configured scripts folders
            if (wasInScripts && isInScripts) {
                if (file.extension === 'js') {
                    if (oldName !== newName && oldName) {
                        // Update startup list if the old name was in it
                        const idx = this.settings.startupScripts.indexOf(oldName);
                        if (idx !== -1) {
                            this.settings.startupScripts[idx] = newName;
                            this.saveSettings();
                        }

                        // Migrate hotkeys from the old command ID to the new one
                        this.migrateHotkeys(oldName, newName);
                    }
                    this.scheduleReload();
                }
            }
        }));
    }

    /**
     * Copies any custom hotkeys from an old script command ID to the new one,
     * then removes the stale entry. This preserves user-assigned hotkeys across renames.
     */
    migrateHotkeys(oldScriptName: string, newScriptName: string) {
        const hotkeyManager = (this.app as any).hotkeyManager;
        if (!hotkeyManager) return;

        const oldId = `${this.manifest.id}:${oldScriptName.toLowerCase()}`;
        const newId = `${this.manifest.id}:${newScriptName.toLowerCase()}`;

        const hotkeys = hotkeyManager.getHotkeys(oldId);
        if (!hotkeys || hotkeys.length === 0) return;

        hotkeyManager.setHotkeys(newId, hotkeys);
        hotkeyManager.removeHotkeys(oldId);
        hotkeyManager.save?.();
    }

    async runStartupScripts() {
        for (const script of this.loadedScripts) {
            if (this.settings.startupScripts.includes(script.name)) {
                this.runScript(script.scriptPath);
            }
        }
    }

    async reloadScripts() {
        // Unregister existing commands
        for (const id of this.registeredCommandIds) {
            (this.app as any).commands.removeCommand(`${this.manifest.id}:${id}`);
        }
        this.registeredCommandIds = [];
        this.loadedScripts = [];

        const basePath = (this.app.vault.adapter as any).basePath;
        const folders = this.getNormalizedFolders();

        // A file is included if it sits under ANY configured folder. Vault.getFiles()
        // returns each file once, so overlapping folder entries can't cause duplicates.
        const files = this.app.vault.getFiles()
            .filter(f => f.extension === 'js' && folders.some(folder => f.path.startsWith(folder + '/')));

        for (const file of files) {
            const scriptPath = path.join(basePath, file.path);
            const matchedFolder = folders.find(folder => file.path.startsWith(folder + '/')) || '';

            this.loadedScripts.push({ name: file.basename, scriptPath, folder: matchedFolder });

            // NOTE: command id is derived from basename only, same as before multi-folder
            // support. Two scripts with the same filename in different folders will
            // collide (last one loaded wins the command registration) — keep basenames
            // unique across all configured folders.
            this.addCommand({
                id: file.basename.toLowerCase(),
                name: file.basename,
                callback: () => this.runScript(scriptPath)
            });
            this.registeredCommandIds.push(file.basename.toLowerCase());
        }

        this.loadedScripts.sort((a, b) => a.name.localeCompare(b.name));

        // Master Script palette command
        this.addCommand({
            id: 'open-script-palette',
            name: 'Open Script Palette',
            callback: () => new ScriptPaletteModal(this.app, this.loadedScripts, (p) => this.runScript(p)).open()
        });
        this.registeredCommandIds.push('open-script-palette');

        // Dynamic per-folder Script palette commands
        for (const folder of folders) {
            const folderCmdId = `open-palette-${folder.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            this.addCommand({
                id: folderCmdId,
                name: `Open Script Palette: ${folder}`,
                callback: () => {
                    const folderScripts = this.loadedScripts.filter(s => s.folder === folder);
                    new ScriptPaletteModal(this.app, folderScripts, (p) => this.runScript(p)).open();
                }
            });
            this.registeredCommandIds.push(folderCmdId);
        }
    }

    async loadSettings() {
        const data = (await this.loadData()) as any;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

        // Migrate legacy single-folder setting (scriptsFolder: string) to the
        // new multi-folder array, so existing installs don't silently lose
        // their configured folder on upgrade.
        if (data && typeof data.scriptsFolder === 'string' && !Array.isArray(data.scriptsFolders)) {
            this.settings.scriptsFolders = [{ path: data.scriptsFolder, isTerminalScripts: false }];
        } else if (data && Array.isArray(data.scriptsFolders)) {
            // Safely migrate string arrays to folder configurations
            this.settings.scriptsFolders = data.scriptsFolders.map((f: any) => {
                if (typeof f === 'string') {
                    return { path: f, isTerminalScripts: false };
                }
                return f;
            });
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

// --- Settings tab ---
class ScriptRunnerSettingTab extends PluginSettingTab {
    plugin: ScriptRunner;

    constructor(app: App, plugin: ScriptRunner) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // Safely reads the local ~/.zshrc file to verify if completion configurations
    // and selected folder paths are correctly added to the system PATH.
    private verifyZshConfig(): { isConfigured: boolean; missingPaths: string[]; isZstyleMissing: boolean } {
        const result = { isConfigured: true, missingPaths: [] as string[], isZstyleMissing: false };
        try {
            const zshrcPath = path.join(os.homedir(), '.zshrc');
            if (!fs.existsSync(zshrcPath)) {
                result.isConfigured = false;
                result.isZstyleMissing = true;
                result.missingPaths = this.plugin.settings.scriptsFolders
                    .filter(f => f.isTerminalScripts)
                    .map(f => f.path);
                return result;
            }

            const zshrcContent = fs.readFileSync(zshrcPath, 'utf8');
            
            // Check zstyle directive presence
            if (!zshrcContent.includes("zstyle ':completion:*' rehash true") && 
                !zshrcContent.includes("zstyle \":completion:*\" rehash true")) {
                result.isZstyleMissing = true;
                result.isConfigured = false;
            }

            // Verify paths
            const activeFolders = this.plugin.settings.scriptsFolders.filter(f => f.isTerminalScripts);
            for (const folder of activeFolders) {
                const normalizedPath = folder.path.replace(/\/$/, '');
                const basePath = (this.plugin.app.vault.adapter as any).basePath;
                const absolutePath = path.join(basePath, folder.path);

                const isPathRegistered = zshrcContent.includes(normalizedPath) || zshrcContent.includes(absolutePath);
                if (!isPathRegistered) {
                    result.missingPaths.push(folder.path);
                    result.isConfigured = false;
                }
            }
        } catch (err) {
            console.error("[ScriptRunner] Error reading ~/.zshrc for verification:", err);
        }
        return result;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        // --- Scripts folders ---
        containerEl.createEl('h3', { text: 'Scripts folders' });
        containerEl.createEl('p', {
            text: 'Vault-relative folders to scan for JS scripts. Add as many as you need.',
            attr: { style: 'color: var(--text-muted); margin-bottom: 12px;' }
        });

        let folderInputValue = '';

        new Setting(containerEl)
            .setName('Add folder')
            .setDesc('Vault-relative path, e.g. Scripts or Private/Scripts')
            .addText(text => {
                text.setPlaceholder('Scripts');

                new FolderSuggest(
                    this.app,
                    text.inputEl,
                    () => getAllFolderPaths(this.app)
                        .filter(p => !this.plugin.settings.scriptsFolders.some(f => f.path === p))
                );

                text.onChange(value => { folderInputValue = value.trim(); });
            })
            .addButton(button => button
                .setButtonText('Add')
                .setCta()
                .onClick(async () => {
                    if (!folderInputValue) return;
                    const normalized = folderInputValue.replace(/\/$/, '');
                    if (this.plugin.settings.scriptsFolders.some(f => f.path === normalized)) return;
                    
                    this.plugin.settings.scriptsFolders.push({
                        path: normalized,
                        isTerminalScripts: false // Defaults to off when added
                    });
                    await this.plugin.saveSettings();
                    await this.plugin.reloadScripts();
                    this.display();
                })
            );

        const folderList = containerEl.createDiv({ attr: { style: 'margin-top: 12px;' } });

        if (this.plugin.settings.scriptsFolders.length === 0) {
            folderList.createEl('p', {
                text: 'No folders configured — no scripts will load.',
                attr: { style: 'color: var(--text-muted);' }
            });
        } else {
            for (const folder of this.plugin.settings.scriptsFolders) {
                const row = folderList.createDiv({
                    attr: {
                        style: 'display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--background-modifier-border);'
                    }
                });

                row.createEl('span', { text: folder.path });

                const controls = row.createDiv({
                    attr: {
                        style: 'display: flex; align-items: center; gap: 12px;'
                    }
                });

                // Toggle for Terminal Scripts configuration
                const label = controls.createEl('label', {
                    attr: {
                        style: 'display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); cursor: pointer;'
                    }
                });
                const checkbox = label.createEl('input', {
                    attr: {
                        type: 'checkbox'
                    }
                });
                checkbox.checked = folder.isTerminalScripts;
                label.createEl('span', { text: 'Terminal Scripts' });

                checkbox.addEventListener('change', async () => {
                    folder.isTerminalScripts = checkbox.checked;
                    await this.plugin.saveSettings();
                    this.display(); // Redraw settings tab to update Diagnostic box status
                });

                const removeBtn = controls.createEl('button', {
                    text: '✕',
                    attr: { style: 'background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; padding: 0 4px;' }
                });

                removeBtn.addEventListener('click', async () => {
                    this.plugin.settings.scriptsFolders =
                        this.plugin.settings.scriptsFolders.filter(f => f.path !== folder.path);
                    await this.plugin.saveSettings();
                    await this.plugin.reloadScripts();
                    this.display();
                });
            }
        }

        // --- System Diagnostics (Interactive Helper Box with Copy Button) ---
        const activeTerminalFolders = this.plugin.settings.scriptsFolders.filter(f => f.isTerminalScripts);
        if (activeTerminalFolders.length > 0) {
            containerEl.createEl('h3', { text: 'Terminal Diagnostics' });
            
            const diagnostic = this.verifyZshConfig();
            const diagBox = containerEl.createDiv({
                attr: {
                    style: `padding: 12px; border-radius: 6px; margin-top: 8px; border: 1px solid ${diagnostic.isConfigured ? 'var(--background-modifier-border)' : 'var(--background-modifier-border-focus)'}; background: var(--background-primary);`
                }
            });

            if (diagnostic.isConfigured) {
                diagBox.createEl('p', {
                    text: '✅ Your ~/.zshrc configuration is set up correctly!',
                    attr: { style: 'color: var(--text-success); font-weight: bold; margin: 0;' }
                });
            } else {
                diagBox.createEl('p', {
                    text: '⚠️ Terminal configuration is incomplete.',
                    attr: { style: 'color: var(--text-warning); font-weight: bold; margin-top: 0; margin-bottom: 8px;' }
                });

                const headerRow = diagBox.createDiv({
                    attr: {
                        style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;'
                    }
                });

                headerRow.createEl('p', {
                    text: 'To enable instant terminal executions and autocompletions for the selected folders, append the following code block to the bottom of your ~/.zshrc file:',
                    attr: { style: 'color: var(--text-muted); font-size: 13px; margin: 0; padding-right: 12px; flex: 1;' }
                });

                const basePath = (this.app.vault.adapter as any).basePath;
                let codeBlock = '';
                
                if (diagnostic.isZstyleMissing) {
                    codeBlock += `# Enable dynamic directory autocompletion\nzstyle ':completion:*' rehash true\n\n`;
                }

                if (diagnostic.missingPaths.length > 0) {
                    codeBlock += `# Add your active terminal folders to the system PATH\n`;
                    const absolutePaths = diagnostic.missingPaths.map(p => path.join(basePath, p));
                    codeBlock += `export PATH="$PATH:${absolutePaths.join(':')}"\n`;
                }

                // Native Copy button
                const copyBtn = headerRow.createEl('button', {
                    text: '📋 Copy Code',
                    attr: {
                        style: 'font-size: 11px; padding: 4px 8px; cursor: pointer; background: var(--interactive-accent); color: var(--text-on-accent); border: none; border-radius: 4px; flex-shrink: 0;'
                    }
                });

                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(codeBlock);
                        copyBtn.innerText = '✓ Copied!';
                        new Notice('Code block copied to clipboard.');
                        setTimeout(() => {
                            copyBtn.innerText = '📋 Copy Code';
                        }, 2000);
                    } catch (err) {
                        new Notice('Failed to copy code to clipboard.');
                    }
                });

                const codeContainer = diagBox.createEl('pre', {
                    attr: {
                        style: 'background: var(--background-secondary); padding: 10px; border-radius: 4px; overflow-x: auto; font-family: var(--font-monospace); font-size: 12px; margin: 0;'
                    }
                });
                codeContainer.createEl('code', { text: codeBlock });
            }
        }

        // --- Secrets ---
        containerEl.createEl('h3', { text: 'Secrets' });
        containerEl.createEl('p', {
            text: 'Available to every script via the injected secrets object (e.g. secrets.GOOGLE_AI_STUDIO_KEY). Stored in this plugin\'s data.json, not in any script file.',
            attr: { style: 'color: var(--text-muted); margin-bottom: 12px;' }
        });

        let secretNameValue = '';
        let secretValueValue = '';

        new Setting(containerEl)
            .setName('Add secret')
            .setDesc('Name is the key scripts will read, e.g. GOOGLE_AI_STUDIO_KEY')
            .addText(text => {
                text.setPlaceholder('NAME');
                text.onChange(value => { secretNameValue = value.trim(); });
            })
            .addText(text => {
                text.inputEl.type = 'password';
                text.setPlaceholder('value');
                text.onChange(value => { secretValueValue = value; });
            })
            .addButton(button => button
                .setButtonText('Add')
                .setCta()
                .onClick(async () => {
                    if (!secretNameValue || !secretValueValue) return;
                    this.plugin.settings.secrets[secretNameValue] = secretValueValue;
                    await this.plugin.saveSettings();
                    this.display();
                })
            );

        const secretsList = containerEl.createDiv({ attr: { style: 'margin-top: 12px;' } });
        const secretNames = Object.keys(this.plugin.settings.secrets);

        if (secretNames.length === 0) {
            secretsList.createEl('p', {
                text: 'No secrets configured.',
                attr: { style: 'color: var(--text-muted);' }
            });
        } else {
            for (const name of secretNames) {
                const row = secretsList.createDiv({
                    attr: {
                        style: 'display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--background-modifier-border);'
                    }
                });

                // Value is never rendered to the DOM, only the key name — avoids
                // the secret sitting in plaintext in the rendered settings pane.
                row.createEl('span', { text: name });

                const removeBtn = row.createEl('button', {
                    text: '✕',
                    attr: { style: 'background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px;' }
                });

                removeBtn.addEventListener('click', async () => {
                    delete this.plugin.settings.secrets[name];
                    await this.plugin.saveSettings();
                    this.display();
                });
            }
        }

        // --- Startup scripts ---
        containerEl.createEl('h3', { text: 'Startup scripts' });
        containerEl.createEl('p', {
            text: 'Scripts listed here run automatically when Obsidian loads.',
            attr: { style: 'color: var(--text-muted); margin-bottom: 12px;' }
        });

        let inputValue = '';

        new Setting(containerEl)
            .setName('Add startup script')
            .setDesc('Select from your loaded scripts')
            .addText(text => {
                text.setPlaceholder('Search scripts...');

                new StartupScriptSuggest(
                    this.app,
                    text.inputEl,
                    () => this.plugin.loadedScripts
                        .map(s => s.name)
                        .filter(name => !this.plugin.settings.startupScripts.includes(name))
                );

                text.onChange(value => { inputValue = value.trim(); });
            })
            .addButton(button => button
                .setButtonText('Add')
                .setCta()
                .onClick(async () => {
                    if (!inputValue) return;
                    if (this.plugin.settings.startupScripts.includes(inputValue)) return;
                    this.plugin.settings.startupScripts.push(inputValue);
                    await this.plugin.saveSettings();
                    this.display();
                })
            );

        // Startup scripts list
        const list = containerEl.createDiv({ attr: { style: 'margin-top: 12px;' } });

        if (this.plugin.settings.startupScripts.length === 0) {
            list.createEl('p', {
                text: 'No startup scripts configured.',
                attr: { style: 'color: var(--text-muted);' }
            });
            return;
        }

        for (const scriptName of this.plugin.settings.startupScripts) {
            const row = list.createDiv({
                attr: {
                    style: 'display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--background-modifier-border);'
                }
            });

            row.createEl('span', { text: scriptName });

            const removeBtn = row.createEl('button', {
                text: '✕',
                attr: { style: 'background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px;' }
            });

            removeBtn.addEventListener('click', async () => {
                this.plugin.settings.startupScripts =
                    this.plugin.settings.startupScripts.filter(s => s !== scriptName);
                await this.plugin.saveSettings();
                this.display();
            });
        }
    }
}