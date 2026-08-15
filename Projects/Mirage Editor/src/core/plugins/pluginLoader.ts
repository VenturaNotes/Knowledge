import fs from 'fs';
import path from 'path';
import { AppContext } from '../../types';
import { Plugin, PluginManifest } from './plugin';

export interface LoadedPlugin {
  manifest: PluginManifest;
  instance: Plugin;
}

export function loadPlugins(pluginsDir: string, context: AppContext): LoadedPlugin[] {
  const loaded: LoadedPlugin[] = [];
  if (!fs.existsSync(pluginsDir)) return loaded;

  const pluginFolders = fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory());

  for (const folder of pluginFolders) {
    const manifestPath = path.join(pluginsDir, folder.name, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const manifest: PluginManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const mainPath = path.join(pluginsDir, folder.name, manifest.main || 'main.js');

      // Clear cache for hot-reloading during development
      delete require.cache[require.resolve(mainPath)];
      const PluginClass = require(mainPath);
      const instance: Plugin = new (PluginClass.default || PluginClass)(context, manifest);
      
      instance.onload?.();
      loaded.push({ manifest, instance });
      console.log(`[PluginLoader] Loaded: ${manifest.name} (${manifest.id})`);
    } catch (err) {
      console.error(`[PluginLoader] Failed to load ${folder.name}:`, err);
    }
  }

  return loaded;
}

export function unloadPlugins(loaded: LoadedPlugin[]): void {
  for (const { instance, manifest } of loaded) {
    try {
      instance.onunload?.();
    } catch (err) {
      console.error(`[PluginLoader] Error unloading ${manifest.id}:`, err);
    }
  }
}