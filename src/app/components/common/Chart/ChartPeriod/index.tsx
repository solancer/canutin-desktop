import React from 'react';
import { ThemeProvider } from 'styled-components';

import {
  BarNegative,
  BarPositive,
  Period,
  PeriodBalance,
  PeriodBarPlaceholder,
  PeriodBar,
  PeriodLabel,
} from './styles';

const proportionBetween = (num1: number, num2: number) => {
  if (typeof num1 === 'number' && typeof num2 === 'number') {
    return Math.round((!(num1 === 0) && !(num2 === 0) ? (num1 * 100) / num2 : 0) * 1e2) / 1e2;
  }
  throw new Error('proportionBetween() was provided a string and only accepts numbers');
};
interface ChartPeriodProps {
  id: number;
  balance: number;
  balanceProportion: string;
  peakPositiveBalance: number;
  peakNegativeBalance: number;
  isActive: boolean;
  isCurrentPeriod: boolean;
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
  label,
  handleMouseEnter,
}: ChartPeriodProps) => {
  const isBalancePositive = balance >= 0;

  return (
    <ThemeProvider theme={{ isActive, isCurrentPeriod, label, balance }}>
      <Period onMouseEnter={() => handleMouseEnter(id)}>
        <PeriodBalance proportion={balanceProportion}>
          {isBalancePositive ? (
            <>
              <PeriodBar>
                <BarPositive height={proportionBetween(balance, peakPositiveBalance)} />
              </PeriodBar>
              <PeriodBarPlaceholder />
            </>
          ) : (
            <>
              <PeriodBarPlaceholder />
              <PeriodBar>
                <BarNegative height={proportionBetween(balance, peakNegativeBalance)} />
              </PeriodBar>
            </>
          )}
        </PeriodBalance>
        <PeriodLabel>
          {label}
        </PeriodLabel>
      </Period>
    </ThemeProvider>
  );
};

export default ChartPeriod;
