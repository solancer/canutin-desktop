import { getRepository, getConnection, Between } from 'typeorm';
import { endOfDay, startOfMonth, subMinutes, subMonths } from 'date-fns';

import { AccountBalanceStatementRepository } from '@database/repositories/accountBalanceStatement.repository';
import { AccountTypeRepository } from '@database/repositories/accountType.repository';

import { Account } from '../entities';
import {
  NewAccountType,
  AccountEditBalanceSubmitType,
  AccountEditDetailsSubmitType,
} from '@appTypes/account.type';
import { TransactionRepository } from './transaction.repository';
import { handleAccountBalanceStatements } from '@database/helpers/balanceStatement';
import { dateInUTC } from '@app/utils/date.utils';

export class AccountRepository {
  static async createAccount(account: NewAccountType): Promise<Account> {
    const accountType = await AccountTypeRepository.createOrGetAccountType({
      name: account.accountType.toLowerCase(),
    });

    const existingAccount = await getRepository<Account>(Account).save(
      new Account(
        account.name,
        account.closed,
        account.autoCalculated,
        accountType,
        account.officialName,
        account.institution
      )
    );

    await handleAccountBalanceStatements(existingAccount, account);

    return (await getRepository<Account>(Account).findOne(existingAccount.id)) as Account;
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
    return await getRepository<Account>(Account)
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.balanceStatements', 'balanceStatements')
      .leftJoinAndSelect('account.accountType', 'accountType')
      .leftJoinAndSelect(
        'account.transactions',
        'transaction',
        'transaction.excludeFromTotals = false'
      )
      .orderBy('account.name', 'ASC')
      .addOrderBy('account.id', 'DESC')
      .getMany();
  }

  static async getAccountSummaries(): Promise<Account[]> {
    return await getRepository<Account>(Account)
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.balanceStatements', 'balanceStatements')
      .leftJoinAndSelect('account.accountType', 'accountType')
      .orderBy('account.name', 'ASC')
      .addOrderBy('account.id', 'DESC')
      .getMany();
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
    const existingAccount = await getRepository<Account>(Account)
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.balanceStatements', 'balanceStatements')
      .where('account.name like :name', { name: `%${account.name}%` })
      .getOne();

    if (!existingAccount) {
      return AccountRepository.createAccount(account);
    }

    await handleAccountBalanceStatements(existingAccount, account);

    return (await getRepository<Account>(Account).findOne(existingAccount.id)) as Account;
  }

  static async editBalance(accountBalance: AccountEditBalanceSubmitType): Promise<Account> {
    await getRepository<Account>(Account).update(accountBalance.accountId, {
      autoCalculated: accountBalance.autoCalculated,
      closed: accountBalance.closed,
    });

    const existingAccount = await getRepository<Account>(Account).findOne({
      where: {
        id: accountBalance.accountId,
      },
    });

    !accountBalance.autoCalculated &&
      (await AccountBalanceStatementRepository.createBalanceStatement({
        createdAt: new Date(),
        value: accountBalance.balance,
        account: existingAccount as Account,
      }));

    return (await getRepository<Account>(Account).findOne(existingAccount!.id)) as Account;
  }

  static async editDetails(accountDetails: AccountEditDetailsSubmitType): Promise<Account> {
    const accountType = await AccountTypeRepository.createOrGetAccountType({
      name: accountDetails.accountType.toLowerCase(),
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

    // Delete associated transactions
    account?.transactions &&
      account.transactions.length > 0 &&
      (await TransactionRepository.deleteTransactions(account.transactions.map(({ id }) => id)));

    // Delete associated balance statements
    !account?.autoCalculated &&
      account?.balanceStatements &&
      (await AccountBalanceStatementRepository.deleteBalanceStatements(
        account.balanceStatements.map(({ id }) => id)
      ));

    await getRepository<Account>(Account).delete(accountId);
  }
}
