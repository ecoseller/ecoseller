import { IBaseAttribute } from "@/types/product";

export const serializeAttributes = (attributes: IBaseAttribute[]) => {
  let serializedAttributes = "";

  attributes?.forEach((attribute) => {
    serializedAttributes += `${attribute.type.type_name}: ${attribute.value} ${attribute.type.unit} `;
  });

  return serializedAttributes;
};
