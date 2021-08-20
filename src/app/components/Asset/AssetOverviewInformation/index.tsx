import React from 'react';
import styled from 'styled-components';

import { Asset } from '@database/entities';
import { generatePlaceholdersChartPeriod, getAssetBalancesByWeeks } from '@app/utils/balance.utils';

import Section from '@app/components/common/Section';
import Chart from '@app/components/common/Chart';

const Container = styled.div``;

interface AssetOverviewInformationProps {
  asset: Asset;
}

const AssetOverviewInformation = ({ asset }: AssetOverviewInformationProps) => {
  const assetChartBalances = asset.balanceStatements
    ? getAssetBalancesByWeeks(asset.balanceStatements, 53)
    : [];

  return (
    <Container>
      <Section title="Balance history">
        <Chart
          chartData={[
            ...generatePlaceholdersChartPeriod(
              assetChartBalances[0].dateWeek,
              53,
              assetChartBalances.length
            ),
            ...assetChartBalances,
          ]}
        />
      </Section>
    </Container>
  );
};

export default AssetOverviewInformation;
