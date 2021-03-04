import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { routeConfigs, RouteConfigProps } from 'routes';
import TopBar from 'components/common/TopBar';
import SideBar from 'components/common/SideNav';
import { container, globalStyle } from './styles';

const GlobalStyle = createGlobalStyle`${globalStyle}`
const Container = styled.div`${container}`;

const App = () => (
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

export default App;
