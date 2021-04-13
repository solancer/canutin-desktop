import React from 'react';
import styled from 'styled-components';

import { container, labelWrapper, label, optionalSpan } from './styles';

const Container = styled.div`${container}`;
const LabelWrapper = styled.label`${labelWrapper}`;
const Label = styled.label`${label}`;
const OptionalSpan = styled.span`${optionalSpan}`;

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export interface InputProps {
  label?: string;
  name: string;
  value?: string;
  type?: string;
  register?: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
  disabled?: boolean;
  optional?: boolean;
  ref?: any;
}

const Input = ({
  label,
  name,
  value,
  register,
  type = 'text',
  required = false,
  disabled = false,
  optional = false,
  ref = null,
}: InputProps) => (
  <Container disabled={disabled}>
    {label && <LabelWrapper>
      <Label htmlFor={name}>{label}</Label>
      {optional && <OptionalSpan> / Optional</OptionalSpan>}
    </LabelWrapper>}
    <input
      name={name}
      ref={ref ? ref : (register ? register({ required }) : null)}
      type={type}
      id={name}
      value={value}
      disabled={disabled}
    />
  </Container>
);

export default Input;
