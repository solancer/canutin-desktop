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
  innerRef?: React.RefObject<HTMLInputElement>
}

const Field = ({ label, name, optional = false, children, innerRef }: FieldProps) => (
  <FieldContainer innerRef={innerRef}>
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
