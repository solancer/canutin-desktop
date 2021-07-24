import React from 'react';

import Field from '@components/common/Form/Field';
import InputCurrency, { InputCurrencyProps } from '@components/common/Form/InputCurrency';

export interface InputCurrencyFieldProps extends InputCurrencyProps {
  innerRef?: React.RefObject<HTMLInputElement>;
  label?: string;
}

const InputCurrencyField = (props: InputCurrencyFieldProps) => (
  <Field label={props.label} name={props.name} innerRef={props.innerRef}>
    <InputCurrency {...props} />
  </Field>
);

export default InputCurrencyField;
