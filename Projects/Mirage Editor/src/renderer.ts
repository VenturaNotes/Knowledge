import path from 'path';
import fs from 'fs';
import { ipcRenderer } from 'electron';
import { Vault } from './core/vault/vault';
import { MetadataCache } from './core/cache/metadataCache';
import { Workspace } from './ui/workspace/workspace';
import { EventBus } from './core/events/eventBus';
import { CommandRegistry } from './core/commands/commands';
import { MarkdownEditor } from './editor/editor';
import { QuickSwitcherModal } from './ui/modals/quickSwitcher';
import { SettingsModal } from './ui/modals/settingsModal';
import { FileTreeComponent } from './ui/sidebar/fileTree';
import { ScriptManager } from './core/scripts/scriptManager';
import { loadPlugins } from './core/plugins/pluginLoader';
import { loadConfig, saveConfig, pickVaultFolder } from './core/config';
import { AppContext } from './types';

const vault = new Vault(null);
const cache = new MetadataCache(vault);
const events = new EventBus();
const commands = new CommandRegistry();
let workspace: Workspace;
let fileTree: FileTreeComponent;
let scriptManager: ScriptManager;
let app: AppContext;
let fileSwitcher: QuickSwitcherModal;
let commandPalette: QuickSwitcherModal;
let settingsModal: SettingsModal;

let unwatchVault: (() => void) | null = null;

function toggleSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
}

function updateVaultHeaderUI(): void {
  const sidebarHeader = document.getElementById('sidebar-header');
  if (vault.isOpen()) {
    if (sidebarHeader) sidebarHeader.classList.add('hidden');
  } else {
    if (sidebarHeader) sidebarHeader.classList.remove('hidden');
  }
}

function createEditor(containerEl: HTMLElement, filePath: string, tabId: string): MarkdownEditor {
  return new MarkdownEditor(containerEl, {
    initialContent: vault.readFile(filePath),
    vaultPath: vault.path,
    onChange: (newContent) => {
      workspace.syncTabsForFile(filePath, newContent, tabId);
    },
    onSave: (newContent) => {
      vault.writeFile(filePath, newContent);
      cache.updateFile(filePath, newContent);
      events.emit('file-modified', filePath);
    },
  });
}

function openFile(relPath: string): void {
  const leaf = workspace.getOrCreateActiveLeaf();
  leaf.openFileTab(relPath, createEditor);
}

function saveWorkspaceLayout(): void {
  if (!vault.isOpen()) return;
  const layout = workspace.serializeState();
  const currentConfig = loadConfig();
  saveConfig({
    ...currentConfig,
    workspaceState: layout,
  });
}

function openVaultFolder(newPath: string): void {
  if (unwatchVault) {
    unwatchVault();
    unwatchVault = null;
  }

  vault.open(newPath);
  saveConfig({ ...loadConfig(), vaultPath: newPath });

  updateVaultHeaderUI();
  fileTree.render();

  cache.buildIndexAsync();

  // 🟢 Restore previous open tabs or open empty leaf
  const config = loadConfig();
  if (config.workspaceState && config.workspaceState.leaves.length > 0) {
    workspace.restoreState(config.workspaceState, createEditor);
  }

  // Load user scripts
  scriptManager.init();

  unwatchVault = vault.onChange(({ eventType, path: changedPath }) => {
    if (eventType === 'add' || eventType === 'unlink') {
      fileTree.render();
    }

    if (changedPath.endsWith('.js')) {
      scriptManager.reloadScripts();
    }

    if (eventType === 'unlink') {
      cache.deleteFile(changedPath);
    } else if (changedPath.endsWith('.md')) {
      cache.updateFile(changedPath, vault.readFile(changedPath));
    }
    events.emit('cache-updated', changedPath);
  });

  events.emit('vault-opened', newPath);
}

async function pickAndOpenVault(): Promise<void> {
  const chosen = await pickVaultFolder();
  if (chosen) {
    openVaultFolder(chosen);
  }
}

function dispatchChord(chord: string): boolean {
  const isMeta = chord.includes('meta') || chord.includes('ctrl');
  const key = chord.split('+').pop() || '';

  if (isMeta && key === 'w' && !chord.includes('alt') && !chord.includes('shift')) {
    const activeLeaf = workspace.activeLeaf;
    if (activeLeaf && activeLeaf.activeTab) {
      activeLeaf.closeTab(activeLeaf.activeTab);
      return true;
    }
  }

  const cmd = commands.getCommandByChord(chord);
  if (cmd) {
    cmd.callback();
    return true;
  }
  return false;
}

// 🟢 Save tabs and flush editor saves on quit
window.addEventListener('beforeunload', () => {
  workspace?.flushAllLeaves();
  saveWorkspaceLayout();
});

