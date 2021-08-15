import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { Asset } from '@database/entities';
import AssetIpc from '@app/data/asset.ipc';
import { StatusBarContext } from '@app/context/statusBarContext';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';
import { DB_EDIT_ASSET_DETAILS_ACK } from '@constants/events';
import { assetTypesValues } from '@constants/assetTypes';
import { StatusEnum } from '@app/constants/misc';
import { assetTypesWithSymbol } from '@constants/assetTypes';
import { balanceGroupOptions } from '@enums/balanceGroup.enum';
import { AssetEditDetailsSubmitType } from '@appTypes/asset.type';
import { routesPaths } from '@app/routes';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import FormFooter from '@components/common/Form/FormFooter';
import SelectField from '@components/common/Form/SelectField';
import SubmitButton from '@components/common/Form/SubmitButton';
import InputTextField from '@app/components/common/Form/InputTextField';

interface AssetEditDetailsFormProps {
  asset: Asset;
}

const AssetEditDetailsForm = ({ asset }: AssetEditDetailsFormProps) => {
  const { push } = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { handleSubmit, control, register, formState, watch } = useForm({
    defaultValues: {
      assetType: asset.assetType.name,
      balanceGroup: asset.balanceGroup.toString(),
      name: asset.name,
      symbol: asset.symbol,
    },
    mode: 'onChange',
  });
  const assetType = watch('assetType');

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_ASSET_DETAILS_ACK, (_: IpcRendererEvent, { status, message }) => {
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

  const onSubmit = (editDetailsSubmit: AssetEditDetailsSubmitType) => {
    AssetIpc.editDetails({ ...editDetailsSubmit, assetId: asset.id });
  };

  const shouldDisplayAssetWithSymbolFields = assetTypesWithSymbol.includes(assetType);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <SelectField
          label="Asset type"
          name="assetType"
          groupedOptions={assetTypesValues}
          control={control}
          required
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
        <InputTextField label="Name" name="name" register={register} required />
        {shouldDisplayAssetWithSymbolFields && (
          <InputTextField optional label="Symbol" name="symbol" register={register} />
        )}
      </Fieldset>
      <FormFooter>
        <SubmitButton disabled={!formState.isValid}>Save</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default AssetEditDetailsForm;
