import { format, isAfter, isBefore, sub } from 'date-fns';

import Chart from '@components/common/Chart';
import Section from '@components/common/Section';
import EmptyCard from '@components/common/EmptyCard';

import { generatePlaceholdersChartMonthPeriod, TransactionsTrailingCashflowType } from '@app/utils/balance.utils';

interface CashflowChartProps {
  trailingCashflow: TransactionsTrailingCashflowType[] | undefined;
}

const CashflowChart = ({ trailingCashflow }: CashflowChartProps) => {
  const generateTrailingCashflowChartData = trailingCashflow
    ?.filter(
      ({ month }) => isAfter(month, sub(new Date(), { months: 12 })) && isBefore(month, new Date())
    )
    .map(({ id, expenses, income, month, surplus }) => ({
      id,
      expenses,
      income,
      surplus,
      label: format(month, 'MMM'),
      balance: surplus,
      month,
    }));

  return trailingCashflow ? (
    <Section title="Cashflow">
      {generateTrailingCashflowChartData?.length ? (
        <Chart
          chartData={[
            ...generatePlaceholdersChartMonthPeriod(
              generateTrailingCashflowChartData?.[0]?.month
                ? generateTrailingCashflowChartData?.[0]?.month
                : new Date(),
              12,
              generateTrailingCashflowChartData.length > 12
                ? 12
                : generateTrailingCashflowChartData.length
            ),
            ...generateTrailingCashflowChartData,
          ]}
        />
      ) : <EmptyCard message="Not enough transactions to display this chart." />}
    </Section>
  ) : null;
};

export default CashflowChart;