function init(): void {
  const workspaceRoot = document.getElementById('workspace-root');
  const fileTreeContainer = document.getElementById('file-tree');

  if (!workspaceRoot || !fileTreeContainer) {
    console.error('[Renderer] DOM elements missing.');
    return;
  }

  workspace = new Workspace(workspaceRoot);
  workspace.fileOpener = openFile;
  workspace.onToggleSidebar = toggleSidebar;
  workspace.onLayoutChange = saveWorkspaceLayout;

  fileTree = new FileTreeComponent(fileTreeContainer, vault, openFile);
  app = { vault, cache, workspace, events, commands };
  (window as any).app = app;

  scriptManager = new ScriptManager(app);

  const openVaultBtn = document.getElementById('open-vault-btn');
  if (openVaultBtn) {
    openVaultBtn.onclick = pickAndOpenVault;
  }

  fileSwitcher = new QuickSwitcherModal({
    app,
    mode: 'files',
    placeholder: 'Open file by name...',
    onSelect: (item) => openFile(item.id),
  });

  commandPalette = new QuickSwitcherModal({
    app,
    mode: 'commands',
    placeholder: 'Type a command...',
    onSelect: (item) => commands.execute(item.id),
  });

  commands.register({
    id: 'open-settings',
    name: 'Open Settings',
    defaultHotkey: 'Cmd+,',
    callback: () => settingsModal.open(),
  });

  commands.register({
    id: 'toggle-sidebar',
    name: 'Toggle Sidebar',
    defaultHotkey: 'Cmd+\\',
    callback: toggleSidebar,
  });

  commands.register({
    id: 'toggle-devtools',
    name: 'Toggle Developer Tools',
    defaultHotkey: 'Cmd+Opt+I',
    callback: () => ipcRenderer.invoke('app:toggleDevTools'),
  });

  commands.register({
    id: 'reopen-closed-tab',
    name: 'Reopen Closed Tab',
    defaultHotkey: 'Cmd+Shift+T',
    callback: () => workspace.reopenLastClosedTab(),
  });

  commands.register({
    id: 'previous-tab',
    name: 'Navigate to Previous Tab',
    defaultHotkey: 'Cmd+Opt+Left',
    callback: () => workspace.activeLeaf?.previousTab(),
  });

  commands.register({
    id: 'next-tab',
    name: 'Navigate to Next Tab',
    defaultHotkey: 'Cmd+Opt+Right',
    callback: () => workspace.activeLeaf?.nextTab(),
  });

  commands.register({
    id: 'open-web-browser',
    name: 'Open In-App Web Browser Tab',
    callback: () => {
      const leaf = workspace.getOrCreateActiveLeaf();
      leaf.openWebviewTab('https://www.google.com');
    },
  });

  commands.register({
    id: 'open-vault',
    name: 'Open Vault Folder',
    callback: pickAndOpenVault,
  });

  commands.register({
    id: 'quick-switcher',
    name: 'Quick Switcher: Find File',
    defaultHotkey: 'Cmd+O',
    callback: () => fileSwitcher.open(),
  });

  commands.register({
    id: 'command-palette',
    name: 'Command Palette: Run Command',
    defaultHotkey: 'Cmd+P',
    callback: () => commandPalette.open(),
  });

  const config = loadConfig();
  if (config.customHotkeys) {
    Object.entries(config.customHotkeys).forEach(([id, chord]) => {
      commands.setHotkey(id, chord);
    });
  }

  ipcRenderer.invoke('shortcuts:setAppChords', commands.getAllActiveChords());
  if (config.domainRules) {
    ipcRenderer.invoke('shortcuts:setRules', config.domainRules);
  }

  settingsModal = new SettingsModal(app);
  settingsModal.onReloadScripts = async () => {
    await scriptManager.reloadScripts();
  };

  window.addEventListener('keydown', (e: KeyboardEvent) => {
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

    const chord = parts.sort().join('+') + '+' + key;
    if (dispatchChord(chord)) {
      e.preventDefault();
    }
  });

  ipcRenderer.on('app:webview-focused', (_event, wcId: number) => {
    workspace.setActiveLeafByWebContentsId(wcId);
  });

  ipcRenderer.on('app:forward-shortcut', (_event, data: { sourceWebContentsId?: number; chord: string }) => {
    if (data.sourceWebContentsId) {
      workspace.setActiveLeafByWebContentsId(data.sourceWebContentsId);
    }
    dispatchChord(data.chord);
  });

  if (config.vaultPath && fs.existsSync(config.vaultPath)) {
    openVaultFolder(config.vaultPath);
  } else {
    updateVaultHeaderUI();
    fileTree.render();
  }

  const pluginsDir = path.join(__dirname, '..', 'plugins');
  const loaded = loadPlugins(pluginsDir, app);
  events.emit('app-ready', { pluginsLoaded: loaded.length });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}