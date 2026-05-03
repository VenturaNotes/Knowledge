/**
 * WebviewCommands.js
 * Version: 2.8 - Quiet Focus & Settled Clone
 */

module.exports = async (params) => {
    if (window.__WEBVIEW_SHORTCUTS_INIT) {
        if (window.__WEBVIEW_SHORTCUTS_CLEANUP) window.__WEBVIEW_SHORTCUTS_CLEANUP();
    }
    window.__WEBVIEW_SHORTCUTS_INIT = true;

    // --- 1. THE COMMAND SHIELD ---
    const lastFired = new Map();
    const origExecute = app.commands.executeCommand;
    app.commands.executeCommand = function(command) {
        const id = command?.id || arguments[0]?.id || (typeof arguments[0] === 'string' ? arguments[0] : null);
        if (id) {
            const now = performance.now();
            if (now - (lastFired.get(id) || 0) < 50) return false; 
            lastFired.set(id, now);
        }
        return origExecute.apply(this, arguments);
    };

    // --- 2. HOTKEY MAPPING ---
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

    // --- 3. ATTACHMENT (Silent & Safe) ---
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

            if (e.message === 'OBS_ACTIVATE') {
                const win = leaf.view.containerEl.win;
                if (app.workspace.activeLeaf !== leaf || window.activeWindow !== win) {
                    if (window.activeWindow !== win) win.focus();
                    app.workspace.setActiveLeaf(leaf, { focus: false });
                }
                return;
            }

            if (e.message?.startsWith('OBS_RAW_KEY:')) {
                const commandId = getHotkeyMap().get(e.message.split('OBS_RAW_KEY:')[1]);
                if (commandId) {
                    const win = leaf.view.containerEl.win;
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

    // --- 4. MOVEMENT DETECTION (Quiet Focus Strategy) ---
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
            
            // Allow Obsidian's internal drag-and-drop state to finish
            await new Promise(r => setTimeout(r, 150));

            const state = movedLeaf.getViewState();
            const wasActive = app.workspace.activeLeaf === movedLeaf;
            const originalActiveLeaf = app.workspace.activeLeaf;

            // Step A: Target the correct pane. 
            // We switch focus to the moved leaf *without* focusing the actual window.
            // This ensures the clone is born in the new pane.
            app.workspace.setActiveLeaf(movedLeaf, { focus: false });

            // Step B: Create Clone
            const newLeaf = app.workspace.getLeaf('tab');
            await newLeaf.setViewState(state);

            // Step C: Remove the "broken" moved tab
            movedLeaf.detach();

            // Step D: Restore Focus
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

    app.workspace.on('layout-change', () => {
        findAndAttach();
        processMovement();
    });

    const heartbeat = setInterval(findAndAttach, 2000);
    window.__WEBVIEW_SHORTCUTS_CLEANUP = () => clearInterval(heartbeat);
    findAndAttach();
};