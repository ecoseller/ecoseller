import { IProductType } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postProductType = async (data: IProductType) => {
  // Create new product type
  // URL: /product/dashboard/type/
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("postProductType", data);
  return await fetch("/api/product/type", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const putProductType = async (data: IProductType) => {
  // Update ProductType
  // URL: /product/dashboard/type/<id>/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id) throw new Error("ProductType id is required to update product");
  console.log("putProductType", data);
  return await fetch(`/api/product/type/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const deleteProductType = async (id: number | string) => {
  // Delete ProductType
  // URL: /product/dashboard/type/<id>/
  // Method: DELETE
  // Params: id
  // Return: Promise
  console.log("deleteProductType", id);
  return await fetch(`/api/product/type/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};
