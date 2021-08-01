import categoryList from '@database/seed/categories';

export const CATEGORY_GROUPED_OPTIONS = categoryList.categories.map(({ name, subcategories }) => {
  const subCategoriesOptions = subcategories.map(({ name: subCategoryName }) => ({
    value: subCategoryName,
    label: subCategoryName,
  }));

  return { label: name, options: subCategoriesOptions };
});
