import React, { useEffect, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import AccountIpc from '@app/data/account.ipc';
import { Account } from '@database/entities';
import { DB_DELETE_ACCOUNT_ACK } from '@constants/repositories';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EntitiesContext } from '@app/context/entitiesContext';
import { StatusEnum } from '@app/constants/misc';
import { rootRoutesPaths } from '@app/routes';

import Section from '@components/common/Section';
import RemoveSection from '@components/common/Form/RemoveSection';
import AccountEditBalanceForm from '../AccountEditBalanceForm';
import AccountEditDetailsForm from '../AccountEditDetailsForm';

interface AccountOverviewEditProps {
  account: Account;
}

const AccountOverviewEdit = ({ account }: AccountOverviewEditProps) => {
  const { accountsIndex, setAccountsIndex } = useContext(EntitiesContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.on(DB_DELETE_ACCOUNT_ACK, (_: IpcRendererEvent, { accountId, status, message }) => {
      if (status === EVENT_SUCCESS) {
        history.push(rootRoutesPaths.balance);
        const accounts = accountsIndex!.accounts.filter(
          indexedAccount => indexedAccount.id !== accountId
        );
        setAccountsIndex({ accounts, lastUpdate: new Date() });
        setStatusMessage({
          message: 'Account removed',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message: message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_DELETE_ACCOUNT_ACK);
    };
  }, []);

  const onRemove = () => {
    AccountIpc.deleteAccount(account.id);
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
