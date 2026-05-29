module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

    // Store global state on the app object so it's shared across all pop-out windows
    const isFirstRun = app.__AD_BLOCK_GLOBAL_STATE === undefined;
    if (isFirstRun) {
        app.__AD_BLOCK_GLOBAL_STATE = true;
    } else {
        app.__AD_BLOCK_GLOBAL_STATE = !app.__AD_BLOCK_GLOBAL_STATE;
    }

    const isActivating = app.__AD_BLOCK_GLOBAL_STATE;

    const ACTIVATE_SCRIPT = `(function() {
        if (!window.location.hostname.includes('youtube.com')) return;
        if (window.__ytAdBlockActive) return;
        window.__ytAdBlockActive = true;

        const skipAd = () => {
            const selectors = [
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-modern',
                '.ytp-ad-skip-button-slot',
                '.videoAdUiSkipButton',
                '.ytp-ad-skip-button-text'
            ];
            for (const sel of selectors) {
                const btn = document.querySelector(sel);
                if (btn) { btn.click(); return true; }
            }
            return false;
        };

        const injectStyles = () => {
            if (document.getElementById('yt-ad-hider-styles')) return;
            const style = document.createElement('style');
            style.id = 'yt-ad-hider-styles';
            style.textContent = \`
                #masthead-ad,
                ytd-companion-card-renderer,
                .ytp-ad-overlay-container,
                .ytp-ad-message-container,
                #player-ads,
                ytd-promoted-sparkles-web-renderer,
                ytd-display-ad-renderer,
                .ytd-carousel-ad-renderer,
                .ytd-action-companion-ad-renderer,
                .ytd-statement-banner-renderer,
                .ytd-in-feed-ad-layout-renderer {
                    display: none !important;
                }
            \`;
            document.head.appendChild(style);
        };

        let previousSpeed = 1;
        let isAdActive = false;

        const checkAndSkipAds = () => {
            const video = document.querySelector('video');
            if (!video) return;

            const isAdShowing = document.querySelector(
                '.ad-showing, .ad-interrupting, .html5-video-player.ad-showing'
            );

            if (isAdShowing) {
                if (!isAdActive) {
                    isAdActive = true;
                    if (video.playbackRate < 10) previousSpeed = video.playbackRate;
                    video.muted = true;
                }
                video.playbackRate = 16;
                if (video.duration && isFinite(video.duration) && video.currentTime < video.duration - 0.1) {
                    video.currentTime = video.duration - 0.05;
                }
                skipAd();
            } else {
                if (isAdActive) {
                    isAdActive = false;
                    video.playbackRate = previousSpeed || 1;
                    video.muted = false;
                }
            }
        };

        injectStyles();

        const observer = new MutationObserver(() => {
            checkAndSkipAds();
            skipAd();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const interval = setInterval(() => {
            checkAndSkipAds();
            injectStyles();
        }, 300);

        window.__ytAdBlockState = {
            observer,
            interval,
            restore: () => {
                const video = document.querySelector('video');
                if (video && isAdActive) {
                    video.playbackRate = previousSpeed || 1;
                    video.muted = false;
                }
            }
        };
    })();`;

    const DEACTIVATE_SCRIPT = `(function() {
        window.__ytAdBlockActive = false;

        if (window.__ytAdBlockState?.interval)
            clearInterval(window.__ytAdBlockState.interval);

        if (window.__ytAdBlockState?.observer)
            window.__ytAdBlockState.observer.disconnect();

        if (typeof window.__ytAdBlockState?.restore === 'function')
            window.__ytAdBlockState.restore();

        document.getElementById('yt-ad-hider-styles')?.remove();

        window.__ytAdBlockState = null;
    })();`;

    async function updateWebview(webview, activate) {
        if (!webview || typeof webview.executeJavaScript !== 'function') return;
        if (webview._abBusy) return;
        webview._abBusy = true;

        try {
            await webview.executeJavaScript(activate ? ACTIVATE_SCRIPT : DEACTIVATE_SCRIPT);
        } catch (err) {
            console.error('[AdBlock] executeJavaScript failed:', err);
        } finally {
            webview._abBusy = false;
        }
    }

    function attachListeners(webview) {
        if (webview._abEventSet) return;
        webview._abEventSet = true;

        // Re-inject on navigation (e.g. user clicks another YT video)
        const onReady = () => updateWebview(webview, app.__AD_BLOCK_GLOBAL_STATE);
        webview.addEventListener('dom-ready', onReady);
        webview.addEventListener('did-navigate', onReady);
        webview.addEventListener('did-navigate-in-page', onReady);
    }

    const applyToAll = () => {
        // Collect all unique active windows (main window + any pop-out/floating windows)
        const windows = new Set([window]);
        const floatingSplit = app.workspace.floatingSplit;
        if (floatingSplit && floatingSplit.children) {
            floatingSplit.children.forEach(child => {
                if (child.win) {
                    windows.add(child.win);
                }
            });
        }

        // Apply listeners and injection scripts to webviews in all gathered windows
        windows.forEach(win => {
            if (!win || !win.document) return;
            win.document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
                attachListeners(wv);
                updateWebview(wv, app.__AD_BLOCK_GLOBAL_STATE);
            });
        });
    };

    // Set up workspace listeners once per session on the shared global app object
    if (!app.__AD_BLOCK_INIT) {
        app.__AD_BLOCK_INIT = true;
        let timer;
        const triggerApply = () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500);
        };
        app.workspace.on('layout-change', triggerApply);
        app.workspace.on('window-open', triggerApply);
    }

    applyToAll();

    if (!isFirstRun) {
        new Notice(isActivating ? '🛡️ Webview Ad-Skipper: ON' : '🛡️ Webview Ad-Skipper: OFF');
    }
};