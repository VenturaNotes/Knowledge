module.exports = async (params) => {
    // 1. Check if this is the very first run of the session
    const isFirstRun = window.__DARK_MODE_GLOBAL_STATE === undefined;

    // 2. Set the state
    if (isFirstRun) {
        window.__DARK_MODE_GLOBAL_STATE = true; // Default to ON at startup
    } else {
        window.__DARK_MODE_GLOBAL_STATE = !window.__DARK_MODE_GLOBAL_STATE;
    }

    const isActivating = window.__DARK_MODE_GLOBAL_STATE;
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

    async function updateWebview(webview, forceState) {
        if (!webview || typeof webview.executeJavaScript !== 'function') return;

        if (forceState) {
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

    // 3. Setup the Observer (One-time setup)
    if (!window.__DARK_MODE_OBSERVER_SET) {
        const observer = new MutationObserver(() => {
            if (window.__DARK_MODE_GLOBAL_STATE === true) {
                const webviews = document.querySelectorAll(WEBVIEW_SELECTOR);
                webviews.forEach(wv => {
                    if (!wv._dmAttached) {
                        wv.addEventListener('dom-ready', () => {
                            updateWebview(wv, window.__DARK_MODE_GLOBAL_STATE);
                        });
                        updateWebview(wv, true);
                        wv._dmAttached = true;
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.__DARK_MODE_OBSERVER_SET = true;
    }

    // 4. Apply to active webviews
    const activeWebviews = document.querySelectorAll(WEBVIEW_SELECTOR);
    activeWebviews.forEach(wv => updateWebview(wv, isActivating));

    // 5. THE FIX: Only show Notice if it's NOT the first run
    if (!isFirstRun) {
        new Notice(isActivating ? "🌙 Webview Dark Mode: ON" : "☀️ Webview Dark Mode: OFF");
    }
};