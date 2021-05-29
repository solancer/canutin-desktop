import React, { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import AddAccountAssetForm from '@components/AccountAsset/AddAccountAssetForm';
import StatusBar from '@components/common/StatusBar';

import { DB_NEW_ACCOUNT_ACK, DB_NEW_ASSET_ACK } from '@constants/events';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { ACCOUNT } from '@appConstants/misc';
import { StatusBarContext } from '@app/context';

const SUCCESS_MESSAGE_TIMEOUT = 5000;

const AddAccountAssetByHand = () => {
  const [formSubtitle, setFormSubtitle] = useState('Choose Type');
  const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } = useContext(
    StatusBarContext
  );

  useEffect(() => {
    ipcRenderer.on(DB_NEW_ASSET_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} asset was successfully created`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    ipcRenderer.on(DB_NEW_ACCOUNT_ACK, (_: IpcRendererEvent, { name, status, message }) => {
      if (status === EVENT_SUCCESS) {
        setSuccessMessage(`${name} account was successfully created`);
        setTimeout(() => {
          setSuccessMessage('');
        }, SUCCESS_MESSAGE_TIMEOUT);
      }

      if (status === EVENT_ERROR) {
        setErrorMessage(message);
        setTimeout(() => {
          setErrorMessage('');
        }, SUCCESS_MESSAGE_TIMEOUT);
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_NEW_ASSET_ACK);
      ipcRenderer.removeAllListeners(DB_NEW_ACCOUNT_ACK);
    };
  }, [setSuccessMessage]);

  const onCloseMessage = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <ScrollView title="Add by hand" subTitle="Create a new account or asset">
        <Section title={formSubtitle}>
          <AddAccountAssetForm
            onRadioButtonChange={value =>
              setFormSubtitle(value === ACCOUNT ? 'Account details' : 'Asset details')
            }
          />
        </Section>
      </ScrollView>
      <StatusBar
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClickButton={onCloseMessage}
      />
    </>
  );
};

export default AddAccountAssetByHand;
