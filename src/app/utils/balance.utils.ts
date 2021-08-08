import { Asset, Account } from '@database/entities';
import { BalanceData, AccountAssetBalance } from '@components/BalanceSheet/BalancesByGroup';
import { BalanceGroupCardTypeEnum } from '@app/components/common/BalanceGroupCard/constants';
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
      const typeList: Record<string, any> = {};
      let accountTransactions: AccountAssetBalance[] = [];
      let assetTransactions: AccountAssetBalance[] = [];
      types.forEach(type => {
        accountTransactions = [];
        assetTransactions = [];

        assetTransactions = [
          ...getAssetByType(type, assets).map(asset => generateAssetBalanceInfo(asset)),
        ];

        accountTransactions = generateAccountsBalanceInfo(getAccountsByType(type, accounts));

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
          ...getAssetByType(type, assets).map(asset => generateAssetBalanceInfo(asset)),
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

        accountTransactions = generateAccountsBalanceInfo(getAccountsByType(type, accounts));

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
        amount: account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate
          ? account.transactions?.reduce((sum, transaction) => transaction.amount + sum, 0)
          : account.balanceStatements?.[account.balanceStatements?.length - 1].value,
        type: 'Account',
        name: account.name,
      },
    ];
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

export type TotalBalanceType = { [value in BalanceGroupCardTypeEnum]: number } | undefined;

export const getTotalBalanceByGroup = (assets: Asset[], accounts: Account[]) => {
  const balances = getBalanceForAllAccountsAssets(assets, accounts);
  return (
    balances &&
    [...Object.keys(balances), BalanceGroupCardTypeEnum.NET_WORTH].reduce(
      (acc, value) => {
        if (Number(value) === BalanceGroupCardTypeEnum.NET_WORTH) {
          acc[BalanceGroupCardTypeEnum.NET_WORTH] = Object.keys(acc).reduce(
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
          acc[Number(value) as BalanceGroupCardTypeEnum] = totalAmount;
        }
        return acc;
      },
      {
        [BalanceGroupCardTypeEnum.CASH]: 0,
        [BalanceGroupCardTypeEnum.DEBT]: 0,
        [BalanceGroupCardTypeEnum.INVESTMENTS]: 0,
        [BalanceGroupCardTypeEnum.OTHER_ASSETS]: 0,
        [BalanceGroupCardTypeEnum.NET_WORTH]: 0,
      }
    )
  );
};
