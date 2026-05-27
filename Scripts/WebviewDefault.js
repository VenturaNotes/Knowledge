/**
 * WebviewDefault.js
 * Version: 2.1 - DOM Hooks + WebContents Stripping + IDB Write Blocking
 */

module.exports = async (params) => {
    const { app } = params;

    const isFirstRun = window.__INCOGNITO_GLOBAL_STATE === undefined;

    if (isFirstRun) {
        window.__INCOGNITO_GLOBAL_STATE = true;
        // console.log("WebviewIncognito [DEBUG]: Initialized. Incognito mode is OFF by default on startup.");
    } else {
        window.__INCOGNITO_GLOBAL_STATE = !window.__INCOGNITO_GLOBAL_STATE;
    }

    const isActivating = window.__INCOGNITO_GLOBAL_STATE;

    // ─── IDB WRITE BLOCK ──────────────────────────────────────────────────────────
    function makeFakeRequest(resultValue) {
        const req = {
            result: resultValue ?? null,
            error: null,
            readyState: 'done',
            onsuccess: null,
            onerror: null,
            addEventListener: () => {},
            removeEventListener: () => {},
        };
        setTimeout(() => { if (typeof req.onsuccess === 'function') req.onsuccess({ target: req }); }, 0);
        return req;
    }

    if (!window.__INCOGNITO_IDB_HOOKED) {
        window.__INCOGNITO_IDB_HOOKED = true;

        const originalAdd = IDBObjectStore.prototype.add;
        const originalPut = IDBObjectStore.prototype.put;

        IDBObjectStore.prototype.add = function(value, key) {
            if (window.__INCOGNITO_GLOBAL_STATE && this.name === 'history') {
                // console.log("WebviewIncognito [DEBUG]: Blocked IDB history write (add):", value);
                return makeFakeRequest(key);
            }
            return originalAdd.call(this, value, key);
        };

        IDBObjectStore.prototype.put = function(value, key) {
            if (window.__INCOGNITO_GLOBAL_STATE && this.name === 'history') {
                // console.log("WebviewIncognito [DEBUG]: Blocked IDB history write (put):", value);
                return makeFakeRequest(key);
            }
            return originalPut.call(this, value, key);
        };

        // console.log("WebviewIncognito [DEBUG]: IDBObjectStore write hook active.");
    }

    // ─── DOM-LEVEL ENFORCEMENT ────────────────────────────────────────────────────
    if (!window.__INCOGNITO_DOM_HOOKED) {
        window.__INCOGNITO_DOM_HOOKED = true;

        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const blockedEvents = [
            'did-navigate',
            'did-navigate-in-page',
            'page-title-updated',
            'did-frame-navigate',
            'did-start-navigation',
            'did-redirect-navigation',
            'page-favicon-updated'
        ];

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const isWebView = this.tagName && this.tagName.toLowerCase() === 'webview';
            if (isWebView && blockedEvents.includes(type)) {
                const stack = new Error().stack || '';
                const isCoreViewer = stack.includes('app.js');
                const wrappedListener = function(event) {
                    if (window.__INCOGNITO_GLOBAL_STATE && isCoreViewer) {
                        // console.log(`WebviewIncognito [DEBUG]: Suppressed core webview "${type}" event.`);
                        return;
                    }
                    return listener.apply(this, arguments);
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        try {
            if (window.HTMLWebViewElement) {
                const originalGetURL = HTMLWebViewElement.prototype.getURL;
                HTMLWebViewElement.prototype.getURL = function() {
                    if (window.__INCOGNITO_GLOBAL_STATE) {
                        const stack = new Error().stack || '';
                        if (stack.includes('app.js')) return 'about:blank';
                    }
                    return originalGetURL.apply(this, arguments);
                };

                const originalGetTitle = HTMLWebViewElement.prototype.getTitle;
                HTMLWebViewElement.prototype.getTitle = function() {
                    if (window.__INCOGNITO_GLOBAL_STATE) {
                        const stack = new Error().stack || '';
                        if (stack.includes('app.js')) return 'Web Viewer';
                    }
                    return originalGetTitle.apply(this, arguments);
                };
            }
        } catch (e) {
            // console.warn("WebviewIncognito [DEBUG]: Failed to spoof prototype methods:", e);
        }

        try {
            const targetProto = window.HTMLWebViewElement ? HTMLWebViewElement.prototype : Element.prototype;
            const desc = Object.getOwnPropertyDescriptor(targetProto, 'src') ||
                         Object.getOwnPropertyDescriptor(Element.prototype, 'src');
            if (desc?.get) {
                const originalGet = desc.get;
                Object.defineProperty(targetProto, 'src', {
                    get: function() {
                        if (window.__INCOGNITO_GLOBAL_STATE) {
                            const stack = new Error().stack || '';
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
            // console.warn("WebviewIncognito [DEBUG]: Failed to hook .src getter:", e);
        }

        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (name.toLowerCase() === 'partition' && this.tagName?.toLowerCase() === 'webview') {
                if (window.__INCOGNITO_GLOBAL_STATE) {
                    // console.log(`WebviewIncognito [DEBUG]: Hijacked setAttribute('partition') → "temp-incognito-session" (blocked: "${value}").`);
                    return originalSetAttribute.call(this, 'partition', 'temp-incognito-session');
                }
            }
            return originalSetAttribute.call(this, name, value);
        };

        const originalCreateElement = document.createElement;
        document.createElement = function(tagName, options) {
            const el = originalCreateElement.call(this, tagName, options);
            if (tagName.toLowerCase() === 'webview' && window.__INCOGNITO_GLOBAL_STATE) {
                // console.log("WebviewIncognito [DEBUG]: Hijacked createElement('webview') → partition set to 'temp-incognito-session'.");
                originalSetAttribute.call(el, 'partition', 'temp-incognito-session');
            }
            return el;
        };

        const observer = new MutationObserver((mutations) => {
            if (!window.__INCOGNITO_GLOBAL_STATE) return;
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
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // ─── WEBCONTENTS LISTENER STRIPPING ──────────────────────────────────────────
    try {
        const { getCurrentWebContents } = require('@electron/remote');
        const hostWebContents = getCurrentWebContents();

        const attachListener = (event, guestWebContents) => {
            if (window.__INCOGNITO_GLOBAL_STATE && guestWebContents) {
                // console.log("WebviewIncognito [DEBUG]: Guest WebContents attached — stripping history listeners.");
                guestWebContents.removeAllListeners('did-navigate');
                guestWebContents.removeAllListeners('did-navigate-in-page');
                guestWebContents.removeAllListeners('page-title-updated');

                const originalOn = guestWebContents.on;
                guestWebContents.on = function(evt, listener) {
                    if (['did-navigate', 'did-navigate-in-page', 'page-title-updated'].includes(evt)) {
                        // console.log(`WebviewIncognito [DEBUG]: Blocked guest WebContents.on('${evt}') re-registration.`);
                        return this;
                    }
                    return originalOn.apply(this, arguments);
                };
                guestWebContents.addListener = guestWebContents.on;
            }
        };

        if (window.__INCOGNITO_ATTACH_LISTENER) {
            hostWebContents.removeListener('did-attach-webview', window.__INCOGNITO_ATTACH_LISTENER);
        }
        window.__INCOGNITO_ATTACH_LISTENER = attachListener;
        hostWebContents.on('did-attach-webview', attachListener);

        const originalCleanup = window.__INCOGNITO_CLEANUP;
        window.__INCOGNITO_CLEANUP = () => {
            if (originalCleanup) originalCleanup();
            if (window.__INCOGNITO_ATTACH_LISTENER) {
                hostWebContents.removeListener('did-attach-webview', window.__INCOGNITO_ATTACH_LISTENER);
                delete window.__INCOGNITO_ATTACH_LISTENER;
            }
        };
    } catch (err) {
        // console.error("WebviewIncognito [DEBUG]: Failed to initialize WebContents listeners:", err);
    }

    // ─── ACTIVATION / DEACTIVATION ───────────────────────────────────────────────
    new Notice(isActivating ? "🕵️ Webview Incognito: ON" : "🌐 Webview Incognito: OFF");
};