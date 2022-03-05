import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';
import { filterOptions } from '@app/constants/filters';
import { SelectFieldValue } from '@components/common/Form/Select';

import ButtonRow from '@components/common/ButtonRow';
import Button from '@components/common/Button';
import ButtonDivider from '@components/common/ButtonDivider';
import ButtonSelect from '@components/common/ButtonSelect';

interface AssetOverviewHeaderProps {
  filterOption: SelectFieldValue;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue>>;
}

const AssetOverviewHeader = ({ filterOption, setFilterOption }: AssetOverviewHeaderProps) => {
  const history = useHistory();

  return (
    <ButtonRow>
      <Button onClick={() => history.push(routesPaths.addOrUpdateDataByWizard)}>
        Import wizard
      </Button>
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

export default AssetOverviewHeader;
