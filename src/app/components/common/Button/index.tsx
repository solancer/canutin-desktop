import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export const Container = styled.button`
  ${container}
`;

export interface ButtonProps {
  children: ReactNode;
  onClick: (() => void) | undefined;
  danger?: boolean;
  disabled?: boolean;
}

const Button = ({ children, onClick, danger = false, disabled = false }: ButtonProps) => (
  <Container danger={danger} onClick={!disabled && onClick ? () => onClick() : () => {}} disabled={disabled}>
    {children}
  </Container>
);

export default Button;
