---
status: done
reminders:
  - id: rem_1779166993586_6stxi6f7v
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
parent:
  - "[[(T) Software Engineer Interview Prep DSA]]"
aliases:
  - (T) My Script Runner Plugin
  - (T) QuickAdd Replacement
completedDate: 2026-05-20
---
## Conversation
- [Claude](https://claude.ai/chat/d9adc03b-ecba-466a-948e-b9b980770ba6)
## Solution
- It seems like QuickAdd is creating this lag. Not sure why. Might be due to a `refreshTagIndex` issue or keystroke overhead.
- Could configure everything to templater for scripts to work
- My solution is to build my own plugin to handle javascript files because QuickAdd causes too much INP lag. And I don't want to use templater because it requires a `wrapper.md` per script.
	- Building my own plugin with command registration and start-up execution.
### Steps to Edit Code
- Below lets me edit the code
```bash
cd desktop/ObsidianPlugin/obsidian-sample-plugin
npm run build
```
## Building Plugin

### V3
- To fix this so it works exactly like QuickAdd without breaking your startup scripts, we just need to make the execution lock per-script.
	- By using a Set to track the paths of currently running scripts, your startup scripts can all load concurrently without blocking each other, but an individual script will completely ignore the Web view's phantom double-press.
- Behavior below seemed to fix it
```ts
import { App, Plugin, PluginSettingTab, Setting, SuggestModal, AbstractInputSuggest, Notice, TFile } from 'obsidian';
import * as path from 'path';

interface ScriptRunnerSettings {
    startupScripts: string[];
    scriptsFolder: string;
}

const DEFAULT_SETTINGS: ScriptRunnerSettings = {
    startupScripts: [],
    scriptsFolder: 'Scripts'
};

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

// --- Script palette modal ---
class ScriptPaletteModal extends SuggestModal<{ name: string, scriptPath: string }> {
    private scripts: { name: string, scriptPath: string }[];
    private runScript: (scriptPath: string) => void;

    constructor(app: App, scripts: { name: string, scriptPath: string }[], runScript: (scriptPath: string) => void) {
        super(app);
        this.scripts = scripts;
        this.runScript = runScript;
        this.setPlaceholder('Search scripts...');
    }

    onOpen(): void {
        super.onOpen();
        setTimeout(() => this.inputEl.focus(), 50);
    }

    getSuggestions(query: string): { name: string, scriptPath: string }[] {
        return this.scripts.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(item: { name: string, scriptPath: string }, el: HTMLElement): void {
        el.createEl('span', { text: item.name });
    }

    onChooseSuggestion(item: { name: string, scriptPath: string }): void {
        this.runScript(item.scriptPath);
    }
}

// --- Main plugin ---
export default class ScriptRunner extends Plugin {
    settings: ScriptRunnerSettings;
    loadedScripts: { name: string, scriptPath: string }[] = [];
    registeredCommandIds: string[] = [];
    private reloadDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    
    // QuickAdd-style Execution Lock (Per-Script to allow startup scripts to run simultaneously)
    private executingScripts = new Set<string>();

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
            
            // Execute the script
            const result = fn({ app: this.app, obsidian: require('obsidian') });
            
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

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new ScriptRunnerSettingTab(this.app, this));
        // Register all script commands immediately, then run startup scripts
        // only once the workspace is fully ready (so they can safely access
        // the editor, active leaf, etc.)
        await this.reloadScripts();
        this.app.workspace.onLayoutReady(() => this.runStartupScripts());

        const isInScriptsFolder = (file: TFile) => {
            const folder = this.settings.scriptsFolder.replace(/\/$/, '');
            return file.extension === 'js' && file.path.startsWith(folder + '/');
        };

        // Auto-reload on create
        const scheduleReload = (file: TFile) => {
            if (!isInScriptsFolder(file)) return;
            if (this.reloadDebounceTimer) clearTimeout(this.reloadDebounceTimer);
            this.reloadDebounceTimer = setTimeout(async () => {
                await this.reloadScripts();
                // new Notice('🔄 Script Runner: scripts reloaded.');
            }, 500);
        };

        this.registerEvent(this.app.vault.on('create', scheduleReload));

        // On delete: remove from startup list if present, then reload
        this.registerEvent(this.app.vault.on('delete', (file) => {
            if (!(file instanceof TFile)) return;
            if (!isInScriptsFolder(file)) return;

            const deletedName = file.basename;
            const idx = this.settings.startupScripts.indexOf(deletedName);
            if (idx !== -1) {
                this.settings.startupScripts.splice(idx, 1);
                this.saveSettings();
                // new Notice(`🗑️ "${deletedName}" removed from startup scripts.`);
            }

            scheduleReload(file);
        }));

        // Rename: update startup list + migrate hotkeys, then reload
        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            if (!(file instanceof TFile)) return;
            const folder = this.settings.scriptsFolder.replace(/\/$/, '');
            if (file.extension !== 'js') return;
            if (!oldPath.startsWith(folder + '/')) return;

            const oldName = oldPath.split('/').pop()?.replace('.js', '');
            const newName = file.basename;

            if (!oldName || oldName === newName) return;

            // Update startup list if old name was in it
            const idx = this.settings.startupScripts.indexOf(oldName);
            if (idx !== -1) {
                this.settings.startupScripts[idx] = newName;
                this.saveSettings();
                // new Notice(`✏️ Startup script renamed: ${oldName} → ${newName}`);
            }

            // Migrate hotkeys from the old command ID to the new one
            this.migrateHotkeys(oldName, newName);

            // Then trigger a reload
            scheduleReload(file);
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
        // new Notice(`⌨️ Hotkeys migrated from "${oldScriptName}" to "${newScriptName}".`);
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
        const folder = this.settings.scriptsFolder.replace(/\/$/, '');
        const files = this.app.vault.getFiles()
            .filter(f => f.path.startsWith(folder + '/') && f.extension === 'js');

        for (const file of files) {
            const scriptPath = path.join(basePath, file.path);

            this.loadedScripts.push({ name: file.basename, scriptPath });

            this.addCommand({
                id: file.basename.toLowerCase(),
                name: file.basename,
                callback: () => this.runScript(scriptPath)
            });
            this.registeredCommandIds.push(file.basename.toLowerCase());
        }

        this.loadedScripts.sort((a, b) => a.name.localeCompare(b.name));

        // Script palette command
        this.addCommand({
            id: 'open-script-palette',
            name: 'Open Script Palette',
            callback: () => new ScriptPaletteModal(this.app, this.loadedScripts, (p) => this.runScript(p)).open()
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Script Runner' });

        // Scripts folder
        new Setting(containerEl)
            .setName('Scripts folder')
            .setDesc('Vault-relative path to the folder containing your JS scripts.')
            .addText(text => text
                .setPlaceholder('Scripts')
                .setValue(this.plugin.settings.scriptsFolder)
                .onChange(async (value) => {
                    this.plugin.settings.scriptsFolder = value.trim();
                    await this.plugin.saveSettings();
                })
            );

        // Startup scripts
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
```
### V2
#### Main.ts
- Without messing with the script.
- Ensures you can edit an updated file
```typescript
import { App, Plugin, PluginSettingTab, Setting, SuggestModal, AbstractInputSuggest, Notice, TFile } from 'obsidian';
import * as path from 'path';

interface ScriptRunnerSettings {
    startupScripts: string[];
    scriptsFolder: string;
}

const DEFAULT_SETTINGS: ScriptRunnerSettings = {
    startupScripts: [],
    scriptsFolder: 'Scripts'
};

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

// --- Script palette modal ---
class ScriptPaletteModal extends SuggestModal<{ name: string, scriptPath: string }> {
    private scripts: { name: string, scriptPath: string }[];
    private runScript: (scriptPath: string) => void;

    constructor(app: App, scripts: { name: string, scriptPath: string }[], runScript: (scriptPath: string) => void) {
        super(app);
        this.scripts = scripts;
        this.runScript = runScript;
        this.setPlaceholder('Search scripts...');
    }

    onOpen(): void {
        super.onOpen();
        setTimeout(() => this.inputEl.focus(), 50);
    }

    getSuggestions(query: string): { name: string, scriptPath: string }[] {
        return this.scripts.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(item: { name: string, scriptPath: string }, el: HTMLElement): void {
        el.createEl('span', { text: item.name });
    }

    onChooseSuggestion(item: { name: string, scriptPath: string }): void {
        this.runScript(item.scriptPath);
    }
}

// --- Main plugin ---
export default class ScriptRunner extends Plugin {
    settings: ScriptRunnerSettings;
    loadedScripts: { name: string, scriptPath: string }[] = [];
    registeredCommandIds: string[] = [];
    private reloadDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Busts the require cache for a single script and re-runs it fresh.
    // No other scripts are touched.
    runScript(scriptPath: string) {
        const fs = require('fs');
        const content = fs.readFileSync(scriptPath, 'utf8');
        const moduleObj: { exports: any } = { exports: {} };
        const wrapper = new Function('module', 'exports', 'require', '__filename', '__dirname', content);
        wrapper(moduleObj, moduleObj.exports, require, scriptPath, path.dirname(scriptPath));
        const fn = moduleObj.exports;
        fn({ app: this.app, obsidian: require('obsidian') });
    }

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new ScriptRunnerSettingTab(this.app, this));
        // Register all script commands immediately, then run startup scripts
        // only once the workspace is fully ready (so they can safely access
        // the editor, active leaf, etc.)
        await this.reloadScripts();
        this.app.workspace.onLayoutReady(() => this.runStartupScripts());

        const isInScriptsFolder = (file: TFile) => {
            const folder = this.settings.scriptsFolder.replace(/\/$/, '');
            return file.extension === 'js' && file.path.startsWith(folder + '/');
        };

        // Auto-reload on create
        const scheduleReload = (file: TFile) => {
            if (!isInScriptsFolder(file)) return;
            if (this.reloadDebounceTimer) clearTimeout(this.reloadDebounceTimer);
            this.reloadDebounceTimer = setTimeout(async () => {
                await this.reloadScripts();
                // new Notice('🔄 Script Runner: scripts reloaded.');
            }, 500);
        };

        this.registerEvent(this.app.vault.on('create', scheduleReload));

        // On delete: remove from startup list if present, then reload
        this.registerEvent(this.app.vault.on('delete', (file) => {
            if (!(file instanceof TFile)) return;
            if (!isInScriptsFolder(file)) return;

            const deletedName = file.basename;
            const idx = this.settings.startupScripts.indexOf(deletedName);
            if (idx !== -1) {
                this.settings.startupScripts.splice(idx, 1);
                this.saveSettings();
                // new Notice(`🗑️ "${deletedName}" removed from startup scripts.`);
            }

            scheduleReload(file);
        }));

        // Rename: update startup list + migrate hotkeys, then reload
        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            if (!(file instanceof TFile)) return;
            const folder = this.settings.scriptsFolder.replace(/\/$/, '');
            if (file.extension !== 'js') return;
            if (!oldPath.startsWith(folder + '/')) return;

            const oldName = oldPath.split('/').pop()?.replace('.js', '');
            const newName = file.basename;

            if (!oldName || oldName === newName) return;

            // Update startup list if old name was in it
            const idx = this.settings.startupScripts.indexOf(oldName);
            if (idx !== -1) {
                this.settings.startupScripts[idx] = newName;
                this.saveSettings();
                // new Notice(`✏️ Startup script renamed: ${oldName} → ${newName}`);
            }

            // Migrate hotkeys from the old command ID to the new one
            this.migrateHotkeys(oldName, newName);

            // Then trigger a reload
            scheduleReload(file);
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
        // new Notice(`⌨️ Hotkeys migrated from "${oldScriptName}" to "${newScriptName}".`);
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
        const folder = this.settings.scriptsFolder.replace(/\/$/, '');
        const files = this.app.vault.getFiles()
            .filter(f => f.path.startsWith(folder + '/') && f.extension === 'js');

        for (const file of files) {
            const scriptPath = path.join(basePath, file.path);

            this.loadedScripts.push({ name: file.basename, scriptPath });

            this.addCommand({
                id: file.basename.toLowerCase(),
                name: file.basename,
                callback: () => this.runScript(scriptPath)
            });
            this.registeredCommandIds.push(file.basename.toLowerCase());
        }

        this.loadedScripts.sort((a, b) => a.name.localeCompare(b.name));

        // Script palette command
        this.addCommand({
            id: 'open-script-palette',
            name: 'Open Script Palette',
            callback: () => new ScriptPaletteModal(this.app, this.loadedScripts, (p) => this.runScript(p)).open()
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Script Runner' });

        // Scripts folder
        new Setting(containerEl)
            .setName('Scripts folder')
            .setDesc('Vault-relative path to the folder containing your JS scripts.')
            .addText(text => text
                .setPlaceholder('Scripts')
                .setValue(this.plugin.settings.scriptsFolder)
                .onChange(async (value) => {
                    this.plugin.settings.scriptsFolder = value.trim();
                    await this.plugin.saveSettings();
                })
            );

        // Startup scripts
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
```

### V1
#### manifest.json
```json
{
	"id": "script-runner",
	"name": "Script Runner",
	"version": "1.0.0",
	"minAppVersion": "0.15.0",
	"description": "Runs JS scripts from vault as commands",
	"author": "Julian Ventura",
	"authorUrl": "https://obsidian.md",
	"fundingUrl": "https://obsidian.md/pricing",
	"isDesktopOnly": false
}
```
#### Main.ts
```typescript
import { App, Plugin, PluginSettingTab, Setting, SuggestModal, AbstractInputSuggest, Notice, TFile } from 'obsidian';
import * as path from 'path';

interface ScriptRunnerSettings {
    startupScripts: string[];
    scriptsFolder: string;
}

const DEFAULT_SETTINGS: ScriptRunnerSettings = {
    startupScripts: [],
    scriptsFolder: 'Scripts'
};

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

// --- Script palette modal ---
class ScriptPaletteModal extends SuggestModal<{ name: string, fn: Function }> {
    private scripts: { name: string, fn: Function }[];

    constructor(app: App, scripts: { name: string, fn: Function }[]) {
        super(app);
        this.scripts = scripts;
        this.setPlaceholder('Search scripts...');
    }

    onOpen(): void {
        super.onOpen();
        setTimeout(() => this.inputEl.focus(), 50);
    }

    getSuggestions(query: string): { name: string, fn: Function }[] {
        return this.scripts.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(item: { name: string, fn: Function }, el: HTMLElement): void {
        el.createEl('span', { text: item.name });
    }

    onChooseSuggestion(item: { name: string, fn: Function }): void {
        item.fn({ app: this.app, obsidian: require('obsidian') });
    }
}

// --- Main plugin ---
export default class ScriptRunner extends Plugin {
    settings: ScriptRunnerSettings;
    loadedScripts: { name: string, fn: Function }[] = [];
    registeredCommandIds: string[] = [];
    private reloadDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new ScriptRunnerSettingTab(this.app, this));
        // Register all script commands immediately, then run startup scripts
        // only once the workspace is fully ready (so they can safely access
        // the editor, active leaf, etc.)
        await this.reloadScripts();
        this.app.workspace.onLayoutReady(() => this.runStartupScripts());

        const isInScriptsFolder = (file: TFile) => {
            const folder = this.settings.scriptsFolder.replace(/\/$/, '');
            return file.extension === 'js' && file.path.startsWith(folder + '/');
        };

        // Auto-reload on create
        const scheduleReload = (file: TFile) => {
            if (!isInScriptsFolder(file)) return;
            if (this.reloadDebounceTimer) clearTimeout(this.reloadDebounceTimer);
            this.reloadDebounceTimer = setTimeout(async () => {
                await this.reloadScripts();
                // new Notice('🔄 Script Runner: scripts reloaded.');
            }, 500);
        };

        this.registerEvent(this.app.vault.on('create', scheduleReload));

        // On delete: remove from startup list if present, then reload
        this.registerEvent(this.app.vault.on('delete', (file) => {
            if (!(file instanceof TFile)) return;
            if (!isInScriptsFolder(file)) return;

            const deletedName = file.basename;
            const idx = this.settings.startupScripts.indexOf(deletedName);
            if (idx !== -1) {
                this.settings.startupScripts.splice(idx, 1);
                this.saveSettings();
                // new Notice(`🗑️ "${deletedName}" removed from startup scripts.`);
            }

            scheduleReload(file);
        }));

        // Rename: update startup list + migrate hotkeys, then reload
        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            if (!(file instanceof TFile)) return;
            const folder = this.settings.scriptsFolder.replace(/\/$/, '');
            if (file.extension !== 'js') return;
            if (!oldPath.startsWith(folder + '/')) return;

            const oldName = oldPath.split('/').pop()?.replace('.js', '');
            const newName = file.basename;

            if (!oldName || oldName === newName) return;

            // Update startup list if old name was in it
            const idx = this.settings.startupScripts.indexOf(oldName);
            if (idx !== -1) {
                this.settings.startupScripts[idx] = newName;
                this.saveSettings();
                // new Notice(`✏️ Startup script renamed: ${oldName} → ${newName}`);
            }

            // Migrate hotkeys from the old command ID to the new one
            this.migrateHotkeys(oldName, newName);

            // Then trigger a reload
            scheduleReload(file);
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
        // new Notice(`⌨️ Hotkeys migrated from "${oldScriptName}" to "${newScriptName}".`);
    }

    async runStartupScripts() {
        const params = { app: this.app, obsidian: require('obsidian') };
        for (const script of this.loadedScripts) {
            if (this.settings.startupScripts.includes(script.name)) {
                await script.fn(params);
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
        const folder = this.settings.scriptsFolder.replace(/\/$/, '');
        const files = this.app.vault.getFiles()
            .filter(f => f.path.startsWith(folder + '/') && f.extension === 'js');

        for (const file of files) {
            const scriptPath = path.join(basePath, file.path);
            const fn = require(scriptPath);

            this.loadedScripts.push({ name: file.basename, fn });

            this.addCommand({
                id: file.basename.toLowerCase(),
                name: file.basename,
                callback: () => fn({ app: this.app, obsidian: require('obsidian') })
            });
            this.registeredCommandIds.push(file.basename.toLowerCase());
        }

        this.loadedScripts.sort((a, b) => a.name.localeCompare(b.name));

        // Script palette command
        this.addCommand({
            id: 'open-script-palette',
            name: 'Open Script Palette',
            callback: () => new ScriptPaletteModal(this.app, this.loadedScripts).open()
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Script Runner' });

        // Scripts folder
        new Setting(containerEl)
            .setName('Scripts folder')
            .setDesc('Vault-relative path to the folder containing your JS scripts.')
            .addText(text => text
                .setPlaceholder('Scripts')
                .setValue(this.plugin.settings.scriptsFolder)
                .onChange(async (value) => {
                    this.plugin.settings.scriptsFolder = value.trim();
                    await this.plugin.saveSettings();
                })
            );

        // Startup scripts
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
```
## Thoughts
- Typing into a markdown file seems to lag again.
	- Closing an open markdown file does not reduce the lag
	- Closing a website seems to have the lag persist
	- I might attribute it to QuickAdd for now. I did change a few scripts so running it several times may have caused a memory leak.
	- For future reference, if Obsidian increases above 1.15GB (up to 1.7GB), then you might have some kind of memory leak somewhere
	- Maybe the lag also came from updating copilot and so I just needed to restart obsidian for it to properly work as well.
	- Obsidian does seem to increase memory usage up to 1.5GB though when I have a side-panel of the web viewer open (but at least the typing does not seem to be as affected). So at least that is good. 
- I don't think the dark viewer script is causing this because while it's set to "off", the lag still occurs
	- And the lag is occurring even while Obsidian only has 1.48GB in memory right now