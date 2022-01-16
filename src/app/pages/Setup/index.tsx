import React, { useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import ScrollView from '@components/common/ScrollView';
import Breadcrumbs from '@components/common/Breadcrumbs';
import Section from '@components/common/Section';
import SectionRow from '@components/common/SectionRow';
import PrimaryCard from '@components/common/PrimaryCard';
import PrimaryCardRow from '@components/common/PrimaryCardRow';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT } from '@constants/events';
import { routesPaths } from '@routes';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';

const noVaultBreadcrumbs = [{ breadcrumb: 'Canutin setup', path: '/' }];

const Setup = () => {
  const { setStatusMessage, setBreadcrumbs } = useContext(StatusBarContext);
  const breadcrumbItems = useBreadcrumbs(noVaultBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });

  useEffect(() => {
    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      setStatusMessage(emptyStatusMessage);
      setBreadcrumbs(undefined);
    };
  }, []);

  const onOpenCreateVault = () => {
    ipcRenderer.send(OPEN_CREATE_VAULT);
  };

  const onOpenExistingVault = () => {
    ipcRenderer.send(OPEN_EXISTING_VAULT);
  };

  return (
    <ScrollView title="Canutin setup" wizard={true}>
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
