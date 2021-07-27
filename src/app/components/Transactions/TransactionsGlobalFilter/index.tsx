import React, { useState, useEffect } from 'react';
import { useAsyncDebounce, TableState } from 'react-table';
import styled from 'styled-components';

import { Transaction } from '@database/entities';

import { globalInput } from './styles';

const GlobalInput = styled.input`
  ${globalInput}
`;

interface TransactionsGlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: (e: any) => void;
  transactionsData: Transaction[];
}

const TransactionsGlobalFilter = ({
  globalFilter,
  setGlobalFilter,
  transactionsData,
}: TransactionsGlobalFilterProps) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    setGlobalFilter(value || undefined);
  }, [transactionsData]);

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
};

export default TransactionsGlobalFilter;
