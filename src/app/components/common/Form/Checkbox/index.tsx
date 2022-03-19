import React from 'react';
import styled from 'styled-components';

import { inputContainer, inputCheckbox, valueLabel } from './styles';

const InputContainer = styled.div`
  ${inputContainer}
`;
const InputCheckbox = styled.input`
  ${inputCheckbox}
`;
const ValueLabel = styled.label`
  ${valueLabel}
`;

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export interface CheckboxProps {
  label: string;
  name: string;
  id: string;
  register?: () => RefReturn;
  disabled?: boolean;
  disabledTitle?: string;
}

const InlineCheckbox = ({
  label,
  name,
  id,
  register,
  disabled = false,
  disabledTitle,
}: CheckboxProps) => (
  <InputContainer title={disabled ? disabledTitle : ''} disabled={disabled}>
    <InputCheckbox
      type="checkbox"
      name={name}
      id={id}
      ref={register ? register : null}
      disabled={disabled}
    />
    <ValueLabel htmlFor={id} disabled={disabled}>
      {label}
    </ValueLabel>
  </InputContainer>
);

export default InlineCheckbox;
