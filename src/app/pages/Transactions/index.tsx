import React from 'react';

import ScrollView from '@components/common/ScrollView';
import TransactionsOverviewSection from '@app/components/Transactions/TransactionsOverviewSection';
import TransactionsHeaderButtons from '@app/components/Transactions/TransactionsHeaderButtons';

const Transactions = () => (
  <>
    <ScrollView title="Transactions" headerNav={<TransactionsHeaderButtons />}>
      <TransactionsOverviewSection />
    </ScrollView>
  </>
);

export default Transactions;
