import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, body, title, subTitle } from './styles';

const Container = styled.button`${container}`;
const Header = styled.div`${header}`;
const Body = styled.div`${body}`;
const Title = styled.h3`${title}`;
const SubTitle = styled.div`${subTitle}`;

export interface PrimaryCardProps {
  icon: ReactNode;
  title: string;
  subTitle: string;
  onClick: () => void;
}

const PrimaryCard = ({ icon, title, subTitle, onClick }: PrimaryCardProps) => (
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

export default PrimaryCard;
