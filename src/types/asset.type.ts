import { Account } from '@database/entities';
import { AssetTypeEnum } from '../enums/assetType.enum';

export type NewAssetType = {
  name: string;
  quantity: number;
  cost: number;
  assetType: AssetTypeEnum;
  account?: Account;
};


export type NewAssetSubmitType = {
  name: string;
  quantity: number;
  cost: number;
  assetType: AssetTypeEnum;
  account?: string;
}