import { ipcRenderer } from 'electron';
import { AppConfig, DomainShortcutRule, ScriptFolderConfig, loadConfig, saveConfig } from '../../core/config';
import { AppContext } from '../../types';

export class SettingsModal {
  private app: AppContext;
  private overlay!: HTMLElement;
  private domainRules: DomainShortcutRule[] = [];
  private scriptFolders: ScriptFolderConfig[] = [];
  private startupScripts: string[] = [];
  private secrets: Record<string, string> = {};
  private activeSection: 'scripts' | 'hotkeys' | 'shortcuts' | 'general' = 'scripts';
  private recordingCommandId: string | null = null;
  private conflictWarning: string | null = null;
  public onReloadScripts?: () => Promise<void>;

  constructor(app: AppContext) {
    this.app = app;
    this._createDOM();
  }

  private _createDOM(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay hidden';
    this.overlay.innerHTML = `
      <div class="modal-box settings-modal-box">
        <div class="settings-sidebar">
          <div class="settings-nav-title">Settings</div>
          <div class="settings-nav-item" data-section="scripts">User Scripts</div>
          <div class="settings-nav-item" data-section="hotkeys">Hotkeys</div>
          <div class="settings-nav-item" data-section="shortcuts">Webview Shortcuts</div>
          <div class="settings-nav-item" data-section="general">General</div>
        </div>
        <div class="settings-content-area">
          <div class="settings-header">
            <h2 id="settings-section-title">User Scripts</h2>
            <button class="modal-close-btn" title="Close">✕</button>
          </div>
          <div id="settings-body" class="settings-body"></div>
        </div>
      </div>
    `;

    const closeBtn = this.overlay.querySelector('.modal-close-btn') as HTMLElement;
    closeBtn.onclick = () => this.close();

    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) this.close();
    };

    const navItems = this.overlay.querySelectorAll('.settings-nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        navItems.forEach((n) => n.classList.remove('active'));
        item.classList.add('active');
        this.activeSection = item.getAttribute('data-section') as any;
        this.recordingCommandId = null;
        this.conflictWarning = null;
        this._renderSection();
      });
    });

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.recordingCommandId || this.overlay.classList.contains('hidden')) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        this.recordingCommandId = null;
        this.conflictWarning = null;
        this._renderHotkeysList();
        return;
      }

      const parts: string[] = [];
      if (e.metaKey) parts.push('meta');
      if (e.ctrlKey) parts.push('ctrl');
      if (e.altKey) parts.push('alt');
      if (e.shiftKey) parts.push('shift');

      if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) return;

      let key = e.key.toLowerCase();
      if (key === 'space' || key === ' ') key = 'space';
      if (e.key === 'ArrowLeft') key = 'arrowleft';
      if (e.key === 'ArrowRight') key = 'arrowright';
      if (e.key === 'ArrowUp') key = 'arrowup';
      if (e.key === 'ArrowDown') key = 'arrowdown';

      const chord = parts.sort().join('+') + '+' + key;
      const cmdId = this.recordingCommandId;

      const conflict = this.app.commands.checkConflict(chord, cmdId);
      if (conflict) {
        this.conflictWarning = `Shortcut is already assigned to "${conflict.name}". Shortcuts cannot overlap.`;
        this._renderHotkeysList();
        return;
      }

      this.app.commands.setHotkey(cmdId, chord);
      this.recordingCommandId = null;
      this.conflictWarning = null;
      this._saveHotkeys();
      this._renderHotkeysList();
    });

    document.body.appendChild(this.overlay);
  }

  public open(): void {
    const config = loadConfig();
    this.domainRules = config.domainRules || [];
    this.scriptFolders = config.scriptsFolders || [];
    this.startupScripts = config.startupScripts || [];
    this.secrets = config.secrets || {};

    this.overlay.classList.remove('hidden');
    const navItems = this.overlay.querySelectorAll('.settings-nav-item');
    navItems.forEach((n) => {
      n.classList.toggle('active', n.getAttribute('data-section') === this.activeSection);
    });
    this._renderSection();
  }

  public close(): void {
    this.recordingCommandId = null;
    this.conflictWarning = null;
    this.overlay.classList.add('hidden');
  }

  private _renderSection(): void {
    const body = this.overlay.querySelector('#settings-body') as HTMLElement;
    const title = this.overlay.querySelector('#settings-section-title') as HTMLElement;

    if (this.activeSection === 'general') {
      title.textContent = 'General Settings';
      const config = loadConfig();
      body.innerHTML = `
        <div class="settings-card">
          <div class="settings-label">Vault Folder Location</div>
          <div class="settings-desc font-mono">${config.vaultPath || 'No vault currently open'}</div>
        </div>
      `;
      return;
    }

    if (this.activeSection === 'scripts') {
      title.textContent = 'User Scripts Configuration';
      body.innerHTML = `
        <!-- Script Folders -->
        <div class="settings-section-block">
          <div class="settings-section-heading">Custom Script Folders</div>
          <div class="settings-intro">
            Vault-relative folders to scan for <code>.js</code> automation scripts (e.g. <code>Scripts</code> or <code>Scripts/Utils</code>). Scripts found in these folders automatically register into the Command Palette and Hotkeys.
          </div>
          <div class="add-row">
            <input type="text" id="new-folder-input" class="settings-input" placeholder="e.g. Scripts/Utils" />
            <button id="add-folder-btn" class="settings-btn primary">+ Add Folder</button>
          </div>
          <div id="folders-list" class="items-list"></div>
        </div>

        <!-- Startup Scripts -->
        <div class="settings-section-block">
          <div class="settings-section-heading">Startup Scripts</div>
          <div class="settings-intro">
            Scripts that execute automatically in the background whenever Mirage Editor loads your vault.
          </div>
          <div class="add-row">
            <input type="text" id="new-startup-input" class="settings-input" placeholder="Script name (e.g. SmartWebSearch)" />
            <button id="add-startup-btn" class="settings-btn primary">+ Add Startup Script</button>
          </div>
          <div id="startup-list" class="items-list"></div>
        </div>

        <!-- Secrets -->
        <div class="settings-section-block">
          <div class="settings-section-heading">Secrets & API Keys</div>
          <div class="settings-intro">
            Securely injected into scripts via the <code>secrets</code> object (e.g. <code>secrets.GOOGLE_AI_KEY</code>). Stored locally in your config file, never inside notes.
          </div>
          <div class="add-row">
            <input type="text" id="secret-key-input" class="settings-input" placeholder="KEY_NAME (e.g. GEMINI_API_KEY)" />
            <input type="password" id="secret-val-input" class="settings-input" placeholder="Value" />
            <button id="add-secret-btn" class="settings-btn primary">+ Add Secret</button>
          </div>
          <div id="secrets-list" class="items-list"></div>
        </div>
      `;

      const folderInput = body.querySelector('#new-folder-input') as HTMLInputElement;
      const addFolderBtn = body.querySelector('#add-folder-btn') as HTMLButtonElement;
      addFolderBtn.onclick = () => {
        const val = folderInput.value.trim().replace(/^\/+|\/+$/g, '');
        if (!val || this.scriptFolders.some((f) => f.path === val)) return;
        this.scriptFolders.push({ path: val });
        folderInput.value = '';
        this._saveScriptsConfig();
        this._renderFoldersList();
      };

      const startupInput = body.querySelector('#new-startup-input') as HTMLInputElement;
      const addStartupBtn = body.querySelector('#add-startup-btn') as HTMLButtonElement;
      addStartupBtn.onclick = () => {
        const val = startupInput.value.trim().replace(/\.js$/, '');
        if (!val || this.startupScripts.includes(val)) return;
        this.startupScripts.push(val);
        startupInput.value = '';
        this._saveScriptsConfig();
        this._renderStartupList();
      };

      const secKeyInput = body.querySelector('#secret-key-input') as HTMLInputElement;
      const secValInput = body.querySelector('#secret-val-input') as HTMLInputElement;
      const addSecretBtn = body.querySelector('#add-secret-btn') as HTMLButtonElement;
      addSecretBtn.onclick = () => {
        const k = secKeyInput.value.trim();
        const v = secValInput.value.trim();
        if (!k || !v) return;
        this.secrets[k] = v;
        secKeyInput.value = '';
        secValInput.value = '';
        this._saveScriptsConfig();
        this._renderSecretsList();
      };

      this._renderFoldersList();
      this._renderStartupList();
      this._renderSecretsList();
      return;
    }

    if (this.activeSection === 'hotkeys') {
      title.textContent = 'Hotkeys';
      body.innerHTML = `
        <div class="settings-intro">
          Customize keyboard shortcuts for your workspace. Each hotkey must be unique to prevent collisions.
        </div>
        <div class="search-box-wrapper">
          <input type="text" id="hotkeys-search-input" class="settings-search-input" placeholder="Search commands by name or ID..." />
        </div>
        <div id="conflict-banner" class="conflict-banner hidden"></div>
        <div id="hotkeys-list" class="hotkeys-list"></div>
      `;

      const searchInput = body.querySelector('#hotkeys-search-input') as HTMLInputElement;
      searchInput.oninput = () => this._renderHotkeysList(searchInput.value.trim().toLowerCase());

      this._renderHotkeysList();
      return;
    }

    title.textContent = 'Webview Domain Shortcuts';
    body.innerHTML = `
      <div class="settings-intro">
        Configure hotkeys to bypass for specific websites so the webpage can handle them natively (e.g. allowing <code>Cmd+P</code> to trigger Google Docs Print instead of the Command Palette).
      </div>
      <div class="settings-actions">
        <button id="add-rule-btn" class="settings-btn primary">+ Add Domain Rule</button>
      </div>
      <div id="rules-list" class="rules-list"></div>
    `;

    const addBtn = body.querySelector('#add-rule-btn') as HTMLButtonElement;
    addBtn.onclick = () => {
      this.domainRules.unshift({
        id: `rule-${Date.now()}`,
        domain: '',
        enabled: true,
        bypassChords: ['meta+p'],
      });
      this._saveDomainRules();
      this._renderRulesList();
    };

    this._renderRulesList();
  }

  private _renderFoldersList(): void {
    const list = this.overlay.querySelector('#folders-list') as HTMLElement;
    if (!list) return;

    if (this.scriptFolders.length === 0) {
      list.innerHTML = `<div class="settings-empty">No script folders configured. Add a folder above (e.g. "Scripts/Utils").</div>`;
      return;
    }

    list.innerHTML = '';
    this.scriptFolders.forEach((folder, idx) => {
      const row = document.createElement('div');
      row.className = 'list-item-row';
      row.innerHTML = `
        <span class="item-name font-mono">${folder.path}</span>
        <button class="item-del-btn" title="Remove Folder">✕</button>
      `;
      const delBtn = row.querySelector('.item-del-btn') as HTMLButtonElement;
      delBtn.onclick = () => {
        this.scriptFolders.splice(idx, 1);
        this._saveScriptsConfig();
        this._renderFoldersList();
      };
      list.appendChild(row);
    });
  }

  private _renderStartupList(): void {
    const list = this.overlay.querySelector('#startup-list') as HTMLElement;
    if (!list) return;

    if (this.startupScripts.length === 0) {
      list.innerHTML = `<div class="settings-empty">No startup scripts configured.</div>`;
      return;
    }

    list.innerHTML = '';
    this.startupScripts.forEach((scriptName, idx) => {
      const row = document.createElement('div');
      row.className = 'list-item-row';
      row.innerHTML = `
        <span class="item-name">${scriptName}</span>
        <button class="item-del-btn" title="Remove Startup Script">✕</button>
      `;
      const delBtn = row.querySelector('.item-del-btn') as HTMLButtonElement;
      delBtn.onclick = () => {
        this.startupScripts.splice(idx, 1);
        this._saveScriptsConfig();
        this._renderStartupList();
      };
      list.appendChild(row);
    });
  }

  private _renderSecretsList(): void {
    const list = this.overlay.querySelector('#secrets-list') as HTMLElement;
    if (!list) return;

    const keys = Object.keys(this.secrets);
    if (keys.length === 0) {
      list.innerHTML = `<div class="settings-empty">No secrets configured.</div>`;
      return;
    }

    list.innerHTML = '';
    keys.forEach((key) => {
      const row = document.createElement('div');
      row.className = 'list-item-row';
      row.innerHTML = `
        <span class="item-name font-mono"><strong>${key}</strong> <small class="text-muted">(••••••••)</small></span>
        <button class="item-del-btn" title="Delete Secret">✕</button>
      `;
      const delBtn = row.querySelector('.item-del-btn') as HTMLButtonElement;
      delBtn.onclick = () => {
        delete this.secrets[key];
        this._saveScriptsConfig();
        this._renderSecretsList();
      };
      list.appendChild(row);
    });
  }

  private _saveScriptsConfig(): void {
    const config: AppConfig = {
      ...loadConfig(),
      scriptsFolders: this.scriptFolders,
      startupScripts: this.startupScripts,
      secrets: this.secrets,
    };
    saveConfig(config);
    this.onReloadScripts?.();
  }

  private _renderHotkeysList(filter: string = ''): void {
    const list = this.overlay.querySelector('#hotkeys-list') as HTMLElement;
    const banner = this.overlay.querySelector('#conflict-banner') as HTMLElement;
    if (!list) return;

    if (banner) {
      if (this.conflictWarning) {
        banner.innerHTML = `<span class="warning-tag">Conflict:</span> ${this.conflictWarning}`;
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }

    const commandsList = this.app.commands.list();
    const filtered = filter
      ? commandsList.filter(
          (c) => c.name.toLowerCase().includes(filter) || c.id.toLowerCase().includes(filter)
        )
      : commandsList;

    list.innerHTML = '';
    if (filtered.length === 0) {
      list.innerHTML = `<div class="settings-empty">No commands match "${filter}"</div>`;
      return;
    }

    filtered.forEach((cmd) => {
      const row = document.createElement('div');
      row.className = 'hotkey-row';

      const isRecording = this.recordingCommandId === cmd.id;
      const keycapsHTML = isRecording
        ? `<span class="recording-badge">Press key combination...</span>`
        : cmd.hotkey
        ? this._renderKeycaps(cmd.hotkey)
        : `<span class="unassigned-badge">Unassigned</span>`;

      row.innerHTML = `
        <div class="hotkey-info">
          <div class="hotkey-name">${cmd.name}</div>
          <div class="hotkey-id">${cmd.id}</div>
        </div>
        <div class="hotkey-actions">
          <button class="hotkey-pill-btn ${isRecording ? 'recording' : ''}">
            ${keycapsHTML}
          </button>
          ${
            cmd.hotkey
              ? `<button class="hotkey-action-btn clear" title="Remove Shortcut">✕</button>`
              : ''
          }
          ${
            cmd.defaultHotkey && cmd.hotkey !== this.app.commands.normalizeChord(cmd.defaultHotkey)
              ? `<button class="hotkey-action-btn reset" title="Reset to Default">↺</button>`
              : ''
          }
        </div>
      `;

      const pillBtn = row.querySelector('.hotkey-pill-btn') as HTMLButtonElement;
      const clearBtn = row.querySelector('.hotkey-action-btn.clear') as HTMLButtonElement | null;
      const resetBtn = row.querySelector('.hotkey-action-btn.reset') as HTMLButtonElement | null;

      pillBtn.onclick = () => {
        this.recordingCommandId = cmd.id;
        this.conflictWarning = null;
        this._renderHotkeysList(filter);
      };

      if (clearBtn) {
        clearBtn.onclick = (e) => {
          e.stopPropagation();
          this.app.commands.setHotkey(cmd.id, null);
          this.conflictWarning = null;
          this._saveHotkeys();
          this._renderHotkeysList(filter);
        };
      }

      if (resetBtn) {
        resetBtn.onclick = (e) => {
          e.stopPropagation();
          const def = cmd.defaultHotkey;
          if (def) {
            const conflict = this.app.commands.checkConflict(def, cmd.id);
            if (conflict) {
              this.conflictWarning = `Default shortcut is already used by "${conflict.name}".`;
              this._renderHotkeysList(filter);
              return;
            }
            this.app.commands.setHotkey(cmd.id, def);
            this.conflictWarning = null;
            this._saveHotkeys();
            this._renderHotkeysList(filter);
          }
        };
      }

      list.appendChild(row);
    });
  }

  private _renderKeycaps(chord: string): string {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    return chord
      .split('+')
      .map((part) => {
        let label = part.toUpperCase();
        if (part === 'meta') label = isMac ? '⌘' : 'Win';
        if (part === 'ctrl') label = isMac ? '⌃' : 'Ctrl';
        if (part === 'alt') label = isMac ? '⌥' : 'Alt';
        if (part === 'shift') label = isMac ? '⇧' : 'Shift';
        if (part === 'arrowleft') label = '←';
        if (part === 'arrowright') label = '→';
        if (part === 'arrowup') label = '↑';
        if (part === 'arrowdown') label = '↓';
        if (part === 'space') label = 'Space';
        return `<kbd class="dark-keycap">${label}</kbd>`;
      })
      .join('<span class="keycap-plus">+</span>');
  }

  private _saveHotkeys(): void {
    const customHotkeys: Record<string, string | null> = {};
    this.app.commands.list().forEach((c) => {
      customHotkeys[c.id] = c.hotkey || null;
    });

    const config: AppConfig = {
      ...loadConfig(),
      customHotkeys,
    };
    saveConfig(config);

    const activeChords = this.app.commands.getAllActiveChords();
    ipcRenderer.invoke('shortcuts:setAppChords', activeChords);
  }

  private _renderRulesList(): void {
    const list = this.overlay.querySelector('#rules-list') as HTMLElement;
    if (!list) return;

    if (this.domainRules.length === 0) {
      list.innerHTML = `<div class="settings-empty">No domain rules configured yet. Click "+ Add Domain Rule" above.</div>`;
      return;
    }

    list.innerHTML = '';
    this.domainRules.forEach((rule, idx) => {
      const card = document.createElement('div');
      card.className = 'rule-card';
      card.innerHTML = `
        <div class="rule-card-header">
          <input type="text" class="rule-domain-input" placeholder="e.g. docs.google.com" value="${rule.domain}" />
          <div class="rule-controls">
            <label class="toggle-label">
              <input type="checkbox" class="rule-enable-toggle" ${rule.enabled ? 'checked' : ''} />
              Enabled
            </label>
            <button class="rule-delete-btn" title="Delete Rule">✕</button>
          </div>
        </div>
        <div class="rule-card-body">
          <label class="rule-label">Bypassed Shortcuts (comma-separated):</label>
          <input type="text" class="rule-chords-input" placeholder="e.g. meta+p, meta+f, ctrl+k" value="${rule.bypassChords.join(', ')}" />
          <small class="rule-hint">Example: <code>meta+p, meta+f</code></small>
        </div>
      `;

      const domainInput = card.querySelector('.rule-domain-input') as HTMLInputElement;
      const toggle = card.querySelector('.rule-enable-toggle') as HTMLInputElement;
      const chordsInput = card.querySelector('.rule-chords-input') as HTMLInputElement;
      const deleteBtn = card.querySelector('.rule-delete-btn') as HTMLButtonElement;

      domainInput.onchange = () => {
        rule.domain = domainInput.value.trim().toLowerCase();
        this._saveDomainRules();
      };

      toggle.onchange = () => {
        rule.enabled = toggle.checked;
        this._saveDomainRules();
      };

      chordsInput.onchange = () => {
        rule.bypassChords = chordsInput.value
          .split(',')
          .map((c) => this.app.commands.normalizeChord(c))
          .filter(Boolean);
        this._saveDomainRules();
      };

      deleteBtn.onclick = () => {
        this.domainRules.splice(idx, 1);
        this._saveDomainRules();
        this._renderRulesList();
      };

      list.appendChild(card);
    });
  }

  private _saveDomainRules(): void {
    const config: AppConfig = {
      ...loadConfig(),
      domainRules: this.domainRules,
    };
    saveConfig(config);
    ipcRenderer.invoke('shortcuts:setRules', this.domainRules);
  }
}