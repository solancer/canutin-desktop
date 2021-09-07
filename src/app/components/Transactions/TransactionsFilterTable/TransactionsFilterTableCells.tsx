import React from 'react';
import { CellProps } from 'react-table';
import styled from 'styled-components';

import { formatDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities';

import NumberFormat from '@components/common/NumberFormat';

import { amountCell, dateCell, linkCell } from './styles';
import TextLink from '@app/components/common/TextLink';

const AmountCellField = styled(NumberFormat)`
  ${amountCell}
`;
const DateCellField = styled.span`
  ${dateCell}
`;
const LinkCellField = styled.p`
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

export const DescriptionCell = ({ value, ...props }: CellProps<Transaction>) => (
  <TextLink
    pathname={`transactions/${props.row.original.category.name}/${props.row.original.account.name}/Edit`}
    state={{ transaction: props.row.original }}
    label={value}
  />
);

export const LinkCell = ({ value }: CellProps<Transaction>) => (
  <LinkCellField>{value}</LinkCellField>
);
