import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { defaultContainer, secondaryContainer } from './styles';

export enum SubmitButtonOptions {
  DEFAULT = 'default',
  SECONDARY = 'secondary',
}

export interface SubmitButtonProp {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  buttonType?: SubmitButtonOptions;
}

const DefaultContainer = styled.button`
  ${defaultContainer}
`;

const SecondaryContainer = styled.button`
  ${defaultContainer}
  ${secondaryContainer}
`;

const getContainerButton = (buttonType: SubmitButtonOptions) => {
  switch (buttonType) {
    case SubmitButtonOptions.SECONDARY: {
      return SecondaryContainer;
    }
    default: {
      return DefaultContainer;
    }
  }
};

const SubmitButton = ({
  children,
  onClick,
  disabled = false,
  buttonType = SubmitButtonOptions.DEFAULT,
}: SubmitButtonProp) => {
  const Container = getContainerButton(buttonType);

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
