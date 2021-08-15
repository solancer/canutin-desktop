import { Asset } from '@database/entities/asset.entity';

export type NewAssetBalanceStatementType = {
  value?: number;
  quantity?: number;
  cost?: number;
  sold: boolean;
  asset: Asset;
};
