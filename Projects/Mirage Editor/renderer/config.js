import fs from 'fs';
import path from 'path';
import os from 'os';
import { ipcRenderer } from 'electron';

const CONFIG_DIR = path.join(os.homedir(), '.mirage-editor');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

export function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveConfig(config) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

/** Opens the native folder picker via main process. Resolves to a path, or null if cancelled. */
export function pickVaultFolder() {
  return ipcRenderer.invoke('dialog:selectVaultFolder');
}
