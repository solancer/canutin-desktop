import { getRepository } from 'typeorm';

import { AccountType } from '../entities';
import { NewAccountTType } from '../../types/accountType.type';

export class AccountTypeRepository {
  static async createAccountType(accountType: NewAccountTType): Promise<AccountType> {
    return await getRepository<AccountType>(AccountType).save(new AccountType(accountType.name));
  }

  static async createOrGetAccountType(accountType: NewAccountTType): Promise<AccountType> {
    const accountTypeDb = await getRepository<AccountType>(AccountType).findOne({
      where: { name: accountType.name },
    });

    if (!accountTypeDb) {
      return AccountTypeRepository.createAccountType(accountType);
    }

    return accountTypeDb;
  }
}
