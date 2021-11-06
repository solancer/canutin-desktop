import {
  isAfter,
  isBefore,
  eachWeekOfInterval,
  subWeeks,
  getWeek,
  endOfWeek,
  min,
  max,
  sub,
  eachMonthOfInterval,
  format,
  isEqual,
  startOfWeek,
} from 'date-fns';
import merge from 'deepmerge';

import {
  Asset,
  Account,
  Transaction,
  BalanceStatement,
  AssetBalanceStatement,
} from '@database/entities';
import { BalanceData, AccountAssetBalance } from '@components/BalanceSheet/BalancesByGroup';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { TrailingCashflowSegmentsEnum } from '@app/components/BigPicture/TrailingCashflow';

export const getBalanceForAssetByBalanceGroup = (assets: Asset[]) => {
  const assetsNoSold = assets.filter(
    ({ balanceStatements }) =>
      balanceStatements && !balanceStatements?.[balanceStatements.length - 1].sold
  );

  return assetsNoSold.reduce(
    (listOfBalancesByGroup, asset) => {
      let balanceData = listOfBalancesByGroup?.[asset.balanceGroup]?.[asset.assetType.name];

      if (balanceData) {
        balanceData = [...balanceData, generateAssetBalanceInfo(asset)].sort(
          (balanceSheetA: AccountAssetBalance, balanceSheetB: AccountAssetBalance) =>
            balanceSheetB.amount - balanceSheetA.amount
        );
      } else {
        balanceData = [generateAssetBalanceInfo(asset)];
      }

      return {
        ...listOfBalancesByGroup,
        [asset.balanceGroup]: {
          ...listOfBalancesByGroup[asset.balanceGroup],
          [asset.assetType.name]: [...balanceData],
        },
      };
    },
    {
      [BalanceGroupEnum.CASH]: {},
      [BalanceGroupEnum.DEBT]: {},
      [BalanceGroupEnum.INVESTMENTS]: {},
      [BalanceGroupEnum.OTHER_ASSETS]: {},
    } as BalanceData
  );
};

export const getBalanceForAccountsByBalanceGroup = (accounts: Account[]) => {
  const accountsNoClosed = accounts.filter(({ closed }) => !closed);

  return accountsNoClosed.reduce(
    (listOfBalancesByGroup, account) => {
      let balanceData = listOfBalancesByGroup?.[account.balanceGroup]?.[account.accountType.name];

      if (balanceData) {
        balanceData = [
          ...balanceData,
          generateAccountBalanceInfo(account) as AccountAssetBalance,
        ].sort(
          (balanceSheetA: AccountAssetBalance, balanceSheetB: AccountAssetBalance) =>
            balanceSheetB.amount - balanceSheetA.amount
        );
      } else {
        balanceData = [generateAccountBalanceInfo(account) as AccountAssetBalance];
      }

      return {
        ...listOfBalancesByGroup,
        [account.balanceGroup]: {
          ...listOfBalancesByGroup[account.balanceGroup],
          [account.accountType.name]: [...balanceData],
        },
      };
    },
    {
      [BalanceGroupEnum.CASH]: {},
      [BalanceGroupEnum.DEBT]: {},
      [BalanceGroupEnum.INVESTMENTS]: {},
      [BalanceGroupEnum.OTHER_ASSETS]: {},
    } as BalanceData
  );
};

export const generateAccountBalanceInfo = (account: Account) => ({
  ...account,
  amount: account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate
    ? account.transactions?.reduce((sum, transaction) => transaction.amount + sum, 0)
    : account.balanceStatements?.[account.balanceStatements?.length - 1].value,
  type: 'Account',
  name: account.name,
  id: account.id,
});

export const generateAssetBalanceInfo = (asset: Asset) => ({
  ...asset,
  name: asset.name,
  type: 'Asset',
  amount: asset.balanceStatements
    ? asset.balanceStatements?.[asset.balanceStatements.length - 1].value
    : 0,
});

export type TotalBalanceType = { [value in BalanceGroupEnum]: number } | undefined;

