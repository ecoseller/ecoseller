// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ModelCascadeItem from "@/components/Dashboard/Recommender/ModelCascadeItem";
// mui
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export interface ICascadeConfigFormProps {
  title: string;
  models: string[];
}

const CascadeConfigForm = ({ title, models }: ICascadeConfigFormProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        {title}
      </Typography>
      <Typography variant="body1">
        {models.map((model) =>
          <ModelCascadeItem key={model} title={model} />
        )}
      </Typography>
    </Stack>
  );
};

CascadeConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CascadeConfigForm;
