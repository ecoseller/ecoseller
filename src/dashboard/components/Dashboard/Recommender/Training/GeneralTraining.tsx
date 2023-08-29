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
import TrainingData, {
  ITrainingDataProps,
} from "@/components/Dashboard/Recommender/Training/TrainingData";

export interface IGeneralTrainingProps extends ITrainingDataProps {}

const GeneralTraining = ({ data }: IGeneralTrainingProps) => {
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
      <TrainingData data={data} />
    </Card>
  );
};

GeneralTraining.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default GeneralTraining;
