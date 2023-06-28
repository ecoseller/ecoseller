import { IBaseAttribute } from "@/types/product";

export const serializeAttributes = (attributes: IBaseAttribute[]) => {
  let serializedAttributes = "";

  const attributeValues = attributes.map(
    (attr) => `${attr.type.type_name}: ${attr.value} ${attr.type.unit || ""} `
  );

  return attributeValues.join(", ");
};
