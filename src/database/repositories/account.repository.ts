import { getRepository } from 'typeorm';

import { BalanceStatementRepository } from '@database/repositories/balanceStatement.repository';

import { Account, AccountType } from '../entities';
import { NewAccountType } from '../../types/account.type';

export class AccountRepository {
  static async createAccount(account: NewAccountType): Promise<Account> {
    const accountSaved = await getRepository<Account>(Account).save(
      new Account(
        account.name,
        false,
        new AccountType(account.accountType),
        account.officialName,
        account.institution
      )
    );

    await BalanceStatementRepository.createBalanceStatement({
      value: account.balance,
      autoCalculate: account.autoCalculate,
      account: accountSaved,
    });

    return accountSaved;
  }

  static async createAccounts(accounts: Account[]): Promise<Account[]> {
    return await getRepository(Account).save(accounts);
  }

  static async getAccounts(): Promise<Account[]> {
    return await getRepository<Account>(Account).find({
      relations: ['transactions', 'assets', 'balanceStatements', 'accountType'],
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }

  static async getAccountById(accountId: number): Promise<Account | undefined> {
    return await getRepository<Account>(Account).findOne(accountId);
  }
}
