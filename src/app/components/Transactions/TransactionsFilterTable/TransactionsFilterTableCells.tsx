import React, { useContext } from 'react';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { formatDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities';
import { EntitiesContext } from '@app/context/entitiesContext';

import NumberFormat from '@components/common/NumberFormat';

import { amountCell, dateCell, cellField, linkCellField } from './styles';
import TextLink from '@app/components/common/TextLink';

const AmountCellField = styled(NumberFormat)`
  ${amountCell}
`;
const DateCellField = styled.span`
  ${dateCell}
`;
const CellField = styled.p`
  ${cellField}
`;
const LinkCellField = styled(Link)`
  ${linkCellField}
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
    pathname={`transactions/${props.row.original.description}`}
    state={{ transaction: props.row.original }}
    label={value}
  />
);

export const AccountCell = ({ value }: CellProps<Transaction>) => {
  return <LinkCellField to={{ pathname: `/account/${value}` }}>{value}</LinkCellField>;
};

export const CategoryCell = ({ value }: CellProps<Transaction>) => {
  return <CellField>{value}</CellField>;
};
