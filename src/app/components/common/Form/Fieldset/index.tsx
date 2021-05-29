import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.fieldset`
  ${container}
`;

export interface FieldsetProps {
  children: ReactNode;
}

const Fieldset = ({ children }: FieldsetProps) => <Container>{children}</Container>;

export default Fieldset;
