import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { ReactComponent as BackIcon } from '@assets/icons/Back.svg';

import { rootRoutesPaths } from '@routes';

import { container, header, title, main, subTitle, backButton, headerContainer } from './styles';

export const Container = styled.div`
  ${container}
`;
export const Header = styled.header`
  ${header}
`;
export const TitleContainer = styled.div`
  overflow: hidden;
`;
export const Title = styled.h1`
  ${title}
`;
export const SubTitle = styled.h3`
  ${subTitle}
`;
export const Main = styled.main`
  ${main}
`;
export const BackButton = styled(BackIcon)`
  ${backButton}
`;
export const HeaderContainer = styled.div`
  ${headerContainer}
`;

export interface ScrollViewProps {
  title: string;
  subTitle?: string;
  headerNav?: ReactNode;
  children?: ReactNode;
  wizard?: boolean;
}

const ScrollView = ({ title, subTitle, headerNav, wizard, children }: ScrollViewProps) => {
  const history = useHistory();

  return (
    <Container>
      <Header>
        {history.length > 1 && !Object.values(rootRoutesPaths).includes(history.location.pathname) && (
          <BackButton
            onClick={() => {
              history.goBack();
            }}
          />
        )}
        <HeaderContainer>
          <TitleContainer>
            <Title title={title}>{title}</Title>
            {subTitle && <SubTitle title={subTitle}>{subTitle}</SubTitle>}
          </TitleContainer>
          {headerNav && <nav>{headerNav}</nav>}
        </HeaderContainer>
      </Header>
      <Main wizard={wizard}>{children}</Main>
    </Container>
  );
};

export default ScrollView;
