/**
 * modules/VideoEnhancer.js
 */

const INJECT_SCRIPT = `(function() {
  try {
    const hostname = window.location.hostname;
    const isYouTube = hostname.includes('youtube.com');
    const isTikTok  = hostname.includes('tiktok.com');
    if (!isYouTube && !isTikTok) return;

    const guardKey = '__enhancerActive_' + hostname.replace(/\\.+/g, '_');
    if (window[guardKey]) return;
    window[guardKey] = true;

    let preResetSpeed = null;

    const getVideo = () => {
      if (isTikTok) {
        const videos = Array.from(document.querySelectorAll('video'));
        return videos.find(v => !v.paused) || videos[0] || null;
      }
      return document.querySelector('video');
    };

    const showBadge = (text) => {
      let badge = document.getElementById('__yt-speed-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = '__yt-speed-badge';
        badge.style.cssText = \`
          position:fixed; top:12px; left:50%; transform:translateX(-50%);
          background:rgba(0,0,0,0.75); color:#fff; font-size:18px;
          font-family:sans-serif; padding:4px 14px; border-radius:6px;
          z-index:999999; pointer-events:none; transition:opacity 0.3s;
        \`;
        if (document.body) document.body.appendChild(badge);
      }
      badge.textContent = text;
      badge.style.opacity = '1';
      clearTimeout(badge.__hideTimer);
      badge.__hideTimer = setTimeout(() => badge.style.opacity = '0', 1200);
    };

    const setSpeed = (speed) => {
      const video = getVideo();
      if (!video) return;
      speed = Math.max(0.1, Math.round(speed * 10) / 10);
      video.playbackRate = speed;
      showBadge(speed + 'x');
    };

    window.__ytEnhancerSetFullscreen = (enable) => {
      let style = document.getElementById('__yt-fs-styles');
      if (style) style.remove();
      if (!enable) return;

      const target = document.head || document.documentElement;
      if (!target) return;

      style = document.createElement('style');
      style.id = '__yt-fs-styles';
      const youtubeCSS = \`
        html, body, ytd-app { overflow: hidden !important; }
        ytd-app, #content, #page-manager, ytd-watch-flexy,
        #player, #player-container, #player-container-inner, .html5-video-player {
          width:100vw !important; height:100vh !important; max-width:100vw !important;
          max-height:100vh !important; top:0 !important; left:0 !important;
          position:fixed !important; z-index:999999 !important;
        }
        video {
          width:100vw !important; height:100vh !important; max-width:100vw !important;
          max-height:100vh !important; top:0 !important; left:0 !important;
          position:fixed !important; z-index:999999 !important; object-fit:contain !important;
        }
        ytd-masthead, #masthead-container, #secondary, #below,
        #comments, ytd-watch-next-secondary-results-renderer { display:none !important; }
      \`;
      const tiktokCSS = \`
        html, body { overflow: hidden !important; }
        video {
          width:100vw !important; height:100vh !important; max-width:100vw !important;
          max-height:100vh !important; top:0 !important; left:0 !important;
          position:fixed !important; z-index:999999 !important; object-fit:contain !important;
        }
        header, footer, [class*="DivHeader"], [class*="DivSideBar"],
        [class*="DivActionItem"], [class*="DivInfoContainer"],
        [class*="DivVideoInfoContainer"], [class*="DivBrowserModeContainer"] { display:none !important; }
      \`;
      style.textContent = isYouTube ? youtubeCSS : tiktokCSS;
      target.appendChild(style);
    };

    document.addEventListener('keydown', (e) => {
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      if (e.target.isContentEditable) return;
      if (e.target.closest('input, textarea, [contenteditable="true"]')) return;
      const video = getVideo();
      if (!video) return;
      const key = e.key.toLowerCase();
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (key) {
        case 'd': e.stopPropagation(); setSpeed(video.playbackRate + 0.1); break;
        case 's': e.stopPropagation(); setSpeed(video.playbackRate - 0.1); break;
        case 'r': {
          e.stopPropagation();
          const current = Math.round(video.playbackRate * 10) / 10;
          if (current !== 1.0) { preResetSpeed = current; setSpeed(1.0); }
          else if (preResetSpeed !== null) { const r = preResetSpeed; preResetSpeed = null; setSpeed(r); }
          break;
        }
        case 'f':
          e.stopPropagation(); e.preventDefault();
          console.log('YT_ENHANCER_TOGGLE_FULLSCREEN');
          break;
        case 'h': {
          e.stopPropagation();
          let style = document.getElementById('__yt-hyde-styles');
          if (style) { style.remove(); } else {
            const target = document.head || document.documentElement;
            if (!target) break;
            style = document.createElement('style');
            style.id = '__yt-hyde-styles';
            style.textContent = \`
              .ytp-chrome-bottom, .ytp-chrome-top, .ytp-gradient-bottom,
              .ytp-gradient-top, .ytp-pause-overlay {
                opacity:0 !important; pointer-events:none !important;
                transition:opacity 0.15s ease-in-out !important;
              }
            \`;
            target.appendChild(style);
          }
          break;
        }
        case 'escape':
          e.stopPropagation(); e.preventDefault();
          console.log('YT_ENHANCER_EXIT_FULLSCREEN');
          break;
      }
    }, true);
  } catch (err) {}
})();`;

