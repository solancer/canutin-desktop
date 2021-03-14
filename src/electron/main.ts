import 'reflect-metadata';
import settings from 'electron-settings';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

import {
  DID_FINISH_LOADING,
  ELECTRON_ACTIVATE,
  ELECTRON_READY,
  ELECTRON_WINDOW_CLOSED,
} from './constants';
import { connectAndSaveDB, findAndConnectDB } from './helpers/database.helper';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT } from '../constants/events';
import { DATABASE_PATH } from '../constants';

let win: BrowserWindow | null = null;

const setupEvents = async () => {
  ipcMain.on(OPEN_CREATE_VAULT, async () => {
    if (win) {
      const { filePath } = await dialog.showSaveDialog(win, {
        filters: [{ name: 'DatabaseType', extensions: ['sqlite'] }],
      });

      if (filePath) await connectAndSaveDB(win, filePath);
    }
  });

  ipcMain.on(OPEN_EXISTING_VAULT, async () => {
    if (win) {
      const { filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'DatabaseType', extensions: ['sqlite'] }],
      });

      if (filePaths.length) await connectAndSaveDB(win, filePaths[0]);
    }
  });
};

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1280,
    height: 880,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 32 },
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }

  await setupEvents();

  win.webContents.on(DID_FINISH_LOADING, async () => {
    const dbPath = await settings.get(DATABASE_PATH) as string;
    await findAndConnectDB(win, dbPath);
  });
}

app.on(ELECTRON_READY, createWindow);

app.on(ELECTRON_WINDOW_CLOSED, () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(ELECTRON_ACTIVATE, () => {
  if (win === null) {
    createWindow();
  }
});
