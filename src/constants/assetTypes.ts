import { AssetTypeEnum } from '../enums/assetType.enum';
import { BalanceGroupEnum } from '../enums/balanceGroup.enum';

export const assetTypes = [
  {
    balanceGroup: BalanceGroupEnum.CASH,
    assetTypes: [
      {
        label: AssetTypeEnum.CASH,
        value: AssetTypeEnum.CASH.toLowerCase(),
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    assetTypes: [
      {
        label: AssetTypeEnum.SECURITY,
        value: AssetTypeEnum.SECURITY.toLowerCase(),
      },
      {
        label: AssetTypeEnum.CRYPTOCURRENCY,
        value: AssetTypeEnum.CRYPTOCURRENCY.toLowerCase(),
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    assetTypes: [
      {
        label: AssetTypeEnum.COLLECTIBLE,
        value: AssetTypeEnum.COLLECTIBLE.toLowerCase(),
      },
      {
        label: AssetTypeEnum.PRECIOUS_METAL,
        value: AssetTypeEnum.PRECIOUS_METAL.toLowerCase(),
      },
      {
        label: AssetTypeEnum.VEHICLE,
        value: AssetTypeEnum.VEHICLE.toLowerCase(),
      },
      {
        label: AssetTypeEnum.REAL_STATE,
        value: AssetTypeEnum.REAL_STATE.toLowerCase(),
      },
      {
        label: AssetTypeEnum.BUSINESS,
        value: AssetTypeEnum.BUSINESS.toLowerCase(),
      },
      {
        label: AssetTypeEnum.OTHER,
        value: AssetTypeEnum.OTHER.toLowerCase(),
      },
    ],
  },
];

export const assetTypesWithSymbol = [
  AssetTypeEnum.CRYPTOCURRENCY.toLowerCase(),
  AssetTypeEnum.PRECIOUS_METAL.toLowerCase(),
  AssetTypeEnum.SECURITY.toLowerCase(),
];
