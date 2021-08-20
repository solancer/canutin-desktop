import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { Account } from '@database/entities';
import AccountIpc from '@app/data/account.ipc';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { DB_EDIT_ACCOUNT_BALANCE_ACK } from '@constants/events';
import { StatusEnum } from '@app/constants/misc';
import { AccountEditBalanceSubmitType } from '@appTypes/account.type';
import { routesPaths } from '@app/routes';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import Field from '@components/common/Form/Field';
import InputCurrency from '@components/common/Form/InputCurrency';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import InlineCheckbox from '@components/common/Form/Checkbox';
import ToggleInputField from '@components/common/Form/ToggleInputField';
import FieldNotice from '@components/common/Form/FieldNotice';

interface AccountEditBalanceFormProps {
  account: Account;
}

const AccountEditBalanceForm = ({ account }: AccountEditBalanceFormProps) => {
  const { push } = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { handleSubmit, control, register, watch } = useForm({
    defaultValues: {
      balance: account.balanceStatements?.[account.balanceStatements?.length - 1].value
        ? account.balanceStatements?.[account.balanceStatements?.length - 1].value
        : 0,
      autoCalculate:
        account.balanceStatements?.[account.balanceStatements?.length - 1].autoCalculate,
      closed: account.closed,
    },
  });

  const balance = watch('balance');
  const closed = watch('closed');
  const autoCalculate = watch('autoCalculate');

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_ACCOUNT_BALANCE_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'The account was successfully updated',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        push(routesPaths.balance);
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });
  }, []);

  const onSubmit = (editBalanceSubmit: AccountEditBalanceSubmitType) => {
    AccountIpc.editBalance({ ...editBalanceSubmit, accountId: account.id });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Field label="Balance" name="balance">
          <ToggleInputField>
            <InputCurrency
              value={balance && Number(balance)}
              rules={{ validate: v => autoCalculate || v !== '' }}
              name="balance"
              disabled={autoCalculate}
              control={control}
            />
            <InlineCheckbox
              name="autoCalculate"
              id="autoCalculate"
              label="Auto-calculate from transactions"
              register={register}
            />
          </ToggleInputField>
        </Field>
        {!autoCalculate && (
          <FieldNotice
            title="Balance history"
            description={
              <div>
                Every time you manually update the balance of an account, a new balance statement
                will be created (or updated) for the current week period. You can see past balance
                statements in the “Overview” tab.
              </div>
            }
          />
        )}
      </Fieldset>
      <Fieldset>
        <Field label="Mark account as" name="closed">
          <InlineCheckbox name="closed" id="closed" label="Closed" register={register} />
        </Field>
        {closed && (
          <FieldNotice
            title="Closing account"
            description={
              <div>
                Marking an account as closed will keep it’s balance history but won’t be updated any
                more going forward.
              </div>
            }
          />
        )}
      </Fieldset>
      <FormFooter>
        <SubmitButton>Save</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default AccountEditBalanceForm;
