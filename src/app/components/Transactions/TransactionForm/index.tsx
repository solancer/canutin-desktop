import React, { useMemo, useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import styled from 'styled-components';

import { CATEGORY_GROUPED_OPTIONS } from '@appConstants/categories';
import { TransactionTypesEnum } from '@appConstants/misc';
import { yearsList, monthList, dayList, getCurrentDateInformation } from '@appConstants/dates';
import AccountIpc from '@app/data/account.ipc';
import { DB_GET_ACCOUNTS_ACK, DB_NEW_TRANSACTION_ACK } from '@constants/events';
import { Account } from '@database/entities';
import { StatusBarContext } from '@app/context/statusBarContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { AppContext } from '@app/context/appContext';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';
import Field from '@components/common/Form/Field';
import RadioGroupField from '@components/common/Form/RadioGroupField';
import SelectField from '@components/common/Form/SelectField';
import InputCurrency from '@components/common/Form/InputCurrency';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import InlineCheckbox from '@components/common/Form/Checkbox';

import { toggableInputContainer, fieldRows } from './styles';

const ToggableInputContainer = styled.div`
  ${toggableInputContainer}
`;

const FieldRows = styled.div`
  ${fieldRows}
`;

type TransactionSubmitType = {
  account: string;
  balance: string;
  category: string;
  year: number;
  month: number;
  day: number;
  description: string;
  excludeFromTotals: boolean;
};

const DATE_INFORMATION = getCurrentDateInformation();

const TransactionForm = () => {
  const { setSuccessMessage, setErrorMessage, setOnClickButton } = useContext(StatusBarContext);
  const { setIsDbEmpty } = useContext(AppContext);
  const { handleSubmit, control, register, watch, setValue, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      account: null,
      description: null,
      category: 'Uncategorized',
      day: DATE_INFORMATION.day + 1,
      month: DATE_INFORMATION.month,
      year: DATE_INFORMATION.year,
      transactionType: 'Income',
      balance: 0,
      excludeFromTotals: false,
    },
  });
  const [accounts, setAccounts] = useState<null | Account[]>(null);
  const excludeFromTotals = watch('excludeFromTotals');
  const transactionType = watch('transactionType');
  const balance = watch('balance');
  const description = watch('description');

  const onCloseMessage = () => {
    setSuccessMessage('');
  };

  useEffect(() => {
    AccountIpc.getAccounts();

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    ipcRenderer.on(DB_NEW_TRANSACTION_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setSuccessMessage(
          <>
            Transaction created/edit
          </>
        );
        setIsDbEmpty(false);
      }

      if (status === EVENT_ERROR) {
        setErrorMessage(message);
      }
    });

    setOnClickButton(() => onCloseMessage);

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  const accountOptions = useMemo(
    () => accounts?.map(account => ({ label: account.name, value: account.id.toString() })),
    [accounts]
  );

  useEffect(() => {
    if (balance >= 0) {
      setValue('transactionType', TransactionTypesEnum.INCOME);
    } else {
      setValue('transactionType', TransactionTypesEnum.EXPENSE);
    }
  }, [balance]);

  const onSubmit = ({
    account,
    balance,
    category,
    year,
    month,
    day,
    description,
    excludeFromTotals,
  }: TransactionSubmitType) => {
    const date = new Date(year, month, day);

    TransactionIpc.addTransaction({
      accountId: Number(account),
      balance: Number(balance),
      categoryName: category,
      date,
      description,
      excludeFromTotals,
    });
  };

  const submitIsDisabled = description === '' && !formState.isValid;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} role="form">
      <Fieldset>
        <SelectField
          label="Account"
          name="account"
          options={accountOptions}
          control={control}
          required
        />
      </Fieldset>
      <Fieldset>
        <InputTextField label="Description" name="description" register={register} />
        <Field label="Date" name="date">
          <FieldRows>
            <SelectField name="year" options={yearsList} control={control} required />
            <SelectField name="month" options={monthList} control={control} required />
            <SelectField name="day" options={dayList} control={control} required />
          </FieldRows>
        </Field>
        <SelectField
          name="category"
          label="Category"
          groupedOptions={CATEGORY_GROUPED_OPTIONS}
          control={control}
          required
        />
        <RadioGroupField
          label="Transaction type"
          name="transactionType"
          values={Object.values(TransactionTypesEnum)}
          onSelectOption={(option: string) => {
            setValue('transactionType', option);
            setValue('balance', -balance);
          }}
          register={register}
        />
        <Field label="Balance" name="balance">
          <ToggableInputContainer>
            <InputCurrency
              allowNegative={false}
              rules={{ validate: v => excludeFromTotals || v !== '' }}
              disabled={excludeFromTotals}
              name="balance"
              control={control}
              transactionType={transactionType as TransactionTypesEnum}
            />
            <InlineCheckbox
              name="excludeFromTotals"
              id="excludeFromTotals"
              label="Exclude from totals"
              register={register}
            />
          </ToggableInputContainer>
        </Field>
      </Fieldset>
      <FormFooter>
        <SubmitButton disabled={submitIsDisabled}>Add transaction</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default TransactionForm;
