import { app, BrowserWindow, nativeTheme, screen } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import * as path from 'path';
import 'reflect-metadata';

import {
  ELECTRON_DID_FINISH_LOADING,
  ELECTRON_ACTIVATE,
  ELECTRON_READY,
  ELECTRON_WINDOW_CLOSED,
  ELECTRON_CLOSED,
} from './constants';

import {
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
  calculateWindowWidth,
  calculateWindowHeight,
} from './helpers/window.helpers';
import { findAndConnectVault, getVaultFromDeviceSettings } from './helpers/database.helper';

import setupAppEvents from './events/setupAppEvents';
import setupVaultEvents from './events/setupVaultEvents';
import setupSettingsEvents from './events/setupSettingsEvents';
import setupAccountEvents from './events/setupAccountEvents';
import setupAssetEvents from './events/setupAssetEvents';
import setupTransactionEvents from './events/setupTransactionEvents';
import setupBudgetEvents from './events/setupBudgetEvents';
import setupImportEvents from './events/setupImportEvents';

let win: BrowserWindow | null = null;

const createWindow = async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    width: calculateWindowWidth(width),
    height: calculateWindowHeight(height),
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // https://github.com/electron/electron/issues/9920#issuecomment-575839738
    },
  });

  // Override OS theme to "light mode" until "dark mode" is implemented
  nativeTheme.themeSource = 'light';

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    win.loadURL(`file://${__dirname}/../../build/index.html`);
  }

  if (isDev) {
    // Hot Reloading / 'node_modules/.bin/electronPath'
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });

    // React Dev Tools
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));

    // Chrome Dev Tools
    win.webContents.openDevTools();

    // Reset device settings (Uncomment to enable)
    // await settings.unset(VAULT_PATH);
    // await settings.unset(VAULT_MASTER_KEY);
  }

  await setupAppEvents(win);
  await setupVaultEvents(win);
  await setupSettingsEvents(win);
  await setupAccountEvents(win);
  await setupAssetEvents(win);
  await setupTransactionEvents(win);
  await setupBudgetEvents(win);
  await setupImportEvents(win);

  win.on(ELECTRON_CLOSED, () => (win = null));

  win.webContents.on(ELECTRON_DID_FINISH_LOADING, async () => {
    const { vaultPath, vaultMasterKey } = await getVaultFromDeviceSettings();
    await findAndConnectVault(win, vaultPath, vaultMasterKey);
  });
};

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
