import { createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';
import { subMonths, subYears } from 'date-fns';

import { SelectFieldValue } from '@components/common/Form/Select';

interface TransactionsContextValue {
  filterOption: SelectFieldValue | null;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue | null>>;
}

export const filters = [
  {
    label: 'Last 3 months',
    dateFrom: subMonths(new Date(), 3),
    dateTo: new Date(),
  },
  {
    label: 'Last 12 months',
    dateFrom: subMonths(new Date(), 12),
    dateTo: new Date(),
  },
  {
    label: 'Lifetime',
    dateFrom: subYears(new Date(), 900),
    dateTo: new Date(),
  },
];
export const filterOptions = filters.map(({ label, dateFrom, dateTo }) => ({
  value: { dateFrom, dateTo },
  label,
}));

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
