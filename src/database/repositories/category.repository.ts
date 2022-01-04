import { getRepository } from 'typeorm';

import { TransactionCategory, TransactionSubCategory } from '../entities';

export class CategoryRepository {
  static async createRootCategory(name: string): Promise<TransactionCategory> {
    return await getRepository<TransactionCategory>(TransactionCategory).save(
      new TransactionCategory(name)
    );
  }

  static async addSubCategories(
    name: string,
    rootCategory: TransactionCategory
  ): Promise<TransactionSubCategory> {
    return await getRepository<TransactionSubCategory>(TransactionSubCategory).save(
      new TransactionSubCategory(name, rootCategory)
    );
  }

  static async getSubCategory(name: string): Promise<TransactionSubCategory> {
    let subCategory;

    if (!name) {
      subCategory = await getRepository<TransactionSubCategory>(TransactionSubCategory).findOne({
        where: { name: 'Uncategorized' },
      });
    } else {
      subCategory = await getRepository<TransactionSubCategory>(TransactionSubCategory).findOne({
        where: { name },
      });
    }

    if (!subCategory) {
      const rootCategory = await getRepository<TransactionSubCategory>(
        TransactionSubCategory
      ).findOne({
        where: { name: 'Uncategorized' },
      });
      return rootCategory as TransactionSubCategory;
    }

    return subCategory;
  }
}
