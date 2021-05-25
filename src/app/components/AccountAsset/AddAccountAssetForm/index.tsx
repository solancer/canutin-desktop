import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import Field from '@components/common/Form/Field';
import RadioGroupField from '@components/common/Form/RadioGroupField';
import SelectField from '@components/common/Form/SelectField';
import { GroupedValue } from '@components/common/Select';
import InputTextField from '@components/common/Form/InputTextField';
import InputText from '@components/common/Form/InputText';
import InlineCheckbox from '@components/common/Form/Checkbox';
import FormFooter from '@components/common/Form/FormFooter';

import { DB_GET_ACCOUNTS_ACK } from '@constants/events';
import { ACCOUNT, ASSET } from '@appConstants/misc';
import { BalanceGroupEnum } from '../../../../enums/balanceGroup.enum';
import { accountTypes, balanceGroupLabels } from '@constants/accountTypes';
import { assetTypes } from '@constants/assetTypes';
import { NewAssetType } from '../../../../types/asset.type';
import { NewAccountType } from '../../../../types/account.type';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';

import { formContainer, form, formSubmitButton, toggableInputContainer, hrDivider } from './styles';
import { Account } from '@database/entities';

export const accountGroupedValues = accountTypes.map(({ balanceGroup, accountTypes }) => ({
  options: accountTypes,
  label: balanceGroupLabels[balanceGroup],
}));

const assetTypesValues = assetTypes.map(({ balanceGroup, assetTypes }) => ({
  options: assetTypes,
  label: balanceGroupLabels[balanceGroup],
}));

const FormContainer = styled.div`
  ${formContainer}
`;
const Form = styled.form`
  ${form}
`;
const FormSubmitButton = styled.button`
  ${formSubmitButton}
`;
const ToggableInputContainer = styled.div`
  ${toggableInputContainer}
`;
const Hr = styled.hr`
  ${hrDivider}
`;

export interface AddAccountAssetFormProps {
  onRadioButtonChange: (_: string) => void;
}

const AddAccountAssetForm = ({ onRadioButtonChange }: AddAccountAssetFormProps) => {
  const [accountOrAsset, setAccountOrAsset] = useState('');
  const [accounts, setAccounts] = useState<GroupedValue[]>([]);
  const {
    handleSubmit: handleAssetSubmit,
    register: registerAssetField,
    watch: watchAssetField,
    formState: assetFormState,
    control: controlAssetField,
  } = useForm({ mode: 'onChange' });
  const {
    handleSubmit: handleAccountSubmit,
    register: registerAccountField,
    watch: watchAccountField,
    control: controlAccountField,
  } = useForm({ mode: 'onChange' });

  const onSubmitAsset = async (asset: NewAssetType) => {
    AssetIpc.createAsset(asset);
  };

  const onSubmitAccount = async (account: NewAccountType) => {
    AccountIpc.createAccount(account);
  };

  useEffect(() => {
    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      const accountsValues: GroupedValue[] = [];

      Object.keys(balanceGroupLabels).forEach(balanceGroup => {
        accountsValues.push({
          label: balanceGroupLabels[parseInt(balanceGroup) as BalanceGroupEnum],
          options: accounts
            .filter(account => account.balanceGroup === parseInt(balanceGroup))
            .map(({ name, id }) => ({ value: id.toString(), label: name })),
        });
      });
      setAccounts(accountsValues);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  useEffect(() => {
    accountOrAsset === ASSET && AccountIpc.getAccounts();
  }, [accountOrAsset]);

  const shouldDisplay = accountOrAsset !== '';
  const shouldDisplayAccount = shouldDisplay && accountOrAsset === ACCOUNT;
  const shouldDisplayAsset = shouldDisplay && accountOrAsset === ASSET;

  const { isValid: isValidAsset } = assetFormState;
  const submitAssetDisabled = !shouldDisplay || !isValidAsset;
  const cost = watchAssetField('cost');
  const quantity = watchAssetField('quantity');
  let assetValue = 0;

  if (cost && quantity) assetValue = cost * quantity;

  const autoCalculate = watchAccountField('autoCalculate');
  const accountName = watchAccountField('name');
  const balance = watchAccountField('balance');
  const submitAccountEnabled = shouldDisplay && !!accountName && (autoCalculate || !!balance);

  const formSubmit = shouldDisplayAccount
    ? handleAccountSubmit(onSubmitAccount)
    : handleAssetSubmit(onSubmitAsset);
  const submitDisabled = shouldDisplayAccount ? !submitAccountEnabled : submitAssetDisabled;

  return (
    <FormContainer>
      <Form onSubmit={formSubmit} role="form">
        <RadioGroupField
          label="Add new"
          name="accountOrAsset"
          values={[ACCOUNT, ASSET]}
          onSelectOption={(value: string) => {
            setAccountOrAsset(value);
            onRadioButtonChange(value);
            assetValue = 0;
          }}
        />
        {shouldDisplayAccount && (
          <>
            <SelectField
              label="Account Type"
              name="accountType"
              groupedOptions={accountGroupedValues}
              required
              control={controlAccountField}
            />
            <InputTextField label="Name" name="name" register={registerAccountField} />
            <InputTextField
              label="Official name"
              name="officialName"
              optional
              register={registerAccountField}
            />
            <InputTextField
              label="Institution"
              name="institution"
              optional
              register={registerAccountField}
            />
            <Field label="Balance" name="balance">
              <ToggableInputContainer>
                <InputText
                  name="balance"
                  type="number"
                  disabled={autoCalculate}
                  setRef={registerAccountField({ validate: v => autoCalculate || v !== '' })}
                />
                <InlineCheckbox
                  name="autoCalculate"
                  id="autoCalculate"
                  label="Auto-calculate from transactions"
                  register={registerAccountField}
                />
              </ToggableInputContainer>
            </Field>
          </>
        )}
        {shouldDisplayAsset && (
          <>
            <SelectField
              label="Asset Type"
              name="assetType"
              groupedOptions={assetTypesValues}
              control={controlAssetField}
              required
            />
            <InputTextField label="Name" name="name" register={registerAssetField} required />
            <InputTextField
              label="Quantity"
              type="number"
              name="quantity"
              register={registerAssetField}
              required
            />
            <InputTextField
              label="Cost"
              name="cost"
              type="number"
              register={registerAssetField}
              required
            />
            <InputTextField label="Value" name="value" value={`$ ${assetValue}`} disabled />
            <Hr />
            <SelectField
              optional
              label="Account"
              name="accountId"
              groupedOptions={accounts}
              control={controlAssetField}
            />
          </>
        )}
      </Form>
      <FormFooter>
        <FormSubmitButton disabled={submitDisabled} onClick={formSubmit}>
          Continue
        </FormSubmitButton>
      </FormFooter>
    </FormContainer>
  );
};

export default AddAccountAssetForm;
