import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useTable, useSortBy, Column, useGlobalFilter, useFilters, SortingRule } from 'react-table';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';

import { Transaction } from '@database/entities';

import { DateCell, AmountCell, DescriptionCell, LinkCell } from './TransactionsFilterTableCells';
import TransactionsGlobalFilter from '../TransactionsGlobalFilter';
import TransactionsFilterTableInfo from '../TransactionsFilterTableInfo';
import EmptyFilterTable from '../EmptyFilterTable';
import {
  container,
  headerContainer,
  headerItemContainer,
  tableContainer,
  tableSortIcon,
  rowItem,
} from './styles';

const Container = styled.div`
  ${container}
`;

const TableContainer = styled.table`
  ${tableContainer}
`;

const HeaderContainer = styled.tr`
  ${headerContainer}
`;

const HeaderItemContainer = styled.th`
  ${headerItemContainer}
`;

const TableSortIcon = styled.div`
  ${tableSortIcon}
`;

const RowItem = styled.td`
  ${rowItem}
`;

interface TransactionsFilterTableProps {
  transactions: Transaction[];
}

const TransactionsFilterTable = ({ transactions }: TransactionsFilterTableProps) => {
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
          Cell: LinkCell,
        },
        {
          Header: 'Account',
          accessor: 'account.name',
          Cell: LinkCell,
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
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <RowItem {...cell.getCellProps()}>{cell.render('Cell')}</RowItem>;
            })}
          </tr>
        );
      }),
    [prepareRow, rows]
  );
  const RenderHeader = useCallback(
    () =>
      headerGroups.map(headerGroup => (
        <HeaderContainer {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            // Add the sorting props to control sorting. For this example
            // we can add them into the header props
            <HeaderItemContainer
              isSorted={column.isSorted}
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              <div>
                {column.render('Header')}
                <TableSortIcon>
                  {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}
                </TableSortIcon>
              </div>
              {/* Add a sort direction indicator */}
            </HeaderItemContainer>
          ))}
        </HeaderContainer>
      )),
    [headerGroups]
  );

  return (
    <Container>
      <TransactionsGlobalFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        transactionsData={transactionsData}
      />
      <TransactionsFilterTableInfo
        netBalanceCount={netBalanceCount}
        transactionsCount={transactionsCount}
      />
      <TableContainer {...getTableProps()}>
        <thead>{RenderHeader()}</thead>
        <tbody {...getTableBodyProps()}>{RenderRow()}</tbody>
      </TableContainer>
      {rows.length === 0 && <EmptyFilterTable />}
    </Container>
  );
};

export default TransactionsFilterTable;
