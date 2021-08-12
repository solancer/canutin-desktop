import { createContext, PropsWithChildren, useState, Dispatch, SetStateAction } from 'react';
import { subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

import { SelectFieldValue } from '@components/common/Form/Select';
import { dateInUTC } from '@app/utils/date.utils';

interface TransactionsContextValue {
  filterOption: SelectFieldValue | null;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue | null>>;
}

const today = new Date();
const thisMonthFrom = startOfMonth(today);
const thisMonthTo = endOfMonth(today);
const thisYearFrom = startOfYear(today);
const thisYearTo = endOfYear(today);

export const filters = [
  {
    label: 'This month',
    dateFrom: thisMonthFrom,
    dateTo: thisMonthTo,
  },
  {
    label: 'Last month',
    dateFrom: subMonths(thisMonthFrom, 1),
    dateTo: subMonths(thisMonthTo, 1),
  },
  {
    label: 'Last 3 months',
    dateFrom: subMonths(today, 3),
    dateTo: today,
  },
  {
    label: 'Last 6 months',
    dateFrom: subMonths(today, 6),
    dateTo: today,
  },
  {
    label: 'Last 12 months',
    dateFrom: subMonths(today, 12),
    dateTo: today,
  },
  {
    label: 'Year to date',
    dateFrom: thisYearFrom,
    dateTo: today,
  },
  {
    label: 'Last year',
    dateFrom: subYears(thisYearFrom, 1),
    dateTo: subYears(thisYearTo, 1),
  },
  {
    label: 'Lifetime',
    dateFrom: subYears(today, 900),
    dateTo: today,
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
