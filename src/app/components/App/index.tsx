import React, { useContext, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { routesConfig, RouteConfigProps, routesPaths } from '@routes';
import {
  VAULT_READY,
  VAULT_NOT_SET,
  VAULT_SET_NO_FILE,
  VAULT_SET_WRONG_MASTER_KEY,
  VAULT_SET_NO_MASTER_KEY,
} from '@constants/vault';

import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import GlobalStyle from '@app/styles/global';
import NotReady from '@app/pages/NotReady';
import { EntitiesContext } from '@app/context/entitiesContext';
import { AppContext } from '@app/context/appContext';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import { VaultStatusEnum } from '@enums/vault.enum';
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
    vaultPath,
    setVaultPath,
    vaultStatus,
    setVaultStatus,
  } = useContext(AppContext);
  const { accountsIndex, assetsIndex, settingsIndex } = useContext(EntitiesContext);
  const { setStatusMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(VAULT_READY, (_, vaultPath: string) => {
      setIsAppInitialized(true);
      setVaultPath(vaultPath);
      setVaultStatus(VaultStatusEnum.READY_TO_INDEX);
    });

    ipcRenderer.on(VAULT_NOT_SET, () => {
      setIsAppInitialized(false);
      setIsLoading(false);
      setVaultStatus(VaultStatusEnum.NOT_SET);
    });

    ipcRenderer.on(VAULT_SET_NO_MASTER_KEY, (_, vaultPath: string) => {
      setIsAppInitialized(true);
      setIsLoading(false);
      setVaultPath(vaultPath);
      setVaultStatus(VaultStatusEnum.SET_EXISTING_NOT_READY);
    });

    ipcRenderer.on(VAULT_SET_WRONG_MASTER_KEY, () => {
      setIsAppInitialized(true);
      setIsLoading(false);
      setVaultStatus(VaultStatusEnum.SET_EXISTING_NOT_READY);
      setStatusMessage({
        sentiment: StatusEnum.WARNING,
        message: 'Incorrect master key or the chosen file is not a valid Canutin vault',
        isLoading: false,
      });
    });

    ipcRenderer.on(VAULT_SET_NO_FILE, (_, { dbPath }: DatabaseDoesNotExistsMessage) => {
      setIsAppInitialized(true);
      setIsLoading(false);
      setVaultStatus(VaultStatusEnum.NOT_SET);
      setStatusMessage({
        sentiment: StatusEnum.WARNING,
        message: (
          <>
            The vault located at <b>{dbPath}</b> was moved or deleted
          </>
        ),
        isLoading: false,
      });
    });

    return () => {
      ipcRenderer.removeAllListeners(VAULT_READY);
      ipcRenderer.removeAllListeners(VAULT_NOT_SET);
      ipcRenderer.removeAllListeners(VAULT_SET_NO_MASTER_KEY);
      ipcRenderer.removeAllListeners(VAULT_SET_NO_FILE);
      ipcRenderer.removeAllListeners(VAULT_SET_WRONG_MASTER_KEY);
    };
  }, []);

  useEffect(() => {
    if (vaultStatus !== VaultStatusEnum.INDEX_PENDING) return;
    if (!Array.isArray(accountsIndex?.accounts) && !Array.isArray(assetsIndex?.assets)) return;

    if (accountsIndex?.accounts.length === 0 && assetsIndex?.assets.length === 0) {
      setVaultStatus(VaultStatusEnum.INDEXED_NO_DATA);
      setIsLoading(false);
    } else {
      setVaultStatus(VaultStatusEnum.INDEXED_WITH_DATA);
      setIsLoading(false);
    }
  }, [vaultStatus]);

  useEffect(() => {
    if (assetsIndex?.lastUpdate && accountsIndex?.lastUpdate && settingsIndex?.lastUpdate) {
      setIsLoading(true);
      setVaultStatus(VaultStatusEnum.INDEX_PENDING);
    }
  }, [assetsIndex, accountsIndex, settingsIndex]);

  const isVaultNotSet = !vaultPath || vaultStatus === VaultStatusEnum.NOT_SET;
  const isVaultLocked =
    vaultPath &&
    (vaultStatus === VaultStatusEnum.SET_NEW_NOT_READY ||
      vaultStatus === VaultStatusEnum.SET_EXISTING_NOT_READY);
  const isVaultEmpty = vaultStatus === VaultStatusEnum.INDEXED_NO_DATA;
  const isVaultWithData = vaultStatus === VaultStatusEnum.INDEXED_WITH_DATA;
  const hasSidebar = isVaultEmpty || isVaultWithData;

  return (
    <>
      <GlobalStyle />
      <HashRouter>
        <Container hasSidebar={hasSidebar}>
          <TitleBar />

          {isLoading && <NotReady />}

          {!isLoading && (
            <>
              {hasSidebar && <SideBar />}

              {isVaultNotSet && <Redirect to={routesPaths.setup} />}
              {isVaultLocked && <Redirect to={routesPaths.vaultSecurity} />}
              {isVaultEmpty && <Redirect to={routesPaths.addOrUpdateData} />}
              {isVaultWithData && <Redirect to={routesPaths.index} />}

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
