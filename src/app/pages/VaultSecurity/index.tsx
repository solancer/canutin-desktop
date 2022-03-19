import React, { useEffect, useContext, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { VAULT_UNLOCK } from '@constants/vault';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import { APP_SAFE_STORAGE_ACK } from '@constants/app';
import { VaultType } from '@appTypes/vault.type';
import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { VaultStatusEnum } from '@enums/vault.enum';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import Form from '@components/common/Form/Form';
import FormFooter from '@components/common/Form/FormFooter';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';
import Field from '@app/components/common/Form/Field';
import ToggleInputField from '@app/components/common/Form/ToggleInputField';
import InlineCheckbox from '@app/components/common/Form/Checkbox';
import InputText from '@app/components/common/Form/InputText';
import Button from '@app/components/common/Button';
import SubmitButton from '@app/components/common/Form/SubmitButton';
import FieldNotice from '@components/common/Form/FieldNotice';
import AppIpc from '@app/data/app.ipc';

const VaultSecurity = () => {
  const { vaultPath, vaultStatus } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const [hasSafeStorage, setHasSafeStorage] = useState(false);
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.on(APP_SAFE_STORAGE_ACK, (_, appHasSafeStorage: boolean) => {
      setHasSafeStorage(appHasSafeStorage);
    });

    setTimeout(() => {
      AppIpc.hasAppSecureStorage();
    }, 100);

    return () => {
      ipcRenderer.removeAllListeners(APP_SAFE_STORAGE_ACK);
    };
  }, []);

  const { handleSubmit, register, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      vaultPath: '',
      vaultMasterKey: '',
      rememberVaultMasterkey: false,
    },
  });
  const vaultMasterKey = watch('vaultMasterKey');
  const submitDisabled = !vaultMasterKey;
  const isVaultNew = vaultStatus === VaultStatusEnum.SET_NEW_NOT_READY;

  const onSubmit = (unlockVaultSubmit: VaultType) => {
    ipcRenderer.send(VAULT_UNLOCK, {
      ...unlockVaultSubmit,
      vaultPath: vaultPath,
    });
    setStatusMessage(emptyStatusMessage);
  };

  const cancelVault = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push(routesPaths.setup);
    }
    setStatusMessage(emptyStatusMessage);
  };

  return (
    <ScrollView title={'Canutin vault'} wizard={true}>
      <SectionRow>
        <Section title="Vault encryption">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <InputTextField
                label="Current vault"
                name="currentVaultPath"
                value={vaultPath!}
                disabled
              />
              <Field label="Master key" name="vaultMasterKey">
                <ToggleInputField>
                  <InputText name="vaultMasterKey" type="password" required register={register} />
                  <InlineCheckbox
                    name="rememberVaultMasterKey"
                    id="rememberVaultMasterKey"
                    label="Remember on this computer"
                    register={register}
                    disabled={!hasSafeStorage}
                    disabledTitle={'This computer is unable store the master key securely'}
                  />
                </ToggleInputField>
              </Field>
              {isVaultNew && (
                <FieldNotice
                  title="Write down your master key somewhere safe"
                  description={
                    <div>
                      This key will be used to encrypt the vault. Without it you won't be able to
                      retrieve the information inside.
                    </div>
                  }
                />
              )}
            </Fieldset>
            <FormFooter>
              <Button onClick={cancelVault}>Cancel</Button>
              <SubmitButton disabled={submitDisabled}>
                {isVaultNew ? 'Create vault' : 'Unlock vault'}
              </SubmitButton>
            </FormFooter>
          </Form>
        </Section>
      </SectionRow>
    </ScrollView>
  );
};

export default VaultSecurity;
