import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { toggleInputFieldContainer } from './styles';

const ToggleInputFieldContainer = styled.div`
  ${toggleInputFieldContainer}
`;

interface ToggleInputFieldProps {
  children: ReactNode;
}

const ToggleInputField = ({ children }: ToggleInputFieldProps) => (
  <ToggleInputFieldContainer>{children}</ToggleInputFieldContainer>
);

export default ToggleInputField;
