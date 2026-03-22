const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getConfig: () => ipcRenderer.invoke('get-config'),
  openSetup: () => ipcRenderer.invoke('open-setup'),
  completeSetup: () => ipcRenderer.invoke('complete-setup'),
  selectDirectory: () => ipcRenderer.invoke('select-directory')
});
