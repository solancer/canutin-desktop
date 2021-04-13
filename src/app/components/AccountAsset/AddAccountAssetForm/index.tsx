import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import RadioInputGroup from '@components/common/RadioInputGroup';
import SelectInput, { SelectInputValue } from '@components/common/SelectInput';
import Input from '@components/common/Input';

import { DB_GET_ACCOUNTS_ACK } from '@constants/events';
import { ACCOUNT, ASSET } from '@appConstants/misc';
import { AssetTypeEnum } from '../../../../enums/assetType.enum';
import { accountTypes } from '@constants/accountTypes';
import { NewAssetSubmitType } from '../../../../types/asset.type';
import { NewAccountType } from '../../../../types/account.type';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';

import {
  formContainer,
  form,
  formFooter,
  formSubmitButton,
  balanceContainer,
  balanceSubContainer,
  customInputContainer,
  checkboxContainer,
  checkbox,
  checkboxLabel,
  customInputLabel,
  hrDivider,
} from './styles';
import { AccountType } from '@database/entities';

const accountTypesUnflattened = accountTypes.map(({ accountTypes }) => accountTypes);
const accountTypesValues: SelectInputValue[] = accountTypesUnflattened.flat();

const assetTypesValues: SelectInputValue[] = [];
const assetTypes = Object.values(AssetTypeEnum);
assetTypes.forEach(assetType => assetTypesValues.push({ name: assetType, label: assetType }));

const FormContainer = styled.div`
  ${formContainer}
`;
const Form = styled.form`
  ${form}
`;
const FormFooter = styled.div`
  ${formFooter}
`;
const FormSubmitButton = styled.button`
  ${formSubmitButton}
`;
const BalanceContainer = styled.div`
  ${balanceContainer}
`;
const BalanceSubContainer = styled.div`
  ${balanceSubContainer}
`;
const CustomInputLabel = styled.label`
  ${customInputLabel}
`;
const CustomInputContainer = styled.div`
  ${customInputContainer}
`;
const CheckboxContainer = styled.div`
  ${checkboxContainer}
`;
const Checkbox = styled.input`
  ${checkbox}
`;
const CheckboxLabel = styled.label`
  ${checkboxLabel}
`;

const Hr = styled.hr`
  ${hrDivider}
`;

export interface AddAccountAssetFormProps {
  onRadioButtonChange: (_: string) => void;
}

const AddAccountAssetForm = ({ onRadioButtonChange }: AddAccountAssetFormProps) => {
  const [accountOrAsset, setAccountOrAsset] = useState('');
  const [accounts, setAccounts] = useState<SelectInputValue[]>([]);
  const {
    handleSubmit: handleAssetSubmit,
    register: registerAssetField,
    watch: watchAssetField,
    formState: assetFormState,
  } = useForm({ mode: 'onChange' });
  const {
    handleSubmit: handleAccountSubmit,
    register: registerAccountField,
    watch: watchAccountField,
  } = useForm({ mode: 'onChange' });

  const onSubmitAsset = async (asset: NewAssetSubmitType) => {
    const newAssetAccount = asset.account === "" ? undefined : asset.account;
    AssetIpc.createAsset({ ...asset, account: newAssetAccount });
  };

  const onSubmitAccount = async (account: NewAccountType) => {
    AccountIpc.createAccount(account);
  };

  useEffect(() => {
    AccountIpc.getAccounts();

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: AccountType[]) => {
      const accountsValues = accounts.map(({ name, id }) => ({ name: id.toString(), label: name }));
      setAccounts(accountsValues);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

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
      <Form onSubmit={formSubmit}>
        <RadioInputGroup
          label="Add new"
          name="accountOrAsset"
          values={[ACCOUNT, ASSET]}
          onSelectOption={value => {
            setAccountOrAsset(value);
            onRadioButtonChange(value);
            assetValue = 0;
          }}
        />
        {shouldDisplayAccount && (
          <>
            <SelectInput
              label="Account Type"
              name="accountType"
              values={accountTypesValues}
              register={registerAccountField}
              required
            />
            <Input label="Name" name="name" register={registerAccountField} />
            <Input
              label="Official name"
              name="officialName"
              optional
              register={registerAccountField}
            />
            <Input
              label="Institution"
              name="institution"
              optional
              register={registerAccountField}
            />
            <BalanceContainer>
              <CustomInputLabel htmlFor="balance">Balance</CustomInputLabel>
              <BalanceSubContainer>
                <CustomInputContainer disabled={autoCalculate}>
                  <input
                    readOnly={autoCalculate}
                    name="balance"
                    ref={registerAccountField({ validate: v => autoCalculate || v !== '' })}
                  />
                </CustomInputContainer>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    name="autoCalculate"
                    id="autoCalculate"
                    ref={registerAccountField}
                  />
                  <CheckboxLabel htmlFor="autoCalculate">
                    Auto-calculate from transactions
                  </CheckboxLabel>
                </CheckboxContainer>
              </BalanceSubContainer>
            </BalanceContainer>
          </>
        )}
        {shouldDisplayAsset && (
          <>
            <SelectInput
              label="Asset Type"
              name="assetType"
              values={assetTypesValues}
              register={registerAssetField}
              required
            />
            <Input label="Name" name="name" register={registerAssetField} required />
            <Input label="Quantity" name="quantity" register={registerAssetField} required />
            <Input label="Cost" name="cost" register={registerAssetField} required />
            <Input label="Value" name="value" value={`$ ${assetValue}`} disabled />
            <Hr />
            <SelectInput
              optional
              label="Account"
              name="account"
              values={accounts}
              register={registerAssetField}
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
