import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export const Container = styled.button`
  ${container}
`;

export enum ButtonType {
  SUBMIT = 'submit',
  BUTTON = 'button',
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonType;
  className?: string;
}

const Button = ({ children, onClick, type, className, disabled = false }: ButtonProps) => (
  <Container
    onClick={!disabled && onClick ? () => onClick() : () => {}}
    disabled={disabled}
    type={type || 'button'}
    className={className}
  >
    {children}
  </Container>
);

export default Button;
