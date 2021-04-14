import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import ScrollView from '@components/common/ScrollView';
import PrimaryCard from '@components/PrimaryCard';

import { routesPaths } from '@routes';
import { ReactComponent as Sheet } from '@assets/icons/Sheet.svg';
import { ReactComponent as Keyboard } from '@assets/icons/Keyboard.svg';
import { ReactComponent as Bot } from '@assets/icons/Bot.svg';
import { ReactComponent as Lightning } from '@assets/icons/Lightning.svg';

import { section, subTitle, boxContainer } from './styles';

const Section = styled.div`
  ${section}
`;
const SubTitle = styled.div`
  ${subTitle}
`;
const BoxContainer = styled.div`
  ${boxContainer}
`;

const AddAccountOrAsset = () => {
  const { push } = useHistory();

  return (
    <ScrollView title="Add accounts or assets">
      <Section>
        <div>
          <SubTitle>Add New</SubTitle>
          <BoxContainer>
            <PrimaryCard
              icon={<Sheet />}
              title="Import wizard"
              subTitle="Import data from sites like Mint, Personal Capital, YNAB, etc..."
              onClick={() => push(routesPaths.addAccountOrAssetByWizard)}
            />
            <PrimaryCard
              icon={<Keyboard />}
              title="By hand"
              subTitle="Create a new account by entering data manually."
              onClick={() => push(routesPaths.addAccountOrAssetByHand)}
            />
          </BoxContainer>
        </div>
        <div>
          <SubTitle>Coming Soon</SubTitle>
          <BoxContainer>
            <PrimaryCard
              icon={<Bot />}
              title="Unleash a Bot"
              subTitle="Attemp to grab accounts and transactions from your financial institution’s website."
              onClick={() => {}}
              disabled
            />
            <PrimaryCard
              icon={<Lightning />}
              title="Canutin Link"
              subTitle="Automatically import and sync accounts from your financial institution."
              onClick={() => {}}
              disabled
            />
          </BoxContainer>
        </div>
      </Section>
    </ScrollView>
  );
};

export default AddAccountOrAsset;
