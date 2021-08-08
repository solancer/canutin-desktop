import React, { useState, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import BigPictureSummary from '@components/BigPicture/BigPictureSummary';

import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK } from '@constants/events';
import AssetIpc from '@app/data/asset.ipc';
import TransactionIpc from '@app/data/transaction.ipc';
import AccountIpc from '@app/data/account.ipc';
import { Account, Asset } from '@database/entities';
import {
  getTotalBalanceByGroup,
  TotalBalanceType,
} from '@app/utils/balance.utils';

const TheBigPicture = () => {
  const [accounts, setAccounts] = useState<Account[]>();
  const [assets, setAssets] = useState<Asset[]>();
  const [totalBalance, setTotalBalance] = useState<TotalBalanceType>();

  useEffect(() => {
    AccountIpc.getAccounts();
    AssetIpc.getAssets();
    TransactionIpc.getTransactions();

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssets(assets);
    });

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  useEffect(() => {
    assets && accounts && setTotalBalance(getTotalBalanceByGroup(assets, accounts));
  }, [accounts, assets])

  return (
    <>
      <ScrollView title="The big picture">
        <BigPictureSummary totalBalance={totalBalance} />
      </ScrollView>
    </>
  );
};

export default TheBigPicture;
