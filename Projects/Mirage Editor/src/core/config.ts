import fs from 'fs';
import path from 'path';
import os from 'os';
import { ipcRenderer } from 'electron';

export interface DomainShortcutRule {
  id: string;
  domain: string;
  enabled: boolean;
  bypassChords: string[];
}

export interface ScriptFolderConfig {
  path: string;
}

export interface SavedTabState {
  type: 'markdown' | 'webview';
  filePath?: string;
  url?: string;
}

export interface SavedLeafState {
  tabs: SavedTabState[];
  activeTabIndex: number;
}

export interface SavedWorkspaceState {
  leaves: SavedLeafState[];
  activeLeafIndex: number;
}

export interface AppConfig {
  vaultPath?: string;
  domainRules?: DomainShortcutRule[];
  customHotkeys?: Record<string, string | null>;
  scriptsFolders?: ScriptFolderConfig[];
  startupScripts?: string[];
  secrets?: Record<string, string>;
  workspaceState?: SavedWorkspaceState;
}

const CONFIG_DIR = path.join(os.homedir(), '.mirage-editor');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

export function loadConfig(): AppConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as AppConfig;
  } catch {
    return {
      domainRules: [],
      customHotkeys: {},
      scriptsFolders: [],
      startupScripts: [],
      secrets: {},
    };
  }
}

export function saveConfig(config: AppConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function pickVaultFolder(): Promise<string | null> {
  return ipcRenderer.invoke('dialog:selectVaultFolder');
}