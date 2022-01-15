import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router-dom';

import { SelectFieldValue } from '@components/common/Form/Select';
import { routesPaths } from '@routes';
import { filterOptions } from '@app/constants/filters';

import ButtonRow from '@components/common/ButtonRow';
import Button from '@components/common/Button';
import ButtonDivider from '@components/common/ButtonDivider';
import ButtonSelect from '@components/common/ButtonSelect';

interface AccountOverviewHeaderProps {
  filterOption: SelectFieldValue;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue>>;
}

const AccountOverviewHeader = ({ filterOption, setFilterOption }: AccountOverviewHeaderProps) => {
  const history = useHistory();

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

export default AccountOverviewHeader;
