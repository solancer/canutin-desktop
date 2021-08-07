import React, { useEffect, useContext, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';
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
import { DATABASE_DOES_NOT_EXIST, DATABASE_NOT_VALID } from '@constants';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import { StatusEnum } from '@app/constants/misc';
import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { emptyStatusMessage, StatusBarContext } from '@app/context/statusBarContext';

const noVaultBreadcrumbs = [{ breadcrumb: 'Canutin setup', path: '/' }];

const Setup = () => {
  const { setIsLoading, setIsAppInitialized, isLoading, filePath } = useContext(AppContext);
  const { setStatusMessage, setBreadcrumbs } = useContext(StatusBarContext);
  const history = useHistory();
  const breadcrumbItems = useBreadcrumbs(noVaultBreadcrumbs, {
    excludePaths: Object.values(routesPaths),
  });
  const [oldFilePath] = useState(filePath);

  useEffect(() => {
    if (oldFilePath !== undefined && oldFilePath !== filePath) {
      history.push(routesPaths.account);
    }
  }, [filePath, oldFilePath]);

  useEffect(() => {
    ipcRenderer.on(DATABASE_DOES_NOT_EXIST, (_, { dbPath }: DatabaseDoesNotExistsMessage) => {
      setIsLoading(false);
      setIsAppInitialized(false);
      setStatusMessage({
        sentiment: StatusEnum.NEGATIVE,
        message: (
          <>
            The vault located at <b>{dbPath}</b> was moved or deleted
          </>
        ),
        isLoading: false,
      });
    });

    ipcRenderer.on(DATABASE_NOT_VALID, () => {
      setIsLoading(false);
      setStatusMessage({
        sentiment: StatusEnum.NEGATIVE,
        message: 'The chosen file is not a valid Canutin vault',
        isLoading: false,
      });
    });

    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      ipcRenderer.removeAllListeners(DATABASE_DOES_NOT_EXIST);
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

  return !isLoading ? (
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
  ) : null;
};

export default Setup;
