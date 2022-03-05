import isDev from 'electron-is-dev';
import {
  createConnection,
  getConnection,
  Connection,
  ConnectionOptions,
  AlreadyHasActiveConnectionError,
  ConnectionNotFoundError,
} from 'typeorm';

import {
  Account,
  AccountBalanceStatement,
  Asset,
  Budget,
  Transaction,
  TransactionCategory,
  AssetType,
  AccountType,
  TransactionSubCategory,
  AssetBalanceStatement,
  Settings,
} from '../entities';

export const dbConfig = {
  type: 'better-sqlite3',
  synchronize: true,
  logging: isDev && true,
  entities: [
    Account,
    AccountType,
    AccountBalanceStatement,
    Asset,
    AssetType,
    AssetBalanceStatement,
    Transaction,
    TransactionCategory,
    TransactionSubCategory,
    Budget,
    Settings,
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
      console.error('Error', error);
      if (error instanceof AlreadyHasActiveConnectionError) {
        return;
      }
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
        throw new Error(`ERROR: Cleaning db: ${error}`);
      }
    });

    return Promise.all(reposToClear).then();
  },

  async isConnected(): Promise<boolean> {
    try {
      return await getConnection().isConnected;
    } catch (error) {
      if (error instanceof ConnectionNotFoundError) {
        return false;
      }
    }

    return false;
  },
};

export default connection;
