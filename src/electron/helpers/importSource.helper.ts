import { readFileSync } from 'fs';
import { BrowserWindow } from 'electron';

import { enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { ANALYZE_SOURCE_FILE_ACK, LOAD_FROM_CANUTIN_FILE_ACK } from '@constants/events';
import { CanutinJsonType } from '@appTypes/canutin';
import { importFromCanutinJson } from '@database/helpers/importSource';

import { mintCsvToJson, MintCsvEntryType } from './sourceHelpers/mint';
import {
  personalCapitalCsvToJson,
  PersonalCapitalCsvEntryType,
} from './sourceHelpers/personalCapital';

const Papa = require('papaparse');

// eslint-disable-next-line @typescript-eslint/ban-types
export const readCsv = (filePath: string, win: BrowserWindow | null): object | null => {
  const file = readFileSync(filePath, 'utf8');
  const csv = Papa.parse(file, { header: true });

  if (csv.errors.length > 0) {
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.ERROR,
      sourceData: {},
      metadata: { error: csv.error.type },
    });

    return null;
  }

  return csv.data;
};

export const analyzeCanutinFile = async (filePath: string, win: BrowserWindow | null) => {
  const file = readFileSync(filePath, 'utf8');
  try {
    const canutinJson = JSON.parse(file);
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.SUCCESS,
      sourceData: canutinJson,
    });
  } catch (error) {
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.ERROR,
      sourceData: {},
    });
  }
};

export const analyzeMintFile = async (filePath: string, win: BrowserWindow | null) => {
  const csvData = readCsv(filePath, win);

  if (csvData) {
    try {
      const { data, metadata } = mintCsvToJson(csvData as MintCsvEntryType[]);

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
  }
};

export const analyzePersonalCapitalFile = async (filePath: string, win: BrowserWindow | null) => {
  const csvData = readCsv(filePath, win);

  if (csvData) {
    try {
      const { data, metadata } = personalCapitalCsvToJson(csvData as PersonalCapitalCsvEntryType[]);

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
      break;
    }
    case enumImportTitleOptions.CANUTIN_IMPORT_TYPE_TITLE: {
      await analyzeCanutinFile(filePath, win);
      break;
    }
    case enumImportTitleOptions.PERSONAL_CAPITAL_IMPORT_TYPE_TITLE: {
      await analyzePersonalCapitalFile(filePath, win);
      break;
    }
  }
};

export const loadFromCanutinFile = async (
  win: BrowserWindow | null,
  canutinFile: CanutinJsonType
) => {
  try {
    await importFromCanutinJson(canutinFile);

    win?.webContents.send(LOAD_FROM_CANUTIN_FILE_ACK, {
      status: StatusEnum.SUCCESS,
    });
  } catch (error) {
    win?.webContents.send(LOAD_FROM_CANUTIN_FILE_ACK, {
      status: StatusEnum.ERROR,
    });
  }
};
