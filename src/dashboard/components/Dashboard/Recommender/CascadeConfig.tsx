// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ModelCascadeItem from "@/components/Dashboard/Recommender/ModelCascadeItem";
// mui
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface ICascadeConfigProps {
  cascade: string[];
}

const CascadeConfig = ({ cascade }: ICascadeConfigProps) => {
  return (
    <Box pl={3} pt={2}>
      <Typography variant="body1">
        {cascade.map((model) => (
          <ModelCascadeItem key={model} title={model} />
        ))}
      </Typography>
    </Box>
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
