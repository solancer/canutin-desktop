import { BrowserWindow } from 'electron';

import { StatusEnum } from '@appConstants/misc';
import { FILTER_TRANSACTIONS_ACK } from '@constants/repositories';
import { FilterTransactionInterface } from '@appTypes/transaction.type';
import { TransactionRepository } from '@database/repositories/transaction.repository';

export const filterTransactions = async (
  win: BrowserWindow | null,
  filter: FilterTransactionInterface
) => {
  try {
    const transactions = await TransactionRepository.getFilterTransactions(filter);
    win?.webContents.send(FILTER_TRANSACTIONS_ACK, {
      transactions,
      status: StatusEnum.POSITIVE,
    });
  } catch (error) {
    win?.webContents.send(FILTER_TRANSACTIONS_ACK, {
      status: StatusEnum.NEGATIVE,
    });
  }
};
