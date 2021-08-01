import { getYear, format, setMonth, getDay, getMonth } from 'date-fns';

export const yearsList = Array.from(
  { length: 50 },
  (v, k) => getYear(new Date()) + 5 - k
).map(value => ({ value, label: value.toString() }));

export const dayList = Array.from({ length: 31 }, (v, k) => 1 + k).map(value => ({
  value,
  label: value.toString(),
}));

export const monthList = Array.from({ length: 12 }, (v, k) => k).map(value => ({
  value,
  label: format(setMonth(new Date(), value), 'MMM'),
}));

export const getCurrentDateInformation = () => {
  const today = new Date();

  return {
    day: getDay(today),
    month: getMonth(today),
    year: getYear(today)
  }
}