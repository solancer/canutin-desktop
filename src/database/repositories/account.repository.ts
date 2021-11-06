import { getRepository, getConnection } from 'typeorm';

import { BalanceStatementRepository } from '@database/repositories/balanceStatement.repository';
import { AccountTypeRepository } from '@database/repositories/accountType.repository';
import { PREVIOUS_AUTO_CALCULATED } from '@constants';

import { Account } from '../entities';
import {
  NewAccountType,
  AccountEditBalanceSubmitType,
  AccountEditDetailsSubmitType,
} from '../../types/account.type';
import { TransactionRepository } from './transaction.repository';

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
    return await getRepository<Account>(Account).findOne(accountId, {
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

  static async editBalance(accountBalance: AccountEditBalanceSubmitType): Promise<Account> {
    await getRepository<Account>(Account).update(accountBalance.accountId, {
      closed: accountBalance.closed,
    });

    const updatedAccount = await getRepository<Account>(Account).findOne({
      where: {
        id: accountBalance.accountId,
      },
    });

    await BalanceStatementRepository.createBalanceStatement({
      value: accountBalance.balance,
      autoCalculate: accountBalance.autoCalculate,
      account: updatedAccount as Account,
    });

    return updatedAccount as Account;
  }

  static async editDetails(accountDetails: AccountEditDetailsSubmitType): Promise<Account> {
    const accountType = await AccountTypeRepository.createOrGetAccountType({
      name: accountDetails.accountTypeName.toLowerCase(),
    });
    await getRepository<Account>(Account).update(accountDetails.accountId, {
      name: accountDetails.name,
      balanceGroup: accountDetails.balanceGroup,
      institution: accountDetails.institution,
      accountType,
    });

    const updatedAccount = await getRepository<Account>(Account).findOne({
      where: {
        id: accountDetails.accountId,
      },
      relations: ['accountType'],
    });

    return updatedAccount as Account;
  }

  static async deleteAccount(accountId: number) {
    const account = await getRepository<Account>(Account).findOne(Number(accountId), {
      relations: ['transactions', 'balanceStatements'],
    });

    account?.transactions &&
      account.transactions.length > 0 &&
      (await TransactionRepository.deleteTransactions(account.transactions.map(({ id }) => id)));

    account?.balanceStatements &&
      (await BalanceStatementRepository.deleteBalanceStatements(
        account.balanceStatements.map(({ id }) => id)
      ));

    await getRepository<Account>(Account).delete(accountId);
  }
}
