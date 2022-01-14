import { autoBudgetNeedsCategories, autoBudgetWantsCategories } from '@app/utils/budget.utils';
import { SeedTransaction, SeedTransactionCategory } from './entitiesFactory';

export const autoBudgetCategoriesBuilder = (transactions: SeedTransaction[]) => {
  const needsCategories = [] as SeedTransactionCategory[];
  const wantsCategories = [] as SeedTransactionCategory[];

  autoBudgetNeedsCategories.forEach(autoBudgetCategory => {
    const lastCategoryId = needsCategories?.[needsCategories.length - 1]?.id;
    const newCategory = {
      id: lastCategoryId ? lastCategoryId + 1 : 1,
      name: autoBudgetCategory,
    };
    needsCategories.push(newCategory);
  });

  autoBudgetWantsCategories.forEach(autoBudgetCategory => {
    const lastCategoryId = wantsCategories?.[wantsCategories.length - 1]?.id;
    const newCategory = {
      id: lastCategoryId ? lastCategoryId + 1 : 100,
      name: autoBudgetCategory,
    };
    wantsCategories.push(newCategory);
  });

  const transactionsWithCategories = [] as SeedTransaction[];
  transactions.map(transaction => {
    let transactionCategory = needsCategories.find(
      ({ name }) => name === transaction.category?.name
    );

    !transactionCategory &&
      (transactionCategory = wantsCategories.find(
        ({ name }) => name === transaction.category?.name
      ));

    !transactionCategory && (transactionCategory = { id: 1000, name: 'Uncategorized' });

    transactionsWithCategories.push({
      ...transaction,
      category: transactionCategory,
    });
  });

  return {
    needsCategories,
    wantsCategories,
    transactionsWithCategories,
  };
};
