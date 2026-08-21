import { 
    App, 
    Plugin, 
    PluginSettingTab, 
    Setting, 
    SuggestModal, 
    TFile, 
    TFolder,
    MarkdownView,
    parseFrontMatterAliases,
    setIcon,
    AbstractInputSuggest,
    Notice
} from 'obsidian';

interface PrefixRule {
    name: string;                    // e.g. "Topic Search" or "Task Search"
    prefix: string;                  // e.g. "-" or "+" or "" (default)
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
    allAliases: string[];
    isAliasMatch: boolean;
    isRecent: boolean;
    recentIndex: number;
    score: number;
    tokens: string[];
}

interface HeadingItem {
    heading: string;
    level: number;
    line: number;
    isMatch: boolean;
    matchIndex?: number;
    totalMatches?: number;
    tokens: string[];
}

// --- Text Match Highlighting Helper ---
function renderHighlightedText(container: HTMLElement, text: string, tokens: string[], isHeadingMatch = false) {
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
    let current = intervals[0];
    if (!current) {
        container.createSpan({ text });
        return;
    }

    for (let i = 1; i < intervals.length; i++) {
        const next = intervals[i];
        if (!next) continue;
        if (next[0] <= current[1]) {
            current[1] = Math.max(current[1], next[1]);
        } else {
            merged.push(current);
            current = next;
        }
    }
    merged.push(current);

    let lastIdx = 0;
    const highlightClass = isHeadingMatch ? 'heading-match-char' : 'suggestion-highlight-purple';

    for (const [start, end] of merged) {
        if (start > lastIdx) {
            container.createSpan({ text: text.slice(lastIdx, start) });
        }
        container.createSpan({ 
            text: text.slice(start, end), 
            cls: highlightClass 
        });
        lastIdx = end;
    }
    if (lastIdx < text.length) {
        container.createSpan({ text: text.slice(lastIdx) });
    }
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

// --- 1. File Quick Switcher Modal (File Search) ---
class LeanSwitcherModal extends SuggestModal<SwitcherItem> {
    plugin: LeanSwitcherPlugin;
    private recentPathsMap: Map<string, number>;
    private headerSearchLabelEl: HTMLElement | null = null;
    private headerCountBadgeEl: HTMLElement | null = null;
    private headerSearchIconEl: HTMLElement | null = null;

    constructor(app: App, plugin: LeanSwitcherPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder("");

        // In-memory recent files list provided by Obsidian (zero disk writes)
        this.recentPathsMap = new Map<string, number>();
        const recentPaths = this.app.workspace.getLastOpenFiles();
        recentPaths.forEach((path, idx) => this.recentPathsMap.set(path, idx));

        // Register Command + Enter (or Ctrl + Enter) to open in a new tab
        this.scope.register(['Mod'], 'Enter', (evt: KeyboardEvent) => {
            evt.preventDefault();
            const chooser = (this as any).chooser;
            if (chooser && typeof chooser.useSelectedItem === 'function') {
                chooser.useSelectedItem(evt);
            }
            return false;
        });
    }

    onOpen() {
        super.onOpen();
        this.modalEl.addClass('lean-switcher-modal');

        // Hide native close/clear buttons that overlay our header
        const closeBtn = this.modalEl.querySelector('.modal-close-button');
        if (closeBtn) {
            (closeBtn as HTMLElement).style.display = 'none';
        }

        // Inject custom top-right info header (Search Name + Count Badge)
        const container = this.inputEl.parentElement;
        if (container) {
            container.addClass('lean-switcher-input-container');

            const infoBox = container.createDiv({ cls: 'lean-switcher-header-info' });

            const searchTypeBox = infoBox.createDiv({ cls: 'lean-switcher-search-type' });
            this.headerSearchIconEl = searchTypeBox.createSpan({ cls: 'lean-switcher-search-icon' });
            setIcon(this.headerSearchIconEl, 'file-search');
            this.headerSearchLabelEl = searchTypeBox.createSpan({ cls: 'lean-switcher-search-name', text: 'File Search' });

            this.headerCountBadgeEl = infoBox.createDiv({ cls: 'lean-switcher-count-badge', text: '0 / 0' });

            // Immediately calculate and show custom name and counts on open
            this.updateHeaderInfo(this.inputEl.value);
        }
    }

    private updateHeaderInfo(query: string, renderedCount?: number) {
        const raw = query.trim().toLowerCase();
        const { rule: activeRule } = this.resolvePrefixRule(raw);

        // Resolve custom search name (including blank prefix rules)
        const searchName = (activeRule && activeRule.name && activeRule.name.trim().length > 0)
            ? activeRule.name.trim()
            : 'File Search';

        if (this.headerSearchLabelEl) {
            this.headerSearchLabelEl.setText(searchName);
        }

        const allFiles = this.app.vault.getFiles();
        const availableFiles = allFiles.filter(file => !this.isExcluded(file, activeRule));
        const totalScopeCount = availableFiles.length;

        if (this.headerCountBadgeEl) {
            const count = renderedCount !== undefined 
                ? renderedCount 
                : Math.min(totalScopeCount, this.plugin.settings.maxResults);
            this.headerCountBadgeEl.setText(`${count} / ${totalScopeCount}`);
        }
    }

    private isExcluded(file: TFile, activeRule: PrefixRule | null): boolean {
        if (!activeRule) return false;

        const path = file.path;
        const ext = file.extension.toLowerCase();

        const isExtExcluded = activeRule.excludedExtensions.some(e => {
            const clean = e.trim().replace(/^\./, '').toLowerCase();
            return clean.length > 0 && ext === clean;
        });
        if (isExtExcluded) return true;

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

        // Fallback to the blank prefix rule if configured
        const defaultRule = this.plugin.settings.prefixRules.find(r => r.prefix.trim() === '') ?? null;
        return { actualQuery: query, rule: defaultRule };
    }

    getSuggestions(query: string): SwitcherItem[] {
        const raw = query.trim().toLowerCase();
        const { actualQuery, rule: activeRule } = this.resolvePrefixRule(raw);

        const tokens = actualQuery.split(/\s+/).filter(t => t.length > 0);
        const allFiles = this.app.vault.getFiles();

        const availableFiles = allFiles.filter(file => !this.isExcluded(file, activeRule));

        // 1. EMPTY QUERY
        if (tokens.length === 0) {
            const results = availableFiles
                .sort((a, b) => {
                    const recA = this.recentPathsMap.get(a.path) ?? 999999;
                    const recB = this.recentPathsMap.get(b.path) ?? 999999;
                    if (recA !== recB) return recA - recB;

                    const mtimeA = a.stat?.mtime ?? 0;
                    const mtimeB = b.stat?.mtime ?? 0;
                    if (mtimeB !== mtimeA) return mtimeB - mtimeA;

                    const lenA = a.basename.length;
                    const lenB = b.basename.length;
                    if (lenA !== lenB) return lenA - lenB;

                    return a.basename.localeCompare(b.basename);
                })
                .slice(0, this.plugin.settings.maxResults)
                .map(file => {
                    const cache = this.app.metadataCache.getFileCache(file);
                    const rawAliases = parseFrontMatterAliases(cache?.frontmatter);
                    const allAliases: string[] = Array.isArray(rawAliases) ? rawAliases : [];

                    return {
                        file,
                        matchedAlias: allAliases.length > 0 ? allAliases[0] : undefined,
                        allAliases,
                        isAliasMatch: false,
                        isRecent: this.recentPathsMap.has(file.path),
                        recentIndex: this.recentPathsMap.get(file.path) ?? 999999,
                        score: 0,
                        tokens: []
                    };
                });

            this.updateHeaderInfo(query, results.length);
            return results;
        }

        // 2. SEARCH QUERY MATCHING
        const firstToken = tokens[0] ?? '';
        const results: SwitcherItem[] = [];

        for (const file of availableFiles) {
            const basenameLower = file.basename.toLowerCase();
            const pathLower = file.path.toLowerCase();
            const fileText = `${basenameLower} ${pathLower}`;

            const cache = this.app.metadataCache.getFileCache(file);
            const rawAliases = parseFrontMatterAliases(cache?.frontmatter);
            const allAliases: string[] = Array.isArray(rawAliases) ? rawAliases : [];

            const basenameMatches = tokens.every(t => basenameLower.includes(t));

            let matchedAlias: string | undefined;
            let aliasMatches = false;
            for (const alias of allAliases) {
                const aliasLower = alias.toLowerCase();
                if (tokens.every(t => aliasLower.includes(t))) {
                    matchedAlias = alias;
                    aliasMatches = true;
                    break;
                }
            }

            const pathMatches = tokens.every(t => fileText.includes(t));

            if (!basenameMatches && !aliasMatches && !pathMatches) continue;

            const isDirectMatch = basenameMatches || aliasMatches;
            const isAliasMatch = !basenameMatches && aliasMatches;

            if (basenameMatches && allAliases.length > 0 && !matchedAlias) {
                matchedAlias = allAliases[0];
            }

            let score = 0;

            // --- STRICT TIER SYSTEM ---
            if (isDirectMatch) {
                score += 0; // Tier 1 base
            } else {
                score += 100000; // Tier 2 base (Path-only will NEVER beat a Tier 1 match)
            }

            // Recency sub-rank
            const isRecent = this.recentPathsMap.has(file.path);
            const recentIndex = this.recentPathsMap.get(file.path) ?? 999999;
            if (isRecent) {
                score -= Math.max(0, 25000 - recentIndex * 250);
            }

            // Exact & Substring Relevance
            const targetText = isAliasMatch && matchedAlias ? matchedAlias : file.basename;
            const targetLower = targetText.toLowerCase();

            const strippedTarget = targetLower.replace(/^\([a-z0-9]+\)\s*/i, '');

            if (targetLower === actualQuery || strippedTarget === actualQuery) {
                score -= 30000;
            } else if (targetLower.startsWith(actualQuery) || strippedTarget.startsWith(actualQuery)) {
                score -= 15000;
            } else if (targetLower.includes(actualQuery) || strippedTarget.includes(actualQuery)) {
                score -= 8000;
            }

            const words = targetLower.split(/[\s_\-()]+/);
            if (words.some(w => w.startsWith(firstToken))) {
                score -= 5000;
            }

            score += targetText.length * 2;

            const mtime = file.stat?.mtime ?? 0;
            score -= Math.min(500, mtime / 10000000000);

            results.push({
                file,
                matchedAlias,
                allAliases,
                isAliasMatch,
                isRecent,
                recentIndex,
                score,
                tokens
            });
        }

        results.sort((a, b) => {
            if (a.score !== b.score) return a.score - b.score;

            const lenA = a.file.basename.length;
            const lenB = b.file.basename.length;
            if (lenA !== lenB) return lenA - lenB;

            return a.file.basename.localeCompare(b.file.basename);
        });

        const slicedResults = results.slice(0, this.plugin.settings.maxResults);
        this.updateHeaderInfo(query, slicedResults.length);

        return slicedResults;
    }

    renderSuggestion(item: SwitcherItem, el: HTMLElement): void {
        el.empty();
        el.addClass('lean-switcher-suggestion');

        const parentPath = item.file.parent ? item.file.parent.path : '';
        const displayPath = parentPath === '/' || parentPath === '' ? 'Vault Root' : parentPath;

        // Row 1: Filename ALWAYS on top (bold title)
        const titleRow = el.createDiv({ cls: 'suggestion-title-row' });
        const titleText = titleRow.createSpan({ cls: 'suggestion-title-text' });
        renderHighlightedText(titleText, item.file.basename, item.tokens);

        // Extension pill badge for non-markdown files
        const ext = item.file.extension ? item.file.extension.toLowerCase() : '';
        if (ext && ext !== 'md') {
            titleRow.createSpan({ text: ext, cls: 'suggestion-ext-badge' });
        }

        // Row 2: [Folder Icon] Folder Path
        const pathRow = el.createDiv({ cls: 'suggestion-sub-row' });
        const folderIconEl = pathRow.createSpan({ cls: 'suggestion-inline-icon' });
        setIcon(folderIconEl, 'folder');
        pathRow.createSpan({ text: displayPath, cls: 'suggestion-sub-text' });

        // Row 3: [Arrow Icon] Matched Alias (if file has an alias)
        const aliasToDisplay = item.matchedAlias || (item.allAliases.length > 0 ? item.allAliases[0] : null);
        if (aliasToDisplay) {
            const aliasRow = el.createDiv({ cls: 'suggestion-sub-row' });
            const arrowIconEl = aliasRow.createSpan({ cls: 'suggestion-inline-icon' });
            setIcon(arrowIconEl, 'forward');
            const aliasText = aliasRow.createSpan({ cls: 'suggestion-sub-text' });
            renderHighlightedText(aliasText, aliasToDisplay, item.tokens);
        }
    }

    onChooseSuggestion(item: SwitcherItem, evt: MouseEvent | KeyboardEvent): void {
        const isNewTab = Boolean(evt && (evt.metaKey || evt.ctrlKey));
        const leaf = this.app.workspace.getLeaf(isNewTab ? 'tab' : false);
        leaf.openFile(item.file);
    }
}

// --- 2. Heading Switcher Modal (Reliable 1/3 Screen Height Positioning) ---
class LeanHeadingModal extends SuggestModal<HeadingItem> {
    private activeView: MarkdownView;
    private fileHeadings: HeadingItem[] = [];
    private currentMatchingIndices: number[] = [];
    private selectedHeadingLine: number | null = null;
    private currentTargetIndex = 0;

    constructor(app: App, activeView: MarkdownView) {
        super(app);
        this.activeView = activeView;
        this.setPlaceholder("Search headings in current note... (Tab to cycle matches)");

        this.limit = Infinity;

        if (!activeView.file) return;

        this.fileHeadings = this.extractAllHeadings(activeView);

        this.scope.register([], 'Tab', (evt: KeyboardEvent) => {
            evt.preventDefault();
            this.navigateMatches(true);
            return false;
        });

        this.scope.register(['Shift'], 'Tab', (evt: KeyboardEvent) => {
            evt.preventDefault();
            this.navigateMatches(false);
            return false;
        });

        this.scope.register(['Mod'], 'Enter', (evt: KeyboardEvent) => {
            evt.preventDefault();
            const chooser = (this as any).chooser;
            if (chooser && typeof chooser.useSelectedItem === 'function') {
                chooser.useSelectedItem(evt);
            }
            return false;
        });

        this.inputEl.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (evt.key === 'Tab') {
                evt.preventDefault();
                evt.stopPropagation();
                this.navigateMatches(!evt.shiftKey);
            }
        });
    }

    private extractAllHeadings(view: MarkdownView): HeadingItem[] {
        if (!view.file) return [];
        
        const cache = this.app.metadataCache.getFileCache(view.file);
        const headings = cache?.headings || [];

        return headings.map(h => ({
            heading: h.heading,
            level: h.level,
            line: h.position.start.line,
            isMatch: false,
            tokens: []
        }));
    }

    onOpen() {
        super.onOpen();

        this.limit = Infinity;

        const chooser = (this as any).chooser;
        if (!chooser) return;

        chooser.limit = Infinity;

        const originalSetSuggestions = chooser.setSuggestions?.bind(chooser);
        if (originalSetSuggestions) {
            chooser.setSuggestions = (items: any[]) => {
                originalSetSuggestions(items);

                if (items && items.length > 0) {
                    const targetIdx = Math.max(0, Math.min(this.currentTargetIndex, items.length - 1));
                    chooser.selectedItem = targetIdx;

                    if (chooser.suggestions) {
                        chooser.suggestions.forEach((el: HTMLElement, i: number) => {
                            if (i === targetIdx) {
                                el.addClass('is-selected');
                                el.scrollIntoView({ block: 'nearest' });
                            } else {
                                el.removeClass('is-selected');
                            }
                        });
                    }
                }
            };
        }

        const originalSetSelectedItem = chooser.setSelectedItem?.bind(chooser);
        if (originalSetSelectedItem) {
            chooser.setSelectedItem = (index: number, scroll?: boolean) => {
                originalSetSelectedItem(index, scroll);
                const h = this.fileHeadings[index];
                if (h) {
                    this.selectedHeadingLine = h.line;
                }
            };
        }
    }

    private navigateMatches(forward: boolean) {
        if (this.currentMatchingIndices.length === 0) return;

        const chooser = (this as any).chooser;
        const currentItemIdx: number = chooser ? chooser.selectedItem : -1;

        let matchPos = this.currentMatchingIndices.indexOf(currentItemIdx);

        if (matchPos === -1) {
            matchPos = forward ? 0 : this.currentMatchingIndices.length - 1;
        } else {
            if (forward) {
                matchPos = (matchPos + 1) % this.currentMatchingIndices.length;
            } else {
                matchPos = (matchPos - 1 + this.currentMatchingIndices.length) % this.currentMatchingIndices.length;
            }
        }

        const targetHeadingIdx = this.currentMatchingIndices[matchPos];
        if (targetHeadingIdx !== undefined) {
            const targetHeading = this.fileHeadings[targetHeadingIdx];
            if (targetHeading) {
                this.selectedHeadingLine = targetHeading.line;
                this.currentTargetIndex = targetHeadingIdx;
            }

            if (chooser && typeof chooser.setSelectedItem === 'function') {
                chooser.setSelectedItem(targetHeadingIdx);
            }
        }
    }

    getSuggestions(query: string): HeadingItem[] {
        if (this.activeView.file) {
            this.fileHeadings = this.extractAllHeadings(this.activeView);
        }

        const raw = query.trim().toLowerCase();
        const tokens = raw.split(/\s+/).filter(t => t.length > 0);

        if (tokens.length === 0) {
            this.currentMatchingIndices = [];
            this.selectedHeadingLine = null;
            this.currentTargetIndex = 0;
            return this.fileHeadings.map(h => ({
                ...h,
                isMatch: false,
                tokens: []
            }));
        }

        const matchingIndices: number[] = [];
        this.fileHeadings.forEach((item, idx) => {
            const headingLower = item.heading.toLowerCase();
            if (tokens.every(t => headingLower.includes(t))) {
                matchingIndices.push(idx);
            }
        });

        this.currentMatchingIndices = matchingIndices;
        const totalMatches = matchingIndices.length;

        const fullTree = this.fileHeadings.map((item, idx) => {
            const matchPos = matchingIndices.indexOf(idx);
            const isMatch = matchPos !== -1;

            return {
                ...item,
                isMatch,
                matchIndex: isMatch ? matchPos + 1 : undefined,
                totalMatches: isMatch ? totalMatches : undefined,
                tokens: isMatch ? tokens : []
            };
        });

        if (matchingIndices.length > 0) {
            let targetIdx: number | undefined;

            if (this.selectedHeadingLine !== null) {
                const stillMatches = matchingIndices.find(idx => {
                    const h = this.fileHeadings[idx];
                    return h && h.line === this.selectedHeadingLine;
                });
                if (stillMatches !== undefined) {
                    targetIdx = stillMatches;
                }
            }

            if (targetIdx === undefined) {
                targetIdx = matchingIndices[0];
                const firstHeading = targetIdx !== undefined ? this.fileHeadings[targetIdx] : undefined;
                this.selectedHeadingLine = firstHeading ? firstHeading.line : null;
            }

            this.currentTargetIndex = targetIdx ?? 0;
        } else {
            this.currentTargetIndex = 0;
        }

        return fullTree;
    }

    renderSuggestion(item: HeadingItem, el: HTMLElement): void {
        el.empty();
        el.addClass('lean-heading-suggestion');
        if (item.isMatch) {
            el.addClass('is-heading-match');
        }

        const row = el.createDiv({ cls: 'heading-item-row' });

        const leftBox = row.createDiv({ cls: 'heading-left-box' });
        const indentPx = Math.max(0, item.level - 1) * 18;
        leftBox.style.paddingLeft = `${indentPx}px`;

        leftBox.createSpan({ text: '○', cls: 'heading-bullet' });

        const titleSpan = leftBox.createSpan({ 
            cls: `heading-title ${item.isMatch ? 'heading-title-matched' : ''}` 
        });
        renderHighlightedText(titleSpan, item.heading, item.tokens, item.isMatch);

        if (item.isMatch && item.matchIndex !== undefined && item.totalMatches !== undefined) {
            const badge = row.createSpan({ cls: 'heading-match-badge' });
            badge.setText(`${item.matchIndex} / ${item.totalMatches}`);
        }
    }

    async onChooseSuggestion(item: HeadingItem, evt: MouseEvent | KeyboardEvent): Promise<void> {
        const isNewTab = Boolean(evt && (evt.metaKey || evt.ctrlKey));
        let view = this.activeView;

        if (isNewTab && view.file) {
            const newLeaf = this.app.workspace.getLeaf('tab');
            await newLeaf.openFile(view.file);
            const newView = newLeaf.view;
            if (newView instanceof MarkdownView) {
                view = newView;
            }
        }

        const editor = view.editor;
        const maxLine = editor.lineCount() > 0 ? editor.lineCount() - 1 : 0;
        const safeLine = Math.min(item.line, maxLine);

        // 1. Unfold target section natively via Obsidian's ephemeral state
        view.leaf.setEphemeralState({ line: safeLine });
        editor.setCursor({ line: safeLine, ch: 0 });

        // 2. Wait for Obsidian's initial navigation pass to finish, then accurately adjust to 1/3 height
        setTimeout(() => {
            requestAnimationFrame(() => {
                const scroller = view.contentEl?.querySelector<HTMLElement>('.cm-scroller');
                if (!scroller || scroller.clientHeight === 0) return;

                const cm = (editor as any).cm;
                if (!cm) return;

                const pos = editor.posToOffset({ line: safeLine, ch: 0 });
                const coords = cm.coordsAtPos(pos);
                if (!coords) return;

                const scrollerRect = scroller.getBoundingClientRect();
                const currentY = coords.top - scrollerRect.top;
                const targetY = scroller.clientHeight / 3;

                scroller.scrollTop += Math.round(currentY - targetY);
                editor.focus();
            });
        }, 50);
    }
}

