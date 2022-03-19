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
import { LOAD_DATA_ACK } from '@constants/imports';
import { StatusEnum } from '@app/constants/misc';

export const importFromCanutinFile = async (
  win: BrowserWindow | null,
  canutinFile: CanutinFileType
) => {
  try {
    const { accounts, assets } = canutinFile;

    if (accounts) {
      for (const canutinFileAccount of accounts) {
        const account = await AccountRepository.getOrCreateAccount(canutinFileAccount);

        canutinFileAccount.transactions &&
          (await handleCanutinFileTransactions(account, canutinFileAccount.transactions));
      }
    }

    if (assets) {
      for (const canutinFileAsset of assets) {
        await AssetRepository.getOrCreateAsset({
          ...canutinFileAsset,
          assetType: canutinFileAsset.assetType as AssetTypeEnum,
        });
      }
    }

    win?.webContents.send(LOAD_DATA_ACK, {
      status: StatusEnum.POSITIVE,
    });
  } catch (error) {
    win?.webContents.send(LOAD_DATA_ACK, {
      status: StatusEnum.NEGATIVE,
    });
  }
};

// FIXME: I don't think we need a separate function to updateAccounts
export const updateAccounts = async (updatedAccounts: UpdatedAccount[]) => {
  await Promise.all(
    updatedAccounts.map(async ({ id, transactions }) => {
      const account = await AccountRepository.getAccountById(id);

      account && transactions && handleCanutinFileTransactions(account, transactions);
    })
  );
};

const handleCanutinFileTransactions = async (
  account: Account,
  canutinFileTransactions: CanutinFileTransactionType[]
) => {
  const transactions: Transaction[] = [];
  const sessionDate = new Date(); // Applies the same date to all transactions processed in the session

  for (const canutinFileTransaction of canutinFileTransactions) {
    const { description, date, amount, excludeFromTotals, pending, createdAt, importedAt } =
      canutinFileTransaction;

    const category = await CategoryRepository.getSubCategory(canutinFileTransaction.category);

    transactions.push(
      new Transaction(
        description,
        handleDate(date),
        amount,
        excludeFromTotals,
        pending ? pending : false,
        account,
        category,
        handleDate(createdAt),
        importedAt ? handleDate(importedAt) : sessionDate
      )
    );
  }

  await TransactionRepository.createTransactions(transactions);
};
