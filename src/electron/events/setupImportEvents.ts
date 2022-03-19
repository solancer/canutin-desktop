import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';

import {
  IMPORT_SOURCE_FILE,
  IMPORT_SOURCE_FILE_ACK,
  ANALYZE_SOURCE_FILE,
  LOAD_FROM_CANUTIN_FILE,
  LOAD_FROM_OTHER_CSV,
} from '@constants/imports';

import { CanutinFileType, UpdatedAccount } from '@appTypes/canutinFile.type';
import { enumExtensionFiles, enumImportTitleOptions } from '@appConstants/misc';
import {
  importSourceData,
  importUpdatedAccounts,
} from '../../electron/helpers/importSource.helper';
import { importFromCanutinFile } from '@database/helpers/importSource';

const setupImportEvents = async (win: BrowserWindow) => {
  ipcMain.on(IMPORT_SOURCE_FILE, async (_: IpcMainEvent, extension: enumExtensionFiles) => {
    const { filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'Import Source file', extensions: [extension] }],
    });

    if (filePaths.length) {
      win.webContents.send(IMPORT_SOURCE_FILE_ACK, { filePath: filePaths[0] });
    } else {
      win.webContents.send(IMPORT_SOURCE_FILE_ACK, { filePath: undefined });
    }
  });

  ipcMain.on(
    ANALYZE_SOURCE_FILE,
    async (
      _: IpcMainEvent,
      { pathFile, source }: { pathFile: string; source: enumImportTitleOptions }
    ) => {
      await importSourceData(win, source, pathFile);
    }
  );

  ipcMain.on(LOAD_FROM_CANUTIN_FILE, async (_: IpcMainEvent, canutinFile: CanutinFileType) => {
    await importFromCanutinFile(win, canutinFile);
  });

  ipcMain.on(
    LOAD_FROM_OTHER_CSV,
    async (
      _: IpcMainEvent,
      otherCsvPayload: { canutinFile: CanutinFileType; updatedAccounts: UpdatedAccount[] }
    ) => {
      await importFromCanutinFile(win, otherCsvPayload.canutinFile);
      await importUpdatedAccounts(win, otherCsvPayload.updatedAccounts);
    }
  );
};

export default setupImportEvents;
