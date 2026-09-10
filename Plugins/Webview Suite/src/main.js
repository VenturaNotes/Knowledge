/**
 * main.js
 * Webview Suite — Obsidian Plugin Entry Point
 *
 * Wires together all modules via WebviewManager and StateManager.
 */

import { Plugin, Notice } from 'obsidian';

import { WebviewManager }          from './core/WebviewManager.js';
import { StateManager }            from './core/StateManager.js';
import { 
  CloudflareBypassModule, 
  IsolatedWebView, 
  VIEW_TYPE_ISOLATED_WEBVIEW 
} from './modules/CloudflareBypass.js'; // NEW
import { AdBlockerModule }         from './modules/AdBlocker.js';
import { DarkModeModule }          from './modules/DarkMode.js';
import { VideoEnhancerModule }     from './modules/VideoEnhancer.js';
import { CommandsModule }          from './modules/Commands.js';
import { IncognitoModule }         from './modules/Incognito.js';
import { WebviewSuiteSettingsTab } from './settings/SettingsTab.js';

export default class WebviewSuitePlugin extends Plugin {

  async onload() {
    // ── 1. STATE ─────────────────────────────────────────────────────────────
    this.state = new StateManager(this);
    await this.state.load();

    // ── 2. REGISTER BUILT-IN VIEW ────────────────────────────────────────────
    this.registerView(
      VIEW_TYPE_ISOLATED_WEBVIEW,
      (leaf) => new IsolatedWebView(leaf, this)
    );

    // ── 3. MODULES ───────────────────────────────────────────────────────────
    this.modules = {
      adBlocker:        new AdBlockerModule(),
      darkMode:         new DarkModeModule(),
      videoEnhancer:    new VideoEnhancerModule(),
      commands:         new CommandsModule(),
      incognito:        new IncognitoModule(),
      cloudflareBypass: new CloudflareBypassModule(),
    };

    // Restore enabled states and module-specific data from saved settings
    for (const [id, mod] of Object.entries(this.modules)) {
      const saved = this.state.get(id);
      mod.enabled = saved?.enabled ?? mod.enabled;
    }

    // Load active domain rules directly into the Commands module
    const sbState = this.state.get('shortcutBlocker');
    this.modules.commands.setRules(sbState?.rules || []);

    // Load bypass domains into the Dark Mode module
    const dmState = this.state.get('darkMode');
    this.modules.darkMode.setBypassDomains(dmState?.bypassDomains || []);

    // Load bypass domains into the Cloudflare Bypass module
    const cbState = this.state.get('cloudflareBypass');
    this.modules.cloudflareBypass.setBypassDomains(cbState?.bypassDomains || []);

    // ── 4. ENABLE ACTIVE MODULES ─────────────────────────────────────────────
    // Modules are fully enabled first to prevent race conditions during early webview discoveries
    for (const mod of Object.values(this.modules)) {
      if (mod.enabled) {
        try { mod.onEnable(this.app); } catch(e) {
          console.error(`[WebviewSuite] Failed to enable ${mod.id}:`, e);
        }
      }
    }

    // ── 5. WEBVIEW MANAGER ───────────────────────────────────────────────────
    this.manager = new WebviewManager(this.app);

    for (const mod of Object.values(this.modules)) {
      this.manager.registerModule(mod);
    }

    this.manager.start();

    // ── 6. SETTINGS TAB ──────────────────────────────────────────────────────
    this.addSettingTab(new WebviewSuiteSettingsTab(this.app, this));

    // ── 7. COMMAND PALETTE TOGGLE COMMANDS ───────────────────────────────────
    this._registerToggleCommands();

    console.log('[WebviewSuite] Loaded');
  }

  onunload() {
    for (const mod of Object.values(this.modules)) {
      if (mod.enabled) {
        try { mod.onDisable(); } catch(e) {}
      }
    }

    this.manager.stop();

    console.log('[WebviewSuite] Unloaded');
  }

  // Opens the URL in our clean, built-in Isolated Web Viewer view type.
  // Reuses an existing Isolated Browser tab if one is already open, so a
  // multi-hop Cloudflare redirect chain doesn't spawn a new tab per hop.
  async openIsolatedUrl(url) {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_ISOLATED_WEBVIEW)[0];
    const leaf = existing ?? workspace.getLeaf('tab');

    await leaf.setViewState({
      type: VIEW_TYPE_ISOLATED_WEBVIEW,
      active: true,
    });

    const view = leaf.view;
    if (view && typeof view.navigateTo === 'function') {
      view.navigateTo(url);
    }

    workspace.revealLeaf(leaf);
  }

  _registerToggleCommands() {
    const togglePairs = [
      { id: 'toggle-adblocker',        name: 'Toggle Ad Blocker',        moduleKey: 'adBlocker'        },
      { id: 'toggle-darkmode',         name: 'Toggle Dark Mode',         moduleKey: 'darkMode'         },
      { id: 'toggle-video-enhancer',   name: 'Toggle Video Enhancer',    moduleKey: 'videoEnhancer'    },
      { id: 'toggle-commands',         name: 'Toggle Webview Commands',  moduleKey: 'commands'         },
      { id: 'toggle-incognito',        name: 'Toggle Incognito Mode',    moduleKey: 'incognito'        },
      { id: 'toggle-cloudflare-bypass', name: 'Toggle Cloudflare Bypass', moduleKey: 'cloudflareBypass' },
    ];

    for (const { id, name, moduleKey } of togglePairs) {
      this.addCommand({
        id,
        name,
        callback: async () => {
          const mod = this.modules[moduleKey];
          mod.enabled = !mod.enabled;
          if (mod.enabled) mod.onEnable(this.app);
          else mod.onDisable();
          await this.state.setModuleEnabled(moduleKey, mod.enabled);
          new Notice(`${mod.name}: ${mod.enabled ? 'ON' : 'OFF'}`);
        }
      });
    }
  }
}