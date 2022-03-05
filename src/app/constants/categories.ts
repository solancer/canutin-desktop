import categoryList from '@database/seed/categories';

export const CATEGORY_GROUPED_OPTIONS = categoryList.categories.map(({ name, subCategories }) => {
  const subCategoriesOptions = subCategories.map(({ name: subCategoryName }) => ({
    value: subCategoryName,
    label: subCategoryName,
  }));

  return { label: name, options: subCategoriesOptions };
});
