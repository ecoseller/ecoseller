// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import CascadeConfigForm from "@/components/Dashboard/Recommender/Configuration/CascadeConfigForm";
// mui
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import { Card } from "@mui/material";
import { IInfo } from "@/pages/dashboard/recommender-system/configuration";
import { IRecommenderModel } from "@/components/Dashboard/Recommender/Configuration/ListOfModels";

export interface ICascadesProps {
  homepageRetrievalCascade: string[];
  homepageScoringCascade: string[];
  categoryListRetrievalCascade: null;
  categoryListScoringCascade: string[];
  productDetailRetrievalCascade: string[];
  productDetailScoringCascade: string[];
  cartRetrievalCascade: string[];
  cartScoringCascade: string[];
}

export interface ICascadeConfigProps {
  models: IRecommenderModel[];
  info: IInfo;
  cascades: ICascadesProps;
}

const CascadeConfig = ({ models, info, cascades }: ICascadeConfigProps) => {
  const cascadeNames = [
    "homepageRetrievalCascade",
    "homepageScoringCascade",
    "categoryListRetrievalCascade",
    "categoryListScoringCascade",
    "productDetailRetrievalCascade",
    "productDetailScoringCascade",
    "cartRetrievalCascade",
    "cartScoringCascade",
  ];

  const cascadeData = cascadeNames.map((name) => {
    return {
      name,
      title: info[name].title,
      description: info[name].description,
      // @ts-ignore
      cascade: cascades[name],
    };
  });

  const [cascadeDisplayed, setCascadeDisplayed] = useState<string>(
    cascadeNames[0]
  );

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        color: (theme: any) => theme.palette["info"].darker,
        bgcolor: (theme: any) => theme.palette["info"].lighter,
      }}
    >
      <Typography variant="h4">Cascades</Typography>
      <TabContext value={cascadeDisplayed}>
        <Box>
          <TabList
            onChange={(e, value) => {
              setCascadeDisplayed(value);
            }}
          >
            {cascadeData.map((cascade) => (
              <Tab
                key={cascade.name}
                label={cascade.title}
                value={cascade.name}
              />
            ))}
          </TabList>
        </Box>
        {cascadeData.map((cascade) => (
          <TabPanel sx={{ p: 2 }} key={cascade.name} value={cascade.name}>
            <CascadeConfigForm models={models} {...cascade} />
          </TabPanel>
        ))}
      </TabContext>
    </Card>
  );
};

CascadeConfig.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CascadeConfig;
