import React from 'react';

import Field from '@components/common/Form/Field';
import InputText from '@components/common/Form/InputText';

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export interface InputTextFieldProps {
  label?: string;
  name: string;
  value?: string;
  type?: string;
  register?: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
  disabled?: boolean;
  optional?: boolean;
  setRef?: any;
}

const InputTextField = ({
  label,
  name,
  value,
  register,
  type = 'text',
  required = false,
  disabled = false,
  optional = false,
  setRef = null,
}: InputTextFieldProps) => (
  <Field label={label} name={name} optional={optional}>
    <InputText
      name={name}
      setRef={setRef ? setRef : register ? register({ required }) : null}
      type={type}
      value={value}
      disabled={disabled}
    />
  </Field>
);

export default InputTextField;
