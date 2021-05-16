import { parse, format } from 'date-fns';

import { CanutinJsonTransactionType } from '@appTypes/canutin';
import { Account } from '@database/entities';
import { getBalanceGroupByAccountType } from '@database/helpers';
import { CanutinJsonType, UpdatedAccount } from '@appTypes/canutin';

import { SupportedDateFormatType } from './otherCsvConstants';
import { OtherCSVFormSubmit } from './index';

export const getTransactionsForOneAccount = (
  csvData: { [columnName: string]: string }[],
  descriptionColumn: string,
  dateColumn: string,
  dateFormat: SupportedDateFormatType,
  amountColumn: string,
  categoryColumn: string | null,
  categoryValues?: { [categoryColumnValue: string]: string }
) => {
  const transactions = csvData.map((rowData: { [x: string]: any }) => ({
    description: rowData[descriptionColumn],
    date: format(parse(rowData[dateColumn], dateFormat, new Date()), 'MM/dd/yyyy'),
    amount: Number(rowData[amountColumn]),
    excludeFromTotals: true,
    category:
      categoryColumn && categoryValues ? categoryValues[rowData[categoryColumn]] : 'Uncategorized',
  }));

  return transactions;
};

export const getTransactionsForAccountColumn = (
  accountColumn: string,
  accounts: { [accountColumnValue: string]: string } = {},
  csvData: { [columnName: string]: string }[],
  descriptionColumn: string,
  dateColumn: string,
  dateFormat: SupportedDateFormatType,
  amountColumn: string,
  categoryColumn: string | null,
  categoryValues?: { [categoryColumnValue: string]: string }
) => {
  const cFile: CanutinJsonType = { accounts: [] };
  Object.keys(accounts).forEach(accountColumnName => {
    const transactions: CanutinJsonTransactionType[] = [];

    csvData.forEach((rowData: { [x: string]: any }) => {
      if (rowData[accountColumn] === accountColumnName) {
        transactions.push({
          description: rowData[descriptionColumn],
          date: format(parse(rowData[dateColumn], dateFormat, new Date()), 'MM/dd/yyyy'),
          amount: Number(rowData[amountColumn]),
          excludeFromTotals: true,
          category:
            categoryColumn && categoryValues
              ? categoryValues[rowData[categoryColumn]]
              : 'Uncategorized',
        });
      }
    });

    const account = {
      name: accountColumnName,
      balanceGroup: getBalanceGroupByAccountType(accounts[accountColumnName]),
      accountType: accounts[accountColumnName],
      autoCalculate: true,
      transactions,
    };

    cFile.accounts.push(account);
  });

  return cFile;
};

export const getUpdatedTransactionsForExistingAccounts = (
  canutinAccounts: Account[] | null,
  accountColumn: string,
  csvData: { [columnName: string]: string }[],
  descriptionColumn: string,
  dateColumn: string,
  dateFormat: SupportedDateFormatType,
  amountColumn: string,
  categoryColumn: string | null,
  categoryValues?: { [categoryColumnValue: string]: string }
) => {
  const updatedAccounts: UpdatedAccount[] = [];
  csvData.forEach(rowData => {
    const updateAccount = canutinAccounts?.find(account => account.name === rowData[accountColumn]);

    if (updateAccount) {
      const accountAlreadyCreated = updatedAccounts.find(
        account => account.id === updateAccount.id
      );

      if (!accountAlreadyCreated) {
        const transactions: CanutinJsonTransactionType[] = [
          {
            description: rowData[descriptionColumn],
            date: format(parse(rowData[dateColumn], dateFormat, new Date()), 'MM/dd/yyyy'),
            amount: Number(rowData[amountColumn]),
            excludeFromTotals: true,
            category:
              categoryColumn && categoryValues
                ? categoryValues[rowData[categoryColumn]]
                : 'Uncategorized',
          },
        ];
        updatedAccounts.push({ id: updateAccount.id, transactions });
      }

      if (accountAlreadyCreated) {
        accountAlreadyCreated.transactions.push({
          description: rowData[descriptionColumn],
          date: format(parse(rowData[dateColumn], dateFormat, new Date()), 'MM/dd/yyyy'),
          amount: Number(rowData[amountColumn]),
          excludeFromTotals: true,
          category:
            categoryColumn && categoryValues
              ? categoryValues[rowData[categoryColumn]]
              : 'Uncategorized',
        });
      }
    }
  });

  return updatedAccounts;
};

export const formToCantuinJsonFile = (
  formData: OtherCSVFormSubmit,
  csvData: any,
  canutinAccounts: Account[] | null
) => {
  const {
    accountColumn,
    amountColumn,
    categoryColumn,
    dateColumn,
    dateFormat,
    descriptionColumn,
    categories,
    accounts,
  } = formData;
  let canutinFile: CanutinJsonType = { accounts: [] };

  // New account or update account
  if (formData.account) {
    const { name, accountType, autoCalculate, balance, institution } = formData.account;
    const transactions = getTransactionsForOneAccount(
      csvData,
      descriptionColumn,
      dateColumn,
      dateFormat,
      amountColumn,
      categoryColumn,
      categories
    );
    canutinFile = {
      accounts: [
        {
          name,
          balanceGroup: getBalanceGroupByAccountType(accountType),
          accountType,
          institution,
          autoCalculate,
          balance,
          transactions,
        },
      ],
    };

    return { canutinFile };
  }

  // Multiple new accounts
  if (accountColumn) {
    canutinFile = getTransactionsForAccountColumn(
      accountColumn,
      accounts,
      csvData,
      descriptionColumn,
      dateColumn,
      dateFormat,
      amountColumn,
      categoryColumn,
      categories
    );
    const updatedAccounts = getUpdatedTransactionsForExistingAccounts(
      canutinAccounts,
      accountColumn,
      csvData,
      descriptionColumn,
      dateColumn,
      dateFormat,
      amountColumn,
      categoryColumn,
      categories
    );

    return { canutinFile, updatedAccounts };
  }

  return canutinFile;
};
