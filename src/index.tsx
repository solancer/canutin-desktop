import React from 'react';
import ReactDOM from 'react-dom';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';

ReactDOM.render(
  <AppCtxProvider>
    <App />
  </AppCtxProvider>,
  document.getElementById('root')
);
