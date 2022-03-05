import { getRepository } from 'typeorm';

import { AccountType } from '../entities';
import { NewAccountTypeType } from '@appTypes/accountType.type';

export class AccountTypeRepository {
  static async createAccountType(accountType: NewAccountTypeType): Promise<AccountType> {
    return await getRepository<AccountType>(AccountType).save(new AccountType(accountType.name));
  }

  static async createOrGetAccountType(accountType: NewAccountTypeType): Promise<AccountType> {
    const accountTypeDb = await getRepository<AccountType>(AccountType).findOne({
      where: { name: accountType.name },
    });

    if (!accountTypeDb) {
      return AccountTypeRepository.createAccountType(accountType);
    }

    return accountTypeDb;
  }

  static async createAccountTypes(accountTypes: AccountType[]) {
    await getRepository(AccountType)
      .createQueryBuilder()
      .insert()
      .into(AccountType)
      .values(accountTypes)
      .execute();
  }
}