export class VideoEnhancerModule {
  constructor() {
    this.id = 'videoEnhancer';
    this.name = 'Video Enhancer';
    this.description = 'Speed controls and fullscreen for YouTube and TikTok (D/S/R/F/H keys)';
    this.enabled = false;
  }

  onEnable() {
    this._applyToAllAttached();
  }

  onDisable() {}

  onWebviewReady(webview) {
    this._attachListeners(webview);
    this._setupFullscreen(webview);
    // Only inject on discovery if not already injected for this page
    if (this.enabled && !webview._enhancerInjected) {
      this._inject(webview);
    }
  }

  _attachListeners(webview) {
    if (webview._enhancerAttached) return;
    webview._enhancerAttached = true;

    // Reset injected flag on new navigations
    const onNav = () => { webview._enhancerInjected = false; };
    webview.addEventListener('did-start-navigation', onNav);

    // Wait for DOM to be ready before injecting
    const onReady = () => {
      this._setupFullscreen(webview);
      if (this.enabled) this._inject(webview);
    };
    webview.addEventListener('dom-ready', onReady);
    webview.addEventListener('did-navigate-in-page', onReady);
  }

  _setupFullscreen(webview) {
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
      originalStyles = { position: leaf.style.position, top: leaf.style.top, left: leaf.style.left, width: leaf.style.width, height: leaf.style.height, zIndex: leaf.style.zIndex, overflow: leaf.style.overflow };
      originalWvStyles = { position: webview.style.position, top: webview.style.top, left: webview.style.left, width: webview.style.width, height: webview.style.height, zIndex: webview.style.zIndex, overflow: webview.style.overflow };
      
      Object.assign(leaf.style, { position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh', zIndex:'25', overflow:'hidden' });
      Object.assign(webview.style, { position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh', zIndex:'26', overflow:'hidden' });
      
      try { webview.executeJavaScript(`window.__ytEnhancerSetFullscreen && window.__ytEnhancerSetFullscreen(true);`); } catch(err) {}
    };

    const exitFullscreen = () => {
      if (!webview._isFullscreen) return;
      const leaf = getLeaf();
      webview._isFullscreen = false;
      if (leaf && originalStyles) Object.assign(leaf.style, originalStyles);
      originalStyles = null;
      if (originalWvStyles) Object.assign(webview.style, originalWvStyles);
      originalWvStyles = null;
      try { webview.executeJavaScript(`window.__ytEnhancerSetFullscreen && window.__ytEnhancerSetFullscreen(false);`); } catch(err) {}
    };

    webview._enterFullscreen = enterFullscreen;
    webview._exitFullscreen = exitFullscreen;
    webview._toggleFullscreen = () => webview._isFullscreen ? exitFullscreen() : enterFullscreen();

    webview.addEventListener('enter-html-full-screen', enterFullscreen);
    webview.addEventListener('leave-html-full-screen', exitFullscreen);
    webview.addEventListener('console-message', (e) => {
      if (e.message === 'YT_ENHANCER_TOGGLE_FULLSCREEN') webview._toggleFullscreen();
      else if (e.message === 'YT_ENHANCER_EXIT_FULLSCREEN') exitFullscreen();
    });

    const win = webview.ownerDocument?.defaultView;
    if (win && !win.__YT_PARENT_LISTENERS_SET) {
      win.__YT_PARENT_LISTENERS_SET = true;
      const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

      win.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        let captured = false;
        win.document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
          if (wv._isFullscreen && typeof wv._exitFullscreen === 'function') {
            wv._exitFullscreen(); captured = true;
          }
        });
        if (captured) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    }
  }

  async _inject(webview) {
    if (!webview || typeof webview.executeJavaScript !== 'function') return;

    const isReady = () => {
      try { return webview.isConnected && webview.parentElement && !!webview.getWebContentsId(); }
      catch(e) { return false; }
    };
    if (!isReady()) return;

    // 1. Host-side URL check: avoid touching non-video domains/PDFs
    const currentUrl = (webview.getURL?.() || webview.src || '').toLowerCase();
    if (!currentUrl.includes('youtube.com') && !currentUrl.includes('tiktok.com')) return;

    try {
      await webview.executeJavaScript(INJECT_SCRIPT);
      webview._enhancerInjected = true;
    } catch(err) {
      const msg = err?.message || '';
      if (
        !msg.includes('reply was never sent') && 
        !msg.includes('destroyed') &&
        !msg.includes('GUEST_VIEW_MANAGER_CALL') &&
        !msg.includes('Script failed to execute')
      ) {
        console.error('[VideoEnhancer] executeJavaScript failed:', err);
      }
    }
  }

  _applyToAllAttached() {
    document.querySelectorAll('div.external-link-view webview, .webviewer-content webview')
      .forEach(wv => this._inject(wv));
  }
}