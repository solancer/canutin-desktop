import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export interface PrimaryCardRowProps {
  children: ReactNode;
}

const PrimaryCardRow = ({ children }: PrimaryCardRowProps) => <Container>{children}</Container>;

export default PrimaryCardRow;
