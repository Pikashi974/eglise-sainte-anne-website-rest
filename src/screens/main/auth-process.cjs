
const { BrowserWindow } = require('electron');
const authService = require('../../services/auth-service.cjs');
const createAppWindow = require('../../js/main.cjs');
const path = require("path");

let win = null;

function createAuthWindow() {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "./mainPreload.cjs"),
    }
  });

  win.loadURL(authService.getAuthenticationURL());

  const {session: {webRequest}} = win.webContents;

  const filter = {
    urls: [
      'http://localhost/callback*'
    ]
  };

  webRequest.onBeforeRequest(filter, async ({url}) => {
    await authService.loadTokens(url);
    createAppWindow.NewWindow();
    return destroyAuthWin();
  });

  win.on('authenticated', () => {
    destroyAuthWin();
  });

  win.on('closed', () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createLogoutWindow() {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(authService.getLogOutUrl());

  logoutWindow.on('ready-to-show', async () => {
    await authService.logout();
    logoutWindow.close();
  });
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};