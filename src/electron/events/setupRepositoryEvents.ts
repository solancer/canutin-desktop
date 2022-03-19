import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { QueryFailedError } from 'typeorm';

import {
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
  DB_NEW_TRANSACTION,
  DB_NEW_TRANSACTION_ACK,
  DB_EDIT_TRANSACTION,
  DB_EDIT_TRANSACTION_ACK,
  DB_DELETE_TRANSACTION,
  DB_DELETE_TRANSACTION_ACK,
  DB_GET_TRANSACTION_CATEGORY,
  DB_GET_TRANSACTION_CATEGORY_ACK,
  DB_EDIT_ACCOUNT_BALANCE,
  DB_EDIT_ACCOUNT_BALANCE_ACK,
  DB_EDIT_ACCOUNT_DETAILS,
  DB_EDIT_ACCOUNT_DETAILS_ACK,
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
  DB_GET_BUDGETS,
  DB_GET_BUDGETS_ACK,
  DB_EDIT_BUDGET_GROUPS,
  DB_EDIT_BUDGET_GROUPS_ACK,
  DB_EDIT_BUDGET_CATEGORY,
  DB_EDIT_BUDGET_CATEGORY_ACK,
  DB_REMOVE_BUDGET_CATEGORY,
  DB_REMOVE_BUDGET_CATEGORY_ACK,
  DB_GET_SETTINGS,
  DB_GET_SETTINGS_ACK,
  FILTER_TRANSACTIONS,
  DB_SEED_VAULT,
  DB_SEED_VAULT_ACK,
} from '@constants/repositories';
import { EVENT_ERROR, EVENT_SUCCESS, EVENT_NEUTRAL } from '@constants/eventStatus';

