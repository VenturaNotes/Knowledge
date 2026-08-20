import { 
    App, 
    Plugin, 
    PluginSettingTab, 
    Setting, 
    SuggestModal, 
    TFile, 
    TFolder,
    parseFrontMatterAliases,
    setIcon,
    AbstractInputSuggest
} from 'obsidian';

interface PrefixRule {
    prefix: string;                  // e.g. "+" or "@" or "" (default)
    mode: 'include' | 'exclude';     // 'include' = only search in; 'exclude' = search all except
    folders: string[];               // selected folders
    excludedExtensions: string[];    // e.g. ["png", "jpg", "canvas"]
}

interface LeanSwitcherSettings {
    prefixRules: PrefixRule[];
    maxResults: number;
}

const DEFAULT_SETTINGS: LeanSwitcherSettings = {
    prefixRules: [],
    maxResults: 40
};

interface SwitcherItem {
    file: TFile;
    matchedAlias?: string;
    isRecent: boolean;
    recentIndex: number;
    score: number;
    tokens: string[];
}

// --- Folder Autocomplete Suggest for Settings ---
class FolderSuggest extends AbstractInputSuggest<string> {
    private onSelectCallback: (folder: string) => void;

    constructor(app: App, inputEl: HTMLInputElement, onSelectCallback: (folder: string) => void) {
        super(app, inputEl);
        this.onSelectCallback = onSelectCallback;
    }

    getSuggestions(query: string): string[] {
        const queryLower = query.toLowerCase();
        const folders: string[] = [];
        
        const walk = (folder: TFolder) => {
            for (const child of folder.children) {
                if (child instanceof TFolder) {
                    folders.push(child.path);
                    walk(child);
                }
            }
        };
        walk(this.app.vault.getRoot());

        return folders.filter(f => f.toLowerCase().includes(queryLower));
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.createEl('span', { text: value });
    }

    selectSuggestion(value: string): void {
        this.onSelectCallback(value);
        this.close();
    }
}

// --- Quick Switcher Modal ---
class LeanSwitcherModal extends SuggestModal<SwitcherItem> {
    plugin: LeanSwitcherPlugin;
    private recentPathsMap: Map<string, number>;

    constructor(app: App, plugin: LeanSwitcherPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder("Search files...");
        
        this.recentPathsMap = new Map<string, number>();
        const recentPaths = this.app.workspace.getLastOpenFiles();
        recentPaths.forEach((path, idx) => this.recentPathsMap.set(path, idx));
    }

    private isExcluded(file: TFile, activeRule: PrefixRule | null): boolean {
        if (!activeRule) return false;

        const path = file.path;
        const ext = file.extension.toLowerCase();

        // 1. Check rule's excluded extensions
        const isExtExcluded = activeRule.excludedExtensions.some(e => {
            const clean = e.trim().replace(/^\./, '').toLowerCase();
            return clean.length > 0 && ext === clean;
        });
        if (isExtExcluded) return true;

        // 2. Check rule's folder filters
        if (activeRule.folders.length > 0) {
            const inListedFolder = activeRule.folders.some(f => {
                const normalized = f.trim().replace(/\/$/, '');
                return normalized.length > 0 && (path.startsWith(normalized + '/') || path === normalized);
            });

            if (activeRule.mode === 'include') {
                if (!inListedFolder) return true;
            } else if (activeRule.mode === 'exclude') {
                if (inListedFolder) return true;
            }
        }

        return false;
    }

    private resolvePrefixRule(query: string): { actualQuery: string; rule: PrefixRule | null } {
        const sortedRules = [...this.plugin.settings.prefixRules]
            .filter(r => r.prefix.trim().length > 0)
            .sort((a, b) => b.prefix.length - a.prefix.length);

        for (const rule of sortedRules) {
            const p = rule.prefix.trim().toLowerCase();
            if (query.startsWith(p)) {
                return {
                    actualQuery: query.slice(p.length).trim(),
                    rule
                };
            }
        }

        const defaultRule = this.plugin.settings.prefixRules.find(r => r.prefix.trim() === '') ?? null;
        return { actualQuery: query, rule: defaultRule };
    }

