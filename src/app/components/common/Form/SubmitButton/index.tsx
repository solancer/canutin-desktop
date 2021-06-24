import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

export interface SubmitButtonProp {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Container = styled.button`
  ${container}
`;

const SubmitButton = ({ children, onClick, disabled = false }: SubmitButtonProp) => {
  return (
    <Container
      type="submit"
      onClick={!disabled && onClick ? () => onClick() : () => {}}
      disabled={disabled}
    >
      {children}
    </Container>
  );
};

export default SubmitButton;
