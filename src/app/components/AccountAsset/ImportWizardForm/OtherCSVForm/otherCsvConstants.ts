export type SupportedDateFormatType = 'dd/MM/yyyy' | 'MM/dd/yyyy';

export const SUPPORTED_DATE_FORMAT = ['dd/MM/yyyy', 'MM/dd/yyyy'];

export const SUPPORTED_DATE_FORMAT_OPTIONS = SUPPORTED_DATE_FORMAT.map(dateFormat => ({
  label: dateFormat.toUpperCase(),
  value: dateFormat,
}));

export const NEW_ACCOUNT_VALUE = 'newAccount';
export const NEW_ACCOUNT_GROUPED_OPTION = {
  label: 'New account',
  options: [{ label: 'New account', value: NEW_ACCOUNT_VALUE }],
};
