// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
// mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ITrainingStatisticsProps {
  duration: number;
  peakMemory: number;
  peakMemoryPercentage: number;
  fullTrain: boolean;
  metrics: object;
  hyperparameters: object;
}

export interface ITrainingProps {
  name: string;
  statistics: ITrainingStatisticsProps;
}

const Training = ({ name, statistics }: ITrainingProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        Duration : {statistics.duration.toFixed(2)} s
      </Typography>
      <Typography variant="body1">
        Peak memory : {statistics.peakMemory.toFixed(2)} MB
      </Typography>
      <Typography variant="body1">
        Peak memory percentage : {statistics.peakMemoryPercentage.toFixed(2)} %
      </Typography>
      <Typography variant="body1">
        {statistics.fullTrain ? "Full training" : "Incremental training"}
      </Typography>
      <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
        Metrics :<br />
        <code>{JSON.stringify(statistics.metrics, null, 4)}</code>
      </Typography>
      <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
        Hyperparameters used :<br />
        <code>{JSON.stringify(statistics.hyperparameters, null, 4)}</code>
      </Typography>
    </Stack>
  );
};

Training.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default Training;
