import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export interface FieldContainerProps {
  children: ReactNode;
}

const FieldContainer = ({ children }: FieldContainerProps) => <Container>{children}</Container>;

export default FieldContainer;
