import React, { ReactNode, useEffect, useState, useContext } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import Breadcrumbs, { BreadcrumbType } from '@components/common/Breadcrumbs';
import { StatusBarProvider } from '@app/context/statusBarContext';
import { AppContext } from '@app/context/appContext';

import Setup from '@pages/Setup';

import { routesConfig, RouteConfigProps, routesPaths } from '@routes';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import { DATABASE_CONNECTED, DATABASE_DOES_NOT_EXIST, DATABASE_NOT_DETECTED } from '@constants';
import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK } from '@constants/events';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';
import { Account, Asset } from '@database/entities';

import GlobalStyle from '@app/styles/global';
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
  const [dbError, setDbError] = useState<ReactNode>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [assets, setAssets] = useState<Asset[] | null>(null);

  const noVaultBreadcrumbs: BreadcrumbType[] = [{ text: 'Canutin setup', href: '' }];

  useEffect(() => {
    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssets(assets);
    });

    ipcRenderer.on(DATABASE_CONNECTED, (_, filePath) => {
      setIsLoading(false);
      setIsAppInitialized(true);
      setFilePath(filePath?.filePath);
      if (filePath) {
        AssetIpc.getAssets();
        AccountIpc.getAccounts();
      }
    });

    ipcRenderer.on(DATABASE_DOES_NOT_EXIST, (_, { dbPath }: DatabaseDoesNotExistsMessage) => {
      setIsLoading(false);
      setIsAppInitialized(false);
      setDbError(
        <span>
          The vault located at <b>{dbPath}</b> was moved or deleted
        </span>
      );
    });

    ipcRenderer.on(DATABASE_NOT_DETECTED, () => {
      setIsLoading(false);
      setIsAppInitialized(false);
    });

    return () => {
      ipcRenderer.removeAllListeners(DATABASE_NOT_DETECTED);
      ipcRenderer.removeAllListeners(DATABASE_DOES_NOT_EXIST);
      ipcRenderer.removeAllListeners(DATABASE_CONNECTED);
    };
  }, []);

  useEffect(() => {
    if (
      Array.isArray(assets) &&
      assets.length === 0 &&
      Array.isArray(accounts) &&
      accounts.length === 0
    ) {
      setIsDbEmpty(true);
    }
  }, [assets, accounts]);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Container>
          {!isLoading &&
            (isAppInitialized ? (
              <StatusBarProvider>
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
              </StatusBarProvider>
            ) : (
              <>
                <TitleBar />
                <Setup />
                <StatusBar
                  errorMessage={dbError}
                  onClickButton={() => setDbError(null)}
                  breadcrumbs={<Breadcrumbs items={noVaultBreadcrumbs} />}
                />
              </>
            ))}
        </Container>
      </BrowserRouter>
    </>
  );
};

export default App;