    getSuggestions(query: string): SwitcherItem[] {
        const raw = query.trim().toLowerCase();
        const { actualQuery, rule: activeRule } = this.resolvePrefixRule(raw);
        
        const tokens = actualQuery.split(/\s+/).filter(t => t.length > 0);
        const allFiles = this.app.vault.getFiles();

        if (tokens.length === 0) {
            return allFiles
                .filter(file => !this.isExcluded(file, activeRule))
                .sort((a, b) => {
                    const recA = this.recentPathsMap.get(a.path) ?? 999999;
                    const recB = this.recentPathsMap.get(b.path) ?? 999999;
                    return recA - recB;
                })
                .slice(0, this.plugin.settings.maxResults)
                .map(file => ({
                    file,
                    isRecent: this.recentPathsMap.has(file.path),
                    recentIndex: this.recentPathsMap.get(file.path) ?? 999999,
                    score: 0,
                    tokens: []
                }));
        }

        const firstToken = tokens[0] ?? '';
        const results: SwitcherItem[] = [];

        for (const file of allFiles) {
            if (this.isExcluded(file, activeRule)) continue;

            const basenameLower = file.basename.toLowerCase();
            const pathLower = file.path.toLowerCase();
            const fileText = `${basenameLower} ${pathLower}`;

            const cache = this.app.metadataCache.getFileCache(file);
            const rawAliases = parseFrontMatterAliases(cache?.frontmatter);
            const aliases: string[] = Array.isArray(rawAliases) ? rawAliases : [];

            let matchedAlias: string | undefined;
            let matches = false;

            if (tokens.every(t => fileText.includes(t))) {
                matches = true;
            } else {
                for (const alias of aliases) {
                    const aliasLower = alias.toLowerCase();
                    if (tokens.every(t => aliasLower.includes(t) || fileText.includes(t))) {
                        matches = true;
                        matchedAlias = alias;
                        break;
                    }
                }
            }

            if (!matches) continue;

            let score = 0;
            const isRecent = this.recentPathsMap.has(file.path);
            const recentIndex = this.recentPathsMap.get(file.path) ?? 999999;

            if (isRecent) {
                score -= (100000 - recentIndex * 100);
            }

            const targetLength = matchedAlias !== undefined ? matchedAlias.length : file.basename.length;
            score += targetLength * 5;

            if (basenameLower === actualQuery || (matchedAlias !== undefined && matchedAlias.toLowerCase() === actualQuery)) {
                score -= 10000;
            }

            if (firstToken.length > 0 && basenameLower.startsWith(firstToken)) {
                score -= 1500;
            }

            results.push({
                file,
                matchedAlias,
                isRecent,
                recentIndex,
                score,
                tokens
            });
        }

        results.sort((a, b) => a.score - b.score);
        return results.slice(0, this.plugin.settings.maxResults);
    }

    private renderHighlightedText(container: HTMLElement, text: string, tokens: string[]) {
        if (tokens.length === 0) {
            container.createSpan({ text });
            return;
        }

        const textLower = text.toLowerCase();
        const intervals: [number, number][] = [];

        for (const token of tokens) {
            if (!token) continue;
            let pos = 0;
            while ((pos = textLower.indexOf(token, pos)) !== -1) {
                intervals.push([pos, pos + token.length]);
                pos += token.length;
            }
        }

        if (intervals.length === 0) {
            container.createSpan({ text });
            return;
        }

        intervals.sort((a, b) => a[0] - b[0]);
        const merged: [number, number][] = [];
        let current = intervals[0]!;

        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i]!;
            if (next[0] <= current[1]) {
                current[1] = Math.max(current[1], next[1]);
            } else {
                merged.push(current);
                current = next;
            }
        }
        merged.push(current);

        let lastIdx = 0;
        for (const [start, end] of merged) {
            if (start > lastIdx) {
                container.createSpan({ text: text.slice(lastIdx, start) });
            }
            container.createSpan({ 
                text: text.slice(start, end), 
                cls: 'suggestion-highlight-purple' 
            });
            lastIdx = end;
        }
        if (lastIdx < text.length) {
            container.createSpan({ text: text.slice(lastIdx) });
        }
    }

    renderSuggestion(item: SwitcherItem, el: HTMLElement): void {
        el.empty();
        el.addClass('lean-switcher-suggestion');

        // Line 1: File Name with Purple Highlights
        const titleRow = el.createDiv({ cls: 'suggestion-title-row' });
        const displayText = item.matchedAlias !== undefined 
            ? `${item.file.basename} (${item.matchedAlias})`
            : item.file.basename;

        this.renderHighlightedText(titleRow, displayText, item.tokens);

        // Line 2: Folder Icon + Parent Path
        const parentPath = item.file.parent ? item.file.parent.path : '';
        const pathRow = el.createDiv({ cls: 'suggestion-path-row' });
        const folderIconEl = pathRow.createSpan({ cls: 'suggestion-folder-icon' });
        setIcon(folderIconEl, 'folder');

        pathRow.createSpan({ 
            text: parentPath === '/' || parentPath === '' ? 'Vault Root' : parentPath, 
            cls: 'suggestion-path-text' 
        });
    }

    onChooseSuggestion(item: SwitcherItem, evt: MouseEvent | KeyboardEvent): void {
        const newLeaf = evt.metaKey || evt.ctrlKey;
        const leaf = this.app.workspace.getLeaf(newLeaf ? 'tab' : false);
        leaf.openFile(item.file);
    }
}

