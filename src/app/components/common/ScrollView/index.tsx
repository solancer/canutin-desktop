import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, title, main } from './styles';

export const Container = styled.div`${container}`;
export const Header = styled.header`${header}`;
export const Title = styled.h1`${title}`;
export const Main = styled.main`${main}`;

export interface ScrollViewProps {
  title: string;
  children?: ReactNode;
}

const ScrollView = ({ title, children }: ScrollViewProps) => (
  <Container>
    <Header>
      <Title>{title}</Title>
    </Header>
    <Main>
      {children}
    </Main>
  </Container>
);

export default ScrollView;
