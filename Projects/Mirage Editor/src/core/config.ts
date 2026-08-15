import fs from 'fs';
import path from 'path';
import os from 'os';
import { ipcRenderer } from 'electron';

export interface AppConfig {
  vaultPath?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.mirage-editor');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

export function loadConfig(): AppConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as AppConfig;
  } catch {
    return {};
  }
}

export function saveConfig(config: AppConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function pickVaultFolder(): Promise<string | null> {
  return ipcRenderer.invoke('dialog:selectVaultFolder');
}