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
        console.log('[PDF Anchor] In-PDF Drawer & Precise Controls active.');

        this.rebuildAnchorIndex();

        // Track mouse position for silent hotkey capture
        this.registerDomEvent(window, 'mousemove', (e: MouseEvent) => {
            this.lastMousePos.x = e.clientX;
            this.lastMousePos.y = e.clientY;
        });

        // Hotkey Commands
        this.addCommand({
            id: 'drop-anchor-at-cursor',
            name: 'Drop anchor at cursor (Instant)',
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
        document.querySelectorAll('.pdf-anchor-beacon').forEach(el => el.remove());
        document.querySelectorAll('.pdf-anchor-drawer').forEach(el => el.remove());
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

        for (const leaf of leaves) {
            const view = leaf.view as CustomPdfView;
            if (view && view.file && (view.file.name.includes(cleanPdfName) || view.file.path.includes(cleanPdfName))) {
                targetLeaf = leaf;
                break;
            }
        }

        if (targetLeaf) {
            this.app.workspace.revealLeaf(targetLeaf);
            this.app.workspace.setActiveLeaf(targetLeaf, { focus: true });

            targetLeaf.setEphemeralState({ subpath: `#page=${pageNum}` });
            const view = targetLeaf.view as CustomPdfView;
            if (view && typeof (view as any).setEphemeralState === 'function') {
                (view as any).setEphemeralState({ subpath: `#page=${pageNum}` });
            }
        } else {
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

            if (pageEl && pageEl.clientHeight > 0) {
                const containerRect = container.getBoundingClientRect();
                const pageRect = pageEl.getBoundingClientRect();

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
            this.updateAllDrawers();
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

    // ── 3. ATTACH TOOLBAR CONTROLS & IN-PDF DRAWER ─────────────────────────
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

            this.injectToolbarAndDrawer(view);
            this.observePdfPages(view);
        });
    }

    injectToolbarAndDrawer(view: CustomPdfView): void {
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

            // 2. Crosshair Point Drop Button (Click on Page)
            const dropBtn = document.createElement('button');
            dropBtn.className = 'clickable-icon pdf-enhancer-btn';
            dropBtn.setAttribute('aria-label', 'Click anywhere on PDF to drop anchor');
            setIcon(dropBtn, 'pin');
            dropBtn.addEventListener('click', () => this.startCrosshairPointDrop(view));

            // 3. Toggle In-PDF Anchors Drawer Button
            const drawerBtn = document.createElement('button');
            drawerBtn.className = 'clickable-icon pdf-enhancer-btn';
            drawerBtn.setAttribute('aria-label', 'Toggle PDF Anchors Drawer');
            setIcon(drawerBtn, 'list');
            drawerBtn.addEventListener('click', () => {
                const drawer = view.containerEl.querySelector('.pdf-anchor-drawer');
                if (drawer) {
                    const isOpen = drawer.classList.toggle('is-open');
                    drawerBtn.classList.toggle('is-active', isOpen);
                    if (isOpen) {
                        this.renderDrawerContent(view, drawer as HTMLElement);
                        (drawer.querySelector('.pdf-anchor-drawer-search-input') as HTMLElement)?.focus();
                    }
                }
            });

            group.appendChild(darkBtn);
            group.appendChild(dropBtn);
            group.appendChild(drawerBtn);
            toolbar.appendChild(group);
        }

        // Mount the in-PDF drawer container if not already present
        const pdfContainer = view.containerEl.querySelector('.pdf-container') || view.containerEl;
        if (pdfContainer && !view.containerEl.querySelector('.pdf-anchor-drawer')) {
            const drawer = document.createElement('div');
            drawer.className = 'pdf-anchor-drawer';
            pdfContainer.appendChild(drawer);
            this.renderDrawerContent(view, drawer);
        }
    }

    // ── 4. CAPTURE LOGIC (HOTKEY: SILENT INSTANT | BUTTON: CROSSHAIR) ──────
    captureAnchorAtCursor(view: CustomPdfView): void {
        const elUnderMouse = document.elementFromPoint(this.lastMousePos.x, this.lastMousePos.y);
        const targetPageEl = elUnderMouse?.closest<HTMLElement>('.page');

        if (targetPageEl && view.containerEl.contains(targetPageEl)) {
            this.copyPointFromPage(view, targetPageEl, this.lastMousePos.x, this.lastMousePos.y);
        } else {
            new Notice('⚠️ Mouse cursor is not over a PDF page.');
        }
    }

    startCrosshairPointDrop(view: CustomPdfView): void {
        const container = view.containerEl.querySelector<HTMLElement>('.pdf-viewer-container') || view.containerEl;
        if (!container) return;

        new Notice('📍 Click anywhere on the PDF page to drop an anchor...', 2500);
        container.style.cursor = 'crosshair';

        const onPageClick = (e: MouseEvent) => {
            container.style.cursor = '';
            const clickedPage = (e.target as HTMLElement).closest<HTMLElement>('.page');
            if (clickedPage && view.containerEl.contains(clickedPage)) {
                this.copyPointFromPage(view, clickedPage, e.clientX, e.clientY);
            }
        };

        container.addEventListener('click', onPageClick, { once: true });
    }

    copyPointFromPage(view: CustomPdfView, pageEl: HTMLElement, clientX: number, clientY: number): void {
        const pageRect = pageEl.getBoundingClientRect();
        const clickX = clientX - pageRect.left;
        const clickY = clientY - pageRect.top;

        const normX = Math.max(0, Math.min(1000, Math.round((clickX / pageRect.width) * 1000)));
        const normY = Math.max(0, Math.min(1000, Math.round((clickY / pageRect.height) * 1000)));
        const pageNum = parseInt(pageEl.getAttribute('data-page-number') ?? '1') || 1;
        const file = view.file;
        if (!file) return;

        // Trigger 2-second glowing ripple beacon
        this.triggerBeaconAnimation(pageEl, normX, normY);

        const pointLink = `[[${file.name}#p=${pageNum}&pt=${normX},${normY}|${file.basename}, p. ${pageNum}]]`;

        // Silent clipboard copy (Notice removed)
        void navigator.clipboard.writeText(pointLink);
    }

    triggerBeaconAnimation(pageEl: HTMLElement, normX: number, normY: number): void {
        const beacon = document.createElement('div');
        beacon.className = 'pdf-anchor-beacon';
        beacon.style.left = `${normX / 10}%`;
        beacon.style.top = `${normY / 10}%`;

        beacon.innerHTML = `
            <div class="pdf-anchor-beacon-ring"></div>
            <div class="pdf-anchor-beacon-ring" style="animation-delay: 0.3s;"></div>
            <div class="pdf-anchor-beacon-dot"></div>
        `;

        pageEl.appendChild(beacon);
        setTimeout(() => beacon.remove(), 1900);
    }

    // ── 5. DRAG-RELOCATE (STRICTLY COMMAND + DRAG) ─────────────────────────
    async relocateAnchor(file: TFile, pageNum: number, items: PdfAnchorLink[], newX: number, newY: number): Promise<void> {
        let updateCount = 0;

        for (const item of items) {
            const sourceFile = this.app.vault.getAbstractFileByPath(item.sourcePath);
            if (!(sourceFile instanceof TFile)) continue;

            const content = await this.app.vault.read(sourceFile);
            const targetRegex = new RegExp(`#(?:page|p)=${pageNum}&pt=${item.x},${item.y}`, 'g');

            if (targetRegex.test(content)) {
                const newContent = content.replace(targetRegex, `#p=${pageNum}&pt=${newX},${newY}`);
                await this.app.vault.modify(sourceFile, newContent);
                updateCount++;
            }
        }

        new Notice(`⚓ Relocated anchor to (${newX}, ${newY}) across ${updateCount} note(s)!`);
        this.rebuildAnchorIndex();
        this.renderAllOverlays();
        this.updateAllDrawers();
    }

    // ── 6. RENDER PINS ON PDF WITH CMD+DRAG GUARD ──────────────────────────
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

                const groups: { x: number; y: number; items: PdfAnchorLink[] }[] = [];

                links.forEach(item => {
                    const match = groups.find(g => Math.abs(g.x - item.x) < 30 && Math.abs(g.y - item.y) < 30);
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
                            pin.title = `Linked in: ${first.sourceName} (Cmd+Drag to relocate)`;
                        }
                    } else {
                        pin.innerHTML = `${pinSvg}<span>${group.items.length}</span>`;
                        pin.title = `${group.items.length} notes link here (Cmd+Drag to relocate)`;
                    }

                    // ── DRAG RELOCATION (STRICTLY REQUIRES CMD/CTRL) ──
                    pin.addEventListener('mousedown', (e: MouseEvent) => {
                        // STRICT GUARD: Must hold Cmd (Mac) or Ctrl (Windows) + Left Click
                        if (e.button !== 0 || !(e.metaKey || e.ctrlKey)) return;

                        e.stopPropagation();

                        let isDragging = false;
                        const startClientX = e.clientX;
                        const startClientY = e.clientY;
                        const pageRect = pageEl.getBoundingClientRect();

                        const onMouseMove = (moveEvent: MouseEvent) => {
                            const dist = Math.hypot(moveEvent.clientX - startClientX, moveEvent.clientY - startClientY);
                            if (dist > 5) {
                                isDragging = true;
                                pin.classList.add('is-dragging');
                            }
                            if (!isDragging) return;

                            const curX = moveEvent.clientX - pageRect.left;
                            const curY = moveEvent.clientY - pageRect.top;
                            const curNormX = Math.max(0, Math.min(1000, (curX / pageRect.width) * 1000));
                            const curNormY = Math.max(0, Math.min(1000, (curY / pageRect.height) * 1000));

                            pin.style.left = `${curNormX / 10}%`;
                            pin.style.top = `${curNormY / 10}%`;
                        };

                        const onMouseUp = async (upEvent: MouseEvent) => {
                            window.removeEventListener('mousemove', onMouseMove);
                            window.removeEventListener('mouseup', onMouseUp);

                            if (isDragging) {
                                pin.classList.remove('is-dragging');
                                const finalX = upEvent.clientX - pageRect.left;
                                const finalY = upEvent.clientY - pageRect.top;
                                const newNormX = Math.max(0, Math.min(1000, Math.round((finalX / pageRect.width) * 1000)));
                                const newNormY = Math.max(0, Math.min(1000, Math.round((finalY / pageRect.height) * 1000)));

                                await this.relocateAnchor(file, pageNum, group.items, newNormX, newNormY);
                            }
                        };

                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp, { once: true });
                    });

                    // ── NORMAL CLICK: OPENS NOTE / SPLIT VIEW ──
                    pin.addEventListener('click', (e: MouseEvent) => {
                        // Ignore click if Cmd was held for dragging
                        if (e.metaKey || e.ctrlKey) return;
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

    // ── 7. IN-PDF DRAWER RENDERER & REAL-TIME SEARCH ──────────────────────
    updateAllDrawers(): void {
        this.app.workspace.getLeavesOfType('pdf').forEach(leaf => {
            const view = leaf.view as CustomPdfView;
            if (!view || !view.containerEl) return;
            const drawer = view.containerEl.querySelector<HTMLElement>('.pdf-anchor-drawer');
            if (drawer && drawer.classList.contains('is-open')) {
                this.renderDrawerContent(view, drawer);
            }
        });
    }

    renderDrawerContent(view: CustomPdfView, drawerEl: HTMLElement): void {
        const file = view.file;
        if (!file) return;

        let searchInput = drawerEl.querySelector<HTMLInputElement>('.pdf-anchor-drawer-search-input');
        const currentSearch = searchInput ? searchInput.value : '';

        drawerEl.empty();

        // Header with Search Bar
        const header = drawerEl.createDiv({ cls: 'pdf-anchor-drawer-header' });
        const titleRow = header.createDiv({ cls: 'pdf-anchor-drawer-title-row' });
        titleRow.createSpan({ text: '📑 PDF Anchors' });

        const searchBox = header.createEl('input', {
            cls: 'pdf-anchor-drawer-search-input',
            type: 'text',
            placeholder: 'Search anchors & notes...'
        });
        searchBox.value = currentSearch;
        searchBox.addEventListener('input', () => {
            this.filterDrawerList(view, drawerEl, searchBox.value.toLowerCase().trim());
        });

        // List Container
        drawerEl.createDiv({ cls: 'pdf-anchor-drawer-list' });

        this.filterDrawerList(view, drawerEl, currentSearch.toLowerCase().trim());
    }

    filterDrawerList(view: CustomPdfView, drawerEl: HTMLElement, query: string): void {
        const file = view.file;
        if (!file) return;

        const listContainer = drawerEl.querySelector('.pdf-anchor-drawer-list');
        if (!listContainer) return;
        listContainer.empty();

        const pdfData = this.anchorIndex.get(file.name);
        if (!pdfData || Object.keys(pdfData).length === 0) {
            const empty = listContainer.createDiv({ cls: 'pdf-anchor-drawer-empty' });
            empty.setText('No anchors placed in this document.');
            return;
        }

        const sortedPages = Object.keys(pdfData).map(Number).sort((a, b) => a - b);
        let matchCount = 0;

        sortedPages.forEach(pageNum => {
            const links = pdfData[pageNum];
            if (!links || links.length === 0) return;

            // Filter links by query
            const matchingLinks = links.filter(item => {
                if (!query) return true;
                const pageMatch = `page ${pageNum}`.includes(query) || `${pageNum}` === query;
                const noteMatch = item.sourceName.toLowerCase().includes(query);
                const coordMatch = `(${item.x}, ${item.y})`.includes(query);
                return pageMatch || noteMatch || coordMatch;
            });

            if (matchingLinks.length === 0) return;
            matchCount += matchingLinks.length;

            const group = listContainer.createDiv({ cls: 'pdf-anchor-drawer-page-group' });
            const pageHeader = group.createDiv({ cls: 'pdf-anchor-drawer-page-header' });
            pageHeader.setText(`Page ${pageNum}`);

            matchingLinks.forEach(item => {
                const itemEl = group.createDiv({ cls: 'pdf-anchor-drawer-item' });
                
                const title = itemEl.createDiv({ cls: 'pdf-anchor-drawer-item-title' });
                title.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg> Anchor (${item.x}, ${item.y})`;

                // Clicking the anchor row jumps to that position in the PDF
                itemEl.addEventListener('click', (e: MouseEvent) => {
                    e.stopPropagation();
                    void this.navigateToAnchor(file.path, '', pageNum, item.x, item.y);
                });

                const notesList = itemEl.createDiv({ cls: 'pdf-anchor-drawer-notes-list' });
                const chip = notesList.createDiv({ cls: 'pdf-anchor-drawer-note-chip' });
                chip.setText(`📄 ${item.sourceName}`);

                // Clicking note chip opens in adjacent split tab
                chip.addEventListener('click', (e: MouseEvent) => {
                    e.stopPropagation();
                    this.openInAdjacentTab(item.sourcePath);
                });
            });
        });

        if (matchCount === 0) {
            const empty = listContainer.createDiv({ cls: 'pdf-anchor-drawer-empty' });
            empty.setText(`No results matching "${query}"`);
        }
    }
}