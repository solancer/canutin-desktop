import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useTable, useSortBy, Column, useGlobalFilter, useFilters, SortingRule } from 'react-table';
import styled from 'styled-components';

import { Transaction } from '@database/entities';

import { DateCell, AmountCell, DescriptionCell, LinkCell } from './TransactionsFilterTableCells';
import TransactionsGlobalFilter from '../TransactionsGlobalFilter';
import TransactionsFilterSummary from '../TransactionsFilterSummary';
import {
  container,
  filterContainer,
  tableHeaderRow,
  tableHeaderItem,
  tableContainer,
  tableSortIcon,
  row,
  rowItem,
  tableEmptyCard,
} from './styles';
import EmptyCard from '@components/common/EmptyCard';

const Container = styled.div`
  ${container}
`;
const FilterContainer = styled.nav`
  ${filterContainer}
`;
const TableContainer = styled.table`
  ${tableContainer}
`;
const TableHeaderRow = styled.tr`
  ${tableHeaderRow}
`;
const TableHeaderItem = styled.th`
  ${tableHeaderItem}
`;
const TableSortIcon = styled.div`
  ${tableSortIcon}
`;
const Row = styled.tr`
  ${row};
`;
const RowItem = styled.td`
  ${rowItem}
`;
const TableEmptyCard = styled(EmptyCard)`
  ${tableEmptyCard}
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
          <Row {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <RowItem {...cell.getCellProps()}>{cell.render('Cell')}</RowItem>;
            })}
          </Row>
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
            </TableHeaderItem>
          ))}
        </TableHeaderRow>
      )),
    [headerGroups]
  );

  return (
    <Container>
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
      {rows.length === 0 && <TableEmptyCard message="No transactions were found" />}
      {rows.length !== 0 && (
        <TableContainer {...getTableProps()}>
          <thead>{RenderHeader()}</thead>
          <tbody {...getTableBodyProps()}>{RenderRow()}</tbody>
        </TableContainer>
      )}
    </Container>
  );
};

export default TransactionsFilterTable;
