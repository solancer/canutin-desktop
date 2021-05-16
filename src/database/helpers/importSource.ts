import { parse } from 'date-fns';

import { Account } from '@database/entities/account.entity';
import { Transaction } from '@database/entities/transaction.entity';
import { Budget } from '@database/entities/budget.entity';
import { AccountType } from '@database/entities/accountType.entity';
import { AccountRepository } from '@database/repositories/account.repository';
import { CategoryRepository } from '@database/repositories/category.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { CanutinJsonType, UpdatedAccount } from '@appTypes/canutin';
import { CANUTIN_FILE_DATE_FORMAT } from '@constants';

export const importFromCanutinJson = async (canutinFile: CanutinJsonType) => {
  let transactionList: Transaction[] = [];

  const accountList: Account[] = await Promise.all(
    canutinFile.accounts.map(async accountInfo => {
      const accountType = new AccountType(accountInfo.accountType);
      const account = new Account(
        accountInfo.name,
        false,
        accountType,
        accountInfo.officialName,
        accountInfo.institution
      );

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

      transactionList = [...transactionList, ...transactions];

      return account;
    })
  );

  await AccountRepository.createAccounts(accountList);
  await TransactionRepository.createTransactions(transactionList);
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
