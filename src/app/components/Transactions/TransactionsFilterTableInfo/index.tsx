import React from 'react';
import styled from 'styled-components';

import NumberFormat from '@components/common/NumberFormat';

import { container, infoContainer, infoTitle, infoCount } from './styles';

const Container = styled.div`
  ${container}
`;

const InfoContainer = styled.div`
  ${infoContainer}
`;

const InfoTitle = styled.div`
  ${infoTitle}
`;

const InfoCountFormat = styled(NumberFormat)`
  ${infoCount}
`;

const InfoCount = styled.div`
  ${infoCount}
`;

interface TransactionsFilterTableInfoProps {
  transactionsCount: number;
  netBalanceCount: number;
}

const TransactionsFilterTableInfo = ({
  netBalanceCount,
  transactionsCount,
}: TransactionsFilterTableInfoProps) => (
  <Container>
    <InfoContainer>
      <InfoTitle>Transactions</InfoTitle>
      <InfoCount>{transactionsCount}</InfoCount>
    </InfoContainer>
    <InfoContainer>
      <InfoTitle>Net balance</InfoTitle>
      <InfoCountFormat value={netBalanceCount} displayType="text" />
    </InfoContainer>
  </Container>
);

export default TransactionsFilterTableInfo;
