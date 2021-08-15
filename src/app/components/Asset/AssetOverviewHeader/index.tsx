import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';

import Button from '@components/common/Button';

import { buttonRow } from './styles';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const AssetOverviewHeader = () => {
  const history = useHistory();

  return (
    <ButtonRow>
      <Button onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}>Import Wizard</Button>
      <Button onClick={() => {}}>Last 3 months</Button>
    </ButtonRow>
  );
};

export default AssetOverviewHeader;
