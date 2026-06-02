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

    // Domain bypass rules: Array<{ domain: string, enabled: boolean, chords: string[] }>
    this.rules = [];

    this._lastFired = new Map();
    this._cachedHotkeyMap = null;
    this._leafParentMap = new WeakMap();
    this._isRecreating = false;
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
      this._processMovement();
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
    this._app.commands.executeCommand = function(command) {
      const id = command?.id || (typeof arguments[0] === 'string' ? arguments[0] : null);
      if (id) {
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
      const msg = event.reason?.message || event.reason;
      if (msg && (msg.includes('setIgnoreMenuShortcuts') || msg.includes('Object has been destroyed'))) {
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
      const keys = [...(hkm.customKeys?.[id] || []), ...(hkm.defaultKeys?.[id] || [])];
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

    // Prevent duplicate listeners or immediate injections from stacking
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
        const chord = e.message.split('OBS_RAW_KEY:')[1];
        const commandId = this._getHotkeyMap().get(chord);
        if (commandId) {
          if (this._app.workspace.activeLeaf !== leaf) return; // Tab already switched — abort
          if (window.activeWindow !== win) win.focus();
          this._app.workspace.setActiveLeaf(leaf, { focus: false });
          webview.blur();
          this._app.commands.executeCommandById(commandId);
        }
      }
    });

    const inject = () => {
      if (!isReady()) return;

      // Filter out empty rules and pass valid ones to the webview
      const serializedRules = JSON.stringify(
        this.rules.filter(r => r.enabled && r.domain).map(r => ({ domain: r.domain, chords: r.chords }))
      );

      webview.executeJavaScript(`
        (function() {
          window._obsBlockRules = ${serializedRules};

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
            
            // Match exact domain or subdomain
            const rule = window._obsBlockRules?.find(r => {
              if (!r.domain) return false;
              const dom = r.domain.toLowerCase().trim();
              const host = hostname.toLowerCase();
              return host === dom || host.endsWith('.' + dom);
            });

            // Intercept ONLY if a rule matching this domain is active and covers this chord
            if (rule && rule.chords.includes(ruleChord)) {
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

          // 1. Intercept keys in the parent document window
          window.addEventListener('keydown', handleKeydown, { capture: true });

          // 2. Intercept keys inside existing static same-origin iframes
          document.querySelectorAll('iframe').forEach((iframe) => {
            attachToFrame(iframe);
          });

          // 3. Monitor for newly added dynamic same-origin iframes (e.g. Google Docs' inputs)
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

  // Force-updates injected rules across all active webviews (invoked during settings alterations)
  reinjectAll() {
    this._cachedHotkeyMap = null;
    document.querySelectorAll('div.external-link-view webview, .webviewer-content webview')
      .forEach(wv => {
        // Reset attached flag to trigger rule re-injection
        if (wv._commandsAttached) {
          wv._commandsAttached = false;
          this._attachToWebview(wv);
        }
      });
  }

  // ─── MOVEMENT DETECTION ────────────────────────────────────────────────────
  async _processMovement() {
    if (this._isRecreating) return;
    let movedLeaf = null;
    this._app.workspace.iterateAllLeaves(leaf => {
      if (movedLeaf) return;
      const webview = leaf.view?.containerEl?.querySelector('webview');
      if (!webview) return;
      const currentParentId = leaf.parent?.id;
      const lastParentId = this._leafParentMap.get(leaf);
      if (lastParentId && currentParentId !== lastParentId) movedLeaf = leaf;
      this._leafParentMap.set(leaf, currentParentId);
    });

    if (movedLeaf) {
      this._isRecreating = true;
      await new Promise(r => setTimeout(r, 150));
      const state = movedLeaf.getViewState();
      const wasActive = this._app.workspace.activeLeaf === movedLeaf;
      const originalActiveLeaf = this._app.workspace.activeLeaf;
      this._app.workspace.setActiveLeaf(movedLeaf, { focus: false });
      const newLeaf = this._app.workspace.getLeaf('tab');
      await newLeaf.setViewState(state);
      movedLeaf.detach();
      if (wasActive) this._app.workspace.setActiveLeaf(newLeaf, { focus: true });
      else this._app.workspace.setActiveLeaf(originalActiveLeaf, { focus: true });
      this._leafParentMap.set(newLeaf, newLeaf.parent?.id);
      setTimeout(() => { this._isRecreating = false; this._findAndAttach(); }, 400);
    }
  }

  _findAndAttach() {
    this._app.workspace.iterateAllLeaves(leaf => {
      const webview = leaf.view?.containerEl?.querySelector('webview');
      if (webview) {
        this._attachToWebview(webview);
        if (!this._leafParentMap.has(leaf)) this._leafParentMap.set(leaf, leaf.parent?.id);
      }
    });
  }
}