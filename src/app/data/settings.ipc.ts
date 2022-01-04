import { ipcRenderer } from 'electron';

import { DB_GET_SETTINGS, DB_EDIT_SETTINGS } from '@constants/events';

export default class SettingsIpc {
  static getSettings() {
    ipcRenderer.send(DB_GET_SETTINGS);
  }

  static editSettings() {
    ipcRenderer.send(DB_EDIT_SETTINGS);
  }
}
