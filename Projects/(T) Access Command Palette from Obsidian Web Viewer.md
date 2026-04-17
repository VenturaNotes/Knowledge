---
title: (T) Access Command Palette from Obsidian Web Viewer
status: done
priority: "2"
dateCreated: 2026-04-16T01:39:32.874-04:00
dateModified: 2026-04-17T05:25:38.430-04:00
reminders:
  - id: rem_1776317959404_ucpsuxt8w
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-04-17
---
## Conversation
- [AI Google Studio](https://aistudio.google.com/prompts/16nz5sza7s9TU1n_K_kwN_jXIO37-Kk3n)

## Plugin Strategy 
- Just turn on and off the plugin to make it work
### Version 2
```json
const { Plugin, Notice } = require('obsidian');

module.exports = class HotkeyFixPlugin extends Plugin {
    _patchedWebviews = new WeakSet();
    _originalExecuteCommand = null;
    _recentlyFired = new Set();

    async onload() {
        new Notice("Hotkey Fix: Global Interceptor Active");

        // 1. THE GLOBAL DEBOUNCE (The "Nuclear Option")
        // This stops Obsidian from running the same command twice in 50ms
        this._originalExecuteCommand = this.app.commands.executeCommand;
        const self = this;

        this.app.commands.executeCommand = function(command) {
            const id = command?.id;
            if (id) {
                if (self._recentlyFired.has(id)) return false; 
                self._recentlyFired.add(id);
                setTimeout(() => self._recentlyFired.delete(id), 70); 
            }
            return self._originalExecuteCommand.apply(this, arguments);
        };

        this.app.workspace.onLayoutReady(() => {
            this.patchAll();

            // Watch for UI changes
            this.registerEvent(this.app.workspace.on('layout-change', () => this.patchAll()));
            this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.patchAll()));
            
            // Activate pane on click
            this.registerDomEvent(document.body, 'mousedown', (evt) => {
                const wv = evt.target.closest('webview');
                if (wv) this.activateLeaf(wv);
            }, true);
        });
    }

    onunload() {
        // Restore the original Obsidian function when plugin is disabled
        if (this._originalExecuteCommand) {
            this.app.commands.executeCommand = this._originalExecuteCommand;
        }
    }

    getHotkeyMap() {
        const map = new Map();
        const hkm = this.app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const [id, cmd] of Object.entries(this.app.commands.commands)) {
            const keys = (hkm.customKeys && hkm.customKeys[id]) ? hkm.customKeys[id] : (cmd.hotkeys || []);
            for (const hk of keys) {
                const parts = [];
                const mods = hk.modifiers || [];
                if (mods.includes('Mod')) parts.push(isMac ? 'meta' : 'ctrl');
                if (mods.includes('Ctrl')) parts.push('ctrl');
                if (mods.includes('Meta')) parts.push('meta');
                if (mods.includes('Shift')) parts.push('shift');
                if (mods.includes('Alt')) parts.push('alt');
                
                let key = (hk.key || '').toLowerCase();
                if (key === 'space') key = ' ';
                
                const combo = [...new Set(parts)].sort().join('+') + ':' + key;
                map.set(combo, id);
            }
        }
        return map;
    }

    activateLeaf(wv) {
        let targetLeaf = null;
        this.app.workspace.iterateAllLeaves(leaf => {
            if (leaf.view?.containerEl?.contains(wv)) targetLeaf = leaf;
        });

        if (targetLeaf && this.app.workspace.activeLeaf !== targetLeaf) {
            this.app.workspace.setActiveLeaf(targetLeaf, { focus: false });
            new Notice(`Pane Active: ${targetLeaf.view.getDisplayText()}`, 500);
        }
    }

    patchAll() {
        const WEBVIEW_SELECTOR = 'webview, .external-link-view webview, .webviewer-content webview';
        document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
            if (!this._patchedWebviews.has(wv)) this.patch(wv);
        });
    }

    patch(wv) {
        if (!wv || !wv.isConnected) return;
        this._patchedWebviews.add(wv);

        const injectorScript = `
            (function() {
                if (window._obsHotkeysActive) return;
                window._obsHotkeysActive = true;
                
                window.addEventListener('mousedown', () => console.log('OBS_ACTIVATE'), true);
                
                window.addEventListener('keydown', (e) => {
                    const parts = [];
                    if (e.ctrlKey) parts.push('ctrl');
                    if (e.metaKey) parts.push('meta');
                    if (e.shiftKey) parts.push('shift');
                    if (e.altKey) parts.push('alt');
                    
                    const isFKey = /^f\\d+/.test(e.key.toLowerCase());
                    if (parts.length === 0 && !isFKey) return;

                    let key = (e.key || '').toLowerCase();
                    if (key === ' ') key = ' '; 
                    
                    const combo = parts.sort().join('+') + ':' + key;
                    console.log('OBS_RAW_KEY:' + combo);
                }, true);
            })();
        `;

        wv.addEventListener('console-message', (e) => {
            if (!wv.isConnected) return;

            if (e.message === 'OBS_ACTIVATE') {
                this.activateLeaf(wv);
                return;
            }

            if (e.message?.startsWith('OBS_RAW_KEY:')) {
                const combo = e.message.split('OBS_RAW_KEY:')[1];
                const commandId = this.getHotkeyMap().get(combo);

                if (commandId) {
                    this.activateLeaf(wv);
                    // The Global Interceptor we added in onload() will handle the de-duplication
                    this.app.commands.executeCommandById(commandId);
                }
            }
        });

        wv.addEventListener('dom-ready', () => {
            wv.executeJavaScript(injectorScript).catch(() => {});
        });
        
        wv.executeJavaScript(injectorScript).catch(() => {});
    }
};
```
### Version 1

#### manifest
```json
{
  "id": "hotkey-fix",
  "name": "Web Viewer Hotkey Fix",
  "version": "1.0.0",
  "minAppVersion": "1.0.0",
  "description": "Forwards keydown events from the built-in web viewer to Obsidian.",
  "author": "you"
}
```

#### main
```js
const { Plugin } = require('obsidian');

module.exports = class HotkeyFixPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on('layout-change', () => this.patchWebviews())
    );
    // Also patch on load in case a webview is already open
    this.app.workspace.onLayoutReady(() => this.patchWebviews());
  }

  patchWebviews() {
    document.querySelectorAll('webview').forEach(wv => {
      if (wv._hotkeyFixPatched) return;
      wv._hotkeyFixPatched = true;

      // Re-dispatch keydown events from inside the webview to the main window
      wv.addEventListener('ipc-message', evt => {
        if (evt.channel !== 'keydown') return;
        const { key, code, ctrlKey, metaKey, shiftKey, altKey } = evt.args[0];
        const synthetic = new KeyboardEvent('keydown', {
          key, code, ctrlKey, metaKey, shiftKey, altKey,
          bubbles: true, cancelable: true
        });
        document.body.dispatchEvent(synthetic);
      });

      // Inject the IPC sender into the webview's renderer process
      wv.addEventListener('dom-ready', () => {
        wv.executeJavaScript(`
          document.addEventListener('keydown', e => {
            const { key, code, ctrlKey, metaKey, shiftKey, altKey } = e;
            require('electron').ipcRenderer.sendToHost('keydown',
              { key, code, ctrlKey, metaKey, shiftKey, altKey }
            );
          }, true);
        `);
      });
    });
  }
};
```

## JavaScript QuickAdd Strategy
### Feature Requests
- Command function does not work split view in second window
- Zoom function weird in second window
- Improve security
#### Solution
##### Iteration 6
```javascript
module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) return;
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // =========================================================================
    // 1. THE DEBOUNCE (50ms)
    // =========================================================================
    const origExecute = app.commands.executeCommand;
    const recentlyFired = new Set();
    
    app.commands.executeCommand = function(command) {
        if (command && command.id) {
            if (recentlyFired.has(command.id)) return false; 
            recentlyFired.add(command.id);
            setTimeout(() => recentlyFired.delete(command.id), 50); 
        }
        return origExecute.apply(this, arguments);
    };

    // =========================================================================
    // 2. HELPERS & CACHING
    // =========================================================================
    let cachedHotkeyMap = null;

    function getHotkeyMap() {
        if (cachedHotkeyMap) return cachedHotkeyMap;

        const map = new Map();
        const hkm = app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const [id, command] of Object.entries(app.commands.commands)) {
            const keys = [...(hkm.customKeys?.[id] || []), ...(hkm.defaultKeys?.[id] || [])];
            for (const hk of keys) {
                const parts = [];
                if (hk.modifiers.includes('Mod')) parts.push(isMac ? 'meta' : 'ctrl');
                if (hk.modifiers.includes('Ctrl')) parts.push('ctrl');
                if (hk.modifiers.includes('Meta')) parts.push('meta');
                if (hk.modifiers.includes('Shift')) parts.push('shift');
                if (hk.modifiers.includes('Alt')) parts.push('alt');
                let key = (hk.key || '').toLowerCase();
                if (key === 'space') key = ' ';
                const combo = [...new Set(parts)].sort().join('+') + ':' + key;
                map.set(combo, id);
            }
        }
        cachedHotkeyMap = map;
        return map;
    }

    function getLeafForWebview(webview) {
        let foundLeaf = null;
        app.workspace.iterateAllLeaves(leaf => {
            const container = leaf.view?.containerEl || leaf.containerEl;
            // Check if this leaf's DOM contains the webview element
            if (container && container.contains(webview)) foundLeaf = leaf;
        });
        return foundLeaf;
    }

    // =========================================================================
    // 3. ATTACHMENT LOGIC
    // =========================================================================
    async function attachToWebview(webview) {
        if (!webview || !webview.isConnected || webview._hotkeysAttached) return;
        webview._hotkeysAttached = true; 

        // Helper to focus the correct window and leaf before command execution
        const focusContext = () => {
            const leaf = getLeafForWebview(webview);
            if (leaf) {
                // 1. Get the specific window object for this leaf (handles pop-outs)
                const targetWindow = leaf.view.containerEl.win; 
                if (targetWindow) targetWindow.focus();

                // 2. Set active leaf and force focus so the command knows the context
                app.workspace.setActiveLeaf(leaf, { focus: true });
            }
            return leaf;
        };

        webview.addEventListener('console-message', (e) => {
            if (!webview.isConnected) return;

            if (e.message === 'OBS_ACTIVATE') {
                focusContext();
                return;
            }

            if (e.message?.startsWith('OBS_RAW_KEY:')) {
                const combo = e.message.split('OBS_RAW_KEY:')[1];
                const hotkeys = getHotkeyMap();
                const commandId = hotkeys.get(combo);

                if (commandId && !recentlyFired.has(commandId)) {
                    focusContext();
                    // Running the command via ID now targets the newly focused leaf
                    app.commands.executeCommandById(commandId);
                }
            }
        });

        const inject = () => {
            if (!webview.isConnected) return;
            
            webview.executeJavaScript(`
                (function() {
                    if (window._obsHotkeysActive) return;
                    window._obsHotkeysActive = true;
                    
                    window.addEventListener('mousedown', () => console.log('OBS_ACTIVATE'), true);
                    
                    window.addEventListener('keydown', (e) => {
                        const parts = [];
                        if (e.ctrlKey) parts.push('ctrl');
                        if (e.metaKey) parts.push('meta');
                        if (e.shiftKey) parts.push('shift');
                        if (e.altKey) parts.push('alt');
                        
                        if (parts.length === 0) return;

                        let key = (e.key || '').toLowerCase();
                        if (key === ' ') key = 'space'; 
                        
                        const combo = parts.sort().join('+') + ':' + key;
                        console.log('OBS_RAW_KEY:' + combo);
                    }, true);
                })();
            `).catch(() => {});
        };

        webview.addEventListener('dom-ready', inject);
        try { inject(); } catch(e) {}
    }

    // =========================================================================
    // 4. THE TRIGGERS
    // =========================================================================
    const WEBVIEW_SELECTOR = 'webview, .external-link-view webview, .webviewer-content webview';
    
    const findAndAttach = () => {
        const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
        webviews.forEach(webview => {
            try {
                if (webview && webview.isConnected) attachToWebview(webview);
            } catch(e) {}
        });
    };

    app.workspace.on('layout-change', findAndAttach);
    app.workspace.on('active-leaf-change', findAndAttach);
    app.workspace.on('window-open', () => setTimeout(findAndAttach, 50));

    findAndAttach();
};
```
### Iteration 5 
- Has a glitch with external monitors where commands not made properly
```javascript
module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) return;
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // =========================================================================
    // 1. THE DEBOUNCE (50ms)
    // =========================================================================
    const origExecute = app.commands.executeCommand;
    const recentlyFired = new Set();
    
    app.commands.executeCommand = function(command) {
        if (command && command.id) {
            if (recentlyFired.has(command.id)) return false; 
            recentlyFired.add(command.id);
            setTimeout(() => recentlyFired.delete(command.id), 50); 
        }
        return origExecute.apply(this, arguments);
    };

    // =========================================================================
    // 2. HELPERS & CACHING
    // =========================================================================
    let cachedHotkeyMap = null;

    // Refresh the map once and cache it. 
    // If you change hotkeys, you'll need to restart Obsidian.
    function getHotkeyMap() {
        if (cachedHotkeyMap) return cachedHotkeyMap;

        const map = new Map();
        const hkm = app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const [id, command] of Object.entries(app.commands.commands)) {
            const keys = [...(hkm.customKeys?.[id] || []), ...(hkm.defaultKeys?.[id] || [])];
            for (const hk of keys) {
                const parts = [];
                if (hk.modifiers.includes('Mod')) parts.push(isMac ? 'meta' : 'ctrl');
                if (hk.modifiers.includes('Ctrl')) parts.push('ctrl');
                if (hk.modifiers.includes('Meta')) parts.push('meta');
                if (hk.modifiers.includes('Shift')) parts.push('shift');
                if (hk.modifiers.includes('Alt')) parts.push('alt');
                let key = (hk.key || '').toLowerCase();
                if (key === 'space') key = ' ';
                const combo = [...new Set(parts)].sort().join('+') + ':' + key;
                map.set(combo, id);
            }
        }
        cachedHotkeyMap = map;
        return map;
    }

    function getLeafForWebview(webview) {
        let foundLeaf = null;
        app.workspace.iterateAllLeaves(leaf => {
            const container = leaf.view?.containerEl || leaf.containerEl;
            if (container && container.contains(webview)) foundLeaf = leaf;
        });
        return foundLeaf;
    }

    // =========================================================================
    // 3. ATTACHMENT LOGIC
    // =========================================================================
    async function attachToWebview(webview) {
        // Safety: Don't attach to destroyed or already-attached webviews
        if (!webview || !webview.isConnected || webview._hotkeysAttached) return;
        webview._hotkeysAttached = true; 

        webview.addEventListener('console-message', (e) => {
            // Safety: If the webview was destroyed mid-communication, ignore it
            if (!webview.isConnected) return;

            if (e.message === 'OBS_ACTIVATE') {
                const leaf = getLeafForWebview(webview);
                if (leaf && app.workspace.activeLeaf !== leaf) {
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                }
                return;
            }

            if (e.message?.startsWith('OBS_RAW_KEY:')) {
                const combo = e.message.split('OBS_RAW_KEY:')[1];
                const hotkeys = getHotkeyMap();
                const commandId = hotkeys.get(combo);

                if (commandId && !recentlyFired.has(commandId)) {
                    const leaf = getLeafForWebview(webview);
                    if (leaf && app.workspace.activeLeaf !== leaf) {
                        app.workspace.setActiveLeaf(leaf, { focus: false });
                    }
                    app.commands.executeCommandById(commandId);
                }
            }
        });

        const inject = () => {
            // Safety: Ensure webview still exists and is ready
            if (!webview.isConnected) return;
            
            webview.executeJavaScript(`
                (function() {
                    if (window._obsHotkeysActive) return;
                    window._obsHotkeysActive = true;
                    
                    window.addEventListener('mousedown', () => console.log('OBS_ACTIVATE'), true);
                    
                    window.addEventListener('keydown', (e) => {
                        const parts = [];
                        if (e.ctrlKey) parts.push('ctrl');
                        if (e.metaKey) parts.push('meta');
                        if (e.shiftKey) parts.push('shift');
                        if (e.altKey) parts.push('alt');
                        
                        if (parts.length === 0) return;

                        let key = (e.key || '').toLowerCase();
                        if (key === ' ') key = 'space'; 
                        
                        const combo = parts.sort().join('+') + ':' + key;
                        
                        // We send the RAW combo to the host.
                        // The host checks the hotkey map, keeping your plugins secret.
                        console.log('OBS_RAW_KEY:' + combo);
                    }, true);
                })();
            `).catch(() => { /* Silence errors from destroyed/busy webviews */ });
        };

        // Only inject when the webview is actually ready to receive JS
        webview.addEventListener('dom-ready', inject);
        
        // If it's already loaded, try to inject, but catch the error if it's not ready
        try { inject(); } catch(e) {}
    }

    // =========================================================================
    // 4. THE TRIGGERS
    // =========================================================================
    const WEBVIEW_SELECTOR = 'webview, .external-link-view webview, .webviewer-content webview';
    
    const findAndAttach = () => {
        const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
        webviews.forEach(webview => {
            // Add a small safety check to ensure the object isn't dead
            try {
                if (webview && webview.isConnected) attachToWebview(webview);
            } catch(e) {}
        });
    };

    app.workspace.on('layout-change', findAndAttach);
    app.workspace.on('active-leaf-change', findAndAttach);
    app.workspace.on('window-open', () => setTimeout(findAndAttach, 50));

    findAndAttach();
};
```

### Iteration 4
```javascript
module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) return;
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // =========================================================================
    // 1. THE DEBOUNCE (100ms)
    // Prevents double-firing commands when shortcuts leak from webview to host.
    // =========================================================================
    const origExecute = app.commands.executeCommand;
    const recentlyFired = new Set();
    
    app.commands.executeCommand = function(command) {
        if (command && command.id) {
            if (recentlyFired.has(command.id)) return false; 
            recentlyFired.add(command.id);
            setTimeout(() => recentlyFired.delete(command.id), 50); 
        }
        return origExecute.apply(this, arguments);
    };

    // =========================================================================
    // 2. HELPERS & CACHING
    // =========================================================================
    let cachedHotkeyMap = null;

    function getLeafForWebview(webview) {
        let foundLeaf = null;
        app.workspace.iterateAllLeaves(leaf => {
            const container = leaf.view?.containerEl || leaf.containerEl;
            if (container && container.contains(webview)) foundLeaf = leaf;
        });
        return foundLeaf;
    }

    function getHotkeyMap() {
        if (cachedHotkeyMap) return cachedHotkeyMap;
        const map = new Map();
        const hkm = app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const [id, command] of Object.entries(app.commands.commands)) {
            const keys = [...(hkm.customKeys?.[id] || []), ...(hkm.defaultKeys?.[id] || [])];
            for (const hk of keys) {
                const parts = [];
                if (hk.modifiers.includes('Mod')) parts.push(isMac ? 'meta' : 'ctrl');
                if (hk.modifiers.includes('Ctrl')) parts.push('ctrl');
                if (hk.modifiers.includes('Meta')) parts.push('meta');
                if (hk.modifiers.includes('Shift')) parts.push('shift');
                if (hk.modifiers.includes('Alt')) parts.push('alt');
                let key = (hk.key || '').toLowerCase();
                if (key === 'space') key = ' ';
                const combo = [...new Set(parts)].sort().join('+') + ':' + key;
                map.set(combo, id);
            }
        }
        cachedHotkeyMap = map;
        return map;
    }

    // =========================================================================
    // 3. ATTACHMENT LOGIC
    // =========================================================================
    async function attachToWebview(webview) {
        if (!webview || webview._hotkeysAttached) return;
        webview._hotkeysAttached = true; 

        webview.addEventListener('console-message', (e) => {
            // Sync Active Tab on Click
            if (e.message === 'OBS_ACTIVATE') {
                const leaf = getLeafForWebview(webview);
                if (leaf && app.workspace.activeLeaf !== leaf) {
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                }
                return;
            }

            // Handle Keydown relay
            if (e.message?.startsWith('OBS_KEY:')) {
                const commandId = e.message.split('OBS_KEY:')[1];
                if (commandId && !recentlyFired.has(commandId)) {
                    const leaf = getLeafForWebview(webview);
                    if (leaf && app.workspace.activeLeaf !== leaf) {
                        app.workspace.setActiveLeaf(leaf, { focus: false });
                    }
                    app.commands.executeCommandById(commandId);
                }
            }
        });

        const inject = () => {
            const hotkeys = getHotkeyMap();
            webview.executeJavaScript(`
                (function() {
                    if (window._obsHotkeysActive) return;
                    window._obsHotkeysActive = true;
                    
                    window.addEventListener('mousedown', () => console.log('OBS_ACTIVATE'), true);
                    
                    const map = ${JSON.stringify(Object.fromEntries(hotkeys))};
                    window.addEventListener('keydown', (e) => {
                        const parts = [];
                        if (e.ctrlKey) parts.push('ctrl');
                        if (e.metaKey) parts.push('meta');
                        if (e.shiftKey) parts.push('shift');
                        if (e.altKey) parts.push('alt');
                        const combo = parts.sort().join('+') + ':' + (e.key || '').toLowerCase();
                        const commandId = map[combo === ' : ' ? ' :space' : combo];
                        
                        if (commandId) {
                            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                            console.log('OBS_KEY:' + commandId);
                        }
                    }, true);
                })();
            `).catch(() => {});
        };

        webview.addEventListener('dom-ready', inject);
        inject();
    }

    // =========================================================================
    // 4. THE TRIGGERS (NATIVE ONLY)
    // No MutationObserver. We only check when Obsidian says the UI changed.
    // =========================================================================
    const WEBVIEW_SELECTOR = 'webview, .external-link-view webview, .webviewer-content webview';
    
    const findAndAttach = () => {
        const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
        if (webviews.length > 0) {
            webviews.forEach(attachToWebview);
        }
    };

    // Trigger on tab switches, splits, and layout adjustments
    app.workspace.on('layout-change', findAndAttach);
    app.workspace.on('active-leaf-change', findAndAttach);
    
    // Trigger when a new window is opened (for multi-window users)
    app.workspace.on('window-open', (win) => {
        // Give the window a moment to initialize its DOM
        setTimeout(findAndAttach, 50);
    });

    // Run once on startup
    findAndAttach();
};
```
### Iteration 3
- Now just speed up shortcuts again
```javascript
module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) return;
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // =========================================================================
    // 1. THE ULTIMATE DEBOUNCE
    // Prevents overlapping modals like Quick Switcher or Search.
    // =========================================================================
    const origExecute = app.commands.executeCommand;
    const recentlyFired = new Set();
    
    app.commands.executeCommand = function(command) {
        if (command && command.id) {
            if (recentlyFired.has(command.id)) return false; 
            recentlyFired.add(command.id);
            setTimeout(() => recentlyFired.delete(command.id), 50); 
        }
        return origExecute.apply(this, arguments);
    };

    // =========================================================================
    // 2. HELPER: Find the exact Obsidian Tab (Leaf) that owns a webview
    // =========================================================================
    function getLeafForWebview(webview) {
        let foundLeaf = null;
        app.workspace.iterateAllLeaves(leaf => {
            const container = leaf.view?.containerEl || leaf.containerEl;
            if (container && container.contains(webview)) {
                foundLeaf = leaf;
            }
        });
        return foundLeaf;
    }

    // =========================================================================
    // 3. Build the Hotkey Map
    // =========================================================================
    function getHotkeyMap() {
        const map = new Map();
        const hkm = app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const[id, command] of Object.entries(app.commands.commands)) {
            const keys =[
                ...(hkm.customKeys?.[id] ||[]), 
                ...(hkm.defaultKeys?.[id] ||[])
            ];
            
            for (const hk of keys) {
                const parts =[];
                if (hk.modifiers.includes('Mod')) parts.push(isMac ? 'meta' : 'ctrl');
                if (hk.modifiers.includes('Ctrl')) parts.push('ctrl');
                if (hk.modifiers.includes('Meta')) parts.push('meta');
                if (hk.modifiers.includes('Shift')) parts.push('shift');
                if (hk.modifiers.includes('Alt')) parts.push('alt');
                
                let key = (hk.key || '').toLowerCase();
                if (key === 'space') key = ' ';
                
                const combo =[...new Set(parts)].sort().join('+') + ':' + key;
                map.set(combo, id);
            }
        }
        return map;
    }

    // =========================================================================
    // 4. Guest Webview Injection & Syncing
    // =========================================================================
    async function attachToWebview(webview) {
        if (!webview || webview._hotkeysAttached) return;

        // Listen for messages relayed from inside the webview
        webview.addEventListener('console-message', (e) => {
            
            // 1. User clicked inside the webpage. Update Active Tab!
            if (e.message === 'OBS_ACTIVATE') {
                const leaf = getLeafForWebview(webview);
                if (leaf && app.workspace.activeLeaf !== leaf) {
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                }
                return;
            }

            // 2. User pressed an Obsidian Hotkey.
            if (e.message?.startsWith('OBS_KEY:')) {
                const commandId = e.message.split('OBS_KEY:')[1];
                if (commandId) {
                    // FIX: If the OS/Electron natively caught this shortcut (like Cmd+T) 
                    // a millisecond ago, it will already be in recentlyFired. 
                    // We MUST abort immediately so we don't yank focus back to the old tab!
                    if (recentlyFired.has(commandId)) return;

                    const leaf = getLeafForWebview(webview);
                    // Guarantee this tab is set as active right before executing
                    if (leaf && app.workspace.activeLeaf !== leaf) {
                        app.workspace.setActiveLeaf(leaf, { focus: false });
                    }
                    app.commands.executeCommandById(commandId);
                }
            }
        });

        const inject = () => {
            const currentHotkeys = getHotkeyMap();
            const guestScript = `
            (function() {
                if (window._obsHotkeysActive) return;
                window._obsHotkeysActive = true;
                
                // Track mouse clicks to tell Obsidian to make this tab active
                window.addEventListener('mousedown', () => {
                    console.log('OBS_ACTIVATE');
                }, true);
                
                const map = ${JSON.stringify(Object.fromEntries(currentHotkeys))};
                
                window.addEventListener('keydown', (e) => {
                    const parts =[];
                    if (e.ctrlKey) parts.push('ctrl');
                    if (e.metaKey) parts.push('meta');
                    if (e.shiftKey) parts.push('shift');
                    if (e.altKey) parts.push('alt');
                    
                    let key = (e.key || '').toLowerCase();
                    if (key === 'space') key = ' ';
                    
                    const combo = parts.sort().join('+') + ':' + key;
                    const commandId = map[combo];

                    // If it's a known Obsidian hotkey, kill it inside the webpage and notify host
                    if (commandId) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        console.log('OBS_KEY:' + commandId);
                    }
                }, true);
            })();`;

            webview.executeJavaScript(guestScript).catch(() => {});
        };

        // Inject script when webview navigates
        webview.addEventListener('dom-ready', inject);
        webview._hotkeysAttached = true;
        inject();
    }

    // =========================================================================
    // 5. Catch new webviews automatically
    // =========================================================================
    const WEBVIEW_SELECTOR = 'webview, .external-link-view webview, .webviewer-content webview';
    
    const attachAll = () => {
        document.querySelectorAll(WEBVIEW_SELECTOR).forEach(attachToWebview);
    };

    const observer = new MutationObserver(attachAll);
    observer.observe(document.body, { childList: true, subtree: true });
    app.workspace.on('layout-change', attachAll);
    attachAll();
};
```

