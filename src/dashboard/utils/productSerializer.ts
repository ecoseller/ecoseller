import { IPriceList } from "@/types/localization";
import { IAttributeType, IBaseAttribute } from "@/types/product";

/** Price */

export const deserializeProductVariantPricesToRow = (
  row: any,
  pricelistsData: IPriceList[]
) => {
  // since prices are initialy stored as an array of objects that the backend expects, where expected format is { pricelist: number, price: number }
  if (!row?.price) return {};
  let prices: any = {};
  pricelistsData?.forEach((pricelist: IPriceList) => {
    prices[`$PRICE_${pricelist.code}_price`] = row.price.find(
      (price: any) => price.price_list === pricelist.code
    )?.price;
    prices[`$PRICE_${pricelist.code}_discount`] = row.price.find(
      (price: any) => price.price_list === pricelist.code
    )?.discount;
  });

  return prices;
};

export const serializeProductVariantPricesFromRow = (
  row: any,
  pricelistsData: IPriceList[]
) => {
  // since prices in the row are stored as $PRICE_...price and $PRICE_..._discount we need to filter them out and serialize them
  // into an array of objects that the backend expects, where expected format is { pricelist: number, price: number, discount: number }
  if (!row) return [];
  const prices = Object.entries(row)
    .filter(([key, value]) => key.startsWith("$PRICE_") && value)
    // now prices contains an array of tuples where first element is the key and second is the value
    // there're two types of keys: $PRICE_..._price and $PRICE_..._discount
    // we need to create an array of objects where each object has a key price_list and both price and discount (if it exists)
    .reduce((acc: any, [key, value]) => {
      const priceListCode = key
        .replace("$PRICE_", "")
        .replace("_price", "")
        .replace("_discount", "");
      const priceList = pricelistsData?.find(
        (pricelist) => pricelist.code === priceListCode
      );
      if (!priceList) return acc;
      const price = acc.find(
        (price: any) => price.price_list === priceList.code
      );
      if (key.endsWith("_price")) {
        if (price) {
          price.price = Number(value);
        } else {
          acc.push({
            price_list: priceList.code,
            price: Number(value),
          });
        }
      } else if (key.endsWith("_discount")) {
        if (price) {
          price.discount = Number(value);
        } else {
          acc.push({
            price_list: priceList.code,
            discount: Number(value),
          });
        }
      }
      return acc;
    }, [])
    .map((price: any) => ({
      price_list: price.price_list,
      price: price.price,
      discount: price.discount,
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
      .map((baseAttribute: IBaseAttribute) => baseAttribute.id)
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
