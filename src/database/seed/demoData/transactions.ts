import { addDays, startOfMonth, subMonths } from 'date-fns';

const MONTHS_IN_SET = 24;

export const accountCheckingTransactionSet = () => {
  const transactionSet = (i: number) => [
    {
      description: 'Westside Apartments',
      amount: -2250,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 0),
      categoryName: 'Rent',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Initech HR * Payroll',
      amount: 2800,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 5),
      categoryName: 'Payroll & benefits',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Transfer to Ransack Savings',
      amount: -250,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 6),
      categoryName: 'Transfers',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Juggernaut Visa Payment',
      amount: i % 2 === 0 ? -1750 : -1500,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 7),
      categoryName: 'Payments',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Initech HR * Payroll',
      amount: 2800,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 20),
      categoryName: 'Payroll & benefits',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Transfer to Loot Financial',
      amount: -500,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 24),
      categoryName: 'Transfers',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Transfer to MegaCoin Exchange',
      amount: i % 3 === 0 ? 0 : -500,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 27),
      categoryName: 'Transfers',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Toyota - TFS Payment',
      amount: -500,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 27),
      categoryName: 'Automotive',
      excludeFromTotals: false,
      pending: false,
    },
  ];

  let transactions = transactionSet(0);
  for (let i = 1; i < MONTHS_IN_SET; i++) {
    transactions = transactions.concat(transactionSet(i));
  }

  return transactions;
};

export const accountSavingsTransactionSet = () => {
  const transactionSet = (i: number) => [
    {
      description: 'Transfer from Ransack Checking',
      amount: 250,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 6),
      categoryName: 'Transfers',
      excludeFromTotals: false,
      pending: false,
    },
  ];

  let transactions = transactionSet(0);
  for (let i = 1; i < MONTHS_IN_SET; i++) {
    transactions = transactions.concat(transactionSet(i));
  }

  return transactions;
};

export const accountCreditCardTransactionSet = () => {
  const transactionSet = (i: number) => [
    {
      description: 'Evergreen Market',
      amount: -175.75,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 1),
      categoryName: 'Groceries',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Evergreen Market',
      amount: -135.5,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 7),
      categoryName: 'Groceries',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Evergreen Market',
      amount: -189.25,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 15),
      categoryName: 'Groceries',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Evergreen Market',
      amount: -105.5,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 23),
      categoryName: 'Groceries',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Chorizo King',
      amount: -22.5,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 3),
      categoryName: 'Food & drink',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Por Que No Los Tacos?',
      amount: -19.25,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 6),
      categoryName: 'Food & drink',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Mainely Lobster',
      amount: -43.97,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 10),
      categoryName: 'Restaurants',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: "Maria's Artisanal Gelato",
      amount: -12.67,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 11),
      categoryName: 'Food & drink',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Sunset Cafe',
      amount: -17.81,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 14),
      categoryName: 'Restaurants',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Stellar Burger',
      amount: -16.23,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 20),
      categoryName: 'Restaurants',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: "Roy's Steakhouse",
      amount: -55.78,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 25),
      categoryName: 'Restaurants',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Stellar Burger',
      amount: -19.23,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 27),
      categoryName: 'Restaurants',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'NetTV Max',
      amount: -14.99,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 2),
      categoryName: 'Subscriptions',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Store.com',
      amount: -25.9,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 12),
      categoryName: 'Shops',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Store.com',
      amount: -24.21,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 18),
      categoryName: 'Shops',
      excludeFromTotals: true,
      pending: false,
    },
    {
      description: 'Store.com (Refund)',
      amount: -24.21,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 27),
      categoryName: 'Shops',
      excludeFromTotals: true,
      pending: false,
    },
    {
      description: 'Florida Man (Gas & Convinience Store)',
      amount: -25.67,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 7),
      categoryName: 'Gas stations',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Florida Man (Gas & Convinience Store)',
      amount: -40.01,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 24),
      categoryName: 'Gas stations',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Patriot Insurance',
      amount: -135.67,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 2),
      categoryName: 'Insurance',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Horizon Wireless',
      amount: -90.5,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 15),
      categoryName: 'Internet & phone',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: i % 7 === 0 ? 'Hølm Home' : 'The Hardware Center',
      amount: i % 7 === 0 ? -215.43 : -95.89,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 16),
      categoryName: i % 2 === 0 ? 'Furnishings' : 'Home maintenance',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: i % 5 === 0 ? 'ShortCircut Computers' : 'alphaStream',
      amount: i % 5 === 0 ? -649.99 : -4.99,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 26),
      categoryName: i % 5 === 0 ? 'Electronics' : 'Music',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'PurpleShield Health',
      amount: -254.84,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 3),
      categoryName: 'Health',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: i % 7 === 0 ? 'Narby Warker' : "Stefano's Pizza by the Slice",
      amount: i % 7 === 0 ? -150 : -7.78,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 13),
      categoryName: i % 7 === 0 ? 'Health' : 'Restaurants',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: i % 9 === 0 ? '9-5 Office Supplies' : 'Flix Movie Rentals',
      amount: i % 9 === 0 ? -98.23 : -4.99,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 13),
      categoryName: i % 9 === 0 ? 'Office supplies' : 'Entertainment & recreation',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description:
        i % 11 === 0 ? 'Horizon Wireless (Promotional Rebate)' : 'Juggernaut Cash Back Redemption',
      amount: i % 11 === 0 ? 445 : 25.33,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 27),
      categoryName: i % 11 === 0 ? 'Internet & phone' : 'Financial & banking',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Ransack Bank Payment Received — Thank You',
      amount: i % 3 === 0 ? 1755 : i % 6 === 0 ? 2355 : i % 9 === 0 ? 1945 : 1675,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 8),
      categoryName: 'Payments',
      excludeFromTotals: false,
      pending: false,
    },
    {
      description: 'Juggernaut Visa Interest',
      amount: -56.89,
      date: addDays(startOfMonth(subMonths(new Date(), i)), 8),
      categoryName: 'Fees',
      excludeFromTotals: false,
      pending: false,
    },
  ];

  let transactions = transactionSet(0);
  for (let i = 1; i < MONTHS_IN_SET; i++) {
    transactions = transactions.concat(transactionSet(i));
  }

  return transactions;
};
