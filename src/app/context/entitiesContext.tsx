import { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';
import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK, DB_GET_ACCOUNT_ACK } from '@constants/events';
import { Account, Asset } from '@database/entities';
import { AppContext } from './appContext';

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
}

export const EntitiesContext = createContext<EntitiesContextValue>({
  assetsIndex: { assets: [], lastUpdate: new Date() },
  accountsIndex: { accounts: [], lastUpdate: new Date() },
});

export const EntitiesProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [assetsIndex, setAssetsIndex] = useState<AssetsIndex | null>(null);
  const [accountsIndex, setAccountsIndex] = useState<AccountsIndex | null>(null);
  const { filePath } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      AccountIpc.getAccounts();
      AssetIpc.getAssets();
    }, 100);

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssetsIndex({ assets, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccountsIndex({ accounts, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_ACCOUNT_ACK, (_: IpcRendererEvent, account: Account) => {
      const accounts = accountsIndex?.accounts.map(indexedAccount =>
        indexedAccount.id === account.id ? account : indexedAccount
      );
      accounts && setAccountsIndex({ accounts, lastUpdate: new Date() });
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNT_ACK);
    };
  }, [filePath]);

  const value = {
    assetsIndex,
    accountsIndex,
  };

  return <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>;
};
