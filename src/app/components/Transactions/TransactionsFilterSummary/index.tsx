import React from 'react';
import styled from 'styled-components';

import { container } from './styles';
import Card, { CardAppearanceEnum } from '@app/components/common/Card';

const Container = styled.div`
  ${container}
`;

interface TransactionsFilterSummaryProps {
  transactionsCount: number;
  netBalanceCount: number;
}

const TransactionsFilterSummary = ({
  netBalanceCount,
  transactionsCount,
}: TransactionsFilterSummaryProps) => (
  <Container>
    <Card label="Transactions" appearance={CardAppearanceEnum.SUMMARY} value={transactionsCount} />
    <Card
      label="Net balance"
      appearance={CardAppearanceEnum.SUMMARY}
      value={netBalanceCount}
      isCurrency={true}
    />
  </Container>
);

export default TransactionsFilterSummary;
