import { AccountTypeRepository } from '../repositories/accountType.repository';

import { accountTypes } from '@constants/accountTypes';

const seedAccountTypes = async () => {
  accountTypes.forEach(async ({ accountTypes }) => {
    accountTypes.forEach(async ({ value }) => {
      await AccountTypeRepository.createAccountType({ name: value });
    })
  });
};

export default seedAccountTypes;
