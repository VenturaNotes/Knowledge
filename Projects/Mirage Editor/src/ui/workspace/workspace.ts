import { EventBus } from '../../core/events/eventBus';
import { MarkdownEditor } from '../../editor/editor';

let leafIdCounter = 0;
let tabIdCounter = 0;

export type TabType = 'markdown' | 'webview';

export interface WorkspaceTab {
  id: string;
  type: TabType;
  title: string;
  filePath?: string;
  url?: string;
  editor?: MarkdownEditor;
  contentHolder: HTMLElement;
}

export interface ClosedTabRecord {
  type: TabType;
  title: string;
  filePath?: string;
  url?: string;
}

let draggedTabInfo: { sourceLeafId: string; tabId: string } | null = null;

// Smart Omnibar: formats input into a valid URL or a Google Search query
function formatUrlOrSearch(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return 'https://www.google.com';

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const isDomain =
    /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed) ||
    /^localhost(:\d+)?(\/.*)?$/i.test(trimmed);
  if (isDomain) {
    return `https://${trimmed}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

export class WorkspaceLeaf {
  public id: string;
  public workspace: Workspace;
  public containerEl: HTMLElement;
  public tabBarEl!: HTMLElement;
  public tabContentEl!: HTMLElement;
  public rightDropZone!: HTMLElement;
  public tabs: WorkspaceTab[] = [];
  public activeTab: WorkspaceTab | null = null;

  constructor(containerEl: HTMLElement, workspace: Workspace) {
    this.id = `leaf-${++leafIdCounter}`;
    this.workspace = workspace;
    this.containerEl = containerEl;
    this._buildDOM();
  }

  private _buildDOM(): void {
    this.containerEl.innerHTML = `
      <div class="tab-bar"></div>
      <div class="tab-content"></div>
      <div class="leaf-drop-zone right"></div>
    `;
    this.tabBarEl = this.containerEl.querySelector('.tab-bar') as HTMLElement;
    this.tabContentEl = this.containerEl.querySelector('.tab-content') as HTMLElement;
    this.rightDropZone = this.containerEl.querySelector('.leaf-drop-zone.right') as HTMLElement;

    this._setupDropZones();
  }

  public openFileTab(
    filePath: string,
    editorFactory: (el: HTMLElement, path: string, tabId: string) => MarkdownEditor
  ): WorkspaceTab {
    const holder = document.createElement('div');
    holder.className = 'editor-holder hidden';
    this.tabContentEl.appendChild(holder);

    const tabId = `tab-${++tabIdCounter}`;
    const editor = editorFactory(holder, filePath, tabId);

    const tab: WorkspaceTab = {
      id: tabId,
      type: 'markdown',
      title: filePath.split('/').pop() || filePath,
      filePath,
      editor,
      contentHolder: holder,
    };

    this.tabs.push(tab);
    this.workspace.renderAllLeafTabBars();
    this.setActiveTab(tab);
    return tab;
  }

  public openWebviewTab(initialUrl: string = 'https://www.google.com'): WorkspaceTab {
    const holder = document.createElement('div');
    holder.className = 'webview-holder hidden';

    holder.innerHTML = `
      <div class="browser-nav-bar">
        <button class="nav-btn back-btn" title="Back">◀</button>
        <button class="nav-btn forward-btn" title="Forward">▶</button>
        <button class="nav-btn reload-btn" title="Reload">🔄</button>
        <input type="text" class="browser-url-input" placeholder="Search Google or type a URL" value="${initialUrl}" />
        <button class="nav-btn go-btn">Go</button>
      </div>
      <webview 
        src="${initialUrl}" 
        class="embedded-webview"
        partition="persist:mirage-web"
        allowpopups
      ></webview>
    `;
    this.tabContentEl.appendChild(holder);

    const webview = holder.querySelector('webview') as any;
    const urlInput = holder.querySelector('.browser-url-input') as HTMLInputElement;
    const backBtn = holder.querySelector('.back-btn') as HTMLButtonElement;
    const forwardBtn = holder.querySelector('.forward-btn') as HTMLButtonElement;
    const reloadBtn = holder.querySelector('.reload-btn') as HTMLButtonElement;
    const goBtn = holder.querySelector('.go-btn') as HTMLButtonElement;

    const navigate = (input: string) => {
      const targetUrl = formatUrlOrSearch(input);
      urlInput.value = targetUrl;
      webview.src = targetUrl;
    };

    urlInput.onkeydown = (e) => {
      if (e.key === 'Enter') navigate(urlInput.value);
    };
    goBtn.onclick = () => navigate(urlInput.value);
    backBtn.onclick = () => webview.canGoBack?.() && webview.goBack();
    forwardBtn.onclick = () => webview.canGoForward?.() && webview.goForward();
    reloadBtn.onclick = () => webview.reload?.();

    let displayTitle = 'Google';
    try {
      displayTitle = new URL(initialUrl).hostname.replace('www.', '');
    } catch {}

    const tab: WorkspaceTab = {
      id: `tab-${++tabIdCounter}`,
      type: 'webview',
      title: displayTitle,
      url: initialUrl,
      contentHolder: holder,
    };

    webview.addEventListener('page-title-updated', (e: any) => {
      tab.title = e.title || 'Browser';
      this._renderTabs();
    });

    webview.addEventListener('did-navigate', (e: any) => {
      urlInput.value = e.url;
      tab.url = e.url;
    });

    this.tabs.push(tab);
    this.workspace.renderAllLeafTabBars();
    this.setActiveTab(tab);
    return tab;
  }

  public setActiveTab(tab: WorkspaceTab | null): void {
    this.activeTab = tab;
    this.tabs.forEach((t) => {
      t.contentHolder.classList.toggle('hidden', t !== tab);
    });
    this._renderTabs();
    this.workspace.setActiveLeaf(this);
    this.workspace.events.emit('active-tab-change', tab);
  }

  public closeTab(tab: WorkspaceTab): void {
    this.workspace.pushClosedTab({
      type: tab.type,
      title: tab.title,
      filePath: tab.filePath,
      url: tab.url,
    });

    tab.editor?.flush();
    tab.editor?.destroy();
    tab.contentHolder.remove();

    this.tabs = this.tabs.filter((t) => t !== tab);

    if (this.activeTab === tab) {
      this.setActiveTab(this.tabs[this.tabs.length - 1] || null);
    } else {
      this._renderTabs();
    }

    if (this.tabs.length === 0) {
      this.workspace.closeLeaf(this);
    }
  }

  public nextTab(): void {
    if (!this.activeTab || this.tabs.length <= 1) return;
    const idx = this.tabs.indexOf(this.activeTab);
    const nextIdx = (idx + 1) % this.tabs.length;
    this.setActiveTab(this.tabs[nextIdx]);
  }

  public previousTab(): void {
    if (!this.activeTab || this.tabs.length <= 1) return;
    const idx = this.tabs.indexOf(this.activeTab);
    const prevIdx = (idx - 1 + this.tabs.length) % this.tabs.length;
    this.setActiveTab(this.tabs[prevIdx]);
  }

  public _renderTabs(): void {
    this.tabBarEl.innerHTML = '';

    // Sidebar Toggle Button on the first leaf tab bar
    if (this.workspace.leaves[0] === this) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'tab-bar-toggle-btn';
      toggleBtn.title = 'Toggle Sidebar (Cmd+\\)';
      toggleBtn.textContent = '☰';
      toggleBtn.onclick = () => this.workspace.onToggleSidebar?.();
      this.tabBarEl.appendChild(toggleBtn);
    }

    this.tabs.forEach((t, index) => {
      const tabEl = document.createElement('div');
      tabEl.className = `workspace-tab ${t === this.activeTab ? 'active' : ''}`;
      tabEl.draggable = true;

      const title = document.createElement('span');
      title.className = 'tab-title';
      title.textContent = t.type === 'webview' ? `🌐 ${t.title}` : t.title;
      title.onclick = () => this.setActiveTab(t);

      const closeBtn = document.createElement('span');
      closeBtn.className = 'tab-close';
      closeBtn.textContent = '✕';
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        this.closeTab(t);
      };

      tabEl.appendChild(title);
      tabEl.appendChild(closeBtn);

      tabEl.ondragstart = (e) => {
        draggedTabInfo = { sourceLeafId: this.id, tabId: t.id };
        tabEl.classList.add('dragging');
        e.dataTransfer?.setData('text/plain', t.id);
        this.workspace.showDropZones(true);
      };

      tabEl.ondragend = () => {
        tabEl.classList.remove('dragging');
        draggedTabInfo = null;
        this.workspace.showDropZones(false);
      };

      tabEl.ondragover = (e) => {
        e.preventDefault();
        const rect = tabEl.getBoundingClientRect();
        if (e.clientX < rect.left + rect.width / 2) {
          tabEl.classList.add('drag-over-left');
          tabEl.classList.remove('drag-over-right');
        } else {
          tabEl.classList.add('drag-over-right');
          tabEl.classList.remove('drag-over-left');
        }
      };

      tabEl.ondragleave = () => {
        tabEl.classList.remove('drag-over-left', 'drag-over-right');
      };

      tabEl.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        tabEl.classList.remove('drag-over-left', 'drag-over-right');

        if (!draggedTabInfo) return;
        const { sourceLeafId, tabId } = draggedTabInfo;
        const sourceLeaf = this.workspace.leaves.find((l) => l.id === sourceLeafId);
        if (!sourceLeaf) return;

        const draggedTab = sourceLeaf.tabs.find((tab) => tab.id === tabId);
        if (!draggedTab) return;

        sourceLeaf.tabs = sourceLeaf.tabs.filter((tab) => tab.id !== tabId);
        if (sourceLeaf !== this) {
          this.tabContentEl.appendChild(draggedTab.contentHolder);
          sourceLeaf._renderTabs();
          if (sourceLeaf.tabs.length === 0) {
            this.workspace.closeLeaf(sourceLeaf);
          }
        }

        const rect = tabEl.getBoundingClientRect();
        const insertIndex = e.clientX < rect.left + rect.width / 2 ? index : index + 1;
        this.tabs.splice(insertIndex, 0, draggedTab);

        this.workspace.renderAllLeafTabBars();
        this.setActiveTab(draggedTab);
      };

      this.tabBarEl.appendChild(tabEl);
    });
  }

  private _setupDropZones(): void {
    this.rightDropZone.ondragover = (e) => {
      e.preventDefault();
      this.rightDropZone.classList.add('drag-hover');
    };

    this.rightDropZone.ondragleave = () => {
      this.rightDropZone.classList.remove('drag-hover');
    };

    this.rightDropZone.ondrop = (e) => {
      e.preventDefault();
      this.rightDropZone.classList.remove('drag-hover');
      this.workspace.showDropZones(false);

      if (!draggedTabInfo) return;
      const { sourceLeafId, tabId } = draggedTabInfo;
      const sourceLeaf = this.workspace.leaves.find((l) => l.id === sourceLeafId);
      if (!sourceLeaf) return;

      const draggedTab = sourceLeaf.tabs.find((tab) => tab.id === tabId);
      if (!draggedTab) return;

      if (sourceLeaf.tabs.length === 1 && this.workspace.leaves.length === 1) return;

      sourceLeaf.tabs = sourceLeaf.tabs.filter((tab) => tab.id !== tabId);
      sourceLeaf._renderTabs();

      const newLeaf = this.workspace.openLeaf();
      newLeaf.tabContentEl.appendChild(draggedTab.contentHolder);
      newLeaf.tabs.push(draggedTab);

      this.workspace.renderAllLeafTabBars();
      newLeaf.setActiveTab(draggedTab);

      if (sourceLeaf.tabs.length === 0) {
        this.workspace.closeLeaf(sourceLeaf);
      }
    };
  }

  public detach(): void {
    [...this.tabs].forEach((t) => this.closeTab(t));
    this.containerEl.remove();
  }
}

export class Workspace {
  public rootEl: HTMLElement;
  public leaves: WorkspaceLeaf[] = [];
  public activeLeaf: WorkspaceLeaf | null = null;
  public events: EventBus = new EventBus();
  private closedTabsHistory: ClosedTabRecord[] = [];
  public fileOpener?: (path: string) => void;
  public onToggleSidebar?: () => void;

  constructor(rootEl: HTMLElement) {
    this.rootEl = rootEl;
  }

  public renderAllLeafTabBars(): void {
    this.leaves.forEach((l) => l._renderTabs());
  }

  public syncTabsForFile(filePath: string, newContent: string, sourceTabId: string): void {
    for (const leaf of this.leaves) {
      for (const tab of leaf.tabs) {
        if (tab.id !== sourceTabId && tab.filePath === filePath && tab.editor) {
          tab.editor.setContentIfDifferent(newContent);
        }
      }
    }
  }

  public getOrCreateActiveLeaf(): WorkspaceLeaf {
    if (this.activeLeaf && this.leaves.includes(this.activeLeaf)) {
      return this.activeLeaf;
    }
    if (this.leaves.length > 0) return this.leaves[0];
    return this.openLeaf();
  }

  public openLeaf(): WorkspaceLeaf {
    const containerEl = document.createElement('div');
    containerEl.className = 'workspace-leaf';
    this.rootEl.appendChild(containerEl);

    const leaf = new WorkspaceLeaf(containerEl, this);
    this.leaves.push(leaf);
    this.setActiveLeaf(leaf);
    this.renderAllLeafTabBars();
    return leaf;
  }

  public closeLeaf(leaf: WorkspaceLeaf): void {
    this.leaves = this.leaves.filter((l) => l !== leaf);
    leaf.detach();
    if (this.activeLeaf === leaf) {
      this.setActiveLeaf(this.leaves[0] || null);
    }
    this.renderAllLeafTabBars();
  }

  public setActiveLeaf(leaf: WorkspaceLeaf | null): void {
    this.leaves.forEach((l) => l.containerEl.classList.remove('active'));
    leaf?.containerEl.classList.add('active');
    this.activeLeaf = leaf;
    this.events.emit('active-leaf-change', leaf);
  }

  public showDropZones(show: boolean): void {
    this.leaves.forEach((leaf) => {
      leaf.rightDropZone.classList.toggle('active', show);
    });
  }

  public pushClosedTab(record: ClosedTabRecord): void {
    this.closedTabsHistory.push(record);
    if (this.closedTabsHistory.length > 30) {
      this.closedTabsHistory.shift();
    }
  }

  public reopenLastClosedTab(): void {
    const last = this.closedTabsHistory.pop();
    if (!last) return;

    const leaf = this.getOrCreateActiveLeaf();
    if (last.type === 'markdown' && last.filePath && this.fileOpener) {
      this.fileOpener(last.filePath);
    } else if (last.type === 'webview' && last.url) {
      leaf.openWebviewTab(last.url);
    }
  }

  public flushAllLeaves(): void {
    this.leaves.forEach((leaf) => {
      leaf.tabs.forEach((t) => t.editor?.flush());
    });
  }
}