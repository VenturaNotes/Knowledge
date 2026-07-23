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
    const makeNative = (fn, name) => {
      try {
        Object.defineProperty(fn, 'name', { value: name, configurable: true });
        Object.defineProperty(fn, 'toString', {
          value: () => "function " + name + "() { [native code] }",
          configurable: true
        });
      } catch (e) {}
    };

    try {
      const uaGetter = () => "${FIREFOX_UA}";
      makeNative(uaGetter, "get userAgent");
      Object.defineProperty(Navigator.prototype, 'userAgent', {
        get: uaGetter,
        configurable: true
      });
    } catch (e) {}

    try {
      const uadGetter = () => undefined;
      makeNative(uadGetter, "get userAgentData");
      Object.defineProperty(Navigator.prototype, 'userAgentData', {
        get: uadGetter,
        configurable: true
      });
    } catch (e) {}

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

    try {
      const webdriverGetter = () => false;
      makeNative(webdriverGetter, "get webdriver");
      Object.defineProperty(Navigator.prototype, 'webdriver', {
        get: webdriverGetter,
        configurable: true
      });
    } catch (e) {}

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
    this.navigation = false; 
  }

  getViewType() {
    return VIEW_TYPE_ISOLATED_WEBVIEW;
  }

  getDisplayText() {
    return this.currentTitle;
  }

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

  async onOpen() {
    const container = this.containerEl.children[1] || this.containerEl;
    container.empty();
    container.addClass('custom-webview-container');

    container.addEventListener('mousedown', () => {
      if (this.app.workspace.activeLeaf !== this.leaf) {
        this.app.workspace.setActiveLeaf(this.leaf, { focus: false });
      }
    });

    const header = container.createEl('div', { cls: 'custom-webview-header' });
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

    const bypassModule = this.plugin?.modules?.cloudflareBypass;
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
    const startSpinner = () => this.reloadBtn?.classList.add('is-loading');
    const stopSpinner = () => this.reloadBtn?.classList.remove('is-loading');

    const updateNavState = () => {
      try {
        const activeUrl = this.webviewEl.getURL() || this.webviewEl.src;
        if (this.currentUrl !== activeUrl) {
          this.currentUrl = activeUrl;
          if (this.addressBar) this.addressBar.value = activeUrl;
          this.app.workspace.requestSaveLayout();
        }
        if (this.backBtn) this.backBtn.disabled = !this.webviewEl.canGoBack();
        if (this.forwardBtn) this.forwardBtn.disabled = !this.webviewEl.canGoForward();
        
        if (!this.webviewEl.isLoading()) stopSpinner();
      } catch (e) {}
    };

    this.webviewEl.addEventListener('did-navigate', updateNavState);
    this.webviewEl.addEventListener('did-navigate-in-page', updateNavState);
    this.webviewEl.addEventListener('did-start-loading', startSpinner);
    this.webviewEl.addEventListener('did-start-navigation', (e) => {
      if (e.isMainFrame) startSpinner();
    });
    this.webviewEl.addEventListener('did-stop-loading', stopSpinner);
    this.webviewEl.addEventListener('did-finish-load', stopSpinner);
    this.webviewEl.addEventListener('did-fail-load', stopSpinner);

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
    this._lastShiftState = false;
    this._shiftTrackerKey = null;
    this._shiftTrackerMouse = null;
    this._observer = null;
  }

  onEnable(app) {
    this.app = app;
    this._registerCommands();
    this._installGlobalErrorShield();
    this._installGlobalLinkInterceptor();
    this._injectCSSStyles();
    this._setupDOMObserver();
    
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
    this._removeDOMObserver();
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

  _findLeafForWebview(webview) {
    if (!webview) return null;
    let foundLeaf = null;
    this.app.workspace.iterateAllLeaves(l => {
      if (l.view?.containerEl?.contains(webview) || l.containerEl?.contains(webview)) {
        foundLeaf = l;
      }
    });
    if (foundLeaf) return foundLeaf;

    // Search floating leaves in VaporNote if available
    const vaporPlugin = this.app.plugins?.getPlugin?.('vapornote') || this.app.plugins?.plugins?.['vapornote'];
    if (vaporPlugin && Array.isArray(vaporPlugin.floatingLeaves)) {
      for (const l of vaporPlugin.floatingLeaves) {
        if (l.containerEl?.contains(webview) || l.view?.containerEl?.contains(webview)) {
          return l;
        }
      }
    }
    return null;
  }

  _getSafeTabLeaf() {
    const active = this.app.workspace.activeLeaf;
    if (active && active.parent) {
      return this.app.workspace.getLeaf('tab');
    }
    return this.app.workspace.getLeaf(false);
  }

  _setupDOMObserver() {
    if (this._observer) return;
    this._observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'WEBVIEW') {
            this.onWebviewReady(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('webview').forEach(wv => this.onWebviewReady(wv));
          }
        }
      }
    });
    this._observer.observe(document.body, { childList: true, subtree: true });
  }

  _removeDOMObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  // ─── GLOBAL BACKGROUND LINK INTERCEPTORS ───
  _installGlobalLinkInterceptor() {
    if (!window.__ORIGINAL_WINDOW_OPEN) {
      window.__ORIGINAL_WINDOW_OPEN = window.open;
    }

    window.open = (url, name, features) => {
      if (this._shouldInterceptUrl(url)) {
        const newLeaf = this._getSafeTabLeaf();
        newLeaf.setViewState({
          type: VIEW_TYPE_ISOLATED_WEBVIEW,
          active: true,
          state: { url: url }
        });
        return null;
      }
      return window.__ORIGINAL_WINDOW_OPEN(url, name, features);
    };

    this._shiftTrackerKey = (e) => { this._lastShiftState = !!e.shiftKey; };
    this._shiftTrackerMouse = (e) => { this._lastShiftState = !!e.shiftKey; };

    this._globalClickHandler = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      
      const url = anchor.href || anchor.getAttribute('href');
      if (!url || !url.startsWith('http')) return;

      if (this._shouldInterceptUrl(url)) {
        e.preventDefault();
        e.stopPropagation(); 

        const newLeaf = this._getSafeTabLeaf();
        newLeaf.setViewState({
          type: VIEW_TYPE_ISOLATED_WEBVIEW,
          active: true,
          state: { url: url }
        });
      }
    };

    const windows = this._getActiveWindows();
    windows.forEach(win => {
      if (!win._cfLinkInterceptorAttached) {
        win._cfLinkInterceptorAttached = true;
        win.document.addEventListener('keydown', this._shiftTrackerKey, { capture: true });
        win.document.addEventListener('keyup', this._shiftTrackerKey, { capture: true });
        win.document.addEventListener('mousedown', this._shiftTrackerMouse, { capture: true });
        win.document.addEventListener('click', this._globalClickHandler, { capture: true });
      }
    });
    
    this._windowOpenRef = this.app.workspace.on('window-open', (child) => {
      const win = child.win;
      if (win && !win._cfLinkInterceptorAttached) {
        win._cfLinkInterceptorAttached = true;
        win.document.addEventListener('keydown', this._shiftTrackerKey, { capture: true });
        win.document.addEventListener('keyup', this._shiftTrackerKey, { capture: true });
        win.document.addEventListener('mousedown', this._shiftTrackerMouse, { capture: true });
        win.document.addEventListener('click', this._globalClickHandler, { capture: true });
      }
    });

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

    if (!this.app.workspace.__originalGetLeaf) {
      this.app.workspace.__originalGetLeaf = this.app.workspace.getLeaf;
    }

    this.app.workspace.getLeaf = function(type, ...args) {
      if (type === 'window') {
        const activeType = self.app.workspace.activeLeaf?.view?.getViewType();
        const isWebviewActive = activeType === 'webviewer' || activeType === VIEW_TYPE_ISOLATED_WEBVIEW;
        
        if (isWebviewActive && !self._lastShiftState) {
          type = 'tab';
        }
      }
      return self.app.workspace.__originalGetLeaf.call(this, type, ...args);
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
          win.document.removeEventListener('keydown', this._shiftTrackerKey, { capture: true });
          win.document.removeEventListener('keyup', this._shiftTrackerKey, { capture: true });
          win.document.removeEventListener('mousedown', this._shiftTrackerMouse, { capture: true });
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

    if (this.app.workspace.__originalGetLeaf) {
      this.app.workspace.getLeaf = this.app.workspace.__originalGetLeaf;
      delete this.app.workspace.__originalGetLeaf;
    }
  }

  _cleanUAString(ua) {
    if (!ua) return '';
    return ua.replace(/\s*(Electron|obsidian|Obsidian)\/[^\s]+/ig, '').replace(/\s{2,}/g, ' ').trim();
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
    if (!this.enabled || !webview) return;

    if (!webview._cfNewWindowAttached) {
      webview._cfNewWindowAttached = true;
      webview.addEventListener('new-window', async (e) => {
        const targetUrl = e.url;
        if (!targetUrl) return;

        const isBypass = this._shouldInterceptUrl(targetUrl);
        const leaf = this._findLeafForWebview(webview);
        const isIsolatedSource = leaf && leaf.view?.getViewType() === VIEW_TYPE_ISOLATED_WEBVIEW;

        if (isBypass || isIsolatedSource) {
          e.preventDefault();
          e.stopImmediatePropagation();

          const newLeaf = this._getSafeTabLeaf();
          await newLeaf.setViewState({
            type: VIEW_TYPE_ISOLATED_WEBVIEW,
            active: true,
            state: { url: targetUrl }
          });
        }
      }, { capture: true }); 
    }

    const partitionStr = webview.getAttribute('partition') || '';
    const electronSession = this._getElectronSession();
    if (electronSession) {
      const sess = partitionStr 
        ? electronSession.fromPartition(partitionStr) 
        : electronSession.defaultSession;

      if (sess) {
        this._applyBypassToSession(sess);
      }
    }

    if (webview._cfBypassAttached) return;
    webview._cfBypassAttached = true;

    const applyUA = () => {
      try {
        const urlStr = webview.getURL() || webview.src || '';
        if (!urlStr || urlStr.startsWith('about:blank')) return;

        const leaf = this._findLeafForWebview(webview);
        if (!leaf) return;

        const viewType = leaf.view?.getViewType() || '';

        if (this._shouldInterceptUrl(urlStr) && viewType !== VIEW_TYPE_ISOLATED_WEBVIEW) {
          if (webview._redirected) return;
          webview._redirected = true;
          
          try { webview.stop(); } catch(e) {}

          setTimeout(async () => {
            try {
              await leaf.setViewState({
                type: VIEW_TYPE_ISOLATED_WEBVIEW,
                active: true,
                state: { url: urlStr }
              });
              const view = leaf.view;
              if (view && typeof view.navigateTo === 'function') view.navigateTo(urlStr);
            } catch (err) {}
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

  async _writePreloadScript() {
    const pluginDir = this.app.vault.configDir + '/plugins/webview-suite';
    const localPath = `${pluginDir}/preload.js`;
    
    try {
      await this.app.vault.adapter.write(localPath, STEALTH_PRELOAD_CODE);
      
      let absolutePath = '';
      if (typeof this.app.vault.adapter.getAbsoluteFilePath === 'function') {
        absolutePath = this.app.vault.adapter.getAbsoluteFilePath(localPath);
      } else {
        const basePath = this.app.vault.adapter.getBasePath();
        absolutePath = require('path').join(basePath, localPath);
      }
      
      let fileUrl = absolutePath.replace(/\\/g, '/');
      if (!fileUrl.startsWith('/')) fileUrl = '/' + fileUrl;
      
      this.preloadFileUrl = 'file://' + fileUrl;
    } catch (err) {}
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
        if (!this.enabled) return callback({ requestHeaders: details.requestHeaders });
        
        try {
          const hostname = new URL(details.url).hostname.toLowerCase();
          const isBypass = isIsolated || hostname.includes('cloudflare.com') || this.bypassDomains.some(domain => {
            const cleanDom = domain.toLowerCase().trim();
            return hostname === cleanDom || hostname.endsWith('.' + cleanDom);
          });

          if (isBypass) {
            details.requestHeaders['User-Agent'] = FIREFOX_UA;
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
    document.querySelectorAll('webview')
      .forEach(wv => {
        if (wv._cfBypassAttached) {
          wv._cfBypassAttached = false;
          wv._cfBypassReloaded = false; 
        }
        this.onWebviewReady(wv);
      });
  }

  restoreOriginalUAs() {
    document.querySelectorAll('webview')
      .forEach(wv => {
        if (wv._originalUA) {
          wv.setAttribute('useragent', wv._originalUA);
          wv.setUserAgent(wv._originalUA);
          delete wv._originalUA;
        }
        wv._cfBypassAttached = false;
      });
  }

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
        .workspace-leaf-content[data-type="${VIEW_TYPE_ISOLATED_WEBVIEW}"] .view-content { padding: 0 !important; }
        .workspace-leaf-content[data-type="${VIEW_TYPE_ISOLATED_WEBVIEW}"] .view-header { display: none !important; }
        .custom-webview-container { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; background-color: var(--background-primary); }
        .custom-webview-wrapper { flex-grow: 1; position: relative; width: 100%; height: 100%; overflow: hidden; }
        .custom-webview-wrapper.webviewer-content { display: block !important; padding: 0 !important; margin: 0 !important; border: none !important; flex-grow: 1; position: relative; width: 100%; height: 100%; overflow: hidden; }
        .custom-webview-wrapper webview { width: 100%; height: 100%; border: none; }
        .custom-webview-header { display: flex; align-items: center; padding: var(--size-4-1) var(--size-4-2); border-bottom: 1px solid var(--border-color); background-color: var(--background-secondary); gap: var(--size-4-1); flex-shrink: 0; }
        .custom-webview-nav-buttons { display: flex; gap: var(--size-4-1); align-items: center; }
        .custom-webview-btn { display: flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; width: 24px; height: 24px; padding: 4px; border-radius: var(--radius-s); color: var(--text-muted); box-sizing: border-box; }
        .custom-webview-btn svg { width: 16px; height: 16px; }
        .custom-webview-btn:hover { background-color: var(--background-modifier-hover); color: var(--text-normal); }
        .custom-webview-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .custom-webview-addressbar { flex-grow: 1; height: 24px; border-radius: var(--radius-s); border: 1px solid var(--border-color); background-color: var(--background-primary); color: var(--text-normal); padding: 0 var(--size-4-2); font-size: var(--font-ui-small); }
        .custom-webview-addressbar:focus { border-color: var(--interactive-accent); outline: none; }
        @keyframes webview-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .custom-webview-btn.is-loading svg { animation: webview-spin 1s linear infinite; }
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
    Array.from(windows).forEach(win => win?.document?.getElementById(styleId)?.remove());
  }

  _installGlobalErrorShield() {
    this._unhandledRejectionHandler = (e) => {
      const msg = e.reason?.message || '';
      if (msg.includes('GUEST_VIEW_MANAGER_CALL')) e.preventDefault();
    };
    window.addEventListener('unhandledrejection', this._unhandledRejectionHandler);
  }

  _removeGlobalErrorShield() {
    if (this._unhandledRejectionHandler) window.removeEventListener('unhandledrejection', this._unhandledRejectionHandler);
  }

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
    } catch (e) {}
  }

  _unregisterCommands() {
    if (this._commands.length > 0) {
      try {
        const appCommands = this.app?.commands;
        if (appCommands) {
          for (const cmd of this._commands) appCommands.removeCommand(cmd.id);
        }
      } catch (e) {}
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
      if (activeEl && activeEl.tagName === 'WEBVIEW') return activeEl;
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
      if (!urlStr) return new Notice('The active webview does not have an active URL.');
      
      const url = new URL(urlStr);
      const partition = webview.getAttribute('partition') || '';
      const electronSession = this._getElectronSession();
      if (!electronSession) return new Notice('Error: Electron Session API is unavailable.');
      
      const sess = partition ? electronSession.fromPartition(partition) : electronSession.defaultSession;
      if (sess) {
        await sess.clearStorageData({ origin: url.origin, storages: ['cookies', 'localstorage', 'indexdb', 'cache', 'serviceworkers'] });
        new Notice(`Cleared cookies & storage data for ${url.hostname}. Reloading...`);
        webview.reload();
      }
    } catch (err) {
      new Notice('Failed to complete storage deletion.');
    }
  }

  async toggleActiveWebviewSessionMode() {
    const webview = this._getActiveWebview();
    if (!webview) return new Notice('Please click inside your webview tab first to focus it.');
    
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
      if (this.preloadFileUrl) newWebview.setAttribute('preload', this.preloadFileUrl);

      parent.replaceChild(newWebview, webview);

      setTimeout(() => {
        if (this.app?.workspace) this.app.workspace.trigger('layout-change');
        if (urlStr) newWebview.src = urlStr;
      }, 150);

    } catch (err) {
      new Notice('Failed to transition session container.');
    }
  }
}