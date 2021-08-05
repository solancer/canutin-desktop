import React from 'react';
import { useLocation } from 'react-router-dom';

import { Transaction } from '@database/entities';

import ScrollView from '@components/common/ScrollView';
import RemoveTransaction from '@components/Transactions/RemoveTransaction';
import Section from '@components/common/Section';
import TransactionForm from '@components/Transactions/TransactionForm';

const EditTransaction = () => {
  const {
    state: { transaction },
  } = useLocation<{ transaction: Transaction }>();

  const initialState = {
    account: transaction.account.id.toString(),
    balance: transaction.amount.toString(),
    category: transaction.category.name,
    year: transaction.date.getFullYear(),
    month: transaction.date.getMonth(),
    day: transaction.date.getDate(),
    description: transaction.description,
    excludeFromTotals: transaction.excludeFromTotals,
    id: transaction.id,
  };

  return (
    <ScrollView title="Edit transaction" subTitle={transaction.account.name}>
      <Section title="Transaction details">
        <TransactionForm initialState={initialState} />
      </Section>
      <RemoveTransaction transaction={transaction} />
    </ScrollView>
  );
};

export default EditTransaction;
