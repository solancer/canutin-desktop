import React from 'react';
import styled from 'styled-components';

import Card from '@components/common/Card';

import { TotalBalanceType } from '@app/utils/balance.utils';
import {
  BalanceGroupEnum,
  balanceGroupLabels,
  balanceGroupApperances,
} from '@enums/balanceGroup.enum';
import Section from '@components/common/Section';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface BigPictureSummaryProps {
  totalBalance: TotalBalanceType;
}

const BigPictureSummary = ({ totalBalance }: BigPictureSummaryProps) => (
  <Section title="Summary" dataTestId="big-picture-summary">
    <Container>
      <Card
        label={balanceGroupLabels[BalanceGroupEnum.NET_WORTH]}
        appearance={balanceGroupApperances[BalanceGroupEnum.NET_WORTH]}
        value={totalBalance?.[BalanceGroupEnum.NET_WORTH] || 0}
        isCurrency
      />
      <Card
        label={balanceGroupLabels[BalanceGroupEnum.CASH]}
        appearance={balanceGroupApperances[BalanceGroupEnum.CASH]}
        value={totalBalance?.[BalanceGroupEnum.CASH] || 0}
        isCurrency
      />
      <Card
        label={balanceGroupLabels[BalanceGroupEnum.INVESTMENTS]}
        appearance={balanceGroupApperances[BalanceGroupEnum.INVESTMENTS]}
        value={totalBalance?.[BalanceGroupEnum.INVESTMENTS] || 0}
        isCurrency
      />
      <Card
        label={balanceGroupLabels[BalanceGroupEnum.DEBT]}
        appearance={balanceGroupApperances[BalanceGroupEnum.DEBT]}
        value={totalBalance?.[BalanceGroupEnum.DEBT] || 0}
        isCurrency
      />
      <Card
        label={balanceGroupLabels[BalanceGroupEnum.OTHER_ASSETS]}
        appearance={balanceGroupApperances[BalanceGroupEnum.OTHER_ASSETS]}
        value={totalBalance?.[BalanceGroupEnum.OTHER_ASSETS] || 0}
        isCurrency
      />
    </Container>
  </Section>
);

export default BigPictureSummary;
