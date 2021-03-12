import React, { useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ipcRenderer } from "electron";

import { routeConfigs, RouteConfigProps } from 'app/routes';
import TopBar from 'app/components/common/TopBar';
import SideBar from 'app/components/common/SideNav';
import { APP_LOADED } from 'constants/events';
import { AppLoadedMessage } from 'constants/messages';
import { container, globalStyle } from './styles';

const GlobalStyle = createGlobalStyle`${globalStyle}`
const Container = styled.div`${container}`;

const App = () => {
  const [dbPath, setDbPath] = useState('');

  useEffect(() => {
    ipcRenderer.on(APP_LOADED, (_, message: AppLoadedMessage) => {
      setDbPath(message.dbPath);
      console.log(message.dbPath);
    });
  }, [dbPath]);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Container>
          <TopBar />
          <SideBar />
          <Switch>
            {
              routeConfigs.map(({ path, component, exact }: RouteConfigProps, index) => (
                <Route key={index} exact={exact} path={path}>{component}</Route>
              ))
            }
          </Switch>
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
