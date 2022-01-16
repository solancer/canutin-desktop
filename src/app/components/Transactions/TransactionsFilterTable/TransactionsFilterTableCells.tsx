import React from 'react';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { formatDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities';

import Tag from '@components/common/Tag';
import NumberFormat from '@components/common/NumberFormat';

import { amountCell, dateCell, cellField, linkCellField, descriptionCellContainer } from './styles';
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
const DescriptionCellContainer = styled.div`
  ${descriptionCellContainer};
`;

export const DateCell = ({ value }: CellProps<Transaction>) => (
  <DateCellField>{formatDate(value)}</DateCellField>
);

export const AmountCell = ({
  value,
  row: {
    original: { excludeFromTotals, pending },
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
  <DescriptionCellContainer>
    {props.row.original.pending && (
      <Tag title="The transaction has been authorized by your financial institution but hasn't been finalized">
        Pending
      </Tag>
    )}
    <TextLink
      pathname={`transactions/${props.row.original.description}`}
      state={{ transaction: props.row.original }}
      label={value}
    />
  </DescriptionCellContainer>
);

export const AccountCell = ({ value }: CellProps<Transaction>) => {
  return <LinkCellField to={{ pathname: `/account/${value}` }}>{value}</LinkCellField>;
};

export const CategoryCell = ({ value }: CellProps<Transaction>) => {
  return <CellField>{value}</CellField>;
};
