/**
 * core/StateManager.js
 *
 * Thin wrapper around plugin.loadData() / plugin.saveData().
 * Provides typed defaults and a single source of truth for all
 * module toggle states and settings (e.g. ShortcutBlocker domain rules).
 */

const DEFAULTS = {
  // Module toggle states
  adBlocker:      { enabled: false },
  darkMode:       { 
    enabled: false,
    bypassDomains: [
      'docs.google.com',
      'sheets.google.com',
      'slides.google.com',
      'drive.google.com',
      'canva.com',
      'aistudio.google.com' // Pre-populated to allow Google AI Studio's native dark mode
    ]
  },
  videoEnhancer:  { enabled: false },
  incognito:      { enabled: false },
  commands:       { enabled: true  },

  // ShortcutBlocker: array of domain rule objects
  // { domain: string, enabled: bool, chords: string[] }
  shortcutBlocker: {
    enabled: true,
    rules: [],
  },
};

export class StateManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.data = null;
  }

  async load() {
    const saved = await this.plugin.loadData() || {};
    // Deep merge saved data over defaults so new keys always have fallbacks
    this.data = this._merge(DEFAULTS, saved);
  }

  async save() {
    await this.plugin.saveData(this.data);
  }

  get(moduleId) {
    return this.data[moduleId];
  }

  async set(moduleId, value) {
    this.data[moduleId] = value;
    await this.save();
  }

  async setModuleEnabled(moduleId, enabled) {
    if (!this.data[moduleId]) this.data[moduleId] = {};
    this.data[moduleId].enabled = enabled;
    await this.save();
  }

  // Shallow merge with deep handling for plain objects
  _merge(defaults, saved) {
    const result = { ...defaults };
    for (const key of Object.keys(saved)) {
      if (
        saved[key] !== null &&
        typeof saved[key] === 'object' &&
        !Array.isArray(saved[key]) &&
        typeof defaults[key] === 'object' &&
        !Array.isArray(defaults[key])
      ) {
        result[key] = { ...defaults[key], ...saved[key] };
      } else {
        result[key] = saved[key];
      }
    }
    return result;
  }
}