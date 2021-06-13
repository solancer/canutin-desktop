import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import ScrollView from '@components/common/ScrollView';
import Button, { SubmitButtonOptions } from '@components/common/Form/ButtonSubmit';

import { routesPaths } from '@routes';

import { balanceSheetRedirectButtonsContainer } from './styles';

const BalanceSheetRedirectButtonsContainer = styled.div`
  ${balanceSheetRedirectButtonsContainer}
`;

const BalanceSheetRedirectButtons = () => {
  const history = useHistory();

  return (
    <BalanceSheetRedirectButtonsContainer>
      <Button
        buttonType={SubmitButtonOptions.SECONDARY}
        onClick={() => history.push(routesPaths.addAccountOrAssetByHand)}
      >
        Add new
      </Button>
      <Button
        buttonType={SubmitButtonOptions.SECONDARY}
        onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}
      >
        Import wizard
      </Button>
    </BalanceSheetRedirectButtonsContainer>
  );
};

const BalanceSheet = () => (
  <>
    <ScrollView
      title="Balance sheet"
      rightInformationComponent={<BalanceSheetRedirectButtons />}
    ></ScrollView>
  </>
);

export default BalanceSheet;
