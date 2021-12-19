import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { AssetTypeEnum } from '@enums/assetType.enum';

export const assetSecurityTeslaDetails = {
  name: 'Tesla',
  balanceGroup: BalanceGroupEnum.INVESTMENTS,
  assetType: AssetTypeEnum.SECURITY,
  sold: false,
  symbol: 'TSLA',
};

export const assetSecurityGamestopDetails = {
  name: 'GameStop',
  balanceGroup: BalanceGroupEnum.INVESTMENTS,
  assetType: AssetTypeEnum.SECURITY,
  sold: false,
  symbol: 'GME',
};

export const assetCryptoBitcoinDetails = {
  name: 'Bitcoin',
  balanceGroup: BalanceGroupEnum.INVESTMENTS,
  assetType: AssetTypeEnum.CRYPTOCURRENCY,
  sold: false,
  symbol: 'BTC',
};

export const assetCryptoEthereumDetails = {
  name: 'Ethereum',
  balanceGroup: BalanceGroupEnum.INVESTMENTS,
  assetType: AssetTypeEnum.CRYPTOCURRENCY,
  sold: false,
  symbol: 'ETH',
};

export const assetCollectibleDetails = {
  name: 'Pokemon Card Collection',
  balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
  assetType: AssetTypeEnum.COLLECTIBLE,
  sold: false,
};

export const assetVehicleDetails = {
  name: `${new Date().getFullYear()} Toyota RAV4`,
  balanceGroup: BalanceGroupEnum.OTHER_ASSETS,
  assetType: AssetTypeEnum.VEHICLE,
  sold: false,
};
