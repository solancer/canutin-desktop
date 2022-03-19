import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { Account } from '@database/entities';
import { accountGroupedValues } from '@constants/accountTypes';
import { balanceGroupOptions } from '@enums/balanceGroup.enum';
import { StatusEnum } from '@app/constants/misc';
import { StatusBarContext } from '@app/context/statusBarContext';
import AccountIpc from '@app/data/account.ipc';
import { AccountEditDetailsSubmitType } from '@appTypes/account.type';
import { DB_EDIT_ACCOUNT_DETAILS_ACK } from '@constants/repositories';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { routesPaths } from '@app/routes';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import SelectField from '@components/common/Form/SelectField';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import InputTextField from '@components/common/Form/InputTextField';

interface AccountEditBalanceFormProps {
  account: Account;
}

const AccountEditDetailsForm = ({ account }: AccountEditBalanceFormProps) => {
  const { push } = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { handleSubmit, control, register, watch } = useForm({
    defaultValues: {
      accountType: account.accountType.name,
      balanceGroup: account.balanceGroup.toString(),
      name: account.name,
      institution: account.institution,
    },
  });

  const name = watch('name');

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_ACCOUNT_DETAILS_ACK, (_: IpcRendererEvent, { status, message }) => {
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

  const onSubmit = (editDetailsSubmit: AccountEditDetailsSubmitType) => {
    AccountIpc.editDetails({ ...editDetailsSubmit, accountId: account.id });
  };

  const submitDisabled = !name;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <SelectField
          label="Account type"
          name="accountType"
          groupedOptions={accountGroupedValues}
          required
          control={control}
        />
        <SelectField
          label="Balance group"
          name="balanceGroup"
          options={balanceGroupOptions}
          required
          control={control}
        />
      </Fieldset>
      <Fieldset>
        <InputTextField label="Name" name="name" register={register} />
        <InputTextField label="Institution" name="institution" optional register={register} />
        <InputTextField label="Official name" name="officialName" optional register={register} />
      </Fieldset>
      <FormFooter>
        <SubmitButton disabled={submitDisabled}>Save</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default AccountEditDetailsForm;
