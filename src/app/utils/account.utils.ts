import { Account } from '@database/entities';

import { capitalize } from './strings.utils';

export const getAccountInformationLabel = (account: Account) => {
  if (account.institution) {
    return `${capitalize(account.institution)} / ${capitalize(account.accountType.name)} / Account`;
  }

  return `${capitalize(account.accountType.name)} / Account`;
};
