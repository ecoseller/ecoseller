import {
  IAttributeType,
  IAttributeTypePostRequest,
  IBaseAttribute,
  IBaseAttributePostRequest,
} from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postAttributeType = async (data: IAttributeTypePostRequest) => {
  // Create new AttributeType
  // URL: /product/dashboard/attribute/type
  // Method: POST
  // Params: data
  // Return: Promise
  return await fetch("/api/product/attribute/type", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const putAttributeType = async (data: IAttributeType) => {
  // Update AttributeType
  // URL: /product/dashboard/attribute/type/<id>/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id)
    throw new Error("AttributeType id is required to update product");

  return await fetch(`/api/product/attribute/type/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const deleteAttribtueType = async (id: number | string) => {
  // Delete AttributeType
  // URL: /product/dashboard/attribute/type/<id>/
  // Method: DELETE
  // Params: id
  // Return: Promise
  return await fetch(`/api/product/attribute/type/${id}`, {
    method: "DELETE",
  }).then((response) => response.json());
};

export const postBaseAttribute = async (data: IBaseAttributePostRequest) => {
  // Create new BaseAttribute
  // URL: /product/dashboard/attribute/
  // Method: POST
  // Params: data
  // Return: Promise
  return await fetch("/api/product/attribute", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const putBaseAttribute = async (data: IBaseAttribute) => {
  // Update BaseAttribute
  // URL: /product/dashboard/attribute/<id>/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id)
    throw new Error("BaseAttribute id is required to update product");

  return await fetch(`/api/product/attribute/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const deleteBaseAttribtue = async (id: number | string) => {
  // Delete AttributeType
  // URL: /product/dashboard/attribute/<id>/
  // Method: DELETE
  // Params: id
  // Return: Promise
  return await fetch(`/api/product/attribute/${id}`, {
    method: "DELETE",
  }).then((response) => response.json());
};
