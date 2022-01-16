import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useTable, useSortBy, Column, useGlobalFilter, useFilters, SortingRule } from 'react-table';
import styled from 'styled-components';

import { Transaction } from '@database/entities';

import {
  TableOuterContainer,
  TableInnerContainer,
  TableHeaderRow,
  TableHeaderItem,
  TableSortIcon,
  Row,
  RowItem,
  TableEmptyRow,
} from '@app/components/common/Form/Table';
import {
  DateCell,
  AmountCell,
  DescriptionCell,
  CategoryCell,
  AccountCell,
} from './TransactionsFilterTableCells';
import TransactionsGlobalFilter from '../TransactionsGlobalFilter';
import TransactionsFilterSummary from '../TransactionsFilterSummary';
import { filterContainer, transactionRow } from './styles';

const FilterContainer = styled.nav`
  ${filterContainer}
`;
const TransactionRow = styled(Row)`
  ${transactionRow}
`;

interface TransactionsFilterTableProps {
  transactions: Transaction[];
  withoutGlobalFilters?: boolean;
}

const TransactionsFilterTable = ({
  transactions,
  withoutGlobalFilters = false,
}: TransactionsFilterTableProps) => {
  const [sortBy, setSortBy] = useState<SortingRule<Transaction>[]>([{ id: 'date', desc: true }]);
  const transactionsData = useMemo(() => transactions, [transactions]);
  const columns = useMemo(
    () =>
      ([
        {
          Header: 'Date',
          accessor: 'date',
          Cell: DateCell,
          sortType: 'datetime',
        },
        {
          Header: 'Description',
          accessor: 'description',
          Cell: DescriptionCell,
        },
        {
          Header: 'Category',
          accessor: 'category.name',
          Cell: CategoryCell,
        },
        {
          Header: 'Account',
          accessor: 'account.name',
          Cell: AccountCell,
        },
        {
          Header: 'Amount',
          accessor: 'amount',
          Cell: AmountCell,
          sortType: 'basic',
        },
      ] as unknown) as Column<Transaction>[],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data: transactionsData,
      initialState: {
        sortBy,
      },
      disableSortRemove: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  useEffect(() => {
    setSortBy(state.sortBy);
  }, [state]);

  const transactionsCount = useMemo(() => rows.length, [rows]);
  const netBalanceCount = useMemo(
    () =>
      rows.reduce((total, row) => {
        return row.original.amount + total;
      }, 0),
    [rows]
  );

  const RenderRow = React.useCallback(
    () =>
      rows.map(row => {
        prepareRow(row);
        return (
          <TransactionRow
            {...row.getRowProps()}
            isPending={row.original.pending}
            data-testid="row-transaction"
          >
            {row.cells.map(cell => {
              return (
                <RowItem {...cell.getCellProps()} alignRight={cell.column.Header === 'Amount'}>
                  {cell.render('Cell')}
                </RowItem>
              );
            })}
          </TransactionRow>
        );
      }),
    [prepareRow, rows]
  );
  const RenderHeader = useCallback(
    () =>
      headerGroups.map(headerGroup => (
        <TableHeaderRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            // Add the sorting props to control sorting. For this example
            // we can add them into the header props
            <TableHeaderItem
              alignRight={column.Header === 'Amount'}
              isSorted={column.isSorted}
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              <div>
                {column.render('Header')}
                <TableSortIcon>
                  {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}
                </TableSortIcon>
              </div>
            </TableHeaderItem>
          ))}
        </TableHeaderRow>
      )),
    [headerGroups]
  );

  return (
    <TableOuterContainer>
      <FilterContainer>
        {!withoutGlobalFilters && (
          <TransactionsGlobalFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            transactionsData={transactionsData}
          />
        )}
        <TransactionsFilterSummary
          netBalanceCount={netBalanceCount}
          transactionsCount={transactionsCount}
        />
      </FilterContainer>

      <TableInnerContainer {...getTableProps()}>
        <thead>{RenderHeader()}</thead>
        {rows.length !== 0 && <tbody {...getTableBodyProps()}>{RenderRow()}</tbody>}
        {rows.length === 0 && <TableEmptyRow message="No transactions were found" />}
      </TableInnerContainer>
    </TableOuterContainer>
  );
};

export default TransactionsFilterTable;
