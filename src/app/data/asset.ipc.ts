import { ipcRenderer } from 'electron';

import {
  DB_NEW_ASSET,
  DB_GET_ASSETS,
  DB_GET_ASSET,
  DB_DELETE_ASSET,
  DB_EDIT_ASSET_DETAILS,
  DB_EDIT_ASSET_VALUE,
} from '@constants/events';
import {
  NewAssetType,
  AssetEditValueSubmitType,
  AssetEditDetailsSubmitType,
} from '../../types/asset.type';

export default class AssetIpc {
  static createAsset(asset: NewAssetType) {
    ipcRenderer.send(DB_NEW_ASSET, asset);
  }

  static getAssets() {
    ipcRenderer.send(DB_GET_ASSETS);
  }

  static getAssetById(assetId: number) {
    ipcRenderer.send(DB_GET_ASSET, assetId);
  }

  static deleteAsset(assetId: number) {
    ipcRenderer.send(DB_DELETE_ASSET, assetId);
  }

  static editValue(editAsset: AssetEditValueSubmitType) {
    ipcRenderer.send(DB_EDIT_ASSET_VALUE, editAsset);
  }

  static editDetails(editDetails: AssetEditDetailsSubmitType) {
    ipcRenderer.send(DB_EDIT_ASSET_DETAILS, editDetails);
  }
}
