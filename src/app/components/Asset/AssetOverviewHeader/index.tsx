import React from 'react';
import { useHistory } from 'react-router-dom';

import { routesPaths } from '@routes';
import { filterOptions } from '@app/constants/filters';

import ButtonRow from '@components/common/ButtonRow';
import Button from '@components/common/Button';
import ButtonDivider from '@components/common/ButtonDivider';
import ButtonSelect from '@components/common/ButtonSelect';

const AssetOverviewHeader = () => {
  const history = useHistory();

  // FIXME: This is a placeholder, remove after implementing the correct date range.
  const tempValue = {
    label: 'Last 3 months',
    dateFrom: new Date(),
    dateTo: new Date(),
  };

  return (
    <ButtonRow>
      <Button onClick={() => history.push(routesPaths.addAccountOrAssetByWizard)}>
        Import Wizard
      </Button>
      <ButtonDivider />
      <ButtonSelect
        options={filterOptions}
        value={tempValue} // FIXME
        onChange={() => {}} // FIXME
        isSearchable={false}
        classNamePrefix="select"
      />
    </ButtonRow>
  );
};

export default AssetOverviewHeader;
