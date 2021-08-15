import { getRepository } from 'typeorm';

import { AssetBalanceStatement } from '../entities';
import { NewAssetBalanceStatementType } from '../../types/assetBalanceStatement.type';

export class AssetBalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewAssetBalanceStatementType
  ): Promise<AssetBalanceStatement> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).save(
      new AssetBalanceStatement(
        balanceStatement.asset,
        balanceStatement.value,
        balanceStatement.cost,
        balanceStatement.quantity,
        balanceStatement.sold
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
