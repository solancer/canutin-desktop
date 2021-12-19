import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export const accountCheckingDetails = {
  name: "Alice's Checking",
  balanceGroup: BalanceGroupEnum.CASH,
  accountType: 'checking',
  autoCalculated: true,
  closed: false,
  officialName: 'Ransack High-Yield Checking',
  institution: 'Ransack Bank',
};

export const accountSavingsDetails = {
  name: 'Emergency Fund',
  balanceGroup: BalanceGroupEnum.CASH,
  accountType: 'savings',
  autoCalculated: true,
  closed: false,
  officialName: 'Ransack Savings Plus',
  institution: 'Ransack Bank',
};

export const accountCreditCardDetails = {
  name: "Bob's Juggernaut Visa",
  balanceGroup: BalanceGroupEnum.DEBT,
  accountType: 'credit card',
  autoCalculated: true,
  closed: false,
  officialName: 'Juggernaut Cash Back Rewards',
  institution: 'Juggernaut Bank',
};

export const accountAutoLoanDetails = {
  name: 'Toyota Auto Loan',
  balanceGroup: BalanceGroupEnum.DEBT,
  accountType: 'auto',
  autoCalculated: false,
  closed: false,
  institution: 'Toyota Financial Services',
};

export const accountRothIraDetails = {
  name: "Alice's Roth IRA",
  balanceGroup: BalanceGroupEnum.INVESTMENTS,
  accountType: 'roth',
  autoCalculated: false,
  closed: false,
  officialName: 'Loot Wealth Roth IRA',
  institution: 'Loot Financial',
};

export const account401kDetails = {
  name: "Bob's 401k",
  balanceGroup: BalanceGroupEnum.INVESTMENTS,
  accountType: '401k',
  autoCalculated: false,
  closed: false,
  officialName: 'Loot Wealth 401k',
  institution: 'Loot Financial',
};

export const accountWalletDetails = {
  name: 'Wallet',
  balanceGroup: BalanceGroupEnum.CASH,
  accountType: 'cash',
  autoCalculated: false,
  closed: false,
};
