// Main process. Deliberately thin — file I/O and app logic live in the
// renderer (nodeIntegration: true), since this is a single-user local tool
// with no untrusted-plugin sandboxing requirement. That tradeoff is the
// whole point: no IPC layer to maintain.

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

// The only IPC in this app: dialog.showOpenDialog is main-process-only in
// modern Electron (the old `remote` module that let renderers call this
// directly was removed in Electron 14+). Everything else — reading/writing
// vault files — stays in the renderer via nodeIntegration.
ipcMain.handle('dialog:selectVaultFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

function createWindow() {
  const win = new BrowserWindow({
    title: 'Mirage Editor',
    width: 1400,
    height: 900,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  if (process.env.OL_DEVTOOLS) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
