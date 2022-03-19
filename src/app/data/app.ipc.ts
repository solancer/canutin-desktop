import { ipcRenderer } from 'electron';

import { APP_VERSION, APP_SAFE_STORAGE } from '@constants/app';

export default class AppIpc {
  static getAppVersion() {
    ipcRenderer.send(APP_VERSION);
  }

  static hasAppSecureStorage() {
    ipcRenderer.send(APP_SAFE_STORAGE);
  }
}
