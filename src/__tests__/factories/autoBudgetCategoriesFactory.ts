import { Transaction } from '@database/entities';
import { autoBudgetNeedsCategories, autoBudgetWantsCategories } from '@app/utils/budget.utils';

interface FakeCategoryProps {
  id: number;
  name: string;
}

export const autoBudgetCategoriesBuilder = (transactions: Transaction[]) => {
  const needsCategories = [] as FakeCategoryProps[];
  const wantsCategories = [] as FakeCategoryProps[];

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

  const transactionsWithCategories = [] as any[];
  transactions.map(transaction => {
    let transactionCategory = needsCategories.find(
      ({ name }) => name === transaction.category.name
    );

    !transactionCategory &&
      (transactionCategory = wantsCategories.find(
        ({ name }) => name === transaction.category.name
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
