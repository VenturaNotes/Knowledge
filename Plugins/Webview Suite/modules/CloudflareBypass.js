/**
 * modules/CloudflareBypass.js
 * 
 * Contains both the built-in Isolated Browser view class and the bypass module.
 * Routes web PDFs to local PDF.js, with cache-busting and explicit `fileOrigin`
 * condition neutralization.
 */

import { ItemView, setIcon, Notice, WorkspaceLeaf, requestUrl, Modal } from 'obsidian';

export const VIEW_TYPE_ISOLATED_WEBVIEW = 'custom-webview-view';
const FIREFOX_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0";
const PINNED_PDFJS_TAG = "v6.2.108"; // or whatever the latest tag is when you switch
const PINNED_DOWNLOAD_URL = "https://github.com/mozilla/pdf.js/releases/download/v6.2.108/pdfjs-6.2.108-dist.zip"; // drop "-legacy"

// ─── PDF HELPER FUNCTIONS ────────────────────────────────────────────────────

function isPdfUrl(urlStr) {
  if (!urlStr) return false;
  try {
    const cleanUrl = urlStr.split('?')[0].split('#')[0].toLowerCase();
    return cleanUrl.endsWith('.pdf') || /\/pdf\//.test(cleanUrl);
  } catch (e) {
    return false;
  }
}

// ─── PDF FETCH-TO-TEMP-FILE PIPELINE ────────────────────────────────────────
// Fetches PDF bytes via requestUrl (main process, no CORS/origin restrictions)
// and writes them to a local temp file, so the stock/unpatched PDF.js viewer
// can open it as a plain file:// URL — no origin-check patching required.

const PDF_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 3; // 3 days
const PDF_CACHE_MAX_TOTAL_BYTES = 200 * 1024 * 1024;  // 200 MB

function getPdfCacheDir() {
  const path = require('path');
  const os = require('os');
  return path.join(os.tmpdir(), 'obsidian-webview-suite-pdf-cache');
}

function pruneCacheDir(cacheDir, maxAgeMs = PDF_CACHE_MAX_AGE_MS, maxTotalBytes = PDF_CACHE_MAX_TOTAL_BYTES) {
  const fs = require('fs');
  const path = require('path');

  let entries;
  try {
    entries = fs.readdirSync(cacheDir).map(name => {
      const fullPath = path.join(cacheDir, name);
      const stat = fs.statSync(fullPath);
      return { fullPath, size: stat.size, mtime: stat.mtimeMs };
    });
  } catch (e) {
    return;
  }

  const now = Date.now();
  entries = entries.filter(entry => {
    if (now - entry.mtime > maxAgeMs) {
      try { fs.unlinkSync(entry.fullPath); } catch (e) {}
      return false;
    }
    return true;
  });

  let totalSize = entries.reduce((sum, e) => sum + e.size, 0);
  if (totalSize > maxTotalBytes) {
    entries.sort((a, b) => a.mtime - b.mtime);
    for (const entry of entries) {
      if (totalSize <= maxTotalBytes) break;
      try {
        fs.unlinkSync(entry.fullPath);
        totalSize -= entry.size;
      } catch (e) {}
    }
  }
}

function clearPdfCache() {
  const fs = require('fs');
  try { fs.rmSync(getPdfCacheDir(), { recursive: true, force: true }); } catch (e) {}
}

async function fetchPdfToTempFile(targetPdfUrl) {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  const cacheDir = getPdfCacheDir();
  fs.mkdirSync(cacheDir, { recursive: true });
  pruneCacheDir(cacheDir);

  const response = await requestUrl({ url: targetPdfUrl });
  if (response.status !== 200 || !response.arrayBuffer) {
    throw new Error(`Failed to fetch PDF (status ${response.status})`);
  }

  const hash = crypto.createHash('sha1').update(targetPdfUrl).digest('hex');
  const tempPath = path.join(cacheDir, `${hash}.pdf`);
  fs.writeFileSync(tempPath, Buffer.from(response.arrayBuffer));
  return tempPath;
}

