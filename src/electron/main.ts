import 'reflect-metadata';
import settings from 'electron-settings';
import { QueryFailedError } from 'typeorm';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, nativeTheme, screen } from 'electron';
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
  DB_GET_ASSETS,
  DB_GET_ASSETS_ACK,
  DB_GET_BALANCE_STATEMENTS,
  DB_GET_BALANCE_STATEMENTS_ACK,
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE,
  LOAD_FROM_CANUTIN_FILE,
  LOAD_FROM_OTHER_CSV,
  DB_GET_TRANSACTIONS,
  DB_GET_TRANSACTIONS_ACK,
  DB_NEW_TRANSACTION,
  DB_NEW_TRANSACTION_ACK,
  DB_EDIT_TRANSACTION,
  DB_EDIT_TRANSACTION_ACK,
  DB_DELETE_TRANSACTION,
  DB_DELETE_TRANSACTION_ACK,
  DB_EDIT_ACCOUNT_BALANCE,
  DB_EDIT_ACCOUNT_BALANCE_ACK,
  DB_EDIT_ACCOUNT_DETAILS,
  DB_EDIT_ACCOUNT_DETAILS_ACK,
  DB_GET_ACCOUNT,
  DB_GET_ACCOUNT_ACK,
  FILTER_TRANSACTIONS,
  WINDOW_CONTROL,
  DB_DELETE_ACCOUNT,
  DB_DELETE_ACCOUNT_ACK,
  DB_DELETE_ASSET,
  DB_GET_ASSET,
  DB_DELETE_ASSET_ACK,
  DB_GET_ASSET_ACK,
  DB_EDIT_ASSET_VALUE,
  DB_EDIT_ASSET_VALUE_ACK,
  DB_EDIT_ASSET_DETAILS,
  DB_EDIT_ASSET_DETAILS_ACK,
} from '@constants/events';
import { DATABASE_PATH, NEW_DATABASE } from '@constants';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import { CanutinFileType, UpdatedAccount } from '@appTypes/canutin';
import { enumExtensionFiles, enumImportTitleOptions, WindowControlEnum } from '@appConstants/misc';
import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';
import { AccountEditBalanceSubmitType, AccountEditDetailsSubmitType } from '@appTypes/account.type';

import {
  DID_FINISH_LOADING,
  ELECTRON_ACTIVATE,
  ELECTRON_READY,
  ELECTRON_WINDOW_CLOSED,
} from './constants';
import { connectAndSaveDB, findAndConnectDB } from './helpers/database.helper';
import { filterTransactions } from './helpers/transactionHelpers/transaction.helper';
import {
  importSourceData,
  loadFromCanutinFile,
  importUpdatedAccounts,
} from './helpers/importSource.helper';
import {
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
  calculateWindowWidth,
  calculateWindowHeight,
} from './helpers/window.helpers';
import { AssetRepository } from '@database/repositories/asset.repository';
import { BalanceStatementRepository } from '@database/repositories/balanceStatement.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import seedCategories from '@database/seed/seedCategories';
import seedAssetTypes from '@database/seed/seedAssetTypes';
import seedAccountTypes from '@database/seed/seedAccountTypes';
import { AccountRepository } from '@database/repositories/account.repository';
import {
  AssetEditDetailsSubmitType,
  AssetEditValueSubmitType,
  NewAssetType,
} from '../types/asset.type';
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
      await seedAssetTypes();
      await seedAccountTypes();
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

  ipcMain.on(LOAD_FROM_CANUTIN_FILE, async (_: IpcMainEvent, canutinFile: CanutinFileType) => {
    await loadFromCanutinFile(win, canutinFile);
  });

  ipcMain.on(
    LOAD_FROM_OTHER_CSV,
    async (
      _: IpcMainEvent,
      otherCsvPayload: { canutinFile: CanutinFileType; updatedAccounts: UpdatedAccount[] }
    ) => {
      await loadFromCanutinFile(win, otherCsvPayload.canutinFile);
      await importUpdatedAccounts(win, otherCsvPayload.updatedAccounts);
    }
  );

  ipcMain.on(FILTER_TRANSACTIONS, async (_: IpcMainEvent, filter: FilterTransactionInterface) => {
    await filterTransactions(win, filter);
  });
};

