import React from 'react';
import { Controller, Control, FieldError, RegisterOptions } from 'react-hook-form';
import styled from 'styled-components';

import FieldStatus from '@components/common/Form/FieldStatus';
import NumberFormat from '@components/common/NumberFormat';

import { StatusEnum } from '@appConstants/misc';

import { inputElement } from './styles';

const CustomNumberFormat = styled.input`
  ${inputElement}
`;

export interface InputCurrencyProps {
  name: string;
  control: Control<Record<string, any>>;
  disabled?: boolean;
  defaultFormValue?: string | null;
  error?: FieldError;
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
}

const InputCurrency = ({
  name,
  control,
  disabled = false,
  defaultFormValue,
  error,
  rules,
}: InputCurrencyProps) => (
  <div>
    <Controller
      render={({ value, onChange, name }) => {
        return (
          <NumberFormat
            allowNegative={true}
            decimalScale={2}
            thousandSeparator
            prefix="$"
            value={value}
            id={name}
            onValueChange={values => {
              onChange(values.value);
            }}
            disabled={disabled}
            name={name}
            customInput={CustomNumberFormat}
          />
        );
      }}
      name={name}
      control={control}
      defaultValue={defaultFormValue ? defaultFormValue : null}
      rules={rules}
    />
    {error && <FieldStatus status={StatusEnum.NEGATIVE}>{error.message}</FieldStatus>}
  </div>
);

export default InputCurrency;
