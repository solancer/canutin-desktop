import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { Asset } from '@database/entities';
import AssetIpc from '@app/data/asset.ipc';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { DB_EDIT_ASSET_VALUE_ACK } from '@constants/events';
import { StatusEnum } from '@app/constants/misc';
import { assetTypesWithSymbol } from '@constants/assetTypes';
import { AssetEditValueSubmitType } from '@appTypes/asset.type';
import { routesPaths } from '@app/routes';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import Field from '@components/common/Form/Field';
import InputCurrencyField from '@components/common/Form/InputCurrencyField';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import InlineCheckbox from '@components/common/Form/Checkbox';
import FieldNotice from '@components/common/Form/FieldNotice';
import InputTextField from '@components/common/Form/InputTextField';

interface AssetEditValueFormProps {
  asset: Asset;
}

const AssetEditValueForm = ({ asset }: AssetEditValueFormProps) => {
  const { push } = useHistory();
  const lastBalanceStatement = asset.balanceStatements?.[asset.balanceStatements?.length - 1];
  const { setStatusMessage } = useContext(StatusBarContext);
  const { handleSubmit, control, register, watch, setValue, formState } = useForm({
    defaultValues: {
      quantity: lastBalanceStatement?.quantity ? lastBalanceStatement.quantity.toString() : null,
      cost: lastBalanceStatement?.cost?.toString(),
      value: lastBalanceStatement?.value.toString(),
      sold: lastBalanceStatement?.sold,
    },
    mode: 'onChange',
  });

  const cost = watch('cost');
  const quantity = watch('quantity');
  const sold = watch('sold');

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_ASSET_VALUE_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'The asset was successfully updated',
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

  useEffect(() => {
    if (cost && quantity) {
      setValue('value', Number(cost) * Number(quantity), { shouldValidate: true });
    }
  }, [cost, quantity]);

  const onSubmit = (editBalanceSubmit: AssetEditValueSubmitType) => {
    AssetIpc.editValue({ ...editBalanceSubmit, assetId: asset.id });
  };

  const shouldDisplayAssetWithSymbolFields = assetTypesWithSymbol.includes(asset.assetType.name);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        {shouldDisplayAssetWithSymbolFields && (
          <>
            <InputTextField
              label="Quantity"
              type="number"
              name="quantity"
              register={register}
              required
            />
            <InputCurrencyField
              label="Cost"
              name="cost"
              allowNegative={false}
              control={control}
              rules={{ required: true }}
            />
          </>
        )}
        <InputCurrencyField
          label="Value"
          name="value"
          allowNegative={!shouldDisplayAssetWithSymbolFields}
          control={control}
          disabled={shouldDisplayAssetWithSymbolFields}
          rules={{ required: !shouldDisplayAssetWithSymbolFields }}
        />
        {lastBalanceStatement?.sold === false && (
          <FieldNotice
            title="Value history"
            description={
              <div>
                Every time you manually update the value, quantity or price of an asset, a new
                balance statement will be created for the current week period. You can see past
                balance statements in the “Overview” tab.
              </div>
            }
          />
        )}
      </Fieldset>
      <Fieldset>
        <Field label="Mark asset as" name="sold">
          <InlineCheckbox name="sold" id="sold" label="Sold" register={register} />
        </Field>
        {sold && (
          <FieldNotice
            title="Selling asset"
            description={
              <div>
                Marking an asset as sold will keep it’s balance history but won’t be updated any
                more going forward.
              </div>
            }
          />
        )}
      </Fieldset>
      <FormFooter>
        <SubmitButton disabled={!formState.isValid}>Save</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default AssetEditValueForm;
