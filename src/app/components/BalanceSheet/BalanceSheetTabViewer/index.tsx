import React, { useState } from 'react';
import styled from 'styled-components';

import BalanceSheetTab from '@components/BalanceSheet/BalanceSheetTab';
import BalanceList from '@components/BalanceSheet/BalanceList';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

import {
  container,
  header,
  balanceSheetTitle,
  balanceSheetTabs,
  balanceSheetViewer,
} from './styles';

const Container = styled.div`
  ${container}
`;

const Header = styled.div`
  ${header}
`;

const BalanceSheetTitle = styled.div`
  ${balanceSheetTitle}
`;

const BalanceSheetTabs = styled.div`
  ${balanceSheetTabs}
`;

const BalanceSheetViewer = styled.div`
  ${balanceSheetViewer}
`;

export enum BalanceSheetTabsEnum {
  ALL = 'ALL',
  ACCOUNTS = 'ACCOUNTS',
  ASSETS = 'ASSETS',
}

const BalanceSheetTabViewer = () => {
  const [selectedTab, setSelectedTab] = useState(BalanceSheetTabsEnum.ALL);

  // Tab count
  const countAccounts = 10;
  const countAssets = 9;
  const countList = {
    ALL: '',
    ACCOUNTS: countAccounts,
    ASSETS: countAssets,
  };
  const balanceList = {
    ALL: {
      [BalanceGroupEnum.CASH]: {
        Checking: [
          { name: 'Personal Checking', type: 'Account', amount: 250 },
          { name: 'My Checking', type: 'Account', amount: 250 },
          { name: 'Advantage Plus Checking Total', type: 'Account', amount: 250 },
        ],
        Checking2: [
          { name: 'Personal Checking', type: 'Account', amount: 250 },
          { name: 'My Checking', type: 'Account', amount: 250 },
          { name: 'Advantage Plus Checking Total', type: 'Account', amount: 250 },
        ],
      },
    },
    ACCOUNTS: { [BalanceGroupEnum.CASH]: {}, totalCount: 10 },
    ASSETS: { [BalanceGroupEnum.CASH]: {}, totalCount: 9 },
  };

  const allBalanceSheet = <BalanceList balanceListData={balanceList.ALL} />;
  const accountsBalanceSheet = <div>Accounts</div>;
  const assetsBalanceSheet = <div>Assets</div>;

  return (
    <Container>
      <Header>
        <BalanceSheetTitle>Balances</BalanceSheetTitle>
        <BalanceSheetTabs>
          {Object.values(BalanceSheetTabsEnum).map((balanceSheetTabTitle, key) => (
            <BalanceSheetTab
              onClick={() => setSelectedTab(balanceSheetTabTitle)}
              isActive={balanceSheetTabTitle === selectedTab}
              key={key}
            >{`${balanceSheetTabTitle} ${countList[balanceSheetTabTitle]}`}</BalanceSheetTab>
          ))}
        </BalanceSheetTabs>
      </Header>
      <BalanceSheetViewer>
        {selectedTab === BalanceSheetTabsEnum.ALL && allBalanceSheet}
        {selectedTab === BalanceSheetTabsEnum.ACCOUNTS && accountsBalanceSheet}
        {selectedTab === BalanceSheetTabsEnum.ASSETS && assetsBalanceSheet}
      </BalanceSheetViewer>
    </Container>
  );
};

export default BalanceSheetTabViewer;
