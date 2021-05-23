import { readFileSync } from 'fs';
import { BrowserWindow } from 'electron';

import { enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { ANALYZE_SOURCE_FILE_ACK, LOAD_FROM_CANUTIN_FILE_ACK, LOAD_FROM_OTHER_CSV_ACK } from '@constants/events';
import { CanutinJsonType, UpdatedAccount } from '@appTypes/canutin';
import { ParseResult } from '@appTypes/parseCsv';
import { importFromCanutinJson, updateAccounts } from '@database/helpers/importSource';

import { mintCsvToJson, MintCsvEntryType } from './sourceHelpers/mint';
import {
  personalCapitalCsvToJson,
  PersonalCapitalCsvEntryType,
} from './sourceHelpers/personalCapital';

const Papa = require('papaparse');

export const readCsv = (
  filePath: string,
  win: BrowserWindow | null
): ParseResult<MintCsvEntryType[] | PersonalCapitalCsvEntryType[]> | null => {
  const file = readFileSync(filePath, 'utf8');
  const csv = Papa.parse(file, { header: true, skipEmptyLines: true });

  if (csv.errors.length > 0) {
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.ERROR,
      sourceData: {},
      metadata: { error: csv.error?.type },
    });

    return null;
  }

  return csv;
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

  if (csvData?.data) {
    try {
      const { data, metadata } = mintCsvToJson((csvData.data as unknown) as MintCsvEntryType[]);

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

  if (csvData?.data) {
    try {
      const { data, metadata } = personalCapitalCsvToJson(
        (csvData.data as unknown) as PersonalCapitalCsvEntryType[]
      );

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

export const analyzeOtherCSVFile = async (filePath: string, win: BrowserWindow | null) => {
  const csvData = readCsv(filePath, win);

  if (csvData?.data) {
    try {
      win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
        status: StatusEnum.SUCCESS,
        sourceData: csvData.data,
        metadata: csvData.meta,
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
    case enumImportTitleOptions.OTHER_CSV_IMPORT_TYPE_TITLE: {
      await analyzeOtherCSVFile(filePath, win);
      break;
    }
  }
};

export const loadFromCanutinFile = async (
  win: BrowserWindow | null,
  canutinFile: CanutinJsonType
) => {
  try {
    await importFromCanutinJson(canutinFile, win);

    win?.webContents.send(LOAD_FROM_CANUTIN_FILE_ACK, {
      status: StatusEnum.SUCCESS,
    });
  } catch (error) {
    win?.webContents.send(LOAD_FROM_CANUTIN_FILE_ACK, {
      status: StatusEnum.ERROR,
    });
  }
};

export const importUpdatedAccounts = async (
  win: BrowserWindow | null,
  updatedAccounts?: UpdatedAccount[]
) => {
  try {
    if (updatedAccounts) {
      await updateAccounts(updatedAccounts);
    }
    win?.webContents.send(LOAD_FROM_OTHER_CSV_ACK, {
      status: StatusEnum.SUCCESS,
    });
  } catch (error) {
    win?.webContents.send(LOAD_FROM_OTHER_CSV_ACK, {
      status: StatusEnum.ERROR,
    });
  }
};