### Iteration 2
```js
module.exports = async (params) => {
    // Prevent multiple initializations if QuickAdd runs this twice
    if (window.__WEBVIEW_SHORTCUTS_INIT) return;
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // =========================================================================
    // 1. THE ULTIMATE DEBOUNCE: Patch app.commands.executeCommand
    // Obsidian's native hotkey manager calls `executeCommand` directly. 
    // By patching this, NO command can execute twice within 500ms, 
    // completely eliminating overlapping modals from community plugins.
    // =========================================================================
    const origExecute = app.commands.executeCommand;
    const recentlyFired = new Set();
    
    app.commands.executeCommand = function(command) {
        if (command && command.id) {
            // If we already fired this command in the last 500ms, destroy this request
            if (recentlyFired.has(command.id)) {
                return false; 
            }
            
            // Lock this command out for 500ms
            recentlyFired.add(command.id);
            setTimeout(() => recentlyFired.delete(command.id), 500); 
        }
        
        // Proceed with actual execution
        return origExecute.apply(this, arguments);
    };

    // =========================================================================
    // 2. Build the Hotkey Map
    // =========================================================================
    function getHotkeyMap() {
        const map = new Map();
        const hkm = app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const [id, command] of Object.entries(app.commands.commands)) {
            const keys = [
                ...(hkm.customKeys?.[id] ||[]), 
                ...(hkm.defaultKeys?.[id] ||[])
            ];
            
            for (const hk of keys) {
                const parts =[];
                if (hk.modifiers.includes('Mod')) parts.push(isMac ? 'meta' : 'ctrl');
                if (hk.modifiers.includes('Ctrl')) parts.push('ctrl');
                if (hk.modifiers.includes('Meta')) parts.push('meta');
                if (hk.modifiers.includes('Shift')) parts.push('shift');
                if (hk.modifiers.includes('Alt')) parts.push('alt');
                
                let key = (hk.key || '').toLowerCase();
                if (key === 'space') key = ' ';
                
                const combo = [...new Set(parts)].sort().join('+') + ':' + key;
                map.set(combo, id);
            }
        }
        return map;
    }

    // =========================================================================
    // 3. Guest Webview Injection
    // Forces websites that eat keystrokes (like Google Docs/Notion) to obey Obsidian
    // =========================================================================
    async function attachToWebview(webview) {
        if (!webview || webview._hotkeysAttached) return;

        // Listen for keys caught inside the webview
        webview.addEventListener('console-message', (e) => {
            if (e.message?.startsWith('OBS_KEY:')) {
                const commandId = e.message.split('OBS_KEY:')[1];
                if (commandId) {
                    // Drop focus from the webview so the newly opening modal 
                    // (like Quick Switcher) can immediately accept keyboard typing
                    if (document.activeElement === webview) {
                        webview.blur();
                    }
                    app.commands.executeCommandById(commandId);
                }
            }
        });

        const inject = () => {
            const currentHotkeys = getHotkeyMap();
            const guestScript = `
            (function() {
                if (window._obsHotkeysActive) return;
                window._obsHotkeysActive = true;
                
                const map = ${JSON.stringify(Object.fromEntries(currentHotkeys))};
                
                window.addEventListener('keydown', (e) => {
                    const parts =[];
                    if (e.ctrlKey) parts.push('ctrl');
                    if (e.metaKey) parts.push('meta');
                    if (e.shiftKey) parts.push('shift');
                    if (e.altKey) parts.push('alt');
                    
                    let key = (e.key || '').toLowerCase();
                    if (key === 'space') key = ' ';
                    
                    const combo = parts.sort().join('+') + ':' + key;
                    const commandId = map[combo];

                    // If it's a known Obsidian hotkey, kill it inside the webpage and notify host
                    if (commandId) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('OBS_KEY:' + commandId);
                    }
                }, true);
            })();`;

            webview.executeJavaScript(guestScript).catch(() => {});
        };

        // Inject script when webview navigates
        webview.addEventListener('dom-ready', inject);
        webview._hotkeysAttached = true;
        inject();
    }

    // =========================================================================
    // 4. Catch new webviews automatically
    // =========================================================================
    const WEBVIEW_SELECTOR = 'webview, .external-link-view webview, .webviewer-content webview';
    
    const attachAll = () => {
        document.querySelectorAll(WEBVIEW_SELECTOR).forEach(attachToWebview);
    };

    const observer = new MutationObserver(attachAll);
    observer.observe(document.body, { childList: true, subtree: true });
    app.workspace.on('layout-change', attachAll);
    attachAll();
};
```

