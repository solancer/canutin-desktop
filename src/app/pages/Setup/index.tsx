import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import ScrollView from '@components/common/ScrollView';
import PrimaryCard from '@components/PrimaryCard';
import Breadcrumbs from '@components/common/Breadcrumbs';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT } from '@constants/events';
import { DATABASE_DOES_NOT_EXIST } from '@constants';
import { DatabaseDoesNotExistsMessage } from '@constants/messages';
import { routesPaths } from '@routes';
import { AppContext } from '@app/context/appContext';
import { StatusBarContext } from '@app/context/statusBarContext';

import { body, subTitle, boxContainer } from './styles';

const Section = styled.section`
  ${body}
`;
const SubTitle = styled.h2`
  ${subTitle}
`;
const BoxContainer = styled.div`
  ${boxContainer}
`;

const noVaultBreadcrumbs = [{ breadcrumb: 'Canutin setup', path: '/' }];

const Setup = () => {
  const { setIsLoading, setIsAppInitialized, isLoading, filePath } = useContext(AppContext);
  const { setErrorMessage, setOnClickButton, setBreadcrumbs } = useContext(StatusBarContext);
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
      setErrorMessage(
        <span>
          The vault located at <b>{dbPath}</b> was moved or deleted
        </span>
      );
    });

    setOnClickButton(() => () => setErrorMessage(''));
    setBreadcrumbs(<Breadcrumbs items={breadcrumbItems} />);

    return () => {
      ipcRenderer.removeAllListeners(DATABASE_DOES_NOT_EXIST);
      setOnClickButton(() => () => {});
      setErrorMessage('');
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
    <>
      <ScrollView title="Canutin setup">
        <Section>
          <SubTitle>Choose Vault</SubTitle>
          <BoxContainer>
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
          </BoxContainer>
        </Section>
      </ScrollView>
    </>
  ) : null;
};

export default Setup;
