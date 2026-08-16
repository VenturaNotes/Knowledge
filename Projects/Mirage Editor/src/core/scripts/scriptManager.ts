import fs from 'fs';
import path from 'path';
import { AppContext } from '../../types';
import { loadConfig } from '../config';

export interface LoadedScript {
  id: string;
  name: string;
  relPath: string;
  folder: string;
}

export class ScriptManager {
  private app: AppContext;
  public loadedScripts: LoadedScript[] = [];
  private registeredCommandIds: string[] = [];
  private executingScripts: Set<string> = new Set();

  constructor(app: AppContext) {
    this.app = app;
  }

  public async init(): Promise<void> {
    await this.reloadScripts();
    await this.runStartupScripts();
  }

  public getNormalizedFolders(): string[] {
    const config = loadConfig();
    return (config.scriptsFolders || []).map((f) =>
      f.path.replace(/^\/+|\/+$/g, '').split(/[\\/]/).join('/')
    );
  }

  public async reloadScripts(): Promise<void> {
    for (const cmdId of this.registeredCommandIds) {
      this.app.commands.unregister(cmdId);
    }
    this.registeredCommandIds = [];
    this.loadedScripts = [];

    if (!this.app.vault.isOpen() || !this.app.vault.path) return;

    const folders = this.getNormalizedFolders();
    if (folders.length === 0) return;

    // Scan each configured folder directly
    for (const folder of folders) {
      const fullFolderPath = path.join(this.app.vault.path, folder);
      if (!fs.existsSync(fullFolderPath)) continue;

      const jsFiles = this._scanJsFilesRecursive(fullFolderPath, folder);

      for (const fileRelPath of jsFiles) {
        const fileName = fileRelPath.split('/').pop() || fileRelPath;
        const scriptName = fileName.replace(/\.js$/, '');
        const commandId = `script:${fileRelPath.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        this.loadedScripts.push({
          id: commandId,
          name: scriptName,
          relPath: fileRelPath,
          folder,
        });

        this.app.commands.register({
          id: commandId,
          name: `Script: ${scriptName}`,
          callback: () => this.runScript(fileRelPath),
        });

        this.registeredCommandIds.push(commandId);
      }
    }

    this.loadedScripts.sort((a, b) => a.name.localeCompare(b.name));
  }

  private _scanJsFilesRecursive(dir: string, baseRel: string): string[] {
    let results: string[] = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const full = path.join(dir, entry.name);
        const rel = `${baseRel}/${entry.name}`;

        if (entry.isDirectory()) {
          results = results.concat(this._scanJsFilesRecursive(full, rel));
        } else if (entry.name.endsWith('.js')) {
          results.push(rel.split(path.sep).join('/'));
        }
      }
    } catch (e) {
      console.error(`[ScriptManager] Error scanning directory: ${dir}`, e);
    }
    return results;
  }

  public async runScript(relPath: string): Promise<any> {
    if (!this.app.vault.isOpen() || !this.app.vault.path) return;
    if (this.executingScripts.has(relPath)) return;

    this.executingScripts.add(relPath);

    try {
      const config = loadConfig();
      const scriptContent = this.app.vault.readFile(relPath);
      const basePath = this.app.vault.path;
      const absolutePath = path.join(basePath, relPath);
      const dirName = path.dirname(absolutePath);

      const moduleObj: { exports: any } = { exports: {} };

      const wrapper = new Function(
        'module',
        'exports',
        'require',
        '__filename',
        '__dirname',
        scriptContent
      );

      wrapper(moduleObj, moduleObj.exports, require, absolutePath, dirName);

      const fn = typeof moduleObj.exports === 'function' ? moduleObj.exports : moduleObj.exports?.default;

      if (typeof fn === 'function') {
        const result = fn({
          app: this.app,
          vault: this.app.vault,
          workspace: this.app.workspace,
          secrets: config.secrets || {},
        });

        if (result instanceof Promise) {
          await result;
        }
        return result;
      }
    } catch (err) {
      console.error(`[ScriptManager] Error executing script "${relPath}":`, err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 20));
      this.executingScripts.delete(relPath);
    }
  }

  public async runStartupScripts(): Promise<void> {
    const config = loadConfig();
    const startupList = config.startupScripts || [];

    for (const script of this.loadedScripts) {
      if (startupList.includes(script.name)) {
        await this.runScript(script.relPath);
      }
    }
  }
}