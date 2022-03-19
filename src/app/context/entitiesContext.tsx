import { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';
import {
  DB_GET_ACCOUNTS_ACK,
  DB_GET_ASSETS_ACK,
  DB_GET_BUDGETS_ACK,
  DB_GET_SETTINGS_ACK,
  DB_GET_TRANSACTION_CATEGORY_ACK,
} from '@constants/repositories';
import { VaultStatusEnum } from '@enums/vault.enum';
import { Account, Asset, Budget, Settings, TransactionSubCategory } from '@database/entities';
import { AppContext } from './appContext';
import BudgetIpc from '@app/data/budget.ipc';
import TransactionIpc from '@app/data/transaction.ipc';
import SettingsIpc from '@app/data/settings.ipc';
import {
  autoBudgetNeedsCategories,
  autoBudgetWantsCategories,
  getAutoBudgets,
} from '@app/utils/budget.utils';

export interface AccountsIndex {
  lastUpdate: Date | null;
  accounts: Account[];
}

interface AssetsIndex {
  lastUpdate: Date | null;
  assets: Asset[];
}

export interface BudgetsIndex {
  lastUpdate: Date | null;
  autoBudgets: Budget[];
  userBudgets: Budget[];
}

interface SettingsIndex {
  lastUpdate: Date | null;
  settings: Settings;
}

interface EntitiesContextValue {
  assetsIndex: AssetsIndex | null;
  accountsIndex: AccountsIndex | null;
  budgetsIndex: BudgetsIndex | null;
  settingsIndex: SettingsIndex | null;
}

const defaultAssetsIndex = { assets: [], lastUpdate: null };
const defaultAccountsIndex = { accounts: [], lastUpdate: null };
const defaultBudgetsIndex = { autoBudgets: [], userBudgets: [], lastUpdate: null };
const defaultSettingsIndex = { settings: { autoBudget: true } as Settings, lastUpdate: null };

export const EntitiesContext = createContext<EntitiesContextValue>({
  assetsIndex: defaultAssetsIndex,
  accountsIndex: defaultAccountsIndex,
  budgetsIndex: defaultBudgetsIndex,
  settingsIndex: defaultSettingsIndex,
});

export const EntitiesProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [assetsIndex, setAssetsIndex] = useState<AssetsIndex>(defaultAssetsIndex);
  const [accountsIndex, setAccountsIndex] = useState<AccountsIndex>(defaultAccountsIndex);
  const [budgetsIndex, setBudgetsIndex] = useState<BudgetsIndex>(defaultBudgetsIndex);
  const [settingsIndex, setSettingsIndex] = useState<SettingsIndex>(defaultSettingsIndex);
  const { vaultStatus } = useContext(AppContext);

  // Get accounts, assets & settings
  useEffect(() => {
    if (vaultStatus !== VaultStatusEnum.READY_TO_INDEX) return;

    setAccountsIndex(defaultAccountsIndex);
    setAssetsIndex(defaultAssetsIndex);
    setSettingsIndex(defaultSettingsIndex);
    setBudgetsIndex(defaultBudgetsIndex);

    setTimeout(() => {
      AccountIpc.getAccounts();
      AssetIpc.getAssets();
      SettingsIpc.getSettings();
    }, 100);

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssetsIndex({ assets, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccountsIndex({ accounts, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_SETTINGS_ACK, (_: IpcRendererEvent, settings: Settings) => {
      setSettingsIndex({ settings, lastUpdate: new Date() });
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_SETTINGS_ACK);
    };
  }, [vaultStatus]);

  // Get budgets
  useEffect(() => {
    if (vaultStatus !== VaultStatusEnum.INDEXED_WITH_DATA) return;

    autoBudgetNeedsCategories.forEach(categoryName => {
      TransactionIpc.getTransactionCategory(categoryName);
    });
    autoBudgetWantsCategories.forEach(categoryName => {
      TransactionIpc.getTransactionCategory(categoryName);
    });

    const needsCategories: TransactionSubCategory[] = [];
    const wantsCategories: TransactionSubCategory[] = [];

    ipcRenderer.on(
      DB_GET_TRANSACTION_CATEGORY_ACK,
      (_: IpcRendererEvent, category: TransactionSubCategory) => {
        if (needsCategories.length < autoBudgetNeedsCategories.length) {
          needsCategories.push(category);
        } else {
          wantsCategories.length <= autoBudgetWantsCategories.length &&
            wantsCategories.push(category);
        }
      }
    );

    const autoBudgetCategories = {
      needs: needsCategories,
      wants: wantsCategories,
    };

    const autoBudgets = getAutoBudgets(accountsIndex, autoBudgetCategories) as Budget[];

    BudgetIpc.getBudgets();

    ipcRenderer.on(DB_GET_BUDGETS_ACK, (_: IpcRendererEvent, userBudgets: Budget[]) => {
      setBudgetsIndex({ autoBudgets, userBudgets, lastUpdate: new Date() });
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_TRANSACTION_CATEGORY_ACK);
      ipcRenderer.removeAllListeners(DB_GET_BUDGETS_ACK);
    };
  }, [accountsIndex, vaultStatus]);

  const value = {
    assetsIndex,
    accountsIndex,
    budgetsIndex,
    settingsIndex,
  };

  return <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>;
};
