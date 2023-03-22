import { IPriceList } from "@/types/localization";
import { IAttributeType, IBaseAttributes } from "@/types/product";

/** Price */

export const deserializeProductVariantPricesToRow = (
  row: any,
  pricelistsData: IPriceList[]
) => {
  // since prices are initialy stored as an array of objects that the backend expects, where expected format is { pricelist: number, price: number }
  if (!row?.price) return {};
  let prices: any = {};
  pricelistsData?.forEach((pricelist: IPriceList) => {
    prices[`$PRICE_${pricelist.code}`] = row.price.find(
      (price: any) => price.price_list === pricelist.code
    )?.price;
  });

  return prices;
};

export const serializeProductVariantPricesFromRow = (
  row: any,
  pricelistsData: IPriceList[]
) => {
  // since prices in the row are stored as $PRICE_... we need to filter them out and serialize them
  // into an array of objects that the backend expects, where expected format is { pricelist: number, price: number }
  if (!row) return [];
  const prices = Object.entries(row)
    .filter(([key, value]) => key.startsWith("$PRICE_") && value)
    .map(([key, value]) => ({
      price_list: pricelistsData?.find(
        (pricelist) => pricelist.code === key.replace("$PRICE_", "")
      )?.code,
      price: Number(value),
    }));

  return prices;
};

/** Attributes */

export const deserializeProductVariantAttributesToRow = (
  row: any,
  attributesData: IAttributeType[]
) => {
  // since attributes are initialy stored as an array of numbers (attribute ids) we need to firstly
  // create an object with keys $ATTRIBUTE_... and then assign value to them (item from the array that is also in the base_attributes array (as id))
  if (!row?.attributes) return {};
  let attributes: any = {};
  attributesData?.forEach((attribute: IAttributeType) => {
    attributes[`$ATTRIBUTE_${attribute.type_name}`] = attribute.base_attributes
      .map((baseAttribute: IBaseAttributes) => baseAttribute.id)
      ?.find(
        (id: number) =>
          id ===
          row.attributes.find((attributeId: number) => attributeId === id)
      );
  });
  return attributes;
};

export const serializeProductVariantAttributesFromRow = (
  row: any,
  attributesData: IAttributeType[]
) => {
  // since attributes in the row are stored as $ATTRIBUTE_... we need to filter them out and serialize them
  // into an array of numbers (attribute ids) that the backend expects
  if (!row) return [];
  const attributes = Object.entries(row)
    .filter(([key, value]) => key.startsWith("$ATTRIBUTE_") && value)
    .map(([key, value]) => value);

  return attributes;
};
