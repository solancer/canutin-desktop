export enum BalanceGroupCardTypeEnum {
  CASH,
  DEBT,
  INVESTMENTS,
  OTHER_ASSETS,
  NET_WORTH,
}

export const getBalanceGroupCardTitle = {
  [BalanceGroupCardTypeEnum.CASH]: 'Cash',
  [BalanceGroupCardTypeEnum.DEBT]: 'Debt',
  [BalanceGroupCardTypeEnum.INVESTMENTS]: 'Investments',
  [BalanceGroupCardTypeEnum.OTHER_ASSETS]: 'Other assets',
  [BalanceGroupCardTypeEnum.NET_WORTH]: 'Net worth',
};
