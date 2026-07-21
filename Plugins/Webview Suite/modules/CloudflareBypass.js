/**
 * modules/CloudflareBypass.js
 * 
 * Contains both the built-in Isolated Browser view class and the bypass module.
 *
 * Dynamically writes a local Firefox preload script applied via "file:" protocol,
 * while stripping Chrome Client Hints from outbound headers. This projects a 
 * consistent Firefox footprint to successfully pass Turnstile verification.
 *
 * Exposes a highly minimal, full-width address bar user interface with native
 * Obsidian header elements disabled to maximize vertical screen space.
 */

import { ItemView, setIcon, Notice, WorkspaceLeaf } from 'obsidian';

// Registered to perfectly match the data-type selector used in your styles.css
export const VIEW_TYPE_ISOLATED_WEBVIEW = 'custom-webview-view';

// Standard Firefox ESR User Agent
const FIREFOX_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0";

// ─── STEALTH INJECTION CODE (SPOOFS BROWSER OBJECTS BEFORE PAGE EXECUTION) ──
const STEALTH_PRELOAD_CODE = `
  (function() {
    // Stealth helper to mask spoofed getters with standard native signatures
    const makeNative = (fn, name) => {
      try {
        Object.defineProperty(fn, 'name', { value: name, configurable: true });
        Object.defineProperty(fn, 'toString', {
          value: () => "function " + name + "() { [native code] }",
          configurable: true
        });
      } catch (e) {}
    };

    // 1. Force Firefox User Agent on Prototype
    try {
      const uaGetter = () => "${FIREFOX_UA}";
      makeNative(uaGetter, "get userAgent");
      Object.defineProperty(Navigator.prototype, 'userAgent', {
        get: uaGetter,
        configurable: true
      });
    } catch (e) {}

    // 2. Delete and nullify userAgentData (Not supported in Firefox)
    try {
      const uadGetter = () => undefined;
      makeNative(uadGetter, "get userAgentData");
      Object.defineProperty(Navigator.prototype, 'userAgentData', {
        get: uadGetter,
        configurable: true
      });
    } catch (e) {}

    // 3. Clear window.chrome (Not supported in Firefox)
    try {
      if (window.chrome) {
        delete window.chrome;
      }
      const chromeGetter = () => undefined;
      makeNative(chromeGetter, "get chrome");
      Object.defineProperty(window, 'chrome', {
        get: chromeGetter,
        configurable: true
      });
    } catch (e) {}

    // 4. Force webdriver automated browser flag to false
    try {
      const webdriverGetter = () => false;
      makeNative(webdriverGetter, "get webdriver");
      Object.defineProperty(Navigator.prototype, 'webdriver', {
        get: webdriverGetter,
        configurable: true
      });
    } catch (e) {}

    // 5. Force standard languages list
    try {
      const langGetter = () => ['en-US', 'en'];
      makeNative(langGetter, "get languages");
      Object.defineProperty(Navigator.prototype, 'languages', {
        get: langGetter,
        configurable: true
      });
    } catch (e) {}
  })();
`;

export const STEALTH_PRELOAD_URL = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(STEALTH_PRELOAD_CODE)));

