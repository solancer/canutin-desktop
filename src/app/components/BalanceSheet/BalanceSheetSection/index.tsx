import React, { useState, useContext } from 'react';
import merge from 'deepmerge';

import Section from '@components/common/Section';
import { SegmentedControl, Segment } from '@components/common/SegmentedControl';
import BalancesByGroup from '@components/BalanceSheet/BalancesByGroup';

import {
  getBalanceForAccountsByBalanceGroup,
  getBalanceForAssetByBalanceGroup,
} from '@app/utils/balance.utils';
import { EntitiesContext } from '@app/context/entitiesContext';

export enum BalanceSheetSegmentsEnum {
  ALL = 'all',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
}

const BalanceSheetSection = () => {
  const [selectedSegment, setSelectedSegment] = useState(BalanceSheetSegmentsEnum.ALL);
  const { assetsIndex, accountsIndex } = useContext(EntitiesContext);

  // Segment count
  const countList = {
    all: '',
    accounts: accountsIndex?.accounts?.filter(({ closed }) => !closed).length,
    assets: assetsIndex?.assets.filter(
      ({ balanceStatements }) =>
        balanceStatements && !balanceStatements[balanceStatements.length - 1].sold
    ).length,
  };

  const balanceSheetSegments = (
    <SegmentedControl>
      {Object.values(BalanceSheetSegmentsEnum).map((balanceSheetSegmentTitle, key) => (
        <Segment
          onClick={() => setSelectedSegment(balanceSheetSegmentTitle)}
          isActive={balanceSheetSegmentTitle === selectedSegment}
          key={key}
          label={`${balanceSheetSegmentTitle} ${countList[balanceSheetSegmentTitle]}`}
        />
      ))}
    </SegmentedControl>
  );

  const assetsBalancesListData = assetsIndex && getBalanceForAssetByBalanceGroup(assetsIndex.assets);
  const accountBalancesListData = accountsIndex && getBalanceForAccountsByBalanceGroup(accountsIndex.accounts);
  const allBalancesListData =
    (assetsBalancesListData ||
    accountBalancesListData) &&
    merge(assetsBalancesListData ? assetsBalancesListData : {}, accountBalancesListData ? accountBalancesListData : {});

  const allBalanceSheet = <BalancesByGroup balancesByGroupData={allBalancesListData || {}} />;
  const accountsBalanceSheet = (
    <BalancesByGroup balancesByGroupData={accountBalancesListData || {}} />
  );
  const assetsBalanceSheet = <BalancesByGroup balancesByGroupData={assetsBalancesListData || {}} />;

  return (
    <Section title="Balances" scope={balanceSheetSegments}>
      {selectedSegment === BalanceSheetSegmentsEnum.ALL && allBalanceSheet}
      {selectedSegment === BalanceSheetSegmentsEnum.ACCOUNTS && accountsBalanceSheet}
      {selectedSegment === BalanceSheetSegmentsEnum.ASSETS && assetsBalanceSheet}
    </Section>
  );
};

export default BalanceSheetSection;
