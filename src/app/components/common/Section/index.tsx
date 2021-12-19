import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, header, title } from './styles';

const Container = styled.div`
  ${container}
`;
const Header = styled.header`
  ${header}
`;
const Title = styled.h2`
  ${title}
`;

export interface SectionProps {
  title: string;
  scope?: ReactNode;
  children?: ReactNode;
  dataTestId?: string;
}

const Section = ({ title, scope, children, dataTestId }: SectionProps) => (
  <Container data-testid={dataTestId}>
    <Header>
      <Title>{title}</Title>
      <div>{scope}</div>
    </Header>
    {children}
  </Container>
);

export default Section;