const setupDbEvents = async () => {
  ipcMain.on(DB_NEW_ASSET, async (_: IpcMainEvent, asset: NewAssetType) => {
    try {
      const newAsset = await AssetRepository.createAsset(asset);
      win?.webContents.send(DB_NEW_ASSET_ACK, { ...newAsset, status: EVENT_SUCCESS });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win?.webContents.send(DB_NEW_ASSET_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an asset with this name, please try a different one',
        });
      } else {
        win?.webContents.send(DB_NEW_ASSET_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_NEW_ACCOUNT, async (_: IpcMainEvent, account: NewAccountType) => {
    try {
      const newAccount = await AccountRepository.createAccount(account);
      win?.webContents.send(DB_NEW_ACCOUNT_ACK, { ...newAccount, status: EVENT_SUCCESS });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win?.webContents.send(DB_NEW_ACCOUNT_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an account with this name, please try a different one',
        });
      } else {
        win?.webContents.send(DB_NEW_ACCOUNT_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_GET_BALANCE_STATEMENTS, async (_: IpcMainEvent) => {
    const balanceStatements = await BalanceStatementRepository.getBalanceStatements();
    win?.webContents.send(DB_GET_BALANCE_STATEMENTS_ACK, balanceStatements);
  });

  ipcMain.on(DB_GET_ACCOUNTS, async (_: IpcMainEvent) => {
    const accounts = await AccountRepository.getAccounts();
    win?.webContents.send(DB_GET_ACCOUNTS_ACK, accounts);
  });

  ipcMain.on(DB_GET_ASSETS, async (_: IpcMainEvent) => {
    const assets = await AssetRepository.getAssets();
    win?.webContents.send(DB_GET_ASSETS_ACK, assets);
  });

  ipcMain.on(DB_GET_TRANSACTIONS, async (_: IpcMainEvent) => {
    const transactions = await TransactionRepository.getTransactions();
    win?.webContents.send(DB_GET_TRANSACTIONS_ACK, transactions);
  });

  ipcMain.on(DB_NEW_TRANSACTION, async (_: IpcMainEvent, transaction: NewTransactionType) => {
    try {
      const newTransaction = await TransactionRepository.createTransaction(transaction);
      win?.webContents.send(DB_NEW_TRANSACTION_ACK, { ...newTransaction, status: EVENT_SUCCESS });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win?.webContents.send(DB_NEW_TRANSACTION_ACK, {
          status: EVENT_ERROR,
          message: 'There is already a transaction with this name, please try a different one',
        });
      } else {
        win?.webContents.send(DB_NEW_TRANSACTION_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_EDIT_TRANSACTION, async (_: IpcMainEvent, transaction: NewTransactionType) => {
    try {
      const newTransaction = await TransactionRepository.editTransaction(transaction);
      win?.webContents.send(DB_EDIT_TRANSACTION_ACK, { ...newTransaction, status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_EDIT_TRANSACTION_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_DELETE_TRANSACTION, async (_: IpcMainEvent, transactionId: number) => {
    try {
      await TransactionRepository.deleteTransaction(transactionId);
      win?.webContents.send(DB_DELETE_TRANSACTION_ACK, { status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_DELETE_TRANSACTION_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(
    DB_EDIT_ACCOUNT_BALANCE,
    async (_: IpcMainEvent, accountBalance: AccountEditBalanceSubmitType) => {
      try {
        const newAccount = await AccountRepository.editBalance(accountBalance);
        win?.webContents.send(DB_EDIT_ACCOUNT_BALANCE_ACK, {
          ...newAccount,
          status: EVENT_SUCCESS,
        });
      } catch (e) {
        win?.webContents.send(DB_EDIT_ACCOUNT_BALANCE_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  );

  ipcMain.on(
    DB_EDIT_ACCOUNT_DETAILS,
    async (_: IpcMainEvent, accountDetails: AccountEditDetailsSubmitType) => {
      try {
        const newAccount = await AccountRepository.editDetails(accountDetails);
        win?.webContents.send(DB_EDIT_ACCOUNT_DETAILS_ACK, {
          ...newAccount,
          status: EVENT_SUCCESS,
        });
      } catch (e) {
        win?.webContents.send(DB_EDIT_ACCOUNT_DETAILS_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  );

  ipcMain.on(DB_DELETE_ACCOUNT, async (_: IpcMainEvent, accountId: number) => {
    try {
      await AccountRepository.deleteAccount(accountId);
      win?.webContents.send(DB_DELETE_ACCOUNT_ACK, { status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_DELETE_ACCOUNT_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_GET_ACCOUNT, async (_: IpcMainEvent, accountId: number) => {
    try {
      const account = await AccountRepository.getAccountById(accountId);
      win?.webContents.send(DB_GET_ACCOUNT_ACK, { account, status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_GET_ACCOUNT_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_DELETE_ASSET, async (_: IpcMainEvent, assetId: number) => {
    try {
      await AssetRepository.deleteAsset(assetId);
      win?.webContents.send(DB_DELETE_ASSET_ACK, { status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_DELETE_ASSET_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_GET_ASSET, async (_: IpcMainEvent, assetId: number) => {
    try {
      const asset = await AssetRepository.getAssetById(assetId);
      win?.webContents.send(DB_GET_ASSET_ACK, { asset, status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_GET_ASSET_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_EDIT_ASSET_VALUE, async (_: IpcMainEvent, assetValue: AssetEditValueSubmitType) => {
    try {
      const newAsset = await AssetRepository.editValue(assetValue);
      win?.webContents.send(DB_EDIT_ASSET_VALUE_ACK, { ...newAsset, status: EVENT_SUCCESS });
    } catch (e) {
      win?.webContents.send(DB_EDIT_ASSET_VALUE_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(
    DB_EDIT_ASSET_DETAILS,
    async (_: IpcMainEvent, assetValue: AssetEditDetailsSubmitType) => {
      try {
        const newAsset = await AssetRepository.editDetails(assetValue);
        win?.webContents.send(DB_EDIT_ASSET_DETAILS_ACK, { ...newAsset, status: EVENT_SUCCESS });
      } catch (e) {
        win?.webContents.send(DB_EDIT_ASSET_DETAILS_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an asset with this name, please try a different one',
        });
      }
    }
  );

  ipcMain.on(WINDOW_CONTROL, async (e, action: WindowControlEnum) => {
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
};

const createWindow = async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    width: calculateWindowWidth(width),
    height: calculateWindowHeight(height),
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 32 },
    webPreferences: {
      nodeIntegration: true,
    },
  });

  nativeTheme.themeSource = 'light';

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
