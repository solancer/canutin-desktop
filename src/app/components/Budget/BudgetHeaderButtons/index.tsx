import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { TransactionsContext } from '@app/context/transactionsContext';
import { budgetFilterOptions } from '@app/constants/filters';
import { routesPaths } from '@app/routes';

import ButtonRow from '@components/common/ButtonRow';
import Button from '@components/common/Button';
import ButtonDivider from '@components/common/ButtonDivider';
import ButtonSelect from '@components/common/ButtonSelect';

const TransactionsHeaderButtons = () => {
  const history = useHistory();
  const { budgetFilterOption, setBudgetFilterOption } = useContext(TransactionsContext);

  return (
    <ButtonRow>
      <Button
        onClick={() => {
          history.push(routesPaths.editBudget);
        }}
      >
        Edit
      </Button>
      <ButtonDivider />
      <ButtonSelect
        options={budgetFilterOptions}
        value={budgetFilterOption}
        onChange={setBudgetFilterOption}
        isSearchable={false}
        classNamePrefix="select"
      />
    </ButtonRow>
  );
};

export default TransactionsHeaderButtons;
