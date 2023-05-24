import ShippingPaymentMethodItem from "./ShippingPaymentMethodItem";

// types
import { IPaymentMethodCountry } from "@/types/cart";

interface IPaymentMethodListProps {
  methods: IPaymentMethodCountry[];
  selected: number | null;
  setSelected: (id: number) => void;
}

const PaymentMethodList = ({
  methods,
  selected,
  setSelected,
}: IPaymentMethodListProps) => {
  return (
    <>
      {methods?.map((method: IPaymentMethodCountry) => (
        <ShippingPaymentMethodItem
          key={method.id}
          id={method.id}
          title={method.payment_method.title}
          image={method.payment_method.image}
          price_incl_vat={method.price_incl_vat}
          selected={selected === method.id}
          setSelected={setSelected}
        />
      ))}
    </>
  );
};

export default PaymentMethodList;
