import 'reflect-metadata';
import settings from 'electron-settings';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';
import * as path from 'path';

import {
  OPEN_CREATE_VAULT,
  OPEN_EXISTING_VAULT,
  DB_NEW_ACCOUNT,
  DB_NEW_ASSET,
  DB_NEW_ASSET_ACK,
  DB_NEW_ACCOUNT_ACK,
  DB_GET_ACCOUNTS,
  DB_GET_ACCOUNTS_ACK,
  DB_GET_BALANCE_STATEMENTS,
  DB_GET_BALANCE_STATEMENTS_ACK,
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE,
  LOAD_FROM_CANUTIN_FILE,
  LOAD_FROM_OTHER_CSV,
} from '@constants/events';
import { DATABASE_PATH, NEW_DATABASE } from '@constants';
import { CanutinJsonType, UpdatedAccount } from '@appTypes/canutin';
import { enumExtensionFiles, enumImportTitleOptions } from '@appConstants/misc';

import {
  DID_FINISH_LOADING,
  ELECTRON_ACTIVATE,
  ELECTRON_READY,
  ELECTRON_WINDOW_CLOSED,
} from './constants';
import { connectAndSaveDB, findAndConnectDB } from './helpers/database.helper';
import { importSourceData, loadFromCanutinFile, importUpdatedAccounts } from './helpers/importSource.helper';
import { AssetRepository } from '@database/repositories/asset.repository';
import { BalanceStatementRepository } from '@database/repositories/balanceStatement.repository';
import seedCategories from '@database/seed/seedCategories';
import { AccountRepository } from '@database/repositories/account.repository';
import { NewAssetType } from '../types/asset.type';
import { NewAccountType } from '../types/account.type';

let win: BrowserWindow | null = null;

const setupEvents = async () => {
  ipcMain.on(OPEN_CREATE_VAULT, async () => {
    if (win) {
      const { filePath } = await dialog.showSaveDialog(win, {
        filters: [{ name: 'DatabaseType', extensions: ['sqlite'] }],
      });

      if (filePath) await connectAndSaveDB(win, filePath);
      await seedCategories();
      win.webContents.send(NEW_DATABASE);
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

  ipcMain.on(IMPORT_SOURCE_FILE, async (_: IpcMainEvent, extension: enumExtensionFiles) => {
    if (win) {
      const { filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'Import Source file', extensions: [extension] }],
      });

      if (filePaths.length) {
        win.webContents.send(IMPORT_SOURCE_FILE_ACK, { filePath: filePaths[0] });
      } else {
        win.webContents.send(IMPORT_SOURCE_FILE_ACK, { filePath: undefined });
      }
    }
  });

  ipcMain.on(
    ANALYZE_SOURCE_FILE,
    async (
      _: IpcMainEvent,
      { pathFile, source }: { pathFile: string; source: enumImportTitleOptions }
    ) => {
      await importSourceData(win, source, pathFile);
    }
  );

  ipcMain.on(LOAD_FROM_CANUTIN_FILE, async (_: IpcMainEvent, canutinFile: CanutinJsonType) => {
    await loadFromCanutinFile(win, canutinFile);
  });

  ipcMain.on(LOAD_FROM_OTHER_CSV, async (_: IpcMainEvent, otherCsvPayload: { canutinFile: CanutinJsonType , updatedAccounts: UpdatedAccount[] }) => {
    await loadFromCanutinFile(win, otherCsvPayload.canutinFile);
    await importUpdatedAccounts(win, otherCsvPayload.updatedAccounts);
  });
};

const setupDbEvents = async () => {
  ipcMain.on(DB_NEW_ASSET, async (_: IpcMainEvent, asset: NewAssetType) => {
    const newAsset = await AssetRepository.createAsset(asset);
    win?.webContents.send(DB_NEW_ASSET_ACK, newAsset);
  });

  ipcMain.on(DB_NEW_ACCOUNT, async (_: IpcMainEvent, account: NewAccountType) => {
    const newAccount = await AccountRepository.createAccount(account);
    win?.webContents.send(DB_NEW_ACCOUNT_ACK, newAccount);
  });

  ipcMain.on(DB_GET_BALANCE_STATEMENTS, async (_: IpcMainEvent) => {
    const balanceStatements = await BalanceStatementRepository.getBalanceStatements();
    win?.webContents.send(DB_GET_BALANCE_STATEMENTS_ACK, balanceStatements);
  });

  ipcMain.on(DB_GET_ACCOUNTS, async (_: IpcMainEvent) => {
    const accounts = await AccountRepository.getAccounts();
    win?.webContents.send(DB_GET_ACCOUNTS_ACK, accounts);
  });
};

const createWindow = async () => {
  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 880,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 32 },
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    win.loadURL(`file://${__dirname}/../../build/index.html`);
  }

  win.on('closed', () => (win = null));

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }

  await setupEvents();
  await setupDbEvents();

  win.webContents.on(DID_FINISH_LOADING, async () => {
    const dbPath = (await settings.get(DATABASE_PATH)) as string;
    await findAndConnectDB(win, dbPath);
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
