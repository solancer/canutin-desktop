import { ipcRenderer } from 'electron';

import { DB_NEW_ASSET } from '@constants/events';
import { NewAssetType } from '../../types/asset.type';

export default class AssetIpc {
  static createAsset(asset: NewAssetType) {
    ipcRenderer.send(DB_NEW_ASSET, asset);
  }
}
