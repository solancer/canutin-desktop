import { Account } from '@database/entities/account.entity';

export type NewAccountBalanceStatementType = {
  createdAt: Date;
  value: number;
  account: Account;
};
