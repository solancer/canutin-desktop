import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Button, { SubmitButtonOptions } from '@components/common/Form/ButtonSubmit';
import { buttonRow } from './styles';

import { routesPaths } from '@routes';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const HeaderButtons = () => {
  const history = useHistory();

  return (
    <ButtonRow>
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
    </ButtonRow>
  );
};

export default HeaderButtons;
