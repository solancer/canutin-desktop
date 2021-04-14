import { readFileSync } from 'fs';
import { BrowserWindow } from 'electron';

import { enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { ANALYZE_SOURCE_FILE_ACK, LOAD_FROM_CANUTIN_FILE_ACK } from '@constants/events';
import { CanutinJsonType } from '@appTypes/canutin';
import { importFromCanutinJson } from '@database/helpers/importSource';

import { mintCsvToJson } from './sourceHelpers/mint';

const Papa = require('papaparse');

export const analyzeMintFile = async (filePath: string, win: BrowserWindow | null) => {
  const file = readFileSync(filePath, 'utf8');
  const csv = Papa.parse(file, { header: true });

  if (csv.errors.length > 0) {
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.ERROR,
      sourceData: {},
      metadata: { error: csv.error.type },
    });
  }

  try {
    const { data, metadata } = mintCsvToJson(csv.data);

    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.SUCCESS,
      sourceData: data,
      metadata,
    });
  } catch (error) {
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.ERROR,
      sourceData: {},
    });
  }
};

export const importSourceData = async (
  win: BrowserWindow | null,
  source: enumImportTitleOptions,
  filePath: string
) => {
  switch (source) {
    case enumImportTitleOptions.MINT_IMPORT_TYPE_TITLE: {
      await analyzeMintFile(filePath, win);
    }
  }
};

export const loadFromCanutinFile = async (
  win: BrowserWindow | null,
  canutinFile: CanutinJsonType
) => {
  try {
    await importFromCanutinJson(canutinFile)

    win?.webContents.send(LOAD_FROM_CANUTIN_FILE_ACK, {
      status: StatusEnum.SUCCESS,
    });
  } catch (error) {
    win?.webContents.send(LOAD_FROM_CANUTIN_FILE_ACK, {
      status: StatusEnum.ERROR,
    });
  }

};
