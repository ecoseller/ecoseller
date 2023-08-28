// /dashboard/recommender-system

// layout
import DashboardLayout from "@/pages/dashboard/layout";
import { dashboardStatsAPI } from "@/pages/api/recommender-system/dashboard";
//react
import React, { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
import { NextApiRequest, NextApiResponse } from "next";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// components
import RecommenderConfigForm, {
  IRecommenderConfigEditableProps,
} from "@/components/Dashboard/Recommender/Configuration/RecommenderConfigForm";
import EditableContentWrapper from "@/components/Dashboard/Generic/EditableContentWrapper";
import { generalSnackbarError, useSnackbarState } from "@/utils/snackbar";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";
import ListOfModels, {
  IRecommenderModel,
} from "@/components/Dashboard/Recommender/Configuration/ListOfModels";
import { IEASEConfigEditableProps } from "@/components/Dashboard/Recommender/Configuration/EASEConfigForm";
import { IGRU4RecConfigEditableProps } from "@/components/Dashboard/Recommender/Configuration/GRU4RecConfigForm";
import CascadeConfig from "@/components/Dashboard/Recommender/Configuration/CascadeConfig";

interface IInfoItem {
  title: string;
  description: string;
}

export interface IInfo {
  [index: string]: IInfoItem;
}
export interface IRecommenderConfigProps {
  models: IRecommenderModel[];
  info: IInfo;
  retrievalSize: number;
  orderingSize: number;
  homepageRetrievalCascade: string[];
  homepageScoringCascade: string[];
  categoryListRetrievalCascade: null;
  categoryListScoringCascade: string[];
  productDetailRetrievalCascade: string[];
  productDetailScoringCascade: string[];
  cartRetrievalCascade: string[];
  cartScoringCascade: string[];
  easeConfig: IEASEConfigEditableProps;
  gru4recConfig: IGRU4RecConfigEditableProps;
}

interface IApiProps {
  models: IRecommenderModel[];
  config: IRecommenderConfigProps;
  info: IInfo;
}

const DashboardRecommenderSystemPage = ({
  models,
  info,
  retrievalSize,
  orderingSize,
  homepageRetrievalCascade,
  homepageScoringCascade,
  categoryListRetrievalCascade = null,
  categoryListScoringCascade,
  productDetailRetrievalCascade,
  productDetailScoringCascade,
  cartRetrievalCascade,
  cartScoringCascade,
  easeConfig,
  gru4recConfig,
}: IRecommenderConfigProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useSnackbarState();

  const [configState, setConfigState] = useState<IRecommenderConfigProps>({
    models,
    info,
    retrievalSize,
    orderingSize,
    homepageRetrievalCascade,
    homepageScoringCascade,
    categoryListRetrievalCascade,
    categoryListScoringCascade,
    productDetailRetrievalCascade,
    productDetailScoringCascade,
    cartRetrievalCascade,
    cartScoringCascade,
    easeConfig,
    gru4recConfig,
  });

  const cascades = {
    homepageRetrievalCascade,
    homepageScoringCascade,
    categoryListRetrievalCascade,
    categoryListScoringCascade,
    productDetailRetrievalCascade,
    productDetailScoringCascade,
    cartRetrievalCascade,
    cartScoringCascade,
  };

  const saveConfig = async () => {
    const modelsDisabled: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(configState.models)) {
      if (value.disabled) {
        modelsDisabled[key] = true;
      }
    }
    const data = { ...configState, modelsDisabled };
    return await fetch(`/api/recommender-system/config/save`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data: any) => {
        console.log("saveConfig", data);
        setPreventNavigation(false);
        setSnackbar({
          open: true,
          message: "Recommender system config updated",
          severity: "success",
        });
      })
      .catch((err: any) => {
        console.log("saveConfig", err);
        setSnackbar(generalSnackbarError);
      });
  };

  return (
    <DashboardLayout>
      <EditableContentWrapper
        preventNavigation={preventNavigation}
        setPreventNavigation={setPreventNavigation}
        onButtonClick={async () => {
          await saveConfig();
        }}
        returnPath={"/dashboard/recommender-system/configuration"}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <ListOfModels
                models={models}
                onChange={(models) => {
                  setPreventNavigation(true);
                  setConfigState((prevState) => {
                    return { ...prevState, models };
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <RecommenderConfigForm
                models={models}
                retrievalSize={retrievalSize}
                orderingSize={orderingSize}
                easeConfig={easeConfig}
                gru4recConfig={gru4recConfig}
                info={info}
                onChange={(data: IRecommenderConfigEditableProps) => {
                  setPreventNavigation(true);
                  setConfigState((prevState) => {
                    return {
                      ...prevState,
                      ...data,
                    };
                  });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CascadeConfig models={models} info={info} cascades={cascades} />
            </Grid>
          </Grid>
        </Container>
        {snackbar ? (
          <SnackbarWithAlert
            snackbarData={snackbar}
            setSnackbar={setSnackbar}
          />
        ) : null}
      </EditableContentWrapper>
    </DashboardLayout>
  );
};

DashboardRecommenderSystemPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const dateFrom = new Date(2023, 6, 1);
  const dateTo = new Date();

  const data: IApiProps = await dashboardStatsAPI(
    "GET",
    "configuration",
    dateFrom,
    dateTo,
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log("DATA", data);

  return {
    props: { ...data.config, info: data.info, models: data.models },
  };
};
export default DashboardRecommenderSystemPage;
