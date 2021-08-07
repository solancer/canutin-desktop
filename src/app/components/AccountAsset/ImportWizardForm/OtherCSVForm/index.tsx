import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { isValid, parse } from 'date-fns';

import Fieldset from '@components/common/Form/Fieldset';
import FieldNotice from '@components/common/Form/FieldNotice';
import SelectField from '@components/common/Form/SelectField';
import Select from '@components/common/Form/Select';
import InlineCheckbox from '@components/common/Form/Checkbox';
import Field from '@components/common/Form/Field';
import InputTextField from '@components/common/Form/InputTextField';
import InputCurrency from '@components/common/Form/InputCurrency';
import { AnalyzeSourceMetadataType } from '@components/AccountAsset/ImportWizardForm';
import { accountGroupedValues } from '@components/AccountAsset/AddAccountAssetForm/index';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';

import { DB_GET_ACCOUNTS_ACK, LOAD_FROM_OTHER_CSV } from '@constants/events';
import { CATEGORY_GROUPED_OPTIONS } from '@appConstants/categories';
import AccountIpc from '@app/data/account.ipc';
import { Account } from '@database/entities';
import { BalanceGroupEnum } from '@enums/balanceGroup.enum';

import { optionList, option, toggleInputContainer } from './styles';
import {
  SUPPORTED_DATE_FORMAT_OPTIONS,
  SupportedDateFormatType,
  NEW_ACCOUNT_GROUPED_OPTION,
  NEW_ACCOUNT_VALUE,
} from './otherCsvConstants';
import { formToCantuinJsonFile } from './utils';

const OptionList = styled.div`
  ${optionList}
`;

const Option = styled.div`
  ${option}
`;

const ToggleInputContainer = styled.div`
  ${toggleInputContainer}
`;

export interface OtherCSVFormProps {
  data: any;
  metadata: AnalyzeSourceMetadataType;
}

export interface OtherCSVFormSubmit {
  account?: {
    autoCalculate: boolean;
    balance: BalanceGroupEnum;
    importAccount: string;
    accountType: string;
    institution: string;
    name: string;
  };
  accounts?: { [accountColumnValue: string]: string };
  accountColumn: null | string;
  amountColumn: string;
  categoryColumn: null | string;
  dateColumn: string;
  dateFormat: SupportedDateFormatType;
  descriptionColumn: string;
  categories?: { [categoryColumnValue: string]: string };
}

