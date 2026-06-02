/**
 * modules/Incognito.js
 * Reshaped from WebviewDefault.js v2.2 — logic unchanged, outer wrapper converted to module class.
 */

export class IncognitoModule {
  constructor() {
    this.id = 'incognito';
    this.name = 'Incognito Mode';
    this.description = 'Prevents webviews from writing to Obsidian history';
    this.enabled = false;
    this._hookedWebContentsIds = new Set();
  }

  onEnable(app) {
    this._app = app;
    this._applyToAllWindows();
  }

  onDisable() {
    // Hooks are non-destructive when disabled — they check this.enabled at call time
  }

  onWebviewReady(webview) {
    if (!this.enabled) return;

    // Prevent periodic getAttribute/setAttribute polling every 5 seconds
    if (webview._incognitoAttached) return;
    webview._incognitoAttached = true;

    const current = webview.getAttribute('partition') || '';
    if (current !== 'temp-incognito-session') {
      webview.setAttribute('partition', 'temp-incognito-session');
    }
  }

  _makeFakeRequest(win, resultValue) {
    const req = {
      result: resultValue ?? null, error: null, readyState: 'done',
      onsuccess: null, onerror: null,
      addEventListener: () => {}, removeEventListener: () => {},
    };
    win.setTimeout(() => { if (typeof req.onsuccess === 'function') req.onsuccess({ target: req }); }, 0);
    return req;
  }

  _hookDOMWindow(win) {
    if (!win || win.__INCOGNITO_HOOKED) return;
    win.__INCOGNITO_HOOKED = true;
    const self = this;

    // 1. Block IDB writes to 'history'
    if (win.IDBObjectStore) {
      const originalAdd = win.IDBObjectStore.prototype.add;
      const originalPut = win.IDBObjectStore.prototype.put;
      win.IDBObjectStore.prototype.add = function(value, key) {
        if (self.enabled && this.name === 'history') return self._makeFakeRequest(win, key);
        return originalAdd.call(this, value, key);
      };
      win.IDBObjectStore.prototype.put = function(value, key) {
        if (self.enabled && this.name === 'history') return self._makeFakeRequest(win, key);
        return originalPut.call(this, value, key);
      };
    }

    // 2. Suppress core navigation events
    if (win.EventTarget) {
      const originalAddEventListener = win.EventTarget.prototype.addEventListener;
      const blockedEvents = ['did-navigate','did-navigate-in-page','page-title-updated','did-frame-navigate','did-start-navigation','did-redirect-navigation','page-favicon-updated'];
      win.EventTarget.prototype.addEventListener = function(type, listener, options) {
        const isWebView = this.tagName?.toLowerCase() === 'webview';
        if (isWebView && blockedEvents.includes(type)) {
          const stack = new win.Error().stack || '';
          const isCoreViewer = stack.includes('app.js');
          const wrappedListener = function(event) {
            if (self.enabled && isCoreViewer) return;
            return listener.apply(this, arguments);
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    }

    // 3. Spoof getURL / getTitle
    try {
      if (win.HTMLWebViewElement) {
        const originalGetURL = win.HTMLWebViewElement.prototype.getURL;
        win.HTMLWebViewElement.prototype.getURL = function() {
          if (self.enabled) { const stack = new win.Error().stack || ''; if (stack.includes('app.js')) return 'about:blank'; }
          return originalGetURL.apply(this, arguments);
        };
        const originalGetTitle = win.HTMLWebViewElement.prototype.getTitle;
        win.HTMLWebViewElement.prototype.getTitle = function() {
          if (self.enabled) { const stack = new win.Error().stack || ''; if (stack.includes('app.js')) return 'Web Viewer'; }
          return originalGetTitle.apply(this, arguments);
        };
      }
    } catch(e) {}

    // 4. Hook .src to prevent history logging during saves/unload
    try {
      const targetProto = win.HTMLWebViewElement ? win.HTMLWebViewElement.prototype : win.Element.prototype;
      const desc = Object.getOwnPropertyDescriptor(targetProto, 'src') || Object.getOwnPropertyDescriptor(win.Element.prototype, 'src');
      if (desc?.get) {
        const originalGet = desc.get;
        Object.defineProperty(targetProto, 'src', {
          get: function() {
            if (self.enabled) {
              const stack = new win.Error().stack || '';
              if (stack.includes('app.js') && (stack.includes('save') || stack.includes('history') || stack.includes('unload'))) return 'about:blank';
            }
            return originalGet.call(this);
          },
          set: desc.set, configurable: true
        });
      }
    } catch(e) {}

    // 5. Intercept setAttribute('partition')
    if (win.Element) {
      const originalSetAttribute = win.Element.prototype.setAttribute;
      win.Element.prototype.setAttribute = function(name, value) {
        if (name.toLowerCase() === 'partition' && this.tagName?.toLowerCase() === 'webview' && self.enabled) {
          return originalSetAttribute.call(this, 'partition', 'temp-incognito-session');
        }
        return originalSetAttribute.call(this, name, value);
      };
    }

    // 6. Intercept createElement('webview') and watch DOM for injected webviews
    if (win.document) {
      const originalCreateElement = win.document.createElement;
      win.document.createElement = function(tagName, options) {
        const el = originalCreateElement.call(this, tagName, options);
        if (tagName.toLowerCase() === 'webview' && self.enabled) {
          win.Element.prototype.setAttribute.call(el, 'partition', 'temp-incognito-session');
        }
        return el;
      };

      const observer = new win.MutationObserver((mutations) => {
        if (!self.enabled) return;
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.tagName?.toLowerCase() === 'webview') {
              const current = node.getAttribute('partition') || '';
              if (current !== 'temp-incognito-session') {
                win.Element.prototype.setAttribute.call(node, 'partition', 'temp-incognito-session');
              }
            }
          }
        }
      });
      observer.observe(win.document.documentElement, { childList: true, subtree: true });
    }
  }