// ─── 1. BUILT-IN ISOLATED BROWSER VIEW CLASS ────────────────────────────────
export class IsolatedWebView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentUrl = '';
    this.currentTitle = 'Isolated Browser';
    
    // Disables Obsidian's native view header/action bar completely to reclaim space
    this.navigation = false; 
  }

  getViewType() {
    return VIEW_TYPE_ISOLATED_WEBVIEW;
  }

  getDisplayText() {
    return this.currentTitle;
  }

  // ─── OBSIDIAN STATE MANAGEMENT (UNDO CLOSE TAB / WORKSPACE RESTORE) ───
  getState() {
    return {
      url: this.currentUrl,
      title: this.currentTitle
    };
  }

  async setState(state, result) {
    await super.setState(state, result);
    
    if (state && state.url) {
      this.currentUrl = state.url;
      if (this.addressBar) this.addressBar.value = this.currentUrl;
      if (this.webviewEl && this.webviewEl.src !== this.currentUrl) {
        this.webviewEl.src = this.currentUrl;
      }
    }
    
    if (state && state.title) {
      this.currentTitle = state.title;
      const leafAny = this.leaf;
      if (leafAny.tabHeaderInnerTitleEl) {
        leafAny.tabHeaderInnerTitleEl.setText(this.currentTitle);
      }
    }
  }
  // ────────────────────────────────────────────────────────────────────────

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('custom-webview-container');

    // Create the navigation header (Minimal layout styled via styles.css)
    const header = container.createEl('div', { cls: 'custom-webview-header' });

    // Left Navigation Icon Buttons
    const navLeft = header.createEl('div', { cls: 'custom-webview-nav-buttons' });

    this.backBtn = navLeft.createEl('button', { cls: 'custom-webview-btn', title: 'Go back' });
    setIcon(this.backBtn, 'arrow-left');
    this.backBtn.disabled = true;
    this.backBtn.addEventListener('click', () => {
      if (this.webviewEl && this.webviewEl.canGoBack()) this.webviewEl.goBack();
    });

    this.forwardBtn = navLeft.createEl('button', { cls: 'custom-webview-btn', title: 'Go forward' });
    setIcon(this.forwardBtn, 'arrow-right');
    this.forwardBtn.disabled = true;
    this.forwardBtn.addEventListener('click', () => {
      if (this.webviewEl && this.webviewEl.canGoForward()) this.webviewEl.goForward();
    });

    this.reloadBtn = navLeft.createEl('button', { cls: 'custom-webview-btn', title: 'Reload page' });
    setIcon(this.reloadBtn, 'rotate-cw');
    this.reloadBtn.addEventListener('click', () => {
      if (this.webviewEl) this.webviewEl.reload();
    });

    // Native Obsidian Address Bar Input
    this.addressBar = header.createEl('input', {
      type: 'text',
      cls: 'custom-webview-addressbar',
      value: this.currentUrl
    });

    this.addressBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        let targetUrl = this.addressBar.value.trim();
        if (targetUrl) {
          if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;
          this.navigateTo(targetUrl);
        }
      }
    });

    // Appending 'webviewer-content' allows Commands.js & DarkMode.js to find this element
    this.webviewWrapper = container.createEl('div', { cls: 'custom-webview-wrapper webviewer-content' });

    this.rebuildWebview(this.currentUrl);
  }

  navigateTo(url) {
    this.currentUrl = url;
    if (this.webviewEl) {
      this.webviewEl.src = url;
    }
    this.app.workspace.requestSaveLayout();
  }

  rebuildWebview(url) {
    if (this.webviewEl) {
      this.webviewEl.remove();
    }

    this.webviewEl = document.createElement('webview');
    this.webviewEl.style.cssText = 'width: 100%; height: 100%; border: none; background: #fff;';
    
    const isolatedPartition = 'persist:webview-suite-isolated-session';
    this.webviewEl.setAttribute('partition', isolatedPartition);
    this.webviewEl.setAttribute('allowpopups', 'true');
    this.webviewEl.setAttribute('webpreferences', 'contextIsolation=no, sandbox=no, nodeIntegration=no');

    this.webviewEl.setAttribute('useragent', FIREFOX_UA);

    const bypassModule = this.plugin.modules.cloudflareBypass;
    if (bypassModule && bypassModule.preloadFileUrl) {
      this.webviewEl.setAttribute('preload', bypassModule.preloadFileUrl);
    }

    this.attachWebviewListeners();
    this.webviewWrapper.appendChild(this.webviewEl);

    if (this.plugin?.manager) {
      setTimeout(() => this.plugin.manager.findAndAttach(), 150);
    }

    if (url) {
      this.webviewEl.src = url;
    }
  }

  attachWebviewListeners() {
    const startSpinner = () => {
      this.reloadBtn.classList.add('is-loading');
    };

    const stopSpinner = () => {
      this.reloadBtn.classList.remove('is-loading');
    };

    const updateNavState = () => {
      try {
        const activeUrl = this.webviewEl.getURL() || this.webviewEl.src;
        
        // If the URL changed, update state and ask Obsidian to record it for undo history
        if (this.currentUrl !== activeUrl) {
          this.currentUrl = activeUrl;
          this.addressBar.value = activeUrl;
          this.app.workspace.requestSaveLayout();
        }

        this.backBtn.disabled = !this.webviewEl.canGoBack();
        this.forwardBtn.disabled = !this.webviewEl.canGoForward();
        
        // Failsafe: if the navigation resolves and the webview isn't loading anymore, force stop
        if (!this.webviewEl.isLoading()) {
          stopSpinner();
        }
      } catch (e) {}
    };

    this.webviewEl.addEventListener('did-navigate', updateNavState);
    this.webviewEl.addEventListener('did-navigate-in-page', updateNavState);

    // ─── ROBUST LOADING SPINNER EVENTS ───
    this.webviewEl.addEventListener('did-start-loading', startSpinner);
    this.webviewEl.addEventListener('did-start-navigation', (e) => {
      if (e.isMainFrame) startSpinner();
    });

    this.webviewEl.addEventListener('did-stop-loading', stopSpinner);
    this.webviewEl.addEventListener('did-finish-load', stopSpinner);
    this.webviewEl.addEventListener('did-fail-load', stopSpinner);

    // NATIVE HOTKEY BUBBLER: Replicates Obsidian core webview functionality. 
    this.webviewEl.addEventListener('dom-ready', () => {
      try {
        const remote = require('@electron/remote');
        if (!remote || !remote.webContents) return;
        
        const wcId = this.webviewEl.getWebContentsId();
        
        // Prevent duplicate ghost listeners from @electron/remote proxies across URL navigations
        if (this.webviewEl.__bubblerAttachedTo === wcId) return;
        this.webviewEl.__bubblerAttachedTo = wcId;
        
        const wc = remote.webContents.fromId(wcId);
        
        if (wc) {
          wc.on('before-input-event', (event, input) => {
            if (input.type !== 'keyDown') return;
            
            const win = this.webviewEl.ownerDocument?.defaultView || window;
            const target = this.webviewEl || win.document.activeElement || win.document.body;
            
            const kbEvent = new win.KeyboardEvent('keydown', {
              key: input.key,
              code: input.code,
              bubbles: true,
              cancelable: true,
              ctrlKey: input.control,
              altKey: input.alt,
              shiftKey: input.shift,
              metaKey: input.meta,
              repeat: input.isAutoRepeat
            });
            
            target.dispatchEvent(kbEvent);
          });
        }
      } catch (err) {
        console.error('[IsolatedWebView] Failed to bind hotkey bubbler:', err);
      }
    });

    this.webviewEl.addEventListener('page-title-updated', (e) => {
      this.currentTitle = e.title || 'Isolated Browser';
      const leafAny = this.leaf;
      if (leafAny.tabHeaderInnerTitleEl) {
        leafAny.tabHeaderInnerTitleEl.setText(this.currentTitle);
      }
      this.app.workspace.requestSaveLayout();
    });
  }
}

