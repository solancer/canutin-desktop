import { ipcRenderer } from 'electron';

import { DB_GET_BALANCE_STATEMENTS } from '@constants/repositories';

export default class BalanceStatementsIpc {
  static getBalanceStatements() {
    ipcRenderer.send(DB_GET_BALANCE_STATEMENTS);
  }
}
