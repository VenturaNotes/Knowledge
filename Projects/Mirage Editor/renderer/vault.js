import fs from 'fs';
import path from 'path';

export class Vault {
  constructor(vaultPath = null) {
    this.path = vaultPath;
    this._watchers = [];
  }

  isOpen() {
    return this.path !== null;
  }

  /**
   * Points this Vault at a different folder on disk. We mutate the existing
   * instance rather than creating a new Vault so that anything holding a
   * reference to this object (plugins, in particular) stays valid across a
   * vault switch instead of holding a stale pointer.
   */
  open(newVaultPath) {
    this.dispose();
    this.path = newVaultPath;
  }

  /** Recursively list all .md files, returned as vault-relative paths. */
  listFiles(dir = this.path, relative = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
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

  readFile(relPath) {
    return fs.readFileSync(path.join(this.path, relPath), 'utf-8');
  }

  writeFile(relPath, content) {
    fs.writeFileSync(path.join(this.path, relPath), content, 'utf-8');
  }

  exists(relPath) {
    return fs.existsSync(path.join(this.path, relPath));
  }

  createFile(relPath, content = '') {
    const fullPath = path.join(this.path, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  deleteFile(relPath) {
    fs.unlinkSync(path.join(this.path, relPath));
  }

  /**
   * Fires callback on any .md change under the vault root.
   * NOTE: recursive: true in fs.watch is macOS/Windows only — Linux will
   * silently only watch the top-level directory. Swap for chokidar if you
   * end up developing this on Linux.
   */
  onChange(callback) {
    const watcher = fs.watch(this.path, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        callback({ eventType, path: filename.split(path.sep).join('/') });
      }
    });
    this._watchers.push(watcher);
    return () => watcher.close();
  }

  dispose() {
    this._watchers.forEach((w) => w.close());
    this._watchers = [];
  }
}
