const { ipcRenderer, webFrame } = require('electron');

// Intercept window.Notification and ServiceWorker notifications in the page
const script = `
  (function() {
    if (window.__relayNotificationInstalled) return;
    window.__relayNotificationInstalled = true;

    function RelayNotification(title, options = {}) {
      window.dispatchEvent(new CustomEvent('__relay_notify_event', {
        detail: {
          title: title || '',
          body: options.body || '',
          icon: options.icon || '',
          tag: options.tag || ''
        }
      }));

      const instance = new EventTarget();
      instance.title = title;
      instance.body = options.body;
      instance.icon = options.icon;
      instance.tag = options.tag;
      instance.close = () => {};
      return instance;
    }

    RelayNotification.permission = 'granted';
    RelayNotification.requestPermission = function(callback) {
      if (callback) callback('granted');
      return Promise.resolve('granted');
    };

    window.Notification = RelayNotification;

    if ('serviceWorker' in navigator && window.ServiceWorkerRegistration) {
      window.ServiceWorkerRegistration.prototype.showNotification = function(title, options = {}) {
        window.dispatchEvent(new CustomEvent('__relay_notify_event', {
          detail: {
            title: title || '',
            body: options.body || '',
            icon: options.icon || '',
            tag: options.tag || ''
          }
        }));
        return Promise.resolve();
      };
    }
  })();
`;

webFrame.executeJavaScript(script);

window.addEventListener('__relay_notify_event', (e) => {
  if (e.detail) {
    ipcRenderer.send('service-notify', e.detail);
  }
});