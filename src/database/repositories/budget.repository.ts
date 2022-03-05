import { getRepository } from 'typeorm';
import { startOfMonth } from 'date-fns';

import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { Budget, TransactionSubCategory } from '../entities';
import { dateInUTC } from '@app/utils/date.utils';
import { EditBudgetCategorySubmitType } from '@app/components/Budget/TransactionCategoriesForm';
import { CategoryRepository } from './category.repository';
import { EditBudgetType } from '@app/components/Budget/EditBudgetGroups';
import { getUserBudgetForPeriod } from '@app/utils/budget.utils';

export class BudgetRepository {
  static async createBudget(
    name: string,
    targetAmount: number,
    type: BudgetTypeEnum,
    categories: TransactionSubCategory[]
  ): Promise<Budget> {
    return await getRepository<Budget>(Budget).save(
      new Budget(name, targetAmount, type, categories, dateInUTC(startOfMonth(new Date())))
    );
  }

  static async getBudgets(): Promise<Budget[]> {
    return await getRepository<Budget>(Budget).find({
      relations: ['categories'],
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
  }

  static async getBudgetById(id: number): Promise<Budget | undefined> {
    return await getRepository<Budget>(Budget).findOne({
      where: {
        id,
      },
    });
  }

  static async updateBudget(id: number, targetAmount: number, name?: string) {
    await getRepository<Budget>(Budget).update({ id }, { targetAmount, name });
  }

  static async deleteBudget(id: number) {
    await getRepository<Budget>(Budget).delete(id);
  }

  static async editBudgets(editBudgets: EditBudgetType): Promise<void> {
    if (editBudgets.autoBudgetField === 'Disabled') {
      const budgetRepository = getRepository<Budget>(Budget);
      const userBudgets = await this.getBudgets();
      const dateFrom = dateInUTC(startOfMonth(new Date()));
      const isLastUserBudgetThisMonth = userBudgets[0]?.createdAt.getTime() === dateFrom.getTime();

      // Deleting all budgets for this month
      if (isLastUserBudgetThisMonth) {
        const userBudgetInPeriod = getUserBudgetForPeriod(userBudgets, dateFrom);
        userBudgetInPeriod.map(({ id }) => budgetRepository.delete({ id }));
      }

      // Replacing all budgets with new ones
      editBudgets.editedBudgets &&
        (await Promise.allSettled(
          editBudgets.editedBudgets.map(({ name, targetAmount, type, categories }) =>
            this.createBudget(name, targetAmount, type, categories ? categories : [])
          )
        ));
    }
  }

  static async addBudgetCategory(budgetCategory: EditBudgetCategorySubmitType) {
    const category = await CategoryRepository.getSubCategory(budgetCategory.categoryName);
    const budget = (await this.getBudgetById(budgetCategory.budgetId)) as Budget;
    await getRepository<Budget>(Budget)
      .createQueryBuilder()
      .relation(Budget, 'categories')
      .of(budget)
      .add(category);
  }

  static async removeBudgetCategory(budgetCategory: EditBudgetCategorySubmitType) {
    const category = await CategoryRepository.getSubCategory(budgetCategory.categoryName);
    const budget = await getRepository<Budget>(Budget)
      .createQueryBuilder('budget')
      .leftJoinAndSelect('budget.categories', 'categories')
      .where('categories.id =:id', { id: category.id })
      .getOne();

    await getRepository<Budget>(Budget)
      .createQueryBuilder()
      .relation(Budget, 'categories')
      .of(budget)
      .remove(category);
  }
}
