import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export interface SectionRowProps {
  children: ReactNode;
}

const SectionRow = ({ children }: SectionRowProps) => <Container>{children}</Container>;

export default SectionRow;
