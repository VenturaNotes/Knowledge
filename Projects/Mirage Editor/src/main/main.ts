import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import path from 'path';

// Standard Google Chrome macOS User-Agent
const CHROME_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

// 🟢 1. Override Electron's global fallback user-agent across all network requests
app.userAgentFallback = CHROME_USER_AGENT;

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

  // 🟢 2. Enforce the Chrome User-Agent directly on the webview partition session
  webSession.setUserAgent(CHROME_USER_AGENT);

  // 🟢 3. Intercept and ensure all redirect/OAuth headers strip any Electron signature
  webSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = CHROME_USER_AGENT;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Grant standard web permissions (Audio, Notifications, Video, Popups)
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