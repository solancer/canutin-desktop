import React from 'react';
import { Controller, Control } from 'react-hook-form';
import styled from 'styled-components';
import Select from 'react-select';

import Field from '@components/common/Form/Field';

import { selectInput } from './styles';

const CustomSelect = styled(Select)`
  ${selectInput}
`;

export type GroupedValue = {
  label: string;
  options: SelectFieldValue[];
};

export type SelectFieldValue = {
  value: string;
  label: string;
};

export interface SelectFieldProps {
  label: string;
  name: string;
  options?: SelectFieldValue[];
  groupedOptions?: GroupedValue[];
  control: Control<Record<string, any>>;
  required?: boolean;
  optional?: boolean;
}

const SelectField = ({
  label,
  name,
  options,
  groupedOptions,
  control,
  required = false,
  optional = false,
}: SelectFieldProps) => {
  const defaultValue = groupedOptions
    ? groupedOptions[0].options[0]?.value
    : options && options[0]?.value;

  const optionValue = (value: string) => options?.find(c => c.value === value);

  const groupedValue = (value: string) =>
    groupedOptions
      ?.find(({ options }) => {
        return options.find(c => c.value === value);
      })
      ?.options.find(c => c.value === value);

  return (
    <Field label={label} name={name} optional={optional}>
      <Controller
        name={name}
        control={control}
        render={({ ref, onChange, value, ...field }) => (
          <CustomSelect
            {...field}
            inputRef={ref}
            classNamePrefix="select"
            options={groupedOptions ? groupedOptions : options}
            onChange={(e: SelectFieldValue) => {
              onChange(e?.value);
            }}
            isClearable={false}
            value={groupedOptions ? groupedValue(value) : optionValue(value)}
          />
        )}
        defaultValue={optional ? null : defaultValue }
        rules={{ required }}
      />
    </Field>
  );
};

export default SelectField;
