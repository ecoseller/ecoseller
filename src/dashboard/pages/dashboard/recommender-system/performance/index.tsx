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
import Information from "@/components/Dashboard/Recommender/Performance/Information";
import GeneralPerformance, {
  IGeneralPerformanceProps,
} from "@/components/Dashboard/Recommender/Performance/GeneralPerformance";
import ModelSpecificPerformance, {
  IPerformanceDataModelProps,
} from "@/components/Dashboard/Recommender/Performance/ModelSpecificPerformance";
import { IRecommenderModel } from "@/components/Dashboard/Recommender/Configuration/ListOfModels";
import { IInfo } from "@/pages/dashboard/recommender-system/configuration";

interface IPerformance {
  general: IGeneralPerformanceProps;
  modelSpecific: IPerformanceDataModelProps;
}

interface IRecommenderPerformanceProps {
  models: IRecommenderModel[];
  performance: IPerformance;
  info: IInfo;
}

const DashboardRecommenderSystemPerformancePage = ({
  models,
  performance,
  info,
}: IRecommenderPerformanceProps) => {
  const [performanceState, setPerformanceState] = useState<any>(performance);

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} textAlign={"center"}>
            <DateTimeRangePicker
              onChange={async (dateFrom, dateTo) => {
                const data = await dashboardStatsAPI(
                  "GET",
                  "performance",
                  dateFrom,
                  dateTo
                );
                setPerformanceState(data.performance);
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Information k={performance.general.k} info={info} />
          </Grid>

          <Grid item xs={12} md={6}>
            <GeneralPerformance {...performanceState.general} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ModelSpecificPerformance
              models={models}
              data={performanceState.modelSpecific}
            />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

DashboardRecommenderSystemPerformancePage.getLayout = (page: ReactElement) => {
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

  const data: IRecommenderPerformanceProps = await dashboardStatsAPI(
    "GET",
    "performance",
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

export default DashboardRecommenderSystemPerformancePage;
