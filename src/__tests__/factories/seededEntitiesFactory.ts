import {
  accountCheckingDetails,
  accountSavingsDetails,
  accountCreditCardDetails,
  accountAutoLoanDetails,
  accountRothIraDetails,
  account401kDetails,
  accountWalletDetails,
} from '@database/seed/demoData/accounts';
import {
  assetSecurityTeslaDetails,
  assetSecurityGamestopDetails,
  assetCryptoBitcoinDetails,
  assetCryptoEthereumDetails,
  assetCollectibleDetails,
  assetVehicleDetails,
} from '@database/seed/demoData/assets';
import {
  accountCheckingTransactionSet,
  accountSavingsTransactionSet,
  accountCreditCardTransactionSet,
} from '@database/seed/demoData/transactions';
import {
  account401kbalanceStatements,
  accountAutoLoanBalanceStatements,
  accountRothIraBalanceStatements,
  accountWalletBalanceStatements,
  assetTeslaBalanceStatements,
  assetGamestopBalanceStatements,
  assetBitcoinBalanceStatements,
  assetEthereumBalanceStatements,
  assetCollectibleBalanceStatements,
  assetVehicleBalanceStatements,
} from '@database/seed/demoData/balanceStatements';
import { fromUnixTime } from 'date-fns';
import {
  CanutinFileAccountBalanceStatementType,
  CanutinFileAssetBalanceStatementType,
  CanutinFileTransactionType,
} from '@appTypes/canutinFile.type';
import { dateInUTC } from '@app/utils/date.utils';

// FIXME: Should be `transactions: CanutinFileTransactionType[]`
const handleTransactionsSet = (transactions: any[]) =>
  transactions.map(transaction => ({
    ...transaction,
    date: dateInUTC(transaction.date),
  }));

const handleSeedBalanceStatements = (
  balanceStatements:
    | CanutinFileAccountBalanceStatementType[]
    | CanutinFileAssetBalanceStatementType[]
) =>
  // The order of the `balanceStatements` in `accountsIndex`/`assetsIndex` is
  // important but the balances in `seedDemoData.ts` are expressed in the opposite
  // order so this function reverses them so we can use them in the tests.
  balanceStatements.reverse().map(balanceStatement => ({
    ...balanceStatement,

    // The `createdAt` timestamps in `seedDemoData.ts` are expressed in Unix
    // timestamps and we need to parse them as Date objects.
    createdAt: fromUnixTime(balanceStatement.createdAt),
  }));

export const seedAccounts = [
  {
    ...accountCheckingDetails,
    accountType: { name: accountCheckingDetails.accountType },
    transactions: handleTransactionsSet(accountCheckingTransactionSet()),
    balanceStatements: [],
  },
  {
    ...accountSavingsDetails,
    accountType: { name: accountSavingsDetails.accountType },
    transactions: handleTransactionsSet(accountSavingsTransactionSet()),
    balanceStatements: [],
  },
  {
    ...accountCreditCardDetails,
    accountType: { name: accountCreditCardDetails.accountType },
    transactions: handleTransactionsSet(accountCreditCardTransactionSet()),
    balanceStatements: [],
  },
  {
    ...accountAutoLoanDetails,
    accountType: { name: accountAutoLoanDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountAutoLoanBalanceStatements),
  },
  {
    ...accountRothIraDetails,
    accountType: { name: accountRothIraDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountRothIraBalanceStatements),
  },
  {
    ...account401kDetails,
    accountType: { name: account401kDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(account401kbalanceStatements),
  },
  {
    ...accountWalletDetails,
    accountType: { name: accountWalletDetails.accountType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(accountWalletBalanceStatements),
  },
];

export const seedAssets = [
  {
    ...assetSecurityTeslaDetails,
    assetType: { name: assetSecurityTeslaDetails.assetType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetTeslaBalanceStatements),
  },
  {
    ...assetSecurityGamestopDetails,
    assetType: { name: assetSecurityGamestopDetails.assetType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetGamestopBalanceStatements),
  },
  {
    ...assetCryptoBitcoinDetails,
    assetType: { name: assetCryptoBitcoinDetails.assetType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetBitcoinBalanceStatements),
  },
  {
    ...assetCryptoEthereumDetails,
    assetType: { name: assetCryptoEthereumDetails.assetType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetEthereumBalanceStatements),
  },
  {
    ...assetCollectibleDetails,
    assetType: { name: assetCollectibleDetails.assetType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetCollectibleBalanceStatements),
  },
  {
    ...assetVehicleDetails,
    assetType: { name: assetVehicleDetails.assetType },
    transactions: [],
    balanceStatements: handleSeedBalanceStatements(assetVehicleBalanceStatements),
  },
];
