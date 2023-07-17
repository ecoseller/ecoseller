// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import OptionsForm from "@/components/Dashboard/Recommender/OptionsForm";
// mui
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export interface IEASEConfigProps {
  l2Options: number[];
  reviewsMultiplier: number;
}

const EASEConfigForm = ({ l2Options, reviewsMultiplier }: IEASEConfigProps) => {
  return (
    <Stack spacing={2}>
      <OptionsForm title="L2 regularization" options={l2Options} />
      <OptionsForm title="Reviews multiplier" options={[reviewsMultiplier]} />
    </Stack>
  );
};

EASEConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default EASEConfigForm;
