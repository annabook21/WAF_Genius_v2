const { contextBridge, ipcRenderer } = require('electron');

// Expose electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // GeoIP2 database related functions
  geoip: {
    getDatabaseStatus: () => ipcRenderer.invoke('geo-database-status'),
    lookupIps: (ips) => ipcRenderer.invoke('geo-lookup', ips)
  }
}); 