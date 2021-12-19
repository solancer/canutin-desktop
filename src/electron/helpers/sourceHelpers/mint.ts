import { getUnixTime, parse } from 'date-fns';

import { CanutinFileType } from '@appTypes/canutinFile.type';
import mapCategories from '@database/helpers/importResources/mapCategories';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export interface MintCsvEntryType {
  Date: string;
  Description: string;
  'Original Description': string;
  Amount: number;
  'Transaction Type': 'credit' | 'debit';
  Category: keyof typeof mapCategories;
  'Account Name': string;
  Labels: string;
  Notes: string;
}

export const mintCsvToJson = (mintCsv: MintCsvEntryType[]) => {
  let countAccounts = 0;
  let countTransactions = 0;

  const finalJson = mintCsv.reduce<CanutinFileType>(
    (acc, mintEntry) => {
      const accountIndex = acc.accounts.findIndex(
        account => account.name === mintEntry['Account Name']
      );

      if (!mintEntry['Transaction Type']) {
        throw Error('Not supported');
      }

      const transaction = {
        description: mintEntry.Description,
        date: getUnixTime(parse(mintEntry.Date, 'M/dd/yyyy', new Date())),
        amount: mintEntry['Transaction Type'] === 'credit' ? mintEntry.Amount : -mintEntry.Amount,
        excludeFromTotals: false,
        category: mapCategories(mintEntry.Category),
      };

      countTransactions++;

      if (accountIndex > -1) {
        acc.accounts[accountIndex].transactions?.push(transaction);
      } else {
        countAccounts++;
        if (!mintEntry['Account Name']) {
          throw Error('Not supported');
        }

        acc.accounts.push({
          name: mintEntry['Account Name'],
          balanceGroup: BalanceGroupEnum.CASH,
          accountType: 'checking',
          transactions: [transaction],
          autoCalculated: true,
          closed: false,
        });
      }

      return acc;
    },
    { accounts: [] }
  );

  return { data: finalJson, metadata: { countAccounts, countTransactions } };
};
