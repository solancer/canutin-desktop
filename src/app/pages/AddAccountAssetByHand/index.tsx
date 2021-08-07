import React, { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import AddAccountAssetForm from '@components/AccountAsset/AddAccountAssetForm';

import { DB_NEW_ACCOUNT_ACK, DB_NEW_ASSET_ACK } from '@constants/events';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { ACCOUNT, StatusEnum } from '@appConstants/misc';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';

const AddAccountAssetByHand = () => {
  const { setIsDbEmpty } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const [formSubtitle, setFormSubtitle] = useState('Choose Type');

  useEffect(() => {
    ipcRenderer.on(DB_NEW_ASSET_ACK, (_: IpcRendererEvent, { name }) => {
      setStatusMessage({
        sentiment: StatusEnum.POSITIVE,
        message: (
          <>
            The asset <b>{name}</b> was created successfully
          </>
        ),
        isLoading: false,
      });
      setIsDbEmpty(false);
    });

    ipcRenderer.on(DB_NEW_ACCOUNT_ACK, (_: IpcRendererEvent, { name, status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          sentiment: StatusEnum.POSITIVE,
          message: (
            <>
              The account <b>{name}</b> was created successfully
            </>
          ),
          isLoading: false,
        });
        setIsDbEmpty(false);
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({
          sentiment: StatusEnum.NEGATIVE,
          message: message,
          isLoading: false,
        });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_NEW_ASSET_ACK);
      ipcRenderer.removeAllListeners(DB_NEW_ACCOUNT_ACK);
      setStatusMessage(emptyStatusMessage);
    };
  }, [setStatusMessage]);

  return (
    <ScrollView title="Add by hand" subTitle="Create a new account or asset">
      <Section title={formSubtitle}>
        <AddAccountAssetForm
          onRadioButtonChange={value =>
            setFormSubtitle(value === ACCOUNT ? 'Account details' : 'Asset details')
          }
        />
      </Section>
    </ScrollView>
  );
};

export default AddAccountAssetByHand;
