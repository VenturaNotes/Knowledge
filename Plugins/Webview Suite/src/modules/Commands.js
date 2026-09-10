/**
 * modules/Commands.js
 *
 * Handles key forwarding from webviews to Obsidian hotkeys, with
 * built-in domain-specific bypass rules to let webpages process keys natively.
 */

export class CommandsModule {
  constructor() {
    this.id = 'commands';
    this.name = 'Webview Commands';
    this.description = 'Fires Obsidian hotkeys while focus is inside a webview, with domain-specific shortcut bypassing';
    this.enabled = true;

    // Domain configuration rules: Array<{ domain: string, enabled: boolean, obsidianChords: string[] }>
    this.rules = [];

    this._lastFired = new Map();
    this._cachedHotkeyMap = null;
    this._heartbeat = null;
    this._errorHandler = null;
    this._rejectionHandler = null;
  }

  onEnable(app) {
    this._app = app;
    this._installCommandShield();
    this._installErrorHandlers(window);
    this._findAndAttach();
    this._heartbeat = setInterval(() => this._findAndAttach(), 5000);

    this._layoutRef = app.workspace.on('layout-change', () => {
      this._cachedHotkeyMap = null;
      this._findAndAttach();
    });
  }

  onDisable() {
    clearInterval(this._heartbeat);
    if (this._layoutRef) this._app.workspace.offref(this._layoutRef);
    this._removeCommandShield();
    this._removeErrorHandlers(window);
  }

  setRules(rules) {
    this.rules = rules || [];
    for (const rule of this.rules) {
      if (!rule.obsidianChords) rule.obsidianChords = [];
    }
  }

  // Called by WebviewManager whenever a webview is ready
  onWebviewReady(webview) {
    this._attachToWebview(webview);
  }

  // Helper to build canonical chords
  static buildChord(e) {
    const parts = [];
    if (e.metaKey)  parts.push('meta');
    if (e.ctrlKey)  parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey)   parts.push('alt');
    if (parts.length === 0) return null;
    let key = (e.key || '').toLowerCase();
    if (key === 'space' || key === ' ') key = ' ';
    return parts.sort().join('+') + '+' + key;
  }

  static normalizeChord(raw) {
    const lower = raw.toLowerCase().trim();
    const parts = lower.split(/[+\s]+/);
    const modifiers = [];
    let key = '';
    const modMap = { cmd: 'meta', command: 'meta', ctrl: 'ctrl', control: 'ctrl', shift: 'shift', alt: 'alt', opt: 'alt', option: 'alt', meta: 'meta' };
    for (const part of parts) {
      if (modMap[part]) { if (!modifiers.includes(modMap[part])) modifiers.push(modMap[part]); }
      else key = part;
    }
    if (!key || modifiers.length === 0) return null;
    if (key === 'space' || key === ' ') key = ' ';
    return modifiers.sort().join('+') + '+' + key;
  }

  // ─── COMMAND SHIELD ────────────────────────────────────────────────────────
  _installCommandShield() {
    if (!window.__ORIGINAL_EXECUTE_COMMAND) {
      window.__ORIGINAL_EXECUTE_COMMAND = this._app.commands.executeCommand;
    }
    const lastFired = this._lastFired;
    const original = window.__ORIGINAL_EXECUTE_COMMAND;
    const self = this;

    this._app.commands.executeCommand = function(command) {
      const id = command?.id || (typeof arguments[0] === 'string' ? arguments[0] : null);
      if (id) {
        if (self._shouldBlockCommandInActiveWebview(id)) {
          return false;
        }
        const now = performance.now();
        if (now - (lastFired.get(id) || 0) < 50) return false;
        lastFired.set(id, now);
      }
      return original.apply(this, arguments);
    };
  }

  _removeCommandShield() {
    if (window.__ORIGINAL_EXECUTE_COMMAND) {
      this._app.commands.executeCommand = window.__ORIGINAL_EXECUTE_COMMAND;
      delete window.__ORIGINAL_EXECUTE_COMMAND;
    }
  }

  _shouldBlockCommandInActiveWebview(commandId) {
    if (!this.rules || this.rules.length === 0) return false;

    const activeLeaf = this._app.workspace.activeLeaf;
    if (!activeLeaf) return false;

    const webview = activeLeaf.view?.containerEl?.querySelector('webview');
    if (!webview) return false;

    const activeEl = document.activeElement;
    const isWebviewFocused = activeEl === webview || webview.contains(activeEl);
    if (!isWebviewFocused) return false;

    let hostname = '';
    try {
      const urlStr = webview.getURL() || webview.src || '';
      if (urlStr) {
        hostname = new URL(urlStr).hostname.toLowerCase();
      }
    } catch (e) {
      return false;
    }
    if (!hostname) return false;

    const rule = this.rules.find(r => {
      if (!r.enabled || !r.domain) return false;
      const dom = r.domain.toLowerCase().trim();
      return hostname === dom || hostname.endsWith('.' + dom);
    });
    if (!rule) return false;

    const blockedChords = rule.obsidianChords || [];
    if (blockedChords.length === 0) return false;

    const hotkeyMap = this._getHotkeyMap();
    for (const [chord, mappedId] of hotkeyMap.entries()) {
      if (mappedId === commandId) {
        if (blockedChords.includes(chord)) {
          return true;
        }
      }
    }

    return false;
  }

  // ─── ERROR HANDLERS ────────────────────────────────────────────────────────
  _installErrorHandlers(win) {
    if (!win || win._errorHandlersBound) return;
    win._errorHandlersBound = true;
    this._errorHandler = (event) => {
      const msg = event.message || event.error?.message;
      if (msg && (msg.includes('setIgnoreMenuShortcuts') || msg.includes('Object has been destroyed'))) {
        event.preventDefault();
      }
    };
    this._rejectionHandler = (event) => {
      const msg = event.reason?.message || String(event.reason);
      if (msg && (msg.includes('setIgnoreMenuShortcuts') || msg.includes('Object has been destroyed') || msg.includes('GUEST_VIEW_MANAGER_CALL'))) {
        event.preventDefault();
      }
    };
    win.addEventListener('error', this._errorHandler);
    win.addEventListener('unhandledrejection', this._rejectionHandler);
  }

  _removeErrorHandlers(win) {
    if (!win) return;
    win.removeEventListener('error', this._errorHandler);
    win.removeEventListener('unhandledrejection', this._rejectionHandler);
    delete win._errorHandlersBound;
  }

  // ─── HOTKEY MAP ────────────────────────────────────────────────────────────
  _getHotkeyMap() {
    if (this._cachedHotkeyMap) return this._cachedHotkeyMap;
    const map = new Map();
    const hkm = this._app.hotkeyManager;
    const isMac = typeof process !== 'undefined' ? process.platform === 'darwin' : navigator.platform.toUpperCase().includes('MAC');
    for (const [id] of Object.entries(this._app.commands.commands)) {
      // Obsidian's own rule: if a command has a customKeys entry at all -- even
      // an empty array, meaning the user explicitly cleared its hotkey -- that
      // entry is authoritative and the default is dropped. Always merging both
      // (as before) resurrects "ghost" defaults the user removed, causing
      // webviews to swallow keys Obsidian itself no longer treats as bound.
      const custom = hkm.customKeys?.[id];
      const keys = custom !== undefined ? custom : (hkm.defaultKeys?.[id] || []);
      for (const hk of keys) {
        const parts = [];
        if (hk.modifiers.includes('Mod'))   parts.push(isMac ? 'meta' : 'ctrl');
        if (hk.modifiers.includes('Ctrl'))  parts.push('ctrl');
        if (hk.modifiers.includes('Meta'))  parts.push('meta');
        if (hk.modifiers.includes('Shift')) parts.push('shift');
        if (hk.modifiers.includes('Alt'))   parts.push('alt');
        let key = (hk.key || '').toLowerCase();
        if (key === 'space' || key === ' ') key = ' ';
        const combo = [...new Set(parts)].sort().join('+') + '+' + key;
        map.set(combo, id);
      }
    }
    this._cachedHotkeyMap = map;
    return map;
  }

  // ─── WEBVIEW ATTACHMENT ────────────────────────────────────────────────────
  async _attachToWebview(webview) {
    if (!webview || !webview.isConnected) return;

    // 1. Native Hardware Hotkey Bubbler
    const tryHookBubbler = () => {
      try {
        const remote = window.require?.('@electron/remote') || require('@electron/remote');
        if (!remote || !remote.webContents) return;

        const wcId = typeof webview.getWebContentsId === 'function' ? webview.getWebContentsId() : null;
        if (!wcId) return;

        if (webview.__bubblerAttachedTo === wcId) return;
        webview.__bubblerAttachedTo = wcId;

        const wc = remote.webContents.fromId(wcId);
        if (wc) {
          wc.on('before-input-event', (event, input) => {
            let eventType = null;
            if (input.type === 'keyDown') eventType = 'keydown';
            else if (input.type === 'keyUp') eventType = 'keyup';
            else return;

            // If this keydown is a recognized Obsidian hotkey, the injected
            // page script (see `inject()` below) already owns forwarding it
            // via OBS_RAW_KEY -> executeCommandById. Replaying it here too
            // would fire the command twice, so we defer to that path instead
            // of replaying. Non-hotkey keys still pass through normally.
            if (eventType === 'keydown') {
              const parts = [];
              if (input.control) parts.push('ctrl');
              if (input.meta)    parts.push('meta');
              if (input.shift)   parts.push('shift');
              if (input.alt)     parts.push('alt');
              if (parts.length > 0) {
                let key = (input.key || '').toLowerCase();
                if (key === 'space' || key === ' ') key = ' ';
                const chord = parts.sort().join('+') + '+' + key;
                if (this._getHotkeyMap().has(chord)) return;
              }
            }

            const win = webview.ownerDocument?.defaultView || window;
            const target = webview || win.document.activeElement || win.document.body;

            const kbEvent = new win.KeyboardEvent(eventType, {
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

            // Defer dispatching to the next tick so Chromium finishes native input routing
            // to the webview BEFORE any Obsidian focus shifts occur
            setTimeout(() => {
              if (target && target.isConnected) {
                target.dispatchEvent(kbEvent);
              }
            }, 0);
          });
        }
      } catch (e) {}
    };

    tryHookBubbler();
    webview.addEventListener('dom-ready', tryHookBubbler);
    webview.addEventListener('did-attach', tryHookBubbler);

    // 2. Injected Script Attachment
    if (webview._commandsAttached) return;
    webview._commandsAttached = true;

    const isReady = () => {
      try { return webview.isConnected && webview.parentElement && !!webview.getWebContentsId(); }
      catch(e) { return false; }
    };

    webview.addEventListener('console-message', (e) => {
      let leaf = null;
      this._app.workspace.iterateAllLeaves(l => {
        if (l.view?.containerEl?.contains(webview)) leaf = l;
      });
      if (!leaf) return;

      const win = leaf.view.containerEl.win;
      this._installErrorHandlers(win);

      if (e.message === 'OBS_ACTIVATE') {
        if (this._app.workspace.activeLeaf !== leaf || window.activeWindow !== win) {
          if (window.activeWindow !== win) win.focus();
          this._app.workspace.setActiveLeaf(leaf, { focus: false });
        }
        return;
      }

      if (e.message?.startsWith('OBS_RAW_KEY:')) {
        const rawChord = e.message.split('OBS_RAW_KEY:')[1];
        const chord = rawChord.includes(':') ? rawChord.replace(':', '+') : rawChord;
        const commandId = this._getHotkeyMap().get(chord);
        if (commandId) {
          if (this._app.workspace.activeLeaf !== leaf) return;
          if (window.activeWindow !== win) win.focus();
          this._app.workspace.setActiveLeaf(leaf, { focus: false });
          webview.blur();
          this._app.commands.executeCommandById(commandId);
        }
      }
    });

    const inject = () => {
      if (!isReady()) return;

      let hasObsidianBlockRules = false;
      try {
        const urlStr = webview.getURL() || webview.src || '';
        if (urlStr) {
          const url = new URL(urlStr);
          const host = url.hostname.toLowerCase();
          hasObsidianBlockRules = this.rules?.some(r => {
            if (!r.enabled || !r.domain) return false;
            const dom = r.domain.toLowerCase().trim();
            const matchesDomain = host === dom || host.endsWith('.' + dom);
            return matchesDomain && r.obsidianChords && r.obsidianChords.length > 0;
          }) || false;
        }
      } catch (e) {}

      try {
        if (typeof webview.setIgnoreMenuShortcuts === 'function') {
          webview.setIgnoreMenuShortcuts(hasObsidianBlockRules);
        }
      } catch (err) {}

      const serializedRules = JSON.stringify(
        this.rules.filter(r => r.enabled && r.domain).map(r => ({
          domain: r.domain,
          obsidianChords: r.obsidianChords || []
        }))
      );

      const hotkeyChords = JSON.stringify(Array.from(this._getHotkeyMap().keys()));

      webview.executeJavaScript(`
        (function() {
          window._obsRules = ${serializedRules};
          window._obsHotkeyChords = ${hotkeyChords};

          if (window._obsHotkeysActive) return;
          window._obsHotkeysActive = true;

          window.addEventListener('mousedown', () => console.log('OBS_ACTIVATE'), { capture: true });

          function handleKeydown(e) {
            const parts = [];
            if (e.ctrlKey)  parts.push('ctrl');
            if (e.metaKey)  parts.push('meta');
            if (e.shiftKey) parts.push('shift');
            if (e.altKey)   parts.push('alt');
            if (parts.length === 0) return;

            let key = (e.key || '').toLowerCase();
            if (key === 'space' || key === ' ') key = ' ';

            const mods = parts.sort().join('+');
            const ruleChord = mods + '+' + key;
            const hotkeyChord = mods + ':' + key;

            const hostname = window.location.hostname;
            
            const rule = window._obsRules?.find(r => {
              if (!r.domain) return false;
              const dom = r.domain.toLowerCase().trim();
              const host = hostname.toLowerCase();
              return host === dom || host.endsWith('.' + dom);
            });

            if (rule && rule.obsidianChords && rule.obsidianChords.includes(ruleChord)) {
              return;
            }

            // Default: any chord matching a real Obsidian hotkey gets forwarded
            // here, unconditionally (not just when a domain rule configures
            // obsidianChords). This is now the ONLY path that fires Obsidian
            // commands from a focused webview -- the host-side hardware
            // bubbler explicitly defers to this for these chords, so there's
            // no double-fire and no gap on domains without configured rules.
            if (window._obsHotkeyChords?.includes(ruleChord)) {
              e.preventDefault();
              e.stopImmediatePropagation();
              console.log('OBS_RAW_KEY:' + hotkeyChord);
            }
          }

          function attachToFrame(iframe) {
            if (!iframe) return;
            try {
              const win = iframe.contentWindow;
              if (win) {
                win.addEventListener('keydown', handleKeydown, { capture: true });
              }
            } catch (err) {}

            iframe.addEventListener('load', () => {
              try {
                const win = iframe.contentWindow;
                if (win) {
                  win.removeEventListener('keydown', handleKeydown, { capture: true });
                  win.addEventListener('keydown', handleKeydown, { capture: true });
                }
              } catch (e) {}
            }, { once: false });
          }

          window.addEventListener('keydown', handleKeydown, { capture: true });

          document.querySelectorAll('iframe').forEach((iframe) => {
            attachToFrame(iframe);
          });

          const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              for (const node of mutation.addedNodes) {
                if (node.tagName === 'IFRAME') {
                  attachToFrame(node);
                }
              }
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        })();
      `).catch(() => {});
    };

    webview.addEventListener('dom-ready', inject);
    webview.addEventListener('did-start-navigation', inject);
    if (isReady()) inject();
  }

  reinjectAll() {
    this._cachedHotkeyMap = null;
    document.querySelectorAll('div.external-link-view webview, .webviewer-content webview')
      .forEach(wv => {
        if (wv._commandsAttached) {
          wv._commandsAttached = false;
          this._attachToWebview(wv);
        }
      });
  }

  _findAndAttach() {
    this._app.workspace.iterateAllLeaves(leaf => {
      const webview = leaf.view?.containerEl?.querySelector('webview');
      if (webview) {
        this._attachToWebview(webview);
      }
    });
  }
}