import { getRepository } from 'typeorm';

import { AssetBalanceStatement } from '../entities';
import { NewAssetBalanceStatementType } from '@appTypes/assetBalanceStatement.type';
import { splitInChunks } from '@database/helpers';

export class AssetBalanceStatementRepository {
  static async createBalanceStatement(
    balanceStatement: NewAssetBalanceStatementType
  ): Promise<AssetBalanceStatement> {
    return await getRepository<AssetBalanceStatement>(AssetBalanceStatement).save(
      new AssetBalanceStatement(
        balanceStatement.value,
        balanceStatement.asset,
        balanceStatement.createdAt,
        balanceStatement.quantity,
        balanceStatement.cost
      )
    );
  }

  static async createBalanceStatements(assetBalanceStatements: AssetBalanceStatement[]) {
    const balanceStatementChunks: AssetBalanceStatement[][] = splitInChunks(assetBalanceStatements);

    balanceStatementChunks.forEach(async balanceStatementChunk => {
      try {
        await getRepository(AssetBalanceStatement)
          .createQueryBuilder()
          .insert()
          .orIgnore()
          .values(balanceStatementChunk)
          .execute();
      } catch (e) {
        console.error(e);
      }
    });
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
