import { getRepository, getConnection } from 'typeorm';

import { Transaction } from '../entities';

export class TransactionRepository {
  static async createTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const q = getRepository(Transaction).createQueryBuilder().insert().values(transactions);
    const [sql, args] = q.getQueryAndParameters()
    const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO')
    
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
}
