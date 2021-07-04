import { Asset, Transaction, Account } from '@database/entities';
import { BalanceData } from '@components/BalanceSheet/BalancesByGroup';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { accountTypes } from '@constants/accountTypes';
import { assetTypes } from '@constants/assetTypes';

export const getBalanceForAllAccountsAssets = (
  assets: Asset[],
  transactions: Transaction[]
): BalanceData | undefined => {
  const listOfBalancesByGroup = Object.keys(BalanceGroupEnum).reduce(
    (listOfBalancesByGroup, balanceGroup) => {
      if (isNaN(Number(balanceGroup))) {
        return listOfBalancesByGroup;
      }

      const types = getTypesByBalanceGroup(Number(balanceGroup));
      const typeList: Record<string, unknown> = {};
      let accountTransactions: Record<string, unknown>[] = [];
      let assetTransactions: Record<string, unknown>[] = [];
      types.forEach(type => {
        accountTransactions = [];
        assetTransactions = [];

        assetTransactions = [
          ...getAssetByType(type, assets).map(asset => generateAssetBalanceInfo(asset)),
        ];

        accountTransactions = generateAccountsBalanceInfo(
          getTransactionsByType(type, transactions)
        );

        if (accountTransactions.length > 0 || assetTransactions.length > 0) {
          typeList[type] = [...accountTransactions, ...assetTransactions];
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
  const listOfBalancesByGroup = Object.keys(BalanceGroupEnum).reduce(
    (listOfBalancesByGroup, balanceGroup) => {
      if (isNaN(Number(balanceGroup))) {
        return listOfBalancesByGroup;
      }

      const types = getTypesByBalanceGroup(Number(balanceGroup));
      const typeList: Record<string, unknown> = {};
      let assetTransactions: Record<string, unknown>[] = [];
      types.forEach(type => {
        assetTransactions = [];

        assetTransactions = [
          ...getAssetByType(type, assets).map(asset => generateAssetBalanceInfo(asset)),
        ];

        if (assetTransactions.length > 0) {
          typeList[type] = [...assetTransactions];
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

export const getBalanceForAccounts = (transactions: Transaction[]) => {
  const listOfBalancesByGroup = Object.keys(BalanceGroupEnum).reduce(
    (listOfBalancesByGroup, balanceGroup) => {
      if (isNaN(Number(balanceGroup))) {
        return listOfBalancesByGroup;
      }

      const types = getTypesByBalanceGroup(Number(balanceGroup));
      const typeList: Record<string, unknown> = {};
      let accountTransactions: Record<string, unknown>[] = [];
      types.forEach(type => {
        accountTransactions = [];

        accountTransactions = generateAccountsBalanceInfo(
          getTransactionsByType(type, transactions)
        );

        if (accountTransactions.length > 0) {
          typeList[type] = accountTransactions;
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

export const generateAccountsBalanceInfo = (transactions: Transaction[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let accountsBalances: any;
  transactions.forEach(transaction => {
    if (accountsBalances && accountsBalances[transaction.account.name]) {
      accountsBalances[transaction.account.name].amount =
        accountsBalances[transaction.account.name].amount + transaction.amount;
    } else {
      if (accountsBalances) {
        accountsBalances[transaction.account.name] = { amount: transaction.amount };
      } else {
        accountsBalances = { [transaction.account.name]: { amount: transaction.amount } };
      }
    }
  });

  return accountsBalances
    ? Object.keys(accountsBalances).map(accountName => ({
        name: accountName,
        type: 'Account',
        amount: accountsBalances[accountName].amount,
      }))
    : [];
};

export const generateAssetBalanceInfo = (asset: Asset) => ({
  name: asset.name,
  type: 'Asset',
  amount: asset.value,
});

export const getTransactionsByType = (type: string, transactions: Transaction[]) =>
  transactions.filter(transaction => transaction.account.accountType.name === type);

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
