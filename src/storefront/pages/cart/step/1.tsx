import ShippingInfoForm, {
  IShippingInfoFormProps,
  shippingInfoInitialData,
} from "@/components/Forms/ShippingInfoForm";
import { cartAPI } from "@/pages/api/cart/[token]";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";
import { IBillingInfo, IShippingInfo } from "@/types/cart";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ICartStep1PageProps {
  shippingInfo: any;
  billingInfo: any;
}

const CartStep1Page = ({ shippingInfo, billingInfo }: ICartStep1PageProps) => {
  /**
   * Step 1 page of the cart consist of the:
   * - shipping info
   * - billing info
   */

  const [validShippingInfo, setValidShippingInfo] = useState<boolean>(false);
  const [shippingInfoState, setShippingInfoState] =
    useState<IShippingInfoFormProps>({} as IShippingInfoFormProps);

  if (Object.keys(shippingInfoState)?.length === 0) {
    setShippingInfoState(
      shippingInfoInitialData(shippingInfo, setShippingInfoState)
    );
  }

  console.log("shippingInfoState", shippingInfoState);
  return (
    <div className="container">
      <ShippingInfoForm
        first_name={shippingInfoState.first_name}
        surname={shippingInfoState.surname}
        email={shippingInfoState.email}
        phone={shippingInfoState.phone}
        additional_info={shippingInfoState.additional_info}
        street={shippingInfoState.street}
        city={shippingInfoState.city}
        postal_code={shippingInfoState.postal_code}
        country={shippingInfoState.country}
        setIsFormValid={setValidShippingInfo}
      />
      Shipping is valid: {validShippingInfo ? "true" : "false"}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  /**
   * Fetch the cart from the API
   */

  const { req, res } = context;
  const { cartToken } = req.cookies;

  if (cartToken === undefined || cartToken === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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

  if (
    shippingInfo === undefined ||
    billingInfo === null ||
    billingInfo === undefined ||
    billingInfo === null
  ) {
    // if there's no cart, redirect to the homepage
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      shippingInfo,
      billingInfo,
    },
  };
};

export default CartStep1Page;
