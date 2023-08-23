// /dashboard/recommender-system

// layout
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { dashboardStatsAPI } from "@/pages/api/recommender-system/dashboard";
import { IRecommenderSystemProps } from "@/pages/dashboard/recommender-system";
//react
import React, { ReactElement, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// components
import DateTimeRangePicker from "@/components/Dashboard/Recommender/DateTimeRangePicker";
import Container from "@mui/material/Container";

/*
Layout:
  TODO
*/

interface IRecommenderPerformanceProps {
  performance: any;
  // k: number;
  // item: IStatisticsItemProps;
  // models: IModelPerformanceProps[];
}

const DashboardRecommenderSystemPerformancePage = ({
  performance,
}: IRecommenderPerformanceProps) => {
  const [performanceState, setPerformanceState] = useState<any>(performance);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} textAlign={"center"}>
            <DateTimeRangePicker
              onChange={async (dateFrom, dateTo) => {
                const data = await dashboardStatsAPI("GET", dateFrom, dateTo);
                setPerformanceState(data.performance);
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} />

          <Grid item xs={12} md={6}>
            <Typography>{JSON.stringify(performanceState)}</Typography>
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

  const data: IRecommenderSystemProps = await dashboardStatsAPI(
    "GET",
    dateFrom,
    dateTo,
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log("DATA", data);

  return {
    props: { performance: data.performance },
  };
};

export default DashboardRecommenderSystemPerformancePage;
