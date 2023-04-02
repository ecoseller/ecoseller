// /dashboard/catalog/products-types
// next.js
// libraries
import useSWR from "swr";
// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
import ProductTypeGeneralInformation from "@/components/Dashboard/Catalog/ProducType/ProductTypeGeneralInformation";
import ProductTypeAllowedAttribtuesSelect from "@/components/Dashboard/Catalog/ProducType/ProductTypeAllowedAttribtuesSelect";
// mui
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// types
import { putProductType } from "@/api/product/types";
import { IAttributeType, IBaseAttributes, IProductType } from "@/types/product";
// api
import { axiosPrivate } from "@/utils/axiosPrivate";

interface IProps {
  productType: IProductType;
  attributesData: IAttributeType[];
}

const DashboardProductTypeDetailPage = ({
  productType,
  attributesData,
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
          <DashboardContentWithSaveFooter
            primaryButtonTitle={productType ? "Save" : "Create"} // To distinguish between create and update actions
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onSave={async () => {
              await putProductType(state)
                .then((res: any) => {
                  setSnackbar({
                    open: true,
                    message: "Product type updated",
                    severity: "success",
                  });
                })
                .catch((err: any) => {
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
          </DashboardContentWithSaveFooter>
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

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  const productTypeRes = await axiosPrivate.get(
    `/product/dashboard/type/${id}/`
  );
  const productType = productTypeRes.data;

  const attributesRes = await axiosPrivate.get(
    `/product/dashboard/attribute/type/`
  );
  const attributesData = attributesRes.data;
  console.log("attributes", attributesData);

  return {
    props: {
      productType,
      attributesData,
    },
  };
};

export default DashboardProductTypeDetailPage;