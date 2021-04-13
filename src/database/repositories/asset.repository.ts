import { getRepository } from 'typeorm';

import { Asset, AssetType } from '../entities';
import { NewAssetType } from '../../types/asset.type';

export class AssetRepository {
  static async createAsset(asset: NewAssetType): Promise<Asset> {
    return await getRepository<Asset>(Asset).save(
      new Asset(
        asset.name,
        asset.quantity,
        asset.cost,
        new AssetType(asset.assetType),
        asset.account
      )
    );
  }
}
