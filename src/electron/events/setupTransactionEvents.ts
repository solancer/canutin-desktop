import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { QueryFailedError } from 'typeorm';

import {
  DB_NEW_TRANSACTION,
  DB_NEW_TRANSACTION_ACK,
  DB_EDIT_TRANSACTION,
  DB_EDIT_TRANSACTION_ACK,
  DB_DELETE_TRANSACTION,
  DB_DELETE_TRANSACTION_ACK,
  DB_GET_TRANSACTION_CATEGORY,
  DB_GET_TRANSACTION_CATEGORY_ACK,
  FILTER_TRANSACTIONS,
} from '@constants/repositories';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';

import { getAccount } from './setupAccountEvents';
import { getBudgets } from './setupBudgetEvents';
import { CategoryRepository } from '@database/repositories/category.repository';
import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { filterTransactions } from '../../electron/helpers/transactionHelpers/transaction.helper';

const setupTransactionEvents = async (win: BrowserWindow) => {
  ipcMain.on(FILTER_TRANSACTIONS, async (_: IpcMainEvent, filter: FilterTransactionInterface) => {
    await filterTransactions(win, filter);
  });

  ipcMain.on(DB_NEW_TRANSACTION, async (_: IpcMainEvent, transaction: NewTransactionType) => {
    try {
      const newTransaction = await TransactionRepository.createTransaction(transaction);
      win.webContents.send(DB_NEW_TRANSACTION_ACK, { ...newTransaction, status: EVENT_SUCCESS });
      await getAccount(win, transaction.accountId);
      await getBudgets(win);
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
      await getAccount(win, transaction.accountId);
      await getBudgets(win);
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
        await getAccount(win, accountId);
        await getBudgets(win);
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
};

export default setupTransactionEvents;
