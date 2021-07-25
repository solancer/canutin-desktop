import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';
import {
  TransactionsContext,
  filterOptions
} from '@app/context/transactionsContext';

import SelectButton from '@components/common/SelectButton';
import { SelectFieldValue } from '@components/common/Form/Select';
import Button from '@components/common/Button';

import { buttonRow, dividerRow } from './styles';

const ButtonRow = styled.div`
  ${buttonRow}
`;

const DividerRow = styled.div`
  ${dividerRow}
`;

const TransactionsHeaderButtons = () => {
  const history = useHistory();
  const { filterOption, setFilterOption } = useContext(TransactionsContext);

  return (
    <ButtonRow>
      <Button onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}>
        Import wizard
      </Button>
      <SelectButton
        options={filterOptions}
        onChange={setFilterOption}
        value={filterOption}
      />
    </ButtonRow>
  );
};

export default TransactionsHeaderButtons;