import { readFileSync } from 'fs';
import { BrowserWindow } from 'electron';

import { enumImportTitleOptions, StatusEnum } from '@appConstants/misc';
import { ANALYZE_SOURCE_FILE_ACK, LOAD_DATA_ACK } from '@constants/events';
import {
  UpdatedAccount,
  CanutinFileAccountType,
  CanutinFileAssetType,
} from '@appTypes/canutinFile.type';
import { ParseResult } from '@appTypes/parseCsv';
import { CanutinFileTransactionType } from '@appTypes/canutinFile.type';
import { updateAccounts } from '@database/helpers/importSource';

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
      status: StatusEnum.NEGATIVE,
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
    const canutinFile = JSON.parse(file);

    // Validate accounts from CanutinFile
    const hasAccounts = canutinFile?.accounts?.length > 0;
    const hasAccountsRequiredProps = canutinFile?.accounts?.every(
      (account: CanutinFileAccountType) => {
        const { name, balanceGroup, accountType, autoCalculated, closed } = account;
        return (
          typeof name === 'string' &&
          typeof balanceGroup === 'string' &&
          typeof accountType === 'string' &&
          typeof autoCalculated === 'boolean' &&
          typeof closed === 'boolean'
        );
      }
    );

    // Validate assets in CanutinFile
    const hasAssets = canutinFile?.assets?.length > 0;
    const hasAssetsRequiredProps = canutinFile?.assets?.every((asset: CanutinFileAssetType) => {
      const { name, balanceGroup, assetType, sold } = asset;
      return (
        typeof name === 'string' &&
        typeof balanceGroup === 'string' &&
        typeof assetType === 'string' &&
        typeof sold === 'boolean'
      );
    });

    if ((hasAccounts && hasAccountsRequiredProps) || (hasAssets && hasAssetsRequiredProps)) {
      const countAccounts = canutinFile?.accounts?.length;
      const countAssets = canutinFile?.assets?.length;
      const countTransactions = canutinFile?.accounts?.reduce(
        (countTransactions: number, account: { transactions: CanutinFileTransactionType[] }) => {
          if (account?.transactions) {
            return countTransactions + account.transactions.length;
          }

          return countTransactions;
        },
        0
      );

      win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
        status: StatusEnum.POSITIVE,
        sourceData: canutinFile,
        metadata: {
          countAccounts,
          countTransactions,
          countAssets,
        },
      });
    } else {
      throw Error; // Json file is not supported
    }
  } catch (error) {
    win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
      status: StatusEnum.NEGATIVE,
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
        status: StatusEnum.POSITIVE,
        sourceData: data,
        metadata,
      });
    } catch (error) {
      win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
        status: StatusEnum.NEGATIVE,
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
        status: StatusEnum.POSITIVE,
        sourceData: data,
        metadata,
      });
    } catch (error) {
      win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
        status: StatusEnum.NEGATIVE,
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
        status: StatusEnum.POSITIVE,
        sourceData: csvData.data,
        metadata: csvData.meta,
      });
    } catch (error) {
      win?.webContents.send(ANALYZE_SOURCE_FILE_ACK, {
        status: StatusEnum.NEGATIVE,
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

export const importUpdatedAccounts = async (
  win: BrowserWindow | null,
  updatedAccounts?: UpdatedAccount[]
) => {
  try {
    if (updatedAccounts) {
      await updateAccounts(updatedAccounts);
    }
    win?.webContents.send(LOAD_DATA_ACK, {
      status: StatusEnum.POSITIVE,
    });
  } catch (error) {
    win?.webContents.send(LOAD_DATA_ACK, {
      status: StatusEnum.NEGATIVE,
    });
  }
};
