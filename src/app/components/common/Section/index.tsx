import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container, sectionTitle } from './styles';

export const Container = styled.div`
  ${container}
`;

export const SectionTitle = styled.h2`
  ${sectionTitle}
`;

export interface SectionProps {
  title: string;
  children?: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <Container>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </Container>
);

export default Section;
