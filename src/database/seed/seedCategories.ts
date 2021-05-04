import { CategoryRepository } from '../repositories/category.repository';

import categoryList from './categories';

const seedCategories = async () => {
  categoryList.categories.forEach(async ({ subcategories, name }) => {
    const rootCategory = await CategoryRepository.createRootCategory(name);

    subcategories.forEach(async ({ name }) => {
      await CategoryRepository.addSubCategories(name, rootCategory);
    });

    if (subcategories.length === 0) {
      // Add Root Category as subcategory
      await CategoryRepository.addSubCategories(name, rootCategory);
    }
  });
};

export default seedCategories;
