import { subMonths, subYears, isAfter, isBefore } from 'date-fns';

import { Transaction } from '@database/entities';

export const filters = [
  {
    label: 'This month',
    dateFrom: subMonths(new Date(), 1),
    dateTo: new Date(),
  },
  {
    label: 'Last 3 months',
    dateFrom: subMonths(new Date(), 3),
    dateTo: new Date(),
  },
  {
    label: 'Last 6 months',
    dateFrom: subMonths(new Date(), 6),
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

export const getSelectedTransactions = (transactions: Transaction[], from: Date, to: Date) =>
  transactions.filter(
    transaction => isBefore(from, transaction.date) && isAfter(to, transaction.date)
  );
