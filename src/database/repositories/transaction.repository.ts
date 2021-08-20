import { getRepository, getConnection, Between, UpdateResult } from 'typeorm';
import { subDays } from 'date-fns';

import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';

import { dateInUTC } from '@app/utils/date.utils';
import { Transaction, Account } from '../entities';
import { AccountRepository } from './account.repository';
import { CategoryRepository } from './category.repository';

export class TransactionRepository {
  static async createTransaction(transaction: NewTransactionType): Promise<Transaction> {
    const account = await AccountRepository.getAccountById(transaction.accountId);
    const category = await CategoryRepository.getOrCreateSubCategory(transaction.categoryName);

    const newTransaction = await getRepository<Transaction>(Transaction).save(
      new Transaction(
        transaction.description as string,
        dateInUTC(transaction.date),
        transaction.balance,
        transaction.excludeFromTotals,
        account as Account,
        category
      )
    );

    return newTransaction;
  }

  static async editTransaction(transaction: NewTransactionType): Promise<UpdateResult> {
    const account = await AccountRepository.getAccountById(transaction.accountId);
    const category = await CategoryRepository.getOrCreateSubCategory(transaction.categoryName);

    const newTransaction = await getRepository<Transaction>(Transaction).update(
      transaction.id as number,
      {
        account,
        amount: transaction.balance,
        category,
        date: dateInUTC(transaction.date),
        excludeFromTotals: transaction.excludeFromTotals,
        description: transaction.description as string,
      }
    );

    return newTransaction;
  }

  static async deleteTransaction(transactionId: number) {
    await getRepository<Transaction>(Transaction).delete(transactionId);
  }

  static async deleteTransactions(transactionsIds: number[]) {
    await getRepository<Transaction>(Transaction).delete(transactionsIds);
  }

  static async createTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const q = getRepository(Transaction).createQueryBuilder().insert().values(transactions);
    const [sql, args] = q.getQueryAndParameters();
    const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO');

    return await getConnection().manager.query(nsql, args);
  }

  static async getTransactions(): Promise<Transaction[]> {
    return await getRepository<Transaction>(Transaction).find({
      relations: ['account', 'account.accountType'],
      order: {
        date: 'DESC',
      },
    });
  }

  static async getFilterTransactions(filter: FilterTransactionInterface): Promise<Transaction[]> {
    // The query seems to only return the expected results if the dates are offset by -1
    const dateFrom = subDays(dateInUTC(filter.dateFrom), 1);
    const dateTo = subDays(dateInUTC(filter.dateTo), 1);

    return await getRepository<Transaction>(Transaction).find({
      relations: ['account', 'category'],
      where: {
        date: Between(dateFrom.toISOString(), dateTo.toISOString()),
      },
    });
  }
}
