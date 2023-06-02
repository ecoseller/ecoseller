import React from "react";
import CollapsableContentWithTitle from "../../Generic/CollapsableContentWithTitle";
import EditorCard from "../../Generic/EditorCard";
import { IBillingInfo, IShippingInfo } from "@/types/cart/cart";

interface IOrderDetailBillingShippingInfoProps {
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
}
const OrderDetailBillingShippingInfo = ({
  billingInfo,
  shippingInfo,
}: IOrderDetailBillingShippingInfoProps) => {
  return (
    <>
      <EditorCard>
        <CollapsableContentWithTitle title="Billing & Shipping info">
          {/* <BillingInfo billingInfo={} countryOptions={} /> */}
        </CollapsableContentWithTitle>
      </EditorCard>
    </>
  );
};

export default OrderDetailBillingShippingInfo;
