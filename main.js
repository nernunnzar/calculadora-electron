const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,  // tamaño inicial (puedes cambiar)
    height: 450,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Calculadora Mini',
  });

  win.loadFile('index.html');

  // Ajustar tamaño al contenido después de cargar la ventana
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      new Promise((resolve) => {
        const body = document.body;
        const html = document.documentElement;
        const width = Math.max(
          body.scrollWidth, body.offsetWidth, 
          html.clientWidth, html.scrollWidth, html.offsetWidth
        );
        const height = Math.max(
          body.scrollHeight, body.offsetHeight, 
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        resolve({width, height});
      });
    `).then(({width, height}) => {
      // Añade un poco de margen para evitar cortes (por ejemplo 20px)
      win.setContentSize(width + 20, height + 20);
    });
  });
}

// Manejador para cerrar ventana desde renderer
ipcMain.on('cerrar-ventana', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

// Manejo de minimizar ventana
ipcMain.on('minimizar-ventana', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
