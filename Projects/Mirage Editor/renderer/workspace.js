import { EventBus } from './eventBus.js';

let leafIdCounter = 0;

export class WorkspaceLeaf {
  constructor(containerEl) {
    this.id = `leaf-${++leafIdCounter}`;
    this.containerEl = containerEl;
    this.view = null; // whatever attaches here: MarkdownEditor, a terminal, etc.
    this.filePath = null;
  }

  setView(view) {
    this.view = view;
  }

  detach() {
    this.view?.destroy?.();
    this.containerEl.remove();
  }
}

export class Workspace {
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.leaves = [];
    this.activeLeaf = null;
    this.events = new EventBus();
  }

  openLeaf() {
    const containerEl = document.createElement('div');
    containerEl.className = 'workspace-leaf';
    this.rootEl.appendChild(containerEl);

    const leaf = new WorkspaceLeaf(containerEl);
    this.leaves.push(leaf);
    this.setActiveLeaf(leaf);
    this.events.emit('leaf-opened', leaf);
    return leaf;
  }

  closeLeaf(leaf) {
    this.leaves = this.leaves.filter((l) => l !== leaf);
    leaf.detach();
    if (this.activeLeaf === leaf) {
      this.setActiveLeaf(this.leaves[this.leaves.length - 1] || null);
    }
    this.events.emit('leaf-closed', leaf);
  }

  setActiveLeaf(leaf) {
    this.leaves.forEach((l) => l.containerEl.classList.remove('active'));
    leaf?.containerEl.classList.add('active');
    this.activeLeaf = leaf;
    this.events.emit('active-leaf-change', leaf);
  }

  getActiveLeaf() {
    return this.activeLeaf;
  }

  getLeavesForFile(filePath) {
    return this.leaves.filter((l) => l.filePath === filePath);
  }
}
