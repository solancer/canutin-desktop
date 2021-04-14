import { parse } from 'date-fns';

import { Account } from '@database/entities/account.entity';
import { Transaction } from '@database/entities/transaction.entity';
import { Budget } from '@database/entities/budget.entity';
import { TransactionCategory } from '@database/entities/transactionCategory.entity';
import { AccountType } from '@database/entities/accountType.entity';
import { AccountRepository } from '@database/repositories/account.repository';
import { TransactionRepository } from '@database/repositories/transaction.repository';
import { CanutinJsonType } from '@appTypes/canutin';

export const importFromCanutinJson = async (canutinFile: CanutinJsonType) => {
  let transactionList: Transaction[] = [];

  const accountList: Account[] = canutinFile.accounts.map(accountInfo => {
    const accountType = new AccountType(accountInfo.accountType);
    const account = new Account(
      accountInfo.name,
      false,
      accountType,
      accountInfo.officialName,
      accountInfo.institution
    );

    // Process transactions
    const transactions = accountInfo.transactions.map(transactionInfo => {
      const transactionDate = parse(transactionInfo.date, 'MM/dd/yyyy', new Date());
      const budget =
        transactionInfo.budget &&
        new Budget(
          transactionInfo.budget.name,
          transactionInfo.budget.targetAmount,
          transactionInfo.budget.type,
          parse(transactionInfo.budget.date, 'MM/dd/yyyy', new Date())
        );

      return new Transaction(
        transactionInfo.description,
        transactionDate,
        transactionInfo.amount,
        false,
        account,
        new TransactionCategory(transactionInfo.category),
        budget
      );
    });
    transactionList = [...transactionList, ...transactions];

    return account;
  });

  await AccountRepository.createAccounts(accountList);
  await TransactionRepository.createTransactions(transactionList);
};