// ─── 2. BYPASS & ROUTING MODULE CLASS ────────────────────────────────────────
export class CloudflareBypassModule {
  constructor() {
    this.id = 'cloudflareBypass';
    this.name = 'Cloudflare Bypass';
    this.description = 'Modifies network headers and redirects native webviews to the built-in Isolated Web Viewer';
    this.enabled = true;
    this.app = null;
    this.bypassDomains = []; 
    
    this._hookedSessions = new Set();
    this._commands = [];
    this._unhandledRejectionHandler = null;
    this.preloadFileUrl = '';

    this._globalClickHandler = null;
    this._windowOpenRef = null;
  }

  onEnable(app) {
    this.app = app;
    this._registerCommands();
    this._installGlobalErrorShield();
    this._installGlobalLinkInterceptor();
    this._injectCSSStyles();
    
    // Write preload script to disk first, then set up webviews
    this._writePreloadScript().then(() => {
      const electronSession = this._getElectronSession();
      if (electronSession) {
        this._applyBypassToSession(electronSession.defaultSession);
        if (this.app?.appId) {
          const vaultSess = electronSession.fromPartition(`persist:vault-${this.app.appId}`);
          if (vaultSess) this._applyBypassToSession(vaultSess);
        }
      }
      this.reapplyToExistingWebviews();
    });
  }

  onDisable() {
    this._unregisterCommands();
    this._removeGlobalErrorShield();
    this._removeGlobalLinkInterceptor();
    this._removeCSSStyles();
    this.removeHeaderInterceptor();
    this.restoreOriginalUAs();
  }

  setBypassDomains(domains) {
    this.bypassDomains = domains || [];
    if (this.enabled && this.app) {
      this._hookedSessions.forEach(sess => this._hookSessionWebRequest(sess));
      this.reapplyToExistingWebviews();
    }
  }

  _shouldInterceptUrl(urlStr) {
    if (!this.enabled || !urlStr) return false;
    try {
      const hostname = new URL(urlStr).hostname.toLowerCase();
      const isBypass = this.bypassDomains.some(domain => {
        const cleanDom = domain.toLowerCase().trim();
        return hostname === cleanDom || hostname.endsWith('.' + cleanDom);
      });
      return isBypass || hostname.includes('cloudflare.com');
    } catch(e) {
      return false;
    }
  }

