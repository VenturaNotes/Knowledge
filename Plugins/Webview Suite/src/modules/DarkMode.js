/**
 * modules/DarkMode.js
 * 
 * Applies dark mode to all webviews via DarkReader, incorporating performance
 * tuning settings and an adjustable, persistent bypass domain list.
 */

import { requestUrl } from 'obsidian';

export class DarkModeModule {
  constructor() {
    this.id = 'darkMode';
    this.name = 'Dark Mode';
    this.description = 'Applies dark mode to all webviews via DarkReader';
    this.enabled = false;
    this.app = null;
    this.darkReaderCode = null;
    this.bypassDomains = [];
  }

  onEnable(app) {
    this.app = app;
    this._applyToAllAttached(true);
  }

  onDisable() {
    this._applyToAllAttached(false);
  }

  onWebviewReady(webview) {
    this._attachListeners(webview);
    if (this.enabled) this._inject(webview, true);
  }

  setBypassDomains(domains) {
    this.bypassDomains = domains;
    if (this.enabled) {
      this._applyToAllAttached(true);
    }
  }

  _attachListeners(webview) {
    if (webview._dmAttached) return;
    webview._dmAttached = true;

    webview.addEventListener('dom-ready', () => {
      if (this.enabled) this._inject(webview, true);
    });
  }

  async _loadDarkReaderCode() {
    if (this.darkReaderCode) return this.darkReaderCode;
    try {
      const response = await requestUrl({
        url: 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js',
        method: 'GET'
      });
      if (response.status === 200) {
        this.darkReaderCode = response.text;
        return this.darkReaderCode;
      }
    } catch (e) {
      console.error('[DarkMode] Failed to fetch DarkReader code from CDN:', e);
    }
    return null;
  }

  async _inject(webview, activate) {
    if (!webview || typeof webview.executeJavaScript !== 'function') return;

    // Check DOM-ready, active connection, and active parent
    const isReady = () => {
      try { return webview.isConnected && webview.parentElement && !!webview.getWebContentsId(); }
      catch(e) { return false; }
    };
    if (!isReady()) return;

    if (webview._dmBusy) return;
    webview._dmBusy = true;
    try {
      if (activate) {
        const code = await this._loadDarkReaderCode();
        if (!code) {
          console.warn('[DarkMode] Missing DarkReader source code. Skipping injection.');
          return;
        }

        const serializedBypass = JSON.stringify(this.bypassDomains);

        const enableScript = `
          (function() {
            try {
              if (!window.DarkReader) {
                ${code}
              }
              if (window.DarkReader) {
                const heavyScrollDomains = [
                  'reddit.com', 'youtube.com', 'twitter.com', 'x.com', 'facebook.com',
                  'instagram.com', 'linkedin.com', 'pinterest.com', 'tumblr.com',
                  'tiktok.com', 'feedly.com'
                ];

                const bypassDomains = ${serializedBypass};
                const hostname = window.location.hostname;
                
                const shouldBypass = bypassDomains.some(domain => hostname.includes(domain));
                if (shouldBypass) {
                  DarkReader.disable();
                  return;
                }

                const isHeavy = heavyScrollDomains.some(domain => hostname.includes(domain));
                const selectedEngine = isHeavy ? 'staticTheme' : 'dynamicTheme';

                DarkReader.setFetchMethod(window.fetch);
                DarkReader.enable({ 
                  brightness: 100, 
                  contrast: 95, 
                  sepia: 0,
                  engine: selectedEngine
                });
              }
            } catch (err) {
              console.error('[WebviewSuite - DarkMode] Error inside webview:', err);
            }
          })();
        `;
        await webview.executeJavaScript(enableScript);
      } else {
        const disableScript = `
          (function() {
            try {
              if (window.DarkReader) {
                DarkReader.disable();
              }
            } catch (err) {
              console.error('[WebviewSuite - DarkMode] Error disabling inside webview:', err);
            }
          })();
        `;
        await webview.executeJavaScript(disableScript);
      }
    } catch(err) {
      const msg = err?.message || '';
      // Suppress benign unmounting/destruction warnings
      if (!msg.includes('reply was never sent') && !msg.includes('destroyed')) {
        console.error('[DarkMode] executeJavaScript failed:', err);
      }
    } finally {
      webview._dmBusy = false;
    }
  }

  _applyToAllAttached(activate) {
    if (!this.app) return;

    const windows = new Set([window]);
    const floatingSplit = this.app.workspace.floatingSplit;
    if (floatingSplit?.children) {
      floatingSplit.children.forEach(child => {
        if (child.win) windows.add(child.win);
      });
    }

    const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';
    Array.from(windows).forEach(win => {
      if (!win?.document) return;
      win.document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
        this._inject(wv, activate);
      });
    });
  }
}