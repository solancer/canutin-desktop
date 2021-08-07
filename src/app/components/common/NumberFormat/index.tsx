import React from 'react';
import ReactNumberFormatComponent, { NumberFormatPropsBase } from 'react-number-format';

interface NumberFormatProps extends NumberFormatPropsBase {
  excludeFromTotals?: boolean;
}

const NumberFormat = ({ excludeFromTotals ,...props }: NumberFormatProps) => (
  <ReactNumberFormatComponent
    {...props}
    allowNegative
    decimalScale={2}
    thousandSeparator
    prefix="$"
  />
);

export default NumberFormat;
