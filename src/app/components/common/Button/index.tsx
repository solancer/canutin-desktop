import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export const Container = styled.button`
  ${container}
`;

export interface ButtonProps {
  children: ReactNode;
  onClick: (() => void) | undefined;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled = false }: ButtonProps) => (
  <Container onClick={!disabled && onClick ? () => onClick() : () => {}} disabled={disabled}>
    {children}
  </Container>
);

export default Button;
