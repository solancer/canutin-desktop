import { getRepository } from 'typeorm';

import { AssetBalanceStatement } from '../entities';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';

export class AssetBalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewAssetBalanceStatementType
  ): Promise<AssetBalanceStatement> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).save(
      new AssetBalanceStatement(
        balanceStatement.asset,
        balanceStatement.createdAt,
        balanceStatement.value,
        balanceStatement.cost,
        balanceStatement.quantity
      )
    );
  }

  static async getBalanceStatements(): Promise<AssetBalanceStatement[]> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).find({
      relations: ['asset'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  static async deleteBalanceStatements(balanceStatementsIds: number[]) {
    await getRepository<AssetBalanceStatement>(AssetBalanceStatement).delete(balanceStatementsIds);
  }
}
