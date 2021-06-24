import React, { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import ImportWizardForm from '@components/AccountAsset/ImportWizardForm';

import {
  LOAD_FROM_CANUTIN_FILE_ACK,
  LOAD_FROM_OTHER_CSV_ACK,
  LOADING_CSV,
} from '@constants/events';
import { StatusBarContext } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';
import AccountIpc from '@app/data/account.ipc';

const AddAccountAssetByWizard = () => {
  const {
    setSuccessMessage,
    setLoadingMessage,
    loadingPercentage,
    setLoadingPercentage,
    setOnClickButton,
  } = useContext(StatusBarContext);
  const { setIsDbEmpty } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const onCloseMessage = () => {
    setSuccessMessage('');
  };

  useEffect(() => {
    ipcRenderer.on(LOAD_FROM_CANUTIN_FILE_ACK, (_: IpcRendererEvent, { name }) => {
      setLoadingPercentage(undefined);
      setIsDbEmpty(false);
      setIsLoading(false);
      setSuccessMessage(`The file was imported successfully`);
    });

    ipcRenderer.on(LOAD_FROM_OTHER_CSV_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`The CSV was imported successfully`);
      setIsDbEmpty(false);
      // Reload accounts on other CSV form
      AccountIpc.getAccounts();
      setLoadingPercentage(undefined);
      setIsLoading(false);
    });

    ipcRenderer.on(LOADING_CSV, (_: IpcRendererEvent, { total }) => {
      setLoadingPercentage(prevPercentage =>
        prevPercentage ? 100 / total + prevPercentage : 100 / total
      );
    });

    setLoadingMessage('Importing transactions from CSV');
    setOnClickButton(() => onCloseMessage);

    return () => {
      ipcRenderer.removeAllListeners(LOAD_FROM_CANUTIN_FILE_ACK);
      ipcRenderer.removeAllListeners(LOAD_FROM_OTHER_CSV_ACK);
      ipcRenderer.removeAllListeners(LOADING_CSV);
      setLoadingMessage('');
      setOnClickButton(undefined);
    };
  }, [setSuccessMessage]);

  useEffect(() => {
    if (loadingPercentage && loadingPercentage >= 100) {
      setLoadingPercentage(undefined);
    }
  }, [loadingPercentage]);

  return (
    <ScrollView
      title="Import wizard"
      subTitle="Add or update accounts, assets, balances and transactions"
    >
      <Section title="Data source">
        <ImportWizardForm isLoading={isLoading} setIsLoading={setIsLoading} />
      </Section>
    </ScrollView>
  );
};

export default AddAccountAssetByWizard;
