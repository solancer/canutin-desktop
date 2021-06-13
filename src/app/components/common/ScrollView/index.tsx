import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { ReactComponent as BackIcon } from '@assets/icons/Back.svg';

import { rootRoutesPaths } from '@routes';

import {
  container,
  header,
  title,
  main,
  subTitle,
  back,
  information,
  rightInformation,
} from './styles';

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
export const Back = styled(BackIcon)`
  ${back}
`;
export const Information = styled.div`
  ${information}
`;
export const RightInformation = styled.div`
  ${rightInformation}
`;
export interface ScrollViewProps {
  title: string;
  subTitle?: string;
  rightInformationComponent?: ReactNode;
  children?: ReactNode;
}

const ScrollView = ({ title, subTitle, rightInformationComponent, children }: ScrollViewProps) => {
  const history = useHistory();

  return (
    <Container>
      <Header>
        {history.length > 1 && !Object.values(rootRoutesPaths).includes(history.location.pathname) && (
          <Back
            onClick={() => {
              history.goBack();
            }}
          />
        )}
        <Information>
          <div>
            <Title>{title}</Title>
            {subTitle && <SubTitle>{subTitle}</SubTitle>}
          </div>
          {rightInformationComponent && <RightInformation>{rightInformationComponent}</RightInformation>}
        </Information>
      </Header>
      <Main>{children}</Main>
    </Container>
  );
};

export default ScrollView;
