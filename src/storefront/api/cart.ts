import { Cart } from "@/types/cart";

export const getCart = async () => {
  return fetch(
    "http://localhost:8000/cart/storefront/b93972a844a44ef5aed76217fc7fee4e/"
  )
    .then((res) => res.json())
    .then((data) => data as Cart);
};
