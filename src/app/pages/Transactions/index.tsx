import React from 'react';

import ScrollView from '@components/common/ScrollView';
import TransactionsOverviewSection from '@components/Transactions/TransactionsOverviewSection';
import TransactionsHeaderButtons from '@components/Transactions/TransactionsHeaderButtons';

const Transactions = () => (
  <>
    <ScrollView title="Transactions" headerNav={<TransactionsHeaderButtons />}>
      <TransactionsOverviewSection />
    </ScrollView>
  </>
);

export default Transactions;
