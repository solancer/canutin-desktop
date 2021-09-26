import React, { useState, useEffect, useContext } from 'react';

import ScrollView from '@components/common/ScrollView';
import BigPictureSummary from '@components/BigPicture/BigPictureSummary';
import TrailingCashflow from '@components/BigPicture/TrailingCashflow';
import CashflowChart from '@components/BigPicture/CashflowChart';
import SectionRow from '@components/common/SectionRow';

import { EntitiesContext } from '@app/context/entitiesContext';
import {
  getTotalBalanceByGroup,
  getTransactionsTrailingCashflow,
  TotalBalanceType,
  TransactionsTrailingCashflowType,
} from '@app/utils/balance.utils';

const TheBigPicture = () => {
  const { assetsIndex, transactionsIndex, accountsIndex } = useContext(EntitiesContext);
  const [totalBalance, setTotalBalance] = useState<TotalBalanceType>();
  const [trailingCashflow, setTrailingCashflow] = useState<TransactionsTrailingCashflowType[]>();

  useEffect(() => {
    assetsIndex &&
      accountsIndex &&
      setTotalBalance(getTotalBalanceByGroup(assetsIndex.assets, accountsIndex.accounts));
  }, [assetsIndex, accountsIndex]);

  useEffect(() => {
    transactionsIndex &&
      setTrailingCashflow(getTransactionsTrailingCashflow(transactionsIndex.transactions));
  }, [transactionsIndex]);

  return (
    <>
      <ScrollView title="The big picture">
        <BigPictureSummary totalBalance={totalBalance} />
        <SectionRow>
          <TrailingCashflow trailingCashflow={trailingCashflow} />
        </SectionRow>
        <CashflowChart trailingCashflow={trailingCashflow} />
      </ScrollView>
    </>
  );
};

export default TheBigPicture;
