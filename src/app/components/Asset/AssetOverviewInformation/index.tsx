import React from 'react';
import styled from 'styled-components';

import { AssetBalanceStatement } from '@database/entities';
import { generatePlaceholdersChartPeriod, getBalancesByWeeks } from '@app/utils/balance.utils';

import Section from '@app/components/common/Section';
import Chart from '@app/components/common/Chart';

const Container = styled.div``;

interface AssetOverviewInformationProps {
  assetBalanceStatements: AssetBalanceStatement[] | undefined;
  numberOfWeeks: number;
}

const AssetOverviewInformation = ({
  assetBalanceStatements,
  numberOfWeeks,
}: AssetOverviewInformationProps) => {
  const assetChartBalances =
    assetBalanceStatements && assetBalanceStatements.length > 0
      ? getBalancesByWeeks(assetBalanceStatements, 52)
      : [];

  return (
    <Container>
      <Section title="Balance history">
        <Chart
          chartData={[
            ...generatePlaceholdersChartPeriod(
              assetChartBalances?.[0]?.dateWeek ? assetChartBalances?.[0].dateWeek : new Date(),
              numberOfWeeks,
              assetChartBalances.length > numberOfWeeks ? numberOfWeeks : assetChartBalances.length
            ),
            ...assetChartBalances,
          ]}
        />
      </Section>
    </Container>
  );
};

export default AssetOverviewInformation;
