import React from 'react';

import { Account, BalanceStatement, Transaction } from '@database/entities';

import Section from '@app/components/common/Section';
import Chart from '@app/components/common/Chart';
import TransactionsFilterTable from '@app/components/Transactions/TransactionsFilterTable';
import EmptyCard from '@app/components/common/EmptyCard';
import {
  getTransactionBalanceByWeeks,
  generatePlaceholdersChartPeriod,
  getBalancesByWeeks,
} from '@app/utils/balance.utils';

interface AccountOverviewInformationProps {
  account: Account;
  transactions: Transaction[];
  numberOfWeeks: number;
}

const AccountOverviewInformation = ({
  account,
  transactions,
  numberOfWeeks,
}: AccountOverviewInformationProps) => {
  const accountChartBalances =
    account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate === false
      ? getBalancesByWeeks(account.balanceStatements as BalanceStatement[], 52)
      : getTransactionBalanceByWeeks(transactions, 52);

  return (
    <>
      <Section title="Balance history">
        {accountChartBalances.length > 0 ? (
          <Chart
            chartData={[
              ...generatePlaceholdersChartPeriod(
                accountChartBalances?.[0].dateWeek
                  ? accountChartBalances?.[0].dateWeek
                  : new Date(),
                numberOfWeeks,
                accountChartBalances.length > numberOfWeeks
                  ? numberOfWeeks
                  : accountChartBalances.length
              ),
              ...accountChartBalances,
            ]}
          />
        ) : (
          <EmptyCard message="No balances were found in the selected date range" />
        )}
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
