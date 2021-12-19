import React, { useContext, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { Transaction } from '@database/entities';
import { DB_DELETE_TRANSACTION_ACK } from '@constants/events';
import TransactionIpc from '@app/data/transaction.ipc';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { StatusEnum } from '@app/constants/misc';
import { rootRoutesPaths } from '@app/routes';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import TransactionForm from '@components/Transactions/TransactionForm';
import RemoveSection from '@components/common/Form/RemoveSection';

const EditTransaction = () => {
  const {
    state: { transaction },
  } = useLocation<{ transaction: Transaction }>();
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);

  useEffect(() => {
    ipcRenderer.on(DB_DELETE_TRANSACTION_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'Transaction removed',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        history.push(rootRoutesPaths.transactions);
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message: message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_DELETE_TRANSACTION_ACK);
    };
  }, []);

  const initialState = {
    account: transaction.account.id.toString(),
    amount: transaction.amount.toString(),
    category: transaction.category.name,
    year: transaction.date.getUTCFullYear(),
    month: transaction.date.getUTCMonth(),
    day: transaction.date.getUTCDate(),
    description: transaction.description,
    excludeFromTotals: transaction.excludeFromTotals,
    id: transaction.id,
  };

  const onRemove = () => {
    TransactionIpc.deleteTransaction(transaction.account.id, transaction.id);
  };

  return (
    <ScrollView title="Edit transaction" subTitle={transaction.description}>
      <Section title="Transaction details">
        <TransactionForm initialState={initialState} />
      </Section>
      <RemoveSection
        confirmationMessage="Are you sure you want to remove the transaction?"
        onRemove={onRemove}
        removeMessage={
          <>
            Remove transaction <b>{transaction.description}</b>
          </>
        }
      />
    </ScrollView>
  );
};

export default EditTransaction;
