---
status: open
reminders:
  - id: rem_1779864036623_19j3rueb9
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
aliases:
  - VaporNote
parent:
  - "[[(T) Create Task Priority within Document]]"
---
## Feature Requests
- [ ] Change my floating note so that when it compiles, it is always at 100% opacity (or rather not cleared at all)
- [ ] It seems like if I delete a file, the focus comes back to VaporNote?
## Complete
- [x] Make the floating note transparent (so you can see through it). You have an optional slider and you can toggle this feature on or off ✅ 2026-06-08
- [x] I'm not sure if I want multiple screens (but I'm unsure what to do with the excalidraw plugin creating a new document. It would be fine if it's the current document (but then I lose my place in the view as well. Maybe there is a way to jump back to that view? I honestly might need to make a multi-document tab system)) ✅ 2026-06-08
	- Need to modify the script so that I can access different tabs within the floating note?
- [x] Create a command within the plugin that minimizes to a small box and then expands back to the previous size it was at? Then we wouldn't need to load it every time, but we would also know that the floating note was still active. ✅ 2026-06-08
- [x] Modify script so that the last note that was open in the script stays open. ✅ 2026-06-08
- [x] Make "Command + O" behave a little differently or neater ✅ 2026-06-08
	- At least make it appear in front of the floating note
