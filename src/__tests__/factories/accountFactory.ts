import { build, fake, sequence, bool, oneOf } from '@jackfranklin/test-data-bot';

import { accountTypes } from '@constants/accountTypes';

const getAccountTypesValues = () => {
  const accountTypeValues: string[] = [];

  accountTypes.forEach(async ({ accountTypes }) =>
    accountTypes.forEach(async ({ value }) => {
      accountTypeValues.push(value);
    })
  );

  return accountTypeValues;
};

export const balanceStatementBuilder = build('BalanceStatement', {
  fields: {
    autoCalculate: bool(),
    id: sequence(),
    createdAt: fake(f => f.date.past()),
    updatedAt: fake(f => f.date.past()),
  },
});

export const accountTypeBuilder = build('AccountType', {
  fields: {
    id: sequence(),
    name: fake(f => f.random.arrayElement(getAccountTypesValues())),
    createdAt: fake(f => f.date.past()),
    updatedAt: fake(f => f.date.past()),
  },
});

export const accountBuilder = build('Account', {
  fields: {
    id: sequence(),
    name: fake(f => f.finance.accountName()),
    officialName: fake(f => f.finance.accountName()),
    institution: fake(f => f.company.companyName()),
    createdAt: fake(f => f.date.past()),
    updatedAt: fake(f => f.date.past()),
    balanceGroup: fake(f => f.random.number(3)),
    closed: bool(),
  },
  postBuild: account => {
    const accountType = accountTypeBuilder();
    const balanceStatements = [balanceStatementBuilder()];

    return { ...account, accountType, balanceStatements };
  },
});
