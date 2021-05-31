import React from 'react';

import Field from '@components/common/Form/Field';
import Select, { SelectProps } from '@components/common/Select';

export interface SelectFieldProps extends SelectProps {
  innerRef?: React.RefObject<HTMLInputElement>;
  label?: string;
}

const SelectField = (props: SelectFieldProps) => (
  <Field label={props.label} name={props.name} optional={props.optional} innerRef={props.innerRef}>
    <Select {...props} />
  </Field>
);

export default SelectField;
