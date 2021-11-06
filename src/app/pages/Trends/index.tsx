import React, { useContext } from 'react';

import ScrollView from '@components/common/ScrollView';
import TrendsChart from '@app/components/Trends/TrendsChart';
import TrendsHeader from '@app/components/Trends/TrendsHeader';
import useGlobalFilterTable from '@app/hooks/useGlobalFilterTable';
import { EntitiesContext } from '@app/context/entitiesContext';
import { generateTrendsChartData, getNetWorthTrends } from '@app/utils/trends.utils';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

const Trends = () => {
  const { accountsIndex, assetsIndex } = useContext(EntitiesContext);
  const { selectedFilterOption, setSelectedFilterOption, numberOfWeeks } = useGlobalFilterTable();
  const netWorthTrends =
    accountsIndex && assetsIndex
      ? generateTrendsChartData(getNetWorthTrends(
          accountsIndex.accounts,
          assetsIndex.assets,
          selectedFilterOption.value.dateFrom,
          selectedFilterOption.value.dateTo
        ), numberOfWeeks)
      : undefined;

  const investmentsTrends =
    accountsIndex && assetsIndex
      ? generateTrendsChartData(getNetWorthTrends(
          accountsIndex.accounts,
          assetsIndex.assets,
          selectedFilterOption.value.dateFrom,
          selectedFilterOption.value.dateTo,
          BalanceGroupEnum.INVESTMENTS
        ), numberOfWeeks)
      : undefined;

  const debtTrends =
    accountsIndex && assetsIndex
      ? generateTrendsChartData(getNetWorthTrends(
          accountsIndex.accounts,
          assetsIndex.assets,
          selectedFilterOption.value.dateFrom,
          selectedFilterOption.value.dateTo,
          BalanceGroupEnum.DEBT
        ), numberOfWeeks)
      : undefined;

      const cashTrends =
      accountsIndex && assetsIndex
        ? generateTrendsChartData(getNetWorthTrends(
            accountsIndex.accounts,
            assetsIndex.assets,
            selectedFilterOption.value.dateFrom,
            selectedFilterOption.value.dateTo,
            BalanceGroupEnum.CASH
          ), numberOfWeeks)
        : undefined;

        const otherAssetsTrends =
      accountsIndex && assetsIndex
        ? generateTrendsChartData(getNetWorthTrends(
            accountsIndex.accounts,
            assetsIndex.assets,
            selectedFilterOption.value.dateFrom,
            selectedFilterOption.value.dateTo,
            BalanceGroupEnum.OTHER_ASSETS
          ), numberOfWeeks)
        : undefined;

  const sections = [
    {
      label: 'Net worth',
      component: <TrendsChart title="Net worth" chartData={netWorthTrends} />,
    },
    {
      label: 'Cash',
      component: <TrendsChart title="Cash" chartData={cashTrends} />,
    },
    {
      label: 'Debt',
      component: <TrendsChart title="Debt" chartData={debtTrends} />,
    },
    {
      label: 'Investments',
      component: <TrendsChart title="Investments" chartData={investmentsTrends} />,
    },
    {
      label: 'Other assets',
      component: <TrendsChart title="Other assets" chartData={otherAssetsTrends} />,
    },
  ];

  return (
    <>
      <ScrollView
        title="Trends"
        sections={sections}
        headerNav={
          <TrendsHeader
            setFilterOption={setSelectedFilterOption}
            filterOption={selectedFilterOption}
          />
        }
      />
    </>
  );
};

export default Trends;
