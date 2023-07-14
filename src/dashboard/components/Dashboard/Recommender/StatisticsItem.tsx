// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
// mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface IStatisticsItemProps {
  k: number;
  coverage: number;
  directHit: number;
  futureHit: number;
}

const StatisticsItem = ({
  k,
  coverage,
  directHit,
  futureHit,
}: IStatisticsItemProps) => {
  return (
    <Box component="div" pl={3} py={2}>
      <Stack spacing={2}>
        <Typography variant="body1">
          Coverage :{" "}
          {coverage !== null ? (coverage * 100).toFixed(2) + " %" : "unknown"}
        </Typography>
        <Typography variant="body1">
          Direct hit @ {k} :{" "}
          {directHit !== null ? (directHit * 100).toFixed(2) + " %" : "unknown"}
        </Typography>
        <Typography variant="body1">
          Future hit @ {k} :{" "}
          {futureHit !== null ? (futureHit * 100).toFixed(2) + " %" : "unknown"}
        </Typography>
      </Stack>
    </Box>
  );
};

StatisticsItem.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default StatisticsItem;
