import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router';

import { DB_DELETE_TRANSACTION_ACK } from '@constants/events';
import { Transaction } from '@database/entities';
import TransactionIpc from '@app/data/transaction.ipc';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { StatusEnum } from '@app/constants/misc';

import Section from '@components/common/Section';

import { message, messageContainer, messageDanger, container } from './styles';
import Button from '@app/components/common/Button';
import { rootRoutesPaths } from '@app/routes';

const Container = styled.div`
  ${container}
`;

const Message = styled.div`
  ${message}
`;

const MessageContainer = styled.div`
  ${messageContainer}
`;

const MessageDanger = styled.div`
  ${messageDanger}
`;

interface RemoveTransactionProps {
  transaction: Transaction;
}

const RemoveTransaction = ({ transaction }: RemoveTransactionProps) => {
  const history = useHistory();
  const [isConfirmationMessageDisplay, setIsConfirmationMessageDisplay] = useState(false);
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

  const onRemove = () => {
    if (!isConfirmationMessageDisplay) {
      setIsConfirmationMessageDisplay(true);
    } else {
      TransactionIpc.deleteTransaction(transaction.id);
    }
  };

  return (
    <Section title="Danger zone">
      <Container>
        <MessageContainer>
          {!isConfirmationMessageDisplay && (
            <>
              <Message>
                Remove transaction <b>{transaction.description}</b>
              </Message>
              <MessageDanger>This action can't be un-done.</MessageDanger>
            </>
          )}
          {isConfirmationMessageDisplay && (
            <Message>
              Are you sure you want to remove the transaction <b>{transaction.description}</b>?
            </Message>
          )}
        </MessageContainer>
        <Button danger={isConfirmationMessageDisplay} onClick={onRemove}>
          Remove
        </Button>
      </Container>
    </Section>
  );
};

export default RemoveTransaction;
