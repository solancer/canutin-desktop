import React from 'react';
import styled from 'styled-components';

import Field from '@components/common/Form/Field';

import { radioGroupContainer, inputContainer, inputRadio, valueLabel } from './styles';

const RadioGroupContainer = styled.ul`
  ${radioGroupContainer}
`;
const InputContainer = styled.li`
  ${inputContainer}
`;
const InputRadio = styled.input<any>`
  ${inputRadio}
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

export interface RadioGroupFieldProps {
  label: string;
  name: string;
  values: string[];
  onSelectOption?: (_: string) => void;
  register?: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
}

const RadioGroupField = ({
  label,
  name,
  values,
  onSelectOption,
  register,
  required = false,
}: RadioGroupFieldProps) => (
  <Field label={label} name={name}>
    <RadioGroupContainer>
      {values.map((value, index) => {
        const inputId = `${value}-${index}`;
        return (
          <InputContainer key={index}>
            <InputRadio
              type="radio"
              id={inputId}
              onClick={onSelectOption ? () => onSelectOption(value) : () => {}}
              name={name}
              value={value}
              ref={register ? register({ required }) : null}
            />
            <ValueLabel htmlFor={inputId}>{value}</ValueLabel>
          </InputContainer>
        );
      })}
    </RadioGroupContainer>
  </Field>
);

export default RadioGroupField;
