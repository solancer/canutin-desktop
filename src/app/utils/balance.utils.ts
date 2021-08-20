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
import { Asset, Account, Transaction, BalanceStatement, AssetBalanceStatement } from '@database/entities';
import { BalanceData, AccountAssetBalance } from '@components/BalanceSheet/BalancesByGroup';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { accountTypes } from '@constants/accountTypes';
import { assetTypes } from '@constants/assetTypes';

export const getBalanceForAllAccountsAssets = (
  assets: Asset[],
  accounts: Account[]
): BalanceData | undefined => {
  const assetsNoSold = assets.filter(
    ({ balanceStatements }) =>
      balanceStatements && !balanceStatements?.[balanceStatements.length - 1].sold
  );
  const accountsNoClosed = accounts.filter(({ closed }) => !closed);

  const listOfBalancesByGroup = Object.keys(BalanceGroupEnum).reduce(
    (listOfBalancesByGroup, balanceGroup) => {
      if (isNaN(Number(balanceGroup))) {
        return listOfBalancesByGroup;
      }

      const types = getTypesByBalanceGroup(Number(balanceGroup));
      const typeList: Record<string, any> = {};
      let accountTransactions: AccountAssetBalance[] = [];
      let assetTransactions: AccountAssetBalance[] = [];
      types.forEach(type => {
        accountTransactions = [];
        assetTransactions = [];

        assetTransactions = [
          ...getAssetByType(type, assetsNoSold).map(asset => generateAssetBalanceInfo(asset)),
        ];

        accountTransactions = generateAccountsBalanceInfo(
          getAccountsByType(type, accountsNoClosed)
        );

        if (accountTransactions.length > 0 || assetTransactions.length > 0) {
          typeList[type] = [...accountTransactions, ...assetTransactions].sort(
            (balanceSheetA: AccountAssetBalance, balanceSheetB: AccountAssetBalance) =>
              balanceSheetB.amount - balanceSheetA.amount
          );
        }
      });

      return {
        [balanceGroup]: typeList,
        ...listOfBalancesByGroup,
      };
    },
    {}
  );

  return listOfBalancesByGroup;
};

export const getBalanceForAssets = (assets: Asset[]) => {
  const assetsNoSold = assets.filter(
    ({ balanceStatements }) =>
      balanceStatements && !balanceStatements?.[balanceStatements.length - 1].sold
  );
  const listOfBalancesByGroup = Object.keys(BalanceGroupEnum).reduce(
    (listOfBalancesByGroup, balanceGroup) => {
      if (isNaN(Number(balanceGroup))) {
        return listOfBalancesByGroup;
      }

      const types = getTypesByBalanceGroup(Number(balanceGroup));
      const typeList: Record<string, any> = {};
      let assetTransactions: AccountAssetBalance[] = [];
      types.forEach(type => {
        assetTransactions = [];

        assetTransactions = [
          ...getAssetByType(type, assetsNoSold).map(asset => generateAssetBalanceInfo(asset)),
        ];

        if (assetTransactions.length > 0) {
          typeList[type] = [...assetTransactions].sort(
            (balanceSheetA: AccountAssetBalance, balanceSheetB: AccountAssetBalance) =>
              balanceSheetB.amount - balanceSheetA.amount
          );
        }
      });

      return {
        [balanceGroup]: typeList,
        ...listOfBalancesByGroup,
      };
    },
    {}
  );

  return listOfBalancesByGroup;
};

export const getBalanceForAccounts = (accounts: Account[]) => {
  const accountsNoClosed = accounts.filter(({ closed }) => !closed);
  const listOfBalancesByGroup = Object.keys(BalanceGroupEnum).reduce(
    (listOfBalancesByGroup, balanceGroup) => {
      if (isNaN(Number(balanceGroup))) {
        return listOfBalancesByGroup;
      }

      const types = getTypesByBalanceGroup(Number(balanceGroup));
      const typeList: Record<string, any> = {};
      let accountTransactions: AccountAssetBalance[] = [];
      types.forEach(type => {
        accountTransactions = [];

        accountTransactions = generateAccountsBalanceInfo(
          getAccountsByType(type, accountsNoClosed)
        );

        if (accountTransactions.length > 0) {
          typeList[type] = accountTransactions.sort(
            (balanceSheetA: AccountAssetBalance, balanceSheetB: AccountAssetBalance) =>
              balanceSheetB.amount - balanceSheetA.amount
          );
        }
      });

      return {
        [balanceGroup]: typeList,
        ...listOfBalancesByGroup,
      };
    },
    {}
  );

  return listOfBalancesByGroup;
};

