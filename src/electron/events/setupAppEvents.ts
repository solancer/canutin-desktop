import { app, BrowserWindow, ipcMain, safeStorage } from 'electron';

import {
  APP_WINDOW_CONTROL,
  APP_VERSION,
  APP_VERSION_ACK,
  APP_SAFE_STORAGE,
  APP_SAFE_STORAGE_ACK,
} from '@constants/app';
import { WindowControlEnum } from '@appConstants/misc';

const setupAppEvents = async (win: BrowserWindow) => {
  ipcMain.on(APP_WINDOW_CONTROL, async (e, action: WindowControlEnum) => {
    if (win) {
      switch (action) {
        case WindowControlEnum.MINIMIZE:
          win.minimize();
          break;
        case WindowControlEnum.MAXIMIZE:
          win.isMaximized() ? win.unmaximize() : win.maximize();
          break;
        case WindowControlEnum.CLOSE:
          win.close();
      }
    }
  });

  ipcMain.on(APP_VERSION, async () => {
    win.webContents.send(APP_VERSION_ACK, app.getVersion());
  });

  ipcMain.on(APP_SAFE_STORAGE, async () => {
    win.webContents.send(APP_SAFE_STORAGE_ACK, safeStorage.isEncryptionAvailable());
  });
};

export default setupAppEvents;