export const getTotalBalanceByGroup = (assets: Asset[], accounts: Account[]) => {
  const assetsBalancesListData = assets && getBalanceForAssetByBalanceGroup(assets);
  const accountBalancesListData = accounts && getBalanceForAccountsByBalanceGroup(accounts);
  const allBalancesListData =
    (assetsBalancesListData || accountBalancesListData) &&
    merge(
      assetsBalancesListData ? assetsBalancesListData : {},
      accountBalancesListData ? accountBalancesListData : {}
    );

  return (
    allBalancesListData &&
    Object.keys(BalanceGroupEnum).reduce(
      (acc, value) => {
        if (Number(value) === BalanceGroupEnum.NET_WORTH) {
          acc[BalanceGroupEnum.NET_WORTH] = Object.keys(acc).reduce(
            (total, key) => total + acc[(Number(key) as unknown) as BalanceGroupEnum],
            0
          );
        } else {
          const balanceData = allBalancesListData[(value as unknown) as BalanceGroupEnum];
          const totalAmount = balanceData
            ? Object.keys(balanceData).reduce((acc, assetTypeKey) => {
                const totalBalance = balanceData[assetTypeKey].reduce((acc, assetTypeBalance) => {
                  return acc + assetTypeBalance.amount;
                }, 0);

                return acc + totalBalance;
              }, 0)
            : 0;
          acc[Number(value) as BalanceGroupEnum] = Math.floor(totalAmount);
        }
        return acc;
      },
      {
        [BalanceGroupEnum.CASH]: 0,
        [BalanceGroupEnum.DEBT]: 0,
        [BalanceGroupEnum.INVESTMENTS]: 0,
        [BalanceGroupEnum.OTHER_ASSETS]: 0,
        [BalanceGroupEnum.NET_WORTH]: 0,
      }
    )
  );
};

export const getSelectedTransactions = (transactions: Transaction[], from: Date, to: Date) => {
  return transactions.filter(
    transaction =>
      (isBefore(from, transaction.date) || isEqual(from, transaction.date)) &&
      isAfter(to, transaction.date)
  );
};

export type TransactionsTrailingCashflowType = {
  month: Date;
  income: number;
  expenses: number;
  surplus: number;
  id: number;
};

export const getTransactionsTrailingCashflow = (transactions: Transaction[]) => {
  const transactionsNotExcludedFromTotals = transactions.filter(
    transaction => !transaction.excludeFromTotals
  );

  if (transactionsNotExcludedFromTotals.length === 0) {
    return [];
  }

  const monthDates = eachMonthOfInterval({
    start: transactionsNotExcludedFromTotals[transactionsNotExcludedFromTotals.length - 1].date,
    end: new Date(),
  });

  return monthDates.reduce((acc: TransactionsTrailingCashflowType[], monthDate, index) => {
    const monthlyTransactions = getSelectedTransactions(
      transactionsNotExcludedFromTotals,
      monthDate,
      monthDates[index + 1] ? monthDates[index + 1] : new Date()
    );
    const income = monthlyTransactions.reduce(
      (acc, transaction) => (transaction.amount > 0 ? transaction.amount + acc : acc),
      0
    );
    const expenses = monthlyTransactions.reduce(
      (acc, transaction) => (transaction.amount < 0 ? transaction.amount + acc : acc),
      0
    );
    const surplus = expenses + income;

    return [
      ...acc,
      {
        month: monthDate,
        income,
        expenses,
        surplus,
        id: index,
      },
    ];
  }, []);
};

export const getTransactionTrailingCashflowAverage = (
  trailingCashflow: TransactionsTrailingCashflowType[],
  option: TrailingCashflowSegmentsEnum
) => {
  if (option === TrailingCashflowSegmentsEnum.LAST_12_MONTHS) {
    const afterDate = sub(new Date(), { months: 13 });
    const beforeDate = sub(new Date(), { months: 1 });

    return trailingCashflow
      .filter(({ month }) => isAfter(month, afterDate) && isBefore(month, beforeDate))
      .reduce(
        (acc, { expenses, income, surplus }) => {
          return [acc[0] + income / 12, acc[1] + expenses / 12, acc[2] + surplus / 12];
        },
        [0, 0, 0]
      );
  }

  if (option === TrailingCashflowSegmentsEnum.LAST_6_MONTHS) {
    const afterDate = sub(new Date(), { months: 7 });
    const beforeDate = sub(new Date(), { months: 1 });

    return trailingCashflow
      .filter(({ month }) => isAfter(month, afterDate) && isBefore(month, beforeDate))
      .reduce(
        (acc, { expenses, income, surplus }) => {
          return [acc[0] + income / 6, acc[1] + expenses / 6, acc[2] + surplus / 6];
        },
        [0, 0, 0]
      );
  }

  return [0, 0, 0];
};

export const getSelectedBalanceStatements = (
  assetBalanceStatements: AssetBalanceStatement[],
  from: Date,
  to: Date
) => {
  return assetBalanceStatements.filter(
    assetBalanceStatement =>
      isBefore(from, assetBalanceStatement.updatedAt) &&
      isAfter(to, assetBalanceStatement.updatedAt)
  );
};

export const getTransactionsBalance = (transactions: Transaction[]) => {
  return transactions.reduce((acc, transaction) => transaction.amount + acc, 0);
};

export const getSelectedBalanceStatementValue = (
  balanceStatements: (BalanceStatement | AssetBalanceStatement)[],
  from: Date,
  to: Date
) => {
  return balanceStatements
    .filter(
      balanceStatement =>
        isBefore(from, balanceStatement.createdAt) && isAfter(to, balanceStatement.createdAt)
    )
    .slice(-1)[0]?.value;
};

