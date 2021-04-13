import { ipcRenderer } from 'electron';

import { DB_GET_ACCOUNTS, DB_NEW_ACCOUNT } from '@constants/events';
import { NewAccountType } from '../../types/account.type';

export default class AccountIpc {
  static createAccount(account: NewAccountType) {
    ipcRenderer.send(DB_NEW_ACCOUNT, account);
  }

  static getAccounts() {
    ipcRenderer.send(DB_GET_ACCOUNTS);
  }
}
