const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf, PluginSettingTab } = require('obsidian');

// ─── Default Settings ──────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
    invisibleMinimize: false
};

// ─── Plugin Setting Tab ───────────────────────────────────────────────────
class VaporNoteSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'VaporNote Settings' });

        new Setting(containerEl)
            .setName('Invisible Minimize')
            .setDesc('When enabled, minimizing VaporNote makes it 0% opacity and non-interactable instead of collapsing it.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.invisibleMinimize)
                .onChange(async (value) => {
                    this.plugin.settings.invisibleMinimize = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file, evt?.metaKey || evt?.ctrlKey); }
}

// ─── Prompt Modal for Web URL ──────────────────────────────────────────────
class UrlPromptModal extends Modal {
    constructor(app, onSubmit) {
        super(app);
        this.onSubmit = onSubmit;
        this.value = "";
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: 'Web Search & Navigation', attr: { style: 'margin-top: 0;' } });

        let inputEl;

        new Setting(contentEl)
            .setName('Search Google or enter a URL')
            .addText(text => {
                inputEl = text.inputEl;
                inputEl.style.width = '100%';
                
                text.onChange(value => { this.value = value; });
                
                text.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        this.onSubmit(this.value);
                        this.close();
                    }
                });
            });

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Go')
                .setCta()
                .onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                })
            );

        if (inputEl) setTimeout(() => inputEl.focus(), 50);
    }

    onClose() { this.contentEl.empty(); }
}

// ─── Optional Prompt Modal (Preserved for compatibility) ───────────────────
class FilePromptModal extends Modal {
    constructor(app, onSubmit, defaultValue) {
        super(app);
        this.onSubmit = onSubmit;
        this.value = defaultValue || "VaporNote.md";
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Open VaporNote" });
        new Setting(contentEl)
            .setName("File path")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { 
                        e.preventDefault();
                        e.stopPropagation();
                        this.onSubmit(this.value); 
                        this.close(); 
                    }
                });
            });
        new Setting(contentEl).addButton((btn) => {
            btn.setButtonText("Confirm").setCta().onClick(() => {
                this.onSubmit(this.value);
                this.close();
            });
        });
    }

    onClose() { this.contentEl.empty(); }
}

