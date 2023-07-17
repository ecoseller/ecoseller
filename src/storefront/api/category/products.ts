import { ISelectedFiltersWithOrderingToSend } from "@/types/category";
import { IPaginatedProductRecord } from "@/types/product";

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
  filters: ISelectedFiltersWithOrderingToSend,
  page: number,
  recommenderSessionId: string
) => {
  let url = `/api/category/${categoryId}/products?pricelist=${pricelist}&country=${country}&page=${page}&recommender_session_id=${
    recommenderSessionId || ""
  }`;

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(filters),
  })
    .then((res) => res.json())
    .then((data) => data as IPaginatedProductRecord);
};
