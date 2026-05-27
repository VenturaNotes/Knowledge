/**
 * WebviewCommands.js
 * Version: 3.4 - Bulletproof Focus, Reverted TabNext Fix, and Swallowed Electron remote Crashes
 */

module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) {
        if (window.__WEBVIEW_SHORTCUTS_CLEANUP) window.__WEBVIEW_SHORTCUTS_CLEANUP();
    }
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // --- 1. SILENT EXCEPTION SWALLOWER ---
    // Swallows the native Electron/remote uncaught exceptions when closing focused webviews
    const errorHandler = (event) => {
        const msg = event.message || event.error?.message;
        if (msg && (msg.includes('setIgnoreMenuShortcuts') || msg.includes('Object has been destroyed'))) {
            event.preventDefault(); // Swallows the uncaught exception
        }
    };

    const rejectionHandler = (event) => {
        const msg = event.reason?.message || event.reason;
        if (msg && (msg.includes('setIgnoreMenuShortcuts') || msg.includes('Object has been destroyed'))) {
            event.preventDefault(); // Swallows the uncaught promise rejection
        }
    };

    const registerWindowErrorHandlers = (win) => {
        if (!win || win._errorHandlersBound) return;
        win._errorHandlersBound = true;
        win.addEventListener('error', errorHandler);
        win.addEventListener('unhandledrejection', rejectionHandler);
    };

    // Register on the main window immediately
    registerWindowErrorHandlers(window);

    // --- 2. THE COMMAND SHIELD (Memory-Leak Free) ---
    const lastFired = new Map();
    
    // Prevent recursive nesting by saving the true original only once globally
    if (!window.__ORIGINAL_EXECUTE_COMMAND) {
        window.__ORIGINAL_EXECUTE_COMMAND = app.commands.executeCommand;
    }

    app.commands.executeCommand = function(command) {
        const id = command?.id || arguments[0]?.id || (typeof arguments[0] === 'string' ? arguments[0] : null);
        if (id) {
            const now = performance.now();
            if (now - (lastFired.get(id) || 0) < 50) return false; 
            lastFired.set(id, now);
        }
        return window.__ORIGINAL_EXECUTE_COMMAND.apply(this, arguments);
    };

    // --- 3. SMART HOTKEY CACHING ---
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

    const clearCache = () => {
        cachedHotkeyMap = null;
    };

    // --- 4. ATTACHMENT (Silent & Safe) ---
    async function attachToWebview(webview) {
        if (!webview || !webview.isConnected || webview._hotkeysAttached) return;

        const isReady = () => {
            try { return webview.isConnected && webview.parentElement && !!webview.getWebContentsId(); } catch(e) { return false; }
        };

        webview._hotkeysAttached = true; 

        webview.addEventListener('console-message', (e) => {
            let leaf = null;
            app.workspace.iterateAllLeaves(l => { if (l.view?.containerEl?.contains(webview)) leaf = l; });
            if (!leaf) return;

            // Register error handlers on the parent window of this leaf (supports popout windows)
            const win = leaf.view.containerEl.win;
            registerWindowErrorHandlers(win);

            if (e.message === 'OBS_ACTIVATE') {
                if (app.workspace.activeLeaf !== leaf || window.activeWindow !== win) {
                    if (window.activeWindow !== win) win.focus();
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                }
                return;
            }

            if (e.message?.startsWith('OBS_RAW_KEY:')) {
                const commandId = getHotkeyMap().get(e.message.split('OBS_RAW_KEY:')[1]);
                if (commandId) {
                    
                    // CRITICAL V3.1 RESTORATION:
                    // If the native event has already switched the active tab (e.g. Next Tab / Previous Tab),
                    // we MUST abort immediately. Do not snap back to the webview leaf!
                    if (app.workspace.activeLeaf !== leaf) {
                        return;
                    }

                    if (window.activeWindow !== win) win.focus();
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                    webview.blur();
                    app.commands.executeCommandById(commandId);
                }
            }
        });

        const inject = () => {
            if (!isReady()) return;
            webview.executeJavaScript(`
                (function() {
                    if (window._obsHotkeysActive) return;
                    window._obsHotkeysActive = true;
                    window.addEventListener('mousedown', () => console.log('OBS_ACTIVATE'), { capture: true });
                    window.addEventListener('keydown', (e) => {
                        const parts = [];
                        if (e.ctrlKey) parts.push('ctrl'); if (e.metaKey) parts.push('meta');
                        if (e.shiftKey) parts.push('shift'); if (e.altKey) parts.push('alt');
                        if (parts.length === 0) return;
                        let key = (e.key || '').toLowerCase(); if (key === ' ') key = 'space'; 
                        console.log('OBS_RAW_KEY:' + parts.sort().join('+') + ':' + key);
                    }, { capture: true });
                })();
            `).catch(() => {});
        };

        webview.addEventListener('dom-ready', inject);
        if (isReady()) inject();
    }

    // --- 5. MOVEMENT DETECTION (Original Pane-Safe Logic) ---
    const leafParentMap = new WeakMap();
    let isRecreating = false;

    const processMovement = async () => {
        if (isRecreating) return;
        
        let movedLeaf = null;
        app.workspace.iterateAllLeaves(leaf => {
            if (movedLeaf) return;
            const webview = leaf.view?.containerEl?.querySelector('webview');
            if (!webview) return;

            const currentParentId = leaf.parent?.id;
            const lastParentId = leafParentMap.get(leaf);

            if (lastParentId && currentParentId !== lastParentId) {
                movedLeaf = leaf;
            }
            leafParentMap.set(leaf, currentParentId);
        });

        if (movedLeaf) {
            isRecreating = true;
            await new Promise(r => setTimeout(r, 150));

            const state = movedLeaf.getViewState();
            const wasActive = app.workspace.activeLeaf === movedLeaf;
            const originalActiveLeaf = app.workspace.activeLeaf;

            app.workspace.setActiveLeaf(movedLeaf, { focus: false });
            const newLeaf = app.workspace.getLeaf('tab');
            await newLeaf.setViewState(state);
            movedLeaf.detach();

            if (wasActive) {
                app.workspace.setActiveLeaf(newLeaf, { focus: true });
            } else {
                app.workspace.setActiveLeaf(originalActiveLeaf, { focus: true });
            }

            leafParentMap.set(newLeaf, newLeaf.parent?.id);
            setTimeout(() => { 
                isRecreating = false; 
                findAndAttach();
            }, 400);
        }
    };

    const findAndAttach = () => {
        app.workspace.iterateAllLeaves(leaf => {
            const webview = leaf.view?.containerEl?.querySelector('webview');
            if (webview) {
                if (!webview._hotkeysAttached) attachToWebview(webview);
                if (!leafParentMap.has(leaf)) leafParentMap.set(leaf, leaf.parent?.id);
            }
        });
    };

    // --- 6. EVENT HANDLERS ---
    app.workspace.on('layout-change', () => {
        clearCache(); // Reset the hotkey map when the layout changes
        findAndAttach();
        processMovement();
    });

    const heartbeat = setInterval(findAndAttach, 5000);
    
    window.__WEBVIEW_SHORTCUTS_CLEANUP = () => {
        clearInterval(heartbeat);
        app.workspace.off('layout-change', clearCache);

        // Remove error listeners from main window on cleanup
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', rejectionHandler);
        delete window._errorHandlersBound;

        // Safely restore the command shield to prevent recursion crashes
        if (window.__ORIGINAL_EXECUTE_COMMAND) {
            app.commands.executeCommand = window.__ORIGINAL_EXECUTE_COMMAND;
            delete window.__ORIGINAL_EXECUTE_COMMAND;
        }
    };

    findAndAttach();
};