// ─── VaporNote Plugin Core ───────────────────────────────────────────────
class VaporNotePlugin extends Plugin {
    async onload() {
        await this.loadSettings();

        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
        this._origOpenLinkText  = null;
        this._origOpenFile      = null;
        this._targetWin         = null;     
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._focusoutHandler    = null;     
        this._globalClickHandler = null;    
        this._keydownHandler     = null;    
        this._globalMousedownHandler = null; 
        this._dragOverlay       = null;
        this._allowDetach       = false;
        this._isMigrating       = false;    
        this._isOpening         = false;    
        this._isMinimized       = false;    
        this._wasInvisiblyMinimized = false;
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '1.0';   
        this._lastCloseTime     = 0;        
        this._lastNavTime       = 0;        
        this._lastReopenTime    = 0;        
        this._moveTimeout       = null;     
        this._isClosingTab      = false;    
        this._isCreatingTab     = false;
        this._isSwitchingTab    = false;
        this._isReopeningTab    = false;
        this._queuedWin         = null;

        this._savedWidth         = null;
        this._savedHeight        = null;
        this._savedLeft          = null;
        this._savedLeftVal       = null;    
        this._savedTop           = null;
        this._savedTabsState     = null;
        this._savedActiveLeafIndex = null;
        this._savedScrolls       = [];
        this._savedEphemeral     = [];       
        this._isVaporActive      = false;    

        this._isFullscreen       = false;
        this._preFullscreenWidth = null;
        this._preFullscreenHeight = null;
        this._preFullscreenLeft  = null;
        this._preFullscreenTop   = null;

        this._dragMode          = null;     
        this._activeHandleDir   = null;     
        this._origModalOpen     = null;     
        this._origScopeHandleKey = null;    

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        this.addCommand({
            id: 'toggle-minimize-vapornote',
            name: 'Minimize / Restore VaporNote',
            callback: () => this.toggleMinimizeCommand()
        });

        this.addCommand({
            id: 'toggle-fullscreen-vapornote',
            name: 'Toggle Fullscreen VaporNote',
            callback: () => this.toggleFullscreen()
        });

        this.addCommand({
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this.addSettingTab(new VaporNoteSettingTab(this.app, this));

        this._setupWindowFocusListeners();

        // Global Error Shield for GUEST_VIEW_MANAGER_CALL spam
        this._globalRejectionHandler = (e) => {
            const msg = e.reason?.message || String(e.reason);
            if (typeof msg === 'string' && msg.includes('GUEST_VIEW_MANAGER_CALL')) {
                e.preventDefault();
            }
        };
        window.addEventListener('unhandledrejection', this._globalRejectionHandler);

        // Patch app.scope.handleKey to swallow Cmd+W, Cmd+Shift+T, Cmd+Ctrl+L, and tab switches
        // when VaporNote is active or focused.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && !this._isMinimized && (this._isVaporPhysicallyFocused() || this._isVaporActive)) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const isAlt       = evt.altKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();

                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;
                    if (isCmdOrCtrl && evt.ctrlKey && key === 'l') return false;

                    if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right' || key === 'arrowleft' || key === 'left')) {
                        return false;
                    }
                }
                return this._origScopeHandleKey(evt, keyInfo);
            };
        }

        // Intercept global Modal.open transitions to force modal targeting alignment
        const self = this;
        this._origModalOpen = Modal.prototype.open;
        Modal.prototype.open = function(...args) {
            if (self._isOpen() && !self._isMinimized && self._isVaporFocused() && self._targetWin) {
                const origActiveWindow = window.activeWindow;
                const origActiveDocument = window.activeDocument;
                try {
                    window.activeWindow = self._targetWin;
                    window.activeDocument = self._targetWin.document;
                } catch (_) {}
                try {
                    return self._origModalOpen.apply(this, args);
                } finally {
                    try {
                        window.activeWindow = origActiveWindow;
                        window.activeDocument = origActiveDocument;
                    } catch (_) {}
                }
            }
            return self._origModalOpen.apply(this, args);
        };

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this._assertDOMPosition();
                this._renderTabs();
            })
        );

        this.registerEvent(
            this.app.workspace.on('window-open', () => {
                this._setupWindowFocusListeners();
                this._assertDOMPosition();
            })
        );

        this.registerEvent(
            this.app.workspace.on('window-close', () => {
                this._setupWindowFocusListeners();
                this._assertDOMPosition();
            })
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx;
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

        if (this._globalRejectionHandler) {
            window.removeEventListener('unhandledrejection', this._globalRejectionHandler);
            this._globalRejectionHandler = null;
        }

        const styleId = 'vapornote-translucency-style';
        const windows = new Set([window]);
        const floatingSplit = this.app.workspace.floatingSplit;
        if (floatingSplit && floatingSplit.children) {
            floatingSplit.children.forEach(child => { if (child.win) windows.add(child.win); });
        }
        windows.forEach(win => {
            try {
                const el = win.document.getElementById(styleId);
                if (el) el.remove();
            } catch (_) {}
        });

        if (this._focusListeners) {
            this._focusListeners = [];
        }

        if (this._origModalOpen) {
            Modal.prototype.open = this._origModalOpen;
            this._origModalOpen = null;
        }

        if (this._origScopeHandleKey) {
            try { this.app.scope.handleKey = this._origScopeHandleKey; } catch (_) {}
            this._origScopeHandleKey = null;
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        if (leaf && leaf.containerEl) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        const safeContainerEl = {
            addClass:        () => {},
            removeClass:     () => {},
            toggleClass:     () => {},
            hasClass:        () => false,
            setAttribute:    () => {},
            removeAttribute: () => {},
            classList:       { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            style:           {},
            dataset:         {},
        };

        const fakeRoot = {
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:     safeContainerEl,
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
            type: 'root',
        };

        const fakeParent = {
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            getContainer:    () => noopContainer,
            containerEl:     safeContainerEl,
            children:        [leaf],
            type:            'split',
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200);
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200);
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return;
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {};
                patched.push({ win, orig });
            } catch (_) {}
        });

        const electronPatched = [];
        try {
            const remote = window.require?.('@electron/remote') || require('@electron/remote');
            if (remote) {
                remote.BrowserWindow.getAllWindows().forEach(bwin => {
                    try {
                        const targetWcId = targetWin?.require?.('@electron/remote')
                            ?.getCurrentWindow()?.webContents?.id;
                        if (bwin.webContents?.id === targetWcId) return;
                        const origFocus = bwin.focus.bind(bwin);
                        bwin.focus = () => {};
                        electronPatched.push({ bwin, origFocus });
                    } catch (_) {}
                });
            }
        } catch (_) {}

        let restored = false;
        return () => {
            if (restored) return;
            restored = true;
            patched.forEach(({ win, orig }) => {
                try { win.focus = orig; } catch (_) {}
            });
            electronPatched.forEach(({ bwin, origFocus }) => {
                try { bwin.focus = origFocus; } catch (_) {}
            });
        };
    }

    // ─── FOCUS MANAGEMENT HELPERS ────────────────────────────────────────────
    _forceFocusActiveLeaf() {
        if (!this._isOpen() || this._isMinimized || !this.floatingLeaves) return;

        const doc = this._targetWin?.document || activeDocument;
        if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // 1. Synchronize Obsidian workspace activeLeaf pointer
        if (this.app.workspace.activeLeaf !== leaf) {
            try {
                if (this._origSetActiveLeaf) {
                    this._origSetActiveLeaf(leaf, { focus: false });
                } else {
                    this.app.workspace.setActiveLeaf(leaf, { focus: false });
                }
            } catch (e) {}
        }

        if (!leaf.containerEl) return;

        if (!leaf.containerEl.hasAttribute('tabindex')) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        try {
            if (this._targetWin && !this._targetWin.closed) {
                this._targetWin.focus();
            }
        } catch (_) {}

        // 2. Focus active tab view depending on view type
        // A. Markdown Editor
        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
            return;
        }

        // B. Webview / Isolated Browser
        const webview = leaf.containerEl.querySelector('webview');
        if (webview) {
            try {
                webview.focus();
            } catch (_) {}
            return;
        }

        // C. CodeMirror Editor Content
        const cmContent = leaf.containerEl.querySelector('.cm-content');
        if (cmContent && typeof cmContent.focus === 'function') {
            cmContent.focus();
            return;
        }

        // D. Empty Tab or Fallback Views
        leaf.containerEl.focus();
    }

    _setupWindowFocusListeners() {
        if (this._focusListeners) {
            this._focusListeners.forEach(({ win, bwin, appObj, event, listener, useCapture }) => {
                try {
                    if (appObj) appObj.off(event, listener);
                    else if (bwin) bwin.off(event, listener);
                    else if (win) win.removeEventListener(event, listener, !!useCapture);
                } catch (_) {}
            });
        }
        this._focusListeners = [];
    }

    _injectStyles(doc) {
        if (!doc) return;
        const styleId = 'vapornote-translucency-style';
        if (doc.getElementById(styleId)) return;

        const style = doc.createElement('style');
        style.id = styleId;
        style.textContent = `
            .vapornote-container .workspace-leaf,
            .vapornote-container .workspace-leaf-content,
            .vapornote-container .view-content,
            .vapornote-container .markdown-source-view,
            .vapornote-container .markdown-preview-view,
            .vapornote-container .cm-scroller {
                background-color: transparent !important;
                background: transparent !important;
            }
        `;
        doc.head.appendChild(style);
    }

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.ownerDocument || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    _isVaporPhysicallyFocused() {
        if (!this.floatingContainer || this._isMinimized) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    _isOrphanedVaporLeaf(leaf) {
        try {
            const parent = leaf.parent;
            if (!parent) return false;
            const parentContainer = parent.containerEl;
            if (parentContainer && typeof parentContainer.nodeType === 'undefined') {
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer || this._isMinimized) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        const isOutsideVapor = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement &&
            !this.floatingContainer.contains(activeEl) &&
            !(this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
            
        if (isOutsideVapor) {
            this._isVaporActive = false;
            return false;
        }

        return this._isVaporActive;
    }

    _findRendererWinForBwin(bwin) {
        if (!bwin) return null;
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit && floatingSplit.children) {
                floatingSplit.children.forEach(child => { if (child.win) wins.add(child.win); });
            }
        } catch (_) {}
        for (const win of wins) {
            try {
                const remote = win.require?.('@electron/remote');
                if (remote && remote.getCurrentWindow().webContents.id === bwin.webContents.id) {
                    return win;
                }
            } catch (_) {}
        }
        return null;
    }

    _getElectronFocusedRendererWin() {
        try {
            const remote = window.require?.('@electron/remote') || require('@electron/remote');
            if (remote) {
                const focusedBwin = remote.BrowserWindow.getFocusedWindow();
                if (focusedBwin) {
                    const rendererWin = this._findRendererWinForBwin(focusedBwin);
                    if (rendererWin) return rendererWin;
                }
            }
        } catch (_) {}
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        const currentWin = this._getElectronFocusedRendererWin();
        if (this._isOpen()) {
            if (this._targetWin !== currentWin) {
                this._moveContainerToWindow(currentWin);
                return;
            }
            this.closeVaporNote();
            return;
        }
        await this._openVaporNote(this.savedFilePath);
    }

    toggleMinimizeCommand() {
        if (!this._isOpen()) {
            this.toggleVaporNote();
            return;
        }
        this.toggleMinimize();
    }

    resetPosition() {
        if (!this._isOpen() || !this.floatingContainer) return;

        if (this._isMinimized) this.toggleMinimize();
        if (this._isFullscreen) this.toggleFullscreen();

        const doc = this._targetWin?.document || document;
        const vw = doc.documentElement.clientWidth  || doc.body.clientWidth  || 800;
        const vh = doc.documentElement.clientHeight || doc.body.clientHeight || 600;

        const w = parseFloat(this.floatingContainer.style.width)  || 380;
        const h = parseFloat(this.floatingContainer.style.height) || 500;

        const centeredLeft = Math.round((vw - w) / 2);
        const centeredTop  = Math.round((vh - h) / 2);

        this.floatingContainer.style.left   = centeredLeft + 'px';
        this.floatingContainer.style.top    = centeredTop  + 'px';
        this.floatingContainer.style.right  = 'auto';
        this.floatingContainer.style.bottom = 'auto';
    }

    async _openVaporNote(path = null) {
        if (this._isOpening) return;
        this._isOpening = true;

        try {
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            const restoreOpenFocus = this._suppressWinFocusViaDOM();
            setTimeout(restoreOpenFocus, 800);

            this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

            const container = doc.createElement('div');
            container.classList.add('vapornote-container');
            this.floatingContainer = container;
            this._injectStyles(doc);
            this._styleContainer(container);

            const tabBar = doc.createElement('div');
            tabBar.style.cssText = `
                display: flex; align-items: center; overflow-x: auto; overflow-y: hidden;
                height: 100%; flex: 1; margin-left: 12px; margin-right: 12px;
                scrollbar-width: none; -ms-overflow-style: none;
            `;
            this.tabBar = tabBar;

            this._buildChrome(container);

            const tabContentContainer = doc.createElement('div');
            tabContentContainer.style.cssText = `
                display: flex; flex-direction: column; flex: 1; min-height: 0;
                overflow: hidden; height: 100%;
            `;
            this.tabContentContainer = tabContentContainer;
            container.appendChild(tabContentContainer);

            doc.body.appendChild(container);

            this.floatingLeaves = [];
            this.activeLeafIndex = 0;

            const ws = this.app.workspace;
            if (this._origSetActiveLeaf) {
                ws.setActiveLeaf = this._origSetActiveLeaf;
                this._origSetActiveLeaf = null;
            }
            this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            
            ws.setActiveLeaf = (targetLeaf, ...args) => {
                if (this.floatingLeaves && this.floatingLeaves.includes(targetLeaf)) {
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }

                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) {
                    return;
                }

                const targetWin = targetLeaf?.containerEl?.ownerDocument?.defaultView;
                const isPopoutWindow = targetWin && targetWin !== window && targetWin !== this._targetWin;

                if (this._isOpen() && !this._isMinimized && !this._isClosingTab && !this._isSwitchingTab &&
                    !this._isCreatingTab && this._isVaporPhysicallyFocused() && !isPopoutWindow) {
                    const wsRoot = this.app.workspace.containerEl;
                    const isRealWorkspaceLeaf = wsRoot && targetLeaf?.containerEl &&
                        wsRoot.contains(targetLeaf.containerEl);
                    if (!isRealWorkspaceLeaf) {
                        return;
                    }
                }

                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = !this._isMinimized && (this._isVaporPhysicallyFocused() || this._isVaporActive);

                if (!newSplit && this._isOpen() && !this._isMinimized && this._isVaporActive) {
                    const activeVaporLeaf = this.floatingLeaves[this.activeLeafIndex];
                    if (activeVaporLeaf) {
                        return activeVaporLeaf;
                    }
                }

                const currentEvent = window.event;
                const isShiftHeld = currentEvent ? !!currentEvent.shiftKey : false;

                const isNewTabRequested = newSplit === 'tab' || newSplit === true || (newSplit === 'window' && !isShiftHeld);

                if (this._isOpen() && !this._isMinimized && isVaporFocused && isNewTabRequested) {
                    this._isCreatingTab = true;
                    const _restoreWinFocus = this._suppressWinFocusViaDOM();
                    const leaf = new WorkspaceLeaf(this.app);
                    this._makeLeafWindowNeutral(leaf);

                    const origDetach = leaf.detach.bind(leaf);
                    leaf.detach = () => {
                        if (this._allowDetach) {
                            try {
                                if (leaf.history) {
                                    leaf.history.backHistory    = [];
                                    leaf.history.forwardHistory = [];
                                }
                            } catch (_) {}
                            origDetach();
                        } else {
                            const idx = this.floatingLeaves ? this.floatingLeaves.indexOf(leaf) : -1;
                            if (idx !== -1) {
                                this._closeTab(idx);
                            } else {
                                this._assertDOMPosition();
                            }
                        }
                    };

                    leaf.containerEl.addEventListener('focusin', () => {
                        if (this._isMigrating || this._isMinimized) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    const insertIdx = (this.floatingLeaves && this.floatingLeaves.length > 0)
                        ? this.activeLeafIndex + 1
                        : 0;

                    this.floatingLeaves.splice(insertIdx, 0, leaf);
                    this.activeLeafIndex = insertIdx;

                    this._switchTab(this.activeLeafIndex);

                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        const idx = this.floatingLeaves ? this.floatingLeaves.indexOf(leaf) : -1;
                        if (idx !== -1) {
                            this.activeLeafIndex = idx;
                            this._switchTab(idx);
                        }
                        return result;
                    };

                    setTimeout(() => { _restoreWinFocus(); this._isCreatingTab = false; }, 300);
                    return leaf;
                }

                const newLeaf = this._origGetLeaf(newSplit, ...args);
                return newLeaf;
            };

            const _vaporOpenInActiveLeaf = async (file, openState) => {
                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (!activeLeaf) return false;
                await activeLeaf.openFile(file, openState);
                this._switchTab(this.activeLeafIndex);
                return true;
            };

            if (this._origOpenLinkText) {
                ws.openLinkText = this._origOpenLinkText;
                this._origOpenLinkText = null;
            }
            this._origOpenLinkText = ws.openLinkText.bind(ws);
            ws.openLinkText = async (linkText, sourcePath, newLeaf, openState) => {
                if (this._isOpen() && !this._isMinimized && this._isVaporActive) {
                    const file = this.app.metadataCache.getFirstLinkpathDest(linkText, sourcePath)
                        ?? this.app.vault.getAbstractFileByPath(linkText);
                    if (file) {
                        await this._addNewTab('file', file.path);
                        return;
                    }
                }
                return this._origOpenLinkText(linkText, sourcePath, newLeaf, openState);
            };

            if (this._origOpenFile) {
                ws.openFile = this._origOpenFile;
                this._origOpenFile = null;
            }
            this._origOpenFile = ws.openFile?.bind(ws);
            if (this._origOpenFile) {
                ws.openFile = async (file, openState) => {
                    if (this._isOpen() && !this._isMinimized && this._isVaporActive) {
                        if (await _vaporOpenInActiveLeaf(file, openState)) return;
                    }
                    return this._origOpenFile(file, openState);
                };
            }

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;

                const emptyViewBtn = e.target.closest('.empty-state-action, .workspace-empty-state button, .workspace-empty .workspace-drop-overlay button, button.mod-cta');
                const emptyLeaf = this.floatingLeaves?.find(l => l.getViewState?.()?.type === 'empty');
                if (emptyViewBtn && emptyLeaf && emptyLeaf.containerEl?.contains(emptyViewBtn)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const self = this;
                    new FileSuggestModal(this.app, async (file, isCmdEnter) => {
                        if (isCmdEnter) {
                            await self._addNewTab('file', file.path);
                        } else {
                            await emptyLeaf.openFile(file);
                            self._switchTab(self.floatingLeaves.indexOf(emptyLeaf));
                        }
                    }).open();
                    return;
                }

                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href || anchor.getAttribute('data-href');
                if (!href) return;

                const isCmdOrCtrl = e.metaKey || e.ctrlKey;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (isCmdOrCtrl) {
                        this._addNewTab('web', href);
                    } else {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf) {
                            activeLeaf.setViewState({
                                type: 'webviewer', state: { url: href, navigate: true }, active: true
                            }).then(() => this._renderTabs());
                        }
                    }
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetPath = anchor.getAttribute('data-href') || href;
                    if (targetPath) {
                        const file = this.app.metadataCache.getFirstLinkpathDest(targetPath, '') 
                            ?? this.app.vault.getAbstractFileByPath(targetPath);
                        const finalPath = file ? file.path : targetPath;
                        this._addNewTab('file', finalPath);
                    }
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    this._isVaporActive = true;
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    const t = e.target;
                    const isRealBackgroundClick = t &&
                        t !== t.ownerDocument.body &&
                        t !== t.ownerDocument.documentElement &&
                        !t.closest('.vapornote-container') &&
                        (t.closest('.workspace-leaf') || t.closest('.workspace-tab-header') ||
                         t.closest('.workspace-ribbon') || t.closest('.side-dock') ||
                         t.closest('.status-bar'));
                    if (isRealBackgroundClick) {
                        this._isVaporActive = false;
                    }
                }
            };
            this._targetWin.addEventListener('mousedown', this._globalMousedownHandler, true);

            this._keydownHandler = (e) => {
                const isCmdOrCtrl = e.metaKey || e.ctrlKey;
                const isShift = e.shiftKey;
                const isAlt = e.altKey;
                const key = e.key.toLowerCase();

                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && !this._isMinimized && (this._isVaporPhysicallyFocused() || this._isVaporActive)) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't') {
                    if (this._isOpen() && !this._isMinimized && (this._isVaporPhysicallyFocused() || this._isVaporActive)) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.reopenClosedTab();
                        return;
                    }
                }

                if (isCmdOrCtrl && e.ctrlKey && key === 'l') {
                    if (this._isOpen() && !this._isMinimized && (this._isVaporPhysicallyFocused() || this._isVaporActive)) {
                        e.preventDefault();
                        e.stopPropagation();
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf) {
                            const doc = this._targetWin?.document || activeDocument;
                            if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                                doc.activeElement.blur();
                            }
                            const addressBar = activeLeaf.containerEl?.querySelector('.custom-webview-addressbar') ||
                                               activeLeaf.containerEl?.querySelector('.view-header input[type="text"]') ||
                                               activeLeaf.containerEl?.querySelector('.view-header input') ||
                                               activeLeaf.containerEl?.querySelector('input');
                            if (addressBar) {
                                addressBar.focus();
                                if (typeof addressBar.select === 'function') {
                                    addressBar.select();
                                }
                            }
                        }
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (!this._isVaporFocused()) return;

                if (isCmdOrCtrl && isAlt && (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'arrowright')) {
                    e.preventDefault(); e.stopPropagation();
                    this.navigateTab(1);
                }
                else if (isCmdOrCtrl && isAlt && (e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'arrowleft')) {
                    e.preventDefault(); e.stopPropagation();
                    this.navigateTab(-1);
                }
            };
            this._targetWin.addEventListener('keydown', this._keydownHandler, true);

            this._focusinHandler = () => { 
                if (this._isMigrating || this._isMinimized) return;
                this._isVaporActive = true;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                    try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (e) {}
                }
            };
            container.addEventListener('focusin', this._focusinHandler);

            this._focusoutHandler = (e) => {};
            container.addEventListener('focusout', this._focusoutHandler);

            this._resizeObserver = new ResizeObserver(() => {
                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                try { activeLeaf?.view?.onResize?.(); }      catch (_) {}
                try { activeLeaf?.view?.editor?.refresh(); } catch (_) {}
            });
            this._resizeObserver.observe(container);

            if (this._savedTabsState && this._savedTabsState.length > 0) {
                for (let i = 0; i < this._savedTabsState.length; i++) {
                    const tab = this._savedTabsState[i];
                    if (tab.type === 'markdown' && tab.pathOrUrl) {
                        await this._addNewTab('file', tab.pathOrUrl);
                    } else if ((tab.type === 'webviewer' || tab.type === 'custom-webview-view') && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl, tab.type);
                    } else {
                        await this._addNewTab('empty');
                    }
                }
                const restoreIdx = this._savedActiveLeafIndex ?? 0;
                this._switchTab(restoreIdx);
            } else {
                if (path) await this._addNewTab('file', path);
                else await this._addNewTab('empty');
            }

            new Notice("VaporNote popped in.");
        } catch (e) {
            console.error("VaporNote opening failed", e);
            this.closeVaporNote();
        } finally {
            this._isOpening = false;
        }
    }

    async _addNewTab(type = 'empty', pathOrUrl = null, customViewType = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            this._makeLeafWindowNeutral(leaf);

            const origDetach = leaf.detach.bind(leaf);
            leaf.detach = () => {
                if (this._allowDetach) {
                    try {
                        if (leaf.history) {
                            leaf.history.backHistory    = [];
                            leaf.history.forwardHistory = [];
                        }
                    } catch (_) {}
                    origDetach();
                } else {
                    const idx = this.floatingLeaves ? this.floatingLeaves.indexOf(leaf) : -1;
                    if (idx !== -1) {
                        this._closeTab(idx);
                    } else {
                        this._assertDOMPosition();
                    }
                }
            };

            this.tabContentContainer.appendChild(leaf.containerEl);
            Object.assign(leaf.containerEl.style, {
                flex: '1', minHeight: '0', height: '100%',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            });

            const insertIdx = (this.floatingLeaves && this.floatingLeaves.length > 0)
                ? this.activeLeafIndex + 1
                : 0;

            this.floatingLeaves.splice(insertIdx, 0, leaf);
            this.activeLeafIndex = insertIdx;

            if (type === 'file' && pathOrUrl) {
                let file = this.app.vault.getAbstractFileByPath(pathOrUrl);
                if (!file) {
                    file = await this.app.vault.create(pathOrUrl, `# ${pathOrUrl.replace('.md', '')}\n\n`);
                }
                await leaf.openFile(file);
                const state = leaf.getViewState();
                state.state.mode   = 'source';
                state.state.source = false;
                await leaf.setViewState(state);
            } else if (type === 'web' && pathOrUrl) {
                const targetViewType = customViewType || 'webviewer';
                await leaf.setViewState({
                    type: targetViewType, state: { url: pathOrUrl, navigate: true }, active: true
                });
            } else {
                await leaf.setViewState({ type: 'empty' });
            }
        } catch (err) {
            const idx = this.floatingLeaves ? this.floatingLeaves.indexOf(leaf) : -1;
            if (idx !== -1) {
                this.floatingLeaves.splice(idx, 1);
            }
            throw err;
        } finally {
            ws.setActiveLeaf = savedSetActiveLeaf;
            setTimeout(() => {
                this._isCreatingTab = false;
                if (this._isOpen() && !this._isMinimized) {
                    this._forceFocusActiveLeaf();
                }
            }, 50);

            setTimeout(() => {
                if (this._isOpen() && !this._isMinimized) {
                    this._forceFocusActiveLeaf();
                }
            }, 200);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating || this._isMinimized) return;
            if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
            try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
        });

        this._switchTab(this.activeLeafIndex);
        setTimeout(() => this._hookWebviews(), 0);
    }

    _switchTab(index) {
        if (this._isSwitchingTab) return;
        if (!this.floatingLeaves || index < 0 || index >= this.floatingLeaves.length) return;
        
        this._isSwitchingTab = true;
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            const activeLeaf = this.floatingLeaves[index];
            if (activeLeaf) {
                Object.assign(activeLeaf.containerEl.style, {
                    display: 'flex', flexDirection: 'column', flex: '1',
                    height: '100%', minHeight: '0', overflow: 'hidden'
                });
                
                try {
                    if (this._origSetActiveLeaf) {
                        this._origSetActiveLeaf(activeLeaf, { focus: false });
                    } else {
                        this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                    }
                } catch (e) {}

                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                setTimeout(() => {
                    if (!this._isMinimized) this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); }      catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    this._isVaporActive = true;
                }, 50);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 150);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 350);
            }

            if (activeLeaf && activeLeaf.view && activeLeaf.view.file) {
                this.savedFilePath = activeLeaf.view.file.path;
            }
        } finally {
            this._isSwitchingTab = false;
        }

        this._renderTabs();
    }

    _closeTab(index, skipHistory = false) {
        if (!this.floatingLeaves) return;

        const now = performance.now();
        if (now - this._lastCloseTime < 150) return;
        this._lastCloseTime = now;

        this._isClosingTab = true;

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            
            if (type !== 'empty') {
                let pathOrUrl = null;
                if (type === 'markdown' && leafToClose.view?.file) {
                    pathOrUrl = leafToClose.view.file.path;
                } else if (type === 'webviewer' || type === 'custom-webview-view') {
                    pathOrUrl = viewState?.state?.url;
                }

                if (!this._closedTabsHistory) this._closedTabsHistory = [];
                this._closedTabsHistory.push({ type, pathOrUrl });
                if (this._closedTabsHistory.length > 30) this._closedTabsHistory.shift(); 
            }
        }

        this._allowDetach = true;
        try { leafToClose.detach(); } catch (_) {}
        this._allowDetach = false;

        if (leafToClose.containerEl && leafToClose.containerEl.parentElement) {
            leafToClose.containerEl.remove();
        }

        this.floatingLeaves.splice(index, 1);

        if (this.floatingLeaves.length === 0) {
            this._addNewTab('empty').then(() => {
                setTimeout(() => {
                    this._isClosingTab = false;
                    if (this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 200);
            });
            return;
        }

        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        setTimeout(() => {
            this._isClosingTab = false;
            if (this._isOpen() && !this._isMinimized) {
                this._forceFocusActiveLeaf();
            }
        }, 200);
    }

    async reopenClosedTab() {
        if (this._isReopeningTab) return;
        if (!this._isOpen() || !this._closedTabsHistory || this._closedTabsHistory.length === 0) return;

        const now = performance.now();
        if (now - this._lastReopenTime < 150) return;
        this._lastReopenTime = now;

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
            const soloEmpty = this.floatingLeaves.length === 1 &&
                activeLeaf && (activeLeaf.getViewState?.()?.type ?? 'empty') === 'empty';

            if (soloEmpty && activeLeaf) {
                const ws2 = this.app.workspace;
                const savedSetActiveLeaf2 = ws2.setActiveLeaf;
                ws2.setActiveLeaf = () => {};
                try {
                    if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                        let file = this.app.vault.getAbstractFileByPath(lastTab.pathOrUrl);
                        if (file) {
                            await activeLeaf.openFile(file);
                            const state = activeLeaf.getViewState();
                            state.state.mode = 'source'; state.state.source = false;
                            await activeLeaf.setViewState(state);
                        }
                    } else if ((lastTab.type === 'webviewer' || lastTab.type === 'custom-webview-view') && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: lastTab.type, state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if ((lastTab.type === 'webviewer' || lastTab.type === 'custom-webview-view') && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl, lastTab.type);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;

        const now = performance.now();
        if (now - this._lastNavTime < 150) return;
        this._lastNavTime = now;

        const visibleIdxs = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty')
            .map(({ i }) => i);
        if (visibleIdxs.length <= 1) return;
        const pos = visibleIdxs.indexOf(this.activeLeafIndex);
        const nextPos = ((pos === -1 ? 0 : pos) + direction + visibleIdxs.length) % visibleIdxs.length;
        this._switchTab(visibleIdxs[nextPos]);
    }

    triggerWebSearchPrompt() {
        if (!this._isOpen()) return;

        new UrlPromptModal(this.app, async (userInput) => {
            let targetUrl = userInput.trim();
            if (targetUrl) {
                const hasProtocol = /^(https?:\/\/)/i.test(targetUrl);
                const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(targetUrl);

                if (!hasProtocol && isDomain) targetUrl = 'https://' + targetUrl;
                else if (!hasProtocol) targetUrl = 'https://www.google.com/search?q= ' + encodeURIComponent(targetUrl);

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf) {
                    await activeLeaf.setViewState({
                        type: 'webviewer', state: { url: targetUrl, navigate: true }, active: true
                    });
                    this._renderTabs();
                }
            }
        }).open();
    }

    _saveViewStateData() {
        this._savedScrolls = [];
        this._savedEphemeral = [];
        
        this.floatingLeaves.forEach((leaf, idx) => {
            if (!leaf || !leaf.containerEl) return;
            
            if (typeof leaf.getEphemeralState === 'function') {
                this._savedEphemeral[idx] = leaf.getEphemeralState();
            }

            const scrollStates = [];
            const scrollers = leaf.containerEl.querySelectorAll('.cm-scroller, .markdown-preview-view, .view-content, .markdown-source-view');
            scrollers.forEach((el, index) => {
                scrollStates.push({ index: index, top: el.scrollTop, left: el.scrollLeft });
            });
            this._savedScrolls[idx] = scrollStates;
        });
    }

    _restoreViewStateData() {
        if (!this._savedScrolls && !this._savedEphemeral) return;

        this.floatingLeaves.forEach((leaf, idx) => {
            if (!leaf || !leaf.containerEl) return;
            
            if (this._savedEphemeral && this._savedEphemeral[idx] && typeof leaf.setEphemeralState === 'function') {
                leaf.setEphemeralState(this._savedEphemeral[idx]);
            }

            const scrollStates = this._savedScrolls ? this._savedScrolls[idx] : null;
            if (scrollStates) {
                const scrollers = leaf.containerEl.querySelectorAll('.cm-scroller, .markdown-preview-view, .view-content, .markdown-source-view');
                scrollStates.forEach(state => {
                    const el = scrollers[state.index];
                    if (el) { el.scrollTop = state.top; el.scrollLeft = state.left; }
                });
            }
        });
    }

    _hookWebviews() {
        if (!this.floatingContainer) return;
        const webviews = this.floatingContainer.querySelectorAll('webview');
        webviews.forEach(webview => {
            if (webview._vaporHooked) return;
            webview._vaporHooked = true;

            const tryHookElectron = () => {
                if (webview._electronHooked) return;
                try {
                    const wcId = typeof webview.getWebContentsId === 'function' ? webview.getWebContentsId() : null;
                    if (wcId) {
                        const remote = window.require?.('@electron/remote') || require('@electron/remote');
                        if (remote) {
                            const wc = remote.webContents.fromId(wcId);
                            if (wc) {
                                wc.on('before-input-event', (event, input) => {
                                    let eventType = null;
                                    if (input.type === 'keyDown') eventType = 'keydown';
                                    else if (input.type === 'keyUp') eventType = 'keyup';
                                    else return;

                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            if (!this._isMinimized) {
                                                event.preventDefault();
                                                this._isVaporActive = true;
                                                setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                                return;
                                            }
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            if (!this._isMinimized) {
                                                event.preventDefault();
                                                this._isVaporActive = true;
                                                setTimeout(() => this.reopenClosedTab(), 0);
                                                return;
                                            }
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            if (!this._isMinimized) {
                                                event.preventDefault();
                                                this.navigateTab(1);
                                                return;
                                            }
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            if (!this._isMinimized) {
                                                event.preventDefault();
                                                this.navigateTab(-1);
                                                return;
                                            }
                                        }
                                    }

                                    if (isCmdOrCtrl || isAlt) {
                                        if (webview.__bubblerAttachedTo) return;
                                        if (this._isMinimized) return;
                                        
                                        const doc = this._targetWin?.document || activeDocument;
                                        const target = doc.activeElement || doc.body;

                                        this._isVaporActive = true;

                                        const kbEvent = new (this._targetWin || window).KeyboardEvent(eventType, {
                                            key: input.key,
                                            code: input.code,
                                            bubbles: true,
                                            cancelable: true,
                                            ctrlKey: input.control,
                                            altKey: input.alt,
                                            shiftKey: input.shift,
                                            metaKey: input.meta,
                                            repeat: input.isAutoRepeat
                                        });

                                        target.dispatchEvent(kbEvent);
                                    }
                                });
                                webview._electronHooked = true;
                            }
                        }
                    }
                } catch (e) {}
            };

            webview.addEventListener('did-attach', tryHookElectron);
            webview.addEventListener('did-start-loading', tryHookElectron);
            
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            const injectScript = () => {
                webview.executeJavaScript(`
                    if (!window._vaporNoteKeyHooked) {
                        window._vaporNoteKeyHooked = true;
                        window.addEventListener('keydown', (e) => {
                            const isCmdOrCtrl = e.metaKey || e.ctrlKey;
                            const isShift = e.shiftKey;
                            const isAlt = e.altKey;
                            const key = e.key.toLowerCase();
                            
                            if (isCmdOrCtrl && key === 'w') {
                                e.preventDefault(); e.stopPropagation(); console.log('VAPORNOTE_CMD_W');
                            } else if (isCmdOrCtrl && isShift && key === 't') {
                                e.preventDefault(); e.stopPropagation(); console.log('VAPORNOTE_CMD_T');
                            } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                e.preventDefault(); e.stopPropagation(); console.log('VAPORNOTE_CMD_NAV_NEXT');
                            } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                e.preventDefault(); e.stopPropagation(); console.log('VAPORNOTE_CMD_NAV_PREV');
                            }
                        }, true);
                    }
                `).catch(() => {});
            };

            webview.addEventListener('load-commit', injectScript);
            
            webview.addEventListener('dom-ready', () => {
                injectScript();
                const doc = this._targetWin?.document || activeDocument;
                if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && activeLeaf.containerEl.contains(webview)) {
                    setTimeout(() => {
                        try {
                            if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;
                            if (!this._isMinimized) {
                                webview.focus();
                                this._isVaporActive = true;
                            }
                        } catch (_) {}
                    }, 50);
                }
            });

            webview.addEventListener('console-message', (e) => {
                if (this._isMinimized) return; 

                if (e.message === 'VAPORNOTE_CMD_W') this._closeTab(this.activeLeafIndex);
                else if (e.message === 'VAPORNOTE_CMD_T') this.reopenClosedTab();
                else if (e.message === 'VAPORNOTE_CMD_NAV_NEXT') this.navigateTab(1);
                else if (e.message === 'VAPORNOTE_CMD_NAV_PREV') this.navigateTab(-1);
            });

            webview.addEventListener('page-title-updated', () => this._renderTabs());
            webview.addEventListener('did-stop-loading', () => this._renderTabs());
        });
    }

    _renderTabs() {
        if (!this.tabBar || !this.floatingLeaves) return;

        const doc = this.tabBar.ownerDocument || activeDocument;
        this.tabBar.empty();

        this.floatingLeaves.forEach((leaf, idx) => {
            const viewType = leaf.getViewState?.()?.type ?? 'empty';
            if (viewType === 'empty') return;

            const isActive = idx === this.activeLeafIndex;

            const tab = doc.createElement('div');
            tab.style.cssText = `
                padding: 2px 8px; font-size: 10px; cursor: pointer;
                border: 1px solid ${isActive ? 'var(--border-color)' : 'transparent'};
                border-radius: 4px; display: flex; align-items: center; gap: 6px;
                background: ${isActive ? 'var(--background-primary)' : 'transparent'};
                color: ${isActive ? 'var(--text-normal)' : 'var(--text-muted)'};
                font-weight: ${isActive ? 'bold' : 'normal'}; height: 24px;
                box-sizing: border-box; margin-right: 4px; flex-shrink: 0;
            `;

            const titleSpan = doc.createElement('span');
            titleSpan.textContent = leaf.getDisplayText() || 'New Tab';
            titleSpan.style.cssText = `
                white-space: nowrap; max-width: 90px;
                overflow: hidden; text-overflow: ellipsis;
            `;
            tab.appendChild(titleSpan);

            const closeBtn = doc.createElement('span');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                cursor: pointer; font-size: 8px; opacity: 0.5; padding: 2px; line-height: 1;
            `;
            closeBtn.addEventListener('mouseenter', () => { closeBtn.style.opacity = '1'; });
            closeBtn.addEventListener('mouseleave', () => { closeBtn.style.opacity = '0.5'; });
            closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this._closeTab(idx); });
            tab.appendChild(closeBtn);

            tab.addEventListener('click', () => { this._switchTab(idx); });

            this.tabBar.appendChild(tab);
        });

        this._hookWebviews();
    }

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) {
                    parent.children.splice(idx, 1);
                    if (typeof parent.recomputeLayout === 'function') parent.recomputeLayout();
                }
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
            this.app.workspace.trigger('layout-change');
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;
        if (this._dragMode !== null || this._activeHandleDir !== null || this._dragOverlay) return;
        if (this._isMigrating || this._isOpening) return;

        if (this._queuedWin === newWin) return;
        this._queuedWin = newWin;
        if (this._moveTimeout) clearTimeout(this._moveTimeout);

        this._moveTimeout = setTimeout(async () => {
            this._queuedWin = null;
            if (this._targetWin === newWin || !this._isOpen()) return;
            if (this._dragMode !== null || this._activeHandleDir !== null || this._dragOverlay) return;

            const wasFullscreen = this._isFullscreen;

            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer' || type === 'custom-webview-view') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = wasFullscreen ? this._preFullscreenWidth : (this.floatingContainer.style.width || this._savedWidth);
            const savedH = wasFullscreen ? this._preFullscreenHeight : (this.floatingContainer.style.height || this._savedHeight);
            const savedL = wasFullscreen ? this._preFullscreenLeft : (this.floatingContainer.style.left || this._savedLeft);
            const savedT = wasFullscreen ? this._preFullscreenTop : (this.floatingContainer.style.top || this._savedTop);

            this._isMigrating = true;

            this.closeVaporNote();

            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin;

            await this._openVaporNote(null);
            if (wasFullscreen) {
                this.toggleFullscreen();
            }
            this._isMigrating = false;
        }, 80);
    }

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaves || !this._targetWin) return;
        
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer)) {
            doc.body.appendChild(this.floatingContainer);
        }

        this.floatingLeaves.forEach((leaf, idx) => {
            if (this.tabContentContainer && !this.tabContentContainer.contains(leaf.containerEl)) {
                this.tabContentContainer.appendChild(leaf.containerEl);
                
                Object.assign(leaf.containerEl.style, {
                    flex: '1', minHeight: '0', height: '100%',
                    display: idx === this.activeLeafIndex ? 'flex' : 'none',
                    flexDirection: 'column', overflow: 'hidden'
                });
            }
        });

        this._hookWebviews();
    }

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           this._savedTop || '100px',
            left:          this._savedLeft || '100px',
            right:         'auto',
            bottom:        'auto',
            width:         this._savedWidth || '380px',
            height:        this._savedHeight || '500px',
            zIndex:        '35', 
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
            opacity:       this.opacityValue,
        });
    }

    _buildChrome(container) {
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center; user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
        `;
        this.dragBar = dragBar;
        
        const titleSpan = doc.createElement('span');
        titleSpan.textContent = "VaporNote";
        dragBar.appendChild(titleSpan);
        this.titleSpan = titleSpan;

        if (this.tabBar) dragBar.appendChild(this.tabBar);

        const controls = doc.createElement('div');
        controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
        this.controls = controls;

        const sliderLabel = doc.createElement('span');
        sliderLabel.textContent = "☀";
        sliderLabel.title = "Opacity";
        sliderLabel.style.cssText = "font-size: 10px; opacity: 0.7;";
        controls.appendChild(sliderLabel);
        this.sliderLabel = sliderLabel;

        const opacitySlider = doc.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.2';
        opacitySlider.max = '1.0';
        opacitySlider.step = '0.05';
        opacitySlider.value = this.opacityValue;
        opacitySlider.style.cssText = `
            width: 50px; height: 3px; cursor: pointer; margin: 0; accent-color: var(--interactive-accent);
        `;
        opacitySlider.addEventListener('input', (e) => {
            this.opacityValue = e.target.value;
            container.style.opacity = this.opacityValue;
        });
        controls.appendChild(opacitySlider);
        this.opacitySlider = opacitySlider;

        const minimizeBtn = doc.createElement('span');
        minimizeBtn.textContent = '−';
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `
            cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;
            display: inline-flex; align-items: center; justify-content: center;
        `;
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        this.minimizeBtn = minimizeBtn;
        controls.appendChild(minimizeBtn);

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.title = "Close";
        closeBtn.style.cssText = `cursor: pointer; padding: 0 4px; font-size: 11px;`;
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        controls.appendChild(closeBtn);
        this.closeBtn = closeBtn;

        dragBar.appendChild(controls);
        container.appendChild(dragBar);

        this._resizeHandles = [];
        const thickness = '6px';
        const offset = '-3px'; 
        const cornerSize = '12px';
        const cornerOffset = '-6px';

        const createResizeHandle = (direction, styleCss) => {
            const handle = doc.createElement('div');
            handle.style.cssText = `position: absolute; z-index: 100000; user-select: none; ${styleCss}`;
            handle.setAttribute('data-direction', direction);
            container.appendChild(handle);
            this._resizeHandles.push(handle);
        };

        createResizeHandle('n', `top: ${offset}; left: 0; right: 0; height: ${thickness}; cursor: n-resize;`);
        createResizeHandle('s', `bottom: ${offset}; left: 0; right: 0; height: ${thickness}; cursor: s-resize;`);
        createResizeHandle('e', `top: 0; bottom: 0; right: ${offset}; width: ${thickness}; cursor: e-resize;`);
        createResizeHandle('w', `top: 0; bottom: 0; left: ${offset}; width: ${thickness}; cursor: w-resize;`);
        createResizeHandle('nw', `top: ${cornerOffset}; left: ${cornerOffset}; width: ${cornerSize}; height: ${cornerSize}; cursor: nw-resize;`);
        createResizeHandle('ne', `top: ${cornerOffset}; right: ${cornerOffset}; width: ${cornerSize}; height: ${cornerSize}; cursor: ne-resize;`);
        createResizeHandle('sw', `bottom: ${cornerOffset}; left: ${cornerOffset}; width: ${cornerSize}; height: ${cornerSize}; cursor: sw-resize;`);
        createResizeHandle('se', `bottom: ${cornerOffset}; right: ${cornerOffset}; width: ${cornerSize}; height: ${cornerSize}; cursor: se-resize;`);

        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                const overlayDoc = this._dragOverlay.ownerDocument;
                this._dragOverlay.remove();
                this._dragOverlay = null;
                overlayDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = '');
            }
        };

        const onMouseDown = (e, direction) => {
            this._activeHandleDir = direction; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top; startW = r.width; startH = r.height;
            e.preventDefault(); e.stopPropagation(); showOverlay(direction + '-resize');
        };

        this._resizeHandles.forEach(h => {
            const dir = h.getAttribute('data-direction');
            h.addEventListener('mousedown', (e) => onMouseDown(e, dir));
        });

        const onMouseMove = (e) => {
            if (this._dragMode === 'drag') {
                container.style.left   = (startLeft + e.clientX - startX) + 'px';
                container.style.top    = (startTop  + e.clientY - startY) + 'px';
                container.style.right  = 'auto';
                container.style.bottom = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) {
                    newW = Math.max(250, startW + dx);
                } else if (this._activeHandleDir.includes('w')) {
                    const possibleW = startW - dx;
                    if (possibleW >= 250) {
                        newW = possibleW;
                        newLeft = startLeft + dx;
                    } else {
                        newW = 250;
                        newLeft = startLeft + (startW - 250);
                    }
                }

                if (this._activeHandleDir.includes('s')) {
                    newH = Math.max(200, startH + dy);
                } else if (this._activeHandleDir.includes('n')) {
                    const possibleH = startH - dy;
                    if (possibleH >= 200) {
                        newH = possibleH;
                        newTop = startTop + dy;
                    } else {
                        newH = 200;
                        newTop = startTop + (startH - 200);
                    }
                }

                container.style.width  = newW + 'px';
                container.style.height = newH + 'px';
                container.style.left   = newLeft + 'px';
                container.style.top    = newTop + 'px';
                container.style.right  = 'auto';
                container.style.bottom = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (this._isFullscreen) return;
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._isVaporActive = false;
            this._saveViewStateData();

            if (this.settings.invisibleMinimize) {
                this._wasInvisiblyMinimized = true;
                this.floatingContainer.style.opacity = '0';
                this.floatingContainer.style.pointerEvents = 'none';

                try {
                    const doc = this._targetWin?.document || document;
                    if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                        doc.activeElement.blur();
                    }
                } catch (_) {}

                const bgLeaf = this._prevActiveLeaf ?? this.app.workspace.getMostRecentLeaf();
                if (bgLeaf) {
                    try {
                        const setFn = this._origSetActiveLeaf ?? this.app.workspace.setActiveLeaf.bind(this.app.workspace);
                        setFn(bgLeaf, { focus: true });
                    } catch (_) {}

                    setTimeout(() => {
                        try {
                            if (bgLeaf.view?.editor?.focus) {
                                bgLeaf.view.editor.focus();
                            } else {
                                const el = bgLeaf.containerEl?.querySelector('.cm-content, webview, .markdown-source-view');
                                if (el) el.focus();
                            }
                        } catch (_) {}
                    }, 50);
                }
            } else {
                this._wasInvisiblyMinimized = false;
                const r = this.floatingContainer.getBoundingClientRect();
                const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;

                if (!this._isFullscreen) {
                    this._savedWidth = r.width + 'px';
                    this._savedHeight = r.height + 'px';
                    this._savedLeftVal = currentLeft + 'px';
                }

                if (this.tabContentContainer) this.tabContentContainer.style.display = 'none';

                if (this.titleSpan) this.titleSpan.style.display = 'none';
                if (this.tabBar) this.tabBar.style.display = 'none';
                if (this.sliderLabel) this.sliderLabel.style.display = 'none';
                if (this.opacitySlider) this.opacitySlider.style.display = 'none';
                if (this.closeBtn) this.closeBtn.style.display = 'none';

                if (this.dragBar) {
                    this.dragBar.style.padding = '0'; this.dragBar.style.justifyContent = 'center';
                    this.dragBar.style.alignItems = 'center'; this.dragBar.style.height = '100%';
                }

                if (this.controls) {
                    this.controls.style.cssText = `display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; margin: 0; padding: 0;`;
                }

                this.floatingContainer.style.width = '40px';
                this.floatingContainer.style.height = '36px';
                this.floatingContainer.style.minWidth = '40px';
                this.floatingContainer.style.minHeight = '36px';
                this.floatingContainer.style.left = (currentLeft + r.width - 40) + 'px';

                if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'none');

                if (this.minimizeBtn) {
                    this.minimizeBtn.textContent = '❐'; this.minimizeBtn.title = "Restore";
                    this.minimizeBtn.style.cssText = `
                        cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
                        width: 20px; height: 20px; border-radius: 4px; background: var(--background-modifier-border);
                        font-size: 11px; line-height: 1; box-sizing: border-box; font-weight: bold;
                    `;
                }

                try {
                    const doc = this._targetWin?.document || document;
                    if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                        doc.activeElement.blur();
                    }
                } catch (_) {}

                const bgLeaf = this._prevActiveLeaf ?? this.app.workspace.getMostRecentLeaf();
                if (bgLeaf) {
                    try {
                        const setFn = this._origSetActiveLeaf ?? this.app.workspace.setActiveLeaf.bind(this.app.workspace);
                        setFn(bgLeaf, { focus: true });
                    } catch (_) {}

                    setTimeout(() => {
                        try {
                            if (bgLeaf.view?.editor?.focus) {
                                bgLeaf.view.editor.focus();
                            } else {
                                const el = bgLeaf.containerEl?.querySelector('.cm-content, webview, .markdown-source-view');
                                if (el) el.focus();
                            }
                        } catch (_) {}
                    }, 50);
                }
            }
        } else {
            this._isVaporActive = true;

            if (this._wasInvisiblyMinimized) {
                this._wasInvisiblyMinimized = false;
                this.floatingContainer.style.opacity = this.opacityValue;
                this.floatingContainer.style.pointerEvents = 'auto';

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf) this._switchTab(this.activeLeafIndex);

                this._restoreViewStateData();
                this._forceFocusActiveLeaf();

                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                }, 50);

                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                }, 150);
            } else {
                this.floatingContainer.style.minWidth = '250px';
                this.floatingContainer.style.minHeight = '200px';

                if (this._isFullscreen) {
                    Object.assign(this.floatingContainer.style, {
                        top:          '0px',
                        left:         '0px',
                        width:        '100%',
                        height:       '100%',
                        right:        'auto',
                        bottom:       'auto',
                        borderRadius: '0px'
                    });

                    if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'none');
                } else {
                    this.floatingContainer.style.width = this._savedWidth || '380px';
                    this.floatingContainer.style.height = this._savedHeight || '500px';

                    const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
                    const restoredW = parseFloat(this._savedWidth) || 380;
                    const restoredLeft = iconLeft - (restoredW - 40);
                    this.floatingContainer.style.left = restoredLeft + 'px';
                    this.floatingContainer.style.borderRadius = '8px';

                    if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');
                }

                if (this.titleSpan) this.titleSpan.style.display = 'inline';
                if (this.tabBar) this.tabBar.style.display = 'flex';
                if (this.sliderLabel) this.sliderLabel.style.display = 'inline';
                if (this.opacitySlider) this.opacitySlider.style.display = 'inline-block';
                if (this.closeBtn) this.closeBtn.style.display = 'inline';

                if (this.dragBar) {
                    this.dragBar.style.padding = '8px 12px'; this.dragBar.style.justifyContent = 'space-between';
                    this.dragBar.style.alignItems = 'center'; this.dragBar.style.height = '36px';
                }

                if (this.controls) {
                    this.controls.style.cssText = `display: flex; align-items: center; gap: 8px; margin-left: auto;`;
                }

                if (this.tabContentContainer) {
                    this.tabContentContainer.style.display = 'flex';
                    this.tabContentContainer.style.height = '100%';
                    this.tabContentContainer.style.flex = '1';
                }

                if (this.minimizeBtn) {
                    this.minimizeBtn.textContent = '−'; this.minimizeBtn.title = "Minimize";
                    this.minimizeBtn.style.cssText = `
                        cursor: pointer; padding: 0 4px; font-weight: bold; font-size: 12px;
                        display: inline-flex; align-items: center; justify-content: center;
                        background: none; width: auto; height: auto;
                    `;
                }

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf) this._switchTab(this.activeLeafIndex);

                this._restoreViewStateData();
                this._forceFocusActiveLeaf();

                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                }, 50);

                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                }, 150);
            }
        }
    }

    toggleFullscreen() {
        if (!this._isOpen() || !this.floatingContainer) return;

        if (this._isMinimized) this.toggleMinimize();

        this._isFullscreen = !this._isFullscreen;

        if (this._isFullscreen) {
            const r = this.floatingContainer.getBoundingClientRect();
            this._preFullscreenWidth  = this.floatingContainer.style.width || (r.width + 'px');
            this._preFullscreenHeight = this.floatingContainer.style.height || (r.height + 'px');
            this._preFullscreenLeft   = this.floatingContainer.style.left || (r.left + 'px');
            this._preFullscreenTop    = this.floatingContainer.style.top || (r.top + 'px');

            Object.assign(this.floatingContainer.style, {
                top:          '0px',
                left:         '0px',
                width:        '100%',
                height:       '100%',
                right:        'auto',
                bottom:       'auto',
                borderRadius: '0px'
            });

            if (this._resizeHandles) {
                this._resizeHandles.forEach(h => h.style.display = 'none');
            }
        } else {
            Object.assign(this.floatingContainer.style, {
                width:        this._preFullscreenWidth || '380px',
                height:       this._preFullscreenHeight || '500px',
                left:         this._preFullscreenLeft || 'auto',
                top:          this._preFullscreenTop || '100px',
                borderRadius: '8px'
            });

            if (this._resizeHandles) {
                this._resizeHandles.forEach(h => h.style.display = 'block');
            }
        }

        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
        try { activeLeaf?.view?.onResize?.(); }      catch (_) {}
        try { activeLeaf?.view?.editor?.refresh(); } catch (_) {}
    }

    closeVaporNote() {
        if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null; this._globalUpHandler = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._focusoutHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusout', this._focusoutHandler);
            this._focusoutHandler = null;
        }
        if (this._globalClickHandler && this._targetWin) {
            try { this._targetWin.removeEventListener('click', this._globalClickHandler, true); } catch (_) {}
            this._globalClickHandler = null;
        }
        if (this._globalMousedownHandler && this._targetWin) {
            try { this._targetWin.removeEventListener('mousedown', this._globalMousedownHandler, true); } catch (_) {}
            this._globalMousedownHandler = null;
        }
        if (this._keydownHandler && this._targetWin) {
            try { this._targetWin.removeEventListener('keydown', this._keydownHandler, true); } catch (_) {}
            this._keydownHandler = null;
        }
        if (this._dragOverlay) { this._dragOverlay.remove(); this._dragOverlay = null; }

        if (this.floatingContainer) {
            if (!this._isMinimized && !this._isFullscreen) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
            } else if (this._isFullscreen) {
                this._savedWidth  = this._preFullscreenWidth;
                this._savedHeight = this._preFullscreenHeight;
                this._savedLeft   = this._preFullscreenLeft;
                this._savedTop    = this._preFullscreenTop;
            } else {
                this._savedLeft = this._savedLeftVal || this.floatingContainer.style.left;
                this._savedTop = this.floatingContainer.style.top;
            }
            this.floatingContainer.remove(); this.floatingContainer = null;
        }

        if (this.floatingLeaves) {
            this._savedTabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(e){}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer' || type === 'custom-webview-view') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            this._savedActiveLeafIndex = this.activeLeafIndex;
        }

        if (this.floatingLeaves) {
            this._allowDetach = true;
            this.floatingLeaves.forEach((leaf) => { try { leaf.detach(); } catch (_) {} });
            this.floatingLeaves = []; this._allowDetach = false;
        }

        this._resizeHandles = [];

        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        if (this._origGetLeaf) {
            this.app.workspace.getLeaf = this._origGetLeaf;
            this._origGetLeaf = null;
        }

        if (this._origOpenLinkText) {
            this.app.workspace.openLinkText = this._origOpenLinkText;
            this._origOpenLinkText = null;
        }

        if (this._origOpenFile) {
            this.app.workspace.openFile = this._origOpenFile;
            this._origOpenFile = null;
        }

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
        this._wasInvisiblyMinimized = false;
        this._isFullscreen = false;
        this._isVaporActive = false;
        this._dragMode = null;
        this._activeHandleDir = null;

        if (this._origModalOpen) {
            Modal.prototype.open = this._origModalOpen;
            this._origModalOpen = null;
        }

        if (!this._isMigrating) new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;