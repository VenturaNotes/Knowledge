/**
 * settings/SettingsTab.js
 *
 * Unified settings tab for all Webview Suite modules.
 * Toggles for each module + full domain/chord editor integrated into Commands.
 */

import { PluginSettingTab, Setting, Notice } from 'obsidian';

export class WebviewSuiteSettingsTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Webview Suite' });

    // ── MODULE TOGGLES ──────────────────────────────────────────────────────
    containerEl.createEl('h3', { text: 'Modules' });

    const modules = [
      this.plugin.modules.adBlocker,
      this.plugin.modules.darkMode,
      this.plugin.modules.videoEnhancer,
      this.plugin.modules.incognito,
      this.plugin.modules.commands,
    ];

    for (const mod of modules) {
      new Setting(containerEl)
        .setName(mod.name)
        .setDesc(mod.description)
        .addToggle(toggle => toggle
          .setValue(mod.enabled)
          .onChange(async (value) => {
            mod.enabled = value;
            if (value) mod.onEnable(this.app);
            else mod.onDisable();
            await this.plugin.state.setModuleEnabled(mod.id, value);
            this.display(); // Re-render to visually update nested items
          })
        );

      // Render Bypass List nested directly below the Dark Mode Toggle
      if (mod.id === 'darkMode') {
        const dmState = this.plugin.state.get('darkMode');
        const bypassDomains = dmState?.bypassDomains || [];

        const nestedContainer = containerEl.createDiv({ cls: 'webview-suite-nested-darkmode' });
        nestedContainer.style.cssText = `
          margin-left: 24px;
          margin-bottom: 18px;
          padding-left: 14px;
          border-left: 2px solid var(--background-modifier-border);
        `;

        // Style container with lower opacity if module is disabled (remains editable)
        if (!mod.enabled) {
          nestedContainer.style.opacity = '0.7';
        }

        nestedContainer.createEl('div', { 
          text: 'Bypass Domains', 
          style: 'font-weight: var(--font-semibold); margin-bottom: 6px; font-size: 14px;' 
        });
        nestedContainer.createEl('p', {
          text: "Websites where Dark Reader should be disabled (e.g. aistudio.google.com to allow native dark mode, docs.google.com to prevent canvas inversion).",
          cls: 'setting-item-description',
          style: 'margin-bottom: 10px;'
        });

        // Compact, scrollable list container for bypass domains
        const listContainer = nestedContainer.createDiv({ cls: 'webview-suite-bypass-list' });
        listContainer.style.cssText = `
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 12px;
          border: 1px solid var(--background-modifier-border);
          border-radius: 4px;
          padding: 6px;
          background: var(--background-secondary-alt);
        `;

        if (bypassDomains.length === 0) {
          const emptyMsg = listContainer.createDiv({ text: 'No bypassed domains added.' });
          emptyMsg.style.cssText = 'color: var(--text-muted); font-size: 12px; padding: 8px; text-align: center;';
        } else {
          bypassDomains.forEach((domain, idx) => {
            const row = listContainer.createDiv();
            row.style.cssText = `
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 4px 8px;
              margin-bottom: 4px;
              border: 1px solid var(--background-modifier-border);
              border-radius: 3px;
              background: var(--background-primary);
            `;
            
            if (idx === bypassDomains.length - 1) {
              row.style.marginBottom = '0'; // Remove extra spacing from bottom item
            }
            
            row.createEl('span', { 
              text: domain, 
              style: 'font-family: var(--font-monospace); font-size: 13px;' 
            });
            
            const deleteBtn = row.createEl('button', { text: 'Remove' });
            deleteBtn.style.cssText = 'cursor: pointer; padding: 2px 6px; font-size: 11px;';
            deleteBtn.addEventListener('click', async () => {
              bypassDomains.splice(idx, 1);
              await this.plugin.state.save();
              this.plugin.modules.darkMode.setBypassDomains(bypassDomains);
              this.display();
            });
          });
        }

        // Form settings row to add new domain to list
        new Setting(nestedContainer)
          .setName('Add bypass domain')
          .setDesc('Type domain name and click Add or press Enter')
          .addText(text => {
            text.setPlaceholder('aistudio.google.com');
            text.inputEl.style.width = '200px';
            
            let tempDomain = '';
            text.onChange(val => {
              tempDomain = val.trim();
            });

            text.inputEl.addEventListener('keydown', async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (tempDomain && !bypassDomains.includes(tempDomain)) {
                  bypassDomains.push(tempDomain);
                  await this.plugin.state.save();
                  this.plugin.modules.darkMode.setBypassDomains(bypassDomains);
                  this.display();
                }
              }
            });
          })
          .addButton(btn => btn
            .setButtonText('Add')
            .setCta()
            .onClick(async () => {
              const inputEl = nestedContainer.querySelector('input[type="text"]');
              const val = inputEl?.value?.trim();
              if (val && !bypassDomains.includes(val)) {
                bypassDomains.push(val);
                await this.plugin.state.save();
                this.plugin.modules.darkMode.setBypassDomains(bypassDomains);
                this.display();
              }
            })
          );
      }
    }

    const commandsModule = this.plugin.modules.commands;

    // ── COMMANDS BYPASS RULES ────────────────────────────────────────────────
    containerEl.createEl('h3', { text: 'Webview Commands — Domain Settings' });
    containerEl.createEl('p', {
      text: 'Configure custom keyboard behaviors per domain. For each website, you can block shortcuts inside the webview (sending them to Obsidian instead) or bypass Obsidian (allowing the webpage to handle them natively).',
      cls: 'setting-item-description',
    });

    const rules = commandsModule.rules;

    // Render unified domain rules
    for (let i = 0; i < rules.length; i++) {
      this._renderRule(containerEl, rules, i, commandsModule);
    }

    // Add new rule button
    new Setting(containerEl)
      .addButton(btn => btn
        .setButtonText('+ Add domain rule')
        .setCta()
        .onClick(async () => {
          rules.push({ domain: '', enabled: true, chords: [], obsidianChords: [] });
          await this._saveRules(commandsModule);
          this.display(); // Re-render
        })
      );
  }

  _renderRule(containerEl, rules, index, commandsModule) {
    const rule = rules[index];
    const ruleEl = containerEl.createDiv({ cls: 'webview-suite-rule' });

    // Style the rule container card
    ruleEl.style.cssText = `
      border: 1px solid var(--background-modifier-border);
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 16px;
      background: var(--background-primary);
    `;

    // Row 1: Domain input + enabled toggle + delete button
    new Setting(ruleEl)
      .setName('Domain')
      .setDesc('e.g. docs.google.com')
      .addText(text => text
        .setPlaceholder('docs.google.com')
        .setValue(rule.domain)
        .onChange(async (value) => {
          rule.domain = value.trim();
          await this._saveRules(commandsModule);
        })
      )
      .addToggle(toggle => toggle
        .setValue(rule.enabled)
        .setTooltip('Enable/disable this rule')
        .onChange(async (value) => {
          rule.enabled = value;
          await this._saveRules(commandsModule);
          commandsModule.reinjectAll();
        })
      )
      .addButton(btn => btn
        .setIcon('trash')
        .setTooltip('Delete rule')
        .onClick(async () => {
          rules.splice(index, 1);
          await this._saveRules(commandsModule);
          this.display();
        })
      );

    // Inner container to hold sections neatly
    const sectionsWrapper = ruleEl.createDiv();
    sectionsWrapper.style.cssText = `
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--background-modifier-border);
    `;

    // Section 1: Bypass Web Shortcuts
    this._renderChordSection(
      sectionsWrapper, 
      rule, 
      'chords', 
      'Bypass Web Shortcuts', 
      'These shortcuts will be blocked inside the webview, forcing Obsidian to handle them instead of the webpage.',
      commandsModule
    );

    // Visual divider between sections
    const divider = sectionsWrapper.createEl('hr');
    divider.style.cssText = 'margin: 12px 0; border: none; border-top: 1px dashed var(--background-modifier-border);';

    // Section 2: Bypass Obsidian Shortcuts
    this._renderChordSection(
      sectionsWrapper, 
      rule, 
      'obsidianChords', 
      'Bypass Obsidian Shortcuts', 
      'These shortcuts will be blocked in Obsidian, letting the webpage handle them natively.',
      commandsModule
    );
  }

  _renderChordSection(container, rule, chordKey, title, desc, commandsModule) {
    const chords = rule[chordKey] || [];

    const sectionHeader = container.createDiv();
    sectionHeader.createEl('div', { 
      text: title, 
      style: 'font-weight: var(--font-semibold); margin-bottom: 2px; font-size: 13px;' 
    });
    sectionHeader.createEl('p', {
      text: desc,
      cls: 'setting-item-description',
      style: 'margin-bottom: 8px;'
    });

    const chordsEl = container.createDiv({ cls: 'webview-suite-chords' });
    chordsEl.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; margin-bottom: 8px; min-height: 24px;';

    if (chords.length === 0) {
      const noChords = chordsEl.createEl('span', { text: 'No shortcuts defined.' });
      noChords.style.cssText = 'color: var(--text-muted); font-size: 11px; font-style: italic; align-self: center;';
    } else {
      for (let ci = 0; ci < chords.length; ci++) {
        const tag = chordsEl.createEl('span');
        tag.style.cssText = `
          display:inline-flex; align-items:center; gap:4px;
          background: var(--background-modifier-hover);
          border: 1px solid var(--background-modifier-border);
          border-radius: 4px; padding: 2px 8px;
          font-family: var(--font-monospace); font-size: 11px;
        `;
        tag.createSpan({ text: chords[ci] });

        const removeBtn = tag.createEl('button', { text: '×' });
        removeBtn.style.cssText = 'background:none; border:none; cursor:pointer; padding:0 2px; color:var(--text-muted);';
        removeBtn.addEventListener('click', async () => {
          chords.splice(ci, 1);
          await this._saveRules(commandsModule);
          commandsModule.reinjectAll();
          this.display();
        });
      }
    }

    const captureRow = new Setting(container)
      .setName('Add shortcut')
      .setDesc('Click here, then press the key combination');
    
    captureRow.settingEl.style.cssText = 'border-top: none; padding: 4px 0;';

    captureRow.addText(text => {
      text.setPlaceholder('Click here then press shortcut...');
      text.inputEl.style.fontFamily = 'var(--font-monospace)';
      text.inputEl.style.fontSize = '12px';
      text.inputEl.readOnly = true;

      text.inputEl.addEventListener('focus', () => {
        text.setValue('');
        text.setPlaceholder('Press shortcut now...');
      });

      text.inputEl.addEventListener('keydown', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (['Meta','Control','Shift','Alt'].includes(e.key)) return;

        const chord = this._buildChordFromEvent(e);
        if (!chord) return;

        text.setValue(chord);

        setTimeout(async () => {
          if (!chords.includes(chord)) {
            chords.push(chord);
            rule[chordKey] = chords;
            await this._saveRules(commandsModule);
            commandsModule.reinjectAll();
            new Notice(`Added shortcut: ${chord} → ${title}`);
          }
          text.setValue('');
          text.setPlaceholder('Click here then press shortcut...');
          text.inputEl.blur();
          this.display();
        }, 400);
      });
    });
  }

  _buildChordFromEvent(e) {
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

  async _saveRules(commandsModule) {
    const state = this.plugin.state.get('shortcutBlocker');
    state.rules = commandsModule.rules;
    await this.plugin.state.save();
  }
}