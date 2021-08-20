import React from 'react';

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
}

const AccountOverviewInformation = ({ account, transactions }: AccountOverviewInformationProps) => {
  const accountChartBalances = account.balanceStatements?.[account.balanceStatements?.length - 1]
    .autoCalculate === false
    ? getAccountBalancesByWeeks(account.balanceStatements as BalanceStatement[], 53)
    : getTransactionBalanceByWeeks(transactions, 53);

  return (
    <>
      <Section title="Balance history">
        <Chart
          chartData={[
            ...generatePlaceholdersChartPeriod(
              accountChartBalances[0].dateWeek,
              53,
              accountChartBalances.length
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
