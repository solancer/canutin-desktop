import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, body, title, subTitle } from './styles';

const Container = styled.button`${container}`;
const Header = styled.div`${header}`;
const Body = styled.div`${body}`;
const Title = styled.div`${title}`;
const SubTitle = styled.div`${subTitle}`;

export interface SetupOptionBoxProps {
  icon: ReactNode;
  title: string;
  subTitle: string;
  onClick: () => void;
}

const SetupOptionBox = ({ icon, title, subTitle, onClick }: SetupOptionBoxProps) => (
  <Container onClick={onClick}>
    <Header>
      {icon}
    </Header>
    <Body>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </Body>
  </Container>
);

export default SetupOptionBox;
