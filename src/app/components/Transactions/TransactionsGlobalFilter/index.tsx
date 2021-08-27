import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import styled from 'styled-components';

import { Transaction } from '@database/entities';

import { inputElement } from '@components/common/Form/InputText/styles';

const GlobalInput = styled.input`
  ${inputElement};
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
      placeholder="Type to filter by date, description, category, account or amount"
    />
  );
};

export default TransactionsGlobalFilter;
