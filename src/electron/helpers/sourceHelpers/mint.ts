import { CanutinJsonType } from '@appTypes/canutin';

export interface MintCsvEntryType {
  Date: string;
  Description: string;
  'Original Description': string;
  Amount: number;
  'Transaction Type': 'credit' | 'debit';
  Category: string;
  'Account Name': string;
  Labels: string;
  Notes: string;
}

export const mintCsvToJson = (mintCsv: MintCsvEntryType[]) => {
  let countAccounts = 0;
  const finalJson = mintCsv.reduce<CanutinJsonType>(
    (acc, mintEntry) => {
      const accountIndex = acc.accounts.findIndex(
        account => account.name === mintEntry['Account Name']
      );

      if (!mintEntry['Transaction Type']) {
        throw Error('Not supported');
      }

      const transaction = {
        description: mintEntry.Description,
        date: mintEntry.Date,
        amount: mintEntry['Transaction Type'] === 'credit' ? mintEntry.Amount : -mintEntry.Amount,
        excludeFromTotals: false,
        category: mintEntry.Category,
      };

      if (accountIndex > -1) {
        acc.accounts[accountIndex].transactions.push(transaction);
      } else {
        countAccounts++;
        if (!mintEntry['Account Name']) {
          throw Error('Not supported');
        }

        acc.accounts.push({
          name: mintEntry['Account Name'],
          balanceGroup: 'Cash',
          accountType: 'Mint',
          transactions: [transaction],
        });
      }

      return acc;
    },
    { accounts: [] }
  );

  return { data: finalJson, metadata: { countAccounts } };
};
