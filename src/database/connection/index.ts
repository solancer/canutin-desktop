import { createConnection, getConnection, Connection, ConnectionOptions } from 'typeorm';
import {
  Account,
  BalanceStatement,
  Asset,
  Budget,
  Transaction,
  TransactionCategory,
  AssetType,
  AccountType,
  TransactionSubCategory,
} from '../entities';

export const dbConfig = {
  type: 'sqlite',
  synchronize: true,
  logging: true,
  entities: [
    Account,
    BalanceStatement,
    Asset,
    Budget,
    Transaction,
    TransactionCategory,
    AssetType,
    AccountType,
    TransactionSubCategory,
  ],
};

const connection = {
  async create(dbConfig: ConnectionOptions, callback?: (c: Connection) => void): Promise<void> {
    try {
      const connection = await createConnection(dbConfig);
      if (callback) {
        callback(connection);
      }
    } catch (error) {
      throw new Error(`ERROR: Creating test db connection: ${error}`);
    }
  },

  async close(): Promise<void> {
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const reposToClear: Promise<void>[] = [];
    entities.forEach(entity => {
      const repository = connection.getRepository(entity.name);
      try {
        reposToClear.push(repository.clear());
      } catch (error) {
        throw new Error(`ERROR: Cleaning test db: ${error}`);
      }
    });

    return Promise.all(reposToClear).then();
  }
};

export default connection;
