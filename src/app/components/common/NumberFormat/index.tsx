import React from 'react';
import ReactNumberFormatComponent, { NumberFormatPropsBase } from 'react-number-format';

const NumberFormat = (props: NumberFormatPropsBase) => (
  <ReactNumberFormatComponent
    {...props}
    allowNegative
    decimalScale={2}
    thousandSeparator
    prefix="$"
  />
);

export default NumberFormat;