function buildViewerUrlForLocalFile(plugin, localPdfPath) {
  if (!plugin?.app?.vault?.adapter) return localPdfPath;
  const basePath = plugin.app.vault.adapter.getBasePath();
  const viewerPath = require('path').join(basePath, '.obsidian/plugins/webview-suite/pdfjs/web/viewer.html');

  let fileUrl = viewerPath.replace(/\\/g, '/');
  if (!fileUrl.startsWith('/')) fileUrl = '/' + fileUrl;

  let pdfUrl = localPdfPath.replace(/\\/g, '/');
  if (!pdfUrl.startsWith('/')) pdfUrl = '/' + pdfUrl;

  return `file://${fileUrl}?file=${encodeURIComponent(`file://${pdfUrl}`)}`;
}

// Fetches the PDF and points the given webview at the local copy.
// Fire-and-forget safe: reports failures via Notice instead of throwing.
async function loadPdfIntoWebview(plugin, webviewEl, targetPdfUrl) {
  try {
    const tempPath = await fetchPdfToTempFile(targetPdfUrl);

    // Remember which remote URL this local temp file came from, so the
    // address bar can show the original URL instead of a file:// path.
    if (!webviewEl._pdfSourceMap) webviewEl._pdfSourceMap = new Map();
    let normalizedTempPath = tempPath.replace(/\\/g, '/');
    if (!normalizedTempPath.startsWith('/')) normalizedTempPath = '/' + normalizedTempPath;
    webviewEl._pdfSourceMap.set(normalizedTempPath, targetPdfUrl);

    webviewEl.src = buildViewerUrlForLocalFile(plugin, tempPath);
  } catch (err) {
    new Notice(`Failed to load PDF: ${err.message}`);
  }
}

// ─── CONFIRM UPDATE MODAL ───────────────────────────────────────────────────

