import { build, fake } from '@jackfranklin/test-data-bot';
import { format } from 'date-fns';

export const personalCapitalCSVEntryBuilder = build('Personal Capital CSV Entry', {
  fields: {
    Date: format(
      new Date(),
      'yyyy-MM-dd'
    ),
    Description: fake(f => f.lorem.sentence()),
    Amount: fake(f => f.finance.amount()),
    Category: fake(f => f.finance.transactionType()),
    Account: fake(f => f.finance.accountName()),
    Tags: fake(f => f.lorem.sentence())
  },
});
