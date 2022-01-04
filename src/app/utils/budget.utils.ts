import { isAfter, isSameMonth } from 'date-fns';

import { AccountsIndex } from '@app/context/entitiesContext';
import { BudgetTypeEnum } from '@enums/budgetType.enum';

import { TrailingCashflowSegmentsEnum } from '@app/components/BigPicture/TrailingCashflow';
import {
  getTransactionsTrailingCashflow,
  getTransactionTrailingCashflowAverage,
} from '@app/utils/balance.utils';
import { Budget, TransactionSubCategory } from '@database/entities';

export type AutoBudgetCategoriesType = {
  needs: TransactionSubCategory[];
  wants: TransactionSubCategory[];
};

export const autoBudgetNeedsCategories = [
  'Education',
  'Studen loan',
  'Groceries',
  'Health',
  'Medical care',
  'Pharmacies',
  'Housing',
  'Mortgage',
  'Rent',
  'Institutional',
  'Insurance',
  'Government',
  'Legal',
  'Taxes',
  'Kids',
  'Allowance',
  'Child care',
  'Kids supplies',
  'Pets',
  'Veterinary',
  'Transportation',
  'Automotive',
  'Gas stations',
  'Service & parts',
  'Public transportation',
  'Buses & trains',
  'Utilities',
  'Electricity',
  'Gas',
  'Internet & phone',
  'Water',
  'Sanitary & waste management',
];

export const autoBudgetWantsCategories = [
  'Museums',
  'Music',
  'Nightlife',
  'Sports',
  'Subscriptions',
  'Theatres',
  'Outdoors & parks',
  'Business & services',
  'Contractors',
  'Manufacturing',
  'Office supplies',
  'Postal & shipping',
  'Books & supplies',
  'Financial & banking',
  'Cash',
  'Fees',
  'Financial services',
  'Income',
  'Interest',
  'Payments',
  'Transfers',
  'Withdrawals',
  'Bars',
  'Coffee shops',
  'Food & drink',
  'Restaurants',
  'Fitness',
  'Furnishings',
  'Home maintenance',
  'Home improvement',
  'Home security',
  'Religious',
  'Toys',
  'Personal',
  'Charity',
  'Gifts',
  'Payroll & benefits',
  'Personal care',
  'Pet services',
  'Shops',
  'Arts & crafts',
  'Clothing',
  'Electronics',
  'Hobbies',
  'Parking',
  'Taxi & ride sharing',
  'Travel',
  'Vehicle rentals',
  'Boats & cruises',
  'Lodging',
  'Vacation',
  'Television',
  'Entertainment & recreation',
];

// Generates the budgets for auto-budget index
export const getAutoBudgets = (
  accountsIndex: AccountsIndex,
  autoBudgetCategories: AutoBudgetCategoriesType
) => {
  const transactions = accountsIndex?.accounts.map(account => account.transactions!).flat();

  const targetIncomeAmount = Math.round(
    transactions?.sort((a, b) => b.date.getTime() - a.date.getTime())
      ? getTransactionTrailingCashflowAverage(
          getTransactionsTrailingCashflow(transactions),
          TrailingCashflowSegmentsEnum.LAST_6_MONTHS
        )[0]
      : 0
  );

  const autoBudgets = [
    {
      id: 1,
      name: 'Income',
      targetAmount: targetIncomeAmount,
      type: BudgetTypeEnum.INCOME,
      categories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Needs',
      targetAmount: Math.round(targetIncomeAmount * 0.5 * -1),
      type: BudgetTypeEnum.EXPENSE,
      categories: autoBudgetCategories.needs,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Wants',
      targetAmount: Math.round(targetIncomeAmount * 0.3 * -1),
      type: BudgetTypeEnum.EXPENSE,
      categories: autoBudgetCategories.wants,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return autoBudgets;
};

// Get the most recent user budget for any given period
export const getUserBudgetForPeriod = (userBudget: Budget[], dateFrom: Date) => {
  const latestBudgetDate = userBudget
    .filter(
      ({ createdAt }) => isAfter(dateFrom, createdAt) || isSameMonth(dateFrom, createdAt)
    )?.[0]
    ?.createdAt.getTime();

  return userBudget.filter(({ createdAt }) => createdAt.getTime() === latestBudgetDate);
};

export const handleBudgets = (budgetsForPeriod: Budget[]) => {
  const budgetExpenseGroups = budgetsForPeriod?.filter(
    ({ type }) => type === BudgetTypeEnum.EXPENSE
  );

  let targetIncomeAmount = budgetsForPeriod?.find(({ type }) => type === BudgetTypeEnum.INCOME)
    ?.targetAmount;
  targetIncomeAmount = targetIncomeAmount || 0;

  let targetExpensesAmount = budgetExpenseGroups?.reduce(
    (acc, { targetAmount }) => acc + targetAmount,
    0
  );
  targetExpensesAmount = targetExpensesAmount || 0;

  const targetSavingsAmount = Math.round(targetIncomeAmount - Math.abs(targetExpensesAmount));

  return {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    budgetExpenseGroups,
  };
};
