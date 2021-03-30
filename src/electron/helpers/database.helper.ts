import { existsSync } from 'fs';
import { ConnectionOptions } from 'typeorm';
import { BrowserWindow } from 'electron';
import settings from 'electron-settings';

import connection, { dbConfig } from '@database/connection';
import {
  DATABASE_CONNECTED,
  DATABASE_DOES_NOT_EXIST,
  DATABASE_NOT_DETECTED,
  DATABASE_PATH,
} from '@constants';

export const connectAndSaveDB = async (win: BrowserWindow | null, filePath: string) => {
  const databaseConnection: ConnectionOptions = { ...dbConfig, database: filePath, type: 'sqlite' };
  await connection.create(databaseConnection);
  await settings.set(DATABASE_PATH, filePath);
  win?.webContents.send(DATABASE_CONNECTED);
};

export const findAndConnectDB = async (win: BrowserWindow | null, filePath: string) => {
  if (filePath) {
    if (existsSync(filePath)) {
      await connectAndSaveDB(win, filePath);
    } else {
      win?.webContents.send(DATABASE_DOES_NOT_EXIST, { dbPath: filePath });
    }
  } else {
    win?.webContents.send(DATABASE_NOT_DETECTED);
  }
};
