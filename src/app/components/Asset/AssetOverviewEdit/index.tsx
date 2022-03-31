import React, { useEffect, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import AssetIpc from '@app/data/asset.ipc';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { DB_DELETE_ASSET_ACK } from '@constants/repositories';
import { Asset } from '@database/entities';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EntitiesContext } from '@app/context/entitiesContext';
import { StatusEnum } from '@app/constants/misc';
import { rootRoutesPaths } from '@app/routes';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';
import AssetEditValueForm from '../AssetEditValueForm';
import AssetEditDetailsForm from '../AssetEditDetailsForm';

interface AssetOverviewEditProps {
  asset: Asset;
}

const AssetOverviewEdit = ({ asset }: AssetOverviewEditProps) => {
  const { assetsIndex, setAssetsIndex } = useContext(EntitiesContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.on(DB_DELETE_ASSET_ACK, (_: IpcRendererEvent, { assetId, status, message }) => {
      if (status === EVENT_SUCCESS) {
        history.push(rootRoutesPaths.balance);
        const assets = assetsIndex!.assets.filter(indexedAsset => indexedAsset.id !== assetId);
        setAssetsIndex({ assets, lastUpdate: new Date() });
        setStatusMessage({
          message: 'Asset removed',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message: message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_DELETE_ASSET_ACK);
    };
  }, []);

  const onRemove = () => {
    AssetIpc.deleteAsset(asset.id);
  };

  return asset ? (
    <>
      <Section title="Asset value">
        <AssetEditValueForm asset={asset} />
      </Section>
      <Section title="Asset details">
        <AssetEditDetailsForm asset={asset} />
      </Section>
      <RemoveSection
        confirmationMessage="Are you sure you want to remove this asset?"
        onRemove={onRemove}
        removeMessage={
          <>
            Remove asset <b>{asset.name}</b>
          </>
        }
      />
    </>
  ) : null;
};

export default AssetOverviewEdit;
