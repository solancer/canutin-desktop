import { getRepository } from 'typeorm';

import { BalanceStatement } from '../entities';
import { NewBalanceStatementType } from '../../types/balanceStatement.type';

export class BalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewBalanceStatementType
  ): Promise<BalanceStatement> {
    return await getRepository<BalanceStatement>(BalanceStatement).save(
      new BalanceStatement(
        balanceStatement.autoCalculate,
        balanceStatement.account,
        balanceStatement.value
      )
    );
  }

  static async getBalanceStatements(): Promise<BalanceStatement[]> {
    return await getRepository<BalanceStatement>(BalanceStatement).find({
      relations: ['account'],
      order: {
        createdAt: 'DESC'
      },
    });
  }
}
