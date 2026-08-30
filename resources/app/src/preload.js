const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fxv', {
  minimize: () => ipcRenderer.send('app:minimize'),
  maximize: () => ipcRenderer.send('app:maximize'),
  close: () => ipcRenderer.send('app:close'),
  reload: () => ipcRenderer.send('app:reloadBroker'),
  onStatus: (cb) => ipcRenderer.on('broker:status', (_e, s) => cb(s)),
})
