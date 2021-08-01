import { ipcRenderer } from 'electron';

import { DB_GET_TRANSACTIONS, DB_NEW_TRANSACTION, FILTER_TRANSACTIONS } from '@constants/events';
import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';

export default class TransactionIpc {
  static addTransaction(newTransaction: NewTransactionType) {
    ipcRenderer.send(DB_NEW_TRANSACTION, newTransaction);
  }

  static getTransactions() {
    ipcRenderer.send(DB_GET_TRANSACTIONS);
  }

  static getFilterTransactions(filter: FilterTransactionInterface) {
    ipcRenderer.send(FILTER_TRANSACTIONS, filter);
  }
}
