import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import ImportWizardForm from '@components/AccountAsset/ImportWizardForm';
import StatusBar from '@components/common/StatusBar';

import { LOAD_FROM_CANUTIN_FILE_ACK, LOAD_FROM_OTHER_CSV_ACK } from '@constants/events'
import { StatusBarContext } from '@app/context';

import { container, subTitle } from './styles';

const Container = styled.div`
  ${container}
`;
const SubTitle = styled.div`
  ${subTitle}
`;

const SUCCESS_MESSAGE_TIMEOUT = 5000;

const AddAccountAssetByWizard = () => {
  const { successMessage, setSuccessMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(LOAD_FROM_CANUTIN_FILE_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`Data has been imported successfully`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    ipcRenderer.on(LOAD_FROM_OTHER_CSV_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`Data has been imported successfully`);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    return () => {
      ipcRenderer.removeAllListeners(LOAD_FROM_CANUTIN_FILE_ACK);
    };
  }, [setSuccessMessage]);

  const onCloseMessage = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <ScrollView title="Import wizard" subTitle="Add or update accounts, assets, balances and transactions">
        <Container>
          <SubTitle>Data Source</SubTitle>
          <ImportWizardForm />
        </Container>
      </ScrollView>
      <StatusBar successMessage={successMessage} onClickButton={onCloseMessage} />
    </>
  );
};

export default AddAccountAssetByWizard;
