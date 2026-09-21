/**
 * modules/AdBlocker.js
 */

const ACTIVATE_SCRIPT = `(function() {
  try {
    if (!window.location.hostname.includes('youtube.com')) return;
    if (window.__ytAdBlockActive) return;
    window.__ytAdBlockActive = true;

    const skipAd = () => {
      const selectors = [
        '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern',
        '.ytp-ad-skip-button-slot', '.videoAdUiSkipButton', '.ytp-ad-skip-button-text'
      ];
      for (const sel of selectors) {
        const btn = document.querySelector(sel);
        if (btn) { btn.click(); return true; }
      }
      return false;
    };

    const injectStyles = () => {
      if (document.getElementById('yt-ad-hider-styles')) return;
      const target = document.head || document.documentElement;
      if (!target) return;

      const style = document.createElement('style');
      style.id = 'yt-ad-hider-styles';
      style.textContent = \`
        #masthead-ad, ytd-companion-card-renderer, .ytp-ad-overlay-container,
        .ytp-ad-message-container, #player-ads, ytd-promoted-sparkles-web-renderer,
        ytd-display-ad-renderer, .ytd-carousel-ad-renderer,
        .ytd-action-companion-ad-renderer, .ytd-statement-banner-renderer,
        .ytd-in-feed-ad-layout-renderer { display: none !important; }
      \`;
      target.appendChild(style);
    };

    let previousSpeed = 1;
    let isAdActive = false;

    const checkAndSkipAds = () => {
      const video = document.querySelector('video');
      if (!video) return;
      const isAdShowing = document.querySelector('.ad-showing, .ad-interrupting, .html5-video-player.ad-showing');
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

    const startObserver = () => {
      if (!document.body) {
        window.addEventListener('DOMContentLoaded', startObserver, { once: true });
        return;
      }
      const observer = new MutationObserver(() => { checkAndSkipAds(); skipAd(); });
      observer.observe(document.body, { childList: true, subtree: true });
      const interval = setInterval(() => { checkAndSkipAds(); injectStyles(); }, 300);

      window.__ytAdBlockState = {
        observer, interval,
        restore: () => {
          const video = document.querySelector('video');
          if (video && isAdActive) { video.playbackRate = previousSpeed || 1; video.muted = false; }
        }
      };
    };

    startObserver();
  } catch (err) {}
})();`;

const DEACTIVATE_SCRIPT = `(function() {
  try {
    window.__ytAdBlockActive = false;
    if (window.__ytAdBlockState?.interval)  clearInterval(window.__ytAdBlockState.interval);
    if (window.__ytAdBlockState?.observer)  window.__ytAdBlockState.observer.disconnect();
    if (typeof window.__ytAdBlockState?.restore === 'function') window.__ytAdBlockState.restore();
    document.getElementById('yt-ad-hider-styles')?.remove();
    window.__ytAdBlockState = null;
  } catch (err) {}
})();`;

export class AdBlockerModule {
  constructor() {
    this.id = 'adBlocker';
    this.name = 'Ad Blocker';
    this.description = 'Skips and hides YouTube ads';
    this.enabled = false;
  }

  onEnable() {
    this._applyToAllAttached(true);
  }

  onDisable() {
    this._applyToAllAttached(false);
  }

  onWebviewReady(webview) {
    this._attachListeners(webview);
    // Only inject on discovery if not already injected for this page
    if (this.enabled && !webview._abInjected) {
      this._inject(webview, true);
    }
  }

  _attachListeners(webview) {
    if (webview._abAttached) return;
    webview._abAttached = true;

    // Reset injected flag on new navigations
    const onNav = () => { webview._abInjected = false; };
    webview.addEventListener('did-start-navigation', onNav);

    // Inject only when DOM is fully ready
    const onReady = () => {
      if (this.enabled) this._inject(webview, true);
    };
    webview.addEventListener('dom-ready', onReady);
    webview.addEventListener('did-navigate-in-page', onReady);
  }

  async _inject(webview, activate) {
    if (!webview || typeof webview.executeJavaScript !== 'function') return;

    const isReady = () => {
      try { return webview.isConnected && webview.parentElement && !!webview.getWebContentsId(); }
      catch(e) { return false; }
    };
    if (!isReady()) return;

    // 1. Host-side URL check: avoid touching non-YouTube webviews/PDFs
    const currentUrl = (webview.getURL?.() || webview.src || '').toLowerCase();
    if (activate && !currentUrl.includes('youtube.com')) return;

    if (webview._abBusy) return;
    webview._abBusy = true;
    try {
      await webview.executeJavaScript(activate ? ACTIVATE_SCRIPT : DEACTIVATE_SCRIPT);
      webview._abInjected = activate;
    } catch(err) {
      const msg = err?.message || '';
      // Suppress benign guest unmounting, lifecycle, and IPC execution drops
      if (
        !msg.includes('reply was never sent') && 
        !msg.includes('destroyed') &&
        !msg.includes('GUEST_VIEW_MANAGER_CALL') &&
        !msg.includes('Script failed to execute')
      ) {
        console.error('[AdBlocker] executeJavaScript failed:', err);
      }
    } finally {
      webview._abBusy = false;
    }
  }

  _applyToAllAttached(activate) {
    document.querySelectorAll('div.external-link-view webview, .webviewer-content webview')
      .forEach(wv => this._inject(wv, activate));
  }
}