import { getRepository, getConnection } from 'typeorm';

import { BalanceStatementRepository } from '@database/repositories/balanceStatement.repository';
import { AccountTypeRepository } from '@database/repositories/accountType.repository';
import { PREVIOUS_AUTO_CALCULATED } from '@constants';

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
      autoCalculate:
        account.autoCalculate === PREVIOUS_AUTO_CALCULATED
          ? true
          : (account.autoCalculate as boolean),
      account: accountSaved,
    });

    return accountSaved;
  }

  static async createAccounts(accounts: Account[]): Promise<Account[]> {
    const accountsLowerCase = accounts.map(account => ({
      ...account,
    }));
    const q = getRepository(Account).createQueryBuilder().insert().values(accountsLowerCase);
    const [sql, args] = q.getQueryAndParameters();
    const nsql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO');

    return await getConnection().manager.query(nsql, args);
  }

  static async getAccounts(): Promise<Account[]> {
    return await getRepository<Account>(Account).find({
      relations: [
        'transactions',
        'transactions.account',
        'transactions.category',
        'balanceStatements',
        'accountType',
      ],
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
    const accountDb = await getRepository<Account>(Account)
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.balanceStatements', 'balanceStatements')
      .where('account.name like :name', { name: `%${account.name}%` })
      .getOne();

    if (!accountDb) {
      return AccountRepository.createAccount(account);
    }

    const previousAutoCalculate =
      accountDb.balanceStatements?.[accountDb.balanceStatements.length - 1].autoCalculate;

    if (
      account.autoCalculate === ((PREVIOUS_AUTO_CALCULATED as unknown) as boolean) &&
      previousAutoCalculate
    ) {
      await BalanceStatementRepository.createBalanceStatement({
        value: account.balance,
        autoCalculate: previousAutoCalculate,
        account: accountDb,
      });

      return accountDb;
    }

    if (
      account.autoCalculate === ((PREVIOUS_AUTO_CALCULATED as unknown) as boolean) &&
      !previousAutoCalculate
    ) {
      await BalanceStatementRepository.createBalanceStatement({
        value: account.balance,
        autoCalculate: true,
        account: accountDb,
      });

      return accountDb;
    }

    if (!(account.autoCalculate === ((PREVIOUS_AUTO_CALCULATED as unknown) as boolean))) {
      await BalanceStatementRepository.createBalanceStatement({
        value: account.balance,
        autoCalculate: account.autoCalculate as boolean,
        account: accountDb,
      });

      return accountDb;
    }

    return accountDb;
  }
}
