import { IProductRecord } from "@/types/product";

/**
 * Get all products contained in the given category
 * @param categoryId
 * @param pricelist
 * @param country
 * @param sortBy
 * @param order
 */
export const getCategoryProducts = async (
  categoryId: number,
  pricelist: string,
  country: string,
  sortBy?: string,
  order?: string
) => {
  let url = `/api/category/${categoryId}/products?pricelist=${pricelist}&country=${country}`;

  if (sortBy) {
    url += `&sort_by=${sortBy}`;
  }
  if (order) {
    url += `&order=${order}`;
  }

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data as IProductRecord[]);
};