### Iteration 1
```javascript
module.exports = async (params) => {
    if (window.__HOTKEY_OBSERVER_SET) return;

    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview, webview';

    function buildHotkeyMap() {
        const map = new Map();
        const hkm = app.hotkeyManager;
        const isMac = navigator.platform.toUpperCase().includes('MAC');

        for (const commandId of Object.keys(app.commands.commands)) {
            const keys = [
                ...((hkm.customKeys?.[commandId])  ||[]),
                ...((hkm.defaultKeys?.[commandId]) ||[]),
            ];
            for (const hk of keys) {
                const mods = hk.modifiers ||[];
                let key  = (hk.key || '').toLowerCase();
                if (!key) continue;
                
                // Obsidian natively calls it "space", but the browser keystroke calls it " "
                if (key === 'space') key = ' '; 

                const parts =[];
                if (mods.includes('Mod'))   parts.push(isMac ? 'Meta' : 'Control');
                if (mods.includes('Ctrl'))  parts.push('Control');
                if (mods.includes('Shift')) parts.push('Shift');
                if (mods.includes('Alt'))   parts.push('Alt');
                parts.push(key);
                map.set(parts.join('+'), commandId);
            }
        }
        return map;
    }

    const hotkeyMap = buildHotkeyMap();
    const knownCombos = JSON.stringify([...hotkeyMap.keys()]);

    async function attachHotkeyListener(webview) {
        if (!webview || typeof webview.executeJavaScript !== 'function' || webview._hotkeysAttached) return;

        webview.addEventListener('console-message', (e) => {
            if (!e.message?.startsWith('OBS_KEY:')) return;
            try {
                // Instantly blur the webview to return keyboard focus context to Obsidian 
                // so visual menus (like the Command Palette) render correctly.
                document.activeElement?.blur(); 
                
                const { key, metaKey, ctrlKey, shiftKey, altKey } = JSON.parse(e.message.slice(8));
                const parts =[];
                if (metaKey)  parts.push('Meta');
                if (ctrlKey)  parts.push('Control');
                if (shiftKey) parts.push('Shift');
                if (altKey)   parts.push('Alt');
                parts.push(key.toLowerCase());
                
                const commandId = hotkeyMap.get(parts.join('+'));
                if (commandId) app.commands.executeCommandById(commandId);
            } catch (_) {}
        });

        const guestScript = `
        (function() {
            if (window._obsidianHotkeysInjected) return;
            const known = new Set(${knownCombos});
            
            window.addEventListener('keydown', function(e) {
                // Ignore keys without modifiers so normal typing works
                if (!e.metaKey && !e.ctrlKey && !e.altKey) return;
                
                const parts =[];
                if (e.metaKey)  parts.push('Meta');
                if (e.ctrlKey)  parts.push('Control');
                if (e.shiftKey) parts.push('Shift');
                if (e.altKey)   parts.push('Alt');
                parts.push(e.key.toLowerCase());
                
                const combo = parts.join('+');
                if (!known.has(combo)) return; // not an Obsidian shortcut — leave it alone
                
                e.preventDefault();
                e.stopImmediatePropagation();
                
                console.log('OBS_KEY:' + JSON.stringify({
                    key: e.key, metaKey: e.metaKey, ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey, altKey: e.altKey
                }));
            }, true);
            
            window._obsidianHotkeysInjected = true;
        })();`;

        const inject = () => webview.executeJavaScript(guestScript).catch(() => {});
        webview.addEventListener('dom-ready', inject);
        webview.addEventListener('did-navigate', inject); // full page loads only

        webview._hotkeysAttached = true;
        inject();
    }

    // THE LAG FIX: We deleted the heavy MutationObserver that was running on every keystroke.
    // Instead, we use Obsidian's native workspace events. It only scans for webviews 
    // when you actually open, close, or switch tabs! (0% CPU while typing)
    
    function findAndAttachWebviews() {
        document.querySelectorAll(WEBVIEW_SELECTOR).forEach(attachHotkeyListener);
    }

    // 1. Run it once immediately for any already-open tabs
    findAndAttachWebviews();

    // 2. Tell Obsidian to run it automatically whenever the UI layout changes
    app.workspace.on('layout-change', findAndAttachWebviews);

    window.__HOTKEY_OBSERVER_SET = true;
};
```

