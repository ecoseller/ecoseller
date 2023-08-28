// /dashboard/recommender-system

// layout
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { dashboardStatsAPI } from "@/pages/api/recommender-system/dashboard";
//react
import React, { ReactElement, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// components
import DateTimeRangePicker from "@/components/Dashboard/Recommender/DateTimeRangePicker";
import { IRecommenderModel } from "@/components/Dashboard/Recommender/Configuration/ListOfModels";
import GeneralTraining, {
  IGeneralTrainingProps,
} from "@/components/Dashboard/Recommender/Training/GeneralTraining";
import ModelSpecificTraining, {
  ITrainingDataModelProps,
} from "@/components/Dashboard/Recommender/Training/ModelSpecificTraining";

/*
Layout:
  TODO
*/

interface ITraining {
  general: IGeneralTrainingProps;
  modelSpecific: ITrainingDataModelProps;
}

interface IRecommenderTrainingProps {
  models: IRecommenderModel[];
  training: ITraining;
}

const DashboardRecommenderSystemTrainingPage = ({
  models,
  training,
}: IRecommenderTrainingProps) => {
  const [trainingState, setTrainingState] = useState<any>(training);

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} textAlign={"center"}>
            <DateTimeRangePicker
              onChange={async (dateFrom, dateTo) => {
                const data = await dashboardStatsAPI(
                  "GET",
                  "training",
                  dateFrom,
                  dateTo
                );
                setTrainingState(data.training);
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} />

          <Grid item xs={12} md={6}>
            <GeneralTraining {...trainingState.general} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ModelSpecificTraining
              models={models}
              data={trainingState.modelSpecific}
            />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

DashboardRecommenderSystemTrainingPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const dateFrom = new Date(Date.now() - 7 * 86400 * 1000);
  const dateTo = new Date();

  const data: IRecommenderTrainingProps = await dashboardStatsAPI(
    "GET",
    "training",
    dateFrom,
    dateTo,
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log("DATA", data);

  return {
    props: data,
  };
};

export default DashboardRecommenderSystemTrainingPage;
