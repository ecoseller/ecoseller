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
  const [configState, setConfigState] = useState<IGRU4RecConfigEditableProps>({
    numEpochsOptions,
    batchSizeOptions,
    embeddingSizeOptions,
    hiddenSizeOptions,
    learningRateOptions,
    incrementalTrainings,
    eventsMultiplier,
  });

  const handleStateChange = (data: object) => {
    setConfigState((prevState) => {
      const newState = {
        ...prevState,
        ...data,
      };
      onChange(newState);
      return newState;
    });
  };

  return (
    <Stack spacing={2}>
      <OptionsForm
        title={info.numEpochsOptions.title}
        description={info.numEpochsOptions.description}
        options={configState.numEpochsOptions}
        onChange={(options) => {
          handleStateChange({ numEpochsOptions: options });
        }}
      />
      <OptionsForm
        title={info.batchSizeOptions.title}
        description={info.batchSizeOptions.description}
        options={configState.batchSizeOptions}
        onChange={(options) => {
          handleStateChange({ batchSizeOptions: options });
        }}
      />
      <OptionsForm
        title={info.embeddingSizeOptions.title}
        description={info.embeddingSizeOptions.description}
        options={configState.embeddingSizeOptions}
        onChange={(options) => {
          handleStateChange({ embeddingSizeOptions: options });
        }}
      />
      <OptionsForm
        title={info.hiddenSizeOptions.title}
        description={info.hiddenSizeOptions.description}
        options={configState.hiddenSizeOptions}
        onChange={(options) => {
          handleStateChange({ hiddenSizeOptions: options });
        }}
      />
      <OptionsForm
        title={info.learningRateOptions.title}
        description={info.learningRateOptions.description}
        options={configState.learningRateOptions}
        onChange={(options) => {
          handleStateChange({ learningRateOptions: options });
        }}
      />
      <Labeled
        label={info.incrementalTrainings.title}
        description={info.incrementalTrainings.description}
      >
        <Input
          // disabled={!hasPermission}
          type="number"
          value={configState.incrementalTrainings}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const value = parseInt(e.target.value);
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
          value={configState.eventsMultiplier}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const value = parseFloat(e.target.value);
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