const OtherCSVForm = ({ data, metadata }: OtherCSVFormProps) => {
  const [accounts, setAccounts] = useState<null | Account[]>(null);
  const dateFormatRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    register,
    watch,
    formState,
    control,
    setValue,
    trigger,
    setError,
    errors,
    clearErrors,
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    AccountIpc.getAccounts();

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  // Watch form values
  const autoCalculate = watch('account.autoCalculate');
  const selectedAccount = watch('account.importAccount');
  const accountColumn = watch('accountColumn');
  const selectedCategoryColumn = watch('categoryColumn');
  const dateColumn = watch('dateColumn');
  const amountColumn = watch('amountColumn');
  const dateFormat = watch('dateFormat');

  // Custom register's
  const autoCalculateRegister = useMemo(() => {
    return register({
      validate: v => autoCalculate || v !== '',
    });
  }, [autoCalculate, register]);

  const autoCalculateValidation = useMemo(() => {
    return {
      validate: (v: string) => autoCalculate || v !== '',
    };
  }, [autoCalculate, register]);

  // Set values
  useEffect(() => {
    if (selectedAccount === NEW_ACCOUNT_VALUE) {
      setValue('account.autoCalculate', true, { shouldValidate: true });
      setValue('account.balance', '', { shouldValidate: true });
    }

    if (selectedAccount && accounts && selectedAccount !== NEW_ACCOUNT_VALUE) {
      const account = accounts.find(account => account.id === Number.parseInt(selectedAccount));
      setValue(
        'account.autoCalculate',
        account?.balanceStatements
          ? account.balanceStatements[account.balanceStatements.length - 1].autoCalculate
          : false,
        { shouldValidate: true }
      );
      setValue(
        'account.balance',
        account?.balanceStatements
          ? account.balanceStatements[account.balanceStatements.length - 1].value
          : false,
        { shouldValidate: true }
      );
    }
  }, [accounts, selectedAccount, setValue]);

  useEffect(() => {
    autoCalculate && trigger(['account.autoCalculate', 'account.balance']);
  }, [autoCalculate]);

  // Calculated Options
  const columnsOptions = useMemo(
    () => metadata.fields?.map(field => ({ label: field, value: field })),
    [metadata]
  );
  const accountOptions = useMemo(
    () => accounts?.map(account => ({ label: account.name, value: account.id.toString() })),
    [accounts]
  );
  const newAccountGroupedOptions = accountOptions
    ? [NEW_ACCOUNT_GROUPED_OPTION, { label: 'Canutin accounts', options: [...accountOptions] }]
    : [NEW_ACCOUNT_GROUPED_OPTION];
  const columnOptions = useCallback(
    columnName =>
      data
        .map((value: { [x: string]: any }) => value[columnName])
        .filter((column: string, pos: number, self: [string]) => {
          return self.indexOf(column) === pos;
        }),
    [data]
  );
  const accountColumnOptions = columnOptions(accountColumn).filter(
    (accountName: string) => !accounts?.find(account => account.name === accountName)
  );

  // Submit validations
  const checkDateColumnFormat = () => {
    const isValidDateColumn = data
      .map((value: { [x: string]: any }) => value[dateColumn])
      .every((value: string) => isValid(parse(value, dateFormat, new Date())));

    if (!isValidDateColumn) {
      setError('dateFormat', {
        type: 'manual',
        message:
          'Couldn’t interprete the transaction dates, try another date format or update the file manually',
      });
    }

    return isValidDateColumn;
  };

  const checkAmountColumn = () => {
    const isValidAmountColumn = data
      .map((value: { [x: string]: any }) => Number(value[amountColumn]))
      .every((value: number) => !isNaN(value));

    if (!isValidAmountColumn) {
      setError('amountColumn', {
        type: 'manual',
        message: 'The values in the chosen column can only be numbers',
      });
    }

    return isValidAmountColumn;
  };

  const onSubmit = (form: OtherCSVFormSubmit) => {
    const isValidDateColumn = checkDateColumnFormat();
    const isValidAmountColumn = checkAmountColumn();

    if (!isValidDateColumn) {
      dateFormatRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isValidAmountColumn) {
      amountRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (isValidDateColumn && isValidAmountColumn) {
      const result = formToCantuinJsonFile(form, data, accounts);
      ipcRenderer.send(LOAD_FROM_OTHER_CSV, result);
    }
  };

  return (
    <>
      <Fieldset>
        <FieldNotice
          title="Interpreting your CSV file"
          description={
            <div>
              To properly import the data we need you to match each of the fields below with the
              corresponding columns from your CSV.
            </div>
          }
          label="Match columns"
        />
        <SelectField
          label="Date column"
          name="dateColumn"
          defaultFormValue={null}
          options={columnsOptions}
          required
          control={control}
        />
        <SelectField
          label="Date format"
          name="dateFormat"
          innerRef={dateFormatRef}
          options={SUPPORTED_DATE_FORMAT_OPTIONS}
          error={errors?.dateFormat}
          cta={() => {
            clearErrors('dateFormat');
          }}
          required
          control={control}
        />
        <SelectField
          label="Description column"
          name="descriptionColumn"
          defaultFormValue={null}
          options={columnsOptions}
          required
          control={control}
        />
        <SelectField
          label="Amount column"
          name="amountColumn"
          defaultFormValue={null}
          innerRef={amountRef}
          error={errors?.amountColumn}
          cta={() => {
            clearErrors('amountColumn');
          }}
          options={columnsOptions}
          required
          control={control}
        />
        <SelectField
          label="Account column"
          name="accountColumn"
          options={columnsOptions}
          control={control}
          optional
          isClearable
        />
        <SelectField
          label="Category column"
          name="categoryColumn"
          options={columnsOptions}
          control={control}
          optional
          isClearable
        />
      </Fieldset>
      {accountColumn && accountOptions && accountColumnOptions.length > 0 && (
        <Fieldset>
          <Field name="Choose types for new accounts" label="Choose types for new accounts">
            <OptionList>
              {accountColumnOptions.map((accountName: string) => (
                <Option key={accountName}>
                  <label>{accountName}</label>
                  <Select
                    name={`accounts.${accountName.toString()}`}
                    groupedOptions={accountGroupedValues}
                    control={control}
                  />
                </Option>
              ))}
            </OptionList>
          </Field>
        </Fieldset>
      )}
      {selectedCategoryColumn && (
        <Fieldset>
          <Field name="Match categories" label="Match categories">
            <OptionList>
              {columnOptions(selectedCategoryColumn).map((categoryName: string) => (
                <Option key={categoryName}>
                  <label>{categoryName}</label>
                  <Select
                    name={`categories.${categoryName.toString()}`}
                    groupedOptions={CATEGORY_GROUPED_OPTIONS}
                    control={control}
                    defaultFormValue={'Uncategorized'}
                    placeholder={'Uncategorized'}
                  />
                </Option>
              ))}
            </OptionList>
          </Field>
        </Fieldset>
      )}
      {!accountColumn && (
        <Fieldset>
          <SelectField
            label="Import to account"
            name="account.importAccount"
            groupedOptions={newAccountGroupedOptions}
            control={control}
            required
          />
          {selectedAccount === NEW_ACCOUNT_VALUE && (
            <>
              <InputTextField
                label="Account name"
                name="account.name"
                register={register}
                required
              />
              <SelectField
                label="Account type"
                name="account.accountType"
                groupedOptions={accountGroupedValues}
                control={control}
                defaultFormValue={null}
                required
              />
              <InputTextField
                label="Account institution"
                name="account.institution"
                register={register}
                optional
              />
            </>
          )}
          <Field label="Account balance" name="account.balance">
            <ToggleInputContainer>
              <InputCurrency
                name="account.balance"
                control={control}
                disabled={autoCalculate}
                rules={autoCalculateValidation}
              />
              <InlineCheckbox
                name="account.autoCalculate"
                id="autoCalculate"
                label="Auto-calculate from transactions"
                register={register}
              />
            </ToggleInputContainer>
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
      )}
      <FormFooter>
        <SubmitButton disabled={!formState.isValid} onClick={handleSubmit(onSubmit)}>
          Continue
        </SubmitButton>
      </FormFooter>
    </>
  );
};

export default OtherCSVForm;