export class ConfirmPdfUpdateModal extends Modal {
  constructor(app, currentVer, newTag, onConfirm) {
    super(app);
    this.currentVer = currentVer || 'None';
    this.newTag = newTag;
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h3', { text: 'Update PDF.js Viewer?' });
    contentEl.createEl('p', { text: `A new version of PDF.js is available.` });

    const infoBox = contentEl.createDiv();
    infoBox.style.cssText = `
      background: var(--background-secondary-alt);
      border: 1px solid var(--background-modifier-border);
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
      font-size: 13px;
    `;
    infoBox.createEl('div', { text: `• Current Version: ${this.currentVer}` });
    infoBox.createEl('div', { text: `• New Version: ${this.newTag}`, style: 'font-weight: bold; color: var(--interactive-accent); margin-top: 4px;' });

    const btnContainer = contentEl.createDiv();
    btnContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px;';

    const cancelBtn = btnContainer.createEl('button', { text: 'Cancel' });
    cancelBtn.addEventListener('click', () => this.close());

    const updateBtn = btnContainer.createEl('button', { text: 'Update Now', cls: 'mod-cta' });
    updateBtn.addEventListener('click', () => {
      this.close();
      if (typeof this.onConfirm === 'function') this.onConfirm();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ─── PURE JS ZIP UNPACKER & BULLETPROOF PATCHER ──────────────────────────────

function unzipZipBuffer(zipBuf, destDir) {
  const zlib = require('zlib');
  const path = require('path');
  const fs = require('fs');

  let offset = 0;
  while (offset < zipBuf.length - 30) {
    if (zipBuf.readUInt32LE(offset) !== 0x04034b50) {
      offset++;
      continue;
    }

    const compMethod = zipBuf.readUInt16LE(offset + 8);
    const compSize = zipBuf.readUInt32LE(offset + 18);
    const fileNameLen = zipBuf.readUInt16LE(offset + 26);
    const extraLen = zipBuf.readUInt16LE(offset + 28);

    const fileNameStart = offset + 30;
    const fileName = zipBuf.toString('utf8', fileNameStart, fileNameStart + fileNameLen);
    const dataStart = fileNameStart + fileNameLen + extraLen;

    if (fileName && !fileName.endsWith('/')) {
      const rawData = zipBuf.subarray(dataStart, dataStart + compSize);
      let uncompressedData = null;

      try {
        if (compMethod === 0) {
          uncompressedData = rawData;
        } else if (compMethod === 8) {
          uncompressedData = zlib.inflateRawSync(rawData);
        }
      } catch (err) {}

      if (uncompressedData) {
        const outPath = path.join(destDir, fileName);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, uncompressedData);
      }
    }

    offset = dataStart + compSize;
  }
}

// ─── STEALTH INJECTION CODE ──────────────────────────────────────────────────
const STEALTH_PRELOAD_CODE = `
  (function() {
    const makeNative = (fn, name) => {
      try {
        Object.defineProperty(fn, 'name', { value: name, configurable: true });
        Object.defineProperty(fn, 'toString', { value: () => "function " + name + "() { [native code] }", configurable: true });
      } catch (e) {}
    };

    try {
      const uaGetter = () => "${FIREFOX_UA}";
      makeNative(uaGetter, "get userAgent");
      Object.defineProperty(Navigator.prototype, 'userAgent', { get: uaGetter, configurable: true });
    } catch (e) {}

    try {
      if (window.chrome) delete window.chrome;
      const chromeGetter = () => undefined;
      makeNative(chromeGetter, "get chrome");
      Object.defineProperty(window, 'chrome', { get: chromeGetter, configurable: true });
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
  }

  getViewType() { return VIEW_TYPE_ISOLATED_WEBVIEW; }
  getDisplayText() { return this.currentTitle; }
  getState() { return { url: this.currentUrl, title: this.currentTitle }; }

  async setState(state, result) {
    await super.setState(state, result);
    if (state && state.url) {
      this.currentUrl = state.url;
      if (this.addressBar) this.addressBar.value = this.currentUrl;

      if (this.webviewEl) {
        if (isPdfUrl(this.currentUrl)) {
          loadPdfIntoWebview(this.plugin, this.webviewEl, this.currentUrl);
        } else if (this.webviewEl.src !== this.currentUrl) {
          this.webviewEl.src = this.currentUrl;
        }
      }
    }
    if (state && state.title) {
      this.currentTitle = state.title;
      if (this.leaf.tabHeaderInnerTitleEl) this.leaf.tabHeaderInnerTitleEl.setText(this.currentTitle);
    }
  }

  async onOpen() {
    const container = this.containerEl.children[1] || this.containerEl;
    container.empty();
    container.addClass('custom-webview-container');

    container.addEventListener('mousedown', () => {
      if (this.app.workspace.activeLeaf !== this.leaf) this.app.workspace.setActiveLeaf(this.leaf, { focus: false });
    });

    const header = container.createEl('div', { cls: 'custom-webview-header' });
    const navLeft = header.createEl('div', { cls: 'custom-webview-nav-buttons' });

    this.backBtn = navLeft.createEl('button', { cls: 'custom-webview-btn', title: 'Go back' });
    setIcon(this.backBtn, 'arrow-left');
    this.backBtn.addEventListener('click', () => { if (this.webviewEl?.canGoBack()) this.webviewEl.goBack(); });

    this.forwardBtn = navLeft.createEl('button', { cls: 'custom-webview-btn', title: 'Go forward' });
    setIcon(this.forwardBtn, 'arrow-right');
    this.forwardBtn.addEventListener('click', () => { if (this.webviewEl?.canGoForward()) this.webviewEl.goForward(); });

    this.reloadBtn = navLeft.createEl('button', { cls: 'custom-webview-btn', title: 'Reload page' });
    setIcon(this.reloadBtn, 'rotate-cw');
    this.reloadBtn.addEventListener('click', () => { if (this.webviewEl) this.webviewEl.reload(); });

    this.addressBar = header.createEl('input', { type: 'text', cls: 'custom-webview-addressbar', value: this.currentUrl });
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
      if (isPdfUrl(url)) {
        loadPdfIntoWebview(this.plugin, this.webviewEl, url);
      } else {
        this.webviewEl.src = url;
      }
    }
    this.app.workspace.requestSaveLayout();
  }

  rebuildWebview(url) {
    if (this.webviewEl) this.webviewEl.remove();

    this.webviewEl = document.createElement('webview');
    this.webviewEl.style.cssText = 'width: 100%; height: 100%; border: none; background: #fff;';
    
    this.webviewEl.setAttribute('partition', 'persist:webview-suite-isolated-session');
    this.webviewEl.setAttribute('allowpopups', 'true');
    this.webviewEl.setAttribute('webpreferences', 'contextIsolation=no, sandbox=no, nodeIntegration=no, webSecurity=no');
    this.webviewEl.setAttribute('useragent', FIREFOX_UA);

    const bypassModule = this.plugin?.modules?.cloudflareBypass;
    if (bypassModule && bypassModule.preloadFileUrl) {
      this.webviewEl.setAttribute('preload', bypassModule.preloadFileUrl);
    }

    this.attachWebviewListeners();
    this.webviewWrapper.appendChild(this.webviewEl);

    if (this.plugin?.manager) setTimeout(() => this.plugin.manager.findAndAttach(), 150);

    if (url) {
      if (isPdfUrl(url)) {
        loadPdfIntoWebview(this.plugin, this.webviewEl, url);
      } else {
        this.webviewEl.src = url;
      }
    }
  }

  attachWebviewListeners() {
    const startSpinner = () => this.reloadBtn?.classList.add('is-loading');
    const stopSpinner = () => this.reloadBtn?.classList.remove('is-loading');

    const updateNavState = () => {
      try {
        let activeUrl = this.webviewEl.getURL() || this.webviewEl.src;
        
        if (activeUrl.includes('/pdfjs/web/viewer.html?')) {
          const match = activeUrl.match(/file=([^&]+)/);
          if (match && match[1]) {
            const decodedFileUrl = decodeURIComponent(match[1]);
            const localPath = decodedFileUrl.replace(/^file:\/\//, '');
            const originalUrl = this.webviewEl._pdfSourceMap?.get(localPath);
            activeUrl = originalUrl || decodedFileUrl;
          }
        }

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
    this.webviewEl.addEventListener('did-start-navigation', (e) => { if (e.isMainFrame) startSpinner(); });
    this.webviewEl.addEventListener('did-stop-loading', stopSpinner);
    this.webviewEl.addEventListener('did-finish-load', stopSpinner);
    this.webviewEl.addEventListener('did-fail-load', stopSpinner);

    this.webviewEl.addEventListener('page-title-updated', (e) => {
      this.currentTitle = e.title || 'Isolated Browser';
      if (this.leaf.tabHeaderInnerTitleEl) this.leaf.tabHeaderInnerTitleEl.setText(this.currentTitle);
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
    
    this._ensurePdfJsInstalled();

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
    clearPdfCache();
  }

  // ─── PDF.JS INSTALLER & MANUAL UPDATE CHECKER ──────────────────────────────
  
  getPdfJsVersion() {
    const fs = require('fs');
    const path = require('path');
    const versionFile = path.join(this.app.vault.adapter.getBasePath(), '.obsidian/plugins/webview-suite/pdfjs/version.json');
    if (fs.existsSync(versionFile)) {
      try { return JSON.parse(fs.readFileSync(versionFile, 'utf8')).version || 'v6.2.108'; } catch(e) {}
    }
    return 'Not Installed';
  }

  async _ensurePdfJsInstalled() {
    const fs = require('fs');
    const path = require('path');
    const pdfJsDir = path.join(this.app.vault.adapter.getBasePath(), '.obsidian/plugins/webview-suite/pdfjs');
    const viewerHtml = path.join(pdfJsDir, 'web', 'viewer.html');
    
    if (fs.existsSync(viewerHtml)) {
      return;
    }

    await this._downloadAndInstallPdfJs(PINNED_PDFJS_TAG, PINNED_DOWNLOAD_URL);
  }

  async checkForPdfJsUpdates(app) {
    new Notice('[WebviewSuite] Checking for PDF.js updates...');
    try {
      const apiRes = await requestUrl({
        url: 'https://api.github.com/repos/mozilla/pdf.js/releases/latest',
        headers: { 'User-Agent': 'Obsidian-Webview-Suite' }
      });

      if (apiRes.status !== 200) {
        new Notice('[WebviewSuite] Failed to check for PDF.js updates.');
        return;
      }

      const releaseData = apiRes.json;
      const latestTag = releaseData.tag_name || '';
      const currentVer = this.getPdfJsVersion();

      if (currentVer === latestTag) {
        new Notice(`[WebviewSuite] PDF.js is already up to date (${currentVer}).`);
        return;
      }

      const asset = releaseData.assets?.find(a => a.name.endsWith('-dist.zip') && !a.name.includes('legacy'))
           || releaseData.assets?.find(a => a.name.endsWith('.zip'));

      if (!asset?.browser_download_url) {
        new Notice('[WebviewSuite] Could not locate update zip asset.');
        return;
      }

      new ConfirmPdfUpdateModal(app, currentVer, latestTag, async () => {
        await this._downloadAndInstallPdfJs(latestTag, asset.browser_download_url);
      }).open();

    } catch (err) {
      new Notice('[WebviewSuite] Error checking for updates: ' + (err.message || 'Network error'));
    }
  }

  async _downloadAndInstallPdfJs(tag, downloadUrl) {
    const fs = require('fs');
    const path = require('path');
    const pdfJsDir = path.join(this.app.vault.adapter.getBasePath(), '.obsidian/plugins/webview-suite/pdfjs');
    const versionFile = path.join(pdfJsDir, 'version.json');

    try {
      new Notice(`[WebviewSuite] Downloading PDF.js ${tag}...`);

      const zipRes = await requestUrl({ url: downloadUrl });
      if (zipRes.status !== 200 || !zipRes.arrayBuffer) {
        new Notice('[WebviewSuite] Download failed.');
        return;
      }

      const zipBuf = Buffer.from(zipRes.arrayBuffer);
      unzipZipBuffer(zipBuf, pdfJsDir);

      fs.mkdirSync(pdfJsDir, { recursive: true });
      fs.writeFileSync(versionFile, JSON.stringify({ version: tag, updatedAt: new Date().toISOString() }, null, 2), 'utf8');

      new Notice(`[WebviewSuite] PDF.js ${tag} installed successfully!`);
    } catch (err) {
      new Notice('[WebviewSuite] Installation failed: ' + (err.message || err));
    }
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
    if (isPdfUrl(urlStr)) return true;

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
      if (l.view?.containerEl?.contains(webview) || l.containerEl?.contains(webview)) foundLeaf = l;
    });
    if (foundLeaf) return foundLeaf;

    const vaporPlugin = this.app.plugins?.getPlugin?.('vapornote') || this.app.plugins?.plugins?.['vapornote'];
    if (vaporPlugin && Array.isArray(vaporPlugin.floatingLeaves)) {
      for (const l of vaporPlugin.floatingLeaves) {
        if (l.containerEl?.contains(webview) || l.view?.containerEl?.contains(webview)) return l;
      }
    }
    return null;
  }

  _getSafeTabLeaf() {
    const active = this.app.workspace.activeLeaf;
    if (active && active.parent) return this.app.workspace.getLeaf('tab');
    return this.app.workspace.getLeaf(false);
  }

  _setupDOMObserver() {
    if (this._observer) return;
    this._observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'WEBVIEW') this.onWebviewReady(node);
          else if (node.querySelectorAll) node.querySelectorAll('webview').forEach(wv => this.onWebviewReady(wv));
        }
      }
    });
    this._observer.observe(document.body, { childList: true, subtree: true });
  }

  _removeDOMObserver() {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
  }

  _installGlobalLinkInterceptor() {
    if (!window.__ORIGINAL_WINDOW_OPEN) window.__ORIGINAL_WINDOW_OPEN = window.open;

    window.open = (url, name, features) => {
      if (this._shouldInterceptUrl(url)) {
        const newLeaf = this._getSafeTabLeaf();
        newLeaf.setViewState({ type: VIEW_TYPE_ISOLATED_WEBVIEW, active: true, state: { url: url } });
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
        e.preventDefault(); e.stopPropagation(); 
        const newLeaf = this._getSafeTabLeaf();
        newLeaf.setViewState({ type: VIEW_TYPE_ISOLATED_WEBVIEW, active: true, state: { url: url } });
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
        if (isWebviewActive && !self._lastShiftState) type = 'tab';
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
          e.preventDefault(); e.stopImmediatePropagation();
          const newLeaf = this._getSafeTabLeaf();
          await newLeaf.setViewState({ type: VIEW_TYPE_ISOLATED_WEBVIEW, active: true, state: { url: targetUrl } });
        }
      }, { capture: true }); 
    }

    const partitionStr = webview.getAttribute('partition') || '';
    const electronSession = this._getElectronSession();
    if (electronSession) {
      const sess = partitionStr ? electronSession.fromPartition(partitionStr) : electronSession.defaultSession;
      if (sess) this._applyBypassToSession(sess);
    }

    if (webview._cfBypassAttached) return;
    webview._cfBypassAttached = true;

    const applyUA = (navEvent) => {
      try {
        // Subframe navigations (ads, trackers, embedded iframes) also fire
        // did-start-navigation. Only act on main-frame navigations, or a
        // subframe load could trigger webview.stop() on the whole page.
        if (navEvent && navEvent.isMainFrame === false) return;

        // Prefer the event's own url. webview.getURL() at the moment
        // did-start-navigation fires can still report the *previous* page
        // -- especially mid-redirect (e.g. arXiv bouncing /pdf/ through a
        // redirect) -- which made _shouldInterceptUrl below evaluate the
        // wrong URL and intermittently miss PDF interception on a plain
        // left-click (cmd+click doesn't hit this path at all; it's caught
        // earlier by the synchronous 'new-window' listener above).
        const urlStr = (navEvent && navEvent.url) || webview.getURL() || webview.src || '';
        if (!urlStr || urlStr.startsWith('about:blank')) return;

        const leaf = this._findLeafForWebview(webview);
        if (!leaf) return;

        const viewType = leaf.view?.getViewType() || '';

        if (this._shouldInterceptUrl(urlStr) && viewType !== VIEW_TYPE_ISOLATED_WEBVIEW) {
          // Transient lock: only guards against did-start-navigation firing
          // twice for the same in-flight redirect. Always released in
          // `finally`, so a failed/slow attempt can't permanently block
          // future clicks on this webview (unlike a one-shot latch).
          if (webview._redirecting) return;
          webview._redirecting = true;

          try { webview.stop(); } catch(e) {}

          setTimeout(async () => {
            try {
              await leaf.setViewState({ type: VIEW_TYPE_ISOLATED_WEBVIEW, active: true, state: { url: urlStr } });
              const view = leaf.view;
              if (view && typeof view.navigateTo === 'function') view.navigateTo(urlStr);
            } catch (err) {
              new Notice(`[WebviewSuite] Failed to open PDF in isolated view: ${err.message || err}`);
            } finally {
              webview._redirecting = false;
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
    try { 
      sess.webRequest.onBeforeSendHeaders({ urls: ['*://*/*'] }, null); 
      sess.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, null);
    } catch(e) {}

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

    try {
      sess.webRequest.onHeadersReceived(
        { urls: ['*://*/*'] },
        (details, callback) => {
          if (!this.enabled) return callback({ responseHeaders: details.responseHeaders });

          // Clone into a fresh plain object first. Some Electron versions
          // hand back response headers with non-configurable properties,
          // and `delete` on those throws a TypeError in strict mode
          // (this file is an ES module, so it's strict by default) instead
          // of failing silently like it used to. That thrown error was
          // aborting the webRequest hook before `callback()` ran, which
          // stalled the underlying PDF download indefinitely.
          const responseHeaders = Object.assign({}, details.responseHeaders || {});

          const setHeader = (key, val) => {
            for (const k of Object.keys(responseHeaders)) {
              if (k.toLowerCase() === key.toLowerCase()) delete responseHeaders[k];
            }
            responseHeaders[key] = [val];
          };

          if (isPdfUrl(details.url)) {
            setHeader('Access-Control-Allow-Origin', '*');
            setHeader('Access-Control-Allow-Headers', '*');
            setHeader('Access-Control-Expose-Headers', '*');
          }

          callback({ responseHeaders });
        }
      );
    } catch(e) {}
  }

  removeHeaderInterceptor() {
    const electronSession = this._getElectronSession();
    if (!electronSession) return;
    this._hookedSessions.forEach(sess => {
      try { 
        sess.webRequest.onBeforeSendHeaders({ urls: ['*://*/*'] }, null); 
        sess.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, null); 
      } catch (e) {}
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
      floatingSplit.children.forEach(child => { if (child.win) windows.add(child.win); });
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
      floatingSplit.children.forEach(child => { if (child.win) windows.add(child.win); });
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
      floatingSplit.children.forEach(child => { if (child.win) windows.add(child.win); });
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
      newWebview.setAttribute('webpreferences', 'contextIsolation=no, sandbox=no, nodeIntegration=no, webSecurity=no');
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