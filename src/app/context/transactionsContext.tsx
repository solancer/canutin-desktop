import { createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';

import { SelectFieldValue } from '@components/common/Form/Select';

import { budgetFilterOptions, filterOptions } from '@app/constants/filters';

interface TransactionsContextValue {
  filterOption: SelectFieldValue | null;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue | null>>;
  budgetFilterOption: SelectFieldValue | null;
  setBudgetFilterOption: Dispatch<SetStateAction<SelectFieldValue | null>>;
}

export const TransactionsContext = createContext<TransactionsContextValue>({
  filterOption: filterOptions[2],
  setFilterOption: () => {},
  budgetFilterOption: budgetFilterOptions[0],
  setBudgetFilterOption: () => {}
});

export const TransactionsProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [filterOption, setFilterOption] = useState<SelectFieldValue | null>(filterOptions[2]);
  const [budgetFilterOption, setBudgetFilterOption] = useState<SelectFieldValue | null>(budgetFilterOptions[0]);
  const value = {
    filterOption,
    setFilterOption,
    budgetFilterOption,
    setBudgetFilterOption
  };

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
};
