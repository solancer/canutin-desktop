import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import ScrollView from '@components/common/ScrollView';
import PrimaryCard from '@components/PrimaryCard';

import { ReactComponent as Vault } from '@assets/icons/Vault.svg';
import { ReactComponent as Browse } from '@assets/icons/Browse.svg';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT } from '@constants/events';

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

const Setup = () => {
  const onOpenCreateVault = () => {
    ipcRenderer.send(OPEN_CREATE_VAULT);
  };

  const onOpenExistingVault = () => {
    ipcRenderer.send(OPEN_EXISTING_VAULT);
  };

  return (
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
  );
};

export default Setup;
