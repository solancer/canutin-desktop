import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import AddAccountAssetForm from '@components/AccountAsset/AddAccountAssetForm';
import StatusBar from '@components/common/StatusBar';

import { DB_NEW_ACCOUNT_ACK, DB_NEW_ASSET_ACK } from '@constants/events';
import { ACCOUNT } from '@appConstants/misc';
import { StatusBarContext } from '@app/context';

import { container, subTitle } from './styles';

const Container = styled.div`
  ${container}
`;
const SubTitle = styled.div`
  ${subTitle}
`;

const SUCCESS_MESSAGE_TIMEOUT = 5000;

const AddAccountAssetByHand = () => {
  const [formSubtitle, setFormSubtitle] = useState('Choose Type');
  const { successMessage, setSuccessMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(DB_NEW_ASSET_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} asset was successfully created`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    ipcRenderer.on(DB_NEW_ACCOUNT_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`${name} account was successfully created`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
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
        <Container>
          <SubTitle>{formSubtitle}</SubTitle>
          <AddAccountAssetForm
            onRadioButtonChange={value =>
              setFormSubtitle(value === ACCOUNT ? 'Account details' : 'Asset details')
            }
          />
        </Container>
      </ScrollView>
      <StatusBar successMessage={successMessage} onClickButton={onCloseMessage} />
    </>
  );
};

export default AddAccountAssetByHand;
