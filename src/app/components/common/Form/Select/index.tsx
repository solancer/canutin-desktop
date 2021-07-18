import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import styled from 'styled-components';
import ReactSelect from 'react-select';

import FieldStatus from '@components/common/Form/FieldStatus';

import { StatusEnum } from '@appConstants/misc';

import { selectInput } from './styles';

const CustomSelect = styled(ReactSelect)`
  ${selectInput}
`;

export type GroupedValue = {
  label: string;
  options: SelectFieldValue[];
};

export type SelectFieldValue = {
  value: string | undefined;
  label: string;
};

export interface SelectProps {
  name: string;
  options?: SelectFieldValue[];
  groupedOptions?: GroupedValue[];
  control: Control<Record<string, any>>;
  required?: boolean;
  optional?: boolean;
  defaultFormValue?: string | null;
  placeholder?: string;
  error?: FieldError;
  cta?: () => void;
  isClearable?: boolean;
}

const Select = ({
  name,
  options,
  groupedOptions,
  control,
  required = false,
  optional = false,
  defaultFormValue,
  placeholder = '',
  error,
  cta,
  isClearable = false,
}: SelectProps) => {
  const defaultValue = groupedOptions
    ? groupedOptions[0]?.options[0]?.value
    : options && options[0]?.value;

  const optionValue = (value: string) => options?.find(c => c.value === value);

  const groupedValue = (value: string) =>
    groupedOptions
      ?.find(({ options }) => {
        return options.find(c => c.value === value);
      })
      ?.options.find(c => c.value === value);

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ ref, onChange, value, ...field }) => (
          <CustomSelect
            {...field}
            placeholder={placeholder}
            inputRef={ref}
            inputId={name}
            classNamePrefix="select"
            options={groupedOptions ? groupedOptions : options}
            onChange={(e: SelectFieldValue) => {
              onChange(e?.value);
              cta && cta();
            }}
            isClearable={isClearable}
            value={groupedOptions ? groupedValue(value) : optionValue(value)}
            error={error}
          />
        )}
        defaultValue={
          defaultFormValue !== undefined ? defaultFormValue : optional ? null : defaultValue
        }
        rules={{ required }}
      />
      {error && <FieldStatus status={StatusEnum.NEGATIVE}>{error.message}</FieldStatus>}
    </div>
  );
};

export default Select;
