import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";
import {
  IBillingInfo,
  IPaymentMethodCountry,
  IShippingInfo,
  IShippingMethodCountry,
} from "@/types/cart";
import { countryListAPI } from "@/pages/api/country";
import { ICountry } from "@/types/country";
import { cartPaymentMethodAPI } from "@/pages/api/cart/[token]/payment-method";
import { cartShippingMethodAPI } from "@/pages/api/cart/[token]/shipping-method";
import CartOrderSummary from "@/components/Cart/CartOrderSummary";
import { IOrderWithPayment } from "@/types/order";
import { orderDetailAPI } from "@/pages/api/order/[id]";

const { serverRuntimeConfig } = getConfig();

interface ICartSummaryPageProps {
  orderWithPayment: IOrderWithPayment;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countries: ICountry[];
  selectedPaymentMethod: IPaymentMethodCountry;
  selectedShippingMethod: IShippingMethodCountry;
}

/**
 * Cart summary page displaying all the items, addresses and shipping & payment method
 */
const OrderDetailPage = ({
  orderWithPayment,
  billingInfo,
  shippingInfo,
  countries,
  selectedPaymentMethod,
  selectedShippingMethod,
}: ICartSummaryPageProps) => {
  const order = orderWithPayment.order;

  return (
    <div className="container">
      <CartOrderSummary
        cart={order.cart}
        billingInfo={billingInfo}
        shippingInfo={shippingInfo}
        countries={countries}
        selectedPaymentMethod={selectedPaymentMethod}
        selectedShippingMethod={selectedShippingMethod}
        creatingNewOrder={false}
      />
    </div>
  );
};

/**
 * Fetch the cart from the API
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, locale } = context;
  const { orderId } = context.query;

  const order: IOrderWithPayment = await orderDetailAPI(
    "GET",
    orderId?.toString() || "",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const cartToken = order.order.cart.token;

  const shippingInfo = await cartShippingInfoAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const billingInfo = await cartBillingInfoAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const selectedPaymentMethod = await cartPaymentMethodAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const selectedShippingMethod = await cartShippingMethodAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      orderWithPayment: order,
      billingInfo,
      shippingInfo,
      countries,
      selectedPaymentMethod,
      selectedShippingMethod,
      ...(await serverSideTranslations(locale as string, [
        "cart",
        "order",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default OrderDetailPage;
