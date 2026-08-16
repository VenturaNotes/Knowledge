import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import path from 'path';

// Native folder picker
ipcMain.handle('dialog:selectVaultFolder', async (event): Promise<string | null> => {
  const focusedWindow = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(focusedWindow || undefined, {
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// IPC Handler for DevTools toggle
ipcMain.handle('app:toggleDevTools', (event) => {
  const focusedWindow = BrowserWindow.fromWebContents(event.sender);
  if (focusedWindow) {
    focusedWindow.webContents.toggleDevTools();
  }
});

function configureWebviewSession(): void {
  const webSession = session.fromPartition('persist:mirage-web');

  // Native Chrome identity
  const rawUA = webSession.getUserAgent();
  const cleanChromeUA = rawUA
    .replace(/Electron\/\S+\s?/, '')
    .replace(/mirage-editor\/\S+\s?/, '')
    .trim();

  // Firefox identity for sign-in
  const FIREFOX_UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0';

  // 🟢 Dynamic Identity Router
  webSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const url = details.url.toLowerCase();

    // 1. If logging in via Google Accounts, use Firefox identity to bypass login block
    if (url.includes('accounts.google.com') || url.includes('accounts.youtube.com')) {
      details.requestHeaders['User-Agent'] = FIREFOX_UA;
      delete details.requestHeaders['Sec-CH-UA'];
      delete details.requestHeaders['Sec-CH-UA-Mobile'];
      delete details.requestHeaders['Sec-CH-UA-Platform'];
      delete details.requestHeaders['sec-ch-ua'];
      delete details.requestHeaders['sec-ch-ua-mobile'];
      delete details.requestHeaders['sec-ch-ua-platform'];
    } else {
      // 2. For Google AI Studio, Search, and everything else, use Native Chrome identity
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

  const win = new BrowserWindow({
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

  win.loadFile(path.join(__dirname, '..', 'static', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});