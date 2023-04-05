import { IAttributeType, IBaseAttribute } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postAttributeType = async (data: IAttributeType) => {
  // Create new AttributeType
  // URL: /product/dashboard/attribute/type
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("postAttributeType", data);
  return await axiosPrivate.post(`/product/dashboard/attribute/type/`, data);
};

export const putAttributeType = async (data: IAttributeType) => {
  // Update AttributeType
  // URL: /product/dashboard/attribute/type/<id>/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id)
    throw new Error("AttributeType id is required to update product");
  console.log("putAttributeType", data);
  return await axiosPrivate.put(
    `/product/dashboard/attribute/type/${data.id}/`,
    data
  );
};

export const deleteAttribtueType = async (id: number | string) => {
  // Delete AttributeType
  // URL: /product/dashboard/attribute/type/<id>/
  // Method: DELETE
  // Params: id
  // Return: Promise
  console.log("deleteAttribtueType", id);
  return await axiosPrivate.delete(`/product/dashboard/attribute/type/${id}/`);
};

export const postBaseAttribute = async (data: IBaseAttribute) => {
  // Create new BaseAttribute
  // URL: /product/dashboard/attribute/
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("postBaseAttribute", data);
  return await axiosPrivate.post(`/product/dashboard/attribute/`, data);
};

export const putBaseAttribute = async (data: IBaseAttribute) => {
  // Update BaseAttribute
  // URL: /product/dashboard/attribute/<id>/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id)
    throw new Error("BaseAttribute id is required to update product");
  console.log("putBaseAttribute", data);
  return await axiosPrivate.put(
    `/product/dashboard/attribute/${data.id}/`,
    data
  );
};

export const deleteBaseAttribtue = async (id: number | string) => {
  // Delete AttributeType
  // URL: /product/dashboard/attribute/<id>/
  // Method: DELETE
  // Params: id
  // Return: Promise
  console.log("deleteAttribtueType", id);
  return await axiosPrivate.delete(`/product/dashboard/attribute/${id}/`);
};
