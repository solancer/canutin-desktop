import React, { useState, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import Section from '@components/common/Section';
import { SegmentedControl, Segment } from '@components/common/SegmentedControl';
import BalancesByGroup from '@components/BalanceSheet/BalancesByGroup';

import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK } from '@constants/events';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';
import { Account, Asset } from '@database/entities';
import {
  getBalanceForAccounts,
  getBalanceForAllAccountsAssets,
  getBalanceForAssets,
} from '@app/utils/balance.utils';

export enum BalanceSheetSegmentsEnum {
  ALL = 'all',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
}

const BalanceSheetSection = () => {
  const [selectedSegment, setSelectedSegment] = useState(BalanceSheetSegmentsEnum.ALL);
  const [accounts, setAccounts] = useState<Account[]>();
  const [assets, setAssets] = useState<Asset[]>();

  useEffect(() => {
    AccountIpc.getAccounts();
    AssetIpc.getAssets();

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssets(assets);
    });

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  // Segment count
  const countList = {
    all: '',
    accounts: accounts?.length,
    assets: assets?.length,
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

  const allBalancesListData =
    assets && accounts && getBalanceForAllAccountsAssets(assets, accounts);
  const assetsBalancesListData = assets && getBalanceForAssets(assets);
  const accountBalancesListData = accounts && getBalanceForAccounts(accounts);

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
