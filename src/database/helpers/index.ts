import { BalancegGroupEnum } from '../../enums/balancegGroup.enum';
import { AssetTypeEnum } from '../../enums/assetType.enum';
import { accountTypes } from '../../constants/accountTypes';

export const getBalanceGroupByAssetType = (assetType: AssetTypeEnum): BalancegGroupEnum => {
    let balanceGroup = BalancegGroupEnum.CASH;
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

    if (cashBalanceGroup.includes(assetType)) balanceGroup = BalancegGroupEnum.CASH;
    if (investmentBalanceGroup.includes(assetType)) balanceGroup = BalancegGroupEnum.INVESTMENT;
    if (otherBalanceGroup.includes(assetType)) balanceGroup = BalancegGroupEnum.OTHER_ASSETS;

    return balanceGroup;
};

export const getBalanceGroupByAccountType = (accountType: string): BalancegGroupEnum => {
  let result: BalancegGroupEnum = BalancegGroupEnum.CASH;

  accountTypes.find(({ balanceGroup, accountTypes }) => {
    const found = accountTypes.find(({ name }) => name === accountType);
    if (found) result = balanceGroup;
  });

  return result;
}
