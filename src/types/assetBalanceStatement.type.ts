import { Asset } from '@database/entities/asset.entity';

export type NewAssetBalanceStatementType = {
  asset: Asset;
  createdAt: Date;
  value: number;
  quantity?: number;
  cost?: number;
};
