import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

import { DB_GET_SETTINGS, DB_GET_SETTINGS_ACK } from '@constants/repositories';
import { SettingsRepository } from '@database/repositories/settings.repository';

export const getSettings = async (win: BrowserWindow) => {
  const settings = await SettingsRepository.getSettings();
  win.webContents.send(DB_GET_SETTINGS_ACK, settings);
};

const setupSettingsEvents = async (win: BrowserWindow) => {
  ipcMain.on(DB_GET_SETTINGS, async (_: IpcMainEvent) => {
    await getSettings(win);
  });
};

export default setupSettingsEvents;
