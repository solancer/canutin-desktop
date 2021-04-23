import React from 'react';
import styled from 'styled-components';

import { inputElement } from './styles';

const InputElement = styled.input`
  ${inputElement}
`;

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export interface InputTextProps {
  name: string;
  value?: string;
  type?: string;
  register?: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  setRef?: any;
}

const InputText = ({
  name,
  value,
  register,
  type = 'text',
  required = false,
  disabled = false,
  setRef = null,
}: InputTextProps) => (
  <InputElement
    name={name}
    ref={setRef ? setRef : register ? register({ required }) : null}
    type={type}
    id={name}
    value={value}
    disabled={disabled}
    readOnly={disabled}
  />
);

export default InputText;
