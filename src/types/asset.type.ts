import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { AssetTypeEnum } from '../enums/assetType.enum';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';
import { CanutinFileAssetBalanceStatementType } from '@appTypes/canutinFile.type';

export type NewAssetType = {
  name: string;
  balanceGroup: BalanceGroupEnum;
  assetType: AssetTypeEnum;
  sold: boolean;
  symbol?: string;
  balanceStatements?: NewAssetBalanceStatementType[] | CanutinFileAssetBalanceStatementType[];
};

export type AssetEditValueSubmitType = {
  quantity?: number;
  cost?: number;
  value: number;
  sold: boolean;
  assetId: number;
};

export type AssetEditDetailsSubmitType = {
  assetType: string;
  balanceGroup: number;
  name: string;
  symbol?: string;
  assetId: number;
};

export type AddNewAssetType = AssetEditDetailsSubmitType & AssetEditValueSubmitType;
