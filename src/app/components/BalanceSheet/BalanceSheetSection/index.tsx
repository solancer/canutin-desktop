import React, { useState } from 'react';

import Section from '@components/common/Section';
import { SegmentedControl, Segment } from '@components/common/SegmentedControl';
import BalancesByGroup from '@app/components/BalanceSheet/BalancesByGroup';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

export enum BalanceSheetSegmentsEnum {
  ALL = 'all',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
}

const BalanceSheetSection = () => {
  const [selectedSegment, setSelectedSegment] = useState(BalanceSheetSegmentsEnum.ALL);

  // Segment count
  const countAccounts = 10;
  const countAssets = 9;
  const countList = {
    all: '',
    accounts: countAccounts,
    assets: countAssets,
  };
  const balanceList = {
    all: {
      [BalanceGroupEnum.CASH]: {
        Checking: [
          { name: 'Personal Checking', type: 'Account', amount: 750 },
          { name: 'My Checking', type: 'Account', amount: 1283 },
          { name: 'Advantage Plus Checking Total', type: 'Account', amount: 33.23 },
        ],
        Savings: [
          { name: 'Personal Checking', type: 'Account', amount: 506.23 },
          { name: 'My Checking', type: 'Asset', amount: 99.1 },
          { name: 'Advantage Plus Checking Total', type: 'Account', amount: 0 },
        ],
      },
    },
    accounts: { [BalanceGroupEnum.CASH]: {}, totalCount: 10 },
    assets: { [BalanceGroupEnum.CASH]: {}, totalCount: 9 },
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

  const allBalanceSheet = <BalancesByGroup balancesByGroupData={balanceList.all} />;
  const accountsBalanceSheet = <div>Accounts</div>;
  const assetsBalanceSheet = <div>Assets</div>;

  return (
    <Section title="Balances" scope={balanceSheetSegments}>
      {selectedSegment === BalanceSheetSegmentsEnum.ALL && allBalanceSheet}
      {selectedSegment === BalanceSheetSegmentsEnum.ACCOUNTS && accountsBalanceSheet}
      {selectedSegment === BalanceSheetSegmentsEnum.ASSETS && assetsBalanceSheet}
    </Section>
  );
};

export default BalanceSheetSection;
