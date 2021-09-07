import React from 'react';
import ReactNumberFormatComponent, { NumberFormatPropsBase } from 'react-number-format';

interface NumberFormatProps extends NumberFormatPropsBase {
  excludeFromTotals?: boolean;
}

const NumberFormat = ({ excludeFromTotals, ...props }: NumberFormatProps) => (
  <ReactNumberFormatComponent
    {...props}
    decimalScale={2}
    thousandSeparator
    prefix={props.prefix ? props.prefix : '$'}
  />
);

export default NumberFormat;