- [x] Not able to open up tabs easily which isn't good (especially when pressing the open file button) ✅ 2026-06-10
- [x] When I maximize the floating note, i want to be able to press "Command + option + left" or "Command + option + right". Right now, it seems to focus the window, but these commands are just not in use. ✅ 2026-06-16
## V35 (Stable)
- Added ability to open note from your personal quick switcher in same tab within VaporNote
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W, Cmd+Shift+T, and tab switches
        // when VaporNote is physically focused.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const isAlt       = evt.altKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;

                    // Swallows command-palette tab navigation triggers so the background main workspace doesn't navigate simultaneously
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
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        if (leaf && leaf.containerEl) {
            // Seed programmatic focus attributes early so the empty/placeholder leaf can receive focus
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        // A minimal safe containerEl stub: an object that silently absorbs any
        // DOM-class or attribute calls Obsidian's updateLayout / recomputeLayout
        // makes while walking up the parent chain. Using a real DOM element here
        // would let Obsidian mutate elements it doesn't own; using `undefined`
        // crashes on `.addClass`. This stub is the safe middle ground.
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
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;

        // Skip focusing if a settings, modal container, prompt, or hotkey suggestion selector is active
        const doc = this._targetWin?.document || activeDocument;
        if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
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

        // Seed tabindex if not already present, ensuring the layout div is keyboard-focusable
        if (!leaf.containerEl.hasAttribute('tabindex')) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // Reclaim OS-level window focus if the active element has shifted completely out of VaporNote's window context
        try {
            if (this._targetWin && this._targetWin !== window && !this._targetWin.closed) {
                const activeEl = doc.activeElement;
                const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
                    (this.floatingLeaves?.some(l => l.containerEl?.contains(activeEl)) ?? false);
                if (!isPhysicallyInVapor) {
                    this._targetWin.focus();
                }
            }
        } catch (_) {}

        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) {
                content.focus();
                if (content.tagName.toLowerCase() === 'webview') {
                    try { content.focus(); } catch (_) {}
                }
            } else {
                leaf.containerEl.focus();
            }
        }
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote orphan is specifically a leaf that was created by VaporNote (given a
            // fake parent) but has since been removed from floatingLeaves. We detect this by
            // checking whether the leaf's parent is the fake object VaporNote creates — it has
            // no real containerEl (it's a stub with a safeContainerEl object, not a DOM node).
            // We must NOT flag newly-created real workspace leaves that haven't been attached yet,
            // as those also temporarily have containerEls outside the workspace DOM.
            const parent = leaf.parent;
            if (!parent) return false;
            // VaporNote's fakeParent has a safeContainerEl stub (plain object, not a DOM element).
            // Real Obsidian parents always have a genuine HTMLElement as containerEl.
            const parentContainer = parent.containerEl;
            if (parentContainer && typeof parentContainer.nodeType === 'undefined') {
                // parentContainer is a plain object stub (no nodeType) — this is a VaporNote fake parent
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Helper used by Electron renderer targeting
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

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) {
                    return;
                }

                // Fix: swallow any background-leaf setActiveLeaf call that arrives while VaporNote
                // is physically focused. This is the exact race that causes the double-click bug:
                // Commands.js fires OBS_ACTIVATE on mousedown in its webview, which tries to re-seat
                // the background webview leaf as activeLeaf — stealing focus from the markdown editor
                // just as the user's first click lands. Dropping this call here is safe because
                // VaporNote's own focusin handler and _forceFocusActiveLeaf() will reassert the
                // correct active leaf immediately after.
                if (this._isOpen() && !this._isClosingTab && !this._isSwitchingTab &&
                    !this._isCreatingTab && this._isVaporPhysicallyFocused()) {
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
                const isVaporFocused = this._isVaporPhysicallyFocused();

                // getLeaf(false) returns ws.activeLeaf, which VaporNote overwrites with its own
                // floating leaf. External scripts (e.g. Base.js / Templater) call getLeaf(false)
                // to get the current background leaf and would receive a VaporNote leaf instead,
                // causing them to reuse or open files inside VaporNote unintentionally.
                // Fix: when newSplit is false (or falsy/undefined) and the current activeLeaf is
                // a VaporNote floating leaf, return _prevActiveLeaf (the last real background leaf)
                // so external scripts always operate on the real workspace.
                if (!newSplit && this._isOpen() && this._isVaporActive) {
                    // Any getLeaf(undefined/false) call while VaporNote is active means an
                    // external plugin (switcher, omnisearch, etc.) wants to open a file in
                    // the "current" leaf. We return the real background leaf as normal, but
                    // wrap its openFile so the file is redirected into the active VaporNote
                    // tab instead of opening in the background workspace.
                    const currentActive = ws.activeLeaf;
                    const realLeaf = (currentActive && this.floatingLeaves && this.floatingLeaves.includes(currentActive))
                        ? (this._prevActiveLeaf ?? this._origGetLeaf(false))
                        : this._origGetLeaf(false);
                    if (realLeaf) {
                        const origOpenFile = realLeaf.openFile?.bind(realLeaf);
                        if (origOpenFile) {
                            realLeaf.openFile = async (file, state) => {
                                realLeaf.openFile = origOpenFile; // restore immediately
                                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                if (activeLeaf) {
                                    await activeLeaf.openFile(file, state);
                                    this._switchTab(this.activeLeafIndex);
                                    return;
                                }
                                return origOpenFile(file, state);
                            };
                        }
                        return realLeaf;
                    }
                }

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                // When VaporNote is focused and a new tab is requested by an external
                // caller (e.g. a switcher plugin), intercept the leaf Obsidian creates and
                // wrap its openFile so the file lands in the active VaporNote tab instead.
                const newLeaf = this._origGetLeaf(newSplit, ...args);
                if (newLeaf && this._isOpen() && this._isVaporActive && (newSplit === 'tab' || newSplit === true)) {
                    const origOpenFile = newLeaf.openFile?.bind(newLeaf);
                    if (origOpenFile) {
                        newLeaf.openFile = async (file, state) => {
                            // Restore immediately so we don't permanently break this leaf
                            newLeaf.openFile = origOpenFile;
                            const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                            if (activeLeaf) {
                                // Silently detach the unwanted background leaf
                                try { newLeaf.detach(); } catch (_) {}
                                await activeLeaf.openFile(file, state);
                                this._switchTab(this.activeLeafIndex);
                                return;
                            }
                            return origOpenFile(file, state);
                        };
                    }
                }
                return newLeaf;
            };

            // Patch workspace.openLinkText and workspace.openFile so that when the
            // native empty-tab UI's quick-switcher resolves, the file opens inside the
            // active VaporNote leaf instead of being routed to the background workspace.
            // Obsidian uses openLinkText for wiki-link navigation and openFile for the
            // quick switcher / file picker — both bypass our getLeaf patch internally.
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
                if (this._isOpen() && this._isVaporActive) {
                    const file = this.app.metadataCache.getFirstLinkpathDest(linkText, sourcePath)
                        ?? this.app.vault.getAbstractFileByPath(linkText);
                    if (file && await _vaporOpenInActiveLeaf(file, openState)) return;
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
                    if (this._isOpen() && this._isVaporActive) {
                        if (await _vaporOpenInActiveLeaf(file, openState)) return;
                    }
                    return this._origOpenFile(file, openState);
                };
            }

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;

                // Intercept clicks on the native empty-tab "Open file" / "Go to file" button.
                // Obsidian renders this as a .suggestion-item or a button inside the empty view.
                // We catch any click that lands inside an empty leaf's content area and opens
                // the native switcher — replace it with our own modal that targets VaporNote.
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
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        // Capture the CURRENT setActiveLeaf — which may already be VaporNote's own
        // patch if VaporNote is open. Using .bind() here would re-bind to whatever
        // object ws is at call time, but we need to preserve the function reference
        // itself so that restoring it puts back exactly what was there (the VaporNote
        // intercept), not Obsidian's raw original.
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip and programmatic switches.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately. This prevents the "two clicks needed"
                // problem where the first click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);

                // Safety-net focus passes to override focus-stealing transitions during modal close sequences
                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
                        this._forceFocusActiveLeaf();
                    }
                }, 150);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            
            // Only record in history if it is a real tab (not an empty placeholder)
            if (type !== 'empty') {
                let pathOrUrl = null;
                if (type === 'markdown' && leafToClose.view?.file) {
                    pathOrUrl = leafToClose.view.file.path;
                } else if (type === 'webviewer') {
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
                    // Force reclaim focus of the new empty tab once mounted
                    if (this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 200);
            });
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
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

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
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
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    /* fall through to normal add */
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            
            // Focus the webview inside DOM once loaded and ready, checking first that no input prompt modals are open
            webview.addEventListener('dom-ready', () => {
                injectScript();
                const doc = this._targetWin?.document || activeDocument;
                if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && activeLeaf.containerEl.contains(webview)) {
                    setTimeout(() => {
                        try {
                            if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;
                            webview.focus();
                            this._isVaporActive = true;
                        } catch (_) {}
                    }, 50);
                }
            });

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
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
            opacity:       this.opacityValue, // Container-level uniform CSS opacity
            transition:    'opacity 0.15s ease-in-out',
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
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // On minimize: return focus to whatever background leaf the user was in before
            // VaporNote took over. _prevActiveLeaf is the last non-VaporNote leaf that became
            // active, so it's the correct target regardless of how many panes the background has.
            // We use _origSetActiveLeaf (bypassing VaporNote's own patch) to avoid the guard that
            // swallows non-floatingLeaves calls while VaporNote is physically focused.
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

                // Also push DOM focus directly to the editor/view element in case
                // setActiveLeaf's focus path is suppressed by any active window patches.
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
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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
```
## V34
- Added a guard so that I can click within VaporNote's markdown file when my previous focus was a web view in the obsidian background window 
- Added it so the background focus becomes in view. 
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W, Cmd+Shift+T, and tab switches
        // when VaporNote is physically focused.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const isAlt       = evt.altKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;

                    // Swallows command-palette tab navigation triggers so the background main workspace doesn't navigate simultaneously
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
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        if (leaf && leaf.containerEl) {
            // Seed programmatic focus attributes early so the empty/placeholder leaf can receive focus
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        // A minimal safe containerEl stub: an object that silently absorbs any
        // DOM-class or attribute calls Obsidian's updateLayout / recomputeLayout
        // makes while walking up the parent chain. Using a real DOM element here
        // would let Obsidian mutate elements it doesn't own; using `undefined`
        // crashes on `.addClass`. This stub is the safe middle ground.
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
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;

        // Skip focusing if a settings, modal container, prompt, or hotkey suggestion selector is active
        const doc = this._targetWin?.document || activeDocument;
        if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
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

        // Seed tabindex if not already present, ensuring the layout div is keyboard-focusable
        if (!leaf.containerEl.hasAttribute('tabindex')) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // Reclaim OS-level window focus if the active element has shifted completely out of VaporNote's window context
        try {
            if (this._targetWin && this._targetWin !== window && !this._targetWin.closed) {
                const activeEl = doc.activeElement;
                const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
                    (this.floatingLeaves?.some(l => l.containerEl?.contains(activeEl)) ?? false);
                if (!isPhysicallyInVapor) {
                    this._targetWin.focus();
                }
            }
        } catch (_) {}

        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) {
                content.focus();
                if (content.tagName.toLowerCase() === 'webview') {
                    try { content.focus(); } catch (_) {}
                }
            } else {
                leaf.containerEl.focus();
            }
        }
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote orphan is specifically a leaf that was created by VaporNote (given a
            // fake parent) but has since been removed from floatingLeaves. We detect this by
            // checking whether the leaf's parent is the fake object VaporNote creates — it has
            // no real containerEl (it's a stub with a safeContainerEl object, not a DOM node).
            // We must NOT flag newly-created real workspace leaves that haven't been attached yet,
            // as those also temporarily have containerEls outside the workspace DOM.
            const parent = leaf.parent;
            if (!parent) return false;
            // VaporNote's fakeParent has a safeContainerEl stub (plain object, not a DOM element).
            // Real Obsidian parents always have a genuine HTMLElement as containerEl.
            const parentContainer = parent.containerEl;
            if (parentContainer && typeof parentContainer.nodeType === 'undefined') {
                // parentContainer is a plain object stub (no nodeType) — this is a VaporNote fake parent
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Helper used by Electron renderer targeting
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

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) {
                    return;
                }

                // Fix: swallow any background-leaf setActiveLeaf call that arrives while VaporNote
                // is physically focused. This is the exact race that causes the double-click bug:
                // Commands.js fires OBS_ACTIVATE on mousedown in its webview, which tries to re-seat
                // the background webview leaf as activeLeaf — stealing focus from the markdown editor
                // just as the user's first click lands. Dropping this call here is safe because
                // VaporNote's own focusin handler and _forceFocusActiveLeaf() will reassert the
                // correct active leaf immediately after.
                if (this._isOpen() && !this._isClosingTab && !this._isSwitchingTab &&
                    !this._isCreatingTab && this._isVaporPhysicallyFocused()) {
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
                const isVaporFocused = this._isVaporPhysicallyFocused();

                // getLeaf(false) returns ws.activeLeaf, which VaporNote overwrites with its own
                // floating leaf. External scripts (e.g. Base.js / Templater) call getLeaf(false)
                // to get the current background leaf and would receive a VaporNote leaf instead,
                // causing them to reuse or open files inside VaporNote unintentionally.
                // Fix: when newSplit is false (or falsy/undefined) and the current activeLeaf is
                // a VaporNote floating leaf, return _prevActiveLeaf (the last real background leaf)
                // so external scripts always operate on the real workspace.
                if (!newSplit && this._isOpen()) {
                    const currentActive = ws.activeLeaf;
                    if (currentActive && this.floatingLeaves && this.floatingLeaves.includes(currentActive)) {
                        const realLeaf = this._prevActiveLeaf ?? this._origGetLeaf(false);
                        if (realLeaf) return realLeaf;
                    }
                }

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        // Capture the CURRENT setActiveLeaf — which may already be VaporNote's own
        // patch if VaporNote is open. Using .bind() here would re-bind to whatever
        // object ws is at call time, but we need to preserve the function reference
        // itself so that restoring it puts back exactly what was there (the VaporNote
        // intercept), not Obsidian's raw original.
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip and programmatic switches.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately. This prevents the "two clicks needed"
                // problem where the first click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);

                // Safety-net focus passes to override focus-stealing transitions during modal close sequences
                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
                        this._forceFocusActiveLeaf();
                    }
                }, 150);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            
            // Only record in history if it is a real tab (not an empty placeholder)
            if (type !== 'empty') {
                let pathOrUrl = null;
                if (type === 'markdown' && leafToClose.view?.file) {
                    pathOrUrl = leafToClose.view.file.path;
                } else if (type === 'webviewer') {
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
                    // Force reclaim focus of the new empty tab once mounted
                    if (this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 200);
            });
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
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

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
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
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    /* fall through to normal add */
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            
            // Focus the webview inside DOM once loaded and ready, checking first that no input prompt modals are open
            webview.addEventListener('dom-ready', () => {
                injectScript();
                const doc = this._targetWin?.document || activeDocument;
                if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && activeLeaf.containerEl.contains(webview)) {
                    setTimeout(() => {
                        try {
                            if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;
                            webview.focus();
                            this._isVaporActive = true;
                        } catch (_) {}
                    }, 50);
                }
            });

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
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
            opacity:       this.opacityValue, // Container-level uniform CSS opacity
            transition:    'opacity 0.15s ease-in-out',
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
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // On minimize: return focus to whatever background leaf the user was in before
            // VaporNote took over. _prevActiveLeaf is the last non-VaporNote leaf that became
            // active, so it's the correct target regardless of how many panes the background has.
            // We use _origSetActiveLeaf (bypassing VaporNote's own patch) to avoid the guard that
            // swallows non-floatingLeaves calls while VaporNote is physically focused.
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

                // Also push DOM focus directly to the editor/view element in case
                // setActiveLeaf's focus path is suppressed by any active window patches.
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
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```
## V33 (Stable)
- Changed opacity so that everything dims
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W, Cmd+Shift+T, and tab switches
        // when VaporNote is physically focused.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const isAlt       = evt.altKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;

                    // Swallows command-palette tab navigation triggers so the background main workspace doesn't navigate simultaneously
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
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        if (leaf && leaf.containerEl) {
            // Seed programmatic focus attributes early so the empty/placeholder leaf can receive focus
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        // A minimal safe containerEl stub: an object that silently absorbs any
        // DOM-class or attribute calls Obsidian's updateLayout / recomputeLayout
        // makes while walking up the parent chain. Using a real DOM element here
        // would let Obsidian mutate elements it doesn't own; using `undefined`
        // crashes on `.addClass`. This stub is the safe middle ground.
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
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;

        // Skip focusing if a settings, modal container, prompt, or hotkey suggestion selector is active
        const doc = this._targetWin?.document || activeDocument;
        if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
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

        // Seed tabindex if not already present, ensuring the layout div is keyboard-focusable
        if (!leaf.containerEl.hasAttribute('tabindex')) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // Reclaim OS-level window focus if the active element has shifted completely out of VaporNote's window context
        try {
            if (this._targetWin && this._targetWin !== window && !this._targetWin.closed) {
                const activeEl = doc.activeElement;
                const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
                    (this.floatingLeaves?.some(l => l.containerEl?.contains(activeEl)) ?? false);
                if (!isPhysicallyInVapor) {
                    this._targetWin.focus();
                }
            }
        } catch (_) {}

        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) {
                content.focus();
                if (content.tagName.toLowerCase() === 'webview') {
                    try { content.focus(); } catch (_) {}
                }
            } else {
                leaf.containerEl.focus();
            }
        }
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote leaf's containerEl is a direct child of tabContentContainer,
            // which is itself inside floatingContainer — never inside Obsidian's workspace splits.
            // If the leaf's containerEl is not attached to Obsidian's real workspace DOM,
            // it's either still ours (handled above) or an orphan we must absorb.
            const wsRoot = this.app.workspace.containerEl;
            if (wsRoot && leaf.containerEl && !wsRoot.contains(leaf.containerEl)) {
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Helper used by Electron renderer targeting
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

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) return;
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = this._isVaporFocused();

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        // Capture the CURRENT setActiveLeaf — which may already be VaporNote's own
        // patch if VaporNote is open. Using .bind() here would re-bind to whatever
        // object ws is at call time, but we need to preserve the function reference
        // itself so that restoring it puts back exactly what was there (the VaporNote
        // intercept), not Obsidian's raw original.
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip and programmatic switches.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately. This prevents the "two clicks needed"
                // problem where the first click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);

                // Safety-net focus passes to override focus-stealing transitions during modal close sequences
                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
                        this._forceFocusActiveLeaf();
                    }
                }, 150);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            
            // Only record in history if it is a real tab (not an empty placeholder)
            if (type !== 'empty') {
                let pathOrUrl = null;
                if (type === 'markdown' && leafToClose.view?.file) {
                    pathOrUrl = leafToClose.view.file.path;
                } else if (type === 'webviewer') {
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
                    // Force reclaim focus of the new empty tab once mounted
                    if (this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 200);
            });
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
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

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
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
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    /* fall through to normal add */
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            
            // Focus the webview inside DOM once loaded and ready, checking first that no input prompt modals are open
            webview.addEventListener('dom-ready', () => {
                injectScript();
                const doc = this._targetWin?.document || activeDocument;
                if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && activeLeaf.containerEl.contains(webview)) {
                    setTimeout(() => {
                        try {
                            if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;
                            webview.focus();
                            this._isVaporActive = true;
                        } catch (_) {}
                    }, 50);
                }
            });

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
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
            opacity:       this.opacityValue, // Container-level uniform CSS opacity
            transition:    'opacity 0.15s ease-in-out',
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
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // Blur VaporNote without routing focus to any specific leaf.
            // setActiveLeaf({ focus: true }) triggers Obsidian's window-switching
            // logic which moves you to the Space that leaf lives in — not desired.
            try {
                const doc = this._targetWin?.document || document;
                if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                    doc.activeElement.blur();
                }
            } catch (_) {}
        } else {
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```
## V32 (More Stable)
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W, Cmd+Shift+T, and tab switches
        // when VaporNote is physically focused.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const isAlt       = evt.altKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;

                    // Swallows command-palette tab navigation triggers so the background main workspace doesn't navigate simultaneously
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
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        if (leaf && leaf.containerEl) {
            // Seed programmatic focus attributes early so the empty/placeholder leaf can receive focus
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        // A minimal safe containerEl stub: an object that silently absorbs any
        // DOM-class or attribute calls Obsidian's updateLayout / recomputeLayout
        // makes while walking up the parent chain. Using a real DOM element here
        // would let Obsidian mutate elements it doesn't own; using `undefined`
        // crashes on `.addClass`. This stub is the safe middle ground.
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
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;

        // Skip focusing if a settings, modal container, prompt, or hotkey suggestion selector is active
        const doc = this._targetWin?.document || activeDocument;
        if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
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

        // Seed tabindex if not already present, ensuring the layout div is keyboard-focusable
        if (!leaf.containerEl.hasAttribute('tabindex')) {
            leaf.containerEl.setAttribute('tabindex', '-1');
            leaf.containerEl.style.outline = 'none';
        }

        // Reclaim OS-level window focus if the active element has shifted completely out of VaporNote's window context
        try {
            if (this._targetWin && this._targetWin !== window && !this._targetWin.closed) {
                const activeEl = doc.activeElement;
                const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
                    (this.floatingLeaves?.some(l => l.containerEl?.contains(activeEl)) ?? false);
                if (!isPhysicallyInVapor) {
                    this._targetWin.focus();
                }
            }
        } catch (_) {}

        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) {
                content.focus();
                if (content.tagName.toLowerCase() === 'webview') {
                    try { content.focus(); } catch (_) {}
                }
            } else {
                leaf.containerEl.focus();
            }
        }
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote leaf's containerEl is a direct child of tabContentContainer,
            // which is itself inside floatingContainer — never inside Obsidian's workspace splits.
            // If the leaf's containerEl is not attached to Obsidian's real workspace DOM,
            // it's either still ours (handled above) or an orphan we must absorb.
            const wsRoot = this.app.workspace.containerEl;
            if (wsRoot && leaf.containerEl && !wsRoot.contains(leaf.containerEl)) {
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Helper used by Electron renderer targeting
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

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) return;
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = this._isVaporFocused();

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        // Capture the CURRENT setActiveLeaf — which may already be VaporNote's own
        // patch if VaporNote is open. Using .bind() here would re-bind to whatever
        // object ws is at call time, but we need to preserve the function reference
        // itself so that restoring it puts back exactly what was there (the VaporNote
        // intercept), not Obsidian's raw original.
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip and programmatic switches.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately. This prevents the "two clicks needed"
                // problem where the first click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);

                // Safety-net focus passes to override focus-stealing transitions during modal close sequences
                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
                        this._forceFocusActiveLeaf();
                    }
                }, 150);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            
            // Only record in history if it is a real tab (not an empty placeholder)
            if (type !== 'empty') {
                let pathOrUrl = null;
                if (type === 'markdown' && leafToClose.view?.file) {
                    pathOrUrl = leafToClose.view.file.path;
                } else if (type === 'webviewer') {
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
                    // Force reclaim focus of the new empty tab once mounted
                    if (this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 200);
            });
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
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

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
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
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    /* fall through to normal add */
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            
            // Focus the webview inside DOM once loaded and ready, checking first that no input prompt modals are open
            webview.addEventListener('dom-ready', () => {
                injectScript();
                const doc = this._targetWin?.document || activeDocument;
                if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && activeLeaf.containerEl.contains(webview)) {
                    setTimeout(() => {
                        try {
                            if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;
                            webview.focus();
                            this._isVaporActive = true;
                        } catch (_) {}
                    }, 50);
                }
            });

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        Object.assign(el.style, {
            position:      'fixed',
            top:           this._savedTop || '100px',
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
            width:         this._savedWidth || '380px',
            height:        this._savedHeight || '500px',
            zIndex:        '35', 
            background:    `color-mix(in srgb, var(--background-primary) ${pct}%, transparent)`,
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
            transition:    'background-color 0.15s ease-in-out',
        });
    }

    _buildChrome(container) {
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: color-mix(in srgb, var(--background-secondary) ${pct}%, transparent);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            const currentPct = Math.round(parseFloat(this.opacityValue) * 100);
            container.style.background = `color-mix(in srgb, var(--background-primary) ${currentPct}%, transparent)`;
            if (this.dragBar) {
                this.dragBar.style.background = `color-mix(in srgb, var(--background-secondary) ${currentPct}%, transparent)`;
            }
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // Blur VaporNote without routing focus to any specific leaf.
            // setActiveLeaf({ focus: true }) triggers Obsidian's window-switching
            // logic which moves you to the Space that leaf lives in — not desired.
            try {
                const doc = this._targetWin?.document || document;
                if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                    doc.activeElement.blur();
                }
            } catch (_) {}
        } else {
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```
## V31 (Stable)
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W, Cmd+Shift+T, and tab switches
        // when VaporNote is physically focused.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const isAlt       = evt.altKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;

                    // Swallows command-palette tab navigation triggers so the background main workspace doesn't navigate simultaneously
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
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        // A minimal safe containerEl stub: an object that silently absorbs any
        // DOM-class or attribute calls Obsidian's updateLayout / recomputeLayout
        // makes while walking up the parent chain. Using a real DOM element here
        // would let Obsidian mutate elements it doesn't own; using `undefined`
        // crashes on `.addClass`. This stub is the safe middle ground.
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
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;

        // Skip focusing if a settings, modal container, prompt, or hotkey suggestion selector is active
        const doc = this._targetWin?.document || activeDocument;
        if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
        if (this.app.workspace.activeLeaf !== leaf) {
            try {
                if (this._origSetActiveLeaf) {
                    this._origSetActiveLeaf(leaf, { focus: false });
                } else {
                    this.app.workspace.setActiveLeaf(leaf, { focus: false });
                }
            } catch (e) {}
        }

        // Single DOM focus — no retries; retries cause focusin to re-fire
        // which fights with click handling and requires multiple clicks to settle.
        if (!leaf.containerEl) return;
        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) {
                content.focus();
                if (content.tagName.toLowerCase() === 'webview') {
                    try { content.focus(); } catch (_) {}
                }
            } else {
                leaf.containerEl.focus();
            }
        }
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote leaf's containerEl is a direct child of tabContentContainer,
            // which is itself inside floatingContainer — never inside Obsidian's workspace splits.
            // If the leaf's containerEl is not attached to Obsidian's real workspace DOM,
            // it's either still ours (handled above) or an orphan we must absorb.
            const wsRoot = this.app.workspace.containerEl;
            if (wsRoot && leaf.containerEl && !wsRoot.contains(leaf.containerEl)) {
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Helper used by Electron renderer targeting
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

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) return;
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = this._isVaporFocused();

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        // Capture the CURRENT setActiveLeaf — which may already be VaporNote's own
        // patch if VaporNote is open. Using .bind() here would re-bind to whatever
        // object ws is at call time, but we need to preserve the function reference
        // itself so that restoring it puts back exactly what was there (the VaporNote
        // intercept), not Obsidian's raw original.
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip and programmatic switches.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately. This prevents the "two clicks needed"
                // problem where the first click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);

                // Safety-net focus passes to override focus-stealing transitions during modal close sequences
                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
                        this._forceFocusActiveLeaf();
                    }
                }, 150);

                setTimeout(() => {
                    if (this.activeLeafIndex === index && this._isOpen()) {
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            let pathOrUrl = null;
            if (type === 'markdown' && leafToClose.view?.file) {
                pathOrUrl = leafToClose.view.file.path;
            } else if (type === 'webviewer') {
                pathOrUrl = viewState?.state?.url;
            }

            if (!this._closedTabsHistory) this._closedTabsHistory = [];
            this._closedTabsHistory.push({ type, pathOrUrl });
            if (this._closedTabsHistory.length > 30) this._closedTabsHistory.shift(); 
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
                    // Force reclaim focus of the new empty tab once mounted
                    if (this._isOpen() && !this._isMinimized) {
                        this._forceFocusActiveLeaf();
                    }
                }, 200);
            });
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
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

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
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
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    /* fall through to normal add */
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            
            // Focus the webview inside DOM once loaded and ready, checking first that no input prompt modals are open
            webview.addEventListener('dom-ready', () => {
                injectScript();
                const doc = this._targetWin?.document || activeDocument;
                if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;

                const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                if (activeLeaf && activeLeaf.containerEl.contains(webview)) {
                    setTimeout(() => {
                        try {
                            if (doc.querySelector('.modal-container, .prompt, .suggestion-container')) return;
                            webview.focus();
                            this._isVaporActive = true;
                        } catch (_) {}
                    }, 50);
                }
            });

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        Object.assign(el.style, {
            position:      'fixed',
            top:           this._savedTop || '100px',
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
            width:         this._savedWidth || '380px',
            height:        this._savedHeight || '500px',
            zIndex:        '35', 
            background:    `color-mix(in srgb, var(--background-primary) ${pct}%, transparent)`,
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
            transition:    'background-color 0.15s ease-in-out',
        });
    }

    _buildChrome(container) {
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: color-mix(in srgb, var(--background-secondary) ${pct}%, transparent);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            const currentPct = Math.round(parseFloat(this.opacityValue) * 100);
            container.style.background = `color-mix(in srgb, var(--background-primary) ${currentPct}%, transparent)`;
            if (this.dragBar) {
                this.dragBar.style.background = `color-mix(in srgb, var(--background-secondary) ${currentPct}%, transparent)`;
            }
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // Blur VaporNote without routing focus to any specific leaf.
            // setActiveLeaf({ focus: true }) triggers Obsidian's window-switching
            // logic which moves you to the Space that leaf lives in — not desired.
            try {
                const doc = this._targetWin?.document || document;
                if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                    doc.activeElement.blur();
                }
            } catch (_) {}
        } else {
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```
## V30 (More Stable)
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W and Cmd+Shift+T when VaporNote
        // is physically focused — Obsidian's hotkey router runs independently of the
        // DOM event system so stopPropagation() alone cannot block it.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;
                }
                return this._origScopeHandleKey(evt, keyInfo);
            };
        }

        // Intercept global Modal.open transitions to force modal targeting alignment
        const self = this;
        this._origModalOpen = Modal.prototype.open;
        Modal.prototype.open = function(...args) {
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        // A minimal safe containerEl stub: an object that silently absorbs any
        // DOM-class or attribute calls Obsidian's updateLayout / recomputeLayout
        // makes while walking up the parent chain. Using a real DOM element here
        // would let Obsidian mutate elements it doesn't own; using `undefined`
        // crashes on `.addClass`. This stub is the safe middle ground.
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
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot:         () => fakeRoot,
            isAttached:      () => true,
            recomputeLayout: () => {},
            updateLayout:    () => {},
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;
        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
        if (this.app.workspace.activeLeaf !== leaf) {
            try {
                if (this._origSetActiveLeaf) {
                    this._origSetActiveLeaf(leaf, { focus: false });
                } else {
                    this.app.workspace.setActiveLeaf(leaf, { focus: false });
                }
            } catch (e) {}
        }

        // Single DOM focus — no retries; retries cause focusin to re-fire
        // which fights with click handling and requires multiple clicks to settle.
        if (!leaf.containerEl) return;
        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) content.focus();
            else leaf.containerEl.focus();
        }
    }

    _setupWindowFocusListeners() {
        // Intentionally empty — all ambient focus/mousedown listeners removed.
        //
        // History: browser-window-focus and per-window mousedown both cause a
        // snap-back loop on macOS. Commands.js fires OBS_ACTIVATE (via console.log)
        // on every webview mousedown, which calls win.focus() + setActiveLeaf on
        // the source window, re-triggering focus on window 1 mid-interaction.
        // Ambient browser-window-focus from Electron fires after mouseup when the
        // cursor is over window 1, undoing any mid-drag migration.
        //
        // Migration now happens ONLY via the toggle shortcut (toggleVaporNote),
        // which uses _getElectronFocusedRendererWin() — ground truth from Electron —
        // to target whichever window the user is actually in.
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote leaf's containerEl is a direct child of tabContentContainer,
            // which is itself inside floatingContainer — never inside Obsidian's workspace splits.
            // If the leaf's containerEl is not attached to Obsidian's real workspace DOM,
            // it's either still ours (handled above) or an orphan we must absorb.
            const wsRoot = this.app.workspace.containerEl;
            if (wsRoot && leaf.containerEl && !wsRoot.contains(leaf.containerEl)) {
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) return;
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = this._isVaporFocused();

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        // Capture the CURRENT setActiveLeaf — which may already be VaporNote's own
        // patch if VaporNote is open. Using .bind() here would re-bind to whatever
        // object ws is at call time, but we need to preserve the function reference
        // itself so that restoring it puts back exactly what was there (the VaporNote
        // intercept), not Obsidian's raw original.
        const savedSetActiveLeaf = ws.setActiveLeaf;
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip (fix 4: webview tab click doesn't set focus) and
        // programmatic switches. Must be set before any async work below.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately (single-click activation,
                // fix 3). This prevents the "two clicks needed" problem where the first
                // click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            let pathOrUrl = null;
            if (type === 'markdown' && leafToClose.view?.file) {
                pathOrUrl = leafToClose.view.file.path;
            } else if (type === 'webviewer') {
                pathOrUrl = viewState?.state?.url;
            }

            if (!this._closedTabsHistory) this._closedTabsHistory = [];
            this._closedTabsHistory.push({ type, pathOrUrl });
            if (this._closedTabsHistory.length > 30) this._closedTabsHistory.shift(); 
        }

        this._allowDetach = true;
        try { leafToClose.detach(); } catch (_) {}
        this._allowDetach = false;

        if (leafToClose.containerEl && leafToClose.containerEl.parentElement) {
            leafToClose.containerEl.remove();
        }

        this.floatingLeaves.splice(index, 1);

        if (this.floatingLeaves.length === 0) {
            this._addNewTab('empty');
            setTimeout(() => { this._isClosingTab = false; }, 200);
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
        setTimeout(() => {
            this._isClosingTab = false;
        }, 200);
    }

    async reopenClosedTab() {
        if (this._isReopeningTab) return;
        if (!this._isOpen() || !this._closedTabsHistory || this._closedTabsHistory.length === 0) return;

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
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
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) {
                    ws2.setActiveLeaf = savedSetActiveLeaf2;
                    /* fall through to normal add */
                }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            webview.addEventListener('dom-ready', injectScript);

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        Object.assign(el.style, {
            position:      'fixed',
            top:           this._savedTop || '100px',
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
            width:         this._savedWidth || '380px',
            height:        this._savedHeight || '500px',
            zIndex:        '35', 
            background:    `color-mix(in srgb, var(--background-primary) ${pct}%, transparent)`,
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
            transition:    'background-color 0.15s ease-in-out',
        });
    }

    _buildChrome(container) {
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: color-mix(in srgb, var(--background-secondary) ${pct}%, transparent);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            const currentPct = Math.round(parseFloat(this.opacityValue) * 100);
            container.style.background = `color-mix(in srgb, var(--background-primary) ${currentPct}%, transparent)`;
            if (this.dragBar) {
                this.dragBar.style.background = `color-mix(in srgb, var(--background-secondary) ${currentPct}%, transparent)`;
            }
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // Blur VaporNote without routing focus to any specific leaf.
            // setActiveLeaf({ focus: true }) triggers Obsidian's window-switching
            // logic which moves you to the Space that leaf lives in — not desired.
            try {
                const doc = this._targetWin?.document || document;
                if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                    doc.activeElement.blur();
                }
            } catch (_) {}
        } else {
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```
## V29 (Unstable)
- Trying to get Command + W and Command + T + W working
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Patch app.scope.handleKey to swallow Cmd+W and Cmd+Shift+T when VaporNote
        // is physically focused — Obsidian's hotkey router runs independently of the
        // DOM event system so stopPropagation() alone cannot block it.
        const scope = this.app.scope;
        if (scope && typeof scope.handleKey === 'function') {
            this._origScopeHandleKey = scope.handleKey.bind(scope);
            scope.handleKey = (evt, keyInfo) => {
                if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                    const isCmdOrCtrl = evt.metaKey || evt.ctrlKey;
                    const isShift     = evt.shiftKey;
                    const key         = (keyInfo?.key || evt.key || '').toLowerCase();
                    if (isCmdOrCtrl && key === 'w') return false;
                    if (isCmdOrCtrl && isShift && key === 't') return false;
                }
                return this._origScopeHandleKey(evt, keyInfo);
            };
        }

        // Intercept global Modal.open transitions to force modal targeting alignment
        const self = this;
        this._origModalOpen = Modal.prototype.open;
        Modal.prototype.open = function(...args) {
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        const fakeRoot = {
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl: leaf.containerEl,
            getRoot: () => fakeRoot,
            isAttached: () => true,
            type: 'root',
        };

        const fakeParent = {
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            getContainer: () => noopContainer,
            children:     [leaf],
            type:         'split',
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot: () => fakeRoot,
            isAttached: () => true,
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;
        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
        if (this.app.workspace.activeLeaf !== leaf) {
            try {
                if (this._origSetActiveLeaf) {
                    this._origSetActiveLeaf(leaf, { focus: false });
                } else {
                    this.app.workspace.setActiveLeaf(leaf, { focus: false });
                }
            } catch (e) {}
        }

        // Single DOM focus — no retries; retries cause focusin to re-fire
        // which fights with click handling and requires multiple clicks to settle.
        if (!leaf.containerEl) return;
        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) content.focus();
            else leaf.containerEl.focus();
        }
    }

    _setupWindowFocusListeners() {
        // Intentionally empty — all ambient focus/mousedown listeners removed.
        //
        // History: browser-window-focus and per-window mousedown both cause a
        // snap-back loop on macOS. Commands.js fires OBS_ACTIVATE (via console.log)
        // on every webview mousedown, which calls win.focus() + setActiveLeaf on
        // the source window, re-triggering focus on window 1 mid-interaction.
        // Ambient browser-window-focus from Electron fires after mouseup when the
        // cursor is over window 1, undoing any mid-drag migration.
        //
        // Migration now happens ONLY via the toggle shortcut (toggleVaporNote),
        // which uses _getElectronFocusedRendererWin() — ground truth from Electron —
        // to target whichever window the user is actually in.
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
        if (!this.floatingContainer) return false;
        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;
        if (!activeEl) return false;
        if (activeEl.closest && activeEl.closest('.modal-container')) return false;
        if (activeEl === doc.body || activeEl === doc.documentElement) return false;
        return this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);
    }

    // Returns true if this leaf was created by VaporNote (fake parent, not in Obsidian's real
    // split tree) but has since been removed from floatingLeaves. Forwarding such a leaf to
    // Obsidian's real setActiveLeaf crashes because the fake parent has no real DOM elements.
    _isOrphanedVaporLeaf(leaf) {
        try {
            // A VaporNote leaf's containerEl is a direct child of tabContentContainer,
            // which is itself inside floatingContainer — never inside Obsidian's workspace splits.
            // If the leaf's containerEl is not attached to Obsidian's real workspace DOM,
            // it's either still ours (handled above) or an orphan we must absorb.
            const wsRoot = this.app.workspace.containerEl;
            if (wsRoot && leaf.containerEl && !wsRoot.contains(leaf.containerEl)) {
                return true;
            }
        } catch (_) {}
        return false;
    }

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                // Safety net: if this is a VaporNote leaf that has already been removed from
                // floatingLeaves (e.g. just closed, or called by Commands.js OBS_ACTIVATE after
                // a tab switch), its fake parent has no real DOM — forwarding to _origSetActiveLeaf
                // would crash on addClass/removeClass. Absorb silently instead.
                if (targetLeaf && this._isOrphanedVaporLeaf(targetLeaf)) return;
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = this._isVaporFocused();

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
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
                        if (this._isMigrating) return;
                        if (!this.floatingLeaves || !this.floatingLeaves.includes(leaf)) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporPhysicallyFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporPhysicallyFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            ws.setActiveLeaf = realSetActiveLeaf;
            setTimeout(() => {
                this._isCreatingTab = false;
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
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
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip (fix 4: webview tab click doesn't set focus) and
        // programmatic switches. Must be set before any async work below.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately (single-click activation,
                // fix 3). This prevents the "two clicks needed" problem where the first
                // click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            let pathOrUrl = null;
            if (type === 'markdown' && leafToClose.view?.file) {
                pathOrUrl = leafToClose.view.file.path;
            } else if (type === 'webviewer') {
                pathOrUrl = viewState?.state?.url;
            }

            if (!this._closedTabsHistory) this._closedTabsHistory = [];
            this._closedTabsHistory.push({ type, pathOrUrl });
            if (this._closedTabsHistory.length > 30) this._closedTabsHistory.shift(); 
        }

        this._allowDetach = true;
        try { leafToClose.detach(); } catch (_) {}
        this._allowDetach = false;

        if (leafToClose.containerEl && leafToClose.containerEl.parentElement) {
            leafToClose.containerEl.remove();
        }

        this.floatingLeaves.splice(index, 1);

        if (this.floatingLeaves.length === 0) {
            this._addNewTab('empty');
            setTimeout(() => { this._isClosingTab = false; }, 200);
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
        setTimeout(() => {
            this._isClosingTab = false;
        }, 200);
    }

    async reopenClosedTab() {
        if (this._isReopeningTab) return;
        if (!this._isOpen() || !this._closedTabsHistory || this._closedTabsHistory.length === 0) return;

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
            const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
            const soloEmpty = this.floatingLeaves.length === 1 &&
                activeLeaf && (activeLeaf.getViewState?.()?.type ?? 'empty') === 'empty';

            if (soloEmpty && activeLeaf) {
                try {
                    if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                        let file = this.app.vault.getAbstractFileByPath(lastTab.pathOrUrl);
                        if (file) {
                            await activeLeaf.openFile(file);
                            const state = activeLeaf.getViewState();
                            state.state.mode = 'source'; state.state.source = false;
                            await activeLeaf.setViewState(state);
                        }
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) { /* fall through to normal add */ }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            webview.addEventListener('dom-ready', injectScript);

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        Object.assign(el.style, {
            position:      'fixed',
            top:           this._savedTop || '100px',
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
            width:         this._savedWidth || '380px',
            height:        this._savedHeight || '500px',
            zIndex:        '35', 
            background:    `color-mix(in srgb, var(--background-primary) ${pct}%, transparent)`,
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
            transition:    'background-color 0.15s ease-in-out',
        });
    }

    _buildChrome(container) {
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: color-mix(in srgb, var(--background-secondary) ${pct}%, transparent);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            const currentPct = Math.round(parseFloat(this.opacityValue) * 100);
            container.style.background = `color-mix(in srgb, var(--background-primary) ${currentPct}%, transparent)`;
            if (this.dragBar) {
                this.dragBar.style.background = `color-mix(in srgb, var(--background-secondary) ${currentPct}%, transparent)`;
            }
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // Blur VaporNote without routing focus to any specific leaf.
            // setActiveLeaf({ focus: true }) triggers Obsidian's window-switching
            // logic which moves you to the Space that leaf lives in — not desired.
            try {
                const doc = this._targetWin?.document || document;
                if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                    doc.activeElement.blur();
                }
            } catch (_) {}
        } else {
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```
## V28 (Stable)
- Added a "Move position of note to center of window". Se
```javascript
const { Plugin, Modal, Setting, Notice, FuzzySuggestModal, WorkspaceLeaf } = require('obsidian');

// ─── File Search / Query Modal (Fallback) ──────────────────────────────────
class FileSuggestModal extends FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }

    getItems() { return this.app.vault.getFiles(); }
    getItemText(file) { return file.path; }
    onChooseItem(file, evt) { this.onSelect(file); }
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
        this.floatingLeaves       = [];     
        this.activeLeafIndex      = 0;      
        this.floatingContainer  = null;
        this.savedFilePath      = null;     
        this._prevActiveLeaf    = null;     
        this._origSetActiveLeaf = null;     
        this._origGetLeaf       = null;     
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
        this._focusListeners    = [];       
        this._resizeHandles     = [];       
        this._closedTabsHistory = [];       
        this.opacityValue       = '0.95';   
        this._lastCloseTime     = 0;        
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

        this._dragMode          = null;     
        this._activeHandleDir   = null;     
        this._origModalOpen     = null;     

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
            id: 'reset-position-vapornote',
            name: 'Reset VaporNote Position',
            callback: () => this.resetPosition()
        });

        this._setupWindowFocusListeners();

        // Intercept global Modal.open transitions to force modal targeting alignment
        const self = this;
        this._origModalOpen = Modal.prototype.open;
        Modal.prototype.open = function(...args) {
            if (self._isOpen() && self._isVaporFocused() && self._targetWin) {
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
                // During closing/switching, ignore completely to avoid thrash
                if (this._isClosingTab || this._isSwitchingTab) return;

                if (leaf && this.floatingLeaves && this.floatingLeaves.includes(leaf)) {
                    const idx = this.floatingLeaves.indexOf(leaf);
                    if (idx !== -1 && idx !== this.activeLeafIndex) {
                        this.activeLeafIndex = idx; // sync index without full _switchTab during creation
                        if (!this._isCreatingTab) this._switchTab(idx);
                    }
                    this._renderTabs();
                } else if (leaf && !this._isCreatingTab) {
                    this._prevActiveLeaf = leaf;
                    this._isVaporActive = false; 
                }
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

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
    }

    // ─── ELECTRON WINDOW FOCUS SUPPRESSION ───────────────────────────────────
    _makeLeafWindowNeutral(leaf) {
        // 1. Give the leaf a fake parent whose getContainer() returns a stub
        //    that dynamically maps to our current target window.
        const self = this;
        const noopContainer = {
            requestFocus: () => {},
            focus:        () => {},
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl:  leaf.containerEl,
        };

        const fakeRoot = {
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            containerEl: leaf.containerEl,
            getRoot: () => fakeRoot,
            isAttached: () => true,
            type: 'root',
        };

        const fakeParent = {
            get win() { return self._targetWin; },
            get doc() { return self._targetWin?.document; },
            getContainer: () => noopContainer,
            children:     [leaf],
            type:         'split',
            // Excalidraw (and other plugins) call leaf.getRoot() which walks up
            // through parent.getRoot(). Without this, it throws "getRoot is not a
            // function", which crashes Obsidian's layout update and resets focus —
            // causing the double-click bug on webview tab switches and close buttons.
            getRoot: () => fakeRoot,
            isAttached: () => true,
        };

        // Only set if the leaf has no real parent yet (it's a fresh floating leaf)
        if (!leaf.parent) {
            leaf.parent = fakeParent;
        }

        // 2. Patch openFile so we can suppress focus DURING the await, releasing early via timeout
        const origOpenFile = leaf.openFile?.bind(leaf);
        if (origOpenFile) {
            leaf.openFile = async (file, state) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origOpenFile(file, state);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }

        // 3. Patch setViewState similarly
        const origSetViewState = leaf.setViewState?.bind(leaf);
        if (origSetViewState) {
            leaf.setViewState = async (...args) => {
                const restore = this._suppressWinFocusViaDOM();
                const timeoutId = setTimeout(restore, 200); // Prevent long lockups during slow loads
                try {
                    return await origSetViewState(...args);
                } finally {
                    clearTimeout(timeoutId);
                    restore();
                }
            };
        }
    }

    // Temporarily redirect window.focus() and BrowserWindow.focus() calls so
    // that any internal Obsidian code that tries to focus a window during
    // openFile/setViewState is silently dropped.
    _suppressWinFocusViaDOM() {
        const targetWin = this._targetWin;
        const patched = [];

        // Collect all windows Obsidian knows about
        const wins = new Set([window]);
        try {
            const floatingSplit = this.app.workspace.floatingSplit;
            if (floatingSplit?.children) {
                floatingSplit.children.forEach(c => { if (c.win) wins.add(c.win); });
            }
        } catch (_) {}

        wins.forEach(win => {
            if (win === targetWin) return; // don't suppress the window we WANT
            try {
                const orig = win.focus.bind(win);
                win.focus = () => {}; // swallow focus calls
                patched.push({ win, orig });
            } catch (_) {}
        });

        // Also suppress via Electron if available
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
        if (!this._isOpen() || !this.floatingLeaves) return;
        const leaf = this.floatingLeaves[this.activeLeafIndex];
        if (!leaf) return;

        // Synchronously set active state once
        if (this.app.workspace.activeLeaf !== leaf) {
            try {
                if (this._origSetActiveLeaf) {
                    this._origSetActiveLeaf(leaf, { focus: false });
                } else {
                    this.app.workspace.setActiveLeaf(leaf, { focus: false });
                }
            } catch (e) {}
        }

        // Single DOM focus — no retries; retries cause focusin to re-fire
        // which fights with click handling and requires multiple clicks to settle.
        if (!leaf.containerEl) return;
        if (leaf.view && leaf.view.editor && typeof leaf.view.editor.focus === 'function') {
            leaf.view.editor.focus();
        } else {
            const content = leaf.containerEl.querySelector('.cm-content, webview, .markdown-source-view');
            if (content) content.focus();
            else leaf.containerEl.focus();
        }
    }

    _setupWindowFocusListeners() {
        // Intentionally empty — all ambient focus/mousedown listeners removed.
        //
        // History: browser-window-focus and per-window mousedown both cause a
        // snap-back loop on macOS. Commands.js fires OBS_ACTIVATE (via console.log)
        // on every webview mousedown, which calls win.focus() + setActiveLeaf on
        // the source window, re-triggering focus on window 1 mid-interaction.
        // Ambient browser-window-focus from Electron fires after mouseup when the
        // cursor is over window 1, undoing any mid-drag migration.
        //
        // Migration now happens ONLY via the toggle shortcut (toggleVaporNote),
        // which uses _getElectronFocusedRendererWin() — ground truth from Electron —
        // to target whichever window the user is actually in.
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

    _isVaporFocused() {
        if (!this.floatingContainer) return false;

        const doc = this._targetWin?.document || activeDocument;
        const activeEl = doc.activeElement;

        if (!activeEl) return false;

        // Bail out if focus is inside a modal (e.g. Settings, command palette)
        if (activeEl.closest && activeEl.closest('.modal-container')) {
            return false;
        }

        // Physical containment check. Also catches webview tabs: when a webview
        // has focus, activeElement in the parent doc is the webview element itself.
        const isPhysicallyInVapor = this.floatingContainer.contains(activeEl) ||
            (this.floatingLeaves?.some(leaf => leaf.containerEl?.contains(activeEl)) ?? false);

        if (isPhysicallyInVapor) {
            this._isVaporActive = true;
            return true;
        }

        // If the user is actively focused on a specific background element (like a background webview)
        // that is not physically inside VaporNote, we are definitely no longer focused on VaporNote.
        const isSpecificBackgroundFocus = activeEl && 
            activeEl !== doc.body && 
            activeEl !== doc.documentElement;
            
        if (isSpecificBackgroundFocus) {
            this._isVaporActive = false;
            return false;
        }

        // Fallback: keep returning true if VaporNote was last interacted with.
        return this._isVaporActive;
    }

    // Returns the renderer `window` for whichever BrowserWindow Electron considers focused.
    // This is the ground truth — unlike Obsidian's `activeWindow`, it does not lag after
    // a macOS Space switch or a shortcut fired before Obsidian's own routing updates.
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
        // Fallback: trust Obsidian's activeWindow
        return activeWindow;
    }

    async toggleVaporNote() {
        if (this._isOpening) return;
        // Use Electron's focused window, not Obsidian's activeWindow, so that invoking
        // the shortcut from window 2 correctly targets window 2 even before Obsidian's
        // internal routing has caught up with the macOS Space switch.
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

        // If minimized, restore first so the full container dimensions are live
        if (this._isMinimized) this.toggleMinimize();

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
            // If _targetWin is pre-set (e.g. by _moveContainerToWindow migration), use it.
            // Otherwise derive from Electron's focused window.
            if (!this._targetWin) {
                this._targetWin = this._getElectronFocusedRendererWin();
            }
            const doc = this._targetWin.document;

            // Suppress non-target window focus calls for the entire open sequence
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
                    // Manually update activeLeaf and trigger change without letting Obsidian's core
                    // layout manager pull the leaf back to Window 1's splits
                    try { 
                        Object.defineProperty(ws, 'activeLeaf', { value: targetLeaf, writable: true, configurable: true }); 
                    } catch (e) { 
                        ws.activeLeaf = targetLeaf; 
                    }
                    ws.trigger('active-leaf-change', targetLeaf);

                    const params = args[0];
                    if (params && params.focus) {
                        this._forceFocusActiveLeaf();
                    }
                    return;
                }
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            if (this._origGetLeaf) {
                ws.getLeaf = this._origGetLeaf;
                this._origGetLeaf = null;
            }
            this._origGetLeaf = ws.getLeaf.bind(ws);
            ws.getLeaf = (newSplit, ...args) => {
                const isVaporFocused = this._isVaporFocused();

                if (this._isOpen() && isVaporFocused && activeWindow === this._targetWin && (newSplit === 'tab' || newSplit === true)) {
                    this._isCreatingTab = true;
                    const _restoreWinFocus = this._suppressWinFocusViaDOM();
                    const leaf = new WorkspaceLeaf(this.app);
                    this._makeLeafWindowNeutral(leaf);

                    const origDetach = leaf.detach.bind(leaf);
                    leaf.detach = () => {
                        if (this._allowDetach) {
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
                        if (this._isMigrating) return;
                        try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
                    });

                    this.tabContentContainer.appendChild(leaf.containerEl);
                    Object.assign(leaf.containerEl.style, {
                        flex: '1', minHeight: '0', height: '100%',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    });

                    this.floatingLeaves.push(leaf);
                    this.activeLeafIndex = this.floatingLeaves.length - 1;

                    this._switchTab(this.activeLeafIndex);

                    // The caller (e.g. SmartWebSearch) will call leaf.setViewState()
                    // after we return. Wrap it so we re-assert this leaf as active
                    // once that settles — otherwise activeLeaf drifts back to Window 1.
                    const origSVS = leaf.setViewState.bind(leaf);
                    leaf.setViewState = async (...svArgs) => {
                        const result = await origSVS(...svArgs);
                        // Restore our own setViewState wrapper (from _makeLeafWindowNeutral)
                        // has already run; now re-assert VaporNote focus
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
                return this._origGetLeaf(newSplit, ...args);
            };

            this._globalClickHandler = (e) => {
                if (!this.floatingContainer || !this.floatingContainer.contains(e.target)) return;
                const anchor = e.target.closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;

                if (href.startsWith('http://') || href.startsWith('https://')) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
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
                }
            };
            this._targetWin.addEventListener('click', this._globalClickHandler, true);

            this._globalMousedownHandler = (e) => {
                if ((this.floatingContainer && this.floatingContainer.contains(e.target)) || 
                    e.target.closest('.modal-container')) {
                    // Click is inside VaporNote or a modal — mark as active
                    this._isVaporActive = true;
                    // Do NOT call setActiveLeaf here when clicking the tab bar — that would
                    // trigger a workspace event on the currently-active (outgoing) webview leaf,
                    // which steals activeElement back and forces a second click to activate the
                    // new tab. _switchTab handles setActiveLeaf itself for tab chip clicks.
                    const isTabBarClick = this.tabBar && this.tabBar.contains(e.target);
                    if (!isTabBarClick) {
                        const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                        if (activeLeaf && ws.activeLeaf !== activeLeaf) {
                            try { ws.setActiveLeaf(activeLeaf, { focus: false }); } catch (err) {}
                        }
                    }
                } else {
                    // Click is outside VaporNote. Only clear _isVaporActive if the
                    // click target is a real background workspace element — NOT body/html
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

                // Intercept Cmd+W / Ctrl+W to close VaporNote tab instead of closing windows/popouts
                if (isCmdOrCtrl && key === 'w') {
                    if (this._isOpen() && this._isVaporFocused()) {
                        e.preventDefault();
                        e.stopPropagation();
                        this._closeTab(this.activeLeafIndex);
                        // Keep _isVaporActive true even if all tabs are gone.
                        // As long as VaporNote is open, Cmd+W must never leak to the
                        // background window — even when the auto-replenished empty tab
                        // is the only one left.
                        this._isVaporActive = true;
                        return;
                    }
                }

                if (isCmdOrCtrl && isShift && key === 't' && this._isOpen() && this._isVaporFocused()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.reopenClosedTab();
                    return;
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
                if (this._isMigrating) return;

                // Mark VaporNote as active whenever focus goes inside its container
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
                    } else if (tab.type === 'webviewer' && tab.pathOrUrl) {
                        await this._addNewTab('web', tab.pathOrUrl);
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

    async _addNewTab(type = 'empty', pathOrUrl = null) {
        this._isCreatingTab = true;
        const ws = this.app.workspace;
        const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = new WorkspaceLeaf(this.app);

            // Neutralize any internal window-focus calls that openFile/setViewState
            // would otherwise make against Window 1 (the macOS Space-switch trigger)
            this._makeLeafWindowNeutral(leaf);

            const origDetach = leaf.detach.bind(leaf);
            leaf.detach = () => {
                if (this._allowDetach) {
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

            this.floatingLeaves.push(leaf);
            this.activeLeafIndex = this.floatingLeaves.length - 1;

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
                await leaf.setViewState({
                    type: 'webviewer', state: { url: pathOrUrl, navigate: true }, active: true
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
            ws.setActiveLeaf = realSetActiveLeaf;
            setTimeout(() => {
                this._isCreatingTab = false;
            }, 300);
        }

        if (leaf.view) leaf.view.onHide = () => {};

        leaf.containerEl.addEventListener('focusin', () => {
            if (this._isMigrating) return;
            try { ws.setActiveLeaf(leaf, { focus: false }); } catch (e) {}
        });

        this._switchTab(this.activeLeafIndex);
        setTimeout(() => this._hookWebviews(), 0);
    }

    _switchTab(index) {
        if (this._isSwitchingTab) return;
        if (!this.floatingLeaves || index < 0 || index >= this.floatingLeaves.length) return;
        
        this._isSwitchingTab = true;
        // Always claim VaporNote focus when switching tabs — this covers both
        // clicking a tab chip (fix 4: webview tab click doesn't set focus) and
        // programmatic switches. Must be set before any async work below.
        this._isVaporActive = true;
        try {
            this.activeLeafIndex = index;

            // Phase 1: Hide all non-active tabs first to clean up browser focus
            this.floatingLeaves.forEach((leaf, idx) => {
                if (idx !== index) {
                    leaf.containerEl.style.display = 'none';
                }
            });

            // Phase 2: Show the active tab and defer focusing to absorb asynchronous blurs
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

                // For webview tabs: focus the webview immediately (single-click activation,
                // fix 3). This prevents the "two clicks needed" problem where the first
                // click switches the tab but focus stays on the tab chip.
                const webview = activeLeaf.containerEl?.querySelector('webview');
                if (webview) {
                    try { webview.focus(); } catch (_) {}
                }

                // Defer DOM focus by 50ms so the browser fully processes the hidden tab's blur
                setTimeout(() => {
                    this._forceFocusActiveLeaf();
                    try { activeLeaf.view?.onShow?.(); } catch (_) {}
                    try { activeLeaf.view?.editor?.refresh(); } catch (_) {}
                    // Re-assert after async settle — webview focus can be stolen
                    // by Obsidian's workspace events during the 50ms window.
                    this._isVaporActive = true;
                }, 50);
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

        this._isClosingTab = true; // Block intermediate cleanup events during teardown

        const leafToClose = this.floatingLeaves[index];

        if (!skipHistory) {
            let viewState = null;
            try { viewState = leafToClose.getViewState(); } catch(e){}
            const type = viewState?.type || 'empty';
            let pathOrUrl = null;
            if (type === 'markdown' && leafToClose.view?.file) {
                pathOrUrl = leafToClose.view.file.path;
            } else if (type === 'webviewer') {
                pathOrUrl = viewState?.state?.url;
            }

            if (!this._closedTabsHistory) this._closedTabsHistory = [];
            this._closedTabsHistory.push({ type, pathOrUrl });
            if (this._closedTabsHistory.length > 30) this._closedTabsHistory.shift(); 
        }

        this._allowDetach = true;
        try { leafToClose.detach(); } catch (_) {}
        this._allowDetach = false;

        if (leafToClose.containerEl && leafToClose.containerEl.parentElement) {
            leafToClose.containerEl.remove();
        }

        this.floatingLeaves.splice(index, 1);

        if (this.floatingLeaves.length === 0) {
            this._addNewTab('empty');
            setTimeout(() => { this._isClosingTab = false; }, 200);
            return;
        }

        // Pick the next active index, preferring the tab to the right of the closed one,
        // then left, then first available — but always skip empty placeholder leaves.
        const nonEmpty = this.floatingLeaves
            .map((leaf, i) => ({ leaf, i }))
            .filter(({ leaf }) => (leaf.getViewState?.()?.type ?? 'empty') !== 'empty');

        if (nonEmpty.length > 0) {
            // Prefer the closest visible tab at or after the closed index
            const after = nonEmpty.find(({ i }) => i >= index);
            this.activeLeafIndex = after ? after.i : nonEmpty[nonEmpty.length - 1].i;
        } else {
            // Only the empty placeholder remains
            this.activeLeafIndex = 0;
        }

        this._switchTab(this.activeLeafIndex);

        // Absorb asynchronous focus changes from closed webviews
        setTimeout(() => {
            this._isClosingTab = false;
        }, 200);
    }

    async reopenClosedTab() {
        if (this._isReopeningTab) return;
        if (!this._isOpen() || !this._closedTabsHistory || this._closedTabsHistory.length === 0) return;

        this._isReopeningTab = true;
        try {
            const lastTab = this._closedTabsHistory.pop();
            if (!lastTab) return;

            // If the only open tab is empty, load the restored content directly into it
            // rather than closing it (which would trigger _closeTab's auto-replenish and
            // create a phantom empty tab alongside the restored one).
            const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
            const soloEmpty = this.floatingLeaves.length === 1 &&
                activeLeaf && (activeLeaf.getViewState?.()?.type ?? 'empty') === 'empty';

            if (soloEmpty && activeLeaf) {
                try {
                    if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                        let file = this.app.vault.getAbstractFileByPath(lastTab.pathOrUrl);
                        if (file) {
                            await activeLeaf.openFile(file);
                            const state = activeLeaf.getViewState();
                            state.state.mode = 'source'; state.state.source = false;
                            await activeLeaf.setViewState(state);
                        }
                    } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                        await activeLeaf.setViewState({
                            type: 'webviewer', state: { url: lastTab.pathOrUrl, navigate: true }, active: true
                        });
                    }
                    this._switchTab(this.activeLeafIndex);
                    setTimeout(() => this._hookWebviews(), 0);
                    return;
                } catch (_) { /* fall through to normal add */ }
            }

            if (lastTab.type === 'markdown' && lastTab.pathOrUrl) {
                await this._addNewTab('file', lastTab.pathOrUrl);
            } else if (lastTab.type === 'webviewer' && lastTab.pathOrUrl) {
                await this._addNewTab('web', lastTab.pathOrUrl);
            } else {
                await this._addNewTab('empty');
            }
        } finally {
            this._isReopeningTab = false;
        }
    }

    navigateTab(direction) {
        if (!this._isOpen() || !this.floatingLeaves || this.floatingLeaves.length <= 1) return;
        // Build an index list of non-empty leaves (matches what _renderTabs renders).
        // Without this, wrapping would land on the invisible empty placeholder leaf.
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

            // 1. Electron Native Input Hook
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
                                    const isCmdOrCtrl = input.control || input.meta;
                                    const isShift = input.shift;
                                    const isAlt = input.alt;
                                    const key = input.key.toLowerCase();

                                    if (input.type === 'keyDown') {
                                        if (isCmdOrCtrl && key === 'w') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => { this._isVaporActive = true; this._closeTab(this.activeLeafIndex); }, 0);
                                        } else if (isCmdOrCtrl && isShift && key === 't') {
                                            event.preventDefault();
                                            this._isVaporActive = true;
                                            setTimeout(() => this.reopenClosedTab(), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowright' || key === 'right')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(1), 0);
                                        } else if (isCmdOrCtrl && isAlt && (key === 'arrowleft' || key === 'left')) {
                                            event.preventDefault();
                                            setTimeout(() => this.navigateTab(-1), 0);
                                        } else if (isCmdOrCtrl) {
                                            // Any other Cmd+key from within a VaporNote webview:
                                            // focus _targetWin so modals (command palette etc.)
                                            // open in the correct window, not window 1.
                                            try {
                                                if (this._targetWin && this._targetWin !== activeWindow) {
                                                    this._targetWin.focus();
                                                    const activeLeaf = this.floatingLeaves[this.activeLeafIndex];
                                                    if (activeLeaf) this.app.workspace.setActiveLeaf(activeLeaf, { focus: false });
                                                }
                                            } catch (_) {}
                                        }
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
            
            // Defensively poll to make absolutely sure Electron connects quickly
            let attempts = 0;
            const poll = setInterval(() => {
                attempts++;
                if (webview._electronHooked || attempts > 15) {
                    clearInterval(poll);
                } else {
                    tryHookElectron();
                }
            }, 100);

            // 2. Fallback JS Injection
            const injectScript = () => {
                if (webview._electronHooked) return; 

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
            webview.addEventListener('dom-ready', injectScript);

            // Respond to fallback messages
            webview.addEventListener('console-message', (e) => {
                if (webview._electronHooked) return; 

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
            // Never render a tab chip for empty placeholder leaves.
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

            // Save current state before closing
            const tabsState = this.floatingLeaves.map(leaf => {
                let viewState = null;
                try { viewState = leaf.getViewState(); } catch(_) {}
                const type = viewState?.type || 'empty';
                let pathOrUrl = null;
                if (type === 'markdown' && leaf.view?.file) pathOrUrl = leaf.view.file.path;
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
                return { type, pathOrUrl };
            });
            const activeIdx = this.activeLeafIndex;
            const savedW = this.floatingContainer.style.width || this._savedWidth;
            const savedH = this.floatingContainer.style.height || this._savedHeight;
            const savedL = this.floatingContainer.style.left || this._savedLeft;
            const savedT = this.floatingContainer.style.top || this._savedTop;

            // Close on old window (suppress the notice)
            this._isMigrating = true;
            const savedTabsState = this._savedTabsState;
            const savedActiveLeafIndex = this._savedActiveLeafIndex;

            this.closeVaporNote();

            // Restore saved state for reopen on new window
            this._savedTabsState = tabsState.filter(t => t.type !== 'empty' || tabsState.length === 1);
            this._savedActiveLeafIndex = activeIdx;
            this._savedWidth = savedW;
            this._savedHeight = savedH;
            this._savedLeft = savedL;
            this._savedTop = savedT;
            this._targetWin = newWin; // hint to _openVaporNote which window to use

            await this._openVaporNote(null);
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
        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        Object.assign(el.style, {
            position:      'fixed',
            top:           this._savedTop || '100px',
            left:          this._savedLeft || 'auto',
            right:         this._savedLeft ? 'auto' : '50px',
            width:         this._savedWidth || '380px',
            height:        this._savedHeight || '500px',
            zIndex:        '35', 
            background:    `color-mix(in srgb, var(--background-primary) ${pct}%, transparent)`,
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
            transition:    'background-color 0.15s ease-in-out',
        });
    }

    _buildChrome(container) {
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const pct = Math.round(parseFloat(this.opacityValue) * 100);
        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: color-mix(in srgb, var(--background-secondary) ${pct}%, transparent);
            padding: 8px 12px; cursor: move; font-size: 11px; font-weight: bold;
            color: var(--text-muted); border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; height: 36px; box-sizing: border-box;
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
            const currentPct = Math.round(parseFloat(this.opacityValue) * 100);
            container.style.background = `color-mix(in srgb, var(--background-primary) ${currentPct}%, transparent)`;
            if (this.dragBar) {
                this.dragBar.style.background = `color-mix(in srgb, var(--background-secondary) ${currentPct}%, transparent)`;
            }
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
            // Always pin to this._targetWin.document — the document the container actually
            // lives in right now. getActiveDoc() / activeDocument can drift to window 1 when
            // a webview in window 2 has focus, which would land the overlay in the wrong
            // document and leave the webview stealing mousemove/mouseup events unblocked.
            const pinnedDoc = this._targetWin ? this._targetWin.document : getActiveDoc();
            const ov = pinnedDoc.createElement('div');
            ov.style.cssText = `position: fixed; inset: 0; z-index: 999999; background: transparent; cursor: ${cursor};`;
            pinnedDoc.body.appendChild(ov);
            this._dragOverlay = ov;
            pinnedDoc.querySelectorAll('webview').forEach(wv => wv.style.pointerEvents = 'none');
        };
        const removeOverlay = () => {
            if (this._dragOverlay) {
                // Track the overlay's own document rather than re-evaluating activeDocument,
                // which may have drifted by the time mouseup fires.
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
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (this._activeHandleDir) {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;

                if (this._activeHandleDir.includes('e')) newW = Math.max(250, startW + dx);
                else if (this._activeHandleDir.includes('w')) {
                    newW = Math.max(250, startW - dx);
                    if (newW > 250) newLeft = startLeft + dx;
                }
                if (this._activeHandleDir.includes('s')) newH = Math.max(200, startH + dy);
                else if (this._activeHandleDir.includes('n')) {
                    newH = Math.max(200, startH - dy);
                    if (newH > 200) newTop = startTop + dy;
                }

                container.style.width = newW + 'px'; container.style.height = newH + 'px';
                container.style.left = newLeft + 'px'; container.style.top = newTop + 'px';
                container.style.right = 'auto';
            }
        };

        const onMouseUp = () => {
            this._dragMode = null;
            this._activeHandleDir = null;
            removeOverlay();
        };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn || e.target === minimizeBtn || e.target === opacitySlider || e.target.closest('button') || e.target.closest('.hide-scrollbar') || e.target.closest('div[style*="cursor: pointer"]')) return;
            this._dragMode = 'drag'; startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top;
            e.preventDefault(); showOverlay('move');
        });

        // Do NOT register mousemove/mouseup directly on win.document here.
        // win is captured at _buildChrome time (always window 1). After the container
        // migrates to window 2, _moveContainerToWindow rebinds _globalMoveHandler and
        // _globalUpHandler to window 2's document — but the stale win.document listeners
        // would remain registered, causing mouseup on window 1 to fire onMouseUp and
        // clear _dragMode/_dragOverlay, which unblocks _moveContainerToWindow and snaps
        // the container back to window 1. We register them lazily via _globalMoveHandler
        // and _globalUpHandler, which _moveContainerToWindow manages correctly.
        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;

        // Initial registration on the current target window (may be window 1 or 2).
        // This is the ONLY place we register these — _moveContainerToWindow re-registers
        // them on the new window when the container migrates.
        if (this._targetWin) {
            this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
            this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
        }
    }

    toggleMinimize() {
        if (!this.floatingContainer) return;
        this._isMinimized = !this._isMinimized;

        if (this._isMinimized) {
            this._saveViewStateData();

            const r = this.floatingContainer.getBoundingClientRect();
            this._savedWidth = r.width + 'px';
            this._savedHeight = r.height + 'px';

            const currentLeft = parseFloat(this.floatingContainer.style.left) || r.left;
            this._savedLeftVal = currentLeft + 'px'; 

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

            // Blur VaporNote without routing focus to any specific leaf.
            // setActiveLeaf({ focus: true }) triggers Obsidian's window-switching
            // logic which moves you to the Space that leaf lives in — not desired.
            try {
                const doc = this._targetWin?.document || document;
                if (doc.activeElement && typeof doc.activeElement.blur === 'function') {
                    doc.activeElement.blur();
                }
            } catch (_) {}
        } else {
            this.floatingContainer.style.width = this._savedWidth || '380px';
            this.floatingContainer.style.height = this._savedHeight || '500px';
            this.floatingContainer.style.minWidth = '250px';
            this.floatingContainer.style.minHeight = '200px';

            // The minimized icon sits at (originalRight - 40px).
            // To restore so the right edge of the full container lands where the icon was,
            // we compute: restoredLeft = iconLeft - (restoredWidth - 40).
            const iconLeft = parseFloat(this.floatingContainer.style.left) || 0;
            const restoredW = parseFloat(this._savedWidth) || 380;
            const restoredLeft = iconLeft - (restoredW - 40);
            this.floatingContainer.style.left = restoredLeft + 'px';

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

            if (this._resizeHandles) this._resizeHandles.forEach(h => h.style.display = 'block');

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

            setTimeout(() => {
                this._restoreViewStateData();
                this._forceFocusActiveLeaf();
            }, 150);
        }
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
            if (!this._isMinimized) {
                const r = this.floatingContainer.getBoundingClientRect();
                this._savedWidth = r.width + 'px'; this._savedHeight = r.height + 'px';
                this._savedLeft = this.floatingContainer.style.left || (r.left + 'px');
                this._savedTop = this.floatingContainer.style.top || (r.top + 'px');
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
                else if (type === 'webviewer') pathOrUrl = viewState?.state?.url;
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

        if (this._prevActiveLeaf) {
            try { this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false }); } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;
        this._isMinimized = false;
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
```