import React from 'react';
import styled from 'styled-components';

import NumberFormat from '@components/common/NumberFormat';

import { container, title, amount } from './styles';
import { BalanceGroupCardTypeEnum, getBalanceGroupCardTitle } from './constants';

const Container = styled.div<{ balanceType: BalanceGroupCardTypeEnum }>`
  ${container}
`;

const Title = styled.div`
  ${title}
`;

const Amount = styled(NumberFormat)`
  ${amount}
`;

interface BalanceGroupCardProps {
  amount: number;
  type: BalanceGroupCardTypeEnum;
}

const BalanceGroupCard = ({ amount, type }: BalanceGroupCardProps) => (
  <Container balanceType={type}>
    <Title>{getBalanceGroupCardTitle[type]}</Title>
    <Amount displayType={'text'} value={amount} />
  </Container>
);

export default BalanceGroupCard;
