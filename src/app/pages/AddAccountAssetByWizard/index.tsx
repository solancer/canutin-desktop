import React, { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import ImportWizardForm from '@components/AccountAsset/ImportWizardForm';

import {
  LOAD_FROM_CANUTIN_FILE_ACK,
  LOAD_FROM_OTHER_CSV_ACK,
  LOADING_CSV,
} from '@constants/events';
import { StatusEnum } from '@app/constants/misc';
import { StatusBarContext } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';
import AccountIpc from '@app/data/account.ipc';
import { routesPaths } from '@app/routes';
import AssetIpc from '@app/data/asset.ipc';
import TransactionIpc from '@app/data/transaction.ipc';

const AddAccountAssetByWizard = () => {
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { setIsDbEmpty } = useContext(AppContext);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    ipcRenderer.on(LOAD_FROM_CANUTIN_FILE_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage('The file was imported successfully');
      AccountIpc.getAccounts();
      AssetIpc.getAssets();
      TransactionIpc.getTransactions();
      history.push(routesPaths.balance);
    });

    ipcRenderer.on(LOAD_FROM_OTHER_CSV_ACK, (_: IpcRendererEvent, { name }) => {
      setSuccessMessage('The CSV was imported successfully');
      AccountIpc.getAccounts();
      AssetIpc.getAssets();
      TransactionIpc.getTransactions();
      history.push(routesPaths.balance);
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
    if (loadingPercentage >= 100) {
      setIsLoading(false);
      setIsDbEmpty(false);
      setStatusMessage({
        sentiment: StatusEnum.POSITIVE,
        message: successMessage,
        isLoading: false,
      });
    } else if (loadingPercentage > 0) {
      setIsLoading(true);
      setStatusMessage({
        sentiment: StatusEnum.NEUTRAL,
        message: 'Importing data...',
        isLoading: true,
      });
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
