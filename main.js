const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let setupWindow;

// Check if first run (needs setup)
function isFirstRun() {
  return !store.get('setupComplete');
}

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#050505',
    show: false
  });

  setupWindow.loadFile('renderer/setup.html');

  setupWindow.once('ready-to-show', () => {
    setupWindow.show();
  });

  setupWindow.on('closed', () => {
    setupWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#050505',
    show: false
  });

  // Check if MatrixChat mode is enabled
  const useMatrixChat = store.get('useMatrixChat', false);
  
  if (useMatrixChat) {
    mainWindow.loadFile('renderer/matrixchat.html');
  } else {
    mainWindow.loadFile('renderer/dashboard.html');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  if (isFirstRun()) {
    createSetupWindow();
  } else {
    createMainWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (isFirstRun()) {
        createSetupWindow();
      } else {
        createMainWindow();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('save-config', async (event, config) => {
  store.set('apiKeys', config.apiKeys);
  store.set('channels', config.channels);
  store.set('useMatrixChat', config.useMatrixChat);
  store.set('setupComplete', true);
  return { success: true };
});

ipcMain.handle('get-config', async () => {
  return {
    apiKeys: store.get('apiKeys', {}),
    channels: store.get('channels', {}),
    useMatrixChat: store.get('useMatrixChat', false)
  };
});

ipcMain.handle('open-setup', async () => {
  if (setupWindow) {
    setupWindow.focus();
  } else {
    createSetupWindow();
  }
});

ipcMain.handle('complete-setup', async () => {
  if (setupWindow) {
    setupWindow.close();
  }
  createMainWindow();
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});
