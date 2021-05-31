import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

export interface FieldContainerProps {
  children: ReactNode;
  innerRef?: React.RefObject<HTMLInputElement>
}

const FieldContainer = ({ children, innerRef }: FieldContainerProps) => <Container ref={innerRef}>{children}</Container>;

export default FieldContainer;
