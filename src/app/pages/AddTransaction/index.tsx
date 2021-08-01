import React from 'react';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import TransactionForm from '@components/Transactions/TransactionForm';

const AddTransactions = () => <ScrollView title="Add transaction">
  <Section title="Transaction details">
    <TransactionForm />
  </Section>
</ScrollView>;

export default AddTransactions;
