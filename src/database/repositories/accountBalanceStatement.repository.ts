import { getRepository } from 'typeorm';

import { AccountBalanceStatement } from '../entities';
import { NewAccountBalanceStatementType } from '@appTypes/accountBalanceStatement.type';

export class AccountBalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewAccountBalanceStatementType
  ): Promise<AccountBalanceStatement> {
    return await getRepository<AccountBalanceStatement>(AccountBalanceStatement).save(
      new AccountBalanceStatement(
        balanceStatement.account,
        balanceStatement.createdAt ? balanceStatement.createdAt : new Date(),
        balanceStatement.value
      )
    );
  }

  static async getBalanceStatements(): Promise<AccountBalanceStatement[]> {
    return await getRepository<AccountBalanceStatement>(AccountBalanceStatement).find({
      relations: ['account'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  static async deleteBalanceStatements(balanceStatementsIds: number[]) {
    await getRepository<AccountBalanceStatement>(AccountBalanceStatement).delete(
      balanceStatementsIds
    );
  }
}
