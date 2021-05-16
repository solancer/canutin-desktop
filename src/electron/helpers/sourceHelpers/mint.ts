import { CanutinJsonType } from '@appTypes/canutin';
import mintCategories from '@database/helpers/importResources/mintCategories';
import { BalanceGroupEnum } from '@enums/balancegGroup.enum';

export interface MintCsvEntryType {
  Date: string;
  Description: string;
  'Original Description': string;
  Amount: number;
  'Transaction Type': 'credit' | 'debit';
  Category: keyof typeof mintCategories;
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
        category: mintCategories[mintEntry.Category],
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
          balanceGroup: BalanceGroupEnum.CASH,
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
