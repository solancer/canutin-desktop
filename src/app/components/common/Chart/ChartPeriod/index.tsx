import React from 'react';
import styled from 'styled-components';

import { proportionBetween } from '@app/utils/balance.utils';
import NumberFormat from '@components/common/NumberFormat';

import { ThemeProvider } from 'styled-components';
import {
  period,
  periodBalance,
  periodBar,
  bar,
  barPositive,
  barNegative,
  periodBarPlaceholder,
  periodLabel,
  periodDivider,
  periodBalanceLabel,
} from './styles';

const Period = styled.div`
  ${period}
`;
const PeriodBalance = styled.div`
  ${periodBalance}
`;
const PeriodBar = styled.div`
  ${periodBar}
`;
const PeriodBalanceLabel = styled(NumberFormat)`
  ${periodBalanceLabel}
`;
const Bar = styled.div`
  ${bar}
`;
const BarPositive = styled(Bar)`
  ${barPositive}
`;
const BarNegative = styled(Bar)`
  ${barNegative}
`;
const PeriodBarPlaceholder = styled.div`
  ${periodBarPlaceholder}
`;
const PeriodLabel = styled.time`
  ${periodLabel}
`;
const PeriodDivider = styled.hr`
  ${periodDivider}
`;

interface ChartPeriodProps {
  id: number;
  balance: number;
  balanceProportion: string;
  peakPositiveBalance: number;
  peakNegativeBalance: number;
  isActive: boolean;
  isCurrentPeriod: boolean;
  isStartOfYear: boolean;
  periodLength: number;
  label: string;
  handleMouseEnter: (id: number) => void;
}

const ChartPeriod = ({
  id,
  balance,
  peakPositiveBalance,
  peakNegativeBalance,
  balanceProportion,
  isActive,
  isCurrentPeriod,
  isStartOfYear,
  periodLength,
  label,
  handleMouseEnter,
}: ChartPeriodProps) => {
  const isBalancePositive = balance >= 0;
  const isCompact = periodLength > 12;
  const isBalanceLabelVisible = isBalancePositive
    ? isCurrentPeriod || (peakPositiveBalance !== 0 && peakPositiveBalance === balance)
    : isCurrentPeriod || peakNegativeBalance === balance;

  return (
    <ThemeProvider
      theme={{
        isActive,
        isCurrentPeriod,
        isStartOfYear,
        periodLength,
        label,
        balance,
        isBalanceLabelVisible,
      }}
    >
      <Period onMouseEnter={() => handleMouseEnter(id)} data-testid="chart-period">
        <PeriodBalance proportion={balanceProportion}>
          {isBalancePositive ? (
            <>
              <PeriodBar>
                {!isCompact && (
                  <PeriodBalanceLabel value={Math.floor(balance)} displayType="text" />
                )}
                <BarPositive height={proportionBetween(balance, peakPositiveBalance)} />
              </PeriodBar>
              <PeriodDivider />
              <PeriodBarPlaceholder />
            </>
          ) : (
            <>
              <PeriodBarPlaceholder />
              <PeriodDivider />
              <PeriodBar>
                <BarNegative height={proportionBetween(balance, peakNegativeBalance)} />
                {!isCompact && (
                  <PeriodBalanceLabel value={Math.floor(balance)} displayType="text" />
                )}
              </PeriodBar>
            </>
          )}
        </PeriodBalance>
        {periodLength < 54 && <PeriodLabel>{label}</PeriodLabel>}
      </Period>
    </ThemeProvider>
  );
};

export default ChartPeriod;
