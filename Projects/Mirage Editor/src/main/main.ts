import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

export interface DomainShortcutRule {
  id: string;
  domain: string;
  enabled: boolean;
  bypassChords: string[];
}

let domainRules: DomainShortcutRule[] = [];
let activeAppChords: Set<string> = new Set();

ipcMain.handle('shortcuts:setRules', (_event, rules: DomainShortcutRule[]) => {
  domainRules = rules || [];
});

ipcMain.handle('shortcuts:setAppChords', (_event, chords: string[]) => {
  activeAppChords = new Set((chords || []).map((c) => c.toLowerCase()));
});

function buildChord(input: Electron.Input): string | null {
  const parts: string[] = [];
  if (input.meta) parts.push('meta');
  if (input.control) parts.push('ctrl');
  if (input.alt) parts.push('alt');
  if (input.shift) parts.push('shift');

  if (parts.length === 0) return null;

  let key = (input.key || '').toLowerCase();
  if (key === 'space' || key === ' ') key = ' ';

  return parts.sort().join('+') + '+' + key;
}

function shouldBypassForDomain(hostname: string, chord: string): boolean {
  if (!hostname || !chord || domainRules.length === 0) return false;

  const rule = domainRules.find((r) => {
    if (!r.enabled || !r.domain) return false;
    const dom = r.domain.toLowerCase().trim();
    return hostname === dom || hostname.endsWith('.' + dom);
  });

  if (!rule) return false;

  return rule.bypassChords.map((c) => c.toLowerCase().trim()).includes(chord.toLowerCase());
}

ipcMain.handle('dialog:selectVaultFolder', async (event): Promise<string | null> => {
  const focusedWindow = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(focusedWindow || undefined, {
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('app:toggleDevTools', (event) => {
  const focusedWindow = BrowserWindow.fromWebContents(event.sender);
  if (focusedWindow) {
    focusedWindow.webContents.toggleDevTools();
  }
});

function configureWebviewSession(): void {
  const webSession = session.fromPartition('persist:mirage-web');

  const rawUA = webSession.getUserAgent();
  const cleanChromeUA = rawUA
    .replace(/Electron\/\S+\s?/, '')
    .replace(/mirage-editor\/\S+\s?/, '')
    .trim();

  const FIREFOX_UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0';

  webSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const url = details.url.toLowerCase();

    if (url.includes('accounts.google.com') || url.includes('accounts.youtube.com')) {
      details.requestHeaders['User-Agent'] = FIREFOX_UA;
      delete details.requestHeaders['Sec-CH-UA'];
      delete details.requestHeaders['Sec-CH-UA-Mobile'];
      delete details.requestHeaders['Sec-CH-UA-Platform'];
      delete details.requestHeaders['sec-ch-ua'];
      delete details.requestHeaders['sec-ch-ua-mobile'];
      delete details.requestHeaders['sec-ch-ua-platform'];
    } else {
      details.requestHeaders['User-Agent'] = cleanChromeUA;
      delete details.requestHeaders['X-Electron'];
    }

    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  webSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(true);
  });
}

function createWindow(): void {
  const iconPath = path.join(__dirname, '..', 'static', 'MirageEditor.png');

  if (process.platform === 'darwin' && app.dock) {
    try {
      app.dock.setIcon(iconPath);
    } catch (e) {
      console.warn('Failed to set dock icon:', e);
    }
  }

  configureWebviewSession();

  mainWindow = new BrowserWindow({
    title: 'Mirage Editor',
    width: 1400,
    height: 900,
    backgroundColor: '#1e1e1e',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webviewTag: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'static', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 🟢 Webview Event Tracker: Automatically switches focused pane & routes shortcuts
app.on('web-contents-created', (_event, contents) => {
  // 1. Synchronize Active Leaf on Webview Focus / Click
  contents.on('focus', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app:webview-focused', contents.id);
    }
  });

  // 2. Intercept & Forward Shortcuts
  contents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;

    const chord = buildChord(input);
    if (!chord) return;

    let hostname = '';
    try {
      const urlStr = contents.getURL() || '';
      if (urlStr) {
        hostname = new URL(urlStr).hostname.toLowerCase();
      }
    } catch {}

    if (shouldBypassForDomain(hostname, chord)) {
      return;
    }

    const isMeta = input.meta || input.control;
    const key = input.key.toLowerCase();
    const isCloseTab = isMeta && !input.alt && !input.shift && key === 'w';

    // Check if the key chord matches any custom or default app hotkey
    if (isCloseTab || activeAppChords.has(chord.toLowerCase())) {
      event.preventDefault();

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('app:forward-shortcut', {
          sourceWebContentsId: contents.id,
          chord,
          key: input.key,
          metaKey: input.meta,
          ctrlKey: input.control,
          altKey: input.alt,
          shiftKey: input.shift,
        });
      }
    }
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});