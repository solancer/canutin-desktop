import { BalanceGroupEnum } from '../../enums/balancegGroup.enum';
import { AssetTypeEnum } from '../../enums/assetType.enum';
import { accountTypes } from '../../constants/accountTypes';

export const getBalanceGroupByAssetType = (assetType: AssetTypeEnum): BalanceGroupEnum => {
    let balanceGroup = BalanceGroupEnum.CASH;
    const cashBalanceGroup = [AssetTypeEnum.CASH];
    const investmentBalanceGroup = [AssetTypeEnum.SECURITY, AssetTypeEnum.CRYPTOCURRENCY];
    const otherBalanceGroup = [
      AssetTypeEnum.COLLECTIBLE,
      AssetTypeEnum.PRECIOUS_METAL,
      AssetTypeEnum.VEHICLE,
      AssetTypeEnum.REAL_STATE,
      AssetTypeEnum.BUSINESS,
      AssetTypeEnum.OTHER,
    ];

    if (cashBalanceGroup.includes(assetType)) balanceGroup = BalanceGroupEnum.CASH;
    if (investmentBalanceGroup.includes(assetType)) balanceGroup = BalanceGroupEnum.INVESTMENT;
    if (otherBalanceGroup.includes(assetType)) balanceGroup = BalanceGroupEnum.OTHER_ASSETS;

    return balanceGroup;
};

export const getBalanceGroupByAccountType = (accountType: string): BalanceGroupEnum => {
  let result: BalanceGroupEnum = BalanceGroupEnum.CASH;

  accountTypes.find(({ balanceGroup, accountTypes }) => {
    const found = accountTypes.find(({ value }) => value === accountType);
    if (found) result = balanceGroup;
  });

  return result;
}
