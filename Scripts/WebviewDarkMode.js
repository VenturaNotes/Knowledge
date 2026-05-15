module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
    
    // Check if this is the first time the script is running this session
    const isFirstRun = window.__DARK_MODE_GLOBAL_STATE === undefined;

    if (isFirstRun) {
        window.__DARK_MODE_GLOBAL_STATE = true; 
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;

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

    // Optimized scanning: only runs when called or on specific layout changes
    const applyToAll = () => {
        const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
        webviews.forEach(wv => {
            updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE);
            if (!wv._dmEventSet) {
                wv.addEventListener('dom-ready', () => updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE));
                wv._dmEventSet = true;
            }
        });
    };

    // Replace the heavy MutationObserver with a light Layout listener
    if (!window.__DARK_MODE_INIT) {
        let timer;
        app.workspace.on('layout-change', () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500); // Wait until layout settles
        });
        window.__DARK_MODE_INIT = true;
    }

    applyToAll();

    // Only show the notice if it is a manual toggle (not the first run on startup)
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};