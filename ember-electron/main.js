/* eslint-env node */
const { app, BrowserWindow } = require('electron');
const { dirname, join, resolve } = require('path');
const connect = require('connect'); // connect server
const serveStatic = require('serve-static'); // serve static files
const PORT_NUMBER = 4201;

let mainWindow = null;
let server = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    icon: '../public/icon.ico'
  });

  mainWindow.maximize();
  mainWindow.show();

  if (!server) {
    server = connect()
      .use(serveStatic(join(__dirname || resolve(dirname('')), '..', 'ember'))).listen(PORT_NUMBER);
  }

  const emberAppLocation = 'http://localhost:' + PORT_NUMBER + '/';

  // Load the statically served ember application
  mainWindow.loadURL(emberAppLocation);

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(emberAppLocation);
  });

  mainWindow.webContents.on('crashed', () => {
  });

  mainWindow.on('unresponsive', () => {
  });

  mainWindow.on('responsive', () => {
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

process.on('uncaughtException', (err) => {
});
