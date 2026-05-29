module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
    
    // Shift state storage to the shared app object so all windows stay synchronized
    const isFirstRun = app.__DARK_MODE_GLOBAL_STATE === undefined;

    if (isFirstRun) {
        app.__DARK_MODE_GLOBAL_STATE = true; 
    } else {
        app.__DARK_MODE_GLOBAL_STATE = !app.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = app.__DARK_MODE_GLOBAL_STATE;

    async function updateWebview(webview, forceState) {
        if (!webview || typeof webview.executeJavaScript !== 'function' || webview._dmBusy) return;
        webview._dmBusy = true; // Prevent recursive calls

        const script = forceState 
            ? `(function() {
                const inject = () => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 }); };
                if (window.DarkReader) { inject(); } else {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                    s.onload = inject;
                    document.head.appendChild(s);
                }
               })();`
            : `if (window.DarkReader) { DarkReader.disable(); }`;

        await webview.executeJavaScript(script).catch(() => {});
        webview._dmBusy = false;
    }

    // Gathers all open DOM windows (main window + any pop-outs)
    const getActiveWindows = () => {
        const windows = new Set([window]);
        const floatingSplit = app.workspace.floatingSplit;
        if (floatingSplit && floatingSplit.children) {
            floatingSplit.children.forEach(child => {
                if (child.win) {
                    windows.add(child.win);
                }
            });
        }
        return Array.from(windows);
    };

    // Scans all discovered windows and applies dark mode configuration to webviews
    const applyToAll = () => {
        const windows = getActiveWindows();
        windows.forEach(win => {
            if (!win || !win.document) return;
            const webviews = win.document.querySelectorAll(WEBVIEW_SELECTOR);
            webviews.forEach(wv => {
                updateWebview(wv, app.__DARK_MODE_GLOBAL_STATE);
                if (!wv._dmEventSet) {
                    wv.addEventListener('dom-ready', () => updateWebview(wv, app.__DARK_MODE_GLOBAL_STATE));
                    wv._dmEventSet = true;
                }
            });
        });
    };

    // Set up workspace listeners once per session on the shared global app object
    if (!app.__DARK_MODE_INIT) {
        app.__DARK_MODE_INIT = true;
        let timer;
        const triggerApply = () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500); // Wait until layout settles
        };
        app.workspace.on('layout-change', triggerApply);
        app.workspace.on('window-open', triggerApply);
    }

    applyToAll();

    // Only show the notice if it is a manual toggle (not the first run on startup)
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};