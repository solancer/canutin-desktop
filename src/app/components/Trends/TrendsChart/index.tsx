import Chart from "@app/components/common/Chart";
import Section from "@app/components/common/Section";
import { ChartPeriodType } from "@app/utils/balance.utils";

interface TrendsChartProps {
  title: string;
  chartData?: ChartPeriodType[];
}

const TrendsChart = ({ title, chartData }: TrendsChartProps) => {
  return (
      <Section title={title}>
        {chartData  && <Chart
          chartData={chartData}
        />}
      </Section>
  );
};

export default TrendsChart;
