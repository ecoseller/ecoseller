import { ISelectedFiltersWithOrdering } from "@/types/category";
import { IProductRecord } from "@/types/product";

/**
 * Get all products contained in the given category
 * @param categoryId
 * @param pricelist
 * @param country
 * @param filters
 */
export const filterProducts = async (
  categoryId: number,
  pricelist: string,
  country: string,
  filters: ISelectedFiltersWithOrdering
) => {
  let url = `/api/category/${categoryId}/products?pricelist=${pricelist}&country=${country}`;

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(filters),
  })
    .then((res) => res.json())
    .then((data) => data as IProductRecord[]);
};