// --- Main Plugin ---
export default class LeanSwitcherPlugin extends Plugin {
    settings: LeanSwitcherSettings = DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();

        // 1. File Search Command
        this.addCommand({
            id: 'open-lean-switcher',
            name: 'File Search',
            callback: () => new LeanSwitcherModal(this.app, this).open()
        });

        // 2. Heading Switcher Command
        this.addCommand({
            id: 'open-lean-heading-switcher',
            name: 'Jump to Heading in Current Note',
            checkCallback: (checking: boolean) => {
                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView && activeView.file) {
                    if (!checking) {
                        new LeanHeadingModal(this.app, activeView).open();
                    }
                    return true;
                }
                if (!checking) {
                    new Notice('No active Markdown note open.');
                }
                return false;
            }
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
            text: 'Configure custom symbol prefixes and name your search types (e.g. "Topic Search"). Use prefix "" (blank) to customize default search behavior.',
            attr: { style: 'color: var(--text-muted); margin-bottom: 16px;' }
        });

        // 1. ADD RULE BUTTON
        new Setting(containerEl)
            .setName('Add Prefix Mapping Rule')
            .setDesc('Add a new symbol with custom folder include/exclude rules and a custom search name')
            .addButton(btn => btn
                .setButtonText('+ Add Prefix Rule')
                .setCta()
                .onClick(async () => {
                    this.plugin.settings.prefixRules.push({
                        name: '',
                        prefix: '',
                        mode: 'include',
                        folders: [],
                        excludedExtensions: []
                    });
                    await this.plugin.saveSettings();
                    this.display();
                })
            );

        // 2. RULES LIST CONTAINER
        const rulesContainer = containerEl.createDiv({ 
            attr: { style: 'margin-top: 16px; margin-bottom: 24px;' } 
        });

        this.plugin.settings.prefixRules.forEach((rule, idx) => {
            const ruleBox = rulesContainer.createDiv({
                attr: { 
                    style: 'border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 14px; margin-bottom: 16px; background: var(--background-secondary);' 
                }
            });

            // Row 1: Search Name + Prefix Symbol + Mode Select + Delete button
            const headerRow = ruleBox.createDiv({
                attr: { style: 'display: flex; gap: 10px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;' }
            });

            headerRow.createEl('span', { text: 'Search Name:', attr: { style: 'font-weight: bold; font-size: 13px;' } });
            const nameInput = headerRow.createEl('input', {
                attr: { type: 'text', placeholder: 'e.g. Topic Search', style: 'width: 140px;' }
            });
            nameInput.value = rule.name ?? '';
            nameInput.addEventListener('change', async () => {
                rule.name = nameInput.value.trim();
                await this.plugin.saveSettings();
            });

            headerRow.createEl('span', { text: 'Prefix:', attr: { style: 'font-weight: bold; font-size: 13px; margin-left: 6px;' } });
            const prefixInput = headerRow.createEl('input', {
                attr: { type: 'text', placeholder: 'e.g. - (blank = default)', style: 'width: 90px;' }
            });
            prefixInput.value = rule.prefix;
            prefixInput.addEventListener('change', async () => {
                rule.prefix = prefixInput.value.trim();
                await this.plugin.saveSettings();
            });

            // Mode dropdown
            const modeSelect = headerRow.createEl('select', { 
                cls: 'dropdown',
                attr: { 
                    style: 'width: auto; max-width: fit-content; flex: 0 0 auto; cursor: pointer; font-weight: 500; text-align: left; text-align-last: left; padding: 4px 10px; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 6px;' 
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
                text: '✕ Delete', 
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

        // 3. DISPLAY LIMITS
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