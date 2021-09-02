import {
  isAfter,
  isBefore,
  eachWeekOfInterval,
  subWeeks,
  getWeek,
  endOfWeek,
  max,
  sub,
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
    transaction => isBefore(from, transaction.date) && isAfter(to, transaction.date)
  );
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
  balanceStatements: BalanceStatement[],
  from: Date,
  to: Date
) => {
  return balanceStatements
    .filter(
      balanceStatement =>
        isBefore(from, balanceStatement.createdAt) && isAfter(to, balanceStatement.createdAt)
    )
    .slice(-1)[0].value;
};

export const getSelectedAssetBalanceStatementValue = (
  balanceStatements: AssetBalanceStatement[],
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
  week: number;
  dateWeek: Date;
  balance: number;
  difference: number;
  label: string;
  id: number;
};

export const calculateBalanceDifference = (originalBalance: number, newBalance: number) => {
  if (originalBalance === newBalance) {
    return 0;
  } else {
    if (originalBalance > 0) {
      return Number((((originalBalance - newBalance) / originalBalance) * 100).toFixed(2));
    } else {
      return Number((((newBalance - originalBalance) / originalBalance) * 100).toFixed(2));
    }
  }
};

export const getTransactionBalanceByWeeks = (
  transactions: Transaction[],
  weeks: number
): ChartPeriodType[] => {
  if (transactions.length === 0) {
    return [];
  }

  const weeksDates = eachWeekOfInterval({
    start: max([transactions[0].date, subWeeks(new Date(), weeks)]),
    end: new Date(),
  });
  return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
    // Get transactions from -weeks ago to current week and calculate balance
    const balance = getTransactionsBalance(
      getSelectedTransactions(transactions, weekDate, endOfWeek(weekDate, { weekStartsOn: 1 }))
    );
    return [
      ...acc,
      {
        week: getWeek(weekDate),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate).toString(),
        difference: index === 0 ? 0 : calculateBalanceDifference(balance, acc[index - 1].balance),
        id: index,
      },
    ];
  }, []);
};

export const getAccountBalancesByWeeks = (
  balanceStatements: BalanceStatement[],
  weeks: number
): ChartPeriodType[] => {
  const filterBalanceStatements = balanceStatements.filter(({ autoCalculate }) => !autoCalculate);
  const weeksDates = eachWeekOfInterval(
    {
      start: max([filterBalanceStatements[0].createdAt, subWeeks(new Date(), weeks)]),
      end: new Date(),
    },
    {
      weekStartsOn: 1,
    }
  );

  return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
    // Get transactions from -weeks ago to current week and calculate balance
    const balanceStatementValue = getSelectedBalanceStatementValue(
      filterBalanceStatements,
      weekDate,
      endOfWeek(weekDate, { weekStartsOn: 1 })
    );
    const balance = balanceStatementValue ? balanceStatementValue : 0;

    return [
      ...acc,
      {
        week: getWeek(weekDate),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate).toString(),
        difference: index === 0 ? 0 : calculateBalanceDifference(balance, acc[index - 1].balance),
        id: index,
      },
    ];
  }, []);
};

export const getAssetBalancesByWeeks = (
  balanceStatements: AssetBalanceStatement[],
  weeks: number
): ChartPeriodType[] => {
  const weeksDates = eachWeekOfInterval(
    {
      start: max([balanceStatements[0].createdAt, subWeeks(new Date(), weeks)]),
      end: new Date(),
    },
    {
      weekStartsOn: 1,
    }
  );

  return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
    // Get transactions from -weeks ago to current week and calculate balance
    const balanceStatementValue = getSelectedAssetBalanceStatementValue(
      balanceStatements,
      weekDate,
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
        week: getWeek(weekDate),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate).toString(),
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
    const weeksDates = eachWeekOfInterval({
      start: sub(from, { weeks: weeks - weeksOffset + 1 }),
      end: sub(from, { weeks: 1 }),
    });

    return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
      return [
        ...acc,
        {
          week: getWeek(weekDate),
          balance: 0,
          dateWeek: weekDate,
          label: getWeek(weekDate).toString(),
          difference: 0,
          id: index + weeksOffset,
        },
      ];
    }, []);
  }
};
