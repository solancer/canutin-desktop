import React from 'react';
import styled from 'styled-components';

import { AssetBalanceStatement } from '@database/entities';
import { generatePlaceholdersChartPeriod, getAssetBalancesByWeeks } from '@app/utils/balance.utils';

import Section from '@app/components/common/Section';
import Chart from '@app/components/common/Chart';

const Container = styled.div``;

interface AssetOverviewInformationProps {
  assetBalanceStatements: AssetBalanceStatement[] | undefined;
}

const AssetOverviewInformation = ({ assetBalanceStatements }: AssetOverviewInformationProps) => {
  const assetChartBalances =
    assetBalanceStatements && assetBalanceStatements.length > 0
      ? getAssetBalancesByWeeks(assetBalanceStatements, 52)
      : [];

  return (
    <Container>
      <Section title="Balance history">
        <Chart
          chartData={[
            ...generatePlaceholdersChartPeriod(
              assetChartBalances?.[0]?.dateWeek ? assetChartBalances?.[0].dateWeek : new Date(),
              52,
              assetChartBalances.length > 52 ? 52 : assetChartBalances.length
            ),
            ...assetChartBalances,
          ]}
        />
      </Section>
    </Container>
  );
};

export default AssetOverviewInformation;
