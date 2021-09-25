import { build, fake } from '@jackfranklin/test-data-bot';
import { format } from 'date-fns';
import { uniqueDescription } from './mintCsvEntryFactory';

export const personalCapitalCSVEntryBuilder = build('Personal Capital CSV Entry', {
  fields: {
    Date: format(new Date(), 'yyyy-MM-dd'),
    Description: uniqueDescription(),
    Amount: fake(f => f.finance.amount()),
    Category: fake(f => f.finance.transactionType()),
    Account: fake(f => f.random.uuid()),
    Tags: fake(f => f.lorem.sentence()),
  },
});
