import React, { useMemo, useCallback } from 'react';
import { useTable, useSortBy, Column, useGlobalFilter, useFilters } from 'react-table';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
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
  rowContainer,
  rowItem,
  autoSizer,
  renderRowCustom,
} from './styles';

const Container = styled.div`
  ${container}
`;

const TableContainer = styled.div`
  ${tableContainer}
`;

const HeaderContainer = styled.div`
  ${headerContainer}
`;

const HeaderItemContainer = styled.div`
  ${headerItemContainer}
`;

const TableSortIcon = styled.div`
  ${tableSortIcon}
`;

const RowContainer = styled.div`
  ${rowContainer}
`;

const RowItem = styled.div`
  ${rowItem}
`;

const AutoSizerCustom = styled(AutoSizer)`
  ${autoSizer}
`;

const RenderRowCustom = styled.div`
  ${renderRowCustom}
`;

interface TransactionsFilterTableProps {
  transactions: Transaction[];
}

const TransactionsFilterTable = ({ transactions }: TransactionsFilterTableProps) => {
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
        sortBy: [{ id: 'date', desc: true }],
      },
      disableSortRemove: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const transactionsCount = useMemo(() => rows.length, [rows]);
  const netBalanceCount = useMemo(
    () =>
      rows.reduce((total, row) => {
        return row.original.amount + total;
      }, 0),
    [rows]
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);

      return (
        <RenderRowCustom
          {...row.getRowProps({
            style,
          })}
        >
          <RowContainer>
            {row.cells.map(cell => {
              return <RowItem {...cell.getCellProps()}>{cell.render('Cell')}</RowItem>;
            })}
          </RowContainer>
        </RenderRowCustom>
      );
    },
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
              {column.render('Header')}
              {/* Add a sort direction indicator */}
              <TableSortIcon>
                {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}
              </TableSortIcon>
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
      />
      <TransactionsFilterTableInfo
        netBalanceCount={netBalanceCount}
        transactionsCount={transactionsCount}
      />
      <TableContainer {...getTableProps()}>
        {RenderHeader()}
        <AutoSizerCustom>
          {({ height, width }) => {
            return (
              <div {...getTableBodyProps()}>
                <FixedSizeList
                  height={height - 50}
                  itemCount={rows.length}
                  itemSize={40}
                  width={width}
                >
                  {RenderRow}
                </FixedSizeList>
              </div>
            );
          }}
        </AutoSizerCustom>
        {rows.length === 0 && <EmptyFilterTable />}
      </TableContainer>
    </Container>
  );
};

export default TransactionsFilterTable;
