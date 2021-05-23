import { AssetTypeRepository } from '../repositories/assetTypes.repository';

import { assetTypes } from '@constants/assetTypes';
import { AssetTypeEnum } from '@enums/assetType.enum';

const seedAssetTypes = async () => {
  assetTypes.forEach(async ({ assetTypes }) => {
    assetTypes.forEach(async ({ value }) => {
      await AssetTypeRepository.createAssetType({ name: value as AssetTypeEnum });
    });
  });
};

export default seedAssetTypes;
