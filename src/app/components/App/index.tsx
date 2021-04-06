import React, { ReactNode, useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import Breadcrumbs, { BreadcrumbType } from '@components/common/Breadcrumbs';

import Setup from '@pages/Setup';

import { routesConfig, RouteConfigProps } from '@routes';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import { DATABASE_CONNECTED, DATABASE_DOES_NOT_EXIST, DATABASE_NOT_DETECTED } from '@constants';

import GlobalStyle from '@app/styles/global';
import { container } from './styles';

const Container = styled.div`
  ${container}
`;

const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<ReactNode>(null);

  const noVaultBreadcrumbs: BreadcrumbType[] = [{ text: 'Canutin setup', href: '' }];

  useEffect(() => {
    ipcRenderer.on(DATABASE_CONNECTED, () => {
      setIsLoading(false);
      setIsAppInitialized(true);
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

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Container>
          {!isLoading &&
            (isAppInitialized ? (
              <>
                <TitleBar />
                <SideBar />
                <Switch>
                  {routesConfig.map(({ path, component, exact }: RouteConfigProps, index) => (
                    <Route key={index} exact={exact} path={path}>
                      {component}
                    </Route>
                  ))}
                </Switch>
              </>
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
