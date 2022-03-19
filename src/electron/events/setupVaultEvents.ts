import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';
import { existsSync } from 'fs';

import {
  VAULT_OPEN_SAVE_DIALOG,
  VAULT_OPEN_EXISTING_FILE_DIALOG,
  VAULT_UNLOCK,
} from '@constants/vault';

import { VaultType } from '../../types/vault.type';
import { connectAndSaveVault, findAndConnectVault } from '../helpers/database.helper';

import seedCategories from '@database/seed/seedCategories';
import seedAssetTypes from '@database/seed/seedAssetTypes';
import seedAccountTypes from '@database/seed/seedAccountTypes';
import seedSettings from '@database/seed/seedSettings';

const setupVaultEvents = async (win: BrowserWindow) => {
  ipcMain.handle(VAULT_OPEN_SAVE_DIALOG, async () => {
    const { filePath } = await dialog.showSaveDialog(win, {
      title: 'Canutin',
      defaultPath: '~/Canutin.vault',
      filters: [{ name: 'DatabaseType', extensions: ['vault'] }],
    });

    return filePath;
  });

  ipcMain.handle(VAULT_OPEN_EXISTING_FILE_DIALOG, async () => {
    const { filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'DatabaseType', extensions: ['vault'] }],
    });

    return filePaths[0];
  });

  ipcMain.on(VAULT_UNLOCK, async (_: IpcMainEvent, vault: VaultType) => {
    const { vaultPath, vaultMasterKey, rememberVaultMasterKey } = vault;

    if (existsSync(vaultPath)) {
      await findAndConnectVault(win, vaultPath, vaultMasterKey, rememberVaultMasterKey);
    } else {
      await connectAndSaveVault(win, vaultPath, vaultMasterKey, rememberVaultMasterKey);
      await seedSettings();
      await seedAccountTypes();
      await seedAssetTypes();
      await seedCategories();
    }
  });
};

export default setupVaultEvents;
