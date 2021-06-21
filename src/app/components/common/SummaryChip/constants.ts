export enum SummaryChipTypeEnum {
  CASH,
  DEBT,
  INVESTMENTS,
  OTHER_ASSETS,
  NET_WORTH,
}

export const getSummaryChipTitle = {
  [SummaryChipTypeEnum.CASH]: 'Cash',
  [SummaryChipTypeEnum.DEBT]: 'Debt',
  [SummaryChipTypeEnum.INVESTMENTS]: 'Investments',
  [SummaryChipTypeEnum.OTHER_ASSETS]: 'Other assets',
  [SummaryChipTypeEnum.NET_WORTH]: 'Net worth',
};
