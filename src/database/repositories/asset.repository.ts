import { getRepository } from 'typeorm';

import { AssetTypeRepository } from '@database/repositories/assetTypes.repository';

import { Asset } from '../entities';
import { NewAssetType } from '../../types/asset.type';

export class AssetRepository {
  static async createAsset(asset: NewAssetType): Promise<Asset> {
    const assetType = await AssetTypeRepository.createOrGetAssetType({
      name: asset.assetType,
    });

    return await getRepository<Asset>(Asset).save(
      new Asset(asset.name, assetType, undefined, asset.quantity, asset.cost)
    );
  }

  static async getAssets(): Promise<Asset[]> {
    return await getRepository<Asset>(Asset).find({
      relations: ['assetType'],
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }
}
