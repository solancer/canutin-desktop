export interface FilterTransactionInterface {
  dateFrom: Date;
  dateTo: Date;
}

export type NewTransactionType = {
  accountId: number;
  description: string;
  date: Date;
  categoryName: string;
  balance: number;
  excludeFromTotals: boolean;
};
