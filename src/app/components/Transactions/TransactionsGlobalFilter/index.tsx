import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import styled from 'styled-components';

import { globalInput } from './styles';

const GlobalInput = styled.input`
  ${globalInput}
`;

interface TransactionsGlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: (e: any) => void;
}

const TransactionsGlobalFilter = ({ globalFilter, setGlobalFilter }: TransactionsGlobalFilterProps) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <GlobalInput
      value={value || ''}
      onChange={e => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder="Search by date, description, category, account or amount"
    />
  );
}

export default TransactionsGlobalFilter;
