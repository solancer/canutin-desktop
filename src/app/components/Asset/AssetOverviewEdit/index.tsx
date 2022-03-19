import React, { useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';

import { Asset } from '@database/entities';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import AssetIpc from '@app/data/asset.ipc';
import { StatusEnum } from '@app/constants/misc';
import { DB_GET_ASSET_ACK, DB_DELETE_ASSET_ACK } from '@constants/repositories';
import { rootRoutesPaths } from '@app/routes';

import AssetEditValueForm from '../AssetEditValueForm';
import AssetEditDetailsForm from '../AssetEditDetailsForm';

interface AssetOverviewEditProps {
  temporalAsset: Asset;
}

const AssetOverviewEdit = ({ temporalAsset }: AssetOverviewEditProps) => {
  const [asset, setAsset] = useState<Asset>();
  const { setStatusMessage } = useContext(StatusBarContext);
  const history = useHistory();

  useEffect(() => {
    AssetIpc.getAssetById(temporalAsset.id);

    ipcRenderer.on(DB_GET_ASSET_ACK, (_: IpcRendererEvent, { asset: newAsset }) => {
      setAsset(newAsset);
    });

    ipcRenderer.on(DB_DELETE_ASSET_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'Asset removed',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        history.push(rootRoutesPaths.balance);
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message: message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ASSET_ACK);
      ipcRenderer.removeAllListeners(DB_DELETE_ASSET_ACK);
    };
  }, []);

  const onRemove = () => {
    AssetIpc.deleteAsset(temporalAsset.id);
  };

  return asset ? (
    <>
      <Section title="Asset value">
        <AssetEditValueForm asset={asset} />
      </Section>
      <Section title="Assert details">
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