  _setupElectronListeners() {
    try {
      const { BrowserWindow } = require('@electron/remote');
      BrowserWindow.getAllWindows().forEach(bwin => {
        const wc = bwin.webContents;
        if (wc && !this._hookedWebContentsIds.has(wc.id)) {
          this._hookedWebContentsIds.add(wc.id);
          wc.on('did-attach-webview', (event, guestWebContents) => {
            if (this.enabled && guestWebContents) {
              guestWebContents.removeAllListeners('did-navigate');
              guestWebContents.removeAllListeners('did-navigate-in-page');
              guestWebContents.removeAllListeners('page-title-updated');
              const originalOn = guestWebContents.on;
              guestWebContents.on = function(evt, listener) {
                if (['did-navigate','did-navigate-in-page','page-title-updated'].includes(evt)) return this;
                return originalOn.apply(this, arguments);
              };
              guestWebContents.addListener = guestWebContents.on;
            }
          });
        }
      });
    } catch(err) {}
  }

  _getActiveWindows() {
    const windows = new Set([window]);
    const floatingSplit = this._app?.workspace?.floatingSplit;
    if (floatingSplit?.children) floatingSplit.children.forEach(c => { if (c.win) windows.add(c.win); });
    return Array.from(windows);
  }

  _applyToAllWindows() {
    const domWins = this._getActiveWindows();
    domWins.forEach(w => this._hookDOMWindow(w));
    this._setupElectronListeners();
    if (this.enabled) {
      const SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
      domWins.forEach(win => {
        if (!win?.document) return;
        win.document.querySelectorAll(SELECTOR).forEach(wv => {
          if ((wv.getAttribute('partition') || '') !== 'temp-incognito-session') {
            wv.setAttribute('partition', 'temp-incognito-session');
          }
        });
      });
    }
  }
}