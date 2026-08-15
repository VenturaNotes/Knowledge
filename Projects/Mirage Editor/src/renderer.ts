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
import { FileTreeComponent } from './ui/sidebar/fileTree';
import { loadPlugins } from './core/plugins/pluginLoader';
import { loadConfig, saveConfig, pickVaultFolder } from './core/config';
import { AppContext } from './types';

const vault = new Vault(null);
const cache = new MetadataCache(vault);
const events = new EventBus();
const commands = new CommandRegistry();
let workspace: Workspace;
let fileTree: FileTreeComponent;
let app: AppContext;

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

function openFile(relPath: string): void {
  const leaf = workspace.getOrCreateActiveLeaf();
  leaf.openFileTab(relPath, (containerEl, filePath, tabId) => {
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
  });
}

function openVaultFolder(newPath: string): void {
  if (unwatchVault) {
    unwatchVault();
    unwatchVault = null;
  }

  vault.open(newPath);
  saveConfig({ vaultPath: newPath });

  updateVaultHeaderUI();
  fileTree.render();

  cache.buildIndexAsync();

  unwatchVault = vault.onChange(({ eventType, path: changedPath }) => {
    if (eventType === 'add' || eventType === 'unlink') {
      fileTree.render();
    }
    if (eventType === 'unlink') {
      cache.deleteFile(changedPath);
    } else {
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

window.addEventListener('beforeunload', () => {
  workspace?.flushAllLeaves();
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

  fileTree = new FileTreeComponent(fileTreeContainer, vault, openFile);
  app = { vault, cache, workspace, events, commands };
  (window as any).app = app;

  const openVaultBtn = document.getElementById('open-vault-btn');
  if (openVaultBtn) {
    openVaultBtn.onclick = pickAndOpenVault;
  }

  const fileSwitcher = new QuickSwitcherModal({
    app,
    mode: 'files',
    placeholder: 'Open file by name...',
    onSelect: (item) => openFile(item.id),
  });

  const commandPalette = new QuickSwitcherModal({
    app,
    mode: 'commands',
    placeholder: 'Type a command...',
    onSelect: (item) => commands.execute(item.id),
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const isMeta = e.ctrlKey || e.metaKey;
    const isAlt = e.altKey;
    const isShift = e.shiftKey;
    const key = e.key.toLowerCase();

    // 1. DevTools: Cmd + Option + I
    if (isMeta && isAlt && key === 'i') {
      e.preventDefault();
      ipcRenderer.invoke('app:toggleDevTools');
      return;
    }

    // 2. Toggle Sidebar: Cmd + \ or Cmd + B
    if (isMeta && (e.key === '\\' || key === 'b')) {
      e.preventDefault();
      toggleSidebar();
      return;
    }

    // 3. Re-open Closed Tab: Cmd + Shift + T
    if (isMeta && isShift && key === 't') {
      e.preventDefault();
      workspace.reopenLastClosedTab();
      return;
    }

    // 4. Tab Navigation: Cmd + Option + Left Arrow / Right Arrow
    if (isMeta && isAlt && e.key === 'ArrowLeft') {
      e.preventDefault();
      workspace.activeLeaf?.previousTab();
      return;
    }
    if (isMeta && isAlt && e.key === 'ArrowRight') {
      e.preventDefault();
      workspace.activeLeaf?.nextTab();
      return;
    }

    // 5. Quick Switcher: Cmd/Ctrl + O
    if (isMeta && !isAlt && !isShift && key === 'o') {
      e.preventDefault();
      fileSwitcher.open();
      return;
    }

    // 6. Command Palette: Cmd/Ctrl + P
    if (isMeta && !isAlt && !isShift && key === 'p') {
      e.preventDefault();
      commandPalette.open();
      return;
    }

    // 7. Close Active Tab: Cmd/Ctrl + W
    if (isMeta && !isAlt && !isShift && key === 'w') {
      e.preventDefault();
      const activeLeaf = workspace.activeLeaf;
      if (activeLeaf && activeLeaf.activeTab) {
        activeLeaf.closeTab(activeLeaf.activeTab);
      }
      return;
    }
  });

  commands.register({
    id: 'toggle-sidebar',
    name: 'Toggle Sidebar',
    hotkey: 'Cmd+\\',
    callback: toggleSidebar,
  });

  commands.register({
    id: 'toggle-devtools',
    name: 'Toggle Developer Tools',
    hotkey: 'Cmd+Opt+I',
    callback: () => ipcRenderer.invoke('app:toggleDevTools'),
  });

  commands.register({
    id: 'reopen-closed-tab',
    name: 'Reopen Closed Tab',
    hotkey: 'Cmd+Shift+T',
    callback: () => workspace.reopenLastClosedTab(),
  });

  commands.register({
    id: 'previous-tab',
    name: 'Navigate to Previous Tab',
    hotkey: 'Cmd+Opt+Left',
    callback: () => workspace.activeLeaf?.previousTab(),
  });

  commands.register({
    id: 'next-tab',
    name: 'Navigate to Next Tab',
    hotkey: 'Cmd+Opt+Right',
    callback: () => workspace.activeLeaf?.nextTab(),
  });

  // 🟢 Opens Google.com by default
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
    hotkey: 'Cmd+O',
    callback: () => fileSwitcher.open(),
  });

  commands.register({
    id: 'command-palette',
    name: 'Command Palette: Run Command',
    hotkey: 'Cmd+P',
    callback: () => commandPalette.open(),
  });

  const config = loadConfig();
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