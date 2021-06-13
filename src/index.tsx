import React from 'react';
import ReactDOM from 'react-dom';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { StatusBarProvider } from '@app/context/statusBarContext';

ReactDOM.render(
  <AppCtxProvider>
    <StatusBarProvider>
      <App />
    </StatusBarProvider>
  </AppCtxProvider>,
  document.getElementById('root')
);
