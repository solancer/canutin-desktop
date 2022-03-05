import { TransactionSubCategory } from '@database/entities';
import { CategoryRepository } from '../repositories/category.repository';

import categoryList from './categories';

const seedCategories = async () => {
  for (const { subCategories, name } of categoryList.categories) {
    const rootCategory = await CategoryRepository.createRootCategory(name);

    await CategoryRepository.addSubCategories(
      subCategories.map(({ name }) => new TransactionSubCategory(name, rootCategory))
    );
  }
};

export default seedCategories;
