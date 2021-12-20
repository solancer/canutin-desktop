import React, { useEffect, useContext } from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import { AppContext } from '@app/context/appContext';

import Setup from '@pages/Setup';

import { routesConfig, RouteConfigProps, routesPaths } from '@routes';
import { DATABASE_CONNECTED, DATABASE_NOT_DETECTED } from '@constants';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';

import GlobalStyle from '@app/styles/global';
import { container } from './styles';
import { EntitiesContext } from '@app/context/entitiesContext';

const Container = styled.div`
  ${container}
`;

const App = () => {
  const {
    isLoading,
    setIsLoading,
    isAppInitialized,
    setIsAppInitialized,
    setFilePath,
    isDbEmpty,
    setIsDbEmpty,
  } = useContext(AppContext);
  const { accountsIndex, assetsIndex } = useContext(EntitiesContext);

  useEffect(() => {
    ipcRenderer.on(DATABASE_CONNECTED, (_, filePath) => {
      setIsLoading(false);
      setIsAppInitialized(true);
      setFilePath(filePath?.filePath);
      if (filePath) {
        AssetIpc.getAssets();
        AccountIpc.getAccounts();
      }
    });

    ipcRenderer.on(DATABASE_NOT_DETECTED, () => {
      setIsLoading(false);
      setIsAppInitialized(false);
    });

    return () => {
      ipcRenderer.removeAllListeners(DATABASE_NOT_DETECTED);
      ipcRenderer.removeAllListeners(DATABASE_CONNECTED);
    };
  }, []);

  useEffect(() => {
    if (
      Array.isArray(accountsIndex?.accounts) &&
      accountsIndex?.accounts.length === 0 &&
      Array.isArray(assetsIndex?.assets) &&
      assetsIndex?.assets.length === 0
    ) {
      setIsDbEmpty(true);
    } else {
      setIsDbEmpty(false);
    }
  }, [assetsIndex?.lastUpdate, accountsIndex?.lastUpdate]);

  return (
    <>
      <GlobalStyle />
      <HashRouter>
        <Container hasSidebar={isAppInitialized}>
          {!isLoading && isAppInitialized && (
            <>
              <TitleBar />
              <SideBar />
              <Switch>
                {isDbEmpty && (
                  <Redirect
                    exact
                    from={routesPaths.bigpicture}
                    to={routesPaths.addAccountOrAsset}
                  />
                )}
                {routesConfig.map(({ path, component, exact }: RouteConfigProps, index) => (
                  <Route key={index} exact={exact} path={path}>
                    {component}
                  </Route>
                ))}
              </Switch>
            </>
          )}

          {!isAppInitialized && (
            <>
              <TitleBar />
              <Setup />
            </>
          )}
          <StatusBar />
        </Container>
      </HashRouter>
    </>
  );
};

export default App;
