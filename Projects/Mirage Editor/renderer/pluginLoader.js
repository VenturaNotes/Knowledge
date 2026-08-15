import fs from 'fs';
import path from 'path';

// This loader uses Node's require() with a runtime-computed path. esbuild
// cannot statically resolve a variable path at build time, so it leaves
// these calls untouched in the bundle rather than trying to inline them.
// That's intentional: plugins stay decoupled from the app bundle and can be
// dropped in, edited, or hot-reloaded independently, the same relationship
// Obsidian plugins have to Obsidian core.
export function loadPlugins(pluginsDir, context) {
  const loaded = [];
  if (!fs.existsSync(pluginsDir)) return loaded;

  const pluginFolders = fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory());

  for (const folder of pluginFolders) {
    const manifestPath = path.join(pluginsDir, folder.name, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const mainPath = path.join(pluginsDir, folder.name, manifest.main || 'main.js');

      delete require.cache[require.resolve(mainPath)]; // dev hot-reload support
      const PluginClass = require(mainPath);
      const instance = new PluginClass(context);
      instance.onload?.();

      loaded.push({ manifest, instance });
      console.log(`[PluginLoader] Loaded: ${manifest.name} (${manifest.id})`);
    } catch (err) {
      console.error(`[PluginLoader] Failed to load ${folder.name}:`, err);
    }
  }

  return loaded;
}

export function unloadPlugins(loaded) {
  for (const { instance, manifest } of loaded) {
    try {
      instance.onunload?.();
    } catch (err) {
      console.error(`[PluginLoader] Error unloading ${manifest.id}:`, err);
    }
  }
}
