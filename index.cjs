const { app, ipcMain, BrowserWindow } = require('electron');

const { createAuthWindow, createLogoutWindow } = require('./src/screens/main/auth-process.cjs');
const createAppWindow = require('./src/js/main.cjs');
const authService = require('./src/services/auth-service.cjs');
const apiService = require('./src/services/api-service.cjs');

require("electron-reload")(__dirname);

async function showWindow() {
  try {
    await authService.refreshTokens();
    createAppWindow();
  } catch (err) {
    createAuthWindow();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Handle IPC messages from the renderer process.
  ipcMain.handle('auth:get-profile', authService.getProfile);
  ipcMain.handle('api:get-private-data', apiService.getPrivateData);
  ipcMain.on('auth:log-out', () => {
    BrowserWindow.getAllWindows().forEach(window => window.close());
    createLogoutWindow();
  });

  showWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});