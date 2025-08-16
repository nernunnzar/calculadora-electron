const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
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
      win.setContentSize(width + 20, height + 20);
    });
  });
}

// Manejadores de los botones
ipcMain.on('cerrar-ventana', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.on('minimizar-ventana', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
