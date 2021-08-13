import { useState } from 'react';

import { filterOptions } from '@app/constants/filters';

const useGlobalFilterTable = () => {
  const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0]);

  return {
    setSelectedFilterOption,
    selectedFilterOption,
  }
};

export default useGlobalFilterTable;
