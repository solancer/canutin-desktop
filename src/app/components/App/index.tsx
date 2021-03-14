import React, { ReactNode, useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ipcRenderer } from 'electron';

import { routesConfig, RouteConfigProps } from 'app/routes';
import TopBar from 'app/components/common/TopBar';
import BottomBar from 'app/components/common/BottomBar';
import SideBar from 'app/components/common/SideNav';
import Setup from 'app/pages/Setup';
import BreadCrumbs, { BreadCrumbType } from 'app/components/common/BreadCrumbs';
import { DatabaseDoesNotExistsMessage } from 'constants/messages';
import { DATABASE_CONNECTED, DATABASE_DOES_NOT_EXIST, DATABASE_NOT_DETECTED } from '../../../constants';
import { container, globalStyle } from './styles';

const GlobalStyle = createGlobalStyle`${globalStyle}`
const Container = styled.div`${container}`;

const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [dbError, setDbError] = useState<ReactNode>(null);

  const noVaultBreadCrumbs: BreadCrumbType[] = [
    { text: 'Canutin setup', href: '' },
  ];

  useEffect(() => {
    ipcRenderer.on(DATABASE_CONNECTED, () => {
      setIsAppInitialized(true);
    });

    ipcRenderer.on(DATABASE_DOES_NOT_EXIST, (_, { dbPath }: DatabaseDoesNotExistsMessage) => {
      setIsAppInitialized(false);
      setDbError(<span>The vault located at <b>{dbPath}</b> was moved or deleted</span>);
    });

    ipcRenderer.on(DATABASE_NOT_DETECTED, () => {
      setIsAppInitialized(false);
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        {isAppInitialized ? (
          <Container>
            <TopBar />
            <SideBar />
            <Switch>
              {
                routesConfig.map(({ path, component, exact }: RouteConfigProps, index) => (
                  <Route key={index} exact={exact} path={path}>{component}</Route>
                ))
              }
            </Switch>
          </Container>
        ) : (
          <>
            <TopBar />
            <Setup />
            <BottomBar
              errorMessage={dbError}
              onCloseError={() => setDbError(null)}
              breadCrumbs={<BreadCrumbs items={noVaultBreadCrumbs} />}
            />
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
