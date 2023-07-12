// next.js
// react
import { useTranslation } from "next-i18next";
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
}

const GRU4RecConfigForm = ({
  numEpochsOptions,
  batchSizeOptions,
  embeddingSizeOptions,
  hiddenSizeOptions,
  learningRateOptions,
}: IGRU4RecConfigProps) => {
  const { t } = useTranslation("recommender");

  return (
    <Stack spacing={2}>
      <OptionsForm title={t("Number of epochs")} options={numEpochsOptions} />
      <OptionsForm title={t("Batch size")} options={batchSizeOptions} />
      <OptionsForm
        title={t("Embedding layer size")}
        options={embeddingSizeOptions}
      />
      <OptionsForm title={t("Hidden layer size")} options={hiddenSizeOptions} />
      <OptionsForm title={t("Learning rate")} options={learningRateOptions} />
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
