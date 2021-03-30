import React, { ReactNode, useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ipcRenderer } from 'electron';

import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import Breadcrumbs, { BreadcrumbType } from '@components/common/Breadcrumbs';

import Setup from '@pages/Setup';

import { routesConfig, RouteConfigProps } from '@routes';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import { DATABASE_CONNECTED, DATABASE_DOES_NOT_EXIST, DATABASE_NOT_DETECTED } from '@constants';

import { container, globalStyle } from './styles';

const GlobalStyle = createGlobalStyle`${globalStyle}`;
const Container = styled.div`
  ${container}
`;

const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [dbError, setDbError] = useState<ReactNode>(null);

  const noVaultBreadcrumbs: BreadcrumbType[] = [{ text: 'Canutin setup', href: '' }];

  useEffect(() => {
    ipcRenderer.on(DATABASE_CONNECTED, () => {
      setIsAppInitialized(true);
    });

    ipcRenderer.on(DATABASE_DOES_NOT_EXIST, (_, { dbPath }: DatabaseDoesNotExistsMessage) => {
      setIsAppInitialized(false);
      setDbError(
        <span>
          The vault located at <b>{dbPath}</b> was moved or deleted
        </span>
      );
    });

    ipcRenderer.on(DATABASE_NOT_DETECTED, () => {
      setIsAppInitialized(false);
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Container>
          {isAppInitialized ? (
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
          )}
        </Container>
      </BrowserRouter>
    </>
  );
};

export default App;
