import { getYear, format, setMonth, getMonth, getDate } from 'date-fns';

const today = new Date();

export const yearsList = Array.from({ length: 50 }, (v, k) => getYear(today) + 5 - k).map(
  value => ({ value, label: value.toString() })
);

export const dayList = Array.from({ length: 31 }, (v, k) => 1 + k).map(value => ({
  value,
  label: value.toString(),
}));

export const monthList = Array.from({ length: 12 }, (v, k) => k).map(value => ({
  value,
  label: format(setMonth(today, value), 'MMM'),
}));
