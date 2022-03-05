import { AccountRepository } from '@database/repositories/account.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { CategoryRepository } from '@database/repositories/category.repository';
import { AssetRepository } from '@database/repositories/asset.repository';
import { Transaction } from '@database/entities';

import {
  accountCheckingDetails,
  accountSavingsDetails,
  accountCreditCardDetails,
  accountAutoLoanDetails,
  accountRothIraDetails,
  account401kDetails,
  accountWalletDetails,
} from './demoData/accounts';
import {
  assetSecurityTeslaDetails,
  assetSecurityGamestopDetails,
  assetCryptoBitcoinDetails,
  assetCryptoEthereumDetails,
  assetCollectibleDetails,
  assetVehicleDetails,
} from './demoData/assets';
import {
  accountCheckingTransactionSet,
  accountSavingsTransactionSet,
  accountCreditCardTransactionSet,
} from './demoData/transactions';
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
} from './demoData/balanceStatements';

const seedDemoData = async () => {
  const sessionDate = new Date();
  const pending = false;

  // Account: Checking
  const accountChecking = await AccountRepository.createAccount(accountCheckingDetails);
  const accountCheckingTransactions = await Promise.all(
    accountCheckingTransactionSet().map(async transaction => {
      const { description, date, amount, excludeFromTotals, categoryName } = transaction;
      const category = await CategoryRepository.getSubCategory(categoryName);

      return new Transaction(
        description,
        date,
        amount,
        excludeFromTotals,
        pending,
        accountChecking,
        category,
        new Date(),
        sessionDate
      );
    })
  );
  await TransactionRepository.createTransactions(accountCheckingTransactions);

  // Account: Savings
  const accountSavings = await AccountRepository.createAccount(accountSavingsDetails);
  const accountSavingsTransaction = await Promise.all(
    accountSavingsTransactionSet().map(async transaction => {
      const { description, date, amount, excludeFromTotals, categoryName } = transaction;
      const category = await CategoryRepository.getSubCategory(categoryName);

      return new Transaction(
        description,
        date,
        amount,
        excludeFromTotals,
        pending,
        accountSavings,
        category,
        new Date(),
        sessionDate
      );
    })
  );
  await TransactionRepository.createTransactions(accountSavingsTransaction);

  // Account: Credit card
  const accountCreditCard = await AccountRepository.createAccount(accountCreditCardDetails);
  const accountCreditCardTransaction = await Promise.all(
    accountCreditCardTransactionSet().map(async transaction => {
      const { description, date, amount, excludeFromTotals, categoryName } = transaction;
      const category = await CategoryRepository.getSubCategory(categoryName);

      return new Transaction(
        description,
        date,
        amount,
        excludeFromTotals,
        pending,
        accountCreditCard,
        category,
        new Date(),
        sessionDate
      );
    })
  );
  await TransactionRepository.createTransactions(accountCreditCardTransaction);

  // // Account: Auto-loan
  await AccountRepository.createAccount({
    ...accountAutoLoanDetails,
    balanceStatements: accountAutoLoanBalanceStatements,
  });

  // Account: Roth IRA
  await AccountRepository.createAccount({
    ...accountRothIraDetails,
    balanceStatements: accountRothIraBalanceStatements,
  });

  // Account: 401K
  await AccountRepository.createAccount({
    ...account401kDetails,
    balanceStatements: account401kbalanceStatements,
  });

  // Account: Wallet
  await AccountRepository.createAccount({
    ...accountWalletDetails,
    balanceStatements: accountWalletBalanceStatements,
  });

  // Asset: Security (Tesla)
  await AssetRepository.createAsset({
    ...assetSecurityTeslaDetails,
    balanceStatements: assetTeslaBalanceStatements,
  });

  // Asset: Security (Gamestop)
  await AssetRepository.createAsset({
    ...assetSecurityGamestopDetails,
    balanceStatements: assetGamestopBalanceStatements,
  });

  // Asset: Crypto (Bitcoin)
  await AssetRepository.createAsset({
    ...assetCryptoBitcoinDetails,
    balanceStatements: assetBitcoinBalanceStatements,
  });

  // Asset: Crypto (Ethereum)
  await AssetRepository.createAsset({
    ...assetCryptoEthereumDetails,
    balanceStatements: assetEthereumBalanceStatements,
  });

  // Asset: Collectible
  await AssetRepository.createAsset({
    ...assetCollectibleDetails,
    balanceStatements: assetCollectibleBalanceStatements,
  });

  // Asset: Vehicle
  await AssetRepository.createAsset({
    ...assetVehicleDetails,
    balanceStatements: assetVehicleBalanceStatements,
  });

  return true;
};

export default seedDemoData;