### Problems
- If a note has the same domain, then they both zoom in when they shouldn't
### Tests
- Split-screen
- Extended monitor
- Leetcode website
#### Ideas
- The zoom works easily in the second window (so it is the problem of the script.)
#### Notes
- When zooming in or out on a google search engine, no matter what page you're on, it will also zoom in and out for you.
	- In happens in Google Chrome as well! I think it saves you zoom view for a particular website.
## Revert
- [x] Delete shortcut for zoom function for Web Viewer ✅ 2026-04-16
## Problem
- When I press `Command + P` to open my command palette, the shortcut gets eaten up by the browser. It does not work on the website below
	- https://leetcode.com/problems/shortest-matching-substring/description/
## Requirements
- I should be able to access the command palette from web viewer
- I should also be able to zoom into any website easily (potentially be able to pinch in like you can do on chrome.)
## Potential Solutions
- 🔴 In the `Custom Frames` plugin to view the web, there is a toggle option to `Faorward hotkeys to Obsidian`
	- I don't want to use `iframes`. I want to use the native web viewer
- 🟡 Double Shift plugin. Lets you double tap the `shift` key twice to access command palette
	- It doesn't fix the zoom problem
- 🟠  macOS App Shortcuts. The macOS menu bar registers before the webview can eat the keystrokes. System Settings > Keyboard > Keyboard Shortcuts > App Shortcuts > Obsidian, and then can add shortcut?
	- Doesn't fix zoom problem 
- 🟡 Use different shortcuts like `Command + Shift + P`
	- Honestly could work, but would like a better option.
	- `Control + Command + T`
- 🔴 The "Click Out Habit" which is when you click the native Obsidian interface outside the web view
	- I would rather not do this because 
- 🔴 Global Hotkeys plugin. This ensures the hotkeys always works
	- Not a good idea. It pretty much works, but this means that even if I have a different window active and press the shortcut, it will just use the command meant for obsidian. So If I want to print a document in Google Docs for example, it would not work
	- Also it's just mapped to the qwerty layout and not the Dvorak layout. So I would need to use `R` to use `P` in Dvorak.
## Brainstorm
- I still might consider macOS app shortcuts, but it just depends how involved it would be for me to interact with the Web Viewer interface. 
