import React from 'react';
import { CellProps } from 'react-table';
import styled from 'styled-components';

import { formatDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities';

import NumberFormat from '@components/common/NumberFormat';

import { amountCell, dateCell, descriptionCell, linkCell } from './styles';

export const AmountCellField = styled(NumberFormat)`
  ${amountCell}
`;

export const DateCellField = styled.span`
  ${dateCell}
`;

export const DescriptionCellField = styled.span`
  ${descriptionCell}
`;

export const LinkCellField = styled.span`
  ${linkCell}
`;

export const DateCell = ({ value }: CellProps<Transaction>) => (
  <DateCellField>{formatDate(value)}</DateCellField>
);

export const AmountCell = ({
  value,
  row: {
    original: { excludeFromTotals },
  },
}: CellProps<Transaction>) => {
  return (
    <AmountCellField
      title={excludeFromTotals ? 'This transaction is excluded from totals' : undefined}
      displayType="text"
      value={value}
      excludeFromTotals={excludeFromTotals}
    />
  );
};

export const DescriptionCell = ({ value }: CellProps<Transaction>) => (
  <DescriptionCellField>{value}</DescriptionCellField>
);

export const LinkCell = ({ value }: CellProps<Transaction>) => (
  <LinkCellField>{value}</LinkCellField>
);