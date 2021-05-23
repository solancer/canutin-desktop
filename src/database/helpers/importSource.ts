import { parse } from 'date-fns';
import { BrowserWindow } from 'electron';

import { Transaction } from '@database/entities/transaction.entity';
import { Budget } from '@database/entities/budget.entity';
import { AccountRepository } from '@database/repositories/account.repository';
import { CategoryRepository } from '@database/repositories/category.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { CanutinJsonType, UpdatedAccount } from '@appTypes/canutin';
import { LOADING_CSV } from '@constants/events';
import { CANUTIN_FILE_DATE_FORMAT } from '@constants';

export const importFromCanutinJson = async (
  canutinFile: CanutinJsonType,
  win: BrowserWindow | null
) => {
  const countAccounts = canutinFile.accounts.length;

  canutinFile.accounts.forEach(async (accountInfo, index) => {
    const account = await AccountRepository.getOrCreateAccount({
      ...accountInfo,
      autoCalculate: true,
    }).then(res => {
      win?.webContents.send(LOADING_CSV, { total: countAccounts });
      return res;
    });

    // Process transactions
    const transactions = await Promise.all(
      accountInfo.transactions.map(async transactionInfo => {
        const transactionDate = parse(transactionInfo.date, CANUTIN_FILE_DATE_FORMAT, new Date());
        const budget =
          transactionInfo.budget &&
          new Budget(
            transactionInfo.budget.name,
            transactionInfo.budget.targetAmount,
            transactionInfo.budget.type,
            parse(transactionInfo.budget.date, CANUTIN_FILE_DATE_FORMAT, new Date())
          );

        const category = await CategoryRepository.getOrCreateSubCategory(transactionInfo.category);
        return new Transaction(
          transactionInfo.description,
          transactionDate,
          transactionInfo.amount,
          transactionInfo.excludeFromTotals,
          account,
          category,
          budget
        );
      })
    );

    await TransactionRepository.createTransactions(transactions);

    return account;
  });
};

export const updateAccounts = async (updatedAccounts: UpdatedAccount[]) => {
  updatedAccounts.forEach(async ({ id, transactions }) => {
    const account = await AccountRepository.getAccountById(id);

    if (account !== undefined) {
      const updatedTransactions = await Promise.all(
        transactions.map(async transactionInfo => {
          const transactionDate = parse(transactionInfo.date, CANUTIN_FILE_DATE_FORMAT, new Date());
          const budget =
            transactionInfo.budget &&
            new Budget(
              transactionInfo.budget.name,
              transactionInfo.budget.targetAmount,
              transactionInfo.budget.type,
              parse(transactionInfo.budget.date, CANUTIN_FILE_DATE_FORMAT, new Date())
            );

          const category = await CategoryRepository.getOrCreateSubCategory(
            transactionInfo.category
          );

          return new Transaction(
            transactionInfo.description,
            transactionDate,
            transactionInfo.amount,
            false,
            account,
            category,
            budget
          );
        })
      );
      await TransactionRepository.createTransactions(updatedTransactions);
    }
  });
};
