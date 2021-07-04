import { ipcRenderer } from 'electron';

import { DB_GET_TRANSACTIONS } from '@constants/events';

export default class TransactionIpc {
  static getTransactions() {
    ipcRenderer.send(DB_GET_TRANSACTIONS);
  }
}
