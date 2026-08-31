const { app, BrowserWindow, WebContentsView, session, ipcMain, desktopCapturer, systemPreferences, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

const SIDEBAR_WIDTH = 76;
const SERVICES_FILE = path.join(app.getPath('userData'), 'services.json');

const ICON_PATH = fs.existsSync(path.join(__dirname, 'icon.icns'))
  ? path.join(__dirname, 'icon.icns')
  : path.join(__dirname, 'logo.png');

let mainWindow = null;
const views = new Map(); // service id -> WebContentsView
let services = []; // in-memory list
let activeId = null;
let modalOpen = false;
let isQuitting = false;

// ── Persistence ─────────────────────────────────────────────────────
function loadServices() {
  try {
    const raw = fs.readFileSync(SERVICES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveServices() {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf-8');
}

function desktopUserAgent() {
  return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36`;
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

async function ensureMediaPermissions() {
  if (process.platform === 'darwin') {
    try {
      if (systemPreferences.getMediaAccessStatus('camera') !== 'granted') {
        await systemPreferences.askForMediaAccess('camera');
      }
      if (systemPreferences.getMediaAccessStatus('microphone') !== 'granted') {
        await systemPreferences.askForMediaAccess('microphone');
      }
    } catch (err) {
      console.error('Failed to request media permissions:', err);
    }
  }
}

// ── Native macOS Notification Delivery ──────────────────────────────
function showNativeNotification(service, data) {
  if (!Notification.isSupported()) return;

  const notif = new Notification({
    title: service.name,
    subtitle: data.title || '',
    body: data.body || '',
    icon: service.favicon || ICON_PATH,
    silent: false,
  });

  notif.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
    switchTo(service.id);
  });

  notif.show();
}

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
    callback(true);
  });

  ses.setPermissionCheckHandler((_webContents, permission) => {
    return true;
  });

  ses.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
      if (sources.length > 0) {
        callback({ video: sources[0] });
      } else {
        callback({});
      }
    } catch (err) {
      callback({});
    }
  });

  ses.setUserAgent(desktopUserAgent());

  const view = new WebContentsView({
    webPreferences: {
      session: ses,
      preload: path.join(__dirname, 'service-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  // Listen to native notifications bridged from this service
  view.webContents.on('ipc-message', (_event, channel, data) => {
    if (channel === 'service-notify') {
      showNativeNotification(service, data);
    }
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

  // Attach view to mainWindow hierarchy immediately (hidden until selected)
  if (mainWindow) {
    mainWindow.contentView.addChildView(view);
    view.setVisible(false);
  }

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
  if (!views.has(id)) return;
  activeId = id;

  // Toggle visibility without detaching, keeping WebSockets alive
  for (const [sId, view] of views.entries()) {
    if (sId === id && !modalOpen) {
      view.setVisible(true);
    } else {
      view.setVisible(false);
    }
  }

  layout();
  broadcastServices();
}

function broadcastServices() {
  if (mainWindow) mainWindow.webContents.send('services', services, activeId);
}

function setModalOpen(isOpen) {
  modalOpen = isOpen;
  const active = views.get(activeId);
  if (!active || !mainWindow) return;

  if (isOpen) {
    active.setVisible(false);
  } else {
    active.setVisible(true);
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

  const view = createServiceView(service);
  views.set(service.id, view);
  broadcastServices();
  switchTo(service.id);

  return service;
}

function removeService(id) {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return;

  const view = views.get(id);
  if (view) {
    mainWindow.contentView.removeChildView(view);
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
    icon: ICON_PATH,
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

app.whenReady().then(async () => {
  await ensureMediaPermissions();

  if (!app.isPackaged && process.platform === 'darwin' && app.dock && fs.existsSync(ICON_PATH)) {
    app.dock.setIcon(ICON_PATH);
  }

  app.userAgentFallback = desktopUserAgent();
  createWindow();
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  } else if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});