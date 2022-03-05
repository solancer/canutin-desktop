import { AccountTypeRepository } from '../repositories/accountType.repository';

import { accountTypes } from '@constants/accountTypes';
import { AccountType } from '@database/entities';

const seedAccountTypes = async () => {
  accountTypes.forEach(async ({ accountTypes }) => {
    const newAccountTypes = accountTypes.map(({ value }) => {
      return new AccountType(value);
    });

    await AccountTypeRepository.createAccountTypes(newAccountTypes);
  });
};

export default seedAccountTypes;
