import React from 'react';
import styled from 'styled-components';

import { container, label, valuesContainer, inputGroup, valueLabel } from './styles';

const Container = styled.div`
  ${container}
`;
const Label = styled.label`
  ${label}
`;
const ValuesContainer = styled.div`
  ${valuesContainer}
`;
const InputGroup = styled.div`
  ${inputGroup}
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

export interface RadioInputGroupProps {
  label: string;
  name: string;
  values: string[];
  onSelectOption?: (_: string) => void;
  register?: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
}

const RadioInputGroup = ({
  label,
  name,
  values,
  onSelectOption,
  register,
  required = false,
}: RadioInputGroupProps) => (
  <Container>
    <Label htmlFor={name}>{label}</Label>
    <ValuesContainer>
      {values.map((value, index) => {
        const inputId = `${value}-${index}`;
        return (
          <InputGroup>
            <input
              type="radio"
              id={inputId}
              onClick={onSelectOption ? () => onSelectOption(value) : undefined}
              name={name}
              value={value}
              ref={register ? register({ required }) : null}
            />
            <ValueLabel htmlFor={inputId}>{value}</ValueLabel>
          </InputGroup>
        );
      })}
    </ValuesContainer>
  </Container>
);

export default RadioInputGroup;
