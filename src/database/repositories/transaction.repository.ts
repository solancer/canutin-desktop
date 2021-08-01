import { getRepository, getConnection, Between } from 'typeorm';

import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';

import { Transaction, Account } from '../entities';
import { AccountRepository } from './account.repository';
import { CategoryRepository } from './category.repository';

export class TransactionRepository {
  static async createTransaction(transaction: NewTransactionType): Promise<Transaction> {
    const account = await AccountRepository.getAccountById(transaction.accountId);
    const category = await CategoryRepository.getOrCreateSubCategory(transaction.categoryName);

    const newTransaction = await getRepository<Transaction>(Transaction).save(
      new Transaction(
        transaction.description,
        transaction.date,
        transaction.balance,
        transaction.excludeFromTotals,
        account as Account,
        category
      )
    );

    return newTransaction;
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
        id: 'DESC',
      },
    });
  }

  static async getFilterTransactions(filter: FilterTransactionInterface): Promise<Transaction[]> {
    return await getRepository<Transaction>(Transaction).find({
      relations: ['account', 'category'],
      where: {
        date: Between(filter.dateFrom.toISOString(), filter.dateTo.toISOString()),
      },
    });
  }
}
