export const ACCOUNT = 'Account';
export const ASSET = 'Asset';

// Sources types
export const CANUTIN_IMPORT_TYPE = 'CANUTIN_IMPORT';
export const MINT_IMPORT_TYPE = 'MINT';
export const PERSONAL_CAPITAL_IMPORT_TYPE = 'PERSONAL_CAPITAL';

export enum enumImportTitleOptions {
  CANUTIN_IMPORT_TYPE_TITLE = 'CanutinFile (JSON)',
  MINT_IMPORT_TYPE_TITLE = 'Mint.com (CSV)',
  PERSONAL_CAPITAL_IMPORT_TYPE_TITLE = 'Personal Capital (CSV)',
  OTHER_CSV_IMPORT_TYPE_TITLE = 'Other CSV',
}

export enum enumExtensionFiles {
  CSV = 'csv',
  JSON = 'json',
}

export const IMPORT_OPTIONS = [
  enumImportTitleOptions.CANUTIN_IMPORT_TYPE_TITLE,
  enumImportTitleOptions.MINT_IMPORT_TYPE_TITLE,
  enumImportTitleOptions.PERSONAL_CAPITAL_IMPORT_TYPE_TITLE,
] as enumImportTitleOptions[];

export const sourceExtensionFile = (sourceTitle: enumImportTitleOptions) => {
  switch (sourceTitle) {
    case enumImportTitleOptions.CANUTIN_IMPORT_TYPE_TITLE:
      return enumExtensionFiles.JSON;
    case enumImportTitleOptions.MINT_IMPORT_TYPE_TITLE:
      return enumExtensionFiles.CSV;
    case enumImportTitleOptions.PERSONAL_CAPITAL_IMPORT_TYPE_TITLE:
      return enumExtensionFiles.CSV;
    case enumImportTitleOptions.OTHER_CSV_IMPORT_TYPE_TITLE:
      return enumExtensionFiles.CSV;
    default:
      return null;
  }
};

// General
export enum StatusEnum {
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  WARNING = 'warning',
}
