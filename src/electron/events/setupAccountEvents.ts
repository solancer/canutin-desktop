import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { QueryFailedError } from 'typeorm';

import {
  DB_NEW_ACCOUNT,
  DB_NEW_ACCOUNT_ACK,
  DB_GET_ACCOUNTS,
  DB_GET_ACCOUNTS_ACK,
  DB_GET_ACCOUNT_ACK,
  DB_GET_BALANCE_STATEMENTS,
  DB_GET_BALANCE_STATEMENTS_ACK,
  DB_EDIT_ACCOUNT_BALANCE,
  DB_EDIT_ACCOUNT_BALANCE_ACK,
  DB_EDIT_ACCOUNT_DETAILS,
  DB_EDIT_ACCOUNT_DETAILS_ACK,
  DB_DELETE_ACCOUNT,
  DB_DELETE_ACCOUNT_ACK,
} from '@constants/repositories';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import { AccountEditBalanceSubmitType, AccountEditDetailsSubmitType } from '@appTypes/account.type';
import { AccountBalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';
import { AccountRepository } from '@database/repositories/account.repository';
import { NewAccountType } from '@appTypes/account.type';
import { getBudgets } from './setupBudgetEvents';

export const getAccounts = async (win: BrowserWindow) => {
  const accounts = await AccountRepository.getAccounts();
  win.webContents.send(DB_GET_ACCOUNTS_ACK, accounts);
};

export const getAccount = async (win: BrowserWindow, accountId: number) => {
  const account = await AccountRepository.getAccountById(accountId);
  win.webContents.send(DB_GET_ACCOUNT_ACK, account);
};

const setupAccountEvents = async (win: BrowserWindow) => {
  ipcMain.on(DB_NEW_ACCOUNT, async (_: IpcMainEvent, account: NewAccountType) => {
    try {
      const newAccount = await AccountRepository.createAccount(account);
      win.webContents.send(DB_NEW_ACCOUNT_ACK, { ...newAccount, status: EVENT_SUCCESS });
      await getAccounts(win);
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
    await getAccounts(win);
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
        await getAccount(win, accountBalance.accountId);
        await getBudgets(win);
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
        const account = await AccountRepository.editDetails(accountDetails);
        win.webContents.send(DB_EDIT_ACCOUNT_DETAILS_ACK, {
          ...account,
          status: EVENT_SUCCESS,
        });
        await getAccount(win, account.id);
        await getBudgets(win);
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
      win.webContents.send(DB_DELETE_ACCOUNT_ACK, { accountId, status: EVENT_SUCCESS });
      await getBudgets(win);
    } catch (e) {
      win.webContents.send(DB_DELETE_ACCOUNT_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });
};

export default setupAccountEvents;
