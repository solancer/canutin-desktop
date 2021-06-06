import React, { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import ImportWizardForm from '@components/AccountAsset/ImportWizardForm';
import StatusBar from '@components/common/StatusBar';

import {
  LOAD_FROM_CANUTIN_FILE_ACK,
  LOAD_FROM_OTHER_CSV_ACK,
  LOADING_CSV,
} from '@constants/events';
import { StatusBarContext } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';
import AccountIpc from '@app/data/account.ipc';

const SUCCESS_MESSAGE_TIMEOUT = 5000;

const AddAccountAssetByWizard = () => {
  const { successMessage, setSuccessMessage } = useContext(StatusBarContext);
  const { setIsDbEmpty } = useContext(AppContext);
  const [loadingPercentage, setLoadingPercentage] = useState<undefined | number>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ipcRenderer.on(LOAD_FROM_CANUTIN_FILE_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`Data has been imported successfully`);
      setIsDbEmpty(false);
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
      setLoadingPercentage(undefined);
    });

    ipcRenderer.on(LOAD_FROM_OTHER_CSV_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage(`Data has been imported successfully`);
      setIsDbEmpty(false);
      // Reload accounts on other CSV form
      AccountIpc.getAccounts();
      setLoadingPercentage(undefined);
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, SUCCESS_MESSAGE_TIMEOUT);
    });

    ipcRenderer.on(LOADING_CSV, (_: IpcRendererEvent, { total }) => {
      setLoadingPercentage(prevPercentage =>
        prevPercentage ? 100 / total + prevPercentage : 100 / total
      );
    });

    return () => {
      ipcRenderer.removeAllListeners(LOAD_FROM_CANUTIN_FILE_ACK);
      ipcRenderer.removeAllListeners(LOAD_FROM_OTHER_CSV_ACK);
      ipcRenderer.removeAllListeners(LOADING_CSV);
    };
  }, [setSuccessMessage]);

  useEffect(() => {
    if (loadingPercentage && loadingPercentage >= 100) {
      setLoadingPercentage(undefined);
    }
  }, [loadingPercentage]);

  const onCloseMessage = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <ScrollView
        title="Import wizard"
        subTitle="Add or update accounts, assets, balances and transactions"
      >
        <Section title="Data Source">
          <ImportWizardForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </Section>
      </ScrollView>
      <StatusBar
        loadingMessage="Importing transactions from CSV"
        loadingPercentage={loadingPercentage && Math.floor(loadingPercentage)}
        successMessage={successMessage}
        onClickButton={onCloseMessage}
      />
    </>
  );
};

export default AddAccountAssetByWizard;
