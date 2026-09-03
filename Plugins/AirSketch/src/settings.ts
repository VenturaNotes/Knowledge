import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import * as os from 'os';
import * as crypto from 'crypto';
import type AirSketchPlugin from './main';

export class AirSketchSettingTab extends PluginSettingTab {
    plugin: AirSketchPlugin;

    constructor(app: App, plugin: AirSketchPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '✈️ AirSketch Settings' });

        const tokenQuery = this.plugin.settings.isPrivate ? `?token=${this.plugin.settings.authToken}` : '';
        const ipadUrl = `http://${os.hostname()}:${this.plugin.settings.port}${tokenQuery}`;
        const localUrl = `http://localhost:${this.plugin.settings.port}${tokenQuery}`;

        const statusBox = containerEl.createDiv({
            attr: { style: 'background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 8px; padding: 14px; margin-bottom: 20px;' }
        });
        statusBox.createEl('div', { 
            text: this.plugin.settings.isPrivate ? '🔒 Private Pairing Link (iPad / Local Network):' : '🌐 AirSketch URL (iPad / Local Network):', 
            attr: { style: 'font-weight: bold; font-size: 13px; margin-bottom: 6px;' } 
        });
        
        const urlRow = statusBox.createDiv({ attr: { style: 'display: flex; gap: 8px; align-items: center; margin-bottom: 10px;' } });
        urlRow.createEl('code', { text: ipadUrl, attr: { style: 'font-size: 12px; padding: 4px 8px; background: var(--background-primary); border-radius: 4px; overflow-x: auto; flex: 1;' } });
        
        const copyBtn = urlRow.createEl('button', { text: '📋 Copy iPad URL', attr: { style: 'cursor: pointer; flex-shrink: 0;' } });
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(ipadUrl);
            new Notice('✓ Copied iPad AirSketch URL to clipboard!');
        });

        // Desktop Localhost Access row
        const localRow = statusBox.createDiv({ attr: { style: 'display: flex; gap: 8px; align-items: center;' } });
        localRow.createEl('span', { text: 'Mac Browser:', attr: { style: 'font-size: 12px; color: var(--text-muted); width: 85px; flex-shrink: 0;' } });
        localRow.createEl('code', { text: localUrl, attr: { style: 'font-size: 12px; padding: 4px 8px; background: var(--background-primary); border-radius: 4px; overflow-x: auto; flex: 1;' } });
        const copyLocalBtn = localRow.createEl('button', { text: '📋 Copy Mac URL', attr: { style: 'cursor: pointer; flex-shrink: 0;' } });
        copyLocalBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(localUrl);
            new Notice('✓ Copied Mac Localhost URL to clipboard!');
        });

        new Setting(containerEl)
            .setName('Private Access Mode')
            .setDesc('When enabled, only devices paired with your secret token can connect. Unauthorized network requests are blocked.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.isPrivate)
                .onChange(async (value) => {
                    this.plugin.settings.isPrivate = value;
                    await this.plugin.saveSettings();
                    await this.plugin.server.start();
                    this.display();
                })
            );

        if (this.plugin.settings.isPrivate) {
            new Setting(containerEl)
                .setName('Regenerate Security Token')
                .setDesc('Invalidates the current key. You will need to open the new link once on your iPad.')
                .addButton(btn => btn
                    .setButtonText('Regenerate Key')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings.authToken = crypto.randomBytes(16).toString('hex');
                        await this.plugin.saveSettings();
                        await this.plugin.server.start();
                        new Notice('✓ Generated new security token. Open the updated URL once on your iPad.');
                        this.display();
                    })
                );
        }

        new Setting(containerEl)
            .setName('Drawings Vault Folder')
            .setDesc('Vault-relative path where drawing files will be stored')
            .addText(text => text
                .setPlaceholder('Private/Drawings')
                .setValue(this.plugin.settings.drawingsFolder)
                .onChange(async (val) => {
                    this.plugin.settings.drawingsFolder = val.trim() || 'Private/Drawings';
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Server Port')
            .setDesc('Local Wi-Fi port for iPad connections')
            .addText(text => text
                .setPlaceholder('4444')
                .setValue(String(this.plugin.settings.port))
                .onChange(async (val) => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num > 1024 && num < 65535) {
                        this.plugin.settings.port = num;
                        await this.plugin.saveSettings();
                        await this.plugin.server.start();
                    }
                })
            );
    }
}