import React from 'react';
import { render as rtlRender } from '@testing-library/react';

const renderWrapper = (
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  { ...options }: any = {}
) => {
  return rtlRender(ui, { ...options });
};

export default renderWrapper;
