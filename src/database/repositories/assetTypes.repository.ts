import { getRepository } from 'typeorm';

import { AssetType } from '../entities';
import { NewAssetTypeType } from '../../types/assetType.type';

export class AssetTypeRepository {
  static async createAssetType(assetType: NewAssetTypeType): Promise<AssetType> {
    return await getRepository<AssetType>(AssetType).save(new AssetType(assetType.name));
  }

  static async createOrGetAssetType(assetType: NewAssetTypeType): Promise<AssetType> {
    const accountTypeDb = await getRepository<AssetType>(AssetType).findOne({
      where: { name: assetType.name },
    });

    if (!accountTypeDb) {
      const otherAssetsType = await getRepository<AssetType>(AssetType).findOne({
        where: { name: 'other' },
      });

      return otherAssetsType as AssetType;
    }

    return accountTypeDb;
  }
}
