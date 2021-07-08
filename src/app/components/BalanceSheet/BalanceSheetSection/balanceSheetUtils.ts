import { Asset, Transaction, Account } from '@database/entities';
import { BalanceData } from '@components/BalanceSheet/BalancesByGroup';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { accountTypes } from '@constants/accountTypes';
import { assetTypes } from '@constants/assetTypes';

export const getBalanceForAllAccountsAssets = (
  assets: Asset[],
  accounts: Account[]
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
          getAccountsByType(type, accounts)
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

export const getBalanceForAccounts = (accounts: Account[]) => {
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

        accountTransactions = generateAccountsBalanceInfo(getAccountsByType(type, accounts));

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

export const generateAccountsBalanceInfo = (accounts: Account[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let accountsBalances: any = [];
  accounts.forEach(account => {
    accountsBalances = [...accountsBalances, {
      amount: account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate
        ? account.transactions?.reduce((sum, transaction) => transaction.amount + sum, 0)
        : account.balanceStatements?.[account.balanceStatements?.length - 1].value,
      type: 'Account',
      name: account.name
    }];
  });

  return accountsBalances;
};

export const generateAssetBalanceInfo = (asset: Asset) => ({
  name: asset.name,
  type: 'Asset',
  amount: asset.value,
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
