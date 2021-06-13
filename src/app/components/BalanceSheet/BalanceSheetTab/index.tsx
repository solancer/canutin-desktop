import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div<{ isActive: boolean }>`
  ${container}
`;

interface BalanceSheetTabProps {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
}

const BalanceSheetTab = ({ onClick, isActive, children }: BalanceSheetTabProps) => (
  <Container isActive={isActive} onClick={onClick}>
    {children}
  </Container>
);

export default BalanceSheetTab;
