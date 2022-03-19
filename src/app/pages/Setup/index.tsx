import React, { useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';
import { VAULT_OPEN_SAVE_DIALOG, VAULT_OPEN_EXISTING_FILE_DIALOG } from '@constants/vault';
import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';
import { VaultStatusEnum } from '@enums/vault.enum';

const Setup = () => {
  const history = useHistory();
  const { setVaultPath, setVaultStatus } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);

  useEffect(() => {
    return () => {
      setStatusMessage(emptyStatusMessage);
    };
  }, []);

  const redirectToVaultSecurity = () => {
    history.location.pathname !== routesPaths.vaultSecurity &&
      history.push(routesPaths.vaultSecurity);
  };

  const onOpenCreateVault = async () => {
    const newFilePath = await ipcRenderer.invoke(VAULT_OPEN_SAVE_DIALOG);
    if (newFilePath) {
      setVaultPath(newFilePath);
      setVaultStatus(VaultStatusEnum.SET_NEW_NOT_READY);
      redirectToVaultSecurity();
    }
  };

  const onOpenExistingVault = async () => {
    const existingFilePath = await ipcRenderer.invoke(VAULT_OPEN_EXISTING_FILE_DIALOG);
    if (existingFilePath) {
      setVaultPath(existingFilePath);
      setVaultStatus(VaultStatusEnum.SET_EXISTING_NOT_READY);
      redirectToVaultSecurity();
    }
  };

  return (
    <ScrollView title="Vault setup" wizard={true}>
      <SectionRow>
        <Section title="Choose vault">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Vault />}
              title="New vault"
              subTitle="Create a brand new vault"
              onClick={onOpenCreateVault}
            />
            <PrimaryCard
              icon={<Browse />}
              title="Existing vault"
              subTitle="Locate an existing vault file"
              onClick={onOpenExistingVault}
            />
          </PrimaryCardRow>
        </Section>
      </SectionRow>
    </ScrollView>
  );
};

export default Setup;
