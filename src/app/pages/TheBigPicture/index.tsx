import React, { useState, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import ScrollView from '@components/common/ScrollView';
import BigPictureSummary from '@components/BigPicture/BigPictureSummary';
import TrailingCashflow from '@components/BigPicture/TrailingCashflow';
import CashflowChart from '@components/BigPicture/CashflowChart';
import SectionRow from '@components/common/SectionRow';

import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK, DB_GET_TRANSACTIONS_ACK } from '@constants/events';
import AssetIpc from '@app/data/asset.ipc';
import TransactionIpc from '@app/data/transaction.ipc';
import AccountIpc from '@app/data/account.ipc';
import { Account, Asset, Transaction } from '@database/entities';
import {
  getTotalBalanceByGroup,
  getTransactionsTrailingCashflow,
  TotalBalanceType,
  TransactionsTrailingCashflowType,
} from '@app/utils/balance.utils';

const TheBigPicture = () => {
  const [accounts, setAccounts] = useState<Account[]>();
  const [assets, setAssets] = useState<Asset[]>();
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [totalBalance, setTotalBalance] = useState<TotalBalanceType>();
  const [trailingCashflow, setTrailingCashflow] = useState<TransactionsTrailingCashflowType[]>();

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

    ipcRenderer.on(DB_GET_TRANSACTIONS_ACK, (_: IpcRendererEvent, transactions: Transaction[]) => {
      setTransactions(transactions);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_TRANSACTIONS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  useEffect(() => {
    assets && accounts && setTotalBalance(getTotalBalanceByGroup(assets, accounts));
  }, [accounts, assets]);

  useEffect(() => {
    transactions && setTrailingCashflow(getTransactionsTrailingCashflow(transactions));
  }, [transactions]);

  return (
    <>
      <ScrollView title="The big picture">
        <BigPictureSummary totalBalance={totalBalance} />
        <SectionRow>
          <TrailingCashflow trailingCashflow={trailingCashflow} />
        </SectionRow>
        <CashflowChart trailingCashflow={trailingCashflow} />
      </ScrollView>
    </>
  );
};

export default TheBigPicture;
