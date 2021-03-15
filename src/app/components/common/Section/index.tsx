import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, title, body } from './styles';

export const Container = styled.div`${container}`;
export const Header = styled.header`${header}`;
export const Title = styled.h1`${title}`;
export const Body = styled.div`${body}`;

export interface SectionProps {
  title: string;
  children?: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <Container>
    <Header>
      <Title>{title}</Title>
    </Header>
    <Body>
      {children}
    </Body>
  </Container>
);

export default Section;
