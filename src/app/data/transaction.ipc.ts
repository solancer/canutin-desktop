import { ipcRenderer } from 'electron';

import { DB_GET_TRANSACTIONS, FILTER_TRANSACTIONS } from '@constants/events';
import { FilterTransactionInterface } from '@appTypes/transaction.type';

export default class TransactionIpc {
  static getTransactions() {
    ipcRenderer.send(DB_GET_TRANSACTIONS);
  }

  static getFilterTransactions(filter: FilterTransactionInterface) {
    ipcRenderer.send(FILTER_TRANSACTIONS, filter);
  }
}
