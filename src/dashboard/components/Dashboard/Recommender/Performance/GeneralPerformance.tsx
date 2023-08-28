// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// mui
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
// components
import PerformanceData, {
  IPerformanceDataProps,
} from "@/components/Dashboard/Recommender/Performance/PerformanceData";

export interface IGeneralPerformanceProps extends IPerformanceDataProps {}

const GeneralPerformance = ({ k, data }: IGeneralPerformanceProps) => {
  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        color: (theme: any) => theme.palette["info"].darker,
        bgcolor: (theme: any) => theme.palette["info"].lighter,
      }}
    >
      <Typography
        variant={"h4"}
        sx={{ display: "inline", width: "fit-content" }}
      >
        General data
      </Typography>
      <PerformanceData k={k} data={data} />
    </Card>
  );
};

GeneralPerformance.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default GeneralPerformance;
