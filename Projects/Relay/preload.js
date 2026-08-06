const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('relay', {
  onServices: (callback) =>
    ipcRenderer.on('services', (_event, services, activeId) => callback(services, activeId)),
  switchService: (id) => ipcRenderer.send('switch-service', id),
  addService: (service) => ipcRenderer.invoke('add-service', service),
  removeService: (id) => ipcRenderer.send('remove-service', id),
  setModalOpen: (isOpen) => ipcRenderer.send('set-modal-open', isOpen),
  reorderServices: (orderedIds) => ipcRenderer.send('reorder-services', orderedIds),
});
