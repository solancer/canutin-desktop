import React, { useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';

import { Account } from '@database/entities';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import AccountIpc from '@app/data/account.ipc';
import { StatusEnum } from '@app/constants/misc';
import { DB_GET_ACCOUNT_ACK, DB_DELETE_ACCOUNT_ACK } from '@constants/events';
import { rootRoutesPaths } from '@app/routes';

import AccountEditBalanceForm from '../AccountEditBalanceForm';
import AccountEditDetailsForm from '../AccountEditDetailsForm';

interface AccountOverviewEditProps {
  temporalAccount: Account;
}

const AccountOverviewEdit = ({ temporalAccount }: AccountOverviewEditProps) => {
  const [account, setAccount] = useState<Account>();
  const { setStatusMessage } = useContext(StatusBarContext);
  const history = useHistory();

  useEffect(() => {
    AccountIpc.getAccountById(temporalAccount.id);

    ipcRenderer.on(DB_GET_ACCOUNT_ACK, (_: IpcRendererEvent, { account: newAccount }) => {
      setAccount(newAccount);
    });

    ipcRenderer.on(DB_DELETE_ACCOUNT_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'Account removed',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        history.push(rootRoutesPaths.balance);
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message: message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNT_ACK);
      ipcRenderer.removeAllListeners(DB_DELETE_ACCOUNT_ACK);
    };
  }, []);

  const onRemove = () => {
    AccountIpc.deleteAccount(temporalAccount.id);
  };

  return account ? (
    <>
      <Section title="Account balance">
        <AccountEditBalanceForm account={account} />
      </Section>
      <Section title="Account details">
        <AccountEditDetailsForm account={account} />
      </Section>
      <RemoveSection
        confirmationMessage="Are you sure you want to remove this account?"
        onRemove={onRemove}
        removeMessage={
          <>
            Remove account <b>{account.name}</b>
          </>
        }
      />
    </>
  ) : null;
};

export default AccountOverviewEdit;
