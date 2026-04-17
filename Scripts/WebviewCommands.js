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