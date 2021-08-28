import React from 'react';
import { isAfter, isBefore } from 'date-fns';

import { Account, BalanceStatement, Transaction } from '@database/entities';

import Section from '@app/components/common/Section';
import Chart from '@app/components/common/Chart';
import TransactionsFilterTable from '@app/components/Transactions/TransactionsFilterTable';
import {
  getTransactionBalanceByWeeks,
  generatePlaceholdersChartPeriod,
  getAccountBalancesByWeeks,
} from '@app/utils/balance.utils';

interface AccountOverviewInformationProps {
  account: Account;
  transactions: Transaction[];
  numberOfWeeks: number;
}

const AccountOverviewInformation = ({ account, transactions, numberOfWeeks }: AccountOverviewInformationProps) => {
  const accountChartBalances = account.balanceStatements?.[account.balanceStatements?.length - 1]
    .autoCalculate === false
    ? getAccountBalancesByWeeks(account.balanceStatements as BalanceStatement[], 52)
    : getTransactionBalanceByWeeks(transactions, 52);

  return (
    <>
      <Section title="Balance history">
        <Chart
          chartData={[
            ...generatePlaceholdersChartPeriod(
              accountChartBalances?.[0].dateWeek ? accountChartBalances?.[0].dateWeek : new Date(),
              numberOfWeeks,
              accountChartBalances.length > numberOfWeeks ? numberOfWeeks : accountChartBalances.length,
            ),
            ...accountChartBalances,
          ]}
        />
      </Section>
      {account.transactions && (
        <Section title="Account transactions">
          <TransactionsFilterTable withoutGlobalFilters transactions={transactions} />
        </Section>
      )}
    </>
  );
};

export default AccountOverviewInformation;
