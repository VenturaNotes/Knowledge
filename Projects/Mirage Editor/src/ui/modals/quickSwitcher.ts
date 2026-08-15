import { AppContext } from '../../types';

export interface SwitcherItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface QuickSwitcherOptions {
  app: AppContext;
  onSelect: (item: SwitcherItem) => void;
  placeholder?: string;
  mode?: 'files' | 'commands';
}

function fuzzyScore(query: string, target: string): number | null {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qIdx = 0;
  let score = 0;
  let prevMatchIdx = -2;

  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) {
      score += 10;
      if (i === prevMatchIdx + 1) score += 15;
      if (i === 0 || t[i - 1] === '/' || t[i - 1] === ' ') score += 20;
      prevMatchIdx = i;
      qIdx++;
    }
  }
  return qIdx === q.length ? score : null;
}

export class QuickSwitcherModal {
  private app: AppContext;
  private onSelect: (item: SwitcherItem) => void;
  private placeholder: string;
  private mode: 'files' | 'commands';
  private selectedIndex: number = 0;
  private currentMatches: SwitcherItem[] = [];

  public overlay!: HTMLElement;
  public input!: HTMLInputElement;
  public resultsContainer!: HTMLElement;

  constructor({ app, onSelect, placeholder = 'Search files...', mode = 'files' }: QuickSwitcherOptions) {
    this.app = app;
    this.onSelect = onSelect;
    this.placeholder = placeholder;
    this.mode = mode;
    this._createDOM();
  }

  private _createDOM(): void {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay hidden';
    this.overlay.innerHTML = `
      <div class="modal-box">
        <input type="text" class="modal-input" placeholder="${this.placeholder}" />
        <div class="modal-results"></div>
      </div>
    `;

    this.input = this.overlay.querySelector('.modal-input') as HTMLInputElement;
    this.resultsContainer = this.overlay.querySelector('.modal-results') as HTMLElement;

    this.overlay.onclick = (e: MouseEvent) => {
      if (e.target === this.overlay) this.close();
    };

    this.input.oninput = () => this._renderResults();
    this.input.onkeydown = (e: KeyboardEvent) => this._handleKey(e);

    document.body.appendChild(this.overlay);
  }

  public open(): void {
    this.overlay.classList.remove('hidden');
    this.input.value = '';
    this.selectedIndex = 0;
    this._renderResults();
    this.input.focus();
  }

  public close(): void {
    this.overlay.classList.add('hidden');
  }

  private _getItems(): SwitcherItem[] {
    if (this.mode === 'files') {
      return this.app.vault.listFiles().map((f) => ({ id: f, title: f, subtitle: 'File' }));
    } else {
      return this.app.commands.list().map((c) => ({ id: c.id, title: c.name, subtitle: 'Command' }));
    }
  }

  private _renderResults(): void {
    const q = this.input.value.trim();
    const items = this._getItems();

    let matches = items;
    if (q) {
      matches = items
        .map((item) => ({ item, score: fuzzyScore(q, item.title) }))
        .filter((res): res is { item: SwitcherItem; score: number } => res.score !== null)
        .sort((a, b) => b.score - a.score)
        .map((res) => res.item);
    }

    this.currentMatches = matches;
    this.resultsContainer.innerHTML = '';

    if (matches.length === 0) {
      this.resultsContainer.innerHTML = `<div class="modal-empty">No results found</div>`;
      return;
    }

    matches.slice(0, 20).forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `modal-result-item ${idx === this.selectedIndex ? 'selected' : ''}`;
      el.innerHTML = `<span>${item.title}</span><small>${item.subtitle}</small>`;
      el.onclick = () => {
        this.onSelect(item);
        this.close();
      };
      this.resultsContainer.appendChild(el);
    });
  }

  private _handleKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') return this.close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentMatches.length - 1);
      this._renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this._renderResults();
    } else if (e.key === 'Enter' && this.currentMatches[this.selectedIndex]) {
      e.preventDefault();
      this.onSelect(this.currentMatches[this.selectedIndex]);
      this.close();
    }
  }
}