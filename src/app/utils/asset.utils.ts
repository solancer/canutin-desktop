import { Asset } from '@database/entities';

import { capitalize } from './strings.utils';

export const getAssetInformationLabel = (asset: Asset) => {
  if (asset.symbol) {
    return `${capitalize(asset.symbol)} / ${capitalize(asset.assetType.name)} / Asset`;
  }

  return `${capitalize(asset.assetType.name)} / Asset`;
};
