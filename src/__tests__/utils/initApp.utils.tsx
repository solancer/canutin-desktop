import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'jest-mock';

import {
  DB_GET_ACCOUNTS_ACK,
  DB_GET_ASSETS_ACK,
  DB_GET_SETTINGS_ACK,
  DB_GET_BUDGETS_ACK,
  FILTER_TRANSACTIONS_ACK,
} from '@constants/repositories';
import { VAULT_READY } from '@constants/vault';
import {
  SeedAccount,
  SeedAsset,
  seedMinimumAccount,
  SeedTransaction,
} from '@tests/factories/entitiesFactory';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { render } from '@tests/utils';
import App from '@components/App';

interface SeedSettings {
  autoBudget?: true | false;
}

interface InitAppWithProps {
  accounts?: SeedAccount[];
  assets?: SeedAsset[];
  settings?: SeedSettings;
  filterTransactions?: SeedTransaction[] | false;
}

interface MockedEventProps {
  eventName: string;
  eventValue: any;
}

export const mockIpcRendererOnEvents = (mockedEvents: MockedEventProps[]) => {
  mocked(ipcRenderer).on.mockImplementation((event, callback) => {
    mockedEvents.forEach(({ eventName, eventValue }) => {
      if (event === eventName) {
        callback(event as unknown as IpcRendererEvent, eventValue);
      }
    });

    return ipcRenderer;
  });
};

export const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <EntitiesProvider>
        <App />
      </EntitiesProvider>
    </AppCtxProvider>
  );
};

export const initAppWith = ({
  accounts = [],
  assets = [],
  settings = { autoBudget: true },
  filterTransactions = [],
}: InitAppWithProps) => {
  mockIpcRendererOnEvents([
    {
      eventName: VAULT_READY,
      eventValue: 'Canutin.test.vault',
    },
    {
      eventName: DB_GET_ACCOUNTS_ACK,
      eventValue: accounts,
    },
    {
      eventName: DB_GET_ASSETS_ACK,
      eventValue: assets,
    },
    {
      eventName: DB_GET_SETTINGS_ACK,
      eventValue: settings,
    },
    {
      eventName: DB_GET_BUDGETS_ACK,
      eventValue: [],
    },
    {
      eventName: FILTER_TRANSACTIONS_ACK,
      eventValue: { transactions: filterTransactions },
    },
  ]);

  initAppWithContexts();
};
