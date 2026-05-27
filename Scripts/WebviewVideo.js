module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

    const INJECT_SCRIPT = `(function() {
        if (!window.location.hostname.includes('youtube.com')) return;
        if (window.__ytEnhancerActive) return;
        window.__ytEnhancerActive = true;

        let preResetSpeed = null;

        const getVideo = () => document.querySelector('video');

        const setSpeed = (speed) => {
            const video = getVideo();
            if (!video) return;
            speed = Math.max(0.1, Math.round(speed * 10) / 10);
            video.playbackRate = speed;
            showBadge(speed + 'x');
        };

        const showBadge = (text) => {
            let badge = document.getElementById('__yt-speed-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.id = '__yt-speed-badge';
                badge.style.cssText = \`
                    position: fixed;
                    top: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.75);
                    color: #fff;
                    font-size: 18px;
                    font-family: sans-serif;
                    padding: 4px 14px;
                    border-radius: 6px;
                    z-index: 999999;
                    pointer-events: none;
                    transition: opacity 0.3s;
                \`;
                document.body.appendChild(badge);
            }
            badge.textContent = text;
            badge.style.opacity = '1';
            clearTimeout(badge.__hideTimer);
            badge.__hideTimer = setTimeout(() => badge.style.opacity = '0', 1200);
        };

        // Fullscreen style injection control within the guest page
        window.__ytEnhancerSetFullscreen = (enable) => {
            let style = document.getElementById('__yt-fs-styles');
            if (style) style.remove();

            if (enable) {
                style = document.createElement('style');
                style.id = '__yt-fs-styles';
                style.textContent = \`
                    ytd-app, #content, #page-manager, ytd-watch-flexy,
                    #player, #player-container, #player-container-inner,
                    .html5-video-player, video {
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: 100vw !important;
                        max-height: 100vh !important;
                        top: 0 !important;
                        left: 0 !important;
                        position: fixed !important;
                        z-index: 999999 !important;
                    }
                    ytd-masthead, #masthead-container,
                    #secondary, #below, #comments,
                    ytd-watch-next-secondary-results-renderer {
                        display: none !important;
                    }
                \`;
                document.head.appendChild(style);
            }
        };

        document.addEventListener('keydown', (e) => {
            if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
            if (e.target.isContentEditable) return;

            const video = getVideo();
            if (!video) return;

            const key = e.key.toLowerCase();

            switch (key) {
                case 'd':
                    e.stopPropagation();
                    setSpeed(video.playbackRate + 0.1);
                    break;
                case 's':
                    e.stopPropagation();
                    setSpeed(video.playbackRate - 0.1);
                    break;
                case 'r': {
                    e.stopPropagation();
                    const current = Math.round(video.playbackRate * 10) / 10;
                    if (current !== 1.0) {
                        preResetSpeed = current;
                        setSpeed(1.0);
                    } else if (preResetSpeed !== null) {
                        const restore = preResetSpeed;
                        preResetSpeed = null;
                        setSpeed(restore);
                    }
                    break;
                }
                case 'f':
                    e.stopPropagation();
                    e.preventDefault();
                    // Signal to the host wrapper that we want to toggle fullscreen
                    console.log('YT_ENHANCER_TOGGLE_FULLSCREEN');
                    break;
                case 'escape':
                    e.stopPropagation();
                    e.preventDefault();
                    // Signal to the host wrapper to exit fullscreen
                    console.log('YT_ENHANCER_EXIT_FULLSCREEN');
                    break;
            }
        }, true);

    })();`;

    function setupFullscreen(webview) {
        if (webview._fsSetup) return;
        webview._fsSetup = true;

        const getLeaf = () => webview.closest('.workspace-leaf');

        let originalStyles = null;
        let originalWvStyles = null;
        let isFullscreen = false;

        const enterFullscreen = () => {
            if (isFullscreen) return;
            const leaf = getLeaf();
            if (!leaf) return;
            isFullscreen = true;

            // Cache leaf styles
            originalStyles = {
                position: leaf.style.position,
                top: leaf.style.top,
                left: leaf.style.left,
                width: leaf.style.width,
                height: leaf.style.height,
                zIndex: leaf.style.zIndex,
            };

            // Cache webview styles
            originalWvStyles = {
                position: webview.style.position,
                top: webview.style.top,
                left: webview.style.left,
                width: webview.style.width,
                height: webview.style.height,
                zIndex: webview.style.zIndex,
            };

            // Position the workspace leaf fixed
            Object.assign(leaf.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '9999',
            });

            // Position the webview fixed so it overlays local tab and address bars
            Object.assign(webview.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '99999',
            });

            // Tell the YouTube page context to apply the video expansion CSS
            try {
                webview.executeJavaScript(`window.__ytEnhancerSetFullscreen && window.__ytEnhancerSetFullscreen(true);`);
            } catch (err) {
                console.error('[YTEnhancer] Failed to execute guest fullscreen:', err);
            }
        };

        const exitFullscreen = () => {
            if (!isFullscreen) return;
            const leaf = getLeaf();
            isFullscreen = false;

            // Restore leaf styles
            if (leaf && originalStyles) {
                Object.assign(leaf.style, originalStyles);
            }
            originalStyles = null;

            // Restore webview styles
            if (originalWvStyles) {
                Object.assign(webview.style, originalWvStyles);
            }
            originalWvStyles = null;

            // Tell the YouTube page context to remove the CSS styling overrides
            try {
                webview.executeJavaScript(`window.__ytEnhancerSetFullscreen && window.__ytEnhancerSetFullscreen(false);`);
            } catch (err) {
                console.error('[YTEnhancer] Failed to exit guest fullscreen:', err);
            }
        };

        const toggleFullscreen = () => isFullscreen ? exitFullscreen() : enterFullscreen();

        // Listen for native HTML5 fullscreen triggers inside the webview (if allowed)
        webview.addEventListener('enter-html-full-screen', enterFullscreen);
        webview.addEventListener('leave-html-full-screen', exitFullscreen);

        // Listen for console bridge signals from the guest webview page
        webview.addEventListener('console-message', (e) => {
            if (e.message === 'YT_ENHANCER_TOGGLE_FULLSCREEN') {
                toggleFullscreen();
            } else if (e.message === 'YT_ENHANCER_EXIT_FULLSCREEN') {
                exitFullscreen();
            }
        });

        // Keydown listener for the Obsidian parent window context (when webview is not focused)
        window.addEventListener('keydown', (e) => {
            if (e.key !== 'f' && e.key !== 'F') return;
            if (!document.contains(webview)) return;
            if (!webview.offsetParent) return;
            const activeLeaf = document.querySelector('.workspace-leaf.mod-active');
            if (!activeLeaf?.contains(webview)) return;
            e.preventDefault();
            e.stopPropagation();
            toggleFullscreen();
        }, true);

        // Escape listener for the Obsidian parent context
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                e.preventDefault();
                exitFullscreen();
            }
        }, true);
    }

    async function updateWebview(webview) {
        if (!webview || typeof webview.executeJavaScript !== 'function') return;
        setupFullscreen(webview);
        try {
            await webview.executeJavaScript(INJECT_SCRIPT);
        } catch (err) {
            console.error('[YTEnhancer] executeJavaScript failed:', err);
        }
    }

    function attachListeners(webview) {
        if (webview._enhancerEventSet) return;
        webview._enhancerEventSet = true;

        const onReady = () => updateWebview(webview);
        webview.addEventListener('dom-ready', onReady);
        webview.addEventListener('did-navigate', onReady);
        webview.addEventListener('did-navigate-in-page', onReady);
    }

    const applyToAll = () => {
        document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
            attachListeners(wv);
            updateWebview(wv);
        });
    };

    if (!window.__YT_ENHANCER_INIT) {
        window.__YT_ENHANCER_INIT = true;
        let timer;
        app.workspace.on('layout-change', () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500);
        });
    }

    applyToAll();
};