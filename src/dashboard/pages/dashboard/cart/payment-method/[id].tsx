// /dashboard/orders/payment-method/[id].tsx
// next.js
// libraries
// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement, useEffect, useReducer, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
// mui
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// types
import { ICountry, IVatGroup } from "@/types/country";
// api
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { countryListAPI } from "@/pages/api/country";
import { vatGroupAPI } from "@/pages/api/country/vat-group";
import { paymentMethodDetailAPI } from "@/pages/api/cart/payment-method/[id]";
import {
  ActionSetPaymentMethod,
  ISetPaymentMethodStateData,
  IPaymentMethod,
  IPaymentMethodCountry,
} from "@/types/cart/methods";
import Grid from "@mui/material/Grid";
import TranslatedFieldsTabList from "@/components/Dashboard/Generic/TranslatedFieldsTabList";
import { IEntityTranslations } from "@/types/common";
import { IDispatchWrapper } from "@/components/Dashboard/Common/IDispatchWrapper";
import ShippingPaymentMethodImageUploader from "@/components/Dashboard/Cart/Methods/ImageUploader";
import PaymentMethodCountryEditor from "@/components/Dashboard/Cart/Methods/Payment/PaymentMethodCountryEditor";
import { currencyListAPI } from "@/pages/api/country/currency";
import { paymentMethodCountryListAPI } from "@/pages/api/cart/payment-method/[id]/country";
import { ICurrency } from "@/types/localization";

export interface ISetPaymentMethodStateAction {
  type: ActionSetPaymentMethod;
  payload: ISetPaymentMethodStateData;
}

interface IProps {
  paymentMethod: IPaymentMethod;
  paymentMethodCountries: IPaymentMethodCountry[];
  vatGroups: IVatGroup[];
  countries: ICountry[];
  currencies: ICurrency[];
}

const DashboardPaymentMethodDetailPage = ({
  paymentMethod,
  paymentMethodCountries,
  vatGroups,
  countries,
  currencies,
}: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const setPaymentMethodStateReducer = (
    state: ISetPaymentMethodStateData,
    action: ISetPaymentMethodStateAction
  ): ISetPaymentMethodStateData => {
    setPreventNavigation(true);
    switch (action.type) {
      case ActionSetPaymentMethod.SETINITIAL:
        if (!action.payload) {
          return state;
        }
        if (!action.payload.id) {
          return state;
        }
        return action.payload as ISetPaymentMethodStateData;
      case ActionSetPaymentMethod.SETPUBLISHED:
        return { ...state, is_published: action.payload.is_published };
      case ActionSetPaymentMethod.SETTRANSLATION:
        console.log("action.payload.translation", action.payload.translation);
        if (!action.payload.translation) {
          return state;
        }
        return {
          ...state,
          translations: {
            ...state.translations,
            [action.payload.translation.language]:
              state.translations &&
              action.payload.translation.language in state.translations
                ? {
                    ...state.translations[action.payload.translation.language],
                    ...action.payload.translation.data,
                  }
                : action.payload.translation.data,
          },
        };
      default:
        return state;
    }
  };

  const [paymentMethodState, dispatchPaymentMethodState] = useReducer(
    setPaymentMethodStateReducer,
    paymentMethod
      ? paymentMethod
      : {
          id: undefined,
          translations: {},
          is_published: false,
          // image: undefined,
        }
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  console.log("paymentMethod", paymentMethod, paymentMethodState);

  useEffect(() => {
    if (!preventNavigation) {
      setPreventNavigation(true);
    }
  }, [paymentMethodState]);

  const dispatchWrapperTranslation: IDispatchWrapper = {
    setDescriptionPlain(language: string, description: string): void {
      dispatchPaymentMethodState({
        type: ActionSetPaymentMethod.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              description: description,
            },
          },
        },
      });
    },
    setTitle(language: string, title: string): void {
      dispatchPaymentMethodState({
        type: ActionSetPaymentMethod.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              title: title,
            },
          },
        },
      });
    },
  };

  const dispatchGeneralInformation = {
    setPublished(is_published: boolean): void {
      dispatchPaymentMethodState({
        type: ActionSetPaymentMethod.SETPUBLISHED,
        payload: {
          is_published,
        },
      });
    },
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Stack>
          <EditableContentWrapper
            primaryButtonTitle={
              paymentMethod
                ? PrimaryButtonAction.Save
                : PrimaryButtonAction.Create
            } // To distinguish between create and update actions
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onButtonClick={async () => {
              const { ["image"]: image, ...paymentMethodStateNoImage } =
                paymentMethodState;

              console.log(
                "paymentMethodState",
                JSON.stringify(paymentMethodStateNoImage)
              );
              fetch(`/api/cart/payment-method/${paymentMethodState.id}`, {
                method: "PUT",
                body: JSON.stringify(paymentMethodStateNoImage),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  if (res.status !== 200) {
                    throw new Error(res.statusText);
                  }

                  return res.json();
                })
                .then((data) => {
                  setSnackbar({
                    open: true,
                    message: "Shipping method updated",
                    severity: "success",
                  });
                })
                .catch((err) => {
                  console.log("Shipping Method put", err);
                  setSnackbar({
                    open: true,
                    message: "Something went wrong",
                    severity: "error",
                  });
                });

              setPreventNavigation(false);
            }}
            returnPath={"/dashboard/cart/payment-method"}
          >
            <TopLineWithReturn
              title={`Edit payment method ${paymentMethodState?.id}`}
              returnPath={"/dashboard/cart/payment-method"}
            />
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <TranslatedFieldsTabList
                  state={
                    paymentMethodState.translations ||
                    ({} as IEntityTranslations)
                  }
                  dispatchWrapper={dispatchWrapperTranslation}
                />
                <PaymentMethodCountryEditor
                  countries={countries}
                  paymentMethod={paymentMethod}
                  vatGroups={vatGroups}
                  paymentMethodCountries={paymentMethodCountries}
                  currencies={currencies}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <ShippingPaymentMethodImageUploader
                  state={paymentMethodState}
                  uploadPath="/api/cart/payment-method/"
                />
              </Grid>
            </Grid>
            {snackbar ? (
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbar.severity}
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            ) : null}
          </EditableContentWrapper>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

DashboardPaymentMethodDetailPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  const id = params?.id;

  const { req, res } = context;

  const paymentMethod = await paymentMethodDetailAPI(
    "GET",
    Number(id),
    req as NextApiRequest,
    res as NextApiResponse
  );

  const paymentMethodCountries = await paymentMethodCountryListAPI(
    "GET",
    Number(id),
    req as NextApiRequest,
    res as NextApiResponse
  );

  const vatGroups = await vatGroupAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const currencies = await currencyListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      paymentMethod,
      paymentMethodCountries,
      vatGroups,
      countries,
      currencies,
    },
  };
};

export default DashboardPaymentMethodDetailPage;
