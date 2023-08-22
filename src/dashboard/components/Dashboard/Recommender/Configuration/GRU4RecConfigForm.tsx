// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
import { IInfo } from "@/pages/dashboard/recommender-system/configuration";
// components
import OptionsForm from "@/components/Dashboard/Recommender/Configuration/OptionsForm";
import Labeled from "@/components/Labeled";
// mui
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";

export interface IGRU4RecConfigEditableProps {
  numEpochsOptions: number[];
  batchSizeOptions: number[];
  embeddingSizeOptions: number[];
  hiddenSizeOptions: number[];
  learningRateOptions: number[];
  incrementalTrainings: number;
  eventsMultiplier: number;
}

export interface IGRU4RecConfigProps extends IGRU4RecConfigEditableProps {
  info: IInfo;
  onChange: (data: IGRU4RecConfigEditableProps) => void;
}

const GRU4RecConfigForm = ({
  numEpochsOptions,
  batchSizeOptions,
  embeddingSizeOptions,
  hiddenSizeOptions,
  learningRateOptions,
  incrementalTrainings,
  eventsMultiplier,
  info,
  onChange,
}: IGRU4RecConfigProps) => {
  const [eventsMultiplierState, setEventsMultiplierState] =
    useState<number>(eventsMultiplier);
  const [incrementalTrainingsState, setIncrementalTrainingsState] =
    useState<number>(incrementalTrainings);

  const handleStateChange = (data: object) => {
    onChange({
      numEpochsOptions,
      batchSizeOptions,
      embeddingSizeOptions,
      hiddenSizeOptions,
      learningRateOptions,
      incrementalTrainings,
      eventsMultiplier,
      ...data,
    });
  };

  return (
    <Stack spacing={2}>
      <OptionsForm
        title={info.numEpochsOptions.title}
        description={info.numEpochsOptions.description}
        options={numEpochsOptions}
      />
      <OptionsForm
        title={info.batchSizeOptions.title}
        description={info.batchSizeOptions.description}
        options={batchSizeOptions}
      />
      <OptionsForm
        title={info.embeddingSizeOptions.title}
        description={info.embeddingSizeOptions.description}
        options={embeddingSizeOptions}
      />
      <OptionsForm
        title={info.hiddenSizeOptions.title}
        description={info.hiddenSizeOptions.description}
        options={hiddenSizeOptions}
      />
      <OptionsForm
        title={info.learningRateOptions.title}
        description={info.learningRateOptions.description}
        options={learningRateOptions}
      />
      <Labeled
        label={info.incrementalTrainings.title}
        description={info.incrementalTrainings.description}
      >
        <Input
          // disabled={!hasPermission}
          type="number"
          value={incrementalTrainingsState}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const value = parseInt(e.target.value);
            setIncrementalTrainingsState(value);
            handleStateChange({ incrementalTrainings: value });
          }}
        />
      </Labeled>
      <Labeled
        label={info.eventsMultiplier.title}
        description={info.eventsMultiplier.description}
      >
        <Input
          // disabled={!hasPermission}
          type="number"
          inputProps={{ step: 0.01 }}
          value={eventsMultiplierState}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const value = parseFloat(e.target.value);
            setEventsMultiplierState(value);
            handleStateChange({ eventsMultiplier: value });
          }}
        />
      </Labeled>
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
