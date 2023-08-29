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

export interface IEASEConfigEditableProps {
  l2Options: number[];
  reviewsMultiplier: number;
}

export interface IEASEConfigProps extends IEASEConfigEditableProps {
  info: IInfo;
  onChange: (data: IEASEConfigEditableProps) => void;
}

const EASEConfigForm = ({
  l2Options,
  reviewsMultiplier,
  info,
  onChange,
}: IEASEConfigProps) => {
  const [configState, setConfigState] = useState<IEASEConfigEditableProps>({
    l2Options,
    reviewsMultiplier,
  });

  return (
    <Stack spacing={2}>
      <OptionsForm
        title={info.l2Options.title}
        description={info.l2Options.description}
        options={configState.l2Options}
        onChange={(options) => {
          setConfigState((prevState) => {
            const newState = {
              ...prevState,
              l2Options: options,
            };
            onChange(newState);
            return newState;
          });
        }}
      />
      <Labeled
        label={info.reviewsMultiplier.title}
        description={info.reviewsMultiplier.description}
      >
        <Input
          // disabled={!hasPermission}
          type="number"
          inputProps={{ step: 0.01 }}
          value={configState.reviewsMultiplier}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            setConfigState((prevState) => {
              const newState = {
                ...prevState,
                reviewsMultiplier: parseFloat(e.target.value),
              };
              onChange(newState);
              return newState;
            });
          }}
        />
      </Labeled>
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
