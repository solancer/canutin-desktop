import { useState } from 'react';

import { filterOptions } from '@app/constants/filters';
import { getNumberOfWeeks } from '@app/utils/date.utils';

const useGlobalFilterTable = () => {
  const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0]);
  const numberOfWeeks = selectedFilterOption.label === 'Lifetime' ? 52 : getNumberOfWeeks(selectedFilterOption.value.dateFrom, selectedFilterOption.value.dateTo);

  return {
    setSelectedFilterOption,
    selectedFilterOption,
    numberOfWeeks
  }
};

export default useGlobalFilterTable;
