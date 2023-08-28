// /dashboard/orders/shipping-method/[id].tsx
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
import { shippingMethodDetailAPI } from "@/pages/api/cart/shipping-method/[id]";
import {
  ActionSetShippingMethod,
  IPaymentMethodCountryFullList,
  ISetShippingMethodStateData,
  IShippingMethod,
  IShippingMethodCountry,
} from "@/types/cart/methods";
import Grid from "@mui/material/Grid";
import TranslatedFieldsTabList from "@/components/Dashboard/Generic/TranslatedFieldsTabList";
import { IEntityTranslations } from "@/types/common";
import { IDispatchWrapper } from "@/components/Dashboard/Common/IDispatchWrapper";
import ShippingPaymentMethodImageUploader from "@/components/Dashboard/Cart/Methods/ImageUploader";
import { currencyListAPI } from "@/pages/api/country/currency";
import { shippingMethodCountryListAPI } from "@/pages/api/cart/shipping-method/[id]/country";
import ShippingMethodCountryEditor from "@/components/Dashboard/Cart/Methods/Shipping/ShippingMethodCountryEditor";
import { ICurrency } from "@/types/localization";
import { paymentMethodCountryFullListAPI } from "@/pages/api/cart/payment-method/country";
import { useSnackbarState } from "@/utils/snackbar";
import { PermissionProvider } from "@/utils/context/permission";

export interface ISetShippingMethodStateAction {
  type: ActionSetShippingMethod;
  payload: ISetShippingMethodStateData;
}

interface IProps {
  shippingMethod: IShippingMethod;
  shippingMethodCountries: IShippingMethodCountry[];
  vatGroups: IVatGroup[];
  countries: ICountry[];
  currencies: ICurrency[];
  paymentMethodCountryFullList: IPaymentMethodCountryFullList[];
}

const DashboardShippingMethodDetailPage = ({
  shippingMethod,
  shippingMethodCountries,
  vatGroups,
  countries,
  currencies,
  paymentMethodCountryFullList,
}: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const setShippingMethodStateReducer = (
    state: ISetShippingMethodStateData,
    action: ISetShippingMethodStateAction
  ): ISetShippingMethodStateData => {
    setPreventNavigation(true);
    switch (action.type) {
      case ActionSetShippingMethod.SETINITIAL:
        if (!action.payload) {
          return state;
        }
        if (!action.payload.id) {
          return state;
        }
        return action.payload as ISetShippingMethodStateData;
      case ActionSetShippingMethod.SETPUBLISHED:
        return { ...state, is_published: action.payload.is_published };
      case ActionSetShippingMethod.SETTRANSLATION:
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

  const [shippingMethodState, dispatchShippingMethodState] = useReducer(
    setShippingMethodStateReducer,
    shippingMethod
      ? shippingMethod
      : {
          id: undefined,
          translations: {},
          is_published: false,
        }
  );

  const [snackbar, setSnackbar] = useSnackbarState();

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  console.log("shippingMethod", shippingMethod, shippingMethodState);

  useEffect(() => {
    if (!preventNavigation) {
      setPreventNavigation(true);
    }
  }, [shippingMethodState]);

  const dispatchWrapperTranslation: IDispatchWrapper = {
    setDescriptionPlain(language: string, description: string): void {
      dispatchShippingMethodState({
        type: ActionSetShippingMethod.SETTRANSLATION,
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
      dispatchShippingMethodState({
        type: ActionSetShippingMethod.SETTRANSLATION,
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
      dispatchShippingMethodState({
        type: ActionSetShippingMethod.SETPUBLISHED,
        payload: {
          is_published,
        },
      });
    },
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Stack>
          <EditableContentWrapper
            primaryButtonTitle={
              shippingMethod
                ? PrimaryButtonAction.Save
                : PrimaryButtonAction.Create
            } // To distinguish between create and update actions
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onButtonClick={async () => {
              const { ["image"]: image, ...shippingMethodStateNoImage } =
                shippingMethodState;

              console.log(
                "shippingMethodState",
                JSON.stringify(shippingMethodStateNoImage)
              );
              fetch(`/api/cart/shipping-method/${shippingMethodState.id}`, {
                method: "PUT",
                body: JSON.stringify(shippingMethodStateNoImage),
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
            returnPath={"/dashboard/cart/shipping-method"}
          >
            <TopLineWithReturn
              title={`Edit shipping method ${shippingMethodState?.id}`}
              returnPath={"/dashboard/cart/shipping-method"}
            />
            <Grid container spacing={2}>
              <Grid item md={8} xs={12}>
                <TranslatedFieldsTabList
                  state={
                    shippingMethodState.translations ||
                    ({} as IEntityTranslations)
                  }
                  dispatchWrapper={dispatchWrapperTranslation}
                />
                <ShippingMethodCountryEditor
                  countries={countries}
                  shippingMethod={shippingMethod}
                  vatGroups={vatGroups}
                  shippingMethodCountries={shippingMethodCountries}
                  currencies={currencies}
                  paymentMethodCountryFullList={paymentMethodCountryFullList}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <ShippingPaymentMethodImageUploader
                  state={shippingMethodState}
                  uploadPath="/api/cart/shipping-method/"
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

DashboardShippingMethodDetailPage.getLayout = (page: ReactElement) => {
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

  const shippingMethod = await shippingMethodDetailAPI(
    "GET",
    Number(id),
    req as NextApiRequest,
    res as NextApiResponse
  );

  const shippingMethodCountries = await shippingMethodCountryListAPI(
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

  const paymentMethodCountryFullList = await paymentMethodCountryFullListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      shippingMethod,
      shippingMethodCountries,
      vatGroups,
      countries,
      currencies,
      paymentMethodCountryFullList,
    },
  };
};

export default DashboardShippingMethodDetailPage;
