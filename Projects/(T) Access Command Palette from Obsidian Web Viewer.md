---
title: (T) Access Command Palette from Obsidian Web Viewer
status: done
priority: "0"
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
## Conversations
- [AI Google Studio](https://aistudio.google.com/prompts/16nz5sza7s9TU1n_K_kwN_jXIO37-Kk3n)
- [AI Google Studio](https://aistudio.google.com/prompts/10PDojjH29gt-7m_To6afozWeh3OrOtOD)
## Solution: JavaScript QuickAdd Strategy
```javascript
/**
 * WebviewCommands.js
 * Version: 2.2 - Modal Focus & Multi-Monitor Logic
 */

module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) return;
    window.__WEBVIEW_SHORTCUTS_INIT = true;
    //console.log("%c Webview Shortcuts: System Active ", "background: #1e1e2e; color: #cba6f7; font-weight: bold; border: 1px solid #cba6f7; padding: 2px 5px;");

    // =========================================================================
    // 1. THE COMMAND SHIELD (Per-Command Debounce)
    // =========================================================================
    const lastFired = new Map();
    const origExecute = app.commands.executeCommand;
    
    app.commands.executeCommand = function(command) {
        const id = command?.id || arguments[0]?.id || (typeof arguments[0] === 'string' ? arguments[0] : null);
        
        if (id) {
            const now = performance.now();
            const lastTime = lastFired.get(id) || 0;
            
            if (now - lastTime < 50) {
                // console.log(`Shield: Blocked duplicate [${id}]`);
                return false; 
            }
            lastFired.set(id, now);
        }
        return origExecute.apply(this, arguments);
    };

    // =========================================================================
    // 2. DYNAMIC HOTKEY MAPPING
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
        setTimeout(() => { cachedHotkeyMap = null; }, 5000); 
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
    // 3. ATTACHMENT & MODAL FOCUS SYNC
    // =========================================================================
    async function attachToWebview(webview) {
        if (!webview || !webview.isConnected || webview._hotkeysAttached) return;
        webview._hotkeysAttached = true; 

        webview.addEventListener('console-message', (e) => {
            const leaf = getLeafForWebview(webview);
            if (!leaf) return;

            // SYNC ON CLICK (Multi-Monitor / Full Screen Fix)
            if (e.message === 'OBS_ACTIVATE') {
                const targetWindow = leaf.view.containerEl.win;
                if (app.workspace.activeLeaf !== leaf || window.activeWindow !== targetWindow) {
                    //console.log("Focus: Syncing Context");
                    if (window.activeWindow !== targetWindow) targetWindow.focus();
                    // focus: false keeps cursor in Google/LeetCode
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                }
                return;
            }

            // HOTKEY EXECUTION
            if (e.message?.startsWith('OBS_RAW_KEY:')) {
                const combo = e.message.split('OBS_RAW_KEY:')[1];
                const commandId = getHotkeyMap().get(combo);

                if (commandId) {
                    const targetWindow = leaf.view.containerEl.win;
                    
                    //console.group(`Command: ${commandId}`);
                    
                    // 1. Ensure the window is active (for monitor/space switching)
                    if (window.activeWindow !== targetWindow) targetWindow.focus();

                    // 2. Set active leaf. We use focus:false because forcing focus:true 
                    // on the LEAF can cause the Webview to re-steal focus from the Modal.
                    app.workspace.setActiveLeaf(leaf, { focus: false });

                    // 3. THE FIX: Blur the webview process. This forces focus back to 
                    // the Obsidian window context so the search query modal can grab the cursor.
                    webview.blur();
                    
                    // 4. Fire command
                    app.commands.executeCommandById(commandId);
                    
                    //console.groupEnd();
                }
            }
        });

        const inject = () => {
            if (!webview.isConnected) return;
            webview.executeJavaScript(`
                (function() {
                    if (window._obsHotkeysActive) return;
                    window._obsHotkeysActive = true;
                    
                    window.addEventListener('mousedown', () => {
                        console.log('OBS_ACTIVATE');
                    }, { capture: true });
                    
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
                        
                        // If it's a modifier combo, we blur the inner element immediately
                        // to help Obsidian's modal catch the focus.
                        if (parts.length > 0) {
                             // document.activeElement.blur(); 
                        }
                    }, { capture: true });
                })();
            `).catch(() => {});
        };

        webview.addEventListener('dom-ready', inject);
        try { inject(); } catch(e) {}
    }

    // =========================================================================
    // 4. THE OBSERVERS (Covers Sidebars & New Windows)
    // =========================================================================
    const findAndAttach = () => {
        app.workspace.iterateAllLeaves(leaf => {
            const webview = leaf.view?.containerEl?.querySelector('webview');
            if (webview && !webview._hotkeysAttached) {
                //console.log(`%c Attached: ${leaf.view.getViewType()} `, "color: #94e2d5");
                attachToWebview(webview);
            }
        });
    };

    app.workspace.on('layout-change', findAndAttach);
    app.workspace.on('active-leaf-change', findAndAttach);
    app.workspace.on('window-open', () => setTimeout(findAndAttach, 500));

    // Fallback Heartbeat
    const heartbeat = setInterval(findAndAttach, 1000);
    window.__WEBVIEW_SHORTCUTS_CLEANUP = () => clearInterval(heartbeat);

    findAndAttach();
};
```
### Feature Requests
- Improve Security `Build_code`
	- [Gemini Conversation](https://aistudio.google.com/prompts/10PDojjH29gt-7m_To6afozWeh3OrOtOD)
- Make shortcuts pop in the window your cursor is in?
### Bugs
- When generating a new tab, it snaps back to previous window
- When rotating through tabs, need to press "Command + Option + Left" twice for it to work
	- (Fixed by just creating a separate script for that)
### Information
- You needed to create this script because even if you created a command to run a script for you, the web viewer would eat that command anyway if obsidian is trying to focus on a split web viewer pane.
### Conversation
- [Google AI Studio](https://aistudio.google.com/prompts/1YhiQuBAkpg8NL72_MKTGx0QjS1zErrwa)
- Always feel free to add console logs within the prompt to help with making all the features work together. 
- Ensure Features Work
	- Inside a web viewer, I should be able to interact with the page such as typing in a search query on Google’s Search Engine or a textbox for a leetcode problem
	- If multiple web viewer tabs are split between different panes in an active window, I should be able to focus on one of them and still be able to use an obsidian shortcut (such as ``Command + N`)``
	    - Note: A right-pane web viewer tab might need to be treated differently than a left-pane web viewer tab in the same window
	    - Note: Never hard-code commands to work 
	- When I press a command such as `Command + N` , only one search query popup should occur. Prevent duplicate popups. 
	    - Note: Right-split panes seem to be treated differently than left-split panes in obsidian, so bugs can occur where the right-pane will not have duplicate popups but the left-pane will.
	- When I am in an active Web view and press `Command + T` to create a new tab in obsidian, the view should switch to the new view created rather than staying in the web viewer I’m currently focused on
	- When I click on a web viewer body, then that tab is focused and any obsidian shortcut query boxes created will appear in that window.
	    - Note: Make sure this works with windows on external monitors (including when a window is screen mirrored as extended display from Mac to iPad) and it should work in full screen mode as well
	    - Note: Clicking on the tabs or tab strip should let me have access to obsidian shortcuts as well (like a regular markdown note would)
	    - Note: If there is a query box popup from a shortcut, the cursor blinker should be within the query box ready to type
	- The maximum timeout for a command in an open window is 50ms. I need to be able to press shortcuts fast.

## Plugin Strategy (Not Working)
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