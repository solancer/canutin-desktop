import { ipcRenderer } from 'electron';

import { DB_NEW_ASSET } from '@constants/events';
import { NewAssetSubmitType } from '../../types/asset.type';

export default class AssetIpc {
  static createAsset(asset: NewAssetSubmitType) {
    ipcRenderer.send(DB_NEW_ASSET, asset);
  }
}
