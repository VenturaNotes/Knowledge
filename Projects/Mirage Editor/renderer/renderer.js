import path from 'path';
import fs from 'fs';
import { Vault } from './vault.js';
import { EventBus } from './eventBus.js';
import { CommandRegistry } from './commands.js';
import { Workspace } from './workspace.js';
import { MarkdownEditor } from './editor.js';
import { loadPlugins } from './pluginLoader.js';
import { loadConfig, saveConfig, pickVaultFolder } from './config.js';

// No vault path baked in — nothing opens until the user picks a folder,
// or we find one persisted from a previous session.
const vault = new Vault(null);
const workspace = new Workspace(document.getElementById('workspace-root'));
const events = new EventBus();
const commands = new CommandRegistry();

// This is the object passed into every plugin's constructor — the whole
// "context API" surface. Deliberately small. Grow it only when a real
// plugin needs something it doesn't have.
const app = { vault, workspace, events, commands };
window.app = app; // handy for devtools debugging

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function renderFileTree() {
  const container = document.getElementById('file-tree');
  container.innerHTML = '';

  if (!vault.isOpen()) {
    const empty = document.createElement('div');
    empty.id = 'empty-state';
    empty.textContent = 'No vault open. Click "Open Vault…" above to choose a folder.';
    container.appendChild(empty);
    return;
  }

  const files = vault.listFiles();
  files.sort().forEach((relPath) => {
    const item = document.createElement('div');
    item.className = 'file-tree-item';
    item.textContent = relPath;
    item.onclick = () => openFile(relPath);
    container.appendChild(item);
  });
}

function openVaultFolder(newPath) {
  vault.open(newPath);
  saveConfig({ vaultPath: newPath });
  renderFileTree();
  vault.onChange(debounce(renderFileTree, 200));
  events.emit('vault-opened', newPath);
}

async function pickAndOpenVault() {
  const chosen = await pickVaultFolder();
  if (chosen) openVaultFolder(chosen);
}

function openFile(relPath) {
  const existing = workspace.getLeavesForFile(relPath)[0];
  if (existing) {
    workspace.setActiveLeaf(existing);
    return;
  }

  const leaf = workspace.openLeaf();
  leaf.filePath = relPath;

  const content = vault.readFile(relPath);
  const editor = new MarkdownEditor(leaf.containerEl, {
    initialContent: content,
    onChange: debounce((newContent) => {
      vault.writeFile(relPath, newContent);
      events.emit('file-modified', relPath);
    }, 300),
  });

  leaf.setView(editor);
  events.emit('file-opened', relPath);
}

function init() {
  document.getElementById('open-vault-btn').onclick = pickAndOpenVault;

  const config = loadConfig();
  if (config.vaultPath && fs.existsSync(config.vaultPath)) {
    openVaultFolder(config.vaultPath);
  } else {
    renderFileTree(); // shows empty state
  }

  commands.register({
    id: 'open-vault',
    name: 'Open Vault Folder',
    callback: pickAndOpenVault,
  });

  commands.register({
    id: 'reload-file-tree',
    name: 'Reload file tree',
    callback: renderFileTree,
  });

  const pluginsDir = path.join(__dirname, '..', 'plugins');
  const loaded = loadPlugins(pluginsDir, app);
  events.emit('app-ready', { pluginsLoaded: loaded.length });
}

init();
