import { getRepository } from 'typeorm';

import { Transaction } from '../entities';

export class TransactionRepository {
  static async createTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    return await getRepository(Transaction).save(transactions);
  }
}
