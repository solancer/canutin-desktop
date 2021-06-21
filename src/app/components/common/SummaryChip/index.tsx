import React from 'react';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';

import { container, title, amount } from './styles';
import { SummaryChipTypeEnum, getSummaryChipTitle } from './constants';

const Container = styled.div<{ balanceType: SummaryChipTypeEnum }>`
  ${container}
`;

const Title = styled.div`
  ${title}
`;

const Amount = styled(NumberFormat)`
  ${amount}
`;

interface SummaryChipProps {
  amount: number;
  type: SummaryChipTypeEnum;
}

const SummaryChip = ({ amount, type }: SummaryChipProps) => (
  <Container balanceType={type}>
    <Title>{getSummaryChipTitle[type]}</Title>
    <Amount thousandSeparator={true} displayType={'text'} prefix={'$'} value={amount} />
  </Container>
);

export default SummaryChip;
