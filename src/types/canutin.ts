import { BalanceGroupEnum } from '@enums/balancegGroup.enum';

export interface CanutinFileBudgetType {
  name: string;
  targetAmount: number;
  type: string;
  date: string;
}

export interface CanutinFileTransactionType {
  description: string;
  date: string;
  amount: number;
  excludeFromTotals: boolean;
  category: string;
  budget?: CanutinFileBudgetType;
}

export interface CanutinFileAccountType {
  name: string;
  autoCalculate?: boolean;
  balance?: number;
  officialName?: string;
  institution?: string;
  balanceGroup: BalanceGroupEnum;
  accountType: string;
  transactions: CanutinFileTransactionType[];
}

export interface CanutinFileType {
  accounts: CanutinFileAccountType[];
}

export interface UpdatedAccount {
  id: number;
  transactions: CanutinFileTransactionType[];
}
