// next
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";

// react
import { useCallback, useEffect, useMemo, useState } from "react";

// api
import { putBillingInfo, putShippingInfo } from "@/api/cart/info";
import { cartAPI } from "@/pages/api/cart/[token]";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";

// components
import BillingInfoForm, {
  IBillingInfoFormProps,
  billingInfoInitialData,
  exportBillingInfo,
} from "@/components/Forms/BillingInfoForm";
import ShippingInfoForm, {
  IShippingInfoFormProps,
  exportShippingInfo,
  shippingInfoInitialData,
} from "@/components/Forms/ShippingInfoForm";
// mui
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// types
import { IBillingInfo, IShippingInfo } from "@/types/cart";

interface ICartStep1PageProps {
  shippingInfo: any;
  billingInfo: any;
  cartToken: string;
}

const CartStep1Page = ({
  shippingInfo,
  billingInfo,
  cartToken,
}: ICartStep1PageProps) => {
  /**
   * Step 1 page of the cart consist of the:
   * - shipping info
   * - billing info
   */

  const router = useRouter();
  const [validShippingInfo, setValidShippingInfo] = useState<boolean>(false);
  const [shippingInfoState, setShippingInfoState] =
    useState<IShippingInfoFormProps>({} as IShippingInfoFormProps);

  if (Object.keys(shippingInfoState)?.length === 0) {
    setShippingInfoState(
      shippingInfoInitialData(shippingInfo, setShippingInfoState)
    );
  }

  const [billingRadioSelect, setBillingRadioSelect] = useState<
    "SAMEASSHIPPING" | "NEW"
  >("SAMEASSHIPPING");
  const [validBillingInfo, setValidBillingInfo] = useState<boolean>(false);
  const [billingInfoState, setBillingInfoState] =
    useState<IBillingInfoFormProps>({} as IBillingInfoFormProps);

  if (Object.keys(billingInfoState)?.length === 0) {
    // on first load check if the billing info is the same as the shipping info
    if (
      shippingInfo.first_name === billingInfo.first_name &&
      shippingInfo.surname === billingInfo.surname &&
      shippingInfo.street === billingInfo.street &&
      shippingInfo.city === billingInfo.city &&
      shippingInfo.postal_code === billingInfo.postal_code &&
      shippingInfo.country === billingInfo.country &&
      !billingInfo.company_name &&
      !billingInfo.company_id &&
      !billingInfo.vat_number
    ) {
      setBillingRadioSelect("SAMEASSHIPPING");
      setBillingInfoState(
        billingInfoInitialData({} as IBillingInfo, setBillingInfoState)
      );
    } else {
      setBillingRadioSelect("NEW");
      setBillingInfoState(
        billingInfoInitialData(billingInfo, setBillingInfoState)
      );
    }
  }

  console.log("shippingInfoState", shippingInfoState);
  return (
    <div className="container">
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid container item xs={2} sm={4} md={4} direction="column">
          <div className="shipping-info-form">
            <h2>Shipping information</h2>
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
          </div>
          Shipping is valid: {validShippingInfo ? "true" : "false"}
        </Grid>
        <Grid container item xs={2} sm={4} md={4} direction="column">
          <div className="billing-info-form">
            <h2>Billing information</h2>
            <FormControl>
              <RadioGroup
                defaultValue="SAMEASSHIPPING"
                value={billingRadioSelect}
                name="radio-buttons-billing-info-group"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setBillingRadioSelect(
                    event.target.value as "SAMEASSHIPPING" | "NEW"
                  );
                }}
              >
                <FormControlLabel
                  value="SAMEASSHIPPING"
                  control={<Radio />}
                  label="Same as shipping info"
                />
                <FormControlLabel
                  value="NEW"
                  control={<Radio />}
                  label="New billing info"
                />
              </RadioGroup>
            </FormControl>

            {billingRadioSelect === "SAMEASSHIPPING" ? null : (
              <BillingInfoForm
                first_name={billingInfoState.first_name}
                surname={billingInfoState.surname}
                company_name={billingInfoState.company_name}
                company_id={billingInfoState.company_id}
                vat_number={billingInfoState.vat_number}
                street={billingInfoState.street}
                city={billingInfoState.city}
                postal_code={billingInfoState.postal_code}
                country={billingInfoState.country}
                setIsFormValid={setValidBillingInfo}
              />
            )}
          </div>
          Billing is valid: {validBillingInfo ? "true" : "false"}
        </Grid>
      </Grid>
      <Typography
        variant="h4"
        onClick={() => {
          router.push("/cart");
        }}
      >
        Back to cart
      </Typography>
      <Button
        variant={"contained"}
        disabled={
          !validShippingInfo ||
          (!validBillingInfo && billingRadioSelect === "NEW")
        }
        onClick={async () => {
          if (
            !validShippingInfo ||
            (!validBillingInfo && billingRadioSelect === "NEW")
          ) {
            return;
          }
          // Shipping info
          const exportedShipping = exportShippingInfo(shippingInfoState);
          const shippingInfoResp = await putShippingInfo(
            cartToken,
            exportedShipping
          );

          // Billing info
          let billingInfoResp;
          if (billingRadioSelect === "SAMEASSHIPPING") {
            const billingSameAsShipping = {
              first_name: exportedShipping.first_name,
              surname: exportedShipping.surname,
              street: exportedShipping.street,
              city: exportedShipping.city,
              postal_code: exportedShipping.postal_code,
              country: exportedShipping.country,
              company_name: "",
              company_id: "",
              vat_number: "",
            };
            console.log("billingSameAsShipping", billingSameAsShipping);
            billingInfoResp = await putBillingInfo(
              cartToken,
              billingSameAsShipping
            );
          } else {
            billingInfoResp = await putBillingInfo(
              cartToken,
              exportBillingInfo(billingInfoState)
            );
          }
          console.log("shippingInfoResp", shippingInfoResp);
          console.log("billingInfoResp", billingInfoResp);
          if (shippingInfoResp === 201 && billingInfoResp === 201) {
            router.push("/cart/step/2");
          }
        }}
      >
        Next
      </Button>
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
      cartToken,
    },
  };
};

export default CartStep1Page;