import { EditBudgetCategorySubmitType } from '@app/components/Budget/TransactionCategoriesForm';
import { CategoryRepository } from '@database/repositories/category.repository';
import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';
import { AccountEditBalanceSubmitType, AccountEditDetailsSubmitType } from '@appTypes/account.type';
import { AccountBalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { EditBudgetType } from '@app/components/Budget/EditBudgetGroups';
import { AccountRepository } from '@database/repositories/account.repository';
import { AssetRepository } from '@database/repositories/asset.repository';
import { BudgetRepository } from '@database/repositories/budget.repository';
import { SettingsRepository } from '@database/repositories/settings.repository';
import {
  AssetEditDetailsSubmitType,
  AssetEditValueSubmitType,
  NewAssetType,
} from '@appTypes/asset.type';
import { NewAccountType } from '@appTypes/account.type';

import seedDemoData from '@database/seed/seedDemoData';
import { filterTransactions } from '../../electron/helpers/transactionHelpers/transaction.helper';

const setupRepositoryEvents = async (win: BrowserWindow) => {
  const getAccounts = async () => {
    const accounts = await AccountRepository.getAccounts();
    win.webContents.send(DB_GET_ACCOUNTS_ACK, accounts);
  };

  const getAssets = async () => {
    const assets = await AssetRepository.getAssets();
    win.webContents.send(DB_GET_ASSETS_ACK, assets);
  };

  const getBudgets = async () => {
    const budgets = await BudgetRepository.getBudgets();
    win.webContents.send(DB_GET_BUDGETS_ACK, budgets);
  };

  const getSettings = async () => {
    const settings = await SettingsRepository.getSettings();
    win.webContents.send(DB_GET_SETTINGS_ACK, settings);
  };

  ipcMain.on(FILTER_TRANSACTIONS, async (_: IpcMainEvent, filter: FilterTransactionInterface) => {
    await filterTransactions(win, filter);
  });

  ipcMain.on(DB_NEW_ASSET, async (_: IpcMainEvent, asset: NewAssetType) => {
    try {
      const newAsset = await AssetRepository.createAsset(asset);
      win.webContents.send(DB_NEW_ASSET_ACK, { ...newAsset, status: EVENT_SUCCESS });
      await getAssets();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win.webContents.send(DB_NEW_ASSET_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an asset with this name, please try a different one',
        });
      } else {
        win.webContents.send(DB_NEW_ASSET_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_NEW_ACCOUNT, async (_: IpcMainEvent, account: NewAccountType) => {
    try {
      const newAccount = await AccountRepository.createAccount(account);
      win.webContents.send(DB_NEW_ACCOUNT_ACK, { ...newAccount, status: EVENT_SUCCESS });
      await getAccounts();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win.webContents.send(DB_NEW_ACCOUNT_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an account with this name, please try a different one',
        });
      } else {
        win.webContents.send(DB_NEW_ACCOUNT_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_GET_BALANCE_STATEMENTS, async (_: IpcMainEvent) => {
    const balanceStatements = await AccountBalanceStatementRepository.getBalanceStatements();
    win.webContents.send(DB_GET_BALANCE_STATEMENTS_ACK, balanceStatements);
  });

  ipcMain.on(DB_GET_ACCOUNTS, async (_: IpcMainEvent) => {
    await getAccounts();
  });

  ipcMain.on(DB_GET_ASSETS, async (_: IpcMainEvent) => {
    await getAssets();
  });

  ipcMain.on(DB_GET_BUDGETS, async (_: IpcMainEvent) => {
    await getBudgets();
  });

  ipcMain.on(DB_EDIT_BUDGET_GROUPS, async (_: IpcMainEvent, editBudgets: EditBudgetType) => {
    try {
      await SettingsRepository.editSettings(
        editBudgets.autoBudgetField === 'Enabled' ? true : false
      );
      await BudgetRepository.editBudgets(editBudgets);
      await getSettings();
      await getBudgets();
      win.webContents.send(DB_EDIT_BUDGET_GROUPS_ACK, { status: EVENT_SUCCESS });
    } catch (e) {
      win.webContents.send(DB_EDIT_BUDGET_GROUPS_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(
    DB_EDIT_BUDGET_CATEGORY,
    async (_: IpcMainEvent, editBudgetCategorySubmit: EditBudgetCategorySubmitType) => {
      try {
        await BudgetRepository.addBudgetCategory(editBudgetCategorySubmit);
        await getBudgets();
        win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, { status: EVENT_SUCCESS });
      } catch (e) {
        if (e instanceof QueryFailedError) {
          win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, {
            status: EVENT_NEUTRAL,
            message: 'The category is already assigned to the budget',
          });
        } else {
          win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, {
            status: EVENT_ERROR,
            message: 'An error occurred, please try again',
          });
        }
      }
    }
  );

  ipcMain.on(
    DB_REMOVE_BUDGET_CATEGORY,
    async (_: IpcMainEvent, editBudgetCategorySubmit: EditBudgetCategorySubmitType) => {
      try {
        await BudgetRepository.removeBudgetCategory(editBudgetCategorySubmit);
        await getBudgets();
        win.webContents.send(DB_REMOVE_BUDGET_CATEGORY_ACK, { status: EVENT_SUCCESS });
      } catch (e) {
        win.webContents.send(DB_EDIT_BUDGET_CATEGORY_ACK, {
          status: EVENT_NEUTRAL,
          message: 'The category is not assigned to any expense group',
        });
      }
    }
  );

  ipcMain.on(DB_GET_SETTINGS, async (_: IpcMainEvent) => {
    await getSettings();
  });

  ipcMain.on(DB_NEW_TRANSACTION, async (_: IpcMainEvent, transaction: NewTransactionType) => {
    try {
      const newTransaction = await TransactionRepository.createTransaction(transaction);
      win.webContents.send(DB_NEW_TRANSACTION_ACK, { ...newTransaction, status: EVENT_SUCCESS });
      await getAccounts();
      await getBudgets();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win.webContents.send(DB_NEW_TRANSACTION_ACK, {
          status: EVENT_ERROR,
          message: 'There is already a transaction with this name, please try a different one',
        });
      } else {
        win.webContents.send(DB_NEW_TRANSACTION_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_EDIT_TRANSACTION, async (_: IpcMainEvent, transaction: NewTransactionType) => {
    try {
      const newTransaction = await TransactionRepository.editTransaction(transaction);
      win.webContents.send(DB_EDIT_TRANSACTION_ACK, { ...newTransaction, status: EVENT_SUCCESS });
      await getAccounts();
      await getBudgets();
    } catch (e) {
      win.webContents.send(DB_EDIT_TRANSACTION_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(
    DB_DELETE_TRANSACTION,
    async (_: IpcMainEvent, accountId: number, transactionId: number) => {
      try {
        await TransactionRepository.deleteTransaction(transactionId);
        win.webContents.send(DB_DELETE_TRANSACTION_ACK, { status: EVENT_SUCCESS });
        await getAccounts();
        await getBudgets();
      } catch (e) {
        win.webContents.send(DB_DELETE_TRANSACTION_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  );

  ipcMain.on(DB_GET_TRANSACTION_CATEGORY, async (_: IpcMainEvent, subCategoryName: string) => {
    const subCategory = await CategoryRepository.getSubCategory(subCategoryName);
    win.webContents.send(DB_GET_TRANSACTION_CATEGORY_ACK, subCategory);
  });

  ipcMain.on(
    DB_EDIT_ACCOUNT_BALANCE,
    async (_: IpcMainEvent, accountBalance: AccountEditBalanceSubmitType) => {
      try {
        const newAccount = await AccountRepository.editBalance(accountBalance);
        win.webContents.send(DB_EDIT_ACCOUNT_BALANCE_ACK, {
          ...newAccount,
          status: EVENT_SUCCESS,
        });
        await getAccounts();
        await getBudgets();
      } catch (e) {
        win.webContents.send(DB_EDIT_ACCOUNT_BALANCE_ACK, {
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
        win.webContents.send(DB_EDIT_ACCOUNT_DETAILS_ACK, {
          ...newAccount,
          status: EVENT_SUCCESS,
        });
        await getAccounts();
        await getBudgets();
      } catch (e) {
        win.webContents.send(DB_EDIT_ACCOUNT_DETAILS_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  );

  ipcMain.on(DB_DELETE_ACCOUNT, async (event: IpcMainEvent, accountId: number) => {
    try {
      await AccountRepository.deleteAccount(accountId);
      win.webContents.send(DB_DELETE_ACCOUNT_ACK, { status: EVENT_SUCCESS });
      await getAccounts();
      await getBudgets();
    } catch (e) {
      win.webContents.send(DB_DELETE_ACCOUNT_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_DELETE_ASSET, async (_: IpcMainEvent, assetId: number) => {
    try {
      await AssetRepository.deleteAsset(assetId);
      win.webContents.send(DB_DELETE_ASSET_ACK, { status: EVENT_SUCCESS });
      await getAssets();
    } catch (e) {
      win.webContents.send(DB_DELETE_ASSET_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_GET_ASSET, async (_: IpcMainEvent, assetId: number) => {
    try {
      const asset = await AssetRepository.getAssetById(assetId);
      win.webContents.send(DB_GET_ASSET_ACK, { asset, status: EVENT_SUCCESS });
    } catch (e) {
      win.webContents.send(DB_GET_ASSET_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(DB_EDIT_ASSET_VALUE, async (_: IpcMainEvent, assetValue: AssetEditValueSubmitType) => {
    try {
      const newAsset = await AssetRepository.editValue(assetValue);
      win.webContents.send(DB_EDIT_ASSET_VALUE_ACK, { ...newAsset, status: EVENT_SUCCESS });
      await getAssets();
    } catch (e) {
      win.webContents.send(DB_EDIT_ASSET_VALUE_ACK, {
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
        win.webContents.send(DB_EDIT_ASSET_DETAILS_ACK, { ...newAsset, status: EVENT_SUCCESS });
        await getAssets();
      } catch (e) {
        win.webContents.send(DB_EDIT_ASSET_DETAILS_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an asset with this name, please try a different one',
        });
      }
    }
  );

  ipcMain.on(DB_SEED_VAULT, async () => {
    await seedDemoData();
    await getAccounts();
    await getAssets();
    await getBudgets();
    win.webContents.send(DB_SEED_VAULT_ACK, { status: EVENT_SUCCESS });
  });
};

export default setupRepositoryEvents;
