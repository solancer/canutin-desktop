import { getRepository, getConnection } from 'typeorm';

import { BalanceStatementRepository } from '@database/repositories/balanceStatement.repository';
import { AccountTypeRepository } from '@database/repositories/accountType.repository';

import { Account } from '../entities';
import { NewAccountType } from '../../types/account.type';

export class AccountRepository {
  static async createAccount(account: NewAccountType): Promise<Account> {
    const accountType = await AccountTypeRepository.createOrGetAccountType({
      name: account.accountType.toLowerCase(),
    });
    const accountSaved = await getRepository<Account>(Account).save(
      new Account(account.name, false, accountType, account.officialName, account.institution)
    );

    await BalanceStatementRepository.createBalanceStatement({
      value: account.balance,
      autoCalculate: account.autoCalculate,
      account: accountSaved,
    });

    return accountSaved;
  }

  static async createAccounts(accounts: Account[]): Promise<Account[]> {
    const q = getRepository(Account).createQueryBuilder().insert().values(accounts);
    const [sql, args] = q.getQueryAndParameters();
    const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO');

    return await getConnection().manager.query(nsql, args);
  }

  static async getAccounts(): Promise<Account[]> {
    return await getRepository<Account>(Account).find({
      relations: ['transactions', 'balanceStatements', 'accountType'],
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }

  static async getAccountById(accountId: number): Promise<Account | undefined> {
    return await getRepository<Account>(Account).findOne(accountId);
  }

  static async getOrCreateAccount(account: NewAccountType): Promise<Account> {
    const accountDb = await getRepository<Account>(Account).findOne({
      where: { name: account.name.toLowerCase() },
      relations: ['balanceStatements'],
    });

    if (!accountDb) {
      return AccountRepository.createAccount(account);
    }

    const isAutoCalculate =
      accountDb.balanceStatements?.[accountDb.balanceStatements.length - 1].autoCalculate;

    await BalanceStatementRepository.createBalanceStatement({
      value: account.balance,
      autoCalculate: isAutoCalculate !== undefined ? isAutoCalculate : true,
      account: accountDb,
    });

    return accountDb;
  }
}
