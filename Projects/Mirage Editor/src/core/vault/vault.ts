import fs from 'fs';
import path from 'path';
import chokidar, { FSWatcher } from 'chokidar';

export type VaultEventType = 'add' | 'change' | 'unlink';

export interface VaultChangeEvent {
  eventType: VaultEventType;
  path: string;
}

export interface TreeItemEntry {
  name: string;
  relPath: string;
  isDirectory: boolean;
}

export type VaultChangeCallback = (event: VaultChangeEvent) => void;

export class Vault {
  public path: string | null;
  private _watcher: FSWatcher | null = null;
  private _changeCallbacks: Set<VaultChangeCallback> = new Set();
  private _recentWrites: Map<string, number> = new Map();

  constructor(vaultPath: string | null = null) {
    this.path = vaultPath;
    if (this.path) this._initWatcher();
  }

  public isOpen(): boolean {
    return this.path !== null;
  }

  public open(newVaultPath: string): void {
    this.dispose();
    this.path = newVaultPath;
    this._initWatcher();
  }

  private _initWatcher(): void {
    if (!this.path) return;

    this._watcher = chokidar.watch(this.path, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true,
      depth: 10,
    });

    const notify = (eventType: VaultEventType, fullPath: string): void => {
      if (!this.path) return;
      const relPath = path.relative(this.path, fullPath).split(path.sep).join('/');

      const lastWritten = this._recentWrites.get(relPath);
      if (lastWritten && Date.now() - lastWritten < 800) {
        return;
      }

      this._changeCallbacks.forEach((cb) => cb({ eventType, path: relPath }));
    };

    this._watcher.on('add', (p) => notify('add', p));
    this._watcher.on('change', (p) => notify('change', p));
    this._watcher.on('unlink', (p) => notify('unlink', p));
  }

  /**
   * Fast shallow read of a single directory level (for instant on-demand UI expansion).
   */
  public readDirectory(relDir: string = ''): TreeItemEntry[] {
    if (!this.path) return [];
    const targetDir = path.join(this.path, relDir);
    if (!fs.existsSync(targetDir)) return [];

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    const items: TreeItemEntry[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue; // ignore hidden/dotfiles

      const itemRelPath = relDir ? `${relDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        items.push({ name: entry.name, relPath: itemRelPath, isDirectory: true });
      } else if (entry.name.endsWith('.md')) {
        items.push({ name: entry.name, relPath: itemRelPath, isDirectory: false });
      }
    }

    // Sort folders first alphabetically, then files alphabetically
    return items.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
      return a.isDirectory ? -1 : 1;
    });
  }

  public listFiles(dir: string = this.path || '', relative: string = ''): string[] {
    if (!this.isOpen() || !fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const relPath = path.join(relative, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(this.listFiles(path.join(dir, entry.name), relPath));
      } else if (entry.name.endsWith('.md')) {
        files.push(relPath.split(path.sep).join('/'));
      }
    }
    return files;
  }

  public readFile(relPath: string): string {
    if (!this.path) throw new Error('Vault is not open');
    return fs.readFileSync(path.join(this.path, relPath), 'utf-8');
  }

  public writeFile(relPath: string, content: string): void {
    if (!this.path) throw new Error('Vault is not open');
    this._recentWrites.set(relPath, Date.now());
    const fullPath = path.join(this.path, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  public exists(relPath: string): boolean {
    if (!this.path) return false;
    return fs.existsSync(path.join(this.path, relPath));
  }

  public deleteFile(relPath: string): void {
    if (!this.path) throw new Error('Vault is not open');
    fs.unlinkSync(path.join(this.path, relPath));
  }

  public onChange(callback: VaultChangeCallback): () => void {
    this._changeCallbacks.add(callback);
    return () => this._changeCallbacks.delete(callback);
  }

  public dispose(): void {
    this._watcher?.close();
    this._watcher = null;
    this._changeCallbacks.clear();
    this._recentWrites.clear();
  }
}