import React from 'react';
import styled from 'styled-components';
import { endOfWeek } from 'date-fns';

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
        value={`${activeBalance.label} of ${endOfWeek(activeBalance.dateWeek!).getFullYear()}`}
      />
      <Card
        label="Difference"
        appearance={CardAppearanceEnum.SECONDARY}
        value={`${activeBalance.difference}%`}
      />
      <Card label="Balance" value={activeBalance.balance} isCurrency />
    </>
  );

  const monthsSummary = (
    <>
      <Card
        label="Income"
        appearance={CardAppearanceEnum.SECONDARY}
        value={activeBalance?.income || 0}
        isCurrency
        dataTestId="chart-summary-income"
      />
      <Card
        label="Expenses"
        appearance={CardAppearanceEnum.SECONDARY}
        value={activeBalance?.expenses || 0}
        isCurrency
        dataTestId="chart-summary-expenses"
      />
      <Card
        label="Surplus"
        value={activeBalance?.surplus || 0}
        isCurrency
        dataTestId="chart-summary-surplus"
      />
    </>
  );

  return (
    <Container periodsLength={periodsLength}>
      {activeBalance.dateWeek ? weekSummary : monthsSummary}
    </Container>
  );
};

export default ChartSummary;
