import React from 'react';
import styled from 'styled-components';

import Card, { CardAppearanceEnum } from '@components/common/Card';

import { TotalBalanceType } from '@app/utils/balance.utils';
import {
  BalanceGroupCardTypeEnum,
  getBalanceGroupCardTitle,
} from '@app/components/common/BalanceGroupCard/constants';
import Section from '@app/components/common/Section';

import { container } from './styles';

const Container = styled.div`
  ${container}
`;

interface BigPictureSummaryProps {
  totalBalance: TotalBalanceType;
}

const BigPictureSummary = ({ totalBalance }: BigPictureSummaryProps) => (
  <Section title="Summary">
    <Container>
    <Card
      label={getBalanceGroupCardTitle[BalanceGroupCardTypeEnum.NET_WORTH]}
      value={totalBalance?.[BalanceGroupCardTypeEnum.NET_WORTH] || 0}
      appearance={CardAppearanceEnum.NET_WORTH}
      isCurrency
    />
    <Card
      label={getBalanceGroupCardTitle[BalanceGroupCardTypeEnum.CASH]}
      value={totalBalance?.[BalanceGroupCardTypeEnum.CASH] || 0}
      appearance={CardAppearanceEnum.CASH}
      isCurrency
    />
    <Card
      label={getBalanceGroupCardTitle[BalanceGroupCardTypeEnum.INVESTMENTS]}
      value={totalBalance?.[BalanceGroupCardTypeEnum.INVESTMENTS] || 0}
      appearance={CardAppearanceEnum.INVESTMENTS}
      isCurrency
    />
    <Card
      label={getBalanceGroupCardTitle[BalanceGroupCardTypeEnum.DEBT]}
      value={totalBalance?.[BalanceGroupCardTypeEnum.DEBT] || 0}
      appearance={CardAppearanceEnum.DEBT}
      isCurrency
    />
    <Card
      label={getBalanceGroupCardTitle[BalanceGroupCardTypeEnum.OTHER_ASSETS]}
      value={totalBalance?.[BalanceGroupCardTypeEnum.OTHER_ASSETS] || 0}
      appearance={CardAppearanceEnum.OTHER_ASSETS}
      isCurrency
    />
  </Container>
  </Section>
);

export default BigPictureSummary;
