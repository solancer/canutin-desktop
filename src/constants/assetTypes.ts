import { AssetTypeEnum } from '../enums/assetType.enum';
import { BalanceGroupEnum, balanceGroupLabels } from '../enums/balanceGroup.enum';

const titelizeAssetType = (label: string) => {
  return label.charAt(0).toUpperCase() + label.slice(1); // Makes the first character uppercase
};

export const assetTypes = [
  {
    balanceGroup: BalanceGroupEnum.CASH,
    assetTypes: [
      {
        label: titelizeAssetType(AssetTypeEnum.CASH),
        value: AssetTypeEnum.CASH,
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.INVESTMENTS,
    assetTypes: [
      {
        label: titelizeAssetType(AssetTypeEnum.SECURITY),
        value: AssetTypeEnum.SECURITY,
      },
      {
        label: titelizeAssetType(AssetTypeEnum.CRYPTOCURRENCY),
        value: AssetTypeEnum.CRYPTOCURRENCY,
      },
    ],
  },
  {
    balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
    assetTypes: [
      {
        label: titelizeAssetType(AssetTypeEnum.COLLECTIBLE),
        value: AssetTypeEnum.COLLECTIBLE,
      },
      {
        label: titelizeAssetType(AssetTypeEnum.PRECIOUS_METAL),
        value: AssetTypeEnum.PRECIOUS_METAL,
      },
      {
        label: titelizeAssetType(AssetTypeEnum.VEHICLE),
        value: AssetTypeEnum.VEHICLE,
      },
      {
        label: titelizeAssetType(AssetTypeEnum.REAL_STATE),
        value: AssetTypeEnum.REAL_STATE,
      },
      {
        label: titelizeAssetType(AssetTypeEnum.BUSINESS),
        value: AssetTypeEnum.BUSINESS,
      },
      {
        label: titelizeAssetType(AssetTypeEnum.OTHER),
        value: AssetTypeEnum.OTHER,
      },
    ],
  },
];

export const assetTypesWithSymbol = [
  AssetTypeEnum.CRYPTOCURRENCY,
  AssetTypeEnum.PRECIOUS_METAL,
  AssetTypeEnum.SECURITY,
];

export const assetTypesValues = assetTypes.map(({ balanceGroup, assetTypes }) => ({
  options: assetTypes,
  label: balanceGroupLabels[balanceGroup],
}));
