import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Asset } from '@database/entities';
import { getAssetInformationLabel } from '@app/utils/asset.utils';
import useGlobalFilterTable from '@app/hooks/useGlobalFilterTable';
import { EntitiesContext } from '@app/context/entitiesContext';

import ScrollView from '@components/common/ScrollView';
import AssetOverviewHeader from '@components/Asset/AssetOverviewHeader';
import AssetOverviewInformation from '@components/Asset/AssetOverviewInformation';
import AssetOverviewEdit from '@components/Asset/AssetOverviewEdit';
import { getSelectedBalanceStatements } from '@app/utils/balance.utils';

const AssetOverview = () => {
  const { assetsIndex } = useContext(EntitiesContext);
  const { assetName } = useParams<{ assetName: string }>();
  const asset = assetsIndex!.assets.find(asset => asset.name === assetName && asset) as Asset;
  const { selectedFilterOption, setSelectedFilterOption, numberOfWeeks } = useGlobalFilterTable();
  const editAsset = useMemo(() => <AssetOverviewEdit temporalAsset={asset} />, []);

  const [assetOverviewSections, setAssetOverviewSections] = useState([
    {
      label: 'Overview',
      component: (
        <AssetOverviewInformation
          assetBalanceStatements={
            asset.balanceStatements &&
            getSelectedBalanceStatements(
              asset.balanceStatements,
              selectedFilterOption.value.dateFrom,
              selectedFilterOption.value.dateTo
            )
          }
          numberOfWeeks={numberOfWeeks}
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
              asset.balanceStatements &&
              getSelectedBalanceStatements(
                asset.balanceStatements,
                selectedFilterOption.value.dateFrom,
                selectedFilterOption.value.dateTo
              )
            }
            numberOfWeeks={numberOfWeeks}
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
        title={asset.name}
        subTitle={getAssetInformationLabel(asset)}
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
