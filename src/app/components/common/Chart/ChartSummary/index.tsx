import React from 'react';
import styled from 'styled-components';

import { ChartPeriodType } from '@app/utils/balance.utils';

import { container } from './styles';
import Card, { CardAppearanceEnum } from '../../Card';

const Container = styled.div`
  ${container}
`;

interface ChartSummaryProps {
  activeBalance: ChartPeriodType;
  periodsLength: number;
}

const ChartSummary = ({ periodsLength, activeBalance }: ChartSummaryProps) => {
  const weekSummary = (
    <>
      <Card
        label="Week"
        appearance={CardAppearanceEnum.SECONDARY}
        value={`${activeBalance.label} of ${activeBalance.dateWeek?.getFullYear()}`}
      />
      <Card
        label="Difference"
        appearance={CardAppearanceEnum.SECONDARY}
        value={`${activeBalance.difference}%`}
      />
      <Card
        label="Balance"
        appearance={CardAppearanceEnum.SECONDARY}
        value={activeBalance.balance}
        isCurrency
      />
    </>
  );

  const monthsSummary = (
    <>
      <Card
        label="Income"
        appearance={CardAppearanceEnum.SECONDARY}
        value={activeBalance?.income}
        isCurrency
      />
      <Card
        label="Expenses"
        appearance={CardAppearanceEnum.SECONDARY}
        value={activeBalance?.expenses}
        isCurrency
      />
      <Card
        label="Surplus"
        appearance={CardAppearanceEnum.SECONDARY}
        value={activeBalance?.surplus}
        isCurrency
      />
    </>
  );

  return <Container periodsLength={periodsLength}>
    {activeBalance.dateWeek ? weekSummary : monthsSummary}
  </Container>;
};

export default ChartSummary;
