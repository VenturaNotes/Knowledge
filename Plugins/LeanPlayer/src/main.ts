import { 
    App, 
    Plugin, 
    PluginSettingTab, 
    Setting, 
    SuggestModal, 
    Notice, 
    setIcon 
} from 'obsidian';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface TrackItem {
    name: string;          // e.g. "Bohemian Rhapsody"
    fullPath: string;      // full disk path
    folderPath: string;    // relative path e.g. "Queen/A Night at the Opera"
    ext: string;           // "mp3"
    score: number;
    tokens: string[];
    isRecent: boolean;
    recentIndex: number;
    customBadge?: { text: string; cls: string };
}

type EndOfTrackAction = 'next' | 'repeat' | 'stop';

interface LeanPlayerSettings {
    musicDirectory: string;
    showStatusBar: boolean;
    volume: number;        // 0.0 to 1.0
    recentTracks: string[]; // List of fullPaths (most recent first)
    endOfTrackAction: EndOfTrackAction;
}

const DEFAULT_SETTINGS: LeanPlayerSettings = {
    musicDirectory: '~/Music',
    showStatusBar: true,
    volume: 0.8,
    recentTracks: [],
    endOfTrackAction: 'next'
};

const SUPPORTED_EXTENSIONS = new Set(['.mp3', '.m4a', '.flac', '.wav', '.ogg', '.aac']);

function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

function expandHomeDir(p: string): string {
    if (p.startsWith('~')) {
        return path.join(os.homedir(), p.slice(1));
    }
    return p;
}

function getAudioMimeType(ext: string): string {
    switch (ext.toLowerCase().replace('.', '')) {
        case 'mp3': return 'audio/mpeg';
        case 'm4a':
        case 'aac': return 'audio/mp4';
        case 'flac': return 'audio/flac';
        case 'wav': return 'audio/wav';
        case 'ogg': return 'audio/ogg';
        default: return 'audio/mpeg';
    }
}

