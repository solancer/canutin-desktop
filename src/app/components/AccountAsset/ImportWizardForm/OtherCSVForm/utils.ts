import { parse, format, isEqual } from 'date-fns';

import { Account } from '@database/entities';
import { getBalanceGroupByAccountType } from '@database/helpers';
import { CanutinFileType, CanutinFileTransactionType, UpdatedAccount } from '@appTypes/canutin';

import { SupportedDateFormatType } from './otherCsvConstants';
import { OtherCSVFormSubmit } from './index';
import { CANUTIN_FILE_DATE_FORMAT } from '@constants';

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
    date: format(parse(rowData[dateColumn], dateFormat, new Date()), CANUTIN_FILE_DATE_FORMAT),
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
  const cFile: CanutinFileType = { accounts: [] };
  Object.keys(accounts).forEach(accountColumnName => {
    let accountName = accountColumnName;
    const transactions: CanutinFileTransactionType[] = [];

    csvData.forEach((rowData: { [x: string]: any }) => {
      if (rowData[accountColumn].replace("'", '') === accountColumnName) {
        accountName = rowData[accountColumn];
        transactions.push({
          description: rowData[descriptionColumn],
          date: format(
            parse(rowData[dateColumn], dateFormat, new Date()),
            CANUTIN_FILE_DATE_FORMAT
          ),
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
      name: accountName,
      balanceGroup: getBalanceGroupByAccountType(accounts[accountColumnName]),
      accountType: accounts[accountColumnName],
      autoCalculate: true,
      transactions,
    };

    cFile.accounts.push(account);
  });

  return cFile;
};

export const isNewTransactionAlreadyOnTheAccount = (
  account: Account,
  newTransaction: CanutinFileTransactionType,
  rowDate: string,
  dateFormat: SupportedDateFormatType
) =>
  account.transactions?.some(
    transaction =>
      transaction.description === newTransaction.description &&
      isEqual(transaction.date, parse(rowDate, dateFormat, new Date())) &&
      transaction.amount === newTransaction.amount
  );

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

      const newTransaction = {
        description: rowData[descriptionColumn],
        date: format(parse(rowData[dateColumn], dateFormat, new Date()), CANUTIN_FILE_DATE_FORMAT),
        amount: Number(rowData[amountColumn]),
        excludeFromTotals: true,
        category:
          categoryColumn && categoryValues
            ? categoryValues[rowData[categoryColumn]]
            : 'Uncategorized',
      };

      if (
        !isNewTransactionAlreadyOnTheAccount(
          updateAccount,
          newTransaction,
          rowData[dateColumn],
          dateFormat
        )
      ) {
        if (!accountAlreadyCreated) {
          const transactions: CanutinFileTransactionType[] = [newTransaction];
          updatedAccounts.push({ id: updateAccount.id, transactions });
        }

        if (accountAlreadyCreated) {
          accountAlreadyCreated.transactions.push(newTransaction);
        }
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
  let canutinFile: CanutinFileType = { accounts: [] };

  // New account or update account
  if (formData.account) {
    let canutinAccount;
    if (formData.account.importAccount) {
      canutinAccount = canutinAccounts?.find(
        ({ id }) => id === Number(formData?.account?.importAccount)
      );
    }
    let { name, accountType, autoCalculate, balance, institution } = formData.account;

    if (canutinAccount) {
      name = canutinAccount.name;
      accountType = canutinAccount.accountType.name;
      balance = canutinAccount.balanceGroup;
      if (canutinAccount?.balanceStatements?.[canutinAccount.balanceStatements?.length - 1]) {
        autoCalculate =
          canutinAccount?.balanceStatements?.[canutinAccount.balanceStatements?.length - 1]
            .autoCalculate;
      }
      if (canutinAccount.institution) {
        institution = canutinAccount.institution;
      }
    }

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
