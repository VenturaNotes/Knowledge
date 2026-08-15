import { Vault, TreeItemEntry } from '../../core/vault/vault';

export class FileTreeComponent {
  private container: HTMLElement;
  private vault: Vault;
  private onFileClick: (relPath: string) => void;
  private expandedFolders: Set<string> = new Set();

  constructor(container: HTMLElement, vault: Vault, onFileClick: (relPath: string) => void) {
    this.container = container;
    this.vault = vault;
    this.onFileClick = onFileClick;
  }

  public render(): void {
    this.container.innerHTML = '';

    if (!this.vault.isOpen()) {
      this.container.innerHTML = `<div id="empty-state">No vault open. Click "Open Vault…" to select a folder.</div>`;
      return;
    }

    const rootItems = this.vault.readDirectory('');
    if (rootItems.length === 0) {
      this.container.innerHTML = `<div id="empty-state">Vault is empty.</div>`;
      return;
    }

    const listEl = document.createElement('div');
    listEl.className = 'tree-list root';
    this._renderEntries(rootItems, listEl, 0);
    this.container.appendChild(listEl);
  }

  private _renderEntries(entries: TreeItemEntry[], parentEl: HTMLElement, level: number): void {
    for (const entry of entries) {
      if (entry.isDirectory) {
        this._renderFolderNode(entry, parentEl, level);
      } else {
        this._renderFileNode(entry, parentEl, level);
      }
    }
  }

  private _renderFolderNode(entry: TreeItemEntry, parentEl: HTMLElement, level: number): void {
    const isExpanded = this.expandedFolders.has(entry.relPath);

    const folderContainer = document.createElement('div');
    folderContainer.className = 'tree-folder-group';

    const header = document.createElement('div');
    header.className = 'tree-item tree-folder';
    header.style.paddingLeft = `${level * 14 + 8}px`;

    const chevron = document.createElement('span');
    chevron.className = `tree-chevron ${isExpanded ? 'open' : ''}`;
    chevron.textContent = '▶';

    const icon = document.createElement('span');
    icon.className = 'tree-icon';
    icon.textContent = isExpanded ? '📂' : '📁';

    const label = document.createElement('span');
    label.className = 'tree-label';
    label.textContent = entry.name;

    header.appendChild(chevron);
    header.appendChild(icon);
    header.appendChild(label);
    folderContainer.appendChild(header);

    const childrenContainer = document.createElement('div');
    childrenContainer.className = `tree-children ${isExpanded ? '' : 'hidden'}`;
    folderContainer.appendChild(childrenContainer);

    header.onclick = (e) => {
      e.stopPropagation();
      const nextExpanded = !this.expandedFolders.has(entry.relPath);
      if (nextExpanded) {
        this.expandedFolders.add(entry.relPath);
        chevron.classList.add('open');
        icon.textContent = '📂';
        childrenContainer.classList.remove('hidden');

        // Lazy-load children on demand
        childrenContainer.innerHTML = '';
        const childEntries = this.vault.readDirectory(entry.relPath);
        this._renderEntries(childEntries, childrenContainer, level + 1);
      } else {
        this.expandedFolders.delete(entry.relPath);
        chevron.classList.remove('open');
        icon.textContent = '📁';
        childrenContainer.classList.add('hidden');
      }
    };

    // If previously expanded, populate its children
    if (isExpanded) {
      const childEntries = this.vault.readDirectory(entry.relPath);
      this._renderEntries(childEntries, childrenContainer, level + 1);
    }

    parentEl.appendChild(folderContainer);
  }

  private _renderFileNode(entry: TreeItemEntry, parentEl: HTMLElement, level: number): void {
    const fileEl = document.createElement('div');
    fileEl.className = 'tree-item tree-file';
    fileEl.style.paddingLeft = `${level * 14 + 22}px`; // Align with folder labels

    const icon = document.createElement('span');
    icon.className = 'tree-icon file-icon';
    icon.textContent = '📄';

    const label = document.createElement('span');
    label.className = 'tree-label';
    label.textContent = entry.name.replace(/\.md$/, '');

    fileEl.appendChild(icon);
    fileEl.appendChild(label);
    fileEl.title = entry.relPath;

    fileEl.onclick = (e) => {
      e.stopPropagation();
      this.onFileClick(entry.relPath);
    };

    parentEl.appendChild(fileEl);
  }
}