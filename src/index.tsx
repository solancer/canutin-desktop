import React from 'react';
import ReactDOM from 'react-dom';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { StatusBarProvider } from '@app/context/statusBarContext';
import { TransactionsProvider } from '@app/context/transactionsContext';
import { EntitiesProvider } from '@app/context/entitiesContext';

ReactDOM.render(
  <AppCtxProvider>
    <StatusBarProvider>
      <TransactionsProvider>
        <EntitiesProvider>
          <App />
        </EntitiesProvider>
      </TransactionsProvider>
    </StatusBarProvider>
  </AppCtxProvider>,
  document.getElementById('root')
);
