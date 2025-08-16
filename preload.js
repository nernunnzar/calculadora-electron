const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  cerrarVentana: () => ipcRenderer.send('cerrar-ventana'),
  minimizarVentana: () => ipcRenderer.send('minimizar-ventana')
});