  // ─── GLOBAL BACKGROUND LINK INTERCEPTORS ───
  _installGlobalLinkInterceptor() {
    // 1. Monkey-patch window.open to catch programmatic opens (e.g. from plugins)
    if (!window.__ORIGINAL_WINDOW_OPEN) {
      window.__ORIGINAL_WINDOW_OPEN = window.open;
    }

    window.open = (url, name, features) => {
      if (this._shouldInterceptUrl(url)) {
        const newLeaf = this.app.workspace.getLeaf('tab');
        newLeaf.setViewState({
          type: VIEW_TYPE_ISOLATED_WEBVIEW,
          active: true,
          state: { url: url }
        });
        return null; // Stop the native window from spawning
      }
      return window.__ORIGINAL_WINDOW_OPEN(url, name, features);
    };

    // 2. Global capture-phase click listener to intercept Markdown/UI links instantly
    this._globalClickHandler = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      
      const url = anchor.href || anchor.getAttribute('href');
      if (!url || !url.startsWith('http')) return;

      if (this._shouldInterceptUrl(url)) {
        e.preventDefault();
        e.stopPropagation(); // Stops Obsidian from processing the link

        const newLeaf = this.app.workspace.getLeaf('tab');
        newLeaf.setViewState({
          type: VIEW_TYPE_ISOLATED_WEBVIEW,
          active: true,
          state: { url: url }
        });
      }
    };

    // Apply to main window and any current floating popout windows
    const windows = this._getActiveWindows();
    windows.forEach(win => {
      if (!win._cfLinkInterceptorAttached) {
        win._cfLinkInterceptorAttached = true;
        win.document.addEventListener('click', this._globalClickHandler, { capture: true });
      }
    });
    
    // Automatically attach to any new popout windows created in the future
    this._windowOpenRef = this.app.workspace.on('window-open', (child) => {
      const win = child.win;
      if (win && !win._cfLinkInterceptorAttached) {
        win._cfLinkInterceptorAttached = true;
        win.document.addEventListener('click', this._globalClickHandler, { capture: true });
      }
    });

    // 3. THE CORE BOTTLENECK: Monkey-patch WorkspaceLeaf.prototype.setViewState
    // Intercepts any programmatic tab creations (like target="_blank" inside webviews)
    // and seamlessly morphs the tab into our IsolatedWebView before any standard webview initializes.
    if (!WorkspaceLeaf.prototype.__originalSetViewState) {
      WorkspaceLeaf.prototype.__originalSetViewState = WorkspaceLeaf.prototype.setViewState;
    }

    const self = this;
    WorkspaceLeaf.prototype.setViewState = function(state, ...args) {
      if (state && state.type !== VIEW_TYPE_ISOLATED_WEBVIEW) {
        const url = state.state?.url || state.state?.src || state.url || '';
        if (url && self._shouldInterceptUrl(url)) {
          state.type = VIEW_TYPE_ISOLATED_WEBVIEW;
        }
      }
      return this.__originalSetViewState(state, ...args);
    };
  }

  _removeGlobalLinkInterceptor() {
    if (window.__ORIGINAL_WINDOW_OPEN) {
      window.open = window.__ORIGINAL_WINDOW_OPEN;
      delete window.__ORIGINAL_WINDOW_OPEN;
    }
    
    if (this._globalClickHandler) {
      const windows = this._getActiveWindows();
      windows.forEach(win => {
        if (win._cfLinkInterceptorAttached) {
          win.document.removeEventListener('click', this._globalClickHandler, { capture: true });
          delete win._cfLinkInterceptorAttached;
        }
      });
    }

    if (this._windowOpenRef) {
      this.app.workspace.offref(this._windowOpenRef);
      this._windowOpenRef = null;
    }

    if (WorkspaceLeaf.prototype.__originalSetViewState) {
      WorkspaceLeaf.prototype.setViewState = WorkspaceLeaf.prototype.__originalSetViewState;
      delete WorkspaceLeaf.prototype.__originalSetViewState;
    }
  }
  // ──────────────────────────────────────────

  _cleanUAString(ua) {
    if (!ua) return '';
    return ua
      .replace(/\s*(Electron|obsidian|Obsidian)\/[^\s]+/ig, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  _injectChromeClientHints(headers, cleanUA) {
    try {
      const match = cleanUA.match(/Chrome\/([^\s]+)/i);
      let fullVersion = "120.0.6099.291"; 
      if (match && match[1]) {
        fullVersion = match[1];
      }
      const majorVersion = fullVersion.split('.')[0];

      const rawPlatform = typeof process !== 'undefined' ? process.platform : 'darwin';
      const platformMap = { darwin: '"macOS"', win32: '"Windows"', linux: '"Linux"' };
      const platformStr = platformMap[rawPlatform] || '"macOS"';

      const hints = {
        'Sec-CH-UA': `"Not_A Brand";v="8", "Chromium";v="${majorVersion}", "Google Chrome";v="${majorVersion}"`,
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': platformStr,
        'Sec-CH-UA-Platform-Version': rawPlatform === 'darwin' ? '"15.0.0"' : '"10.0.0"',
        'Sec-CH-UA-Full-Version-List': `"Not_A Brand";v="8.0.0.0", "Chromium";v="${fullVersion}", "Google Chrome";v="${fullVersion}"`
      };

      const headerKeysLower = Object.keys(headers).reduce((acc, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
      }, {});

      Object.entries(hints).forEach(([hintKey, hintVal]) => {
        const lowerKey = hintKey.toLowerCase();
        if (headerKeysLower[lowerKey]) {
          headers[headerKeysLower[lowerKey]] = hintVal;
        } else {
          headers[hintKey] = hintVal;
        }
      });
    } catch (e) {
      console.error('[CloudflareBypass] Error injecting Client Hints:', e);
    }
  }

  _getElectronSession() {
    let electronSession;
    try { electronSession = require('electron').session; } catch (err) {}
    if (!electronSession) {
      try { electronSession = require('@electron/remote').session; } catch (err) {}
    }
    return electronSession;
  }

  _applyBypassToSession(sess) {
    if (!sess || this._hookedSessions.has(sess)) return;
    this._hookedSessions.add(sess);

    let isIsolated = false;
    try {
      const partition = typeof sess.getPartition === 'function' ? sess.getPartition() : '';
      isIsolated = partition.includes('isolated-session');
    } catch (e) {}

    const currentUA = sess.getUserAgent();
    if (isIsolated || /Electron|obsidian/i.test(currentUA)) {
      sess.setUserAgent(FIREFOX_UA);
    }

    this._hookSessionWebRequest(sess);
  }

  onWebviewReady(webview) {
    if (!this.enabled) return;

    const partitionStr = webview.getAttribute('partition') || '';
    const electronSession = this._getElectronSession();
    if (!electronSession) return;

    const sess = partitionStr 
      ? electronSession.fromPartition(partitionStr) 
      : electronSession.defaultSession;

    if (sess) {
      this._applyBypassToSession(sess);
    }

    if (webview._cfBypassAttached) return;
    webview._cfBypassAttached = true;

    const applyUA = () => {
      try {
        const urlStr = webview.getURL() || webview.src || '';
        if (!urlStr || urlStr.startsWith('about:blank')) return;

        // ─── 1. RESOLVE THE CONTAINING LEAF ───
        let leaf = null;
        this.app.workspace.iterateAllLeaves(l => {
          if (l.view?.containerEl?.contains(webview)) {
            leaf = l;
          }
        });
        if (!leaf) return;

        const viewType = leaf.view?.getViewType() || '';

        // ─── 2. TRIGGER REDIRECTION (FALLBACK) IF WEBVIEW IS NATIVE & IS BYPASS DOMAIN ───
        if (this._shouldInterceptUrl(urlStr) && viewType !== VIEW_TYPE_ISOLATED_WEBVIEW) {
          if (webview._redirected) return;
          webview._redirected = true;

          new Notice(`Redirecting to Built-in Isolated Browser...`);
          
          try { webview.stop(); } catch(e) {}

          setTimeout(async () => {
            try {
              await leaf.setViewState({
                type: VIEW_TYPE_ISOLATED_WEBVIEW,
                active: true,
                state: { url: urlStr }
              });
              const view = leaf.view;
              if (view && typeof view.navigateTo === 'function') {
                view.navigateTo(urlStr);
              }
            } catch (err) {
              console.error('[CloudflareBypass] Failed to redirect leaf:', err);
            }
          }, 50);

          return;
        }

        const isIsolated = viewType === VIEW_TYPE_ISOLATED_WEBVIEW;
        const shouldApplyBypass = isIsolated || this._shouldInterceptUrl(urlStr);

        if (shouldApplyBypass && this.preloadFileUrl) {
          const currentPreload = webview.getAttribute('preload') || '';
          
          if (currentPreload !== this.preloadFileUrl) {
            webview.setAttribute('preload', this.preloadFileUrl);
            webview.setAttribute('useragent', FIREFOX_UA);
            webview.setUserAgent(FIREFOX_UA);
            
            if (!webview._cfBypassReloaded) {
              webview._cfBypassReloaded = true;
              webview.reload();
            }
          }
        }
      } catch (e) {}
    };

    webview.addEventListener('did-start-navigation', applyUA);
    applyUA();
  }

  // Safely writes a Firefox stealth script to your local plugin directory
  async _writePreloadScript() {
    const pluginDir = this.app.vault.configDir + '/plugins/webview-suite';
    const localPath = `${pluginDir}/preload.js`;
    
    // Stealth code with native Object.defineProperty and function toString override
    const preloadCode = `
      (function() {
        const makeNative = (fn, name) => {
          try {
            Object.defineProperty(fn, 'name', { value: name, configurable: true });
            Object.defineProperty(fn, 'toString', {
              value: () => "function " + name + "() { [native code] }",
              configurable: true
            });
          } catch (e) {}
        };

        // 1. Force Firefox User Agent on Prototype
        try {
          const uaGetter = () => "${FIREFOX_UA}";
          makeNative(uaGetter, "get userAgent");
          Object.defineProperty(Navigator.prototype, 'userAgent', {
            get: uaGetter,
            configurable: true
          });
        } catch (e) {}

        // 2. Delete and nullify userAgentData (Not supported in Firefox)
        try {
          const uadGetter = () => undefined;
          makeNative(uadGetter, "get userAgentData");
          Object.defineProperty(Navigator.prototype, 'userAgentData', {
            get: uadGetter,
            configurable: true
          });
        } catch (e) {}

        // 3. Delete window.chrome (Firefox does not support Extension runtime globals)
        try {
          if (window.chrome) {
            delete window.chrome;
          }
          const chromeGetter = () => undefined;
          makeNative(chromeGetter, "get chrome");
          Object.defineProperty(window, 'chrome', {
            get: chromeGetter,
            configurable: true
          });
        } catch (e) {}

        // 4. Force webdriver automated browser flag to false
        try {
          const webdriverGetter = () => false;
          makeNative(webdriverGetter, "get webdriver");
          Object.defineProperty(Navigator.prototype, 'webdriver', {
            get: webdriverGetter,
            configurable: true
          });
        } catch (e) {}

        // 5. Force standard languages list
        try {
          const langGetter = () => ['en-US', 'en'];
          makeNative(langGetter, "get languages");
          Object.defineProperty(Navigator.prototype, 'languages', {
            get: langGetter,
            configurable: true
          });
        } catch (e) {}
      })();
    `;

    try {
      await this.app.vault.adapter.write(localPath, preloadCode);
      
      let absolutePath = '';
      if (typeof this.app.vault.adapter.getAbsoluteFilePath === 'function') {
        absolutePath = this.app.vault.adapter.getAbsoluteFilePath(localPath);
      } else {
        const basePath = this.app.vault.adapter.getBasePath();
        absolutePath = require('path').join(basePath, localPath);
      }
      
      // Standardize Windows backslashes and construct a clean file-schema URL
      let fileUrl = absolutePath.replace(/\\/g, '/');
      if (!fileUrl.startsWith('/')) {
        fileUrl = '/' + fileUrl;
      }
      this.preloadFileUrl = 'file://' + fileUrl;
      console.log('[CloudflareBypass] Written local preload script:', this.preloadFileUrl);
    } catch (err) {
      console.error('[CloudflareBypass] Failed to write local preload script:', err);
    }
  }

  _hookSessionWebRequest(sess) {
    if (!sess) return;
    try { sess.webRequest.onBeforeSendHeaders({ urls: ['*://*/*'] }, null); } catch(e) {}

    let isIsolated = false;
    try {
      const partition = typeof sess.getPartition === 'function' ? sess.getPartition() : '';
      isIsolated = partition.includes('isolated-session');
    } catch (e) {}

    sess.webRequest.onBeforeSendHeaders(
      { urls: ['*://*/*'] },
      (details, callback) => {
        if (!this.enabled) {
          return callback({ requestHeaders: details.requestHeaders });
        }
        try {
          const hostname = new URL(details.url).hostname.toLowerCase();
          
          // Force environment override for bypass domains, Cloudflare frame URLs, or ALL traffic inside the isolated sandbox
          const isBypass = isIsolated || hostname.includes('cloudflare.com') || this.bypassDomains.some(domain => {
            const cleanDom = domain.toLowerCase().trim();
            return hostname === cleanDom || hostname.endsWith('.' + cleanDom);
          });

          if (isBypass) {
            details.requestHeaders['User-Agent'] = FIREFOX_UA;

            // Completely strip Chrome-specific Client Hints to match clean native Firefox
            delete details.requestHeaders['Sec-CH-UA'];
            delete details.requestHeaders['Sec-CH-UA-Mobile'];
            delete details.requestHeaders['Sec-CH-UA-Platform'];
            delete details.requestHeaders['Sec-CH-UA-Platform-Version'];
            delete details.requestHeaders['Sec-CH-UA-Full-Version-List'];
          }
        } catch (e) {}
        callback({ requestHeaders: details.requestHeaders });
      }
    );
  }

  removeHeaderInterceptor() {
    const electronSession = this._getElectronSession();
    if (!electronSession) return;
    this._hookedSessions.forEach(sess => {
      try { sess.webRequest.onBeforeSendHeaders({ urls: ['*://*/*'] }, null); } catch (e) {}
    });
    this._hookedSessions.clear();
  }

  reapplyToExistingWebviews() {
    document.querySelectorAll('div.external-link-view webview, .webviewer-content webview')
      .forEach(wv => {
        if (wv._cfBypassAttached) {
          wv._cfBypassAttached = false;
          wv._cfBypassReloaded = false; 
        }
        this.onWebviewReady(wv);
      });
  }

  restoreOriginalUAs() {
    document.querySelectorAll('div.external-link-view webview, .webviewer-content webview')
      .forEach(wv => {
        if (wv._originalUA) {
          wv.setAttribute('useragent', wv._originalUA);
          wv.setUserAgent(wv._originalUA);
          delete wv._originalUA;
        }
        wv._cfBypassAttached = false;
      });
  }

  // ─── DYNAMIC CSS INJECTOR (APPLIES OVERRIDES WITHOUT AN EXTERNAL STYLES.CSS)
  _injectCSSStyles() {
    const windows = new Set([window]);
    const floatingSplit = this.app?.workspace?.floatingSplit;
    if (floatingSplit?.children) {
      floatingSplit.children.forEach(child => {
        if (child.win) windows.add(child.win);
      });
    }

    const styleId = 'webview-suite-cloudflare-bypass-styles';

    Array.from(windows).forEach(win => {
      if (!win?.document || win.document.getElementById(styleId)) return;

      const styleEl = win.document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        /* Remove the default 16px padding so the browser reaches the screen edges */
        .workspace-leaf-content[data-type="${VIEW_TYPE_ISOLATED_WEBVIEW}"] .view-content {
            padding: 0 !important;
        }

        /* Hide Obsidian's native view title header to prevent duplicate navbars */
        .workspace-leaf-content[data-type="${VIEW_TYPE_ISOLATED_WEBVIEW}"] .view-header {
            display: none !important;
        }

        /* Custom Web Browser Container & Wrapper */
        .custom-webview-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-color: var(--background-primary);
        }

        .custom-webview-wrapper {
            flex-grow: 1;
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        /* Custom Webviewer Wrapper overrides to avoid any clashing with native Obsidian classes */
        .custom-webview-wrapper.webviewer-content {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            flex-grow: 1;
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .custom-webview-wrapper webview {
            width: 100%;
            height: 100%;
            border: none;
        }

        /* Navigation Toolbar (Header) */
        .custom-webview-header {
            display: flex;
            align-items: center;
            padding: var(--size-4-1) var(--size-4-2); 
            border-bottom: 1px solid var(--border-color);
            background-color: var(--background-secondary);
            gap: var(--size-4-1); 
            flex-shrink: 0;
        }

        .custom-webview-nav-buttons {
            display: flex;
            gap: var(--size-4-1);
            align-items: center;
        }

        /* Toolbar Buttons */
        .custom-webview-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            width: 24px;
            height: 24px;
            padding: 4px;
            border-radius: var(--radius-s);
            color: var(--text-muted);
            box-sizing: border-box;
        }

        .custom-webview-btn svg {
            width: 16px;
            height: 16px;
        }

        .custom-webview-btn:hover {
            background-color: var(--background-modifier-hover);
            color: var(--text-normal);
        }

        .custom-webview-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        /* Address Bar Input */
        .custom-webview-addressbar {
            flex-grow: 1;
            height: 24px; 
            border-radius: var(--radius-s); 
            border: 1px solid var(--border-color);
            background-color: var(--background-primary);
            color: var(--text-normal);
            padding: 0 var(--size-4-2); 
            font-size: var(--font-ui-small);
        }

        .custom-webview-addressbar:focus {
            border-color: var(--interactive-accent);
            outline: none;
        }

        /* Loading Spinner Animation */
        @keyframes webview-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .custom-webview-btn.is-loading svg {
            animation: webview-spin 1s linear infinite;
        }
      `;
      win.document.head.appendChild(styleEl);
    });
  }

  _removeCSSStyles() {
    const styleId = 'webview-suite-cloudflare-bypass-styles';
    
    const windows = new Set([window]);
    const floatingSplit = this.app?.workspace?.floatingSplit;
    if (floatingSplit?.children) {
      floatingSplit.children.forEach(child => {
        if (child.win) windows.add(child.win);
      });
    }

    Array.from(windows).forEach(win => {
      win?.document?.getElementById(styleId)?.remove();
    });
  }

  // ─── ERROR SHIELD ─────────────────────────────────────────────────────────
  _installGlobalErrorShield() {
    this._unhandledRejectionHandler = (e) => {
      const msg = e.reason?.message || '';
      if (msg.includes('GUEST_VIEW_MANAGER_CALL') && msg.includes('ERR_ABORTED')) {
        e.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', this._unhandledRejectionHandler);
  }

  _removeGlobalErrorShield() {
    if (this._unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this._unhandledRejectionHandler);
    }
  }

  // ─── UTILITY COMMANDS (COHESIVELY MANAGED BY CLOUDFLARE BYPASS) ───────────
  _registerCommands() {
    this._unregisterCommands();
    if (!this.app) return;

    try {
      const clearCmd = this.app.commands.addCommand({
        id: 'webview-suite:clear-active-webview-storage',
        name: 'Webview Suite: Clear cookies and cache for active webview domain',
        callback: () => this.clearActiveWebviewStorage()
      });
      if (clearCmd) this._commands.push(clearCmd);

      const toggleCmd = this.app.commands.addCommand({
        id: 'webview-suite:toggle-active-webview-session-mode',
        name: 'Webview Suite: Toggle isolated session mode (temporary partition) for active webview',
        callback: () => this.toggleActiveWebviewSessionMode()
      });
      if (toggleCmd) this._commands.push(toggleCmd);
    } catch (e) {
      console.error('[CloudflareBypass] Failed to register commands:', e);
    }
  }

  _unregisterCommands() {
    if (this._commands.length > 0) {
      try {
        const appCommands = this.app?.commands;
        if (appCommands) {
          for (const cmd of this._commands) {
            appCommands.removeCommand(cmd.id);
          }
        }
      } catch (e) {
        console.error('[CloudflareBypass] Error unregistering commands:', e);
      }
      this._commands = [];
    }
  }

  _getActiveWindows() {
    const windows = new Set([window]);
    const floatingSplit = this.app?.workspace?.floatingSplit;
    if (floatingSplit?.children) {
      floatingSplit.children.forEach(child => {
        if (child.win) windows.add(child.win);
      });
    }
    return Array.from(windows);
  }

  _getActiveWebview() {
    if (!this.app) return null;
    const activeWindows = this._getActiveWindows();
    
    for (const win of activeWindows) {
      if (!win?.document) continue;
      const activeEl = win.document.activeElement;
      if (activeEl && activeEl.tagName === 'WEBVIEW') {
        return activeEl;
      }
    }
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf?.view?.containerEl) {
      const wv = activeLeaf.view.containerEl.querySelector('webview');
      if (wv) return wv;
    }
    return null;
  }

  async clearActiveWebviewStorage() {
    const webview = this._getActiveWebview();
    if (!webview) {
      new Notice('Please click inside your webview tab first to focus it.');
      return;
    }
    try {
      const urlStr = webview.getURL() || webview.src;
      if (!urlStr) {
        new Notice('The active webview does not have an active URL.');
        return;
      }
      const url = new URL(urlStr);
      const origin = url.origin;
      const partition = webview.getAttribute('partition') || '';

      const electronSession = this._getElectronSession();
      if (!electronSession) {
        new Notice('Error: Electron Session API is unavailable.');
        return;
      }
      const sess = partition ? electronSession.fromPartition(partition) : electronSession.defaultSession;
      if (sess) {
        await sess.clearStorageData({
          origin: origin,
          storages: ['cookies', 'localstorage', 'indexdb', 'cache', 'serviceworkers']
        });
        new Notice(`Cleared cookies & storage data for ${url.hostname}. Reloading...`);
        webview.reload();
      }
    } catch (err) {
      console.error('[CloudflareBypass] Error clearing active webview storage:', err);
      new Notice('Failed to complete storage deletion.');
    }
  }

  async toggleActiveWebviewSessionMode() {
    const webview = this._getActiveWebview();
    if (!webview) {
      new Notice('Please click inside your webview tab first to focus it.');
      return;
    }
    const parent = webview.parentElement;
    if (!parent) return;

    try {
      const urlStr = webview.getURL() || webview.src;
      const currentPartition = webview.getAttribute('partition') || '';
      
      const appId = this.app?.appId || '';
      const normalPartition = `persist:vault-${appId}`;
      const tempPartition = 'persist:webview-suite-isolated-session';

      let targetPartition = tempPartition;
      if (currentPartition === tempPartition) {
        targetPartition = normalPartition;
        new Notice('Restoring normal persistent session...');
      } else {
        new Notice('Launching clean isolated temporary session context...');
      }

      const newWebview = document.createElement('webview');
      newWebview.setAttribute('partition', targetPartition);
      newWebview.setAttribute('allowpopups', 'true');
      newWebview.setAttribute('webpreferences', 'contextIsolation=no, sandbox=no, nodeIntegration=no');

      newWebview.setAttribute('useragent', FIREFOX_UA);
      if (this.preloadFileUrl) {
        newWebview.setAttribute('preload', this.preloadFileUrl);
      }

      parent.replaceChild(newWebview, webview);

      setTimeout(() => {
        if (this.app?.workspace) {
          this.app.workspace.trigger('layout-change');
        }
        if (urlStr) newWebview.src = urlStr;
      }, 150);

    } catch (err) {
      console.error('[CloudflareBypass] Error executing partition toggle:', err);
      new Notice('Failed to transition session container.');
    }
  }
}