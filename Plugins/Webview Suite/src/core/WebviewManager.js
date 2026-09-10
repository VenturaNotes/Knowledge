/**
 * core/WebviewManager.js
 *
 * Shared infrastructure used by all modules:
 * - Window discovery (main + popout windows)
 * - Webview attachment lifecycle
 * - Layout/window-open event wiring
 *
 * Modules register themselves via registerModule(). WebviewManager
 * calls onWebviewReady(webview) on each module when a new webview attaches,
 * and fires onEnable/onDisable when the module's toggle changes.
 */

export const WEBVIEW_SELECTOR = 'div.external-link-view webview, .webviewer-content webview';

export class WebviewManager {
  constructor(app) {
    this.app = app;
    this.modules = [];
    this._layoutHandler = null;
    this._windowHandler = null;
    this._heartbeat = null;
  }

  registerModule(module) {
    this.modules.push(module);
  }

  // Returns all open DOM windows (main + any popout/floating windows)
  getActiveWindows() {
    const windows = new Set([window]);
    const floatingSplit = this.app.workspace.floatingSplit;
    if (floatingSplit?.children) {
      floatingSplit.children.forEach(child => {
        if (child.win) windows.add(child.win);
      });
    }
    return Array.from(windows);
  }

  // Calls onWebviewReady on all enabled modules for a given webview
  _notifyModules(webview) {
    for (const mod of this.modules) {
      if (mod.enabled) {
        try { mod.onWebviewReady(webview); } catch(e) {
          console.error(`[WebviewSuite] ${mod.id} onWebviewReady error:`, e);
        }
      }
    }
  }

  // Scans all windows and attaches to any unattached webviews
  findAndAttach() {
    const windows = this.getActiveWindows();
    windows.forEach(win => {
      if (!win?.document) return;
      win.document.querySelectorAll(WEBVIEW_SELECTOR).forEach(wv => {
        // Each module tracks its own attachment flag to avoid double-init
        this._notifyModules(wv);
      });
    });
  }

  start() {
    let debounceTimer;
    const triggerAttach = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.findAndAttach(), 500);
    };

    this._layoutHandler = this.app.workspace.on('layout-change', triggerAttach);
    this._windowHandler = this.app.workspace.on('window-open', triggerAttach);
    this._heartbeat = setInterval(() => this.findAndAttach(), 5000);

    this.findAndAttach();
  }

  stop() {
    if (this._layoutHandler) this.app.workspace.offref(this._layoutHandler);
    if (this._windowHandler)  this.app.workspace.offref(this._windowHandler);
    if (this._heartbeat)      clearInterval(this._heartbeat);
  }
}
