// /dashboard/recommender-system

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import React, { ReactElement, useEffect, useReducer, useState } from "react";
import RootLayout from "@/pages/layout";
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// components
import { NextApiRequest, NextApiResponse } from "next";
import { dashboardStatsAPI } from "@/pages/api/recommender-system/dashboard";
import RecommenderConfigForm, {
  IRecommenderConfigEditableProps,
  IRecommenderConfigProps,
} from "@/components/Dashboard/Recommender/RecommenderConfigForm";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import ModelStatistics, {
  IModelProps,
  IModelPerformanceProps,
} from "@/components/Dashboard/Recommender/ModelStatistics";
import StatisticsItem, {
  IStatisticsItemProps,
} from "@/components/Dashboard/Recommender/StatisticsItem";
import CascadeConfig from "@/components/Dashboard/Recommender/CascadeConfig";
import { ITrainingProps } from "@/components/Dashboard/Recommender/Training";
import EditableContentWrapper from "@/components/Dashboard/Generic/EditableContentWrapper";
import { generalSnackbarError, useSnackbarState } from "@/utils/snackbar";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";

/*
Layout:
  TODO
*/

interface IRecommenderTrainingProps {
  models: ITrainingProps[];
}
const DashboardRecommenderSystemTrainingPage = ({
  models,
}: IRecommenderTrainingProps) => {
  return (
    <DashboardLayout>
      <Typography>{`Training`}</Typography>
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

export default DashboardRecommenderSystemTrainingPage;
