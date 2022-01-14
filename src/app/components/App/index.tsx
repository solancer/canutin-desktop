import React, { useContext, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { routesConfig, RouteConfigProps, routesPaths } from '@routes';
import { DATABASE_CONNECTED, DATABASE_NOT_DETECTED, DATABASE_DOES_NOT_EXIST } from '@constants';

import { EntitiesContext } from '@app/context/entitiesContext';
import { AppContext } from '@app/context/appContext';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import Setup from '@pages/Setup';
import GlobalStyle from '@app/styles/global';
import NotReady from '@app/pages/NotReady';
import { container } from './styles';

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
  const { accountsIndex, assetsIndex, budgetsIndex, settingsIndex } = useContext(EntitiesContext);
  const { setStatusMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(DATABASE_CONNECTED, (_, filePath) => {
      setIsAppInitialized(true);
      setFilePath(filePath?.filePath);
      setIsDbEmpty(true);
      setIsLoading(true);
    });

    ipcRenderer.on(DATABASE_NOT_DETECTED, () => {
      setIsLoading(false);
      setIsAppInitialized(false);
    });

    ipcRenderer.on(DATABASE_DOES_NOT_EXIST, (_, { dbPath }: DatabaseDoesNotExistsMessage) => {
      setIsLoading(false);
      setIsAppInitialized(false);
      setStatusMessage({
        sentiment: StatusEnum.NEGATIVE,
        message: (
          <>
            The vault located at <b>{dbPath}</b> was moved or deleted
          </>
        ),
        isLoading: false,
      });
    });

    return () => {
      ipcRenderer.removeAllListeners(DATABASE_CONNECTED);
      ipcRenderer.removeAllListeners(DATABASE_NOT_DETECTED);
      ipcRenderer.removeAllListeners(DATABASE_DOES_NOT_EXIST);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(accountsIndex?.accounts) && !Array.isArray(assetsIndex?.assets)) return;

    if (accountsIndex?.accounts.length === 0 && assetsIndex?.assets.length === 0) {
      setIsDbEmpty(true);
    } else {
      setIsDbEmpty(false);
    }
  }, [isLoading]);

  // Set app loading state after all indexes have been updated
  useEffect(() => {
    assetsIndex?.lastUpdate &&
      accountsIndex?.lastUpdate &&
      budgetsIndex?.lastUpdate &&
      settingsIndex?.lastUpdate &&
      setIsLoading(false);
  }, [assetsIndex, accountsIndex, budgetsIndex, settingsIndex]);

  return (
    <>
      <GlobalStyle />
      <HashRouter>
        <Container hasSidebar={isAppInitialized && !isLoading}>
          <TitleBar />

          {isLoading && <NotReady />}

          {!isAppInitialized && !isLoading && <Setup />}

          {isAppInitialized && !isLoading && (
            <>
              <SideBar />
              {isDbEmpty && <Redirect to={routesPaths.addAccountOrAsset} />}
              {!isDbEmpty && <Redirect to={routesPaths.index} />}
              <Switch>
                {routesConfig.map(({ path, component, exact }: RouteConfigProps, index) => (
                  <Route key={index} exact={exact} path={path}>
                    {component}
                  </Route>
                ))}
              </Switch>
            </>
          )}

          <StatusBar />
        </Container>
      </HashRouter>
    </>
  );
};

export default App;