// --- Highlight Text Match Helper (Purple Highlight from Lean Switcher) ---
function renderHighlightedText(container: HTMLElement, text: string, tokens: string[]) {
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

// --- 1. Lean Player Search & Launch Modal ---
class LeanPlayerModal extends SuggestModal<TrackItem> {
    plugin: LeanPlayerPlugin;
    private recentPathsMap: Map<string, number>;
    private headerCountBadgeEl: HTMLElement | null = null;

    constructor(app: App, plugin: LeanPlayerPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder("Search tracks, artists, albums... (Enter to play)");

        this.recentPathsMap = new Map();
        this.plugin.settings.recentTracks.forEach((p, idx) => {
            this.recentPathsMap.set(p, idx);
        });
    }

    onOpen() {
        super.onOpen();
        this.modalEl.addClass('lean-player-modal');

        const container = this.inputEl.parentElement;
        if (container) {
            container.addClass('lean-player-input-container');

            const infoBox = container.createDiv({ cls: 'lean-player-header-info' });
            const searchTypeBox = infoBox.createDiv({ cls: 'lean-player-search-type' });

            const iconEl = searchTypeBox.createSpan({ cls: 'lean-player-search-icon' });
            setIcon(iconEl, 'music');
            searchTypeBox.createSpan({ text: 'Lean Player' });

            this.headerCountBadgeEl = infoBox.createDiv({ cls: 'lean-player-count-badge', text: '0 / 0' });
            this.updateHeaderCounts(this.plugin.library.length, this.plugin.library.length);
        }

        // Automatic search bar focus
        requestAnimationFrame(() => {
            this.inputEl.focus();
            this.inputEl.select();
        });
        setTimeout(() => {
            this.inputEl.focus();
        }, 40);
    }

    private updateHeaderCounts(rendered: number, total: number) {
        if (this.headerCountBadgeEl) {
            this.headerCountBadgeEl.setText(`${rendered} / ${total}`);
        }
    }

    getSuggestions(query: string): TrackItem[] {
        const raw = query.trim().toLowerCase();
        const tokens = raw.split(/\s+/).filter(t => t.length > 0);
        const totalTracks = this.plugin.library.length;
        const maxResults = 40;

        // 1. EMPTY QUERY: Show Now Playing -> Up Next -> Recent -> Fill with Library
        if (tokens.length === 0) {
            const results: TrackItem[] = [];
            const addedPaths = new Set<string>();
            const current = this.plugin.currentTrack;

            // Section A: Currently Playing Track
            if (current) {
                results.push({
                    ...current,
                    score: 0,
                    tokens: [],
                    isRecent: false,
                    recentIndex: 0,
                    customBadge: { text: 'Now Playing', cls: 'badge-now-playing' }
                });
                addedPaths.add(current.fullPath);

                // Section B: Up Next in Queue (Next 4 tracks)
                const currentIdx = this.plugin.library.findIndex(t => t.fullPath === current.fullPath);
                if (currentIdx !== -1 && totalTracks > 1) {
                    const queueCount = Math.min(4, totalTracks - 1);
                    for (let i = 1; i <= queueCount; i++) {
                        const nextTrack = this.plugin.library[(currentIdx + i) % totalTracks];
                        if (nextTrack && !addedPaths.has(nextTrack.fullPath)) {
                            results.push({
                                ...nextTrack,
                                score: 0,
                                tokens: [],
                                isRecent: false,
                                recentIndex: 0,
                                customBadge: { text: `Next +${i}`, cls: 'badge-up-next' }
                            });
                            addedPaths.add(nextTrack.fullPath);
                        }
                    }
                }
            }

            // Section C: Recently Played Tracks
            for (const recentPath of this.plugin.settings.recentTracks) {
                if (results.length >= maxResults) break;
                if (addedPaths.has(recentPath)) continue;

                const track = this.plugin.library.find(t => t.fullPath === recentPath);
                if (track) {
                    results.push({
                        ...track,
                        score: 0,
                        tokens: [],
                        isRecent: true,
                        recentIndex: this.recentPathsMap.get(track.fullPath) ?? 0,
                        customBadge: { text: 'Recent', cls: 'badge-recent' }
                    });
                    addedPaths.add(track.fullPath);
                }
            }

            // Section D: Fill the remaining slots with the rest of the library
            for (const track of this.plugin.library) {
                if (results.length >= maxResults) break;
                if (addedPaths.has(track.fullPath)) continue;

                results.push({
                    ...track,
                    score: 0,
                    tokens: [],
                    isRecent: false,
                    recentIndex: 999999
                });
                addedPaths.add(track.fullPath);
            }

            this.updateHeaderCounts(results.length, totalTracks);
            return results;
        }

        // 2. QUERY MATCHING
        const firstToken = tokens[0] ?? '';
        const results: TrackItem[] = [];

        for (const track of this.plugin.library) {
            const nameLower = track.name.toLowerCase();
            const folderLower = track.folderPath.toLowerCase();
            const combined = `${nameLower} ${folderLower}`;

            const nameMatches = tokens.every(t => nameLower.includes(t));
            const folderMatches = tokens.every(t => combined.includes(t));

            if (!nameMatches && !folderMatches) continue;

            let score = 0;

            // Strict Tier 1 (Title match) vs Tier 2 (Folder match)
            if (nameMatches) {
                score += 0;
            } else {
                score += 100000;
            }

            // Recency boost
            const isRecent = this.recentPathsMap.has(track.fullPath);
            const recentIndex = this.recentPathsMap.get(track.fullPath) ?? 999999;
            if (isRecent) {
                score -= Math.max(0, 25000 - recentIndex * 250);
            }

            // Substring relevance
            if (nameLower === raw) {
                score -= 30000;
            } else if (nameLower.startsWith(raw)) {
                score -= 15000;
            } else if (nameLower.includes(raw)) {
                score -= 8000;
            }

            const words = nameLower.split(/[\s_\-()]+/);
            if (words.some(w => w.startsWith(firstToken))) {
                score -= 5000;
            }

            score += track.name.length * 2;

            results.push({
                ...track,
                isRecent,
                recentIndex,
                score,
                tokens
            });
        }

        results.sort((a, b) => {
            if (a.score !== b.score) return a.score - b.score;
            return a.name.localeCompare(b.name);
        });

        const sliced = results.slice(0, maxResults);
        this.updateHeaderCounts(sliced.length, totalTracks);
        return sliced;
    }

    renderSuggestion(item: TrackItem, el: HTMLElement): void {
        el.empty();
        el.addClass('lean-player-suggestion');

        // Row 1: Status Badge + Song Name + Extension Pill Badge
        const titleRow = el.createDiv({ cls: 'suggestion-title-row' });

        if (item.customBadge) {
            titleRow.createSpan({ 
                text: item.customBadge.text, 
                cls: `suggestion-status-badge ${item.customBadge.cls}` 
            });
        }

        const titleText = titleRow.createSpan({ cls: 'suggestion-title-text' });
        renderHighlightedText(titleText, item.name, item.tokens);

        titleRow.createSpan({ text: item.ext, cls: 'suggestion-ext-badge' });

        // Row 2: [Folder Icon] Artist / Album / Folder Path
        const subRow = el.createDiv({ cls: 'suggestion-sub-row' });
        const folderIcon = subRow.createSpan({ cls: 'suggestion-inline-icon' });
        setIcon(folderIcon, 'folder');

        const folderText = subRow.createSpan({ cls: 'suggestion-sub-text' });
        renderHighlightedText(folderText, item.folderPath || 'Music Root', item.tokens);
    }

    onChooseSuggestion(item: TrackItem): void {
        this.plugin.playTrack(item);
    }
}

// --- 2. Dedicated Queue Modal (Visual Up Next List & Skip Forward/Back) ---
class LeanQueueModal extends SuggestModal<TrackItem> {
    plugin: LeanPlayerPlugin;

    constructor(app: App, plugin: LeanPlayerPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder("Playback Queue: select any track to skip to it...");
    }

    onOpen() {
        super.onOpen();
        this.modalEl.addClass('lean-player-modal');

        // Autofocus
        requestAnimationFrame(() => {
            this.inputEl.focus();
        });
    }

    getSuggestions(): TrackItem[] {
        if (this.plugin.library.length === 0) return [];
        const current = this.plugin.currentTrack;
        const total = this.plugin.library.length;
        const currentIdx = current ? this.plugin.library.findIndex(t => t.fullPath === current.fullPath) : 0;

        const results: TrackItem[] = [];

        // 1. Previous 3 tracks
        if (current && total > 1) {
            for (let i = 3; i >= 1; i--) {
                const prevIdx = (currentIdx - i + total) % total;
                const prevTrack = this.plugin.library[prevIdx];
                if (prevTrack && prevTrack.fullPath !== current.fullPath) {
                    results.push({
                        ...prevTrack,
                        score: 0,
                        tokens: [],
                        isRecent: false,
                        recentIndex: 0,
                        customBadge: { text: `Prev -${i}`, cls: 'badge-prev' }
                    });
                }
            }
        }

        // 2. Active playing track
        if (current) {
            results.push({
                ...current,
                score: 0,
                tokens: [],
                isRecent: false,
                recentIndex: 0,
                customBadge: { text: 'Now Playing', cls: 'badge-now-playing' }
            });
        }

        // 3. Next 15 tracks
        const nextLimit = Math.min(15, total - 1);
        for (let i = 1; i <= nextLimit; i++) {
            const nextIdx = (currentIdx + i) % total;
            const nextTrack = this.plugin.library[nextIdx];
            if (nextTrack && (!current || nextTrack.fullPath !== current.fullPath)) {
                results.push({
                    ...nextTrack,
                    score: 0,
                    tokens: [],
                    isRecent: false,
                    recentIndex: 0,
                    customBadge: { text: `Next +${i}`, cls: 'badge-up-next' }
                });
            }
        }

        return results;
    }

    renderSuggestion(item: TrackItem, el: HTMLElement): void {
        el.empty();
        el.addClass('lean-player-suggestion');

        const titleRow = el.createDiv({ cls: 'suggestion-title-row' });
        if (item.customBadge) {
            titleRow.createSpan({ 
                text: item.customBadge.text, 
                cls: `suggestion-status-badge ${item.customBadge.cls}` 
            });
        }

        const titleText = titleRow.createSpan({ cls: 'suggestion-title-text', text: item.name });
        titleRow.createSpan({ text: item.ext, cls: 'suggestion-ext-badge' });

        const subRow = el.createDiv({ cls: 'suggestion-sub-row' });
        const folderIcon = subRow.createSpan({ cls: 'suggestion-inline-icon' });
        setIcon(folderIcon, 'folder');

        subRow.createSpan({ text: item.folderPath || 'Music Root', cls: 'suggestion-sub-text' });
    }

    onChooseSuggestion(item: TrackItem): void {
        this.plugin.playTrack(item);
    }
}

// --- Main Plugin Class ---
export default class LeanPlayerPlugin extends Plugin {
    settings: LeanPlayerSettings = DEFAULT_SETTINGS;
    library: TrackItem[] = [];
    currentTrack: TrackItem | null = null;
    isPlaying = false;

    private audio: HTMLAudioElement = new Audio();
    private currentBlobUrl: string | null = null;
    private statusBarItemEl: HTMLElement | null = null;

    async onload() {
        await this.loadSettings();

        // Initialize Audio Engine settings
        this.audio.volume = this.settings.volume;

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateStatusBar();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateStatusBar();
        });

        // 3-Way End-of-Track Handler
        this.audio.addEventListener('ended', () => {
            switch (this.settings.endOfTrackAction) {
                case 'repeat':
                    this.audio.currentTime = 0;
                    this.audio.play();
                    break;
                case 'stop':
                    this.stopPlayback();
                    break;
                case 'next':
                default:
                    this.playNextTrack();
                    break;
            }
        });

        // Status Bar Widget
        this.statusBarItemEl = this.addStatusBarItem();
        this.statusBarItemEl.addClass('lean-player-status-bar');
        this.statusBarItemEl.addEventListener('click', () => {
            this.togglePlayPause();
        });
        this.updateStatusBar();

        // Scan music directory on load
        this.scanLibrary();

        // Command 1: Open Search & Play Modal
        this.addCommand({
            id: 'open-lean-player',
            name: 'Search and Play Music',
            callback: () => {
                new LeanPlayerModal(this.app, this).open();
            }
        });

        // Command 2: View Queue / Up Next
        this.addCommand({
            id: 'view-queue',
            name: 'View Queue / Up Next',
            callback: () => {
                new LeanQueueModal(this.app, this).open();
            }
        });

        // Command 3: Toggle Play/Pause
        this.addCommand({
            id: 'toggle-play-pause',
            name: 'Toggle Play/Pause',
            callback: () => {
                this.togglePlayPause();
            }
        });

        // Command 4: Play Next Track
        this.addCommand({
            id: 'play-next-track',
            name: 'Play Next Track',
            callback: () => {
                this.playNextTrack();
            }
        });

        // Command 5: Play Previous Track
        this.addCommand({
            id: 'play-prev-track',
            name: 'Play Previous Track',
            callback: () => {
                this.playPrevTrack();
            }
        });

        // Command 6: Stop Playback
        this.addCommand({
            id: 'stop-playback',
            name: 'Stop Playback',
            callback: () => {
                this.stopPlayback();
            }
        });

        this.addSettingTab(new LeanPlayerSettingTab(this.app, this));
    }

    onunload() {
        this.stopPlayback();
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
        }
    }

    async loadSettings() {
        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // --- Directory Scanner ---
    scanLibrary() {
        const targetDir = expandHomeDir(this.settings.musicDirectory.trim());
        if (!targetDir || !fs.existsSync(targetDir)) {
            this.library = [];
            return;
        }

        try {
            const raw = this.recursiveScan(targetDir, targetDir);
            // Sort naturally: by folder path (Album/Artist) then by track name
            this.library = raw.sort((a, b) => {
                const folderCmp = a.folderPath.localeCompare(b.folderPath);
                if (folderCmp !== 0) return folderCmp;
                return a.name.localeCompare(b.name);
            });
        } catch (err) {
            console.error('[Lean Player] Error scanning directory', err);
            new Notice('Lean Player: Failed to scan directory: ' + getErrorMessage(err));
        }
    }

    private recursiveScan(dir: string, baseDir: string): TrackItem[] {
        let results: TrackItem[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                results = results.concat(this.recursiveScan(fullPath, baseDir));
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (SUPPORTED_EXTENSIONS.has(ext)) {
                    const relativeFolder = path.relative(baseDir, dir);
                    results.push({
                        name: path.basename(entry.name, ext),
                        fullPath: fullPath,
                        folderPath: relativeFolder || '',
                        ext: ext.replace('.', ''),
                        score: 0,
                        tokens: [],
                        isRecent: false,
                        recentIndex: 999999
                    });
                }
            }
        }
        return results;
    }

    // --- Audio Playback Controls ---
    playTrack(track: TrackItem) {
        try {
            if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
            }

            const buffer = fs.readFileSync(track.fullPath);
            const mime = getAudioMimeType(track.ext);
            const blob = new Blob([buffer], { type: mime });
            this.currentBlobUrl = URL.createObjectURL(blob);

            this.audio.src = this.currentBlobUrl;
            this.audio.play();

            this.currentTrack = track;
            this.isPlaying = true;

            // Save to recents (keep last 50)
            this.settings.recentTracks = [
                track.fullPath,
                ...this.settings.recentTracks.filter(p => p !== track.fullPath)
            ].slice(0, 50);

            this.saveSettings();
            this.updateStatusBar();
        } catch (err) {
            new Notice('Failed to play track: ' + getErrorMessage(err));
        }
    }

    togglePlayPause() {
        if (!this.currentTrack && this.library.length > 0) {
            this.playTrack(this.library[0]!);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }

    playNextTrack() {
        if (this.library.length === 0) return;
        if (!this.currentTrack) {
            this.playTrack(this.library[0]!);
            return;
        }

        const idx = this.library.findIndex(t => t.fullPath === this.currentTrack?.fullPath);
        const nextIdx = (idx + 1) % this.library.length;
        const nextTrack = this.library[nextIdx];
        if (nextTrack) this.playTrack(nextTrack);
    }

    playPrevTrack() {
        if (this.library.length === 0) return;
        if (!this.currentTrack) {
            this.playTrack(this.library[0]!);
            return;
        }

        const idx = this.library.findIndex(t => t.fullPath === this.currentTrack?.fullPath);
        const prevIdx = (idx - 1 + this.library.length) % this.library.length;
        const prevTrack = this.library[prevIdx];
        if (prevTrack) this.playTrack(prevTrack);
    }

    stopPlayback() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.currentTrack = null;
        this.updateStatusBar();
    }

    setVolume(val: number) {
        this.audio.volume = Math.max(0, Math.min(1, val));
    }

    updateStatusBar() {
        if (!this.statusBarItemEl) return;

        if (!this.settings.showStatusBar || !this.currentTrack) {
            this.statusBarItemEl.empty();
            this.statusBarItemEl.hide();
            return;
        }

        this.statusBarItemEl.show();
        this.statusBarItemEl.empty();

        const iconSpan = this.statusBarItemEl.createSpan({ cls: 'lean-player-status-icon' });
        setIcon(iconSpan, this.isPlaying ? 'play' : 'pause');

        this.statusBarItemEl.createSpan({ 
            text: ` ${this.currentTrack.name}`,
            cls: 'lean-player-status-text'
        });
    }
}

