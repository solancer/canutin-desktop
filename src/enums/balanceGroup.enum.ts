import { CardAppearanceEnum } from '@components/common/Card';

export enum BalanceGroupEnum {
  CASH,
  DEBT,
  INVESTMENTS,
  OTHER_ASSETS,
  NET_WORTH,
}

export const balanceGroupLabels = {
  [BalanceGroupEnum.CASH]: 'Cash',
  [BalanceGroupEnum.DEBT]: 'Debt',
  [BalanceGroupEnum.INVESTMENTS]: 'Investments',
  [BalanceGroupEnum.OTHER_ASSETS]: 'Other assets',
  [BalanceGroupEnum.NET_WORTH]: 'Net worth',
};

export const balanceGroupApperances = {
  [BalanceGroupEnum.CASH]: CardAppearanceEnum.CASH,
  [BalanceGroupEnum.DEBT]: CardAppearanceEnum.DEBT,
  [BalanceGroupEnum.INVESTMENTS]: CardAppearanceEnum.INVESTMENTS,
  [BalanceGroupEnum.OTHER_ASSETS]: CardAppearanceEnum.OTHER_ASSETS,
  [BalanceGroupEnum.NET_WORTH]: CardAppearanceEnum.NET_WORTH,
};

export const balanceGroupOptions = Object.keys(balanceGroupLabels).map(balanceKey => ({
  value: balanceKey,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  label: balanceGroupLabels[balanceKey],
}));
