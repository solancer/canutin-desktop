import { ipcRenderer } from 'electron';

import {
  DB_NEW_TRANSACTION,
  DB_EDIT_TRANSACTION,
  DB_DELETE_TRANSACTION,
  DB_GET_TRANSACTION_CATEGORY,
  FILTER_TRANSACTIONS,
} from '@constants/events';
import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';

export default class TransactionIpc {
  static addTransaction(newTransaction: NewTransactionType) {
    ipcRenderer.send(DB_NEW_TRANSACTION, newTransaction);
  }

  static editTransaction(newTransaction: NewTransactionType) {
    ipcRenderer.send(DB_EDIT_TRANSACTION, newTransaction);
  }

  static deleteTransaction(accountId: number, transactionId: number) {
    ipcRenderer.send(DB_DELETE_TRANSACTION, accountId, transactionId);
  }

  static getTransactionCategory(categoryName: string) {
    ipcRenderer.send(DB_GET_TRANSACTION_CATEGORY, categoryName);
  }

  static getFilterTransactions(filter: FilterTransactionInterface) {
    ipcRenderer.send(FILTER_TRANSACTIONS, filter);
  }
}
