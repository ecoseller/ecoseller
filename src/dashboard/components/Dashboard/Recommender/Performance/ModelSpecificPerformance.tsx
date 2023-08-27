// next.js
// react
import React, { ReactElement, useEffect, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// mui
import Card from "@mui/material/Card";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import Typography from "@mui/material/Typography";
// components
import PerformanceData from "@/components/Dashboard/Recommender/Performance/PerformanceData";
import { IRecommenderModel } from "@/components/Dashboard/Recommender/Configuration/ListOfModels";

export interface IModelSpecificPerformanceProps {
  models: IRecommenderModel[];
}

const ModelSpecificPerformance = ({
  models,
}: IModelSpecificPerformanceProps) => {
  const [modelDisplayed, setModelDisplayed] = useState<string>(models[0].name);

  useEffect(() => {
    setModelDisplayed(models[0].name);
  }, [models]);

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
        Model performance
      </Typography>
      <TabContext value={modelDisplayed}>
        <TabList
          onChange={(e, value) => {
            setModelDisplayed(value);
          }}
        >
          {models.map((model) => (
            <Tab key={model.name} label={model.title} value={model.name} />
          ))}
        </TabList>
        {models.map((model) => (
          <TabPanel sx={{ p: 2 }} key={model.name} value={model.name}>
            <Typography>{model.name}</Typography>
            <PerformanceData />
          </TabPanel>
        ))}
      </TabContext>
    </Card>
  );
};

ModelSpecificPerformance.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default ModelSpecificPerformance;
