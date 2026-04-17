
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