import React from 'react';

import Field from '@components/common/Form/Field';
import Select, { SelectProps } from '@components/common/Select';

export interface SelectFieldProps extends SelectProps {
  label?: string;
}

const SelectField = (props: SelectFieldProps) => (
  <Field label={props.label} name={props.name} optional={props.optional}>
    <Select {...props} />
  </Field>
);

export default SelectField;
