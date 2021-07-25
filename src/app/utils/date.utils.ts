import { format } from 'date-fns';

const DATE_FORMAT = 'MMM dd, yyyy';

export const formatDate = (date: Date) => format(date, DATE_FORMAT);
