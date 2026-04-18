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