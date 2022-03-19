import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../../Button';

import { container } from './styles';

export interface SubmitButtonProp {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Container = styled(Button)`
  ${container}
`;

const SubmitButton = ({ children, onClick, disabled = false }: SubmitButtonProp) => {
  return (
    <Container
      type={ButtonType.SUBMIT}
      onClick={!disabled && onClick ? () => onClick() : () => {}}
      disabled={disabled}
    >
      {children}
    </Container>
  );
};

export default SubmitButton;
