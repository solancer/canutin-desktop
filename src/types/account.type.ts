import { BalanceGroupEnum } from '@enums/balanceGroup.enum';
import { NewAccountBalanceStatementType } from '@appTypes/accountBalanceStatement.type';
import { CanutinFileAccountBalanceStatementType } from '@appTypes/canutinFile.type';

// FIXME: consider extending `NewAccountType` from `Account` and ommitting the un-necessary values.
export type NewAccountType = {
  name: string;
  balanceGroup: BalanceGroupEnum;
  accountType: string;
  autoCalculated: boolean;
  closed: boolean;
  officialName?: string;
  institution?: string;
  balanceStatements?: NewAccountBalanceStatementType[] | CanutinFileAccountBalanceStatementType[];
};

export type AccountEditBalanceSubmitType = {
  accountId: number;
  autoCalculated: boolean;
  balance: number;
  closed: boolean;
};

export type AccountEditDetailsSubmitType = {
  accountId: number;
  accountType: string;
  balanceGroup: number;
  name: string;
  officialName?: string;
  institution?: string;
};

export type AddNewAccountType = AccountEditBalanceSubmitType & AccountEditDetailsSubmitType;