export const generateAccountsBalanceInfo = (accounts: Account[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let accountsBalances: any = [];
  accounts.forEach(account => {
    accountsBalances = [
      ...accountsBalances,
      {
        ...account,
        amount: account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate
          ? account.transactions?.reduce((sum, transaction) => transaction.amount + sum, 0)
          : account.balanceStatements?.[account.balanceStatements?.length - 1].value,
        type: 'Account',
        name: account.name,
        id: account.id,
      },
    ];
  });

  return accountsBalances;
};

export const generateAssetBalanceInfo = (asset: Asset) => ({
  ...asset,
  name: asset.name,
  type: 'Asset',
  amount: asset.balanceStatements
    ? asset.balanceStatements?.[asset.balanceStatements.length - 1].value
    : 0,
});

export const getAccountsByType = (type: string, accounts: Account[]) =>
  accounts.filter(account => account.accountType.name === type);

export const getAssetByType = (type: string, assets: Asset[]) =>
  assets.filter(asset => asset.assetType.name === type);

export const getTypesByBalanceGroup = (balanceGroup: BalanceGroupEnum) => [
  ...(assetTypes
    .find(assetType => assetType.balanceGroup === balanceGroup)
    ?.assetTypes.map(assetTypeValue => assetTypeValue.value) || []),
  ...(accountTypes
    .find(accountType => accountType.balanceGroup === balanceGroup)
    ?.accountTypes.map(accountTypes => accountTypes.value) || []),
];

export type TotalBalanceType = { [value in BalanceGroupEnum]: number } | undefined;

export const getTotalBalanceByGroup = (assets: Asset[], accounts: Account[]) => {
  const balances = getBalanceForAllAccountsAssets(assets, accounts);
  return (
    balances &&
    Object.keys(balances).reduce(
      (acc, value) => {
        if (Number(value) === BalanceGroupEnum.NET_WORTH) {
          acc[BalanceGroupEnum.NET_WORTH] = Object.keys(acc).reduce(
            (total, key) => total + acc[(Number(key) as unknown) as BalanceGroupEnum],
            0
          );
        } else {
          const balanceData = balances[(value as unknown) as BalanceGroupEnum];
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

export const getSelectedTransactions = (transactions: Transaction[], from: Date, to: Date) =>
  transactions.filter(
    transaction => isBefore(from, transaction.date) && isAfter(to, transaction.date)
  );

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
    .slice(-1)[0].value;
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
  const weeksDates = eachWeekOfInterval({
    start: max([transactions[0].date, subWeeks(new Date(), weeks)]),
    end: new Date(),
  });
  return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
    // Get transactions from -weeks ago to current week and calculate balance
    const balance = getTransactionsBalance(
      getSelectedTransactions(transactions, weekDate, endOfWeek(weekDate))
    );
    return [
      ...acc,
      {
        week: getWeek(weekDate),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate, { weekStartsOn: 1 }).toString(),
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
      endOfWeek(weekDate)
    );
    const balance = balanceStatementValue ? balanceStatementValue : 0;

    return [
      ...acc,
      {
        week: getWeek(weekDate),
        balance,
        dateWeek: weekDate,
        label: getWeek(weekDate, { weekStartsOn: 1 }).toString(),
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
      endOfWeek(weekDate)
    );
    const balance = balanceStatementValue ? balanceStatementValue : 0;

    return [
      ...acc,
      {
        week: getWeek(weekDate),
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
        start: sub(from, { weeks: weeks - weeksOffset }),
        end: from,
      },
      {
        weekStartsOn: 1,
      }
    );

    return weeksDates.reduce((acc: ChartPeriodType[], weekDate, index) => {
      return [
        ...acc,
        {
          week: getWeek(weekDate),
          balance: 0,
          dateWeek: weekDate,
          label: getWeek(weekDate, { weekStartsOn: 1 }).toString(),
          difference: 0,
          id: index + weeksOffset,
        },
      ];
    }, []);
  }
};
