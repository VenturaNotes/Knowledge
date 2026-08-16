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

// Folders to always ignore to prevent memory exhaustion
const IGNORED_FOLDERS = new Set(['node_modules', '.git', '.trash', '.obsidian', '.mirage-editor', '.DS_Store']);

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
      ignored: [
        /(^|[\/\\])\../, // ignore dotfiles (.git, .trash, etc.)
        '**/node_modules/**',
      ],
      persistent: true,
      ignoreInitial: true,
      depth: 8,
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

  public readDirectory(relDir: string = ''): TreeItemEntry[] {
    if (!this.path) return [];
    const targetDir = path.join(this.path, relDir);
    if (!fs.existsSync(targetDir)) return [];

    try {
      const entries = fs.readdirSync(targetDir, { withFileTypes: true });
      const items: TreeItemEntry[] = [];

      for (const entry of entries) {
        if (entry.name.startsWith('.') || IGNORED_FOLDERS.has(entry.name)) continue;

        const itemRelPath = relDir ? `${relDir}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          items.push({ name: entry.name, relPath: itemRelPath, isDirectory: true });
        } else {
          items.push({ name: entry.name, relPath: itemRelPath, isDirectory: false });
        }
      }

      return items.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });
    } catch {
      return [];
    }
  }

  // 🟢 Strictly defaults to ['.md'] so binaries, PDFs, and node_modules are NEVER scanned into memory
  public listFiles(
    dir: string = this.path || '',
    relative: string = '',
    extensions: string[] = ['.md']
  ): string[] {
    if (!this.isOpen() || !fs.existsSync(dir)) return [];
    let files: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.') || IGNORED_FOLDERS.has(entry.name)) continue;

        const relPath = relative ? `${relative}/${entry.name}` : entry.name;
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          files = files.concat(this.listFiles(fullPath, relPath, extensions));
        } else {
          const normalizedRel = relPath.split(path.sep).join('/');
          if (extensions.some((ext) => entry.name.toLowerCase().endsWith(ext.toLowerCase()))) {
            files.push(normalizedRel);
          }
        }
      }
    } catch {
      return [];
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