import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { container } from './styles';

import { StatusEnum } from '@appConstants/misc';

const Container = styled.p`
  ${container}
`;

export interface FieldStatusProps {
  status: StatusEnum;
  children: ReactNode;
}

const FieldStatus = ({ status, children }: FieldStatusProps) => <Container status={status}>{children}</Container>;

export default FieldStatus;
