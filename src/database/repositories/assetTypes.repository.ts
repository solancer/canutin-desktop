import { getRepository } from 'typeorm';

import { AssetType } from '../entities';
import { NewAssetTypeType } from '@appTypes/assetType.type';

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

  static async createAssetTypes(assetTypes: AssetType[]) {
    await getRepository(AssetType)
      .createQueryBuilder()
      .insert()
      .into(AssetType)
      .values(assetTypes)
      .execute();
  }
}
