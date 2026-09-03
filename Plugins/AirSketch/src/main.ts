import { 
    Plugin, 
    MarkdownView, 
    Notice
} from 'obsidian';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';

import { AirSketchSettings, ActiveDrawingState, DEFAULT_SETTINGS } from './types';
import { AirSketchSettingTab } from './settings';
import { AirSketchServer } from './server';

export default class AirSketchPlugin extends Plugin {
    settings: AirSketchSettings = DEFAULT_SETTINGS;
    server: AirSketchServer;
    private activeDoc: ActiveDrawingState | null = null;

    async onload() {
        await this.loadSettings();

        if (!this.settings.authToken) {
            this.settings.authToken = crypto.randomBytes(16).toString('hex');
            await this.saveSettings();
        }

        this.server = new AirSketchServer(this);
        this.addSettingTab(new AirSketchSettingTab(this.app, this));
        await this.server.start();

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
        this.server.stop();
    }

    getVaultDrawingsPath(): string {
        return this.settings.drawingsFolder.replace(/^\//, '').replace(/\/$/, '');
    }

    getActiveDoc(): ActiveDrawingState | null {
        return this.activeDoc;
    }

    setActiveDrawing(svgFile: string, markdownNote: string) {
        this.activeDoc = { svgFile, markdownNote };
        this.server.broadcastToClients({
            type: 'switch',
            name: svgFile,
            markdownNote: markdownNote
        });
    }

    refreshEmbeddedImages(fileName: string) {
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

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}