import { BrowserWindow } from 'electron';

import { handleDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities/transaction.entity';
import { AccountRepository } from '@database/repositories/account.repository';
import { CategoryRepository } from '@database/repositories/category.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import {
  CanutinFileTransactionType,
  CanutinFileType,
  UpdatedAccount,
} from '@appTypes/canutinFile.type';
import { AssetRepository } from '@database/repositories/asset.repository';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { Account } from '@database/entities';

export const importFromCanutinFile = async (
  canutinFile: CanutinFileType,
  win: BrowserWindow | null
) => {
  try {
    canutinFile.accounts?.forEach(async canutinFileAccount => {
      // Find or create account
      const account = await AccountRepository.getOrCreateAccount(canutinFileAccount).then(res => {
        return res;
      });

      // Process transactions
      canutinFileAccount.transactions &&
        handleCanutinFileTransactions(account, canutinFileAccount.transactions);
    });

    canutinFile.assets &&
      (await Promise.all(
        canutinFile.assets.map(async canutinFileAsset =>
          AssetRepository.getOrCreateAsset({
            ...canutinFileAsset,
            assetType: canutinFileAsset.assetType as AssetTypeEnum,
          })
        )
      ));

    return true;
  } catch (error) {
    return false;
  }
};

// FIXME: I don't think we need a separate function to updateAccounts
export const updateAccounts = async (updatedAccounts: UpdatedAccount[]) => {
  updatedAccounts.forEach(async ({ id, transactions }) => {
    const account = await AccountRepository.getAccountById(id);

    account && transactions && handleCanutinFileTransactions(account, transactions);
  });
};

const handleCanutinFileTransactions = async (
  account: Account,
  canutinFileTransactions: CanutinFileTransactionType[]
) => {
  const sessionDate = new Date(); // Applies the same date to all transactions processed in the session
  const transactions = await Promise.all(
    canutinFileTransactions.map(async canutinFileTransaction => {
      const {
        description,
        date,
        amount,
        excludeFromTotals,
        pending,
        createdAt,
        importedAt,
      } = canutinFileTransaction;
      const category = await CategoryRepository.getSubCategory(canutinFileTransaction.category);

      return new Transaction(
        description,
        handleDate(date),
        amount,
        excludeFromTotals,
        pending ? pending : false,
        account,
        category,
        handleDate(createdAt),
        importedAt ? handleDate(importedAt) : sessionDate
      );
    })
  );

  await TransactionRepository.createTransactions(transactions);
};