export type ChartPeriodType = {
  id: number;
  balance: number;
  label: string;
  month?: Date;
  income?: number;
  expenses?: number;
  surplus?: number;
  week?: number;
  dateWeek?: Date;
  difference?: number;
  accountBalanceWeek?: number;
  assetBalanceWeek?: number;
};

export const calculateBalanceDifference = (originalBalance: number, newBalance: number) => {
  if (originalBalance === newBalance || newBalance === 0) {
    return 0;
  } else {
    return Number((((originalBalance - newBalance) / Math.abs(newBalance)) * 100).toFixed(2));
  }
};

export const getTransactionBalanceByWeeks = (
  transactions: Transaction[],
  weeks: number
): ChartPeriodType[] => {
  if (transactions.length === 0) {
    return [];
  }

  const weeksDates = eachWeekOfInterval(
    {
      start: min([transactions[0].date, subWeeks(new Date(), weeks)]),
      end: new Date(),
    },
    { weekStartsOn: 1 }
  );
  return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
    // FIXME: To accurately calculate the balance we need to sum the previous transactions
    // outside of the current selected date range.
    const startingBalance = 0;
    // Get transactions from -weeks ago to current week and calculate balance
    const periodBalance = getTransactionsBalance(
      getSelectedTransactions(
        transactions,
        startOfWeek(weekDate, { weekStartsOn: 1 }),
        endOfWeek(weekDate, { weekStartsOn: 1 })
      )
    );
    const previousBalance = index === 0 ? startingBalance : acc[index - 1].balance;
    const balance = previousBalance + periodBalance;
    return [
      ...acc,
      {
        week: getWeek(weekDate, { weekStartsOn: 1 }),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate, { weekStartsOn: 1 }).toString(),
        difference: index === 0 ? 0 : calculateBalanceDifference(balance, previousBalance),
        id: index,
      },
    ];
  }, []);
};

export const getBalancesByWeeks = (
  balanceStatements: BalanceStatement[] | AssetBalanceStatement[],
  weeks: number
): ChartPeriodType[] => {
  const weeksDates = eachWeekOfInterval(
    {
      start: min([balanceStatements[0].createdAt, subWeeks(new Date(), weeks)]),
      end: new Date(),
    },
    {
      weekStartsOn: 1,
    }
  );

  return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
    // Get transactions from -weeks ago to current week and calculate balance
    const balanceStatementValue = getSelectedBalanceStatementValue(
      balanceStatements,
      startOfWeek(weekDate, { weekStartsOn: 1 }),
      endOfWeek(weekDate, { weekStartsOn: 1 })
    );
    const balance = balanceStatementValue
      ? balanceStatementValue
      : acc[index - 1]?.balance
      ? acc[index - 1].balance
      : 0;

    return [
      ...acc,
      {
        week: getWeek(weekDate, { weekStartsOn: 1 }),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate, { weekStartsOn: 1 }).toString(),
        difference: index === 0 ? 0 : calculateBalanceDifference(balance, acc[index - 1].balance),
        id: index,
      },
    ];
  }, []);
};

export const generatePlaceholdersChartPeriod = (
  from: Date,
  weeks: number,
  weeksOffset: number
): ChartPeriodType[] => {
  if (weeks === weeksOffset) {
    return [];
  } else {
    const weeksDates = eachWeekOfInterval(
      {
        start: sub(from, { weeks: weeks - weeksOffset + 1 }),
        end: sub(from, { weeks: 1 }),
      },
      { weekStartsOn: 1 }
    );

    return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
      const label = getWeek(weekDate, { weekStartsOn: 1 }).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      }); // From "01" to "52"

      return [
        ...acc,
        {
          week: getWeek(weekDate, { weekStartsOn: 1 }),
          balance: 0,
          dateWeek: weekDate,
          label: label,
          difference: 0,
          id: index + weeksOffset,
        },
      ];
    }, []);
  }
};

export const generatePlaceholdersChartMonthPeriod = (
  from: Date,
  months: number,
  monthsOffset: number
): ChartPeriodType[] => {
  if (months === monthsOffset) {
    return [];
  } else {
    const monthsDates = eachMonthOfInterval({
      start: sub(from, { months: months - monthsOffset + 1 }),
      end: sub(from, { months: 1 }),
    });

    return monthsDates.reduce((acc: ChartPeriodType[], monthDate, index) => {
      const label =
        getWeek(monthDate) === 1
          ? `${format(monthDate, 'MMM')} '${format(monthDate, 'yy')}`
          : format(monthDate, 'MMM'); // From "Jan '21" to "Dec"

      return [
        ...acc,
        {
          month: monthDate,
          balance: 0,
          label: label,
          expenses: 0,
          income: 0,
          surplus: 0,
          id: index + monthsOffset,
        },
      ];
    }, []);
  }
};

export const proportionBetween = (num1: number, num2: number) => {
  return Math.round((!(num1 === 0) && !(num2 === 0) ? (num1 * 100) / num2 : 0) * 1e2) / 1e2;
};
