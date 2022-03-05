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
  const { assetsIndex, accountsIndex } = useContext(EntitiesContext);
  const [totalBalance, setTotalBalance] = useState<TotalBalanceType>();
  const [trailingCashflow, setTrailingCashflow] = useState<TransactionsTrailingCashflowType[]>();

  useEffect(() => {
    const transactions =
      accountsIndex &&
      accountsIndex.accounts
        .map(account => (account.transactions ? account.transactions : []))
        .flat();
    if (transactions) {
      transactions.sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort the transactions in 'DESC' order
      setTrailingCashflow(getTransactionsTrailingCashflow(transactions));
    }

    assetsIndex &&
      accountsIndex &&
      setTotalBalance(getTotalBalanceByGroup(assetsIndex.assets, accountsIndex.accounts));
  }, [assetsIndex, accountsIndex]);

  return (
    <>
      <ScrollView title="The big picture">
        <BigPictureSummary totalBalance={totalBalance} />
        <CashflowChart trailingCashflow={trailingCashflow} />
        <SectionRow>
          <TrailingCashflow trailingCashflow={trailingCashflow} />
        </SectionRow>
      </ScrollView>
    </>
  );
};

export default TheBigPicture;
