import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, title, main, subTitle } from './styles';

export const Container = styled.div`
  ${container}
`;
export const Header = styled.header`
  ${header}
`;
export const Title = styled.h1`
  ${title}
`;
export const SubTitle = styled.div`
  ${subTitle}
`;
export const Main = styled.main`
  ${main}
`;

export interface ScrollViewProps {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}

const ScrollView = ({ title, subTitle, children }: ScrollViewProps) => (
  <Container>
    <Header>
      <Title subTitle={!!subTitle}>{title}</Title>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
    </Header>
    <Main>{children}</Main>
  </Container>
);

export default ScrollView;
