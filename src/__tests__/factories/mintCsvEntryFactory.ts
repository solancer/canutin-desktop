import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { format } from 'date-fns';

export const uniqueDescription = () => {
  const uniqueId = new Date().getTime().toString().slice(-4);
  return `${fake(f => f.company.companyName())} ${uniqueId}`;
};

export const mintCSVEntryBuilder = build('Mint CSV Entry', {
  fields: {
    Date: format(new Date(), 'M/dd/yyyy'),
    'Original Description': uniqueDescription(),
    'Transaction Type': oneOf(['credit', 'debit']),
    Description: uniqueDescription(),
    Amount: fake(f => f.finance.amount()),
    Category: fake(f => f.finance.transactionType()),
    'Account Name': fake(f => f.finance.accountName()),
    Labels: fake(f => f.lorem.sentence()),
    Notes: fake(f => f.lorem.sentence()),
  },
});
