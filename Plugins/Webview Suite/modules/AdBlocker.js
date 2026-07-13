/**
 * modules/AdBlocker.js
 */

const ACTIVATE_SCRIPT = `(function() {
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
    const style = document.createElement('style');
    style.id = 'yt-ad-hider-styles';
    style.textContent = \`
      #masthead-ad, ytd-companion-card-renderer, .ytp-ad-overlay-container,
      .ytp-ad-message-container, #player-ads, ytd-promoted-sparkles-web-renderer,
      ytd-display-ad-renderer, .ytd-carousel-ad-renderer,
      .ytd-action-companion-ad-renderer, .ytd-statement-banner-renderer,
      .ytd-in-feed-ad-layout-renderer { display: none !important; }
    \`;
    document.head.appendChild(style);
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
})();`;

const DEACTIVATE_SCRIPT = `(function() {
  window.__ytAdBlockActive = false;
  if (window.__ytAdBlockState?.interval)  clearInterval(window.__ytAdBlockState.interval);
  if (window.__ytAdBlockState?.observer)  window.__ytAdBlockState.observer.disconnect();
  if (typeof window.__ytAdBlockState?.restore === 'function') window.__ytAdBlockState.restore();
  document.getElementById('yt-ad-hider-styles')?.remove();
  window.__ytAdBlockState = null;
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

  // Called by WebviewManager whenever a webview is found (new or existing)
  onWebviewReady(webview) {
    this._attachListeners(webview);
    if (this.enabled) this._inject(webview, true);
  }

  _attachListeners(webview) {
    if (webview._abAttached) return;
    webview._abAttached = true;

    const onReady = () => { if (this.enabled) this._inject(webview, true); };
    webview.addEventListener('dom-ready', onReady);
    webview.addEventListener('did-navigate', onReady);
    webview.addEventListener('did-navigate-in-page', onReady);
  }

  async _inject(webview, activate) {
    if (!webview || typeof webview.executeJavaScript !== 'function') return;

    // Check DOM-ready, active connection, and active parent
    const isReady = () => {
      try { return webview.isConnected && webview.parentElement && !!webview.getWebContentsId(); }
      catch(e) { return false; }
    };
    if (!isReady()) return;

    if (webview._abBusy) return;
    webview._abBusy = true;
    try {
      await webview.executeJavaScript(activate ? ACTIVATE_SCRIPT : DEACTIVATE_SCRIPT);
    } catch(err) {
      const msg = err?.message || '';
      // Suppress benign unmounting/destruction warnings
      if (!msg.includes('reply was never sent') && !msg.includes('destroyed')) {
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