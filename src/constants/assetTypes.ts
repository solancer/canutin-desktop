import { BalanceGroupEnum } from '../enums/balanceGroup.enum';

export const assetTypes = [
  {
    balanceGroup: BalanceGroupEnum.CASH,
    assetTypes: [
      {
        label: 'Cash',
        value: 'cash',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.INVESTMENT,
    assetTypes: [
      {
        label: 'Security',
        value: 'security',
      },
      {
        label: 'Cryptocurrency',
        value: 'cryptocurrency',
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    assetTypes: [
      {
        label: 'Collectible',
        value: 'collectible',
      },
      {
        label: 'Precious metal',
        value: 'precious metal',
      },
      {
        label: 'Vehicle',
        value: 'vehicle',
      },
      {
        label: 'Real state',
        value: 'real state',
      },
      {
        label: 'Business',
        value: 'business',
      },
      {
        label: 'Other',
        value: 'other',
      },
    ],
  },
];
