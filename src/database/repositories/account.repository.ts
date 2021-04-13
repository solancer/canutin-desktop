import { getRepository } from 'typeorm';

import { Account, AccountType } from '../entities';
import { NewAccountType } from '../../types/account.type';

export class AccountRepository {
  static async createAccount(account: NewAccountType): Promise<Account> {
    return await getRepository<Account>(Account).save(
      new Account(
        account.name,
        false,
        new AccountType(account.accountType),
        account.officialName,
        account.institution
      )
    );
  }

  static async getAccounts(): Promise<Account[]> {
    return await getRepository<Account>(Account).find({
      order: {
        name: 'ASC',
        id: 'DESC',
      },
    });
  }
}
