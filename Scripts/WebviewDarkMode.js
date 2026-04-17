module.exports = async (params) => {
    // 1. Detect if this is the startup run or a manual toggle
    const isFirstRun = window.__DARK_MODE_GLOBAL_STATE === undefined;

    // 2. Set the state
    if (isFirstRun) {
        window.__DARK_MODE_GLOBAL_STATE = true; // Default to ON at startup
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview, webview';

    async function updateWebview(webview) {
        if (!webview || typeof webview.executeJavaScript !== 'function') return;

        if (isActivating) {
            await webview.executeJavaScript(`
                (function() {
                    const inject = () => {
                        DarkReader.setFetchMethod(window.fetch);
                        DarkReader.enable({ brightness: 100, contrast: 95, sepia: 0 });
                    };
                    if (window.DarkReader) {
                        inject();
                    } else {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js';
                        script.onload = inject;
                        document.head.appendChild(script);
                    }
                })();
            `).catch(e => {});
        } else {
            await webview.executeJavaScript(`
                if (window.DarkReader) { DarkReader.disable(); }
            `).catch(e => {});
        }
    }

    // 3. Optimized Event Listener (Layout-change instead of MutationObserver)
    if (!window.__DARK_MODE_EVENT_SET) {
        app.workspace.on('layout-change', () => {
            if (window.__DARK_MODE_GLOBAL_STATE) {
                document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
                    if (!wv._dmAttached) {
                        wv.addEventListener('dom-ready', () => updateWebview(wv));
                        updateWebview(wv);
                        wv._dmAttached = true;
                    }
                });
            }
        });
        window.__DARK_MODE_EVENT_SET = true;
    }

    // 4. Apply immediately to active webviews
    const activeWebviews = document.querySelectorAll(WEBVIEW_SELECTOR);
    activeWebviews.forEach(wv => {
        if (!wv._dmAttached) {
            wv.addEventListener('dom-ready', () => updateWebview(wv));
            wv._dmAttached = true;
        }
        updateWebview(wv);
    });

    // 5. THE FIX: Only show Notice if it's NOT the first run (manual toggle only)
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};