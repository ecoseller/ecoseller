// /dashboard/catalog/products-types
// next.js
// libraries
// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import ProductTypeGeneralInformation from "@/components/Dashboard/Catalog/ProducType/ProductTypeGeneralInformation";
import ProductTypeAllowedAttribtuesSelect from "@/components/Dashboard/Catalog/ProducType/ProductTypeAllowedAttribtuesSelect";
// mui
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// types
import { putProductType } from "@/api/product/types";
import { IAttributeType, IProductType } from "@/types/product";
import { ICountry } from "@/types/country";
// api
import { axiosPrivate } from "@/utils/axiosPrivate";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import ProductTypeVatGroup from "@/components/Dashboard/Catalog/ProducType/ProductTypeVatGroup";
import { countryListAPI } from "@/pages/api/country";
import { NextRequest } from "next/server";
import { productAttributeTypeAPI } from "@/pages/api/product/attribute/type";
import { productTypeDetailAPI } from "@/pages/api/product/type/[id]";

interface IProps {
  productType: IProductType;
  attributesData: IAttributeType[];
  countries: ICountry[];
}

const DashboardProductTypeDetailPage = ({
  productType,
  attributesData,
  countries,
}: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [state, setState] = useState<IProductType>(productType);

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

  console.log("productType", productType);

  useEffect(() => {
    if (!preventNavigation) {
      setPreventNavigation(true);
    }
  }, [state]);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Stack>
          <EditableContentWrapper
            primaryButtonTitle={
              productType
                ? PrimaryButtonAction.Save
                : PrimaryButtonAction.Create
            } // To distinguish between create and update actions
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onButtonClick={async () => {
              fetch(`/api/product/type/${state.id}`, {
                method: "PUT",
                body: JSON.stringify(state),
              })
                .then((res) => res.json())
                .then((res) => {
                  console.log("res", res);
                  setSnackbar({
                    open: true,
                    message: "Product type updated",
                    severity: "success",
                  });
                })
                .catch((err) => {
                  console.log("postProduct", err);
                  setSnackbar({
                    open: true,
                    message: "Something went wrong",
                    severity: "error",
                  });
                });

              setPreventNavigation(false);
            }}
            returnPath={"/dashboard/catalog/product-types"}
          >
            <TopLineWithReturn
              title={`Edit product type`}
              returnPath={"/dashboard/catalog/product-types"}
            />
            <ProductTypeGeneralInformation
              state={state}
              setState={(v: IProductType) => setState(v)}
            />
            <ProductTypeAllowedAttribtuesSelect
              state={state}
              setState={(v: IProductType) => setState(v)}
              attributeTypes={attributesData}
            />
            <ProductTypeVatGroup
              state={state}
              setState={(v: IProductType) => setState(v)}
              countries={countries}
            />

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

DashboardProductTypeDetailPage.getLayout = (page: ReactElement) => {
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

  const productType = await productTypeDetailAPI(
    "GET",
    Number(id),
    req as NextApiRequest,
    res as NextApiResponse
  );

  const attributesData = await productAttributeTypeAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      productType,
      attributesData,
      countries,
    },
  };
};

export default DashboardProductTypeDetailPage;
