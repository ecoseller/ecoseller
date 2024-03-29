// next
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import getConfig from "next/config";

// react
import { useCallback, useEffect, useMemo, useState } from "react";
// utils
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// api
import { putBillingInfo, putShippingInfo } from "@/api/cart/info";
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
import CartStepper from "@/components/Cart/Stepper";
// mui
import {
  Box,
  Checkbox,
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
import { countryListAPI } from "@/pages/api/country";
import { ICountry } from "@/types/country";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { userBillingInfoAPI } from "@/pages/api/user/billing-info";
import { useUser } from "@/utils/context/user";
import { Check, CheckBox } from "@mui/icons-material";
import { useCountry } from "@/utils/context/country";
import { DEFAULT_COUNTRY } from "@/utils/defaults";

const { serverRuntimeConfig } = getConfig();

interface ICartStep1PageProps {
  shippingInfo: any;
  billingInfo: any;
  cartToken: string;
  countries: ICountry[];
}

const CartStep1Page = ({
  shippingInfo,
  billingInfo,
  cartToken,
  countries,
}: ICartStep1PageProps) => {
  /**
   * Step 1 page of the cart consist of the:
   * - shipping info
   * - billing info
   */
  const { t } = useTranslation("cart");

  const router = useRouter();
  const { user } = useUser();
  const { country } = useCountry();
  const countryCode = country?.code || DEFAULT_COUNTRY;

  const [shippingInfoChecked, setShippingInfoChecked] =
    useState<boolean>(false);
  const [validShippingInfo, setValidShippingInfo] = useState<boolean>(false);
  const [shippingInfoState, setShippingInfoState] =
    useState<IShippingInfoFormProps>({} as IShippingInfoFormProps);

  if (Object.keys(shippingInfoState)?.length === 0) {
    setShippingInfoState(
      shippingInfoInitialData(
        { ...shippingInfo, country: countryCode },
        setShippingInfoState,
        t
      )
    );
  }

  const [billingRadioSelect, setBillingRadioSelect] = useState<
    "SAMEASSHIPPING" | "NEW" | "PROFILE"
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
        billingInfoInitialData(
          { country: countryCode } as IBillingInfo,
          setBillingInfoState,
          t
        )
      );
    } else {
      setBillingRadioSelect("NEW");
      setBillingInfoState(
        billingInfoInitialData(
          { ...billingInfo, country: countryCode },
          setBillingInfoState,
          t
        )
      );
    }
  }

  console.log("billingRadioSelect", billingRadioSelect);

  const setBillingInfoFromProfile = async () => {
    if (user) {
      await fetch("/api/user/billing-info", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: any) => {
          if (data != null || data != undefined) {
            setBillingRadioSelect("PROFILE");
            setBillingInfoState(
              billingInfoInitialData(
                { ...data, country: countryCode },
                setBillingInfoState,
                t
              )
            );
          }
        });
    }
  };

  const setShippingInfoFromProfile = async () => {
    if (user) {
      await fetch("/api/user/shipping-info", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: any) => {
          if (data != null || data != undefined) {
            setShippingInfoState(
              shippingInfoInitialData(
                { ...data, country: countryCode },
                setShippingInfoState,
                t
              )
            );
          }
        });
    }
  };

  const clearBillingInfo = async () => {
    setBillingInfoState(
      billingInfoInitialData(
        {
          first_name: "",
          surname: "",
          street: "",
          city: "",
          postal_code: "",
          country: countryCode,
          company_name: "",
          company_id: "",
          vat_number: "",
        } as IBillingInfo,
        setBillingInfoState,
        t // useTranslation
      )
    );
  };

  const clearShippingInfo = async () => {
    setShippingInfoState(
      shippingInfoInitialData(
        {
          first_name: "",
          surname: "",
          street: "",
          city: "",
          postal_code: "",
          country: countryCode,
        } as IShippingInfo,
        setShippingInfoState,
        t // useTranslation
      )
    );
  };

  const handleChangeShippingInfoCheck = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingInfoChecked(event.target.checked);
    if (event.target.checked) {
      await setShippingInfoFromProfile();
    } else {
      await clearShippingInfo();
    }
  };

  const submitForm = async () => {
    if (
      !validShippingInfo ||
      (!validBillingInfo && billingRadioSelect === "NEW")
    ) {
      return;
    }
    // Shipping info
    const exportedShipping = exportShippingInfo(shippingInfoState);
    const shippingInfoResp = await putShippingInfo(cartToken, exportedShipping);

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
      billingInfoResp = await putBillingInfo(cartToken, billingSameAsShipping);
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
  };

  console.log("shippingInfoState", shippingInfoState);
  return (
    <div className="container">
      <CartStepper activeStep={1} />
      <Grid
        container
        spacing={{ xs: 0, md: 4, lg: 4 }}
        columns={{ xs: 10, sm: 10, md: 12 }}
        pt={4}
      >
        <Grid container item xs={10} sm={10} md={5} direction="column">
          <div className="shipping-info-form">
            <h2>
              {t("shipping-information-title") /* Shipping information */}
            </h2>
            {user && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shippingInfoChecked}
                    onChange={handleChangeShippingInfoCheck}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={t("shipping-information-use-profile-billing-info-label")}
              />
            )}
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
              countryOptions={countries?.map((country) => ({
                code: country.code,
                name: country.name,
              }))}
            />
          </div>
        </Grid>
        <Grid container item xs={10} sm={10} md={5} direction="column" pt={4}>
          <div className="billing-info-form">
            <h2>{t("billing-information-title") /* Billing information */}</h2>
            <FormControl>
              <RadioGroup
                defaultValue="SAMEASSHIPPING"
                value={billingRadioSelect}
                name="radio-buttons-billing-info-group"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setBillingRadioSelect(
                    event.target.value as "SAMEASSHIPPING" | "NEW" | "PROFILE"
                  );
                }}
              >
                <FormControlLabel
                  value="SAMEASSHIPPING"
                  control={<Radio />}
                  label={
                    t("same-as-shipping-info-label") /*"Same as shipping info"*/
                  }
                />
                <FormControlLabel
                  value="NEW"
                  control={<Radio />}
                  label={t("new-billing-info-label") /*"New billing info"*/}
                  onClick={clearBillingInfo}
                />
                {user && (
                  <FormControlLabel
                    value="PROFILE"
                    control={<Radio />}
                    label={
                      t(
                        "billing-information-use-profile-info-label"
                      ) /*"Use profile info"*/
                    }
                    onClick={setBillingInfoFromProfile}
                  />
                )}
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
                radioType={billingRadioSelect}
                countryOptions={countries?.map((country) => ({
                  code: country.code,
                  name: country.name,
                }))}
              />
            )}
          </div>
        </Grid>
      </Grid>
      <CartButtonRow
        prev={{
          title: t("back-to-cart") /*"Back to cart"*/,
          onClick: () => {
            router.push("/cart");
          },
          disabled: false,
        }}
        next={{
          title: t("next"),
          onClick: async () => submitForm(),
          disabled:
            !validShippingInfo ||
            (!validBillingInfo && billingRadioSelect === "NEW"),
        }}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  /**
   * Fetch the cart from the API
   */

  const { req, res, locale } = context;
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

  // get countries
  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      shippingInfo,
      billingInfo,
      cartToken,
      countries,
      ...(await serverSideTranslations(locale as string, [
        "cart",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default CartStep1Page;
