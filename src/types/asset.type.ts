import { AssetTypeEnum } from '../enums/assetType.enum';

export type NewAssetType = {
  name: string;
  quantity: number;
  cost: number;
  assetType: AssetTypeEnum;
};
