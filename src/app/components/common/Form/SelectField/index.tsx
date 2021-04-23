import React from 'react';
import styled from 'styled-components';

import Field from '@components/common/Form/Field';

import { selectInput } from './styles';

const Select = styled.select<any>`
  ${selectInput}
`;

type RefReturn =
  | string
  | ((instance: HTMLSelectElement | null) => void)
  | React.RefObject<HTMLSelectElement>
  | null
  | undefined;

export type SelectFieldValue = {
  name: string;
  label: string;
};

export interface SelectFieldProps {
  label: string;
  name: string;
  values: SelectFieldValue[];
  register: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
  optional?: boolean;
}

const SelectField = ({ label, name, values, register, required = false, optional = false, }: SelectFieldProps) => (
  <Field label={label} name={name} optional={optional}>
    <Select name={name} id={name} ref={register({ required })}>
      {values.map(({ name, label }: SelectFieldValue, index) => (
        <option value={name} key={index}>
          {label}
        </option>
      ))}
    </Select>
  </Field>
);

export default SelectField;
