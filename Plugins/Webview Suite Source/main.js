/**
 * main.js
 * Webview Suite — Obsidian Plugin Entry Point
 *
 * Wires together all modules via WebviewManager and StateManager.
 */

import { Plugin, Notice } from 'obsidian';

import { WebviewManager }        from './core/WebviewManager.js';
import { StateManager }          from './core/StateManager.js';
import { AdBlockerModule }       from './modules/AdBlocker.js';
import { DarkModeModule }        from './modules/DarkMode.js';
import { VideoEnhancerModule }   from './modules/VideoEnhancer.js';
import { CommandsModule }        from './modules/Commands.js';
import { IncognitoModule }       from './modules/Incognito.js';
import { WebviewSuiteSettingsTab } from './settings/SettingsTab.js';

export default class WebviewSuitePlugin extends Plugin {

  async onload() {
    // ── 1. STATE ─────────────────────────────────────────────────────────────
    this.state = new StateManager(this);
    await this.state.load();

    // ── 2. MODULES ───────────────────────────────────────────────────────────
    this.modules = {
      adBlocker:      new AdBlockerModule(),
      darkMode:       new DarkModeModule(),
      videoEnhancer:  new VideoEnhancerModule(),
      commands:       new CommandsModule(),
      incognito:      new IncognitoModule(),
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

    // ── 3. WEBVIEW MANAGER ───────────────────────────────────────────────────
    this.manager = new WebviewManager(this.app);

    for (const mod of Object.values(this.modules)) {
      this.manager.registerModule(mod);
    }

    this.manager.start();

    // ── 4. ENABLE ACTIVE MODULES ─────────────────────────────────────────────
    for (const mod of Object.values(this.modules)) {
      if (mod.enabled) {
        try { mod.onEnable(this.app); } catch(e) {
          console.error(`[WebviewSuite] Failed to enable ${mod.id}:`, e);
        }
      }
    }

    // ── 5. SETTINGS TAB ──────────────────────────────────────────────────────
    this.addSettingTab(new WebviewSuiteSettingsTab(this.app, this));

    // ── 6. COMMAND PALETTE COMMANDS ──────────────────────────────────────────
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

  _registerToggleCommands() {
    const togglePairs = [
      { id: 'toggle-adblocker',       name: 'Toggle Ad Blocker',      moduleKey: 'adBlocker'      },
      { id: 'toggle-darkmode',        name: 'Toggle Dark Mode',        moduleKey: 'darkMode'       },
      { id: 'toggle-video-enhancer',  name: 'Toggle Video Enhancer',   moduleKey: 'videoEnhancer'  },
      { id: 'toggle-commands',        name: 'Toggle Webview Commands', moduleKey: 'commands'       },
      { id: 'toggle-incognito',       name: 'Toggle Incognito Mode',   moduleKey: 'incognito'      },
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