import { AssetTypeRepository } from '../repositories/assetTypes.repository';

import { assetTypes } from '@constants/assetTypes';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { AssetType } from '@database/entities';

const seedAssetTypes = async () => {
  assetTypes.forEach(async ({ assetTypes }) => {
    const newAccountTypes = assetTypes.map(({ value }) => {
      return new AssetType(value as AssetTypeEnum);
    });

    await AssetTypeRepository.createAssetTypes(newAccountTypes);
  });
};

export default seedAssetTypes;
