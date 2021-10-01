import { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { add } from 'date-fns';

import AssetIpc from '@app/data/asset.ipc';
import TransactionIpc from '@app/data/transaction.ipc';
import AccountIpc from '@app/data/account.ipc';
import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK, DB_GET_TRANSACTIONS_ACK } from '@constants/events';
import { Transaction, Account, Asset } from '@database/entities';
import { AppContext } from './appContext';

interface TransactionsIndex {
  lastUpdate: Date;
  transactions: Transaction[];
}

interface AccountsIndex {
  lastUpdate: Date;
  accounts: Account[];
}

interface AssetsIndex {
  lastUpdate: Date;
  assets: Asset[];
}

interface EntitiesContextValue {
  assetsIndex: AssetsIndex | null;
  accountsIndex: AccountsIndex | null;
  transactionsIndex: TransactionsIndex | null;
}

export const EntitiesContext = createContext<EntitiesContextValue>({
  assetsIndex: { assets: [], lastUpdate: new Date() },
  accountsIndex: { accounts: [], lastUpdate: new Date() },
  transactionsIndex: { transactions: [], lastUpdate: new Date() },
});

export const EntitiesProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [assetsIndex, setAssetsIndex] = useState<AssetsIndex | null>(null);
  const [transactionsIndex, setTransactionsIndex] = useState<TransactionsIndex | null>(null);
  const [accountsIndex, setAccountsIndex] = useState<AccountsIndex | null>(null);
  const { filePath } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      AccountIpc.getAccounts();
      AssetIpc.getAssets();
      TransactionIpc.getTransactions();
    }, 100);

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssetsIndex({ assets, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccountsIndex({ accounts, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_TRANSACTIONS_ACK, (_: IpcRendererEvent, transactions: Transaction[]) => {
      setTransactionsIndex({
        transactions: transactions.map(({ date, ...transactionData }) => ({
          ...transactionData,
          date: add(date, { minutes: date.getTimezoneOffset() }),
        })) as Transaction[],
        lastUpdate: new Date(),
      });
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_TRANSACTIONS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, [filePath]);

  const value = {
    assetsIndex,
    transactionsIndex,
    accountsIndex,
  };

  return <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>;
};
