import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { format } from 'date-fns';

export const mintCSVEntryBuilder = build('Mint CSV Entry', {
  fields: {
    Date: format(
      new Date(),
      'M/dd/yyyy'
    ),
    'Original Description': fake(f => f.lorem.sentence()),
    'Transaction Type': oneOf(['credit', 'debit']),
    Description: fake(f => f.lorem.sentence()),
    Amount: fake(f => f.finance.amount(0)),
    Category: fake(f => f.finance.transactionType()),
    'Account Name': fake(f => f.finance.accountName()),
    Labels: fake(f => f.lorem.sentence()),
    Notes: fake(f => f.lorem.sentence())
  },
});
