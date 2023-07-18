// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import OptionItem from "@/components/Dashboard/Recommender/OptionItem";
// mui
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import OptionsForm from "@/components/Dashboard/Recommender/OptionsForm";

export interface IGRU4RecConfigProps {
  numEpochsOptions: number[];
  batchSizeOptions: number[];
  embeddingSizeOptions: number[];
  hiddenSizeOptions: number[];
  learningRateOptions: number[];
  incrementalTrainings: number;
  eventsMultiplier: number;
}

const GRU4RecConfigForm = ({
  numEpochsOptions,
  batchSizeOptions,
  embeddingSizeOptions,
  hiddenSizeOptions,
  learningRateOptions,
  incrementalTrainings,
  eventsMultiplier,
}: IGRU4RecConfigProps) => {
  return (
    <Stack spacing={2}>
      <OptionsForm title="Number of epochs" options={numEpochsOptions} />
      <OptionsForm title="Batch size" options={batchSizeOptions} />
      <OptionsForm
        title="Embedding layer size"
        options={embeddingSizeOptions}
      />
      <OptionsForm title="Hidden layer size" options={hiddenSizeOptions} />
      <OptionsForm title="Learning rate" options={learningRateOptions} />
      <OptionsForm
        title="Incremental trainings"
        options={[incrementalTrainings]}
      />
      <OptionsForm title="Events multiplier" options={[eventsMultiplier]} />
    </Stack>
  );
};

GRU4RecConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default GRU4RecConfigForm;
