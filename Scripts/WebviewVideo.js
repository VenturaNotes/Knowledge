module.exports = async (params) => {
    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

    const INJECT_SCRIPT = `(function() {
        const hostname = window.location.hostname;
        const isYouTube = hostname.includes('youtube.com');
        const isTikTok = hostname.includes('tiktok.com');
        if (!isYouTube && !isTikTok) return;

        // Per-host guard so re-injection on navigation doesn't double-bind
        const guardKey = '__enhancerActive_' + hostname.replace(/\\.+/g, '_');
        if (window[guardKey]) return;
        window[guardKey] = true;

        let preResetSpeed = null;

        // TikTok autoplays the visible feed video; grab the first playing one,
        // fallback to any video if none is actively playing.
        const getVideo = () => {
            if (isTikTok) {
                const videos = Array.from(document.querySelectorAll('video'));
                return videos.find(v => !v.paused) || videos[0] || null;
            }
            return document.querySelector('video');
        };

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

        // Fullscreen style injection — host-aware CSS targets
        window.__ytEnhancerSetFullscreen = (enable) => {
            let style = document.getElementById('__yt-fs-styles');
            if (style) style.remove();

            if (enable) {
                style = document.createElement('style');
                style.id = '__yt-fs-styles';

                const youtubeCSS = \`
                    html, body, ytd-app {
                        overflow: hidden !important;
                    }
                    ytd-app, #content, #page-manager, ytd-watch-flexy,
                    #player, #player-container, #player-container-inner,
                    .html5-video-player {
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: 100vw !important;
                        max-height: 100vh !important;
                        top: 0 !important;
                        left: 0 !important;
                        position: fixed !important;
                        z-index: 999999 !important;
                    }
                    video {
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: 100vw !important;
                        max-height: 100vh !important;
                        top: 0 !important;
                        left: 0 !important;
                        position: fixed !important;
                        z-index: 999999 !important;
                        object-fit: contain !important;
                    }
                    ytd-masthead, #masthead-container,
                    #secondary, #below, #comments,
                    ytd-watch-next-secondary-results-renderer {
                        display: none !important;
                    }
                \`;

                // TikTok: the playing video lives inside a swiper slide; hide surrounding feed chrome
                const tiktokCSS = \`
                    html, body {
                        overflow: hidden !important;
                    }
                    video {
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: 100vw !important;
                        max-height: 100vh !important;
                        top: 0 !important;
                        left: 0 !important;
                        position: fixed !important;
                        z-index: 999999 !important;
                        object-fit: contain !important;
                    }
                    header, footer, [class*="DivHeader"], [class*="DivSideBar"],
                    [class*="DivActionItem"], [class*="DivInfoContainer"],
                    [class*="DivVideoInfoContainer"], [class*="DivBrowserModeContainer"] {
                        display: none !important;
                    }
                \`;

                style.textContent = isYouTube ? youtubeCSS : tiktokCSS;
                document.head.appendChild(style);
            }
        };

        document.addEventListener('keydown', (e) => {
            if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
            if (e.target.isContentEditable) return;

            // TikTok search/comment boxes use shadow DOM descendants; closest() catches them
            if (e.target.closest('input, textarea, [contenteditable="true"]')) return;

            const video = getVideo();
            if (!video) return;

            const key = e.key.toLowerCase();

            // Ignore playback shortcut keys if any modifier keys are held (such as Cmd+F or Ctrl+F)
            if (e.metaKey || e.ctrlKey || e.altKey) return;

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
                    console.log('YT_ENHANCER_TOGGLE_FULLSCREEN');
                    break;
                case 'h': {
                    // Toggles the visibility of the YouTube control overlays
                    e.stopPropagation();
                    let style = document.getElementById('__yt-hyde-styles');
                    if (style) {
                        style.remove();
                    } else {
                        style = document.createElement('style');
                        style.id = '__yt-hyde-styles';
                        style.textContent = \`
                            .ytp-chrome-bottom,
                            .ytp-chrome-top,
                            .ytp-gradient-bottom,
                            .ytp-gradient-top,
                            .ytp-pause-overlay {
                                opacity: 0 !important;
                                pointer-events: none !important;
                                transition: opacity 0.15s ease-in-out !important;
                            }
                        \`;
                        document.body.appendChild(style);
                    }
                    break;
                }
                case 'escape':
                    e.stopPropagation();
                    e.preventDefault();
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
        webview._isFullscreen = false;

        const enterFullscreen = () => {
            if (webview._isFullscreen) return;
            const leaf = getLeaf();
            if (!leaf) return;
            webview._isFullscreen = true;

            originalStyles = {
                position: leaf.style.position,
                top: leaf.style.top,
                left: leaf.style.left,
                width: leaf.style.width,
                height: leaf.style.height,
                zIndex: leaf.style.zIndex,
                overflow: leaf.style.overflow,
            };

            originalWvStyles = {
                position: webview.style.position,
                top: webview.style.top,
                left: webview.style.left,
                width: webview.style.width,
                height: webview.style.height,
                zIndex: webview.style.zIndex,
                overflow: webview.style.overflow,
            };

            Object.assign(leaf.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '9999',
                overflow: 'hidden',
            });

            Object.assign(webview.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '99999',
                overflow: 'hidden',
            });

            try {
                webview.executeJavaScript(`window.__ytEnhancerSetFullscreen && window.__ytEnhancerSetFullscreen(true);`);
            } catch (err) {
                console.error('[YTEnhancer] Failed to execute guest fullscreen:', err);
            }
        };

        const exitFullscreen = () => {
            if (!webview._isFullscreen) return;
            const leaf = getLeaf();
            webview._isFullscreen = false;

            if (leaf && originalStyles) {
                Object.assign(leaf.style, originalStyles);
            }
            originalStyles = null;

            if (originalWvStyles) {
                Object.assign(webview.style, originalWvStyles);
            }
            originalWvStyles = null;

            try {
                webview.executeJavaScript(`window.__ytEnhancerSetFullscreen && window.__ytEnhancerSetFullscreen(false);`);
            } catch (err) {
                console.error('[YTEnhancer] Failed to exit guest fullscreen:', err);
            }
        };

        const toggleFullscreen = () => webview._isFullscreen ? exitFullscreen() : enterFullscreen();

        // Bind control triggers directly to the webview element so parent listeners can interact with them
        webview._enterFullscreen = enterFullscreen;
        webview._exitFullscreen = exitFullscreen;
        webview._toggleFullscreen = toggleFullscreen;

        webview.addEventListener('enter-html-full-screen', enterFullscreen);
        webview.addEventListener('leave-html-full-screen', exitFullscreen);

        webview.addEventListener('console-message', (e) => {
            if (e.message === 'YT_ENHANCER_TOGGLE_FULLSCREEN') {
                toggleFullscreen();
            } else if (e.message === 'YT_ENHANCER_EXIT_FULLSCREEN') {
                exitFullscreen();
            }
        });
    }

    // Registers a single keydown parent interface per window (prevents memory leaks & handles pop-out focus)
    const registerParentListeners = (win) => {
        if (win.__YT_PARENT_LISTENERS_SET) return;
        win.__YT_PARENT_LISTENERS_SET = true;

        // Parent 'F' Keydown handler (toggles fullscreen if webview is inside the active leaf)
        win.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() !== 'f') return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            // Safe Guards: Bypass shortcut during input field focus inside Obsidian
            if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
            if (e.target.isContentEditable) return;
            if (e.target.closest('.cm-editor') || e.target.closest('.cm-content')) return;

            const activeLeaf = win.document.querySelector('.workspace-leaf.mod-active');
            if (!activeLeaf) return;

            const webview = activeLeaf.querySelector(WEBVIEW_SELECTOR);
            if (!webview || typeof webview._toggleFullscreen !== 'function') return;

            e.preventDefault();
            e.stopPropagation();
            webview._toggleFullscreen();
        }, true);

        // Parent 'Escape' Keydown handler (exits any fullscreen video webviews)
        win.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const webviews = win.document.querySelectorAll(WEBVIEW_SELECTOR);
                let captured = false;

                webviews.forEach(wv => {
                    if (wv._isFullscreen && typeof wv._exitFullscreen === 'function') {
                        wv._exitFullscreen();
                        captured = true;
                    }
                });

                if (captured) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);
    };

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

    const applyToAll = () => {
        const windows = getActiveWindows();
        windows.forEach(win => {
            if (!win || !win.document) return;
            registerParentListeners(win);
            win.document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
                attachListeners(wv);
                updateWebview(wv);
            });
        });
    };

    if (!app.__YT_ENHANCER_INIT) {
        app.__YT_ENHANCER_INIT = true;
        let timer;
        const triggerApply = () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAll, 500);
        };
        app.workspace.on('layout-change', triggerApply);
        app.workspace.on('window-open', triggerApply);
    }

    applyToAll();
};