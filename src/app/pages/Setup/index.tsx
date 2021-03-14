import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import Section from 'app/components/common/Section';
import SetupOptionBox from 'app/components/SetupOptionBox';
import { ReactComponent as Sheet } from 'app/assets/icons/Sheet.svg';
import { ReactComponent as PaperAccount } from 'app/assets/icons/PaperAccount.svg';
import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT } from 'constants/events';
import { body, subTitle, boxContainer } from './styles';

const Body = styled.div`${body}`
const SubTitle = styled.span`${subTitle}`
const BoxContainer = styled.div`${boxContainer}`

const Setup = () => {
  const onOpenCreateVault = () => {
    ipcRenderer.send(OPEN_CREATE_VAULT);
  };

  const onOpenExistingVault = () => {
    ipcRenderer.send(OPEN_EXISTING_VAULT);
  };

  return (
    <>
      <Section title="Canutin setup">
        <Body>
          <SubTitle>Choose Vault</SubTitle>
          <BoxContainer>
            <SetupOptionBox
              icon={<Sheet />}
              title="New vault"
              subTitle="Create a brand new vault"
              onClick={onOpenCreateVault}
            />
            <SetupOptionBox
              icon={<PaperAccount />}
              title="Existing vault"
              subTitle="Locate an existing vault file"
              onClick={onOpenExistingVault}
            />
          </BoxContainer>
        </Body>
      </Section>
    </>
  );
}

export default Setup;
