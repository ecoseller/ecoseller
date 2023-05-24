import { IShippingMethodCountry } from "@/types/cart";
import ShippingPaymentMethodItem from "./ShippingPaymentMethodItem";

interface IShippingMethodListProps {
  methods: IShippingMethodCountry[];
  selected: number | null;
  setSelected: (id: number) => void;
}

const ShippingMethodList = ({
  methods,
  selected,
  setSelected,
}: IShippingMethodListProps) => {
  return (
    <>
      {methods?.map((method: IShippingMethodCountry) => (
        <ShippingPaymentMethodItem
          key={method.id}
          id={method.id}
          title={method.shipping_method.title}
          image={method.shipping_method.image}
          price_incl_vat={method.price_incl_vat}
          selected={selected === method.id}
          setSelected={setSelected}
        />
      ))}
    </>
  );
};

export default ShippingMethodList;
