import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Asset } from '@database/entities';
import { getAssetInformationLabel } from '@app/utils/asset.utils';
import useGlobalFilterTable from '@app/hooks/useGlobalFilterTable';

import ScrollView from '@components/common/ScrollView';
import AssetOverviewHeader from '@components/Asset/AssetOverviewHeader';
import AssetOverviewInformation from '@components/Asset/AssetOverviewInformation';
import AssetOverviewEdit from '@components/Asset/AssetOverviewEdit';
import { getSelectedBalanceStatements } from '@app/utils/balance.utils';

const AssetOverview = () => {
  const {
    state: { balance },
  } = useLocation<{ balance: Asset }>();
  const { selectedFilterOption, setSelectedFilterOption } = useGlobalFilterTable();
  const editAsset = useMemo(() => <AssetOverviewEdit temporalAsset={balance} />, []);

  const [assetOverviewSections, setAssetOverviewSections] = useState([
    {
      label: 'Overview',
      component: (
        <AssetOverviewInformation
          assetBalanceStatements={
            balance.balanceStatements &&
            getSelectedBalanceStatements(
              balance.balanceStatements,
              selectedFilterOption.value.dateFrom,
              selectedFilterOption.value.dateTo
            )
          }
        />
      ),
    },
    {
      label: 'Edit',
      component: editAsset,
    },
  ]);

  useEffect(() => {
    setAssetOverviewSections([
      {
        label: 'Overview',
        component: (
          <AssetOverviewInformation
            assetBalanceStatements={
              balance.balanceStatements &&
              getSelectedBalanceStatements(
                balance.balanceStatements,
                selectedFilterOption.value.dateFrom,
                selectedFilterOption.value.dateTo
              )
            }
          />
        ),
      },
      {
        label: 'Edit',
        component: editAsset,
      },
    ]);
  }, [selectedFilterOption.label]);

  return (
    <>
      <ScrollView
        title={balance.name}
        subTitle={getAssetInformationLabel(balance)}
        headerNav={
          <AssetOverviewHeader
            filterOption={selectedFilterOption}
            setFilterOption={setSelectedFilterOption}
          />
        }
        sections={assetOverviewSections}
      />
    </>
  );
};

export default AssetOverview;
