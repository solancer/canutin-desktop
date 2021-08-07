import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';

import Button from '@components/common/Button';

import { buttonRow } from './styles';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const TransactionsHeaderButtons = () => {
  const history = useHistory();

  return (
    <ButtonRow>
      <Button onClick={() => history.push(routesPaths.addTransaction)}>Add transaction</Button>
      <Button onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}>Import</Button>
    </ButtonRow>
  );
};

export default TransactionsHeaderButtons;
