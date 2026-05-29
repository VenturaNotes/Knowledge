/**
 * WebviewDefault.js
 * Version: 2.2 - Multi-Window + DOM Hooks + WebContents Stripping + IDB Write Blocking
 */

module.exports = async (params) => {
    const { app } = params;

    // Store global state on the shared app object so all windows stay synchronized
    const isFirstRun = app.__INCOGNITO_GLOBAL_STATE === undefined;

    if (isFirstRun) {
        app.__INCOGNITO_GLOBAL_STATE = true;
    } else {
        app.__INCOGNITO_GLOBAL_STATE = !app.__INCOGNITO_GLOBAL_STATE;
    }

    const isActivating = app.__INCOGNITO_GLOBAL_STATE;

    // Helper function to create a fake IDB request matching the target window's environment
    function makeFakeRequest(win, resultValue) {
        const req = {
            result: resultValue ?? null,
            error: null,
            readyState: 'done',
            onsuccess: null,
            onerror: null,
            addEventListener: () => {},
            removeEventListener: () => {},
        };
        win.setTimeout(() => { 
            if (typeof req.onsuccess === 'function') req.onsuccess({ target: req }); 
        }, 0);
        return req;
    }

    // ─── DOM-LEVEL ENFORCEMENT ON INDIVIDUAL WINDOWS ──────────────────────────────
    function hookDOMWindow(win) {
        if (!win || win.__INCOGNITO_HOOKED) return;
        win.__INCOGNITO_HOOKED = true;

        // 1. Hook IDB writes for 'history' namespace
        if (win.IDBObjectStore) {
            const originalAdd = win.IDBObjectStore.prototype.add;
            const originalPut = win.IDBObjectStore.prototype.put;

            win.IDBObjectStore.prototype.add = function(value, key) {
                if (app.__INCOGNITO_GLOBAL_STATE && this.name === 'history') {
                    return makeFakeRequest(win, key);
                }
                return originalAdd.call(this, value, key);
            };

            win.IDBObjectStore.prototype.put = function(value, key) {
                if (app.__INCOGNITO_GLOBAL_STATE && this.name === 'history') {
                    return makeFakeRequest(win, key);
                }
                return originalPut.call(this, value, key);
            };
        }

        // 2. Suppress core webview navigation events
        if (win.EventTarget) {
            const originalAddEventListener = win.EventTarget.prototype.addEventListener;
            const blockedEvents = [
                'did-navigate',
                'did-navigate-in-page',
                'page-title-updated',
                'did-frame-navigate',
                'did-start-navigation',
                'did-redirect-navigation',
                'page-favicon-updated'
            ];

            win.EventTarget.prototype.addEventListener = function(type, listener, options) {
                const isWebView = this.tagName && this.tagName.toLowerCase() === 'webview';
                if (isWebView && blockedEvents.includes(type)) {
                    const stack = new win.Error().stack || '';
                    const isCoreViewer = stack.includes('app.js');
                    const wrappedListener = function(event) {
                        if (app.__INCOGNITO_GLOBAL_STATE && isCoreViewer) {
                            return;
                        }
                        return listener.apply(this, arguments);
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        }

        // 3. Spoof getURL and getTitle to avoid leaking state back to Obsidian app.js
        try {
            if (win.HTMLWebViewElement) {
                const originalGetURL = win.HTMLWebViewElement.prototype.getURL;
                win.HTMLWebViewElement.prototype.getURL = function() {
                    if (app.__INCOGNITO_GLOBAL_STATE) {
                        const stack = new win.Error().stack || '';
                        if (stack.includes('app.js')) return 'about:blank';
                    }
                    return originalGetURL.apply(this, arguments);
                };

                const originalGetTitle = win.HTMLWebViewElement.prototype.getTitle;
                win.HTMLWebViewElement.prototype.getTitle = function() {
                    if (app.__INCOGNITO_GLOBAL_STATE) {
                        const stack = new win.Error().stack || '';
                        if (stack.includes('app.js')) return 'Web Viewer';
                    }
                    return originalGetTitle.apply(this, arguments);
                };
            }
        } catch (e) {
            // Spoofing optionally bypassed if element prototype is missing
        }

        // 4. Hook .src property descriptors to prevent history logging during unload/saves
        try {
            const targetProto = win.HTMLWebViewElement ? win.HTMLWebViewElement.prototype : win.Element.prototype;
            const desc = Object.getOwnPropertyDescriptor(targetProto, 'src') ||
                         Object.getOwnPropertyDescriptor(win.Element.prototype, 'src');
            if (desc?.get) {
                const originalGet = desc.get;
                Object.defineProperty(targetProto, 'src', {
                    get: function() {
                        if (app.__INCOGNITO_GLOBAL_STATE) {
                            const stack = new win.Error().stack || '';
                            if (stack.includes('app.js') && (stack.includes('save') || stack.includes('history') || stack.includes('unload'))) {
                                return 'about:blank';
                            }
                        }
                        return originalGet.call(this);
                    },
                    set: desc.set,
                    configurable: true
                });
            }
        } catch (e) {
            // Getter hook optionally bypassed
        }

        // 5. Intercept setAttribute('partition') to enforce the private session
        if (win.Element) {
            const originalSetAttribute = win.Element.prototype.setAttribute;
            win.Element.prototype.setAttribute = function(name, value) {
                if (name.toLowerCase() === 'partition' && this.tagName?.toLowerCase() === 'webview') {
                    if (app.__INCOGNITO_GLOBAL_STATE) {
                        return originalSetAttribute.call(this, 'partition', 'temp-incognito-session');
                    }
                }
                return originalSetAttribute.call(this, name, value);
            };
        }

        // 6. Intercept createElement('webview')
        if (win.document) {
            const originalCreateElement = win.document.createElement;
            win.document.createElement = function(tagName, options) {
                const el = originalCreateElement.call(this, tagName, options);
                if (tagName.toLowerCase() === 'webview' && app.__INCOGNITO_GLOBAL_STATE) {
                    const originalSetAttribute = win.Element.prototype.setAttribute;
                    originalSetAttribute.call(el, 'partition', 'temp-incognito-session');
                }
                return el;
            };

            // Observer to enforce partition on dynamically injected webview nodes inside this window
            const observer = new win.MutationObserver((mutations) => {
                if (!app.__INCOGNITO_GLOBAL_STATE) return;
                const originalSetAttribute = win.Element.prototype.setAttribute;
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName?.toLowerCase() === 'webview') {
                            const current = node.getAttribute('partition') || '';
                            if (current !== 'temp-incognito-session') {
                                originalSetAttribute.call(node, 'partition', 'temp-incognito-session');
                            }
                        }
                    }
                }
            });
            observer.observe(win.document.documentElement, { childList: true, subtree: true });
        }
    }

    // ─── WEBCONTENTS LISTENER STRIPPING (ELECTRON) ───────────────────────────────
    if (!app.__INCOGNITO_ATTACH_LISTENER) {
        app.__INCOGNITO_ATTACH_LISTENER = (event, guestWebContents) => {
            if (app.__INCOGNITO_GLOBAL_STATE && guestWebContents) {
                guestWebContents.removeAllListeners('did-navigate');
                guestWebContents.removeAllListeners('did-navigate-in-page');
                guestWebContents.removeAllListeners('page-title-updated');

                const originalOn = guestWebContents.on;
                guestWebContents.on = function(evt, listener) {
                    if (['did-navigate', 'did-navigate-in-page', 'page-title-updated'].includes(evt)) {
                        return this;
                    }
                    return originalOn.apply(this, arguments);
                };
                guestWebContents.addListener = guestWebContents.on;
            }
        };
    }

    // Tracks which window webContents are already hooked to prevent memory leaks or duplicate events
    const hookedWebContentsIds = app.__INCOGNITO_HOOKED_WC_IDS || new Set();
    app.__INCOGNITO_HOOKED_WC_IDS = hookedWebContentsIds;

    function setupElectronListeners() {
        try {
            const { BrowserWindow } = require('@electron/remote');
            const bwins = BrowserWindow.getAllWindows();
            bwins.forEach(bwin => {
                const wc = bwin.webContents;
                if (wc && !hookedWebContentsIds.has(wc.id)) {
                    hookedWebContentsIds.add(wc.id);
                    wc.on('did-attach-webview', app.__INCOGNITO_ATTACH_LISTENER);
                }
            });
        } catch (err) {
            // Electron execution block optionally bypassed if not running in desktop environment
        }
    }

    // ─── MULTI-WINDOW STATE DISCOVERY ────────────────────────────────────────────
    const getActiveDOMWindows = () => {
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

    const applyToAllWindows = () => {
        const domWins = getActiveDOMWindows();
        
        // 1. Hook prototypes and DOM elements on all currently open windows
        domWins.forEach(hookDOMWindow);

        // 2. Attach Electron listeners to all underlying BrowserWindow instances
        setupElectronListeners();

        // 3. For any already loaded webviews, ensure correct partition representation if activating
        if (app.__INCOGNITO_GLOBAL_STATE) {
            const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
            domWins.forEach(win => {
                if (!win || !win.document) return;
                win.document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
                    const current = wv.getAttribute('partition') || '';
                    if (current !== 'temp-incognito-session') {
                        wv.setAttribute('partition', 'temp-incognito-session');
                    }
                });
            });
        }
    };

    // ─── LIFECYCLE MANAGEMENT ────────────────────────────────────────────────────
    if (!app.__INCOGNITO_INIT) {
        app.__INCOGNITO_INIT = true;
        let timer;
        const triggerApply = () => {
            clearTimeout(timer);
            timer = setTimeout(applyToAllWindows, 500);
        };
        app.workspace.on('layout-change', triggerApply);
        app.workspace.on('window-open', triggerApply);
    }

    // Run the script behaviors across all active windows immediately
    applyToAllWindows();

    new Notice(isActivating ? "🕵️ Webview Incognito: ON" : "🌐 Webview Incognito: OFF");
};