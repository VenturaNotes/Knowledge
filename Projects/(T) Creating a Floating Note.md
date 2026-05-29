---
status: open
priority: "0"
dateCreated: 2026-05-27T02:40:46.366-04:00
dateModified: 2026-05-27T02:40:46.366-04:00
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
## ToDo
### Essential
- [ ] Make the floating note transparent (so you can see through it). You have an optional slider and you can toggle this feature on or off
- [ ] I'm not sure if I want multiple screens (but I'm unsure what to do with the excalidraw plugin creating a new document. It would be fine if it's the current document (but then I lose my place in the view as well. Maybe there is a way to jump back to that view? I honestly might need to make a multi-document tab system))
	- Need to modify the script so that I can access different tabs within the floating note?
- [ ] Create a command within the plugin that minimizes to a small box and then expands back to the previous size it was at? Then we wouldn't need to load it every time, but we would also know that the floating note was still active.
- [ ] Modify script so that the last note that was open in the script stays open. 
### For later
- [ ] Make "Command + O" behave a little differently or neater
	- At least make it appear in front of the floating note
## V11 (Probably Stable)
- Not completely. I am unable to traverse the different tabs quickly within the second window. 
	- Actually this seems to be caused by something else. Not sure what but it works better now? Was able to get rid of the tab right and left stuff
```javascript
const { Plugin, Modal, Setting, Notice } = require('obsidian');

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
            .setDesc("Path relative to vault root (e.g. VaporNote.md or Notes/VaporNote.md)")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { this.onSubmit(this.value); this.close(); }
                });
            });
        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Confirm").setCta().onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                });
            });
    }

    onClose() { this.contentEl.empty(); }
}


class VaporNotePlugin extends Plugin {
    async onload() {
        this.floatingLeaf       = null;
        this.floatingContainer  = null;
        this.savedFilePath      = null;   // null until user picks a file once
        this._prevActiveLeaf    = null;   // background leaf active before we opened
        this._origSetActiveLeaf = null;   // real setActiveLeaf, intercepted for float lifetime
        this._targetWin         = null;   // window context where the float is currently attached
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._focusoutHandler   = null;   // Tracks blur events to safely revert activeLeaf
        this._dragOverlay       = null;
        this._allowDetach       = false;
        this._isMigrating       = false;  // Flag to suppress focus changes during window-swapping
        this._isOpening         = false;  // Lock to completely prevent rapid toggling race conditions
        this._focusListeners    = [];     // Cache registry of native focus hooks for cleanup

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        // Initialize focus listeners for currently open windows
        this._setupWindowFocusListeners();

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this._setupWindowFocusListeners();
                this._assertDOMPosition();
            })
        );

        this.registerEvent(
            this.app.workspace.on('window-open', () => {
                this._setupWindowFocusListeners();
                this._assertDOMPosition();
            })
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // If a background leaf is activated while VaporNote is open, track it as our reference
                if (leaf && leaf !== this.floatingLeaf) {
                    this._prevActiveLeaf = leaf;

                    // Backup automatic follow logic if tab active shifts
                    const leafWin = leaf.containerEl?.ownerDocument?.defaultView;
                    if (leafWin && this._targetWin && leafWin !== this._targetWin) {
                        this._moveContainerToWindow(leafWin);
                    }
                }

                if (!this.floatingLeaf?.view) return;
                try { this.floatingLeaf.view.onShow?.(); }        catch (_) {}
                try { this.floatingLeaf.view.editor?.refresh(); } catch (_) {}
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

        // Safely unbind focus hooks on all open/surviving windows during plugin disable
        if (this._focusListeners) {
            this._focusListeners.forEach(({ win, bwin, listener }) => {
                try {
                    if (bwin && listener) {
                        bwin.off('focus', listener);
                    } else if (win && listener) {
                        win.removeEventListener('focus', listener);
                    }
                    delete win._vaporFocusHooked;
                } catch (_) {}
            });
            this._focusListeners = [];
        }
    }

    // ─── Native Window Focus Tracker ──────────────────────────────────────────

    _setupWindowFocusListeners() {
        // Sweep out dead references from closed window frames
        if (this._focusListeners) {
            this._focusListeners = this._focusListeners.filter(({ win, bwin, listener }) => {
                if (win.closed) {
                    try {
                        if (bwin && listener) bwin.off('focus', listener);
                    } catch (_) {}
                    return false;
                }
                return true;
            });
        } else {
            this._focusListeners = [];
        }

        // Collect all currently open active window DOM frames (main + popouts)
        const windows = new Set([window]);
        const floatingSplit = this.app.workspace.floatingSplit;
        if (floatingSplit && floatingSplit.children) {
            floatingSplit.children.forEach(child => {
                if (child.win) {
                    windows.add(child.win);
                }
            });
        }

        // Bind focus-detection triggers to all target windows
        windows.forEach(win => {
            if (win._vaporFocusHooked) return;
            win._vaporFocusHooked = true;

            const onWindowFocus = () => {
                // Instantly follow focus to the newly activated full-screen window on space swipe
                if (this._isOpen() && this._targetWin !== win) {
                    this._moveContainerToWindow(win);
                }
            };

            let bwin = null;
            try {
                // Get the remote Electron BrowserWindow representing this DOM window context
                const remote = win.require?.('@electron/remote') || require('@electron/remote');
                bwin = remote.getCurrentWindow();
            } catch (e) {
                // Electron context lookup omitted if not running in desktop node frame
            }

            if (bwin) {
                // Bind to Electron-level BrowserWindow focus event (100% bulletproof even with focused guest webviews)
                bwin.on('focus', onWindowFocus);
                this._focusListeners.push({ win, bwin, listener: onWindowFocus });
            } else {
                // Safe DOM-level focus event fallback
                win.addEventListener('focus', onWindowFocus);
                this._focusListeners.push({ win, bwin: null, listener: onWindowFocus });
            }
        });
    }

    // ─── Open-state guard ─────────────────────────────────────────────────────

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.ownerDocument || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    // ─── Toggle ───────────────────────────────────────────────────────────────

    async toggleVaporNote() {
        if (this._isOpening) return; // Prevent rapid-fire opening race conditions
        
        if (this._isOpen()) {
            this.closeVaporNote();
            return;
        }
        if (this.savedFilePath) {
            await this._openVaporNote(this.savedFilePath);
            return;
        }
        new FilePromptModal(
            this.app,
            async (path) => { if (path) await this._openVaporNote(path); },
            "VaporNote.md"
        ).open();
    }

    // ─── Open ─────────────────────────────────────────────────────────────────

    async _openVaporNote(path) {
        if (this._isOpening) return;
        this._isOpening = true;

        try {
            this.savedFilePath = path;

            let file = this.app.vault.getAbstractFileByPath(path);
            if (!file) {
                file = await this.app.vault.create(path, `# ${path.replace('.md', '')}\n\n`);
            }

            // Save what the user was on so we can restore it on close.
            this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

            const ws = this.app.workspace;

            // Capture window/document environment of the actively focused window
            this._targetWin = activeWindow;
            const doc = activeDocument;

            // ── Phase 1: no-op stub for creation + file-open ──────────────────────
            const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            ws.setActiveLeaf = () => {};

            let leaf;
            try {
                leaf = ws.getLeaf(true);
                this.floatingLeaf = leaf; // Assign immediately to prevent active-leaf-change from treating it as a background leaf
                this._orphanLeafFromWorkspace(leaf);

                // Container must be in the DOM before openFile so CM6 has a real
                // layout box to measure against when it initialises.
                const container = doc.createElement('div');
                this.floatingContainer = container;
                this._styleContainer(container);
                container.appendChild(leaf.containerEl);
                Object.assign(leaf.containerEl.style, {
                    flex: '1', minHeight: '0', overflow: 'hidden'
                });
                doc.body.appendChild(container);

                await leaf.openFile(file);

                // source:false = Live Preview (MathJax, Dataview, etc.)
                const state = leaf.getViewState();
                state.state.mode   = 'source';
                state.state.source = false;
                await leaf.setViewState(state);
            } finally {
                // Always restore even if openFile throws.
                ws.setActiveLeaf = realSetActiveLeaf;
            }

            // Prevent tab-switch from suspending the CM6 editor.
            if (leaf.view) leaf.view.onHide = () => {};

            // Prevent workspace GC from destroying the leaf.
            const origDetach = leaf.detach.bind(leaf);
            leaf.detach = () => {
                if (this._allowDetach) origDetach();
                else this._assertDOMPosition();
            };

            // ── Phase 2: permanent selective interceptor on setActiveLeaf ─────────
            if (this._origSetActiveLeaf) {
                ws.setActiveLeaf = this._origSetActiveLeaf;
                this._origSetActiveLeaf = null;
            }
            this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            ws.setActiveLeaf = (targetLeaf, ...args) => {
                if (targetLeaf === leaf) {
                    ws.activeLeaf = leaf;   // hotkeys read this; no tab walk needed
                    return;
                }
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            this._focusinHandler = () => { 
                if (this._isMigrating) return; // Prevent focus hijacking during document transfers
                ws.activeLeaf = leaf; 
            };
            this.floatingContainer.addEventListener('focusin', this._focusinHandler);

            this._focusoutHandler = (e) => {
                if (this._isMigrating) return;
                const newFocusTarget = e.relatedTarget;
                if (this.floatingContainer && newFocusTarget && this.floatingContainer.contains(newFocusTarget)) {
                    return; // Still focused inside the float
                }
                // Focus has completely left the floating note. Restore activeLeaf to background leaf.
                if (ws.activeLeaf === leaf && this._prevActiveLeaf) {
                    ws.activeLeaf = this._prevActiveLeaf;
                }
            };
            this.floatingContainer.addEventListener('focusout', this._focusoutHandler);

            this._buildChrome(file.name, this.floatingContainer);

            this._resizeObserver = new ResizeObserver(() => {
                try { this.floatingLeaf?.view?.onResize?.(); }        catch (_) {}
                try { this.floatingLeaf?.view?.editor?.refresh(); }   catch (_) {}
            });
            this._resizeObserver.observe(this.floatingContainer);

            leaf.containerEl.focus();
            new Notice("VaporNote popped in.");
        } catch (e) {
            console.error("VaporNote opening failed", e);
            this.closeVaporNote();
        } finally {
            this._isOpening = false;
        }
    }

    // ─── Orphan leaf (remove from workspace tab group, keep parent ref) ───────

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) parent.children.splice(idx, 1);
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    // ─── DOM Migration Engine (Follow User Across Windows) ────────────────────

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;

        this._isMigrating = true;

        // 1. Unbind mouse move/up listeners from old window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 2. Remove container from old window’s body
        try {
            if (this.floatingContainer.parentElement) {
                this.floatingContainer.remove();
            }
        } catch (_) {}

        // 3. Re-assign the target window pointer
        this._targetWin = newWin;

        // 4. Mount container to the new window’s body
        const doc = newWin.document;
        doc.body.appendChild(this.floatingContainer);

        // 5. Re-bind mouse move/up listeners to the new window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 6. Force-assert position and focus metrics
        this._assertDOMPosition();

        // 7. Force CodeMirror 6 context measurement to redraw nicely in the new document split
        try { this.floatingLeaf?.view?.onShow?.(); }        catch (_) {}
        try { this.floatingLeaf?.view?.editor?.refresh(); } catch (_) {}

        // 8. Safely exit migration mode after DOM settles to avoid intercepting browser focus changes
        setTimeout(() => {
            this._isMigrating = false;
        }, 150);
    }

    // ─── DOM guard ────────────────────────────────────────────────────────────

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaf || !this._targetWin) return;
        
        // Handle window closure gracefully
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer))
            doc.body.appendChild(this.floatingContainer);
        if (!this.floatingContainer.contains(this.floatingLeaf.containerEl)) {
            this.floatingContainer.appendChild(this.floatingLeaf.containerEl);
            Object.assign(this.floatingLeaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
        }
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           '100px',
            right:         '50px',
            width:         '380px',
            height:        '500px',
            zIndex:        '200000',
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
        });
    }

    // ─── Drag bar + resize handle ─────────────────────────────────────────────

    _buildChrome(fileName, container) {
        // Dynamically resolve owner document and window contexts so drag listeners
        // always target the exact window the container is currently rendered in
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px;
            cursor: move;
            font-size: 11px;
            font-weight: bold;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;
        `;
        dragBar.textContent = `VaporNote: ${fileName}`;

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        dragBar.appendChild(closeBtn);
        container.prepend(dragBar);

        const resizeHandle = doc.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0; bottom: 0;
            width: 18px; height: 18px;
            cursor: se-resize;
            z-index: 10;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 3px;
            box-sizing: border-box;
        `;
        resizeHandle.innerHTML = `
            <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"
                 style="opacity:0.45;pointer-events:none;">
                <line x1="1" y1="8" x2="8" y2="1" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="8" x2="8" y2="4" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="8" x2="8" y2="7" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        container.appendChild(resizeHandle);

        let mode = null;
        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const currentDoc = getActiveDoc();
            const ov = currentDoc.createElement('div');
            ov.style.cssText = `
                position: fixed; inset: 0;
                z-index: 999999;
                background: transparent;
                cursor: ${cursor};
            `;
            currentDoc.body.appendChild(ov);
            this._dragOverlay = ov;

            // Temporarily disable pointer events on all webviews inside the CURRENT window context
            currentDoc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = 'none';
            });
        };
        const removeOverlay = () => {
            if (this._dragOverlay) { 
                this._dragOverlay.remove(); 
                this._dragOverlay = null; 
            }
            const currentDoc = getActiveDoc();
            // Restore normal pointer behavior inside the CURRENT window context
            currentDoc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = '';
            });
        };

        const onMouseMove = (e) => {
            if (mode === 'drag') {
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (mode === 'resize') {
                container.style.width  = Math.max(250, startW + e.clientX - startX) + 'px';
                container.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            }
        };

        const onMouseUp = () => { mode = null; removeOverlay(); };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            mode = 'drag';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top;
            e.preventDefault();
            showOverlay('move');
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            mode = 'resize';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startW = r.width; startH = r.height;
            e.preventDefault();
            e.stopPropagation();
            showOverlay('se-resize');
        });

        win.document.addEventListener('mousemove', onMouseMove);
        win.document.addEventListener('mouseup',   onMouseUp);

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;
    }

    // ─── Close ────────────────────────────────────────────────────────────────

    closeVaporNote() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null;
            this._globalUpHandler   = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._focusoutHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusout', this._focusoutHandler);
            this._focusoutHandler = null;
        }
        if (this._dragOverlay) {
            this._dragOverlay.remove();
            this._dragOverlay = null;
        }
        if (this.floatingContainer) {
            this.floatingContainer.remove();
            this.floatingContainer = null;
        }
        if (this.floatingLeaf) {
            this._allowDetach = true;
            this.floatingLeaf.detach();
            this.floatingLeaf = null;
            this._allowDetach = false;
        }

        // Restore the real setActiveLeaf BEFORE using it to reactivate the
        // previous background leaf — otherwise the interceptor would swallow it.
        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        // Put the workspace back exactly where the user left it.
        if (this._prevActiveLeaf) {
            try {
                const ws = this.app.workspace;
                // Only programmatically restore focus if the floating leaf is the currently active focus target
                if (ws.activeLeaf === this.floatingLeaf || !ws.activeLeaf) {
                    this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false });
                }
            } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;

        new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;
```
## V10 (Stable?)
- Switches between windows pretty consistently
- Able to drag and resize it pretty consistently (although took a lot of lines of code)
- Main Problem:
	- Thank you! This seemed to fix pretty much everything, but there is one small bug that I believe should be easily fixed. Lets say I am in a web view on a full-screen obsidian window. If I click within this web view and then move over to a second obsidian window on my mac and open the floating notes there without focusing on that second window, switching back to the first window will not have the floating notes follow me unless I click within the first window itself.
```javascript
const { Plugin, Modal, Setting, Notice } = require('obsidian');

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
            .setDesc("Path relative to vault root (e.g. VaporNote.md or Notes/VaporNote.md)")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { this.onSubmit(this.value); this.close(); }
                });
            });
        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Confirm").setCta().onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                });
            });
    }

    onClose() { this.contentEl.empty(); }
}


class VaporNotePlugin extends Plugin {
    async onload() {
        this.floatingLeaf       = null;
        this.floatingContainer  = null;
        this.savedFilePath      = null;   // null until user picks a file once
        this._prevActiveLeaf    = null;   // background leaf active before we opened
        this._origSetActiveLeaf = null;   // real setActiveLeaf, intercepted for float lifetime
        this._targetWin         = null;   // window context where the float is currently attached
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._focusoutHandler   = null;   // Tracks blur events to safely revert activeLeaf
        this._dragOverlay       = null;
        this._allowDetach       = false;
        this._isMigrating       = false;  // Flag to suppress focus changes during window-swapping
        this._isOpening         = false;  // Lock to completely prevent rapid toggling race conditions
        this._focusListeners    = [];     // Cache registry of native focus hooks for cleanup

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        // Initialize focus listeners for currently open windows
        this._setupWindowFocusListeners();

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this._setupWindowFocusListeners();
                this._assertDOMPosition();
            })
        );

        this.registerEvent(
            this.app.workspace.on('window-open', () => {
                this._setupWindowFocusListeners();
                this._assertDOMPosition();
            })
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // If a background leaf is activated while VaporNote is open, track it as our reference
                if (leaf && leaf !== this.floatingLeaf) {
                    this._prevActiveLeaf = leaf;

                    // Backup automatic follow logic if tab active shifts
                    const leafWin = leaf.containerEl?.ownerDocument?.defaultView;
                    if (leafWin && this._targetWin && leafWin !== this._targetWin) {
                        this._moveContainerToWindow(leafWin);
                    }
                }

                if (!this.floatingLeaf?.view) return;
                try { this.floatingLeaf.view.onShow?.(); }        catch (_) {}
                try { this.floatingLeaf.view.editor?.refresh(); } catch (_) {}
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();

        // Safely unbind focus hooks on all open/surviving windows during plugin disable
        if (this._focusListeners) {
            this._focusListeners.forEach(({ win, listener }) => {
                try {
                    win.removeEventListener('focus', listener);
                    delete win._vaporFocusHooked;
                } catch (_) {}
            });
            this._focusListeners = [];
        }
    }

    // ─── Native Window Focus Tracker ──────────────────────────────────────────

    _setupWindowFocusListeners() {
        // Sweep out dead references from closed window frames
        if (this._focusListeners) {
            this._focusListeners = this._focusListeners.filter(({ win }) => !win.closed);
        } else {
            this._focusListeners = [];
        }

        // Collect all currently open active window DOM frames (main + popouts)
        const windows = new Set([window]);
        const floatingSplit = this.app.workspace.floatingSplit;
        if (floatingSplit && floatingSplit.children) {
            floatingSplit.children.forEach(child => {
                if (child.win) {
                    windows.add(child.win);
                }
            });
        }

        // Bind focus-detection triggers to all target windows
        windows.forEach(win => {
            if (win._vaporFocusHooked) return;
            win._vaporFocusHooked = true;

            const onWindowFocus = () => {
                // Instantly follow focus to the newly activated full-screen window on space swipe
                if (this._isOpen() && this._targetWin !== win) {
                    this._moveContainerToWindow(win);
                }
            };

            win.addEventListener('focus', onWindowFocus);
            this._focusListeners.push({ win, listener: onWindowFocus });
        });
    }

    // ─── Open-state guard ─────────────────────────────────────────────────────

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.ownerDocument || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    // ─── Toggle ───────────────────────────────────────────────────────────────

    async toggleVaporNote() {
        if (this._isOpening) return; // Prevent rapid-fire opening race conditions
        
        if (this._isOpen()) {
            this.closeVaporNote();
            return;
        }
        if (this.savedFilePath) {
            await this._openVaporNote(this.savedFilePath);
            return;
        }
        new FilePromptModal(
            this.app,
            async (path) => { if (path) await this._openVaporNote(path); },
            "VaporNote.md"
        ).open();
    }

    // ─── Open ─────────────────────────────────────────────────────────────────

    async _openVaporNote(path) {
        if (this._isOpening) return;
        this._isOpening = true;

        try {
            this.savedFilePath = path;

            let file = this.app.vault.getAbstractFileByPath(path);
            if (!file) {
                file = await this.app.vault.create(path, `# ${path.replace('.md', '')}\n\n`);
            }

            // Save what the user was on so we can restore it on close.
            this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

            const ws = this.app.workspace;

            // Capture window/document environment of the actively focused window
            this._targetWin = activeWindow;
            const doc = activeDocument;

            // ── Phase 1: no-op stub for creation + file-open ──────────────────────
            const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            ws.setActiveLeaf = () => {};

            let leaf;
            try {
                leaf = ws.getLeaf(true);
                this.floatingLeaf = leaf; // Assign immediately to prevent active-leaf-change from treating it as a background leaf
                this._orphanLeafFromWorkspace(leaf);

                // Container must be in the DOM before openFile so CM6 has a real
                // layout box to measure against when it initialises.
                const container = doc.createElement('div');
                this.floatingContainer = container;
                this._styleContainer(container);
                container.appendChild(leaf.containerEl);
                Object.assign(leaf.containerEl.style, {
                    flex: '1', minHeight: '0', overflow: 'hidden'
                });
                doc.body.appendChild(container);

                await leaf.openFile(file);

                // source:false = Live Preview (MathJax, Dataview, etc.)
                const state = leaf.getViewState();
                state.state.mode   = 'source';
                state.state.source = false;
                await leaf.setViewState(state);
            } finally {
                // Always restore even if openFile throws.
                ws.setActiveLeaf = realSetActiveLeaf;
            }

            // Prevent tab-switch from suspending the CM6 editor.
            if (leaf.view) leaf.view.onHide = () => {};

            // Prevent workspace GC from destroying the leaf.
            const origDetach = leaf.detach.bind(leaf);
            leaf.detach = () => {
                if (this._allowDetach) origDetach();
                else this._assertDOMPosition();
            };

            // ── Phase 2: permanent selective interceptor on setActiveLeaf ─────────
            if (this._origSetActiveLeaf) {
                ws.setActiveLeaf = this._origSetActiveLeaf;
                this._origSetActiveLeaf = null;
            }
            this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            ws.setActiveLeaf = (targetLeaf, ...args) => {
                if (targetLeaf === leaf) {
                    ws.activeLeaf = leaf;   // hotkeys read this; no tab walk needed
                    return;
                }
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            this._focusinHandler = () => { 
                if (this._isMigrating) return; // Prevent focus hijacking during document transfers
                ws.activeLeaf = leaf; 
            };
            this.floatingContainer.addEventListener('focusin', this._focusinHandler);

            this._focusoutHandler = (e) => {
                if (this._isMigrating) return;
                const newFocusTarget = e.relatedTarget;
                if (this.floatingContainer && newFocusTarget && this.floatingContainer.contains(newFocusTarget)) {
                    return; // Still focused inside the float
                }
                // Focus has completely left the floating note. Restore activeLeaf to background leaf.
                if (ws.activeLeaf === leaf && this._prevActiveLeaf) {
                    ws.activeLeaf = this._prevActiveLeaf;
                }
            };
            this.floatingContainer.addEventListener('focusout', this._focusoutHandler);

            this._buildChrome(file.name, this.floatingContainer);

            this._resizeObserver = new ResizeObserver(() => {
                try { this.floatingLeaf?.view?.onResize?.(); }        catch (_) {}
                try { this.floatingLeaf?.view?.editor?.refresh(); }   catch (_) {}
            });
            this._resizeObserver.observe(this.floatingContainer);

            leaf.containerEl.focus();
            new Notice("VaporNote popped in.");
        } catch (e) {
            console.error("VaporNote opening failed", e);
            this.closeVaporNote();
        } finally {
            this._isOpening = false;
        }
    }

    // ─── Orphan leaf (remove from workspace tab group, keep parent ref) ───────

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) parent.children.splice(idx, 1);
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    // ─── DOM Migration Engine (Follow User Across Windows) ────────────────────

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;

        this._isMigrating = true;

        // 1. Unbind mouse move/up listeners from old window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 2. Remove container from old window’s body
        try {
            if (this.floatingContainer.parentElement) {
                this.floatingContainer.remove();
            }
        } catch (_) {}

        // 3. Re-assign the target window pointer
        this._targetWin = newWin;

        // 4. Mount container to the new window’s body
        const doc = newWin.document;
        doc.body.appendChild(this.floatingContainer);

        // 5. Re-bind mouse move/up listeners to the new window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 6. Force-assert position and focus metrics
        this._assertDOMPosition();

        // 7. Force CodeMirror 6 context measurement to redraw nicely in the new document split
        try { this.floatingLeaf?.view?.onShow?.(); }        catch (_) {}
        try { this.floatingLeaf?.view?.editor?.refresh(); } catch (_) {}

        // 8. Safely exit migration mode after DOM settles to avoid intercepting browser focus changes
        setTimeout(() => {
            this._isMigrating = false;
        }, 150);
    }

    // ─── DOM guard ────────────────────────────────────────────────────────────

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaf || !this._targetWin) return;
        
        // Handle window closure gracefully
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer))
            doc.body.appendChild(this.floatingContainer);
        if (!this.floatingContainer.contains(this.floatingLeaf.containerEl)) {
            this.floatingContainer.appendChild(this.floatingLeaf.containerEl);
            Object.assign(this.floatingLeaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
        }
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           '100px',
            right:         '50px',
            width:         '380px',
            height:        '500px',
            zIndex:        '200000',
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
        });
    }

    // ─── Drag bar + resize handle ─────────────────────────────────────────────

    _buildChrome(fileName, container) {
        // Dynamically resolve owner document and window contexts so drag listeners
        // always target the exact window the container is currently rendered in
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px;
            cursor: move;
            font-size: 11px;
            font-weight: bold;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;
        `;
        dragBar.textContent = `VaporNote: ${fileName}`;

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        dragBar.appendChild(closeBtn);
        container.prepend(dragBar);

        const resizeHandle = doc.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0; bottom: 0;
            width: 18px; height: 18px;
            cursor: se-resize;
            z-index: 10;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 3px;
            box-sizing: border-box;
        `;
        resizeHandle.innerHTML = `
            <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"
                 style="opacity:0.45;pointer-events:none;">
                <line x1="1" y1="8" x2="8" y2="1" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="8" x2="8" y2="4" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="8" x2="8" y2="7" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        container.appendChild(resizeHandle);

        let mode = null;
        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const currentDoc = getActiveDoc();
            const ov = currentDoc.createElement('div');
            ov.style.cssText = `
                position: fixed; inset: 0;
                z-index: 999999;
                background: transparent;
                cursor: ${cursor};
            `;
            currentDoc.body.appendChild(ov);
            this._dragOverlay = ov;

            // Temporarily disable pointer events on all webviews inside the CURRENT window context
            currentDoc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = 'none';
            });
        };
        const removeOverlay = () => {
            if (this._dragOverlay) { 
                this._dragOverlay.remove(); 
                this._dragOverlay = null; 
            }
            const currentDoc = getActiveDoc();
            // Restore normal pointer behavior inside the CURRENT window context
            currentDoc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = '';
            });
        };

        const onMouseMove = (e) => {
            if (mode === 'drag') {
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (mode === 'resize') {
                container.style.width  = Math.max(250, startW + e.clientX - startX) + 'px';
                container.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            }
        };

        const onMouseUp = () => { mode = null; removeOverlay(); };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            mode = 'drag';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top;
            e.preventDefault();
            showOverlay('move');
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            mode = 'resize';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startW = r.width; startH = r.height;
            e.preventDefault();
            e.stopPropagation();
            showOverlay('se-resize');
        });

        win.document.addEventListener('mousemove', onMouseMove);
        win.document.addEventListener('mouseup',   onMouseUp);

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;
    }

    // ─── Close ────────────────────────────────────────────────────────────────

    closeVaporNote() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null;
            this._globalUpHandler   = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._focusoutHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusout', this._focusoutHandler);
            this._focusoutHandler = null;
        }
        if (this._dragOverlay) {
            this._dragOverlay.remove();
            this._dragOverlay = null;
        }
        if (this.floatingContainer) {
            this.floatingContainer.remove();
            this.floatingContainer = null;
        }
        if (this.floatingLeaf) {
            this._allowDetach = true;
            this.floatingLeaf.detach();
            this.floatingLeaf = null;
            this._allowDetach = false;
        }

        // Restore the real setActiveLeaf BEFORE using it to reactivate the
        // previous background leaf — otherwise the interceptor would swallow it.
        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        // Put the workspace back exactly where the user left it.
        if (this._prevActiveLeaf) {
            try {
                const ws = this.app.workspace;
                // Only programmatically restore focus if the floating leaf is the currently active focus target
                if (ws.activeLeaf === this.floatingLeaf || !ws.activeLeaf) {
                    this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false });
                }
            } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;

        new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;
```
## V9
- The only problem seems that when switching between windows, it isn't always 100% consistent. 
```javascript
const { Plugin, Modal, Setting, Notice } = require('obsidian');

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
            .setDesc("Path relative to vault root (e.g. VaporNote.md or Notes/VaporNote.md)")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { this.onSubmit(this.value); this.close(); }
                });
            });
        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Confirm").setCta().onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                });
            });
    }

    onClose() { this.contentEl.empty(); }
}


class VaporNotePlugin extends Plugin {
    async onload() {
        this.floatingLeaf       = null;
        this.floatingContainer  = null;
        this.savedFilePath      = null;   // null until user picks a file once
        this._prevActiveLeaf    = null;   // background leaf active before we opened
        this._origSetActiveLeaf = null;   // real setActiveLeaf, intercepted for float lifetime
        this._targetWin         = null;   // window context where the float is currently attached
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._focusoutHandler   = null;   // Tracks blur events to safely revert activeLeaf
        this._dragOverlay       = null;
        this._allowDetach       = false;
        this._isMigrating       = false;  // Flag to suppress focus changes during window-swapping
        this._isOpening         = false;  // Lock to completely prevent rapid toggling race conditions

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        this.registerEvent(
            this.app.workspace.on('layout-change', () => this._assertDOMPosition())
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // If a background leaf is activated while VaporNote is open, track it as our reference
                if (leaf && leaf !== this.floatingLeaf) {
                    this._prevActiveLeaf = leaf;

                    // Automatically follow the active leaf if it belongs to a different popout/main window
                    const leafWin = leaf.containerEl?.ownerDocument?.defaultView;
                    if (leafWin && this._targetWin && leafWin !== this._targetWin) {
                        this._moveContainerToWindow(leafWin);
                    }
                }

                if (!this.floatingLeaf?.view) return;
                try { this.floatingLeaf.view.onShow?.(); }        catch (_) {}
                try { this.floatingLeaf.view.editor?.refresh(); } catch (_) {}
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();
    }

    // ─── Open-state guard ─────────────────────────────────────────────────────

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.ownerDocument || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    // ─── Toggle ───────────────────────────────────────────────────────────────

    async toggleVaporNote() {
        if (this._isOpening) return; // Prevent rapid-fire opening race conditions
        
        if (this._isOpen()) {
            this.closeVaporNote();
            return;
        }
        if (this.savedFilePath) {
            await this._openVaporNote(this.savedFilePath);
            return;
        }
        new FilePromptModal(
            this.app,
            async (path) => { if (path) await this._openVaporNote(path); },
            "VaporNote.md"
        ).open();
    }

    // ─── Open ─────────────────────────────────────────────────────────────────

    async _openVaporNote(path) {
        if (this._isOpening) return;
        this._isOpening = true;

        try {
            this.savedFilePath = path;

            let file = this.app.vault.getAbstractFileByPath(path);
            if (!file) {
                file = await this.app.vault.create(path, `# ${path.replace('.md', '')}\n\n`);
            }

            // Save what the user was on so we can restore it on close.
            this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

            const ws = this.app.workspace;

            // Capture window/document environment of the actively focused window
            this._targetWin = activeWindow;
            const doc = activeDocument;

            // ── Phase 1: no-op stub for creation + file-open ──────────────────────
            const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            ws.setActiveLeaf = () => {};

            let leaf;
            try {
                leaf = ws.getLeaf(true);
                this.floatingLeaf = leaf; // Assign immediately to prevent layout triggers from treating it as a background leaf
                this._orphanLeafFromWorkspace(leaf);

                // Container must be in the DOM before openFile so CM6 has a real
                // layout box to measure against when it initialises.
                const container = doc.createElement('div');
                this.floatingContainer = container;
                this._styleContainer(container);
                container.appendChild(leaf.containerEl);
                Object.assign(leaf.containerEl.style, {
                    flex: '1', minHeight: '0', overflow: 'hidden'
                });
                doc.body.appendChild(container);

                await leaf.openFile(file);

                // source:false = Live Preview (MathJax, Dataview, etc.)
                const state = leaf.getViewState();
                state.state.mode   = 'source';
                state.state.source = false;
                await leaf.setViewState(state);
            } finally {
                // Always restore even if openFile throws.
                ws.setActiveLeaf = realSetActiveLeaf;
            }

            // Prevent tab-switch from suspending the CM6 editor.
            if (leaf.view) leaf.view.onHide = () => {};

            // Prevent workspace GC from destroying the leaf.
            const origDetach = leaf.detach.bind(leaf);
            leaf.detach = () => {
                if (this._allowDetach) origDetach();
                else this._assertDOMPosition();
            };

            // ── Phase 2: permanent selective interceptor on setActiveLeaf ─────────
            if (this._origSetActiveLeaf) {
                ws.setActiveLeaf = this._origSetActiveLeaf;
                this._origSetActiveLeaf = null;
            }
            this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
            ws.setActiveLeaf = (targetLeaf, ...args) => {
                if (targetLeaf === leaf) {
                    ws.activeLeaf = leaf;   // hotkeys read this; no tab walk needed
                    return;
                }
                return this._origSetActiveLeaf(targetLeaf, ...args);
            };

            this._focusinHandler = () => { 
                if (this._isMigrating) return; // Prevent focus hijacking during document transfers
                ws.activeLeaf = leaf; 
            };
            this.floatingContainer.addEventListener('focusin', this._focusinHandler);

            this._focusoutHandler = (e) => {
                if (this._isMigrating) return;
                const newFocusTarget = e.relatedTarget;
                if (this.floatingContainer && newFocusTarget && this.floatingContainer.contains(newFocusTarget)) {
                    return; // Still focused inside the float
                }
                // Focus has completely left the floating note. Restore activeLeaf to background leaf.
                if (ws.activeLeaf === leaf && this._prevActiveLeaf) {
                    ws.activeLeaf = this._prevActiveLeaf;
                }
            };
            this.floatingContainer.addEventListener('focusout', this._focusoutHandler);

            this._buildChrome(file.name, this.floatingContainer);

            this._resizeObserver = new ResizeObserver(() => {
                try { this.floatingLeaf?.view?.onResize?.(); }        catch (_) {}
                try { this.floatingLeaf?.view?.editor?.refresh(); }   catch (_) {}
            });
            this._resizeObserver.observe(this.floatingContainer);

            leaf.containerEl.focus();
            new Notice("VaporNote popped in.");
        } catch (e) {
            console.error("VaporNote opening failed", e);
            this.closeVaporNote();
        } finally {
            this._isOpening = false;
        }
    }

    // ─── Orphan leaf (remove from workspace tab group, keep parent ref) ───────

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) parent.children.splice(idx, 1);
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    // ─── DOM Migration Engine (Follow User Across Windows) ────────────────────

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;

        this._isMigrating = true;

        // 1. Unbind mouse move/up listeners from old window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 2. Remove container from old window’s body
        try {
            if (this.floatingContainer.parentElement) {
                this.floatingContainer.remove();
            }
        } catch (_) {}

        // 3. Re-assign the target window pointer
        this._targetWin = newWin;

        // 4. Mount container to the new window’s body
        const doc = newWin.document;
        doc.body.appendChild(this.floatingContainer);

        // 5. Re-bind mouse move/up listeners to the new window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 6. Force-assert position and focus metrics
        this._assertDOMPosition();

        // 7. Force CodeMirror 6 context measurement to redraw nicely in the new document split
        try { this.floatingLeaf?.view?.onShow?.(); }        catch (_) {}
        try { this.floatingLeaf?.view?.editor?.refresh(); } catch (_) {}

        // 8. Safely exit migration mode after DOM settles to avoid intercepting browser focus changes
        setTimeout(() => {
            this._isMigrating = false;
        }, 150);
    }

    // ─── DOM guard ────────────────────────────────────────────────────────────

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaf || !this._targetWin) return;
        
        // Handle window closure gracefully
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer))
            doc.body.appendChild(this.floatingContainer);
        if (!this.floatingContainer.contains(this.floatingLeaf.containerEl)) {
            this.floatingContainer.appendChild(this.floatingLeaf.containerEl);
            Object.assign(this.floatingLeaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
        }
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           '100px',
            right:         '50px',
            width:         '380px',
            height:        '500px',
            zIndex:        '200000',
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
        });
    }

    // ─── Drag bar + resize handle ─────────────────────────────────────────────

    _buildChrome(fileName, container) {
        // Dynamically resolve owner document and window contexts so drag listeners
        // always target the exact window the container is currently rendered in
        const getActiveDoc = () => container.ownerDocument || activeDocument;
        const getActiveWin = () => container.ownerDocument?.defaultView || activeWindow;

        const doc = getActiveDoc();
        const win = getActiveWin();

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px;
            cursor: move;
            font-size: 11px;
            font-weight: bold;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;
        `;
        dragBar.textContent = `VaporNote: ${fileName}`;

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        dragBar.appendChild(closeBtn);
        container.prepend(dragBar);

        const resizeHandle = doc.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0; bottom: 0;
            width: 18px; height: 18px;
            cursor: se-resize;
            z-index: 10;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 3px;
            box-sizing: border-box;
        `;
        resizeHandle.innerHTML = `
            <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"
                 style="opacity:0.45;pointer-events:none;">
                <line x1="1" y1="8" x2="8" y2="1" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="8" x2="8" y2="4" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="8" x2="8" y2="7" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        container.appendChild(resizeHandle);

        let mode = null;
        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const currentDoc = getActiveDoc();
            const ov = currentDoc.createElement('div');
            ov.style.cssText = `
                position: fixed; inset: 0;
                z-index: 999999;
                background: transparent;
                cursor: ${cursor};
            `;
            currentDoc.body.appendChild(ov);
            this._dragOverlay = ov;

            // Temporarily disable pointer events on all webviews inside the CURRENT window context
            currentDoc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = 'none';
            });
        };
        const removeOverlay = () => {
            if (this._dragOverlay) { 
                this._dragOverlay.remove(); 
                this._dragOverlay = null; 
            }
            const currentDoc = getActiveDoc();
            // Restore normal pointer behavior inside the CURRENT window context
            currentDoc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = '';
            });
        };

        const onMouseMove = (e) => {
            if (mode === 'drag') {
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (mode === 'resize') {
                container.style.width  = Math.max(250, startW + e.clientX - startX) + 'px';
                container.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            }
        };

        const onMouseUp = () => { mode = null; removeOverlay(); };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            mode = 'drag';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top;
            e.preventDefault();
            showOverlay('move');
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            mode = 'resize';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startW = r.width; startH = r.height;
            e.preventDefault();
            e.stopPropagation();
            showOverlay('se-resize');
        });

        win.document.addEventListener('mousemove', onMouseMove);
        win.document.addEventListener('mouseup',   onMouseUp);

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;
    }

    // ─── Close ────────────────────────────────────────────────────────────────

    closeVaporNote() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null;
            this._globalUpHandler   = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._focusoutHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusout', this._focusoutHandler);
            this._focusoutHandler = null;
        }
        if (this._dragOverlay) {
            this._dragOverlay.remove();
            this._dragOverlay = null;
        }
        if (this.floatingContainer) {
            this.floatingContainer.remove();
            this.floatingContainer = null;
        }
        if (this.floatingLeaf) {
            this._allowDetach = true;
            this.floatingLeaf.detach();
            this.floatingLeaf = null;
            this._allowDetach = false;
        }

        // Restore the real setActiveLeaf BEFORE using it to reactivate the
        // previous background leaf — otherwise the interceptor would swallow it.
        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        // Put the workspace back exactly where the user left it.
        if (this._prevActiveLeaf) {
            try {
                const ws = this.app.workspace;
                // Only programmatically restore focus if the floating leaf is the currently active focus target
                if (ws.activeLeaf === this.floatingLeaf || !ws.activeLeaf) {
                    this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false });
                }
            } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;
        this._isOpening = false;

        new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;
```
## V8 (Unstable)
- The snapping position of the markdown file doesn't work too well
```javascript
const { Plugin, Modal, Setting, Notice } = require('obsidian');

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
            .setDesc("Path relative to vault root (e.g. VaporNote.md or Notes/VaporNote.md)")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { this.onSubmit(this.value); this.close(); }
                });
            });
        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Confirm").setCta().onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                });
            });
    }

    onClose() { this.contentEl.empty(); }
}


class VaporNotePlugin extends Plugin {
    async onload() {
        this.floatingLeaf       = null;
        this.floatingContainer  = null;
        this.savedFilePath      = null;   // null until user picks a file once
        this._prevActiveLeaf    = null;   // background leaf active before we opened
        this._origSetActiveLeaf = null;   // real setActiveLeaf, intercepted for float lifetime
        this._targetWin         = null;   // window context where the float is currently attached
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._dragOverlay       = null;
        this._allowDetach       = false;
        this._savedStates       = {};     // Cache to store scroll and cursor states per note path

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        this.registerEvent(
            this.app.workspace.on('layout-change', () => this._assertDOMPosition())
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // If a background leaf is activated while VaporNote is open, track it as our reference
                if (leaf && leaf !== this.floatingLeaf) {
                    this._prevActiveLeaf = leaf;

                    // Automatically follow the active leaf if it belongs to a different popout/main window
                    const leafWin = leaf.containerEl?.win;
                    if (leafWin && this._targetWin && leafWin !== this._targetWin) {
                        this._moveContainerToWindow(leafWin);
                    }
                }

                if (!this.floatingLeaf?.view) return;
                try { this.floatingLeaf.view.onShow?.(); }        catch (_) {}
                try { this.floatingLeaf.view.editor?.refresh(); } catch (_) {}
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();
    }

    // ─── Open-state guard ─────────────────────────────────────────────────────

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.doc || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    // ─── Toggle ───────────────────────────────────────────────────────────────

    async toggleVaporNote() {
        if (this._isOpen()) {
            this.closeVaporNote();
            return;
        }
        if (this.savedFilePath) {
            await this._openVaporNote(this.savedFilePath);
            return;
        }
        new FilePromptModal(
            this.app,
            async (path) => { if (path) await this._openVaporNote(path); },
            "VaporNote.md"
        ).open();
    }

    // ─── Open ─────────────────────────────────────────────────────────────────

    async _openVaporNote(path) {
        this.savedFilePath = path;

        let file = this.app.vault.getAbstractFileByPath(path);
        if (!file) {
            file = await this.app.vault.create(path, `# ${path.replace('.md', '')}\n\n`);
        }

        // Save what the user was on so we can restore it on close.
        this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

        const ws = this.app.workspace;

        // Capture window/document environment of the actively focused window
        this._targetWin = activeWindow;
        const doc = activeDocument;

        // ── Phase 1: no-op stub for creation + file-open ──────────────────────
        const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = ws.getLeaf(true);
            this._orphanLeafFromWorkspace(leaf);

            // Container must be in the DOM before openFile so CM6 has a real
            // layout box to measure against when it initialises.
            const container = doc.createElement('div');
            this.floatingContainer = container;
            this._styleContainer(container);
            container.appendChild(leaf.containerEl);
            Object.assign(leaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
            doc.body.appendChild(container);

            await leaf.openFile(file);

            // source:false = Live Preview (MathJax, Dataview, etc.)
            const state = leaf.getViewState();
            state.state.mode   = 'source';
            state.state.source = false;
            await leaf.setViewState(state);
        } finally {
            // Always restore even if openFile throws.
            ws.setActiveLeaf = realSetActiveLeaf;
        }

        this.floatingLeaf = leaf;

        // Prevent tab-switch from suspending the CM6 editor.
        if (leaf.view) leaf.view.onHide = () => {};

        // Prevent workspace GC from destroying the leaf.
        const origDetach = leaf.detach.bind(leaf);
        leaf.detach = () => {
            if (this._allowDetach) origDetach();
            else this._assertDOMPosition();
        };

        // ── Phase 2: permanent selective interceptor on setActiveLeaf ─────────
        this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = (targetLeaf, ...args) => {
            if (targetLeaf === leaf) {
                ws.activeLeaf = leaf;   // hotkeys read this; no tab walk needed
                return;
            }
            return this._origSetActiveLeaf(targetLeaf, ...args);
        };

        this._focusinHandler = () => { ws.activeLeaf = leaf; };
        this.floatingContainer.addEventListener('focusin', this._focusinHandler);

        this._buildChrome(file.name, this.floatingContainer);

        this._resizeObserver = new ResizeObserver(() => {
            try { this.floatingLeaf?.view?.onResize?.(); }        catch (_) {}
            try { this.floatingLeaf?.view?.editor?.refresh(); }   catch (_) {}
        });
        this._resizeObserver.observe(this.floatingContainer);

        // Restore saved scroll / cursor positions
        if (this._savedStates && this._savedStates[path]) {
            const savedState = this._savedStates[path];
            // Wait brief moment for the newly initialized CodeMirror 6 context to stabilize
            setTimeout(() => {
                if (leaf && leaf.view) {
                    try {
                        leaf.setEphemeralState(savedState);
                    } catch (err) {
                        console.warn("VaporNote: Failed to restore scroll position:", err);
                    }
                }
            }, 100);
        }

        leaf.containerEl.focus();
        new Notice("VaporNote popped in.");
    }

    // ─── Orphan leaf (remove from workspace tab group, keep parent ref) ───────

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) parent.children.splice(idx, 1);
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    // ─── DOM Migration Engine (Follow User Across Windows) ────────────────────

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;

        // 1. Unbind mouse move/up listeners from old window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 2. Remove container from old window’s body
        try {
            if (this.floatingContainer.parentElement) {
                this.floatingContainer.remove();
            }
        } catch (_) {}

        // 3. Re-assign the target window pointer
        this._targetWin = newWin;

        // 4. Mount container to the new window’s body
        const doc = newWin.document;
        doc.body.appendChild(this.floatingContainer);

        // 5. Re-bind mouse move/up listeners to the new window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 6. Force-assert position and focus metrics
        this._assertDOMPosition();

        // 7. Force CodeMirror 6 context measurement to redraw nicely in the new document split
        try { this.floatingLeaf?.view?.onShow?.(); }        catch (_) {}
        try { this.floatingLeaf?.view?.editor?.refresh(); } catch (_) {}
    }

    // ─── DOM guard ────────────────────────────────────────────────────────────

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaf || !this._targetWin) return;
        
        // Handle window closure gracefully
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer))
            doc.body.appendChild(this.floatingContainer);
        if (!this.floatingContainer.contains(this.floatingLeaf.containerEl)) {
            this.floatingContainer.appendChild(this.floatingLeaf.containerEl);
            Object.assign(this.floatingLeaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
        }
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           '100px',
            right:         '50px',
            width:         '380px',
            height:        '500px',
            zIndex:        '200000',
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
        });
    }

    // ─── Drag bar + resize handle ─────────────────────────────────────────────

    _buildChrome(fileName, container) {
        const doc = container.doc || activeDocument;
        const win = container.win || activeWindow;

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px;
            cursor: move;
            font-size: 11px;
            font-weight: bold;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;
        `;
        dragBar.textContent = `VaporNote: ${fileName}`;

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        dragBar.appendChild(closeBtn);
        container.prepend(dragBar);

        const resizeHandle = doc.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0; bottom: 0;
            width: 18px; height: 18px;
            cursor: se-resize;
            z-index: 10;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 3px;
            box-sizing: border-box;
        `;
        resizeHandle.innerHTML = `
            <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"
                 style="opacity:0.45;pointer-events:none;">
                <line x1="1" y1="8" x2="8" y2="1" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="8" x2="8" y2="4" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="8" x2="8" y2="7" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        container.appendChild(resizeHandle);

        let mode = null;
        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const ov = doc.createElement('div');
            ov.style.cssText = `
                position: fixed; inset: 0;
                z-index: 999999;
                background: transparent;
                cursor: ${cursor};
            `;
            doc.body.appendChild(ov);
            this._dragOverlay = ov;

            // FIX: Temporarily disable pointer events on all webviews in this window
            // while dragging/resizing so they don't capture mouse movements
            doc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = 'none';
            });
        };
        const removeOverlay = () => {
            if (this._dragOverlay) { 
                this._dragOverlay.remove(); 
                this._dragOverlay = null; 
            }
            // FIX: Restore normal pointer behavior so you can click/type in webviews
            doc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = '';
            });
        };

        const onMouseMove = (e) => {
            if (mode === 'drag') {
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (mode === 'resize') {
                container.style.width  = Math.max(250, startW + e.clientX - startX) + 'px';
                container.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            }
        };

        const onMouseUp = () => { mode = null; removeOverlay(); };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            mode = 'drag';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top;
            e.preventDefault();
            showOverlay('move');
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            mode = 'resize';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startW = r.width; startH = r.height;
            e.preventDefault();
            e.stopPropagation();
            showOverlay('se-resize');
        });

        win.document.addEventListener('mousemove', onMouseMove);
        win.document.addEventListener('mouseup',   onMouseUp);

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;
    }

    // ─── Close ────────────────────────────────────────────────────────────────

    closeVaporNote() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null;
            this._globalUpHandler   = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._dragOverlay) {
            this._dragOverlay.remove();
            this._dragOverlay = null;
        }
        if (this.floatingContainer) {
            this.floatingContainer.remove();
            this.floatingContainer = null;
        }

        // Save scroll/cursor position before detaching the leaf
        if (this.floatingLeaf && this.savedFilePath) {
            try {
                const state = this.floatingLeaf.getEphemeralState();
                if (state) {
                    if (!this._savedStates) this._savedStates = {};
                    this._savedStates[this.savedFilePath] = state;
                }
            } catch (err) {
                console.warn("VaporNote: Failed to save scroll position:", err);
            }

            this._allowDetach = true;
            this.floatingLeaf.detach();
            this.floatingLeaf = null;
            this._allowDetach = false;
        }

        // Restore the real setActiveLeaf BEFORE using it to reactivate the
        // previous background leaf — otherwise the interceptor would swallow it.
        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        // Put the workspace back exactly where the user left it.
        if (this._prevActiveLeaf) {
            try {
                const ws = this.app.workspace;
                // Only programmatically restore focus if the floating leaf is the currently active focus target
                if (ws.activeLeaf === this.floatingLeaf || !ws.activeLeaf) {
                    this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false });
                }
            } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;

        new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;
```
## V7 (Unstable)
- Modified it so can drag and resize more easily within a video.
```javascript
const { Plugin, Modal, Setting, Notice } = require('obsidian');

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
            .setDesc("Path relative to vault root (e.g. VaporNote.md or Notes/VaporNote.md)")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { this.onSubmit(this.value); this.close(); }
                });
            });
        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Confirm").setCta().onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                });
            });
    }

    onClose() { this.contentEl.empty(); }
}


class VaporNotePlugin extends Plugin {
    async onload() {
        this.floatingLeaf       = null;
        this.floatingContainer  = null;
        this.savedFilePath      = null;   // null until user picks a file once
        this._prevActiveLeaf    = null;   // background leaf active before we opened
        this._origSetActiveLeaf = null;   // real setActiveLeaf, intercepted for float lifetime
        this._targetWin         = null;   // window context where the float is currently attached
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._dragOverlay       = null;
        this._allowDetach       = false;

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        this.registerEvent(
            this.app.workspace.on('layout-change', () => this._assertDOMPosition())
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // If a background leaf is activated while VaporNote is open, track it as our reference
                if (leaf && leaf !== this.floatingLeaf) {
                    this._prevActiveLeaf = leaf;

                    // Automatically follow the active leaf if it belongs to a different popout/main window
                    const leafWin = leaf.containerEl?.win;
                    if (leafWin && this._targetWin && leafWin !== this._targetWin) {
                        this._moveContainerToWindow(leafWin);
                    }
                }

                if (!this.floatingLeaf?.view) return;
                try { this.floatingLeaf.view.onShow?.(); }        catch (_) {}
                try { this.floatingLeaf.view.editor?.refresh(); } catch (_) {}
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();
    }

    // ─── Open-state guard ─────────────────────────────────────────────────────

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.doc || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    // ─── Toggle ───────────────────────────────────────────────────────────────

    async toggleVaporNote() {
        if (this._isOpen()) {
            this.closeVaporNote();
            return;
        }
        if (this.savedFilePath) {
            await this._openVaporNote(this.savedFilePath);
            return;
        }
        new FilePromptModal(
            this.app,
            async (path) => { if (path) await this._openVaporNote(path); },
            "VaporNote.md"
        ).open();
    }

    // ─── Open ─────────────────────────────────────────────────────────────────

    async _openVaporNote(path) {
        this.savedFilePath = path;

        let file = this.app.vault.getAbstractFileByPath(path);
        if (!file) {
            file = await this.app.vault.create(path, `# ${path.replace('.md', '')}\n\n`);
        }

        // Save what the user was on so we can restore it on close.
        this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

        const ws = this.app.workspace;

        // Capture window/document environment of the actively focused window
        this._targetWin = activeWindow;
        const doc = activeDocument;

        // ── Phase 1: no-op stub for creation + file-open ──────────────────────
        const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = ws.getLeaf(true);
            this._orphanLeafFromWorkspace(leaf);

            // Container must be in the DOM before openFile so CM6 has a real
            // layout box to measure against when it initialises.
            const container = doc.createElement('div');
            this.floatingContainer = container;
            this._styleContainer(container);
            container.appendChild(leaf.containerEl);
            Object.assign(leaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
            doc.body.appendChild(container);

            await leaf.openFile(file);

            // source:false = Live Preview (MathJax, Dataview, etc.)
            const state = leaf.getViewState();
            state.state.mode   = 'source';
            state.state.source = false;
            await leaf.setViewState(state);
        } finally {
            // Always restore even if openFile throws.
            ws.setActiveLeaf = realSetActiveLeaf;
        }

        this.floatingLeaf = leaf;

        // Prevent tab-switch from suspending the CM6 editor.
        if (leaf.view) leaf.view.onHide = () => {};

        // Prevent workspace GC from destroying the leaf.
        const origDetach = leaf.detach.bind(leaf);
        leaf.detach = () => {
            if (this._allowDetach) origDetach();
            else this._assertDOMPosition();
        };

        // ── Phase 2: permanent selective interceptor on setActiveLeaf ─────────
        this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = (targetLeaf, ...args) => {
            if (targetLeaf === leaf) {
                ws.activeLeaf = leaf;   // hotkeys read this; no tab walk needed
                return;
            }
            return this._origSetActiveLeaf(targetLeaf, ...args);
        };

        this._focusinHandler = () => { ws.activeLeaf = leaf; };
        this.floatingContainer.addEventListener('focusin', this._focusinHandler);

        this._buildChrome(file.name, this.floatingContainer);

        this._resizeObserver = new ResizeObserver(() => {
            try { this.floatingLeaf?.view?.onResize?.(); }        catch (_) {}
            try { this.floatingLeaf?.view?.editor?.refresh(); }   catch (_) {}
        });
        this._resizeObserver.observe(this.floatingContainer);

        leaf.containerEl.focus();
        new Notice("VaporNote popped in.");
    }

    // ─── Orphan leaf (remove from workspace tab group, keep parent ref) ───────

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) parent.children.splice(idx, 1);
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    // ─── DOM Migration Engine (Follow User Across Windows) ────────────────────

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;

        // 1. Unbind mouse move/up listeners from old window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 2. Remove container from old window’s body
        try {
            if (this.floatingContainer.parentElement) {
                this.floatingContainer.remove();
            }
        } catch (_) {}

        // 3. Re-assign the target window pointer
        this._targetWin = newWin;

        // 4. Mount container to the new window’s body
        const doc = newWin.document;
        doc.body.appendChild(this.floatingContainer);

        // 5. Re-bind mouse move/up listeners to the new window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 6. Force-assert position and focus metrics
        this._assertDOMPosition();

        // 7. Force CodeMirror 6 context measurement to redraw nicely in the new document split
        try { this.floatingLeaf?.view?.onShow?.(); }        catch (_) {}
        try { this.floatingLeaf?.view?.editor?.refresh(); } catch (_) {}
    }

    // ─── DOM guard ────────────────────────────────────────────────────────────

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaf || !this._targetWin) return;
        
        // Handle window closure gracefully
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer))
            doc.body.appendChild(this.floatingContainer);
        if (!this.floatingContainer.contains(this.floatingLeaf.containerEl)) {
            this.floatingContainer.appendChild(this.floatingLeaf.containerEl);
            Object.assign(this.floatingLeaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
        }
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           '100px',
            right:         '50px',
            width:         '380px',
            height:        '500px',
            zIndex:        '200000',
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
        });
    }

    // ─── Drag bar + resize handle ─────────────────────────────────────────────

    _buildChrome(fileName, container) {
        const doc = container.doc || activeDocument;
        const win = container.win || activeWindow;

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px;
            cursor: move;
            font-size: 11px;
            font-weight: bold;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;
        `;
        dragBar.textContent = `VaporNote: ${fileName}`;

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        dragBar.appendChild(closeBtn);
        container.prepend(dragBar);

        const resizeHandle = doc.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0; bottom: 0;
            width: 18px; height: 18px;
            cursor: se-resize;
            z-index: 10;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 3px;
            box-sizing: border-box;
        `;
        resizeHandle.innerHTML = `
            <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"
                 style="opacity:0.45;pointer-events:none;">
                <line x1="1" y1="8" x2="8" y2="1" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="8" x2="8" y2="4" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="8" x2="8" y2="7" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        container.appendChild(resizeHandle);

        let mode = null;
        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const ov = doc.createElement('div');
            ov.style.cssText = `
                position: fixed; inset: 0;
                z-index: 999999;
                background: transparent;
                cursor: ${cursor};
            `;
            doc.body.appendChild(ov);
            this._dragOverlay = ov;

            // FIX: Temporarily disable pointer events on all webviews in this window
            // while dragging/resizing so they don't capture mouse movements
            doc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = 'none';
            });
        };
        const removeOverlay = () => {
            if (this._dragOverlay) { 
                this._dragOverlay.remove(); 
                this._dragOverlay = null; 
            }
            // FIX: Restore normal pointer behavior so you can click/type in webviews
            doc.querySelectorAll('webview').forEach(wv => {
                wv.style.pointerEvents = '';
            });
        };

        const onMouseMove = (e) => {
            if (mode === 'drag') {
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (mode === 'resize') {
                container.style.width  = Math.max(250, startW + e.clientX - startX) + 'px';
                container.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            }
        };

        const onMouseUp = () => { mode = null; removeOverlay(); };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            mode = 'drag';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top;
            e.preventDefault();
            showOverlay('move');
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            mode = 'resize';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startW = r.width; startH = r.height;
            e.preventDefault();
            e.stopPropagation();
            showOverlay('se-resize');
        });

        win.document.addEventListener('mousemove', onMouseMove);
        win.document.addEventListener('mouseup',   onMouseUp);

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;
    }

    // ─── Close ────────────────────────────────────────────────────────────────

    closeVaporNote() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null;
            this._globalUpHandler   = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._dragOverlay) {
            this._dragOverlay.remove();
            this._dragOverlay = null;
        }
        if (this.floatingContainer) {
            this.floatingContainer.remove();
            this.floatingContainer = null;
        }
        if (this.floatingLeaf) {
            this._allowDetach = true;
            this.floatingLeaf.detach();
            this.floatingLeaf = null;
            this._allowDetach = false;
        }

        // Restore the real setActiveLeaf BEFORE using it to reactivate the
        // previous background leaf — otherwise the interceptor would swallow it.
        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        // Put the workspace back exactly where the user left it.
        if (this._prevActiveLeaf) {
            try {
                const ws = this.app.workspace;
                // Only programmatically restore focus if the floating leaf is the currently active focus target
                if (ws.activeLeaf === this.floatingLeaf || !ws.activeLeaf) {
                    this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false });
                }
            } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;

        new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;
```
## V6 (Stable)
- If i switch to a different window, the VaporNote follows me there
- Fixed it so that when you close it, it doesn't jump to the note you had open
- Makes it work on multiple windows
- Fixed issue where you couldn't drag it around
- Changed property so that you can open it and close it with the command "Toggle VaporNote"
```javascript
const { Plugin, Modal, Setting, Notice } = require('obsidian');

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
            .setDesc("Path relative to vault root (e.g. VaporNote.md or Notes/VaporNote.md)")
            .addText((text) => {
                text.setValue(this.value);
                text.onChange((val) => { this.value = val; });
                text.inputEl.style.width = "100%";
                text.inputEl.focus();
                text.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") { this.onSubmit(this.value); this.close(); }
                });
            });
        new Setting(contentEl)
            .addButton((btn) => {
                btn.setButtonText("Confirm").setCta().onClick(() => {
                    this.onSubmit(this.value);
                    this.close();
                });
            });
    }

    onClose() { this.contentEl.empty(); }
}


class VaporNotePlugin extends Plugin {
    async onload() {
        this.floatingLeaf       = null;
        this.floatingContainer  = null;
        this.savedFilePath      = null;   // null until user picks a file once
        this._prevActiveLeaf    = null;   // background leaf active before we opened
        this._origSetActiveLeaf = null;   // real setActiveLeaf, intercepted for float lifetime
        this._targetWin         = null;   // window context where the float is currently attached
        this._globalMoveHandler = null;
        this._globalUpHandler   = null;
        this._resizeObserver    = null;
        this._focusinHandler    = null;
        this._dragOverlay       = null;
        this._allowDetach       = false;

        this.addCommand({
            id: 'toggle-vapornote',
            name: 'Toggle VaporNote',
            callback: () => this.toggleVaporNote()
        });

        this.registerEvent(
            this.app.workspace.on('layout-change', () => this._assertDOMPosition())
        );

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                // If a background leaf is activated while VaporNote is open, track it as our reference
                if (leaf && leaf !== this.floatingLeaf) {
                    this._prevActiveLeaf = leaf;

                    // Automatically follow the active leaf if it belongs to a different popout/main window
                    const leafWin = leaf.containerEl?.win;
                    if (leafWin && this._targetWin && leafWin !== this._targetWin) {
                        this._moveContainerToWindow(leafWin);
                    }
                }

                if (!this.floatingLeaf?.view) return;
                try { this.floatingLeaf.view.onShow?.(); }        catch (_) {}
                try { this.floatingLeaf.view.editor?.refresh(); } catch (_) {}
            })
        );
    }

    async onunload() {
        this._allowDetach = true;
        this.closeVaporNote();
    }

    // ─── Open-state guard ─────────────────────────────────────────────────────

    _isOpen() {
        if (!this.floatingContainer || !this._targetWin) return false;
        const doc = this.floatingContainer.doc || this._targetWin.document;
        return !!(doc && doc.body.contains(this.floatingContainer));
    }

    // ─── Toggle ───────────────────────────────────────────────────────────────

    async toggleVaporNote() {
        if (this._isOpen()) {
            this.closeVaporNote();
            return;
        }
        if (this.savedFilePath) {
            await this._openVaporNote(this.savedFilePath);
            return;
        }
        new FilePromptModal(
            this.app,
            async (path) => { if (path) await this._openVaporNote(path); },
            "VaporNote.md"
        ).open();
    }

    // ─── Open ─────────────────────────────────────────────────────────────────

    async _openVaporNote(path) {
        this.savedFilePath = path;

        let file = this.app.vault.getAbstractFileByPath(path);
        if (!file) {
            file = await this.app.vault.create(path, `# ${path.replace('.md', '')}\n\n`);
        }

        // Save what the user was on so we can restore it on close.
        this._prevActiveLeaf = this.app.workspace.activeLeaf ?? null;

        const ws = this.app.workspace;

        // Capture window/document environment of the actively focused window
        this._targetWin = activeWindow;
        const doc = activeDocument;

        // ── Phase 1: no-op stub for creation + file-open ──────────────────────
        const realSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = () => {};

        let leaf;
        try {
            leaf = ws.getLeaf(true);
            this._orphanLeafFromWorkspace(leaf);

            // Container must be in the DOM before openFile so CM6 has a real
            // layout box to measure against when it initialises.
            const container = doc.createElement('div');
            this.floatingContainer = container;
            this._styleContainer(container);
            container.appendChild(leaf.containerEl);
            Object.assign(leaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
            doc.body.appendChild(container);

            await leaf.openFile(file);

            // source:false = Live Preview (MathJax, Dataview, etc.)
            const state = leaf.getViewState();
            state.state.mode   = 'source';
            state.state.source = false;
            await leaf.setViewState(state);
        } finally {
            // Always restore even if openFile throws.
            ws.setActiveLeaf = realSetActiveLeaf;
        }

        this.floatingLeaf = leaf;

        // Prevent tab-switch from suspending the CM6 editor.
        if (leaf.view) leaf.view.onHide = () => {};

        // Prevent workspace GC from destroying the leaf.
        const origDetach = leaf.detach.bind(leaf);
        leaf.detach = () => {
            if (this._allowDetach) origDetach();
            else this._assertDOMPosition();
        };

        // ── Phase 2: permanent selective interceptor on setActiveLeaf ─────────
        this._origSetActiveLeaf = ws.setActiveLeaf.bind(ws);
        ws.setActiveLeaf = (targetLeaf, ...args) => {
            if (targetLeaf === leaf) {
                ws.activeLeaf = leaf;   // hotkeys read this; no tab walk needed
                return;
            }
            return this._origSetActiveLeaf(targetLeaf, ...args);
        };

        this._focusinHandler = () => { ws.activeLeaf = leaf; };
        this.floatingContainer.addEventListener('focusin', this._focusinHandler);

        this._buildChrome(file.name, this.floatingContainer);

        this._resizeObserver = new ResizeObserver(() => {
            try { this.floatingLeaf?.view?.onResize?.(); }        catch (_) {}
            try { this.floatingLeaf?.view?.editor?.refresh(); }   catch (_) {}
        });
        this._resizeObserver.observe(this.floatingContainer);

        leaf.containerEl.focus();
        new Notice("VaporNote popped in.");
    }

    // ─── Orphan leaf (remove from workspace tab group, keep parent ref) ───────

    _orphanLeafFromWorkspace(leaf) {
        try {
            const parent = leaf.parent;
            if (parent && Array.isArray(parent.children)) {
                const idx = parent.children.indexOf(leaf);
                if (idx !== -1) parent.children.splice(idx, 1);
            }
            if (leaf.containerEl.parentElement) leaf.containerEl.remove();
        } catch (e) {
            console.warn('VaporNote: _orphanLeafFromWorkspace failed', e);
        }
    }

    // ─── DOM Migration Engine (Follow User Across Windows) ────────────────────

    _moveContainerToWindow(newWin) {
        if (!this.floatingContainer || !this._targetWin || !newWin || this._targetWin === newWin) return;

        // 1. Unbind mouse move/up listeners from old window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 2. Remove container from old window’s body
        try {
            if (this.floatingContainer.parentElement) {
                this.floatingContainer.remove();
            }
        } catch (_) {}

        // 3. Re-assign the target window pointer
        this._targetWin = newWin;

        // 4. Mount container to the new window’s body
        const doc = newWin.document;
        doc.body.appendChild(this.floatingContainer);

        // 5. Re-bind mouse move/up listeners to the new window document
        if (this._globalMoveHandler) {
            try {
                this._targetWin.document.addEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.addEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
        }

        // 6. Force-assert position and focus metrics
        this._assertDOMPosition();

        // 7. Force CodeMirror 6 context measurement to redraw nicely in the new document split
        try { this.floatingLeaf?.view?.onShow?.(); }        catch (_) {}
        try { this.floatingLeaf?.view?.editor?.refresh(); } catch (_) {}
    }

    // ─── DOM guard ────────────────────────────────────────────────────────────

    _assertDOMPosition() {
        if (!this.floatingContainer || !this.floatingLeaf || !this._targetWin) return;
        
        // Handle window closure gracefully
        if (this._targetWin.closed) {
            this.closeVaporNote();
            return;
        }

        const doc = this._targetWin.document;
        if (!doc.body.contains(this.floatingContainer))
            doc.body.appendChild(this.floatingContainer);
        if (!this.floatingContainer.contains(this.floatingLeaf.containerEl)) {
            this.floatingContainer.appendChild(this.floatingLeaf.containerEl);
            Object.assign(this.floatingLeaf.containerEl.style, {
                flex: '1', minHeight: '0', overflow: 'hidden'
            });
        }
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    _styleContainer(el) {
        Object.assign(el.style, {
            position:      'fixed',
            top:           '100px',
            right:         '50px',
            width:         '380px',
            height:        '500px',
            zIndex:        '200000',
            background:    'var(--background-primary)',
            border:        '1px solid var(--border-color)',
            borderRadius:  '8px',
            boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
            overflow:      'hidden',
            minWidth:      '250px',
            minHeight:     '200px',
            display:       'flex',
            flexDirection: 'column',
        });
    }

    // ─── Drag bar + resize handle ─────────────────────────────────────────────

    _buildChrome(fileName, container) {
        const doc = container.doc || activeDocument;
        const win = container.win || activeWindow;

        const dragBar = doc.createElement('div');
        dragBar.style.cssText = `
            background: var(--background-secondary);
            padding: 8px 12px;
            cursor: move;
            font-size: 11px;
            font-weight: bold;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            flex-shrink: 0;
        `;
        dragBar.textContent = `VaporNote: ${fileName}`;

        const closeBtn = doc.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer; padding:0 4px;';
        closeBtn.addEventListener('click', () => this.closeVaporNote());
        dragBar.appendChild(closeBtn);
        container.prepend(dragBar);

        const resizeHandle = doc.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0; bottom: 0;
            width: 18px; height: 18px;
            cursor: se-resize;
            z-index: 10;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 3px;
            box-sizing: border-box;
        `;
        resizeHandle.innerHTML = `
            <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"
                 style="opacity:0.45;pointer-events:none;">
                <line x1="1" y1="8" x2="8" y2="1" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="4" y1="8" x2="8" y2="4" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="7" y1="8" x2="8" y2="7" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;
        container.appendChild(resizeHandle);

        let mode = null;
        let startX, startY, startLeft, startTop, startW, startH;

        const showOverlay = (cursor) => {
            if (this._dragOverlay) return;
            const ov = doc.createElement('div');
            ov.style.cssText = `
                position: fixed; inset: 0;
                z-index: 999999;
                background: transparent;
                cursor: ${cursor};
            `;
            doc.body.appendChild(ov);
            this._dragOverlay = ov;
        };
        const removeOverlay = () => {
            if (this._dragOverlay) { this._dragOverlay.remove(); this._dragOverlay = null; }
        };

        const onMouseMove = (e) => {
            if (mode === 'drag') {
                container.style.left  = (startLeft + e.clientX - startX) + 'px';
                container.style.top   = (startTop  + e.clientY - startY) + 'px';
                container.style.right = 'auto';
            } else if (mode === 'resize') {
                container.style.width  = Math.max(250, startW + e.clientX - startX) + 'px';
                container.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            }
        };

        const onMouseUp = () => { mode = null; removeOverlay(); };

        dragBar.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            mode = 'drag';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startLeft = r.left; startTop = r.top;
            e.preventDefault();
            showOverlay('move');
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            mode = 'resize';
            startX = e.clientX; startY = e.clientY;
            const r = container.getBoundingClientRect();
            startW = r.width; startH = r.height;
            e.preventDefault();
            e.stopPropagation();
            showOverlay('se-resize');
        });

        win.document.addEventListener('mousemove', onMouseMove);
        win.document.addEventListener('mouseup',   onMouseUp);

        this._globalMoveHandler = onMouseMove;
        this._globalUpHandler   = onMouseUp;
    }

    // ─── Close ────────────────────────────────────────────────────────────────

    closeVaporNote() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        if (this._globalMoveHandler && this._targetWin) {
            try {
                this._targetWin.document.removeEventListener('mousemove', this._globalMoveHandler);
                this._targetWin.document.removeEventListener('mouseup',   this._globalUpHandler);
            } catch (_) {}
            this._globalMoveHandler = null;
            this._globalUpHandler   = null;
        }
        if (this._focusinHandler && this.floatingContainer) {
            this.floatingContainer.removeEventListener('focusin', this._focusinHandler);
            this._focusinHandler = null;
        }
        if (this._dragOverlay) {
            this._dragOverlay.remove();
            this._dragOverlay = null;
        }
        if (this.floatingContainer) {
            this.floatingContainer.remove();
            this.floatingContainer = null;
        }
        if (this.floatingLeaf) {
            this._allowDetach = true;
            this.floatingLeaf.detach();
            this.floatingLeaf = null;
            this._allowDetach = false;
        }

        // Restore the real setActiveLeaf BEFORE using it to reactivate the
        // previous background leaf — otherwise the interceptor would swallow it.
        if (this._origSetActiveLeaf) {
            this.app.workspace.setActiveLeaf = this._origSetActiveLeaf;
            this._origSetActiveLeaf = null;
        }

        // Put the workspace back exactly where the user left it.
        if (this._prevActiveLeaf) {
            try {
                const ws = this.app.workspace;
                // Only programmatically restore focus if the floating leaf is the currently active focus target
                if (ws.activeLeaf === this.floatingLeaf || !ws.activeLeaf) {
                    this.app.workspace.setActiveLeaf(this._prevActiveLeaf, { focus: false });
                }
            } catch (_) {}
            this._prevActiveLeaf = null;
        }

        this._targetWin = null;

        new Notice("VaporNote closed.");
    }
}

module.exports = VaporNotePlugin;
```