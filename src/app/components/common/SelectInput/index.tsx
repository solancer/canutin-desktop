import React from 'react';
import styled from 'styled-components';

import { container, label, valuesContainer, optional } from './styles';

const Container = styled.div`
  ${container}
`;
const Label = styled.label`
  ${label}
`;
const Optional = styled.div`
  ${optional}
`;
const ValuesContainer = styled.div`
  ${valuesContainer}
`;

type RefReturn =
  | string
  | ((instance: HTMLSelectElement | null) => void)
  | React.RefObject<HTMLSelectElement>
  | null
  | undefined;

export type SelectInputValue = {
  name: string | undefined;
  label: string | null;
};

export interface SelectInputProps {
  label: string;
  name: string;
  values: SelectInputValue[];
  register: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
  optional?: boolean;
}

const SelectInput = ({
  label,
  name,
  values,
  register,
  required = false,
  optional = false,
}: SelectInputProps) => (
  <Container>
    <Label htmlFor={name} optional={optional}>
      {label}
      {optional && <Optional>/ Optional</Optional>}
    </Label>
    <ValuesContainer>
      <select name={name} ref={register({ required })} id={name}>
        {optional && <option disabled selected></option>}
        {values.map(({ name, label }: SelectInputValue, index) => (
          <option value={name} key={index}>
            {label}
          </option>
        ))}
      </select>
    </ValuesContainer>
  </Container>
);

export default SelectInput;