// --- Main Plugin ---
export default class LeanSwitcherPlugin extends Plugin {
    settings: LeanSwitcherSettings = DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'open-lean-switcher',
            name: 'Open Lean Quick Switcher',
            callback: () => new LeanSwitcherModal(this.app, this).open()
        });

        this.addSettingTab(new LeanSwitcherSettingTab(this.app, this));
    }

    async loadSettings() {
        const loadedData = (await this.loadData()) as Partial<LeanSwitcherSettings> | null;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData ?? {});
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

// --- Settings Tab ---
class LeanSwitcherSettingTab extends PluginSettingTab {
    plugin: LeanSwitcherPlugin;

    constructor(app: App, plugin: LeanSwitcherPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Lean Quick Switcher Settings' });

        containerEl.createEl('p', { 
            text: 'Configure custom symbol prefixes. Use prefix "" (blank) to customize default search behavior without any symbol.',
            attr: { style: 'color: var(--text-muted); margin-bottom: 16px;' }
        });

        // 1. ADD RULE BUTTON (Placed Above the output cards)
        new Setting(containerEl)
            .setName('Add Prefix Mapping Rule')
            .setDesc('Add a new symbol with custom folder include/exclude rules')
            .addButton(btn => btn
                .setButtonText('+ Add Prefix Rule')
                .setCta()
                .onClick(async () => {
                    this.plugin.settings.prefixRules.push({
                        prefix: '',
                        mode: 'include',
                        folders: [],
                        excludedExtensions: []
                    });
                    await this.plugin.saveSettings();
                    this.display();
                })
            );

        // 2. RULES LIST CONTAINER (Renders below the button)
        const rulesContainer = containerEl.createDiv({ 
            attr: { style: 'margin-top: 16px; margin-bottom: 24px;' } 
        });

        this.plugin.settings.prefixRules.forEach((rule, idx) => {
            const ruleBox = rulesContainer.createDiv({
                attr: { 
                    style: 'border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 14px; margin-bottom: 16px; background: var(--background-secondary);' 
                }
            });

            // Header row: Symbol + Left-Aligned Dropdown + Delete button
            const headerRow = ruleBox.createDiv({
                attr: { style: 'display: flex; gap: 10px; align-items: center; margin-bottom: 12px;' }
            });

            headerRow.createEl('span', { text: 'Prefix Symbol:', attr: { style: 'font-weight: bold; font-size: 13px;' } });
            
            const prefixInput = headerRow.createEl('input', {
                attr: { type: 'text', placeholder: 'e.g. + (blank = default)', style: 'width: 130px;' }
            });
            prefixInput.value = rule.prefix;
            prefixInput.addEventListener('change', async () => {
                rule.prefix = prefixInput.value.trim();
                await this.plugin.saveSettings();
            });

            // Clean Left-Aligned Dropdown Selection
            const modeSelect = headerRow.createEl('select', { 
                cls: 'dropdown',
                attr: { 
                    style: 'width: auto; max-width: fit-content; flex: 0 0 auto; cursor: pointer; font-weight: 500; text-align: left; text-align-last: left; padding: 4px 12px; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 6px;' 
                } 
            });
            modeSelect.createEl('option', { value: 'include', text: 'Only search within folders' });
            modeSelect.createEl('option', { value: 'exclude', text: 'Search everywhere EXCEPT folders' });
            modeSelect.value = rule.mode;
            modeSelect.addEventListener('change', async () => {
                rule.mode = modeSelect.value as 'include' | 'exclude';
                await this.plugin.saveSettings();
                renderFolderTags();
            });

            const delBtn = headerRow.createEl('button', { 
                text: '✕ Delete Rule', 
                attr: { style: 'margin-left: auto; cursor: pointer; color: var(--text-error);' } 
            });
            delBtn.addEventListener('click', async () => {
                this.plugin.settings.prefixRules.splice(idx, 1);
                await this.plugin.saveSettings();
                this.display();
            });

            // Folder Tags & Autocomplete row
            const folderSection = ruleBox.createDiv({ attr: { style: 'margin-bottom: 10px;' } });
            folderSection.createEl('div', { text: 'Target Folders:', attr: { style: 'font-size: 12px; color: var(--text-muted); margin-bottom: 4px;' } });
            
            const folderTagsContainer = folderSection.createDiv({ 
                attr: { style: 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;' } 
            });

            const renderFolderTags = () => {
                folderTagsContainer.empty();
                if (rule.folders.length === 0) {
                    folderTagsContainer.createEl('span', { 
                        text: rule.mode === 'include' ? 'No folders added (will match nothing)' : 'No folders added (searches whole vault)', 
                        attr: { style: 'font-size: 12px; color: var(--text-muted); font-style: italic;' } 
                    });
                }
                rule.folders.forEach((folderPath, fIdx) => {
                    const tag = folderTagsContainer.createDiv({
                        attr: { 
                            style: 'background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 4px; padding: 2px 8px; display: flex; align-items: center; gap: 6px; font-size: 12px;' 
                        }
                    });
                    tag.createSpan({ text: folderPath });
                    const removeTag = tag.createSpan({ 
                        text: '✕', 
                        attr: { style: 'cursor: pointer; color: var(--text-muted); font-weight: bold;' } 
                    });
                    removeTag.addEventListener('click', async () => {
                        rule.folders.splice(fIdx, 1);
                        await this.plugin.saveSettings();
                        renderFolderTags();
                    });
                });
            };
            renderFolderTags();

            // Folder autocomplete input
            const addFolderInput = folderSection.createEl('input', {
                attr: { type: 'text', placeholder: 'Type to pick a folder from autocomplete...', style: 'width: 100%;' }
            });
            new FolderSuggest(this.app, addFolderInput, async (selectedFolder) => {
                if (!rule.folders.includes(selectedFolder)) {
                    rule.folders.push(selectedFolder);
                    await this.plugin.saveSettings();
                    renderFolderTags();
                }
                addFolderInput.value = '';
            });

            // Excluded Extensions row
            const extSection = ruleBox.createDiv();
            extSection.createEl('div', { text: 'Excluded File Extensions for this rule (comma-separated):', attr: { style: 'font-size: 12px; color: var(--text-muted); margin-bottom: 4px;' } });
            
            const extInput = extSection.createEl('input', {
                attr: { type: 'text', placeholder: 'e.g. .png, .jpg, .canvas', style: 'width: 100%;' }
            });
            extInput.value = rule.excludedExtensions.join(', ');
            extInput.addEventListener('change', async () => {
                rule.excludedExtensions = extInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                await this.plugin.saveSettings();
            });
        });

        // 3. DISPLAY LIMITS (At the bottom)
        new Setting(containerEl)
            .setName('Max Results')
            .setDesc('Maximum number of items to show in the search results.')
            .addSlider(slider => slider
                .setLimits(10, 100, 5)
                .setValue(this.plugin.settings.maxResults)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxResults = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}