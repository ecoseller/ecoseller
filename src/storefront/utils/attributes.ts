import { IBaseAttribute } from "@/types/product";

export const serializeAttributes = (attributes: IBaseAttribute[]) => {
  let serializedAttributes = "";

  const attributeValues = attributes.map(
    (attr) =>
      `${attr.type.name}: ${attr.type.is_numeric ? attr.value : attr.name} ${
        attr.type.unit || ""
      } `
  );

  return attributeValues.join(", ");
};
