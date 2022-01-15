import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';
import { TransactionsContext } from '@app/context/transactionsContext';
import { filterOptions } from '@app/constants/filters';

import ButtonRow from '@components/common/ButtonRow';
import Button from '@components/common/Button';
import ButtonDivider from '@components/common/ButtonDivider';
import ButtonSelect from '@components/common/ButtonSelect';

const TransactionsHeaderButtons = () => {
  const history = useHistory();
  const { filterOption, setFilterOption } = useContext(TransactionsContext);

  return (
    <ButtonRow>
      <Button onClick={() => history.push(routesPaths.addTransaction)}>Add transaction</Button>
      <Button onClick={() => history.push(routesPaths.addOrUpdateDataByWizard)}>Import</Button>
      <ButtonDivider />
      <ButtonSelect
        options={filterOptions}
        value={filterOption}
        onChange={setFilterOption}
        isSearchable={false}
        classNamePrefix="select"
      />
    </ButtonRow>
  );
};

export default TransactionsHeaderButtons;
