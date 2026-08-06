const { app, BrowserWindow, WebContentsView, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const SIDEBAR_WIDTH = 76;
const SERVICES_FILE = path.join(app.getPath('userData'), 'services.json');

let mainWindow = null;
const views = new Map(); // service id -> WebContentsView
let services = []; // in-memory list, mirrors services.json on disk
let activeId = null;
let modalOpen = false; // true while the renderer's add-service modal is showing
let isQuitting = false; // tracks if the app is explicitly quitting (Cmd+Q) vs closing via red "x"

// ── Persistence ─────────────────────────────────────────────────────
function loadServices() {
  try {
    const raw = fs.readFileSync(SERVICES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return []; // no file yet on first run, or it's corrupt — start empty
  }
}

function saveServices() {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf-8');
}

function desktopUserAgent() {
  return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0`;
}

function slugify(name) {
  const base =
    name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '') || 'service';
  let id = base;
  let n = 2;
  while (services.some((s) => s.id === id)) {
    id = `${base}-${n++}`;
  }
  return id;
}

// Script to disable Passkeys/WebAuthn in embedded views.
const disablePasskeysScript = `
  (function() {
    try {
      if (window.PublicKeyCredential) {
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = function() {
          return Promise.resolve(false);
        };
        if (window.PublicKeyCredential.isConditionalMediationAvailable) {
          window.PublicKeyCredential.isConditionalMediationAvailable = function() {
            return Promise.resolve(false);
          };
        }
      }
      if (navigator.credentials) {
        navigator.credentials.get = function() {
          return Promise.reject(new DOMException("Passkeys unsupported in embedded view", "NotAllowedError"));
        };
      }
    } catch(e) {}
  })();
`;

function createServiceView(service) {
  const ses = session.fromPartition(`persist:${service.id}`);

  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'notifications');
  });

  ses.setUserAgent(desktopUserAgent());

  const view = new WebContentsView({
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });

  view.webContents.on('did-start-navigation', () => {
    view.webContents.executeJavaScript(disablePasskeysScript).catch(() => {});
  });
  view.webContents.on('dom-ready', () => {
    view.webContents.executeJavaScript(disablePasskeysScript).catch(() => {});
  });

  view.webContents.loadURL(service.url);

  view.webContents.setWindowOpenHandler(({ url }) => ({
    action: 'allow',
    overrideBrowserWindowOptions: {
      width: 520,
      height: 680,
      autoHideMenuBar: true,
      webPreferences: {
        session: ses,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    },
  }));

  const serviceHost = new URL(service.url).hostname;
  view.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.on('did-start-navigation', () => {
      childWindow.webContents.executeJavaScript(disablePasskeysScript).catch(() => {});
    });
    childWindow.webContents.on('dom-ready', () => {
      childWindow.webContents.executeJavaScript(disablePasskeysScript).catch(() => {});
    });

    childWindow.webContents.on('did-navigate', (_event, navigatedUrl) => {
      let navigatedHost;
      try {
        navigatedHost = new URL(navigatedUrl).hostname;
      } catch (err) {
        return;
      }
      if (navigatedHost === serviceHost) {
        childWindow.close();
        view.webContents.reload();
      }
    });
  });

  view.webContents.on('page-favicon-updated', (_event, favicons) => {
    if (!favicons || favicons.length === 0) return;
    const idx = services.findIndex((s) => s.id === service.id);
    if (idx === -1) return;
    services[idx] = { ...services[idx], favicon: favicons[0] };
    saveServices();
    broadcastServices();
  });

  return view;
}

function layout() {
  if (!mainWindow) return;
  const { width, height } = mainWindow.getContentBounds();
  const active = views.get(activeId);
  if (active) {
    active.setBounds({ x: SIDEBAR_WIDTH, y: 0, width: width - SIDEBAR_WIDTH, height });
  }
}

function switchTo(id) {
  if (!views.has(id) || id === activeId) return;

  const prev = views.get(activeId);
  if (prev) mainWindow.contentView.removeChildView(prev);

  activeId = id;
  if (modalOpen) return;

  const next = views.get(id);
  mainWindow.contentView.addChildView(next);
  layout();
}

function broadcastServices() {
  if (mainWindow) mainWindow.webContents.send('services', services, activeId);
}

function setModalOpen(isOpen) {
  modalOpen = isOpen;
  const active = views.get(activeId);
  if (!active || !mainWindow) return;

  if (isOpen) {
    mainWindow.contentView.removeChildView(active);
  } else {
    mainWindow.contentView.addChildView(active);
    layout();
  }
}

function addService({ name, url, icon }) {
  if (!name || !url) return null;

  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = `https://${normalizedUrl}`;

  const service = {
    id: slugify(name),
    name: name.trim(),
    url: normalizedUrl,
    icon: (icon || name.trim().charAt(0) || '?').toUpperCase().slice(0, 2),
  };

  services.push(service);
  saveServices();

  views.set(service.id, createServiceView(service));
  broadcastServices();
  switchTo(service.id);

  return service;
}

function removeService(id) {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return;

  const view = views.get(id);
  if (view) {
    if (activeId === id) mainWindow.contentView.removeChildView(view);
    try {
      view.webContents.close();
    } catch (err) {
      // best-effort
    }
    views.delete(id);
  }

  const ses = session.fromPartition(`persist:${id}`);
  ses.clearStorageData();

  services.splice(idx, 1);
  saveServices();

  if (activeId === id) {
    activeId = null;
    if (services.length > 0) switchTo(services[0].id);
  }

  broadcastServices();
}

function reorderServices(orderedIds) {
  const byId = new Map(services.map((s) => [s.id, s]));
  const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean);
  for (const s of services) {
    if (!orderedIds.includes(s.id)) reordered.push(s);
  }
  services = reordered;
  saveServices();
  broadcastServices();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 720,
    minHeight: 480,
    title: 'Relay',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'sidebar.html'));

  services = loadServices();
  for (const service of services) {
    views.set(service.id, createServiceView(service));
  }

  mainWindow.webContents.on('did-finish-load', () => {
    broadcastServices();
    if (services.length > 0) switchTo(services[0].id);
  });

  // Intercept the macOS red "x" button: hide the window instead of destroying it
  mainWindow.on('close', (event) => {
    if (!isQuitting && process.platform === 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('show', layout);
  mainWindow.on('resize', layout);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('switch-service', (_event, id) => switchTo(id));
ipcMain.handle('add-service', (_event, payload) => addService(payload));
ipcMain.on('remove-service', (_event, id) => removeService(id));
ipcMain.on('set-modal-open', (_event, isOpen) => setModalOpen(isOpen));
ipcMain.on('reorder-services', (_event, orderedIds) => reorderServices(orderedIds));

app.whenReady().then(() => {
  app.userAgentFallback = desktopUserAgent();
  createWindow();
});

// Set flag when app is explicitly quitting (e.g. Cmd + Q)
app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show(); // Unhide window instantly without reloading anything
  } else if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});