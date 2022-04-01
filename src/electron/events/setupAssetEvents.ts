import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { QueryFailedError } from 'typeorm';

import {
  DB_NEW_ASSET,
  DB_NEW_ASSET_ACK,
  DB_GET_ASSETS,
  DB_GET_ASSETS_ACK,
  DB_DELETE_ASSET,
  DB_GET_ASSET,
  DB_DELETE_ASSET_ACK,
  DB_GET_ASSET_ACK,
  DB_EDIT_ASSET_VALUE,
  DB_EDIT_ASSET_VALUE_ACK,
  DB_EDIT_ASSET_DETAILS,
  DB_EDIT_ASSET_DETAILS_ACK,
} from '@constants/repositories';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';

import { AssetRepository } from '@database/repositories/asset.repository';
import {
  AssetEditDetailsSubmitType,
  AssetEditValueSubmitType,
  NewAssetType,
} from '@appTypes/asset.type';

export const getAssets = async (win: BrowserWindow) => {
  const assets = await AssetRepository.getAssets();
  win.webContents.send(DB_GET_ASSETS_ACK, assets);
};

const getAsset = async (win: BrowserWindow, assetId: number) => {
  const asset = await AssetRepository.getAssetById(assetId);
  win.webContents.send(DB_GET_ASSET_ACK, asset);
};

const setupAssetEvents = async (win: BrowserWindow) => {
  ipcMain.on(DB_GET_ASSETS, async (_: IpcMainEvent) => {
    await getAssets(win);
  });

  ipcMain.on(DB_NEW_ASSET, async (_: IpcMainEvent, asset: NewAssetType) => {
    try {
      const newAsset = await AssetRepository.createAsset(asset);
      win.webContents.send(DB_NEW_ASSET_ACK, { ...newAsset, status: EVENT_SUCCESS });

      await getAssets(win);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        win.webContents.send(DB_NEW_ASSET_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an asset with this name, please try a different one',
        });
      } else {
        win.webContents.send(DB_NEW_ASSET_ACK, {
          status: EVENT_ERROR,
          message: 'An error occurred, please try again',
        });
      }
    }
  });

  ipcMain.on(DB_EDIT_ASSET_VALUE, async (_: IpcMainEvent, assetValue: AssetEditValueSubmitType) => {
    try {
      const newAsset = await AssetRepository.editValue(assetValue);
      win.webContents.send(DB_EDIT_ASSET_VALUE_ACK, { ...newAsset, status: EVENT_SUCCESS });
      await getAsset(win, newAsset.id);
    } catch (e) {
      win.webContents.send(DB_EDIT_ASSET_VALUE_ACK, {
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });

  ipcMain.on(
    DB_EDIT_ASSET_DETAILS,
    async (_: IpcMainEvent, assetValue: AssetEditDetailsSubmitType) => {
      try {
        const newAsset = await AssetRepository.editDetails(assetValue);
        win.webContents.send(DB_EDIT_ASSET_DETAILS_ACK, { ...newAsset, status: EVENT_SUCCESS });
        await getAsset(win, assetValue.assetId);
      } catch (e) {
        win.webContents.send(DB_EDIT_ASSET_DETAILS_ACK, {
          status: EVENT_ERROR,
          message: 'There is already an asset with this name, please try a different one',
        });
      }
    }
  );

  ipcMain.on(DB_DELETE_ASSET, async (_: IpcMainEvent, assetId: number) => {
    try {
      await AssetRepository.deleteAsset(assetId);
      win.webContents.send(DB_DELETE_ASSET_ACK, { assetId, status: EVENT_SUCCESS });
    } catch (e) {
      win.webContents.send(DB_DELETE_ASSET_ACK, {
        assetId,
        status: EVENT_ERROR,
        message: 'An error occurred, please try again',
      });
    }
  });
};

export default setupAssetEvents;
