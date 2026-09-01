import { Plugin, setIcon, Notice, View, TFile, Menu, WorkspaceLeaf } from 'obsidian';

interface PdfAnchorLink {
    x: number; // [0 - 1000]
    y: number; // [0 - 1000]
    sourcePath: string;
    sourceName: string;
    alias: string;
}

interface CustomPdfView extends View {
    file?: TFile;
}

export default class PdfAnchorPlugin extends Plugin {
    DARK_CLASS = "pdf-darkmode-active";
    anchorIndex: Map<string, Record<number, PdfAnchorLink[]>> = new Map();
    private isRendering = false;
    private indexDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    private lastMousePos = { x: 0, y: 0 };
    private originalOpenLinkText: any = null;

    async onload(): Promise<void> {
        console.log('[PDF Anchor] State-Engine Synchronized.');

        this.rebuildAnchorIndex();

        // Track live mouse position for instant hotkey capture
        this.registerDomEvent(window, 'mousemove', (e: MouseEvent) => {
            this.lastMousePos.x = e.clientX;
            this.lastMousePos.y = e.clientY;
        });

        // Register Hotkey Commands
        this.addCommand({
            id: 'drop-anchor-at-cursor',
            name: 'Drop anchor at cursor',
            checkCallback: (checking: boolean) => {
                const activeView = this.getActivePdfView();
                if (activeView) {
                    if (!checking) {
                        this.captureAnchorAtCursor(activeView);
                    }
                    return true;
                }
                return false;
            }
        });

        this.addCommand({
            id: 'toggle-pdf-dark-mode',
            name: 'Toggle PDF dark mode',
            checkCallback: (checking: boolean) => {
                const activeView = this.getActivePdfView();
                if (activeView) {
                    if (!checking) {
                        this.toggleDarkMode(activeView);
                    }
                    return true;
                }
                return false;
            }
        });

        // Re-index on metadata changes
        this.registerEvent(this.app.metadataCache.on('resolved', () => this.debounceReindex()));
        this.registerEvent(this.app.metadataCache.on('changed', () => this.debounceReindex()));

        // Hook workspace layout changes
        this.registerEvent(this.app.workspace.on('layout-change', () => this.updatePdfViews()));
        this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.updatePdfViews()));

        // Hook Master Link Router
        this.hookOpenLinkText();

        this.updatePdfViews();
    }

    onunload(): void {
        if (this.originalOpenLinkText) {
            this.app.workspace.openLinkText = this.originalOpenLinkText;
        }
        document.querySelectorAll('.pdf-anchor-pin').forEach(el => el.remove());
        document.querySelectorAll('.pdf-enhancer-group').forEach(el => el.remove());
    }

    // ── 1. MASTER LINK INTERCEPTOR WITH EPHEMERAL STATE INJECTION ──────────
    hookOpenLinkText(): void {
        this.originalOpenLinkText = this.app.workspace.openLinkText.bind(this.app.workspace);

        this.app.workspace.openLinkText = async (
            linktext: string,
            sourcePath: string,
            newLeaf?: boolean | 'tab' | 'split' | 'window',
            openViewState?: any
        ): Promise<void> => {
            const match = linktext.match(/([^#]+\.pdf)#(?:page|p)=(\d+)&pt=(\d+),(\d+)/i);
            
            if (match) {
                const rawPdf = match[1] ?? "";
                const pageNum = parseInt(match[2] ?? "1");
                const x = parseInt(match[3] ?? "0");
                const y = parseInt(match[4] ?? "0");

                await this.navigateToAnchor(rawPdf, sourcePath, pageNum, x, y, newLeaf);
                return;
            }

            return this.originalOpenLinkText(linktext, sourcePath, newLeaf, openViewState);
        };
    }

    async navigateToAnchor(
        pdfPath: string,
        sourcePath: string,
        pageNum: number,
        x: number,
        y: number,
        newLeaf?: boolean | 'tab' | 'split' | 'window'
    ): Promise<void> {
        const cleanPdfName = pdfPath.split('/').pop() ?? pdfPath;
        const leaves = this.app.workspace.getLeavesOfType('pdf');
        
        let targetLeaf: WorkspaceLeaf | null = null;

        // 1. Check if PDF is already open in an existing tab
        for (const leaf of leaves) {
            const view = leaf.view as CustomPdfView;
            if (view && view.file && (view.file.name.includes(cleanPdfName) || view.file.path.includes(cleanPdfName))) {
                targetLeaf = leaf;
                break;
            }
        }

        if (targetLeaf) {
            // Reveal and focus the existing tab
            this.app.workspace.revealLeaf(targetLeaf);
            this.app.workspace.setActiveLeaf(targetLeaf, { focus: true });

            // Tell Obsidian's native state machine to lock target to Page pageNum
            targetLeaf.setEphemeralState({ subpath: `#page=${pageNum}` });
            const view = targetLeaf.view as CustomPdfView;
            if (view && typeof (view as any).setEphemeralState === 'function') {
                (view as any).setEphemeralState({ subpath: `#page=${pageNum}` });
            }
        } else {
            // Open the PDF and inject eState directly so Obsidian never loads page 800
            const file = this.app.metadataCache.getFirstLinkpathDest(pdfPath, sourcePath);
            if (file instanceof TFile) {
                targetLeaf = this.app.workspace.getLeaf(newLeaf ?? false);
                await targetLeaf.openFile(file, {
                    active: true,
                    eState: { subpath: `#page=${pageNum}` }
                });
                this.app.workspace.revealLeaf(targetLeaf);
            }
        }

        if (!targetLeaf) return;

        // 2. Perform accurate vertical centering on (pageNum, y)
        this.centerOnAnchor(targetLeaf, pageNum, y);
    }

    centerOnAnchor(leaf: WorkspaceLeaf, pageNum: number, y: number): void {
        const view = leaf.view as CustomPdfView;
        if (!view || !view.containerEl) return;

        const container = view.containerEl.querySelector<HTMLElement>('.pdf-viewer-container') || 
                          view.containerEl.querySelector<HTMLElement>('.pdf-container');
        if (!container) return;

        let attempts = 0;
        const maxAttempts = 35;

        const checkAndAlign = () => {
            const pageEl = view.containerEl.querySelector<HTMLElement>(`.page[data-page-number="${pageNum}"]`);

            if (container && pageEl && pageEl.clientHeight > 0) {
                const containerRect = container.getBoundingClientRect();
                const pageRect = pageEl.getBoundingClientRect();

                // Accurate top offset inside the scroll viewport
                const pageTopInScroll = container.scrollTop + (pageRect.top - containerRect.top);
                const pointOffsetY = (y / 1000) * pageRect.height;
                const targetScrollTop = Math.max(0, pageTopInScroll + pointOffsetY - (container.clientHeight / 2));

                container.scrollTop = targetScrollTop;
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkAndAlign, 60);
            }
        };

        checkAndAlign();
    }

    // ── 2. INDEXER ────────────────────────────────────────────────────────
    debounceReindex(): void {
        if (this.indexDebounceTimer) clearTimeout(this.indexDebounceTimer);
        this.indexDebounceTimer = setTimeout(() => {
            this.rebuildAnchorIndex();
            this.renderAllOverlays();
        }, 500);
    }

    rebuildAnchorIndex(): void {
        const newIndex = new Map<string, Record<number, PdfAnchorLink[]>>();
        const resolvedLinks = this.app.metadataCache.resolvedLinks;

        for (const sourcePath in resolvedLinks) {
            const targets = resolvedLinks[sourcePath];
            if (!targets) continue;

            let hasPdf = false;
            for (const targetPath in targets) {
                if (targetPath.toLowerCase().includes('.pdf')) {
                    hasPdf = true;
                    break;
                }
            }
            if (!hasPdf) continue;

            const sourceFile = this.app.vault.getAbstractFileByPath(sourcePath);
            if (!(sourceFile instanceof TFile)) continue;

            const cache = this.app.metadataCache.getFileCache(sourceFile);
            if (!cache) continue;

            const allLinks = [...(cache.links ?? []), ...(cache.embeds ?? [])];
            for (const ref of allLinks) {
                const match = ref.link.match(/([^#]+\.pdf)#(?:page|p)=(\d+)&pt=(\d+),(\d+)/i);
                if (match) {
                    const rawPdf = match[1] ?? "";
                    const pdfName = rawPdf.split('/').pop() ?? rawPdf;
                    const pageNum = parseInt(match[2] ?? "1");
                    const x = parseInt(match[3] ?? "0");
                    const y = parseInt(match[4] ?? "0");
                    const alias = ref.displayText || `p. ${pageNum}`;

                    let pdfMap = newIndex.get(pdfName);
                    if (!pdfMap) {
                        pdfMap = {};
                        newIndex.set(pdfName, pdfMap);
                    }
                    if (!pdfMap[pageNum]) pdfMap[pageNum] = [];
                    pdfMap[pageNum].push({
                        x,
                        y,
                        sourcePath: sourceFile.path,
                        sourceName: sourceFile.basename,
                        alias
                    });
                }
            }
        }
        this.anchorIndex = newIndex;
    }

    // ── 3. ATTACH TOOLBAR CONTROLS ─────────────────────────────────────────
    getActivePdfView(): CustomPdfView | null {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (activeLeaf && activeLeaf.view && activeLeaf.view.getViewType() === 'pdf') {
            return activeLeaf.view as CustomPdfView;
        }
        return null;
    }

    toggleDarkMode(view: CustomPdfView): void {
        view.containerEl.classList.toggle(this.DARK_CLASS);
        const container = view.containerEl.querySelector<HTMLElement>('.pdf-container');
        if (container) {
            container.classList.toggle(this.DARK_CLASS);
        }
    }

    updatePdfViews(): void {
        this.app.workspace.getLeavesOfType('pdf').forEach(leaf => {
            const view = leaf.view as CustomPdfView;
            if (!view || !view.containerEl) return;

            this.injectToolbar(view);
            this.observePdfPages(view);
        });
    }

    injectToolbar(view: CustomPdfView): void {
        const toolbar = view.containerEl.querySelector('.pdf-toolbar');
        if (toolbar && !toolbar.querySelector('.pdf-enhancer-group')) {
            const group = document.createElement('div');
            group.className = 'pdf-enhancer-group';

            // 1. Dark Mode Toggle
            const darkBtn = document.createElement('button');
            darkBtn.className = 'clickable-icon pdf-enhancer-btn';
            darkBtn.setAttribute('aria-label', 'Toggle Dark Mode');
            setIcon(darkBtn, 'moon');
            darkBtn.addEventListener('click', () => this.toggleDarkMode(view));

            // 2. Instant Anchor Button
            const anchorBtn = document.createElement('button');
            anchorBtn.className = 'clickable-icon pdf-enhancer-btn';
            anchorBtn.setAttribute('aria-label', 'Drop anchor at cursor');
            setIcon(anchorBtn, 'pin');
            anchorBtn.addEventListener('click', () => this.captureAnchorAtCursor(view));

            group.appendChild(darkBtn);
            group.appendChild(anchorBtn);
            toolbar.appendChild(group);
        }
    }

    // ── 4. INSTANT CURSOR CAPTURE ─────────────────────────────────────────
    captureAnchorAtCursor(view: CustomPdfView): void {
        const elUnderMouse = document.elementFromPoint(this.lastMousePos.x, this.lastMousePos.y);
        const targetPageEl = elUnderMouse?.closest<HTMLElement>('.page');

        if (targetPageEl && view.containerEl.contains(targetPageEl)) {
            const pageRect = targetPageEl.getBoundingClientRect();
            const clickX = this.lastMousePos.x - pageRect.left;
            const clickY = this.lastMousePos.y - pageRect.top;

            const normX = Math.max(0, Math.min(1000, Math.round((clickX / pageRect.width) * 1000)));
            const normY = Math.max(0, Math.min(1000, Math.round((clickY / pageRect.height) * 1000)));
            const pageNum = parseInt(targetPageEl.getAttribute('data-page-number') ?? '1') || 1;
            const file = view.file;
            if (!file) return;

            const pointLink = `[[${file.name}#p=${pageNum}&pt=${normX},${normY}|${file.basename}, p. ${pageNum}]]`;

            void navigator.clipboard.writeText(pointLink);
            new Notice(`📍 Anchor copied at (${normX}, ${normY}) on Page ${pageNum}!`);
        } else {
            new Notice('⚠️ Mouse cursor is not over a PDF page.');
        }
    }

    // ── 5. RENDER MODERN PILL ANCHORS ON PDF ───────────────────────────────
    observePdfPages(view: CustomPdfView): void {
        const viewerContainer = view.containerEl.querySelector<HTMLElement>('.pdf-viewer-container') || view.containerEl;
        if (!viewerContainer || viewerContainer.dataset.hasAnchorObserver === 'true') return;

        viewerContainer.dataset.hasAnchorObserver = 'true';

        const observer = new MutationObserver((mutations) => {
            if (this.isRendering) return;

            let shouldRender = false;
            for (let i = 0; i < mutations.length; i++) {
                const mutation = mutations[i];
                if (!mutation) continue;
                for (let j = 0; j < mutation.addedNodes.length; j++) {
                    const node = mutation.addedNodes[j] as HTMLElement;
                    if (node && node.nodeType === 1 && (node.classList?.contains('page') || node.tagName === 'CANVAS')) {
                        shouldRender = true;
                        break;
                    }
                }
                if (shouldRender) break;
            }

            if (shouldRender) {
                this.renderViewOverlays(view);
            }
        });

        observer.observe(viewerContainer, { childList: true, subtree: true });
        this.renderViewOverlays(view);
    }

    renderAllOverlays(): void {
        this.app.workspace.getLeavesOfType('pdf').forEach(leaf => {
            const view = leaf.view as CustomPdfView;
            if (view) this.renderViewOverlays(view);
        });
    }

    openInAdjacentTab(filePath: string): void {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            const leaf = this.app.workspace.getLeaf('split', 'vertical');
            void leaf.openFile(file);
        }
    }

    renderViewOverlays(view: CustomPdfView): void {
        const file = view.file;
        if (!file || this.isRendering) return;

        this.isRendering = true;

        try {
            const pdfData = this.anchorIndex.get(file.name);
            const pages = view.containerEl.querySelectorAll<HTMLElement>('.page');

            pages.forEach(pageEl => {
                const pageNum = parseInt(pageEl.getAttribute('data-page-number') ?? '0');
                const links = pdfData ? pdfData[pageNum] : undefined;

                const existingPins = pageEl.querySelectorAll('.pdf-anchor-pin');
                existingPins.forEach(el => el.remove());

                if (!links || links.length === 0) return;

                // Group nearby points
                const groups: { x: number; y: number; items: PdfAnchorLink[] }[] = [];

                links.forEach(item => {
                    const match = groups.find(g => {
                        return Math.abs(g.x - item.x) < 30 && Math.abs(g.y - item.y) < 30;
                    });
                    if (match) {
                        match.items.push(item);
                    } else {
                        groups.push({ x: item.x, y: item.y, items: [item] });
                    }
                });

                groups.forEach(group => {
                    const pin = document.createElement('div');
                    pin.className = 'pdf-anchor-pin';
                    pin.style.left = `${group.x / 10}%`;
                    pin.style.top = `${group.y / 10}%`;

                    const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>`;

                    if (group.items.length === 1) {
                        pin.innerHTML = `${pinSvg}<span>1</span>`;
                        const first = group.items[0];
                        if (first) {
                            pin.setAttribute('aria-label', `Linked in: ${first.sourceName}`);
                            pin.title = `Linked in: ${first.sourceName}`;
                        }
                    } else {
                        pin.innerHTML = `${pinSvg}<span>${group.items.length}</span>`;
                        pin.title = `${group.items.length} notes link here`;
                    }

                    pin.addEventListener('click', (e: MouseEvent) => {
                        e.stopPropagation();

                        if (group.items.length === 1) {
                            const firstItem = group.items[0];
                            if (firstItem) {
                                this.openInAdjacentTab(firstItem.sourcePath);
                            }
                        } else {
                            const menu = new Menu();
                            menu.addItem(menuItem => {
                                menuItem.setTitle(`Notes citing here (${group.items.length}):`).setDisabled(true);
                            });
                            group.items.forEach(noteItem => {
                                menu.addItem(menuItem => {
                                    menuItem.setTitle(`📄 ${noteItem.sourceName}`)
                                        .setIcon('file-text')
                                        .onClick(() => this.openInAdjacentTab(noteItem.sourcePath));
                                });
                            });
                            menu.showAtMouseEvent(e);
                        }
                    });

                    pageEl.appendChild(pin);
                });
            });
        } finally {
            this.isRendering = false;
        }
    }
}