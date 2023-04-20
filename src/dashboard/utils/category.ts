import { ICategoryLocalized } from "@/types/category";

export const flattenCategory = (
  category: ICategoryLocalized,
  level: number = 0
): ICategoryLocalized[] => {
  let categories = [
    {
      id: category.id,
      title: `${"-".repeat(level)} ${category.title}`,
      published: category.published,
      update_at: category.update_at,
    } as ICategoryLocalized,
  ];
  if (category.children) {
    category.children.forEach((child) => {
      categories = [...categories, ...flattenCategory(child, level + 1)];
    });
  }
  return categories as ICategoryLocalized[];
};
