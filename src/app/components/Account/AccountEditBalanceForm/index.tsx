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
import { generateAccountBalanceInfo } from '@app/utils/balance.utils';

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
  const { amount } = generateAccountBalanceInfo(account);
  const { push } = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { handleSubmit, control, register, watch } = useForm({
    defaultValues: {
      balance: amount,
      autoCalculated: account.autoCalculated,
      closed: account.closed,
    },
  });

  const balance = watch('balance');
  const closed = watch('closed');
  const autoCalculated = watch('autoCalculated');

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
              rules={{ validate: v => autoCalculated || v !== '' }}
              name="balance"
              disabled={autoCalculated}
              control={control}
            />
            <InlineCheckbox
              name="autoCalculated"
              id="autoCalculated"
              label="Auto-calculate from transactions"
              register={register}
            />
          </ToggleInputField>
        </Field>
        {!autoCalculated && (
          <FieldNotice
            title="Balance history"
            description={
              <div>
                Every time you manually update the balance of an account a new balance statement
                will be created for the current week period.
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
                Marking an account as closed will keep it's balance history but won't be updated any
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
