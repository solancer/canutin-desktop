import React, { useState, useEffect, useContext } from 'react';
import { useAsyncDebounce } from 'react-table';
import styled from 'styled-components';

import { Transaction } from '@database/entities';
import { TransactionsContext, filterOptions } from '@app/context/transactionsContext';

import { inputElement } from '@components/common/Form/InputText/styles';
import { CustomSelect } from '@components/common/Form/Select';
import { container } from './styles';

const Container = styled.div`
  ${container}
`;
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
  const { filterOption, setFilterOption } = useContext(TransactionsContext);
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    setGlobalFilter(value || undefined);
  }, [transactionsData]);

  return (
    <Container>
      <GlobalInput
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Type to filter by date, description, category, account or amount"
      />
      <CustomSelect
        options={filterOptions}
        value={filterOption}
        onChange={setFilterOption}
        isSearchable={false}
        classNamePrefix="select"
      />
    </Container>
  );
};

export default TransactionsGlobalFilter;
