import styled from 'styled-components';

import EmptyCard from '@components/common/EmptyCard';

import {
  tableOuterContainer,
  tableInnerContainer,
  tableHeaderRow,
  tableHeaderItem,
  tableSortIcon,
  row,
  rowItem,
  tableEmptyRowCell,
  tableEmptyRowCard,
} from './styles';

export const TableOuterContainer = styled.div`
  ${tableOuterContainer}
`;
export const TableInnerContainer = styled.table`
  ${tableInnerContainer}
`;
export const TableHeaderRow = styled.tr`
  ${tableHeaderRow}
`;
export const TableHeaderItem = styled.th`
  ${tableHeaderItem}
`;
export const TableSortIcon = styled.div`
  ${tableSortIcon}
`;
export const Row = styled.tr`
  ${row};
`;
export const RowItem = styled.td`
  ${rowItem}
`;

const TableEmptyRowTd = styled.td`
  ${tableEmptyRowCell}
`;
const TableEmptyRowCard = styled(EmptyCard)`
  ${tableEmptyRowCard}
`;
export const TableEmptyRow = ({ message }: { message: string }) => (
  <tbody>
    <tr>
      <TableEmptyRowTd colSpan={1000}>
        <TableEmptyRowCard message={message} />
      </TableEmptyRowTd>
    </tr>
  </tbody>
);
