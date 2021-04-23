import React, { ReactNode } from 'react';
import styled from 'styled-components';

import FieldContainer from '@components/common/Form/FieldContainer';
import { label, optionalTag } from './styles';

const Label = styled.label`
  ${label}
`;
const OptionalTag = styled.span`
  ${optionalTag}
`;

export interface FieldProps {
  label?: string;
  name: string;
  optional?: boolean;
  children?: ReactNode;
}

const Field = ({ label, name, optional = false, children }: FieldProps) => (
  <FieldContainer>
    {label && (
      <Label htmlFor={name}>
        {label}
        {optional && <OptionalTag> / Optional</OptionalTag>}
      </Label>
    )}
    {children}
  </FieldContainer>
);

export default Field;
