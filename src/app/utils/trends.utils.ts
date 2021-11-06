import { eachWeekOfInterval, getWeek, isEqual } from 'date-fns';

import { Account, Asset, BalanceStatement, Transaction } from '@database/entities';

import {
  calculateBalanceDifference,
  ChartPeriodType,
  generatePlaceholdersChartPeriod,
  getBalancesByWeeks,
  getTransactionBalanceByWeeks,
} from './balance.utils';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export const getNetWorthTrends = (
  accounts: Account[],
  assets: Asset[],
  dateFrom: Date,
  dateTo: Date,
  balanceGroupFilter: BalanceGroupEnum = BalanceGroupEnum.NET_WORTH
) => {
  const assetsNoSold = assets
    .filter(
      ({ balanceStatements }) =>
        balanceStatements && !balanceStatements?.[balanceStatements.length - 1].sold
    )
    .filter(
      ({ balanceGroup }) =>
        balanceGroupFilter === balanceGroup || balanceGroupFilter === BalanceGroupEnum.NET_WORTH
    );
  const accountsNoClosed = accounts
    .filter(({ closed }) => !closed)
    .filter(
      ({ balanceGroup }) =>
        balanceGroupFilter === balanceGroup || balanceGroupFilter === BalanceGroupEnum.NET_WORTH
    );
  const weeksDates = eachWeekOfInterval(
    {
      start: dateFrom,
      end: dateTo,
    },
    { weekStartsOn: 1 }
  );

  const accountChartBalances = accountsNoClosed.map(account => {
    return account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate ===
      false
      ? getBalancesByWeeks(account.balanceStatements as BalanceStatement[], 52)
      : getTransactionBalanceByWeeks(account.transactions as Transaction[], 52);
  });

  const assetChartBalances = assetsNoSold.map(asset => {
    return asset.balanceStatements && asset.balanceStatements.length > 0
      ? getBalancesByWeeks(asset.balanceStatements, 100)
      : [];
  });

  const chartBalances = [...assetChartBalances, ...accountChartBalances];

  const newWorthBalances = weeksDates
    .map((week, index) => {
      const weekChartBalances = chartBalances
        .reduce(
          (acc, chartBalance) => [
            ...acc,
            ...chartBalance.filter(balance => isEqual(balance.dateWeek || new Date(), week)),
          ],
          []
        )
        .reduce(
          (accWeekChartBalances, weekChartBalances) => ({
            ...accWeekChartBalances,
            balance: accWeekChartBalances.balance + weekChartBalances.balance,
          }),
          {
            balance: 0,
            week: getWeek(week, { weekStartsOn: 1 }),
            dateWeek: week,
            label: getWeek(week, { weekStartsOn: 1 }).toString(),
            id: index,
          }
        );

      return weekChartBalances;
    })
    .reduce(
      (accDiff: ChartPeriodType[], diff, index) => [
        ...accDiff,
        {
          ...diff,
          difference:
            index === 0 ? 0 : calculateBalanceDifference(diff.balance, accDiff[index - 1].balance),
        },
      ],
      []
    );

  return newWorthBalances;
};

export const generateTrendsChartData = (chartData: ChartPeriodType[], numberOfWeeks: number) => {
  return [
    ...generatePlaceholdersChartPeriod(
      chartData?.[0].dateWeek ? chartData?.[0].dateWeek : new Date(),
      numberOfWeeks,
      chartData.length > numberOfWeeks ? numberOfWeeks : chartData.length
    ),
    ...chartData,
  ];
};
