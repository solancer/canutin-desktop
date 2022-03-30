import React, { useContext, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { ReactComponent as Sheet } from '@assets/icons/Sheet.svg';
import { ReactComponent as Keyboard } from '@assets/icons/Keyboard.svg';
import { ReactComponent as Bot } from '@assets/icons/Bot.svg';
import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';
import { ReactComponent as PaperAccount } from '@assets/icons/PaperAccount.svg';
import { VAULT_SEED, VAULT_SEED_ACK } from '@constants/vault';
import { EVENT_SUCCESS } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import { VaultStatusEnum } from '@enums/vault.enum';

import ScrollView from '@components/common/ScrollView';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';

const AddOrUpdateData = () => {
  const { push } = useHistory();
  const { vaultStatus, setVaultStatus } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);

  const seedVault = () => {
    setStatusMessage({
      sentiment: StatusEnum.NEUTRAL,
      message: 'Seeding vault with demo data...',
      isLoading: true,
    });
    ipcRenderer.send(VAULT_SEED);
  };

  useEffect(() => {
    ipcRenderer.on(VAULT_SEED_ACK, (_: IpcRendererEvent, { status }) => {
      if (status === EVENT_SUCCESS) {
        setVaultStatus(VaultStatusEnum.READY_TO_INDEX);
        setStatusMessage({
          message: 'The vault was seeded succesfully',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(VAULT_SEED_ACK);
    };
  }, []);

  return (
    <ScrollView title="Add or update data" wizard={true}>
      <SectionRow>
        {vaultStatus === VaultStatusEnum.INDEXED_NO_DATA && (
          <Section title="Seed vault">
            <PrimaryCard
              icon={<PaperAccount />}
              title="Demo"
              subTitle="Explore Canutin with automatically generated example data"
              onClick={seedVault}
            />
          </Section>
        )}
        <Section title="Add new">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Sheet />}
              title="Import wizard"
              subTitle="Import data from sites like Mint, Personal Capital, YNAB, etc..."
              onClick={() => push(routesPaths.addOrUpdateDataByWizard)}
            />
            <PrimaryCard
              icon={<Keyboard />}
              title="By hand"
              subTitle="Create a new account by entering data manually"
              onClick={() => push(routesPaths.addOrUpdateDataByHand)}
            />
          </PrimaryCardRow>
        </Section>
        <Section title="Coming soon">
          <PrimaryCardRow>
            <PrimaryCard
              icon={<Bot />}
              title="Unleash a bot"
              subTitle="Attemp to grab accounts and transactions from your financial institution's website"
              onClick={() => {}}
              disabled
            />
            <PrimaryCard
              icon={<Lightning />}
              title="Canutin Link"
              subTitle="Automatically import and sync accounts from your financial institution"
              onClick={() => {}}
              disabled
            />
          </PrimaryCardRow>
        </Section>
      </SectionRow>
    </ScrollView>
  );
};

export default AddOrUpdateData;
