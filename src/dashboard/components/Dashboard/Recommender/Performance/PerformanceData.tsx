// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// components

export interface IPerformanceDataProps {}

const PerformanceData = ({}: IPerformanceDataProps) => {
  return (
    <Stack spacing={2}>
      <Typography>data</Typography>
    </Stack>
  );
};

PerformanceData.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default PerformanceData;