// --- Settings Tab ---
class LeanPlayerSettingTab extends PluginSettingTab {
    plugin: LeanPlayerPlugin;

    constructor(app: App, plugin: LeanPlayerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Lean Player Settings' });

        // 1. Music Directory Setting
        new Setting(containerEl)
            .setName('Music Directory')
            .setDesc('Absolute path to your local music directory (e.g. ~/Music or /Volumes/Drive/Audio)')
            .addText(text => text
                .setPlaceholder('~/Music')
                .setValue(this.plugin.settings.musicDirectory)
                .onChange(async (val) => {
                    this.plugin.settings.musicDirectory = val;
                    await this.plugin.saveSettings();
                }))
            .addButton(btn => btn
                .setButtonText('Scan Library')
                .setCta()
                .onClick(() => {
                    this.plugin.scanLibrary();
                    new Notice(`Library scanned: ${this.plugin.library.length} tracks found.`);
                }));

        // 2. Volume Slider Setting
        new Setting(containerEl)
            .setName('Volume')
            .setDesc('Adjust audio playback volume')
            .addSlider(slider => slider
                .setLimits(0, 100, 1)
                .setValue(Math.round(this.plugin.settings.volume * 100))
                .setDynamicTooltip()
                .onChange(async (val) => {
                    const normalized = val / 100;
                    this.plugin.settings.volume = normalized;
                    this.plugin.setVolume(normalized);
                    await this.plugin.saveSettings();
                }));

        // 3. Status Bar Toggle Setting
        new Setting(containerEl)
            .setName('Show in Status Bar')
            .setDesc('Display currently playing song in the bottom status bar')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showStatusBar)
                .onChange(async (val) => {
                    this.plugin.settings.showStatusBar = val;
                    this.plugin.updateStatusBar();
                    await this.plugin.saveSettings();
                }));

        // 4. End-of-Track Action Setting (3 Choices)
        new Setting(containerEl)
            .setName('When Song Ends')
            .setDesc('Choose what action Lean Player takes when the current song finishes')
            .addDropdown(dropdown => dropdown
                .addOption('next', 'Play next song in list')
                .addOption('repeat', 'Repeat current song')
                .addOption('stop', 'Stop playback')
                .setValue(this.plugin.settings.endOfTrackAction)
                .onChange(async (val: string) => {
                    this.plugin.settings.endOfTrackAction = val as EndOfTrackAction;
                    await this.plugin.saveSettings();
                }));
    }
}