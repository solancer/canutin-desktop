import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.fieldset`
  ${container}
`;

export interface FieldsetProps {
  children: ReactNode;
  dataTestId?: string;
}

const Fieldset = ({ children, dataTestId }: FieldsetProps) => (
  <Container data-testid={dataTestId}>{children}</Container>
);

export default Fieldset;
