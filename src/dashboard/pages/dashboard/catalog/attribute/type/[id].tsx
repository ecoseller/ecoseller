// /dashboard/catalog/attribute/type/[id].tsx
// next.js
// libraries
// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
// mui
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// types
import { IAttributeType, IBaseAttribute } from "@/types/product";
// api
import { axiosPrivate } from "@/utils/axiosPrivate";
import { GetServerSideProps } from "next";
import { putAttributeType } from "@/api/product/attributes";
import AttributeTypeGeneralInformation from "@/components/Dashboard/Catalog/AttributeType/AttributeTypeGeneralInformation";
import BaseAttributeGrid from "@/components/Dashboard/Catalog/BaseAttribute/BaseAttributeGrid";
import DeleteAttributeType from "@/components/Dashboard/Catalog/AttributeType/DeleteAttributeType";

interface IProps {
  attributeType: IAttributeType;
}

const DashboardAttributeTypeDetailPage = ({ attributeType }: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [state, setState] = useState<IAttributeType>(attributeType);

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

  console.log("attributeType", attributeType);

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
            primaryButtonTitle={attributeType ? "Save" : "Create"} // To distinguish between create and update actions
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onSave={async () => {
              await putAttributeType(state)
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
            returnPath={"/dashboard/catalog/attribute/type"}
          >
            <TopLineWithReturn
              title={`Edit attribute type`}
              returnPath={"/dashboard/catalog/attribute/type"}
            />
            <AttributeTypeGeneralInformation
              state={state}
              setState={(v: IAttributeType) => setState(v)}
            />
            <BaseAttributeGrid
              attributeTypeId={state.id}
              baseAttributes={state?.base_attributes}
              setState={(v: IBaseAttribute[]) =>
                setState({
                  ...state,
                  base_attributes: v,
                })
              }
            />
            {state.id ? <DeleteAttributeType id={state.id} /> : null}
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

DashboardAttributeTypeDetailPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  const id = params?.id;

  const attributeTypeRequest = await axiosPrivate.get(
    `/product/dashboard/attribute/type/${id}/`
  );
  const attributeType = attributeTypeRequest.data;

  return {
    props: {
      attributeType,
    },
  };
};

export default DashboardAttributeTypeDetailPage;
