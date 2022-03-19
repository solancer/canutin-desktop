import { BrowserWindow, safeStorage } from 'electron';
import { existsSync } from 'fs';
import { ConnectionOptions } from 'typeorm';
import isDev from 'electron-is-dev';
import settings from 'electron-settings';

import connection, { dbConfig } from '@database/connection';
import {
  VAULT_PATH,
  VAULT_MASTER_KEY_ENCODING,
  VAULT_MASTER_KEY,
  VAULT_READY,
  VAULT_SET_WRONG_MASTER_KEY,
  VAULT_SET_NO_MASTER_KEY,
  VAULT_SET_NO_FILE,
  VAULT_NOT_SET,
} from '@constants/vault';

export const connectAndSaveVault = async (
  win: BrowserWindow | null,
  vaultPath: string,
  vaultMasterKey: string,
  rememberVaultMasterKey?: boolean
) => {
  try {
    const databaseConnection: ConnectionOptions = {
      ...dbConfig,
      database: vaultPath,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      verbose: isDev ? console.log : undefined,
      prepareDatabase: db => {
        db.pragma(`CIPHER = 'sqlcipher'`);
        db.pragma(`KEY = '${vaultMasterKey}'`);

        // FIXME: remove legacy support when the app is no longer in "alpha"
        // REF: https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_legacy_mode/
        db.pragma(`LEGACY = 4`);
      },
    };
    const isConnected = await connection.isConnected();
    if (isConnected) await connection.close();

    await connection.create(databaseConnection);
    await settings.set(VAULT_PATH, vaultPath);

    if (rememberVaultMasterKey && vaultMasterKey && safeStorage.isEncryptionAvailable()) {
      const buffer = safeStorage.encryptString(vaultMasterKey);
      await settings.set(VAULT_MASTER_KEY, buffer.toString(VAULT_MASTER_KEY_ENCODING));
    }

    rememberVaultMasterKey === false && (await settings.unset(VAULT_MASTER_KEY));
    win?.webContents.send(VAULT_READY, vaultPath);
  } catch (error) {
    await settings.unset(VAULT_MASTER_KEY);
    win?.webContents.send(VAULT_SET_WRONG_MASTER_KEY);
  }
};

export const findAndConnectVault = async (
  win: BrowserWindow | null,
  vaultPath?: string,
  vaultMasterKey?: string,
  rememberVaultMasterKey?: boolean
) => {
  if (vaultPath) {
    const fileExists = existsSync(vaultPath);
    if (fileExists && vaultMasterKey) {
      await connectAndSaveVault(win, vaultPath, vaultMasterKey, rememberVaultMasterKey);
    } else if (fileExists && !vaultMasterKey) {
      win?.webContents.send(VAULT_SET_NO_MASTER_KEY, vaultPath);
    } else {
      win?.webContents.send(VAULT_SET_NO_FILE, { dbPath: vaultPath });
    }
  } else {
    win?.webContents.send(VAULT_NOT_SET);
  }
};

export const getVaultFromDeviceSettings = async () => {
  const vaultPath = (await settings.get(VAULT_PATH)) as string | undefined;

  let vaultMasterKey: string | undefined;
  if (safeStorage.isEncryptionAvailable()) {
    const buffer = (await settings.get(VAULT_MASTER_KEY)) as string;
    vaultMasterKey =
      buffer && safeStorage.decryptString(Buffer.from(buffer, VAULT_MASTER_KEY_ENCODING));
  }

  return { vaultPath, vaultMasterKey };
};
