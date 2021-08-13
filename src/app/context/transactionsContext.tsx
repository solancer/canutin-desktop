import { createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';

import { SelectFieldValue } from '@components/common/Form/Select';

import { filterOptions } from '@app/constants/filters';

interface TransactionsContextValue {
  filterOption: SelectFieldValue | null;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue | null>>;
}

export const TransactionsContext = createContext<TransactionsContextValue>({
  filterOption: filterOptions[0],
  setFilterOption: () => {},
});

export const TransactionsProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [filterOption, setFilterOption] = useState<SelectFieldValue | null>(filterOptions[0]);
  const value = {
    filterOption,
    setFilterOption,
  };

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
